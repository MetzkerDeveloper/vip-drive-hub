import { Skeleton } from '@/components/ui/skeleton';

const VehicleCardSkeleton = () => {
  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-[var(--shadow-card)] border border-border/50">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
};

export default VehicleCardSkeleton;
