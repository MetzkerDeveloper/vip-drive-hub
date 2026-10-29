import heroImage from '@/assets/hero-showroom.jpg';

const HeroSection = () => {
  return (
    <section className="relative min-h-[560px] md:min-h-[640px] overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Showroom Vip Veículos"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)', opacity: 0.8 }} />
      </div>
      <div className="relative container mx-auto px-4 min-h-[560px] md:min-h-[640px] flex flex-col justify-center py-20">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-primary-foreground mb-5 tracking-tight leading-[1.08]">
          Seu próximo veículo<br />
          <span className="text-gradient-primary">está aqui.</span>
        </h1>
        <p className="text-base md:text-xl text-primary-foreground/85 max-w-lg mb-9 leading-relaxed">
          Compra, venda, troca e financiamento com as melhores condições do mercado.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <a href="#veiculos">
            <button className="inline-flex w-full sm:w-auto items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold h-12 px-8 bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300">
              Ver Veículos
            </button>
          </a>
          <a href="#contato">
            <button className="inline-flex w-full sm:w-auto items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold h-12 px-8 border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 transition-all duration-300">
              Fale Conosco
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
