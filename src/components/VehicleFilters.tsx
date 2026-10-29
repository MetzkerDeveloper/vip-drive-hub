import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

export interface VehicleFilterState {
  search: string;
  year: string;
  maxKm: string;
  sort: string;
  availability: string;
}

export const defaultFilters: VehicleFilterState = {
  search: '',
  year: '',
  maxKm: '',
  sort: 'recent',
  availability: 'all',
};

interface Props {
  filters: VehicleFilterState;
  onChange: (f: VehicleFilterState) => void;
  years: number[];
}

const selectClass =
  'h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring';

const VehicleFilters = ({ filters, onChange, years }: Props) => {
  const set = (patch: Partial<VehicleFilterState>) => onChange({ ...filters, ...patch });
  const isDirty =
    filters.search !== '' || filters.year !== '' || filters.maxKm !== '' || filters.sort !== 'recent' || filters.availability !== 'all';

  return (
    <div className="bg-card border border-border/50 rounded-xl p-4 mb-8 shadow-[var(--shadow-card)]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="relative lg:col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(e) => set({ search: e.target.value })}
            placeholder="Buscar por modelo..."
            className="pl-9"
            aria-label="Buscar veículo"
          />
        </div>

        <select
          className={selectClass}
          value={filters.year}
          onChange={(e) => set({ year: e.target.value })}
          aria-label="Filtrar por ano"
        >
          <option value="">Todos os anos</option>
          {years.map((y) => (
            <option key={y} value={String(y)}>{y}</option>
          ))}
        </select>

        <select
          className={selectClass}
          value={filters.maxKm}
          onChange={(e) => set({ maxKm: e.target.value })}
          aria-label="Filtrar por quilometragem"
        >
          <option value="">Qualquer KM</option>
          <option value="10000">Até 10.000 km</option>
          <option value="30000">Até 30.000 km</option>
          <option value="50000">Até 50.000 km</option>
          <option value="100000">Até 100.000 km</option>
        </select>

        <select
          className={selectClass}
          value={filters.availability}
          onChange={(e) => set({ availability: e.target.value })}
          aria-label="Filtrar por disponibilidade"
        >
          <option value="all">Todos os status</option>
          <option value="available">Disponíveis</option>
          <option value="sold">Vendidos</option>
        </select>

        <select
          className={selectClass}
          value={filters.sort}
          onChange={(e) => set({ sort: e.target.value })}
          aria-label="Ordenar"
        >
          <option value="recent">Mais recentes</option>
          <option value="year_desc">Ano: mais novo</option>
          <option value="year_asc">Ano: mais antigo</option>
          <option value="km_asc">Menor KM</option>
          <option value="km_desc">Maior KM</option>
          <option value="name_asc">Nome (A-Z)</option>
        </select>
      </div>

      {isDirty && (
        <div className="mt-3 flex justify-end">
          <Button variant="ghost" size="sm" onClick={() => onChange(defaultFilters)}>
            <X className="h-4 w-4" /> Limpar filtros
          </Button>
        </div>
      )}
    </div>
  );
};

export const applyVehicleFilters = <T extends { name: string; year: number; km: number; description: string | null; created_at: string; is_sold?: boolean }>(
  vehicles: T[],
  filters: VehicleFilterState,
): T[] => {
  const term = filters.search.trim().toLowerCase();
  let list = vehicles.filter((v) => {
    if (term && !`${v.name} ${v.description ?? ''}`.toLowerCase().includes(term)) return false;
    if (filters.year && v.year !== Number(filters.year)) return false;
    if (filters.maxKm && v.km > Number(filters.maxKm)) return false;
    if (filters.availability === 'sold' && !v.is_sold) return false;
    if (filters.availability === 'available' && v.is_sold) return false;
    return true;
  });

  list = [...list].sort((a, b) => {
    if (filters.availability === 'all' && Boolean(a.is_sold) !== Boolean(b.is_sold)) return a.is_sold ? 1 : -1;
    switch (filters.sort) {
      case 'year_desc': return b.year - a.year;
      case 'year_asc': return a.year - b.year;
      case 'km_asc': return a.km - b.km;
      case 'km_desc': return b.km - a.km;
      case 'name_asc': return a.name.localeCompare(b.name, 'pt-BR');
      default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  return list;
};

export default VehicleFilters;
