import { useMemo, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Vehicle } from '@/types/database';
import VehicleCard from './VehicleCard';
import VehicleCardSkeleton from './VehicleCardSkeleton';
import VehicleFilters, { applyVehicleFilters, defaultFilters, type VehicleFilterState } from './VehicleFilters';
import PaginationControls from './PaginationControls';
import { Car } from 'lucide-react';

const PAGE_SIZE = 6;

const VehiclesSection = () => {
  const [filters, setFilters] = useState<VehicleFilterState>(defaultFilters);
  const [page, setPage] = useState(1);

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Vehicle[];
    },
  });

  const years = useMemo(
    () => Array.from(new Set((vehicles ?? []).map((v) => v.year))).sort((a, b) => b - a),
    [vehicles],
  );

  const filtered = useMemo(() => applyVehicleFilters(vehicles ?? [], filters), [vehicles, filters]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <section id="veiculos" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
          Veículos Disponíveis
        </h2>
        <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
          Confira nosso estoque de veículos seminovos e usados com procedência garantida.
        </p>

        <VehicleFilters filters={filters} onChange={setFilters} years={years} />

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <VehicleCardSkeleton key={i} />
            ))}
          </div>
        ) : pageItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pageItems.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} linkToDetail />
              ))}
            </div>
            <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        ) : (
          <div className="text-center py-16">
            <Car className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Nenhum veículo encontrado.</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Tente ajustar os filtros de busca.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default VehiclesSection;
