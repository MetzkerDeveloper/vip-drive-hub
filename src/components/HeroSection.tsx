import { ArrowRight, BadgeCheck, CarFront, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-showroom.jpg';

const HeroSection = () => (
  <section className="relative isolate min-h-[590px] overflow-hidden bg-primary md:min-h-[690px]">
    <div className="absolute inset-0">
      <img src={heroImage} alt="Veículo em showroom automotivo" className="h-full w-full object-cover object-center" fetchPriority="high" />
      <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)' }} />
    </div>
    <div className="relative container mx-auto flex min-h-[590px] flex-col justify-center px-4 pb-24 pt-20 md:min-h-[690px]">
      <p className="mb-6 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-white/80"><span className="h-1 w-9 rounded-full bg-secondary" /> VIP VEÍCULOS · TEÓFILO OTONI</p>
      <h1 className="max-w-3xl text-4xl font-black leading-[1.07] tracking-tight text-white sm:text-5xl md:text-7xl">
        Seu próximo veículo merece <span className="text-gradient-primary">uma escolha de confiança.</span>
      </h1>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 md:text-xl">Compra, venda, troca e financiamento com atendimento próximo e transparente para você fazer um excelente negócio.</p>
      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <Link to="/#veiculos" className="inline-flex h-13 items-center justify-center gap-3 rounded-xl bg-secondary px-7 py-4 text-sm font-bold text-white shadow-lg shadow-black/20 transition hover:brightness-110">Explorar veículos <ArrowRight className="h-4 w-4" /></Link>
        <Link to="/#contato" className="inline-flex items-center justify-center gap-3 rounded-xl border border-white/35 bg-white/10 px-7 py-4 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20">Falar com a equipe</Link>
      </div>
      <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 text-sm font-medium text-white/85">
        <span className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-sky-300" /> Compra segura</span>
        <span className="flex items-center gap-2"><BadgeCheck className="h-5 w-5 text-sky-300" /> Atendimento próximo</span>
        <span className="flex items-center gap-2"><CarFront className="h-5 w-5 text-sky-300" /> Seu próximo carro está aqui</span>
      </div>
    </div>
    <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-secondary via-sky-400 to-transparent" />
  </section>
);
export default HeroSection;
