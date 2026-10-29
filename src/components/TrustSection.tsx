import { ArrowRight, HeartHandshake, MapPin, MessageSquareText } from 'lucide-react';
import { Link } from 'react-router-dom';

const values = [
  { icon: HeartHandshake, title: 'Atendimento de perto', text: 'Nossa equipe está pronta para ouvir o que você procura.' },
  { icon: MessageSquareText, title: 'Conversa transparente', text: 'Tire suas dúvidas sobre o veículo antes de decidir.' },
  { icon: MapPin, title: 'Estamos na sua cidade', text: 'Visite nossa loja em Teófilo Otoni, Minas Gerais.' },
];
export default function TrustSection() {
  return <section className="border-y border-border/60 bg-[#f2f6fb] py-20 md:py-24">
    <div className="container mx-auto px-4">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <span className="section-eyebrow">POR QUE A VIP?</span>
        <h2 className="mt-4 text-3xl font-black tracking-tight text-primary md:text-5xl">Mais do que veículos. <span className="text-secondary">Uma boa experiência.</span></h2>
        <p className="mt-5 text-muted-foreground">Estamos aqui para ajudar você a encontrar uma opção que combine com seus planos.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-3">{values.map(v=><div key={v.title} className="premium-card px-7 py-9">
        <v.icon className="mb-5 h-9 w-9 text-secondary" /><h3 className="text-xl font-extrabold text-primary">{v.title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
      </div>)}</div>
      <div className="mt-10 text-center"><Link className="inline-flex items-center gap-2 text-sm font-extrabold text-primary hover:text-secondary" to="/#contato">Entre em contato com a equipe <ArrowRight className="h-4 w-4" /></Link></div>
    </div>
  </section>;
}
