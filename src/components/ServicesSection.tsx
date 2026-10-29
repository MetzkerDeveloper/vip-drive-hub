import { ArrowLeftRight, BadgeCheck, Banknote, CarFront } from 'lucide-react';
const services = [
  { icon: CarFront, title: 'Compra', description: 'Encontre seu próximo veículo com atendimento personalizado.' },
  { icon: Banknote, title: 'Venda', description: 'Converse com nossa equipe para avaliar seu veículo.' },
  { icon: ArrowLeftRight, title: 'Troca', description: 'Descubra possibilidades para trocar seu veículo atual.' },
  { icon: BadgeCheck, title: 'Financiamento', description: 'Conheça opções de financiamento com nossa equipe.' },
];
export default function ServicesSection() {
  return (
    <section id="servicos" className="bg-white py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div><span className="section-eyebrow">O QUE FAZEMOS</span><h2 className="mt-4 max-w-2xl text-3xl font-black tracking-tight text-primary md:text-5xl">Seu próximo negócio começa com <span className="text-secondary">boas escolhas.</span></h2></div>
          <p className="max-w-sm text-base leading-relaxed text-muted-foreground">Compra, venda, troca e financiamento. Tudo em um só lugar, com atenção ao que você precisa.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{services.map((service, index) => <div key={service.title} className="premium-card group p-7">
          <div className={`mb-8 flex h-14 w-14 items-center justify-center rounded-2xl ${index === 1 ? 'bg-red-50 text-secondary' : 'bg-sky-50 text-sky-700'} transition-transform group-hover:scale-110`}><service.icon className="h-7 w-7" /></div>
          <h3 className="mb-3 text-xl font-extrabold text-primary">{service.title}</h3><p className="text-sm leading-relaxed text-muted-foreground">{service.description}</p>
        </div>)}</div>
      </div>
    </section>
  );
}