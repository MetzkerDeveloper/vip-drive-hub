import { ArrowUpRight, CalendarDays, Car, Gauge } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Vehicle } from '@/types/database';
import { getVehicleImages } from '@/lib/vehicle-images';
import SoldRibbon from './SoldRibbon';
interface VehicleCardProps { vehicle: Vehicle; linkToDetail?: boolean }
export default function VehicleCard({ vehicle, linkToDetail = false }: VehicleCardProps) {
  const coverImage = getVehicleImages(vehicle)[0];
  const content = <article className="premium-card group h-full overflow-hidden">
    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
      {coverImage ? <img src={coverImage} alt={vehicle.name} loading="lazy" className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${vehicle.is_sold ? 'grayscale-[45%]' : ''}`} />
      : <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400"><Car className="h-12 w-12" /><span className="text-sm">Foto em breve</span></div>}
      {vehicle.is_sold && <SoldRibbon />}
      <span className="absolute right-4 top-4 rounded-full bg-primary/90 px-3 py-1.5 text-xs font-extrabold text-white backdrop-blur-sm">{vehicle.year}</span>
      {!vehicle.is_sold && <span className="absolute bottom-4 left-4 rounded-full border border-white/30 bg-white/90 px-3 py-1 text-xs font-bold text-primary backdrop-blur-sm">Disponível</span>}
    </div>
    <div className="flex flex-col gap-3 p-6">
      <h3 className="truncate text-xl font-extrabold tracking-tight text-primary" title={vehicle.name}>{vehicle.name}</h3>
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground"><span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-secondary" />{vehicle.year}</span><span className="inline-flex items-center gap-1.5"><Gauge className="h-4 w-4 text-secondary" />{vehicle.km.toLocaleString('pt-BR')} km</span></div>
      <div className="text-2xl font-black text-primary">{vehicle.price == null ? 'Consulte o valor' : vehicle.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
      {vehicle.description && <p className="line-clamp-2 min-h-10 text-sm leading-relaxed text-muted-foreground">{vehicle.description}</p>}
      <div className="mt-2 flex items-center justify-between border-t border-border/70 pt-4"><span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{vehicle.is_sold ? 'Veículo vendido' : 'Conheça este veículo'}</span><span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition-colors group-hover:bg-secondary"><ArrowUpRight className="h-5 w-5" /></span></div>
    </div>
  </article>;
  return linkToDetail ? <Link to={`/veiculo/${vehicle.id}`} className="block h-full" aria-label={`Ver detalhes de ${vehicle.name}`}>{content}</Link> : content;
}
