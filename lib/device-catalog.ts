import { Device, DeviceQuery, SortOption } from "@/types/device";

const sorters: Record<SortOption, (left: Device, right: Device) => number> = {
  name: (left, right) => left.name.localeCompare(right.name),
  ppi: (left, right) => right.display.ppi - left.display.ppi,
  brightness: (left, right) => right.display.brightness - left.display.brightness,
  refreshRate: (left, right) => right.display.refreshRate - left.display.refreshRate
};

export function filterDevices(devices: Device[], query: DeviceQuery = {}) {
  const searchTerm = query.search?.trim().toLowerCase();
  const panelFilter = query.panel?.trim().toLowerCase();
  const sortBy = query.sortBy ?? "name";

  const filtered = devices.filter((device) => {
    const matchesSearch =
      !searchTerm ||
      device.name.toLowerCase().includes(searchTerm) ||
      device.brand.toLowerCase().includes(searchTerm) ||
      device.display.panel.toLowerCase().includes(searchTerm);

    const matchesPanel =
      !panelFilter ||
      panelFilter === "all" ||
      device.display.panel.toLowerCase() === panelFilter;

    return matchesSearch && matchesPanel;
  });

  return filtered.sort(sorters[sortBy]);
}
