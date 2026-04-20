export type DisplayMetricKey =
  | "size"
  | "resolution"
  | "ppi"
  | "brightness"
  | "refreshRate"
  | "panel"
  | "colorGamut"
  | "hdr";

export type SortOption = "name" | "ppi" | "brightness" | "refreshRate";

export interface DisplaySpec {
  size: number;
  resolution: string;
  ppi: number;
  brightness: number;
  refreshRate: number;
  panel: string;
  colorGamut: string;
  hdr: boolean;
}

export interface Device {
  id: string;
  brand: string;
  category: string;
  year: number;
  name: string;
  tagline: string;
  priceUSD?: number;
  display: DisplaySpec;
}

export interface DeviceQuery {
  search?: string;
  panel?: string;
  sortBy?: SortOption;
}

