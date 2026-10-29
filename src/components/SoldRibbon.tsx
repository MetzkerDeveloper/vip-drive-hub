const SoldRibbon = () => (
  <div aria-label="Veículo vendido" className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
    <div className="absolute top-8 -left-12 w-56 -rotate-45 bg-destructive py-2 text-center text-sm font-black tracking-[0.2em] text-destructive-foreground shadow-lg">
      VENDIDO
    </div>
  </div>
);

export default SoldRibbon;
