import { Car } from 'lucide-react';
import type { Vehicle } from '@/types/database';

interface VehicleCardProps {
  vehicle: Vehicle;
}

const formatKm = (km: number) => {
  return km.toLocaleString('pt-BR') + ' km';
};

const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  return (
    <div className="group bg-card rounded-xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 border border-border/50">
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {vehicle.image_url ? (
          <img
            src={vehicle.image_url}
            alt={vehicle.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
            <Car className="h-12 w-12 mb-2" />
            <span className="text-sm font-medium">Em breve</span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-primary/90 text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
          {vehicle.year}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-card-foreground mb-1 truncate">{vehicle.name}</h3>
        <p className="text-sm text-secondary font-semibold mb-2">{formatKm(vehicle.km)}</p>
        {vehicle.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{vehicle.description}</p>
        )}
      </div>
    </div>
  );
};

export default VehicleCard;
