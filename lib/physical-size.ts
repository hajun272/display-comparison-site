import { DisplaySpec } from "@/types/device";

const MILLIMETERS_PER_INCH = 25.4;
export const CREDIT_CARD_WIDTH_MM = 85.6;
export const CREDIT_CARD_HEIGHT_MM = 53.98;

export interface ParsedResolution {
  widthPixels: number;
  heightPixels: number;
  aspectRatio: number;
  aspectRatioLabel: string;
}

export interface PhysicalDisplaySize {
  widthInches: number;
  heightInches: number;
  widthMillimeters: number;
  heightMillimeters: number;
  diagonalInches: number;
  diagonalMillimeters: number;
  resolution: ParsedResolution;
}

export interface UserDeviceProfile {
  screenWidthCssPixels: number;
  screenHeightCssPixels: number;
  viewportWidthCssPixels: number;
  viewportHeightCssPixels: number;
  physicalScreenWidthPixels: number;
  physicalScreenHeightPixels: number;
  devicePixelRatio: number;
  estimatedPpi: number;
  cssPixelsPerInch: number;
  screenWidthInches: number;
  screenHeightInches: number;
  screenWidthMillimeters: number;
  screenHeightMillimeters: number;
  maxTouchPoints: number;
  hardwareClass: "phone" | "tablet" | "laptop" | "desktop";
}

