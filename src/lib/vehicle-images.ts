export interface VehicleImageSource {
  image_url?: string | null;
  image_urls?: string[] | null;
}

export const getVehicleImages = (vehicle: VehicleImageSource): string[] => {
  const candidates = [vehicle.image_url, ...(vehicle.image_urls ?? [])];
  return Array.from(new Set(candidates.filter((url): url is string => Boolean(url?.trim()))));
};

export const moveItem = <T>(items: T[], from: number, to: number): T[] => {
  if (from === to || from < 0 || to < 0 || from >= items.length || to >= items.length) return items;
  const reordered = [...items];
  const [item] = reordered.splice(from, 1);
  reordered.splice(to, 0, item);
  return reordered;
};

export const storagePathFromPublicUrl = (url: string): string | null => {
  const marker = '/storage/v1/object/public/vehicles/';
  try {
    const pathname = new URL(url).pathname;
    const markerIndex = pathname.indexOf(marker);
    if (markerIndex === -1) return null;
    const encodedPath = pathname.slice(markerIndex + marker.length);
    return encodedPath ? decodeURIComponent(encodedPath) : null;
  } catch {
    return null;
  }
};
