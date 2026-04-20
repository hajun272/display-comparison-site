import { Device, DisplayMetricKey } from "@/types/device";

export const comparisonRows: Array<{
  key: DisplayMetricKey;
  label: string;
  helper: string;
}> = [
  { key: "size", label: "Screen size", helper: "Diagonal panel measurement" },
  { key: "resolution", label: "Resolution", helper: "Native pixel matrix" },
  { key: "ppi", label: "Pixel density", helper: "Sharpness per inch" },
  { key: "brightness", label: "Brightness", helper: "Sustained full-screen nits" },
  { key: "refreshRate", label: "Refresh rate", helper: "Peak ProMotion or panel rate" },
  { key: "panel", label: "Panel type", helper: "Underlying display technology" },
  { key: "colorGamut", label: "Color gamut", helper: "Wide-color coverage" },
  { key: "hdr", label: "HDR support", helper: "High dynamic range playback" }
];

const panelRank: Record<string, number> = {
  lcd: 1,
  ips: 2,
  oled: 4,
  "mini-led": 5,
  microled: 6
};

const gamutRank: Record<string, number> = {
  srgb: 1,
  adobe_rgb: 2,
  p3: 3,
  bt2020: 4
};

export function getDisplayValue(device: Device, key: DisplayMetricKey) {
  return device.display[key];
}

export function formatMetricValue(device: Device, key: DisplayMetricKey) {
  const value = getDisplayValue(device, key);

  switch (key) {
    case "size":
      return `${(value as number).toFixed(1)} in`;
    case "resolution":
      return String(value).replace("x", " x ");
    case "ppi":
      return `${value} PPI`;
    case "brightness":
      return `${value} nits`;
    case "refreshRate":
      return `${value} Hz`;
    case "panel":
    case "colorGamut":
      return String(value);
    case "hdr":
      return value ? "Supported" : "No";
    default:
      return String(value);
  }
}

function getComparableValue(device: Device, key: DisplayMetricKey) {
  const value = getDisplayValue(device, key);

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }

  if (key === "panel") {
    return panelRank[String(value).toLowerCase()] ?? 0;
  }

  if (key === "colorGamut") {
    return gamutRank[String(value).toLowerCase().replace(/\s+/g, "_")] ?? 0;
  }

  return String(value).toLowerCase();
}

export function metricHasDifference(devices: Device[], key: DisplayMetricKey) {
  const normalized = devices.map((device) => String(getComparableValue(device, key)));
  return normalized.some((value) => value !== normalized[0]);
}

export function getMetricLeaderIds(devices: Device[], key: DisplayMetricKey) {
  if (devices.length === 0) {
    return new Set<string>();
  }

  const comparableValues = devices.map((device) => ({
    id: device.id,
    value: getComparableValue(device, key)
  }));

  if (typeof comparableValues[0]?.value === "string") {
    return new Set<string>();
  }

  const bestValue = Math.max(...comparableValues.map((entry) => Number(entry.value)));

  return new Set(
    comparableValues
      .filter((entry) => Number(entry.value) === bestValue)
      .map((entry) => entry.id)
  );
}

export function getBestDisplayPickId(devices: Device[]) {
  if (devices.length === 0) {
    return "";
  }

  const maxPpi = Math.max(...devices.map((device) => device.display.ppi), 1);
  const maxBrightness = Math.max(...devices.map((device) => device.display.brightness), 1);
  const maxRefreshRate = Math.max(...devices.map((device) => device.display.refreshRate), 1);
  const maxPanel = Math.max(
    ...devices.map((device) => panelRank[device.display.panel.toLowerCase()] ?? 0),
    1
  );
  const maxGamut = Math.max(
    ...devices.map(
      (device) =>
        gamutRank[device.display.colorGamut.toLowerCase().replace(/\s+/g, "_")] ?? 0
    ),
    1
  );

  const scored = devices.map((device) => {
    const score =
      (device.display.ppi / maxPpi) * 30 +
      (device.display.brightness / maxBrightness) * 25 +
      (device.display.refreshRate / maxRefreshRate) * 20 +
      ((panelRank[device.display.panel.toLowerCase()] ?? 0) / maxPanel) * 15 +
      ((gamutRank[device.display.colorGamut.toLowerCase().replace(/\s+/g, "_")] ?? 0) /
        maxGamut) *
        5 +
      (device.display.hdr ? 5 : 0);

    return { id: device.id, score };
  });

  scored.sort((left, right) => right.score - left.score);
  return scored[0]?.id ?? "";
}

export function getBestDisplayReasons(device: Device) {
  return [
    `${device.display.ppi} PPI clarity`,
    `${device.display.brightness} nit brightness`,
    `${device.display.refreshRate} Hz motion`,
    `${device.display.panel} panel`
  ];
}