export interface CalculatedPhysicalSize extends PhysicalDisplaySize {
  trueWidthCssPixels: number;
  trueHeightCssPixels: number;
  screenFitScale: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function round(value: number, precision = 1) {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function greatestCommonDivisor(left: number, right: number): number {
  let currentLeft = Math.abs(left);
  let currentRight = Math.abs(right);

  while (currentRight !== 0) {
    const remainder = currentLeft % currentRight;
    currentLeft = currentRight;
    currentRight = remainder;
  }

  return currentLeft || 1;
}

export function parseResolution(resolution: string): ParsedResolution {
  const [rawWidth, rawHeight] = resolution.toLowerCase().split("x");
  const widthPixels = Number.parseInt(rawWidth, 10);
  const heightPixels = Number.parseInt(rawHeight, 10);

  if (!Number.isFinite(widthPixels) || !Number.isFinite(heightPixels)) {
    return {
      widthPixels: 16,
      heightPixels: 10,
      aspectRatio: 16 / 10,
      aspectRatioLabel: "16:10"
    };
  }

  const divisor = greatestCommonDivisor(widthPixels, heightPixels);
  const aspectWidth = Math.round(widthPixels / divisor);
  const aspectHeight = Math.round(heightPixels / divisor);

  return {
    widthPixels,
    heightPixels,
    aspectRatio: widthPixels / heightPixels,
    aspectRatioLabel: `${aspectWidth}:${aspectHeight}`
  };
}

export function getDisplayPhysicalSize(display: DisplaySpec): PhysicalDisplaySize {
  const resolution = parseResolution(display.resolution);
  const diagonalUnits = Math.hypot(resolution.widthPixels, resolution.heightPixels);
  const widthInches = display.size * (resolution.widthPixels / diagonalUnits);
  const heightInches = display.size * (resolution.heightPixels / diagonalUnits);

  return {
    widthInches,
    heightInches,
    widthMillimeters: widthInches * MILLIMETERS_PER_INCH,
    heightMillimeters: heightInches * MILLIMETERS_PER_INCH,
    diagonalInches: display.size,
    diagonalMillimeters: display.size * MILLIMETERS_PER_INCH,
    resolution
  };
}

export function estimateUserDevicePpi(input: {
  screenWidthCssPixels: number;
  screenHeightCssPixels: number;
  physicalScreenWidthPixels: number;
  physicalScreenHeightPixels: number;
  devicePixelRatio: number;
  maxTouchPoints: number;
}): number {
  const shortSideCss = Math.min(input.screenWidthCssPixels, input.screenHeightCssPixels);
  const longSideCss = Math.max(input.screenWidthCssPixels, input.screenHeightCssPixels);
  const physicalDiagonalPixels = Math.hypot(
    input.physicalScreenWidthPixels,
    input.physicalScreenHeightPixels
  );
  const isTouch = input.maxTouchPoints > 0;

  if (isTouch && shortSideCss <= 540) {
    const phoneEstimate =
      430 +
      (input.devicePixelRatio - 2) * 28 +
      (physicalDiagonalPixels >= 2500 ? 18 : 0);

    return clamp(round(phoneEstimate, 0), 380, 520);
  }

  if (isTouch) {
    const tabletEstimate = 264 + (input.devicePixelRatio - 1) * 18;
    return clamp(round(tabletEstimate, 0), 220, 320);
  }

  if (input.devicePixelRatio >= 2) {
    if (longSideCss <= 1800) {
      return 220;
    }

    return 160;
  }

  if (input.devicePixelRatio >= 1.5) {
    if (longSideCss <= 1800) {
      return 180;
    }

    return 145;
  }

  if (physicalDiagonalPixels >= 3200 && longSideCss <= 1800) {
    return 140;
  }

  if (longSideCss >= 2200) {
    return 110;
  }

  if (longSideCss >= 1600) {
    return 105;
  }

  return 96;
}

export function detectUserDevice(): UserDeviceProfile | null {
  if (typeof window === "undefined") {
    return null;
  }

  const screenWidthCssPixels = window.screen.width || window.innerWidth;
  const screenHeightCssPixels = window.screen.height || window.innerHeight;
  const viewportWidthCssPixels = window.innerWidth;
  const viewportHeightCssPixels = window.innerHeight;
  const devicePixelRatio = window.devicePixelRatio || 1;
  const physicalScreenWidthPixels = Math.round(screenWidthCssPixels * devicePixelRatio);
  const physicalScreenHeightPixels = Math.round(screenHeightCssPixels * devicePixelRatio);
  const maxTouchPoints = navigator.maxTouchPoints ?? 0;
  const estimatedPpi = estimateUserDevicePpi({
    screenWidthCssPixels,
    screenHeightCssPixels,
    physicalScreenWidthPixels,
    physicalScreenHeightPixels,
    devicePixelRatio,
    maxTouchPoints
  });
  const cssPixelsPerInch = estimatedPpi / devicePixelRatio;
  const screenWidthInches = screenWidthCssPixels / cssPixelsPerInch;
  const screenHeightInches = screenHeightCssPixels / cssPixelsPerInch;

  let hardwareClass: UserDeviceProfile["hardwareClass"] = "desktop";

  if (maxTouchPoints > 0 && Math.min(screenWidthCssPixels, screenHeightCssPixels) <= 540) {
    hardwareClass = "phone";
  } else if (maxTouchPoints > 0) {
    hardwareClass = "tablet";
  } else if (devicePixelRatio >= 1.25 && screenWidthCssPixels <= 1800) {
    hardwareClass = "laptop";
  }

  return {
    screenWidthCssPixels,
    screenHeightCssPixels,
    viewportWidthCssPixels,
    viewportHeightCssPixels,
    physicalScreenWidthPixels,
    physicalScreenHeightPixels,
    devicePixelRatio,
    estimatedPpi,
    cssPixelsPerInch,
    screenWidthInches,
    screenHeightInches,
    screenWidthMillimeters: screenWidthInches * MILLIMETERS_PER_INCH,
    screenHeightMillimeters: screenHeightInches * MILLIMETERS_PER_INCH,
    maxTouchPoints,
    hardwareClass
  };
}

export function calculatePhysicalSize(
  display: DisplaySpec,
  userDevice: UserDeviceProfile
): CalculatedPhysicalSize {
  const physicalDisplay = getDisplayPhysicalSize(display);
  const trueWidthCssPixels = physicalDisplay.widthInches * userDevice.cssPixelsPerInch;
  const trueHeightCssPixels = physicalDisplay.heightInches * userDevice.cssPixelsPerInch;
  const screenFitScale = Math.min(
    1,
    userDevice.screenWidthInches / physicalDisplay.widthInches,
    userDevice.screenHeightInches / physicalDisplay.heightInches
  );

  return {
    ...physicalDisplay,
    trueWidthCssPixels,
    trueHeightCssPixels,
    screenFitScale
  };
}

export function formatDimensionLabel(valueInches: number, valueMillimeters: number) {
  return `${round(valueInches, 1)} in / ${Math.round(valueMillimeters)} mm`;
}

export function calculateReferenceObjectCssSize(
  widthMillimeters: number,
  heightMillimeters: number,
  userDevice: UserDeviceProfile,
  scale = 1
) {
  const widthInches = widthMillimeters / MILLIMETERS_PER_INCH;
  const heightInches = heightMillimeters / MILLIMETERS_PER_INCH;

  return {
    widthCssPixels: widthInches * userDevice.cssPixelsPerInch * scale,
    heightCssPixels: heightInches * userDevice.cssPixelsPerInch * scale,
    widthInches,
    heightInches
  };
}
