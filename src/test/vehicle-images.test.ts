import { describe, expect, it } from 'vitest';
import { getVehicleImages, moveItem, storagePathFromPublicUrl } from '@/lib/vehicle-images';

describe('vehicle image helpers', () => {
  it('keeps the legacy cover first and removes duplicate URLs', () => {
    expect(getVehicleImages({ image_url: 'cover.jpg', image_urls: ['detail.jpg', 'cover.jpg'] }))
      .toEqual(['cover.jpg', 'detail.jpg']);
  });

  it('supports vehicles that only have the legacy image_url', () => {
    expect(getVehicleImages({ image_url: 'legacy.jpg' })).toEqual(['legacy.jpg']);
  });

  it('reorders photos without mutating the original list', () => {
    const original = ['one', 'two', 'three'];
    expect(moveItem(original, 2, 0)).toEqual(['three', 'one', 'two']);
    expect(original).toEqual(['one', 'two', 'three']);
  });

  it('extracts only paths from the vehicles storage bucket', () => {
    expect(storagePathFromPublicUrl('https://project.supabase.co/storage/v1/object/public/vehicles/car%201/photo.jpg?x=1'))
      .toBe('car 1/photo.jpg');
    expect(storagePathFromPublicUrl('https://example.com/photo.jpg')).toBeNull();
  });
});
