import { ArrowRight, BadgeCheck, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FinancingSection() {
  return <section id="financiamento" className="bg-[#061b31] py-20 text-white md:py-24">
    <div className="container mx-auto grid items-center gap-10 px-4 lg:grid-cols-2 lg:gap-20">
      <div>
        <p className="mb-4 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-sky-300"><span className="h-1 w-8 rounded-full bg-secondary" /> FINANCIAMENTO</p>
        <h2 className="max-w-xl text-3xl font-black tracking-tight md:text-5xl">Seu próximo carro está <span className="text-sky-300">mais perto.</span></h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">Quer entender as possibilidades de pagamento? Nossa equipe pode orientar você sobre as opções disponíveis. As condições estão sujeitas à análise e aprovação da instituição financeira.</p>
        <Link to="/#contato" className="mt-8 inline-flex items-center gap-3 rounded-xl bg-secondary px-6 py-4 text-sm font-extrabold text-white transition hover:brightness-110">Consultar condições <ArrowRight className="h-4 w-4" /></Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-white/15 bg-white/5 p-7 backdrop-blur-sm"><CreditCard className="mb-6 h-9 w-9 text-sky-300" /><h3 className="text-xl font-bold">Converse com a equipe</h3><p className="mt-3 text-sm leading-relaxed text-white/65">Descubra quais informações são necessárias para avaliar uma proposta.</p></div>
        <div className="rounded-3xl border border-white/15 bg-white/5 p-7 backdrop-blur-sm"><BadgeCheck className="mb-6 h-9 w-9 text-sky-300" /><h3 className="text-xl font-bold">Decida com segurança</h3><p className="mt-3 text-sm leading-relaxed text-white/65">Entenda os próximos passos antes de fechar negócio.</p></div>
      </div>
    </div>
  </section>;
}
