import { describe, expect, it } from 'vitest';
import { applyVehicleFilters, defaultFilters } from '@/components/VehicleFilters';

const vehicles = [
  { id: 'sold', name: 'Honda Civic', year: 2024, km: 21000, description: null, created_at: '2026-10-29T10:00:00Z', is_sold: true },
  { id: 'available', name: 'Toyota Corolla', year: 2023, km: 17000, description: null, created_at: '2026-10-28T10:00:00Z', is_sold: false },
];

describe('vehicle availability filters', () => {
  it('lists available vehicles before sold ones by default', () => {
    expect(applyVehicleFilters(vehicles, defaultFilters).map((v) => v.id)).toEqual(['available', 'sold']);
  });

  it('shows only available vehicles', () => {
    expect(applyVehicleFilters(vehicles, { ...defaultFilters, availability: 'available' }).map((v) => v.id)).toEqual(['available']);
  });

  it('shows only sold vehicles', () => {
    expect(applyVehicleFilters(vehicles, { ...defaultFilters, availability: 'sold' }).map((v) => v.id)).toEqual(['sold']);
  });

  it('combines availability and text search', () => {
    expect(applyVehicleFilters(vehicles, { ...defaultFilters, availability: 'available', search: 'Civic' })).toEqual([]);
  });
});
