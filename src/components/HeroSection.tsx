import heroImage from '@/assets/hero-showroom.jpg';

const HeroSection = () => {
  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Showroom Vip Veículos"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)', opacity: 0.8 }} />
      </div>
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
        <h1 className="text-4xl md:text-6xl font-black text-primary-foreground mb-4 tracking-tight">
          Seu próximo veículo<br />
          <span className="text-gradient-primary">está aqui.</span>
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/80 max-w-lg mb-8">
          Compra, venda, troca e financiamento com as melhores condições do mercado.
        </p>
        <div className="flex gap-4">
          <a href="#veiculos">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-11 px-8 bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300">
              Ver Veículos
            </button>
          </a>
          <a href="#contato">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-11 px-8 border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 transition-all duration-300">
              Fale Conosco
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
