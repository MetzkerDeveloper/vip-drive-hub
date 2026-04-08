import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Vehicle } from '@/types/database';
import VehicleCard from './VehicleCard';
import VehicleCardSkeleton from './VehicleCardSkeleton';
import { Car } from 'lucide-react';

const VehiclesSection = () => {
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

  return (
    <section id="veiculos" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
          Veículos Disponíveis
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Confira nosso estoque de veículos seminovos e usados com procedência garantida.
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <VehicleCardSkeleton key={i} />
            ))}
          </div>
        ) : vehicles && vehicles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Car className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Nenhum veículo disponível no momento.</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Volte em breve para conferir novidades!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default VehiclesSection;
