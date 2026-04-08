import { Car, ArrowLeftRight, Banknote, ShieldCheck } from 'lucide-react';

const services = [
  { icon: Car, title: 'Compra', description: 'Encontre o veículo ideal com as melhores condições.' },
  { icon: Banknote, title: 'Venda', description: 'Avaliamos e compramos seu veículo de forma rápida e segura.' },
  { icon: ArrowLeftRight, title: 'Troca', description: 'Troque seu carro usado por um seminovo com facilidade.' },
  { icon: ShieldCheck, title: 'Financiamento', description: 'Parcelas que cabem no seu bolso com aprovação facilitada.' },
];

const ServicesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
          Nossos Serviços
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Oferecemos soluções completas para você realizar o melhor negócio.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="group bg-card rounded-xl p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 border border-border/50"
            >
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                <service.icon className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">{service.title}</h3>
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
