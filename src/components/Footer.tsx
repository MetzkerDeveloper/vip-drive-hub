import { ArrowUpRight, Instagram, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '@/assets/logo-vip-veiculos.png';

const address = 'Avenida Alberto Laender, nº 276, Letra C, Bairro São Diogo, Teófilo Otoni - MG, CEP: 39803-008';
const mapUrl = 'https://www.google.com/maps/search/?api=1&query=Avenida+Alberto+Laender+276+Letra+C+Sao+Diogo+Teofilo+Otoni+MG+39803-008';

export default function Footer() {
  return <footer className="bg-[#061b31] text-white">
    <div className="container mx-auto px-4 pb-10 pt-16 md:pt-20">
      <div className="mb-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="mb-6 inline-flex items-center rounded-2xl border border-white/15 bg-white/10 px-5 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
            <img src={logo} alt="Vip Veículos" className="h-20 w-auto max-w-[220px] object-contain drop-shadow-[0_4px_10px_rgba(255,255,255,0.35)]" />
          </div>
          <p className="max-w-md text-sm leading-7 text-white/65">Sua próxima conquista começa aqui. Compra, venda, troca e financiamento de veículos em Teófilo Otoni, Minas Gerais.</p>
          <a href="tel:+553335210184" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-bold text-white transition hover:brightness-110"><Phone className="h-4 w-4" /> Falar com a loja <ArrowUpRight className="h-4 w-4" /></a>
        </div>
        <div><h3 className="mb-5 text-sm font-extrabold uppercase tracking-wider">Explore</h3>
          <nav className="flex flex-col gap-3 text-sm text-white/65">
            <Link to="/" className="hover:text-white">Início</Link>
            <Link to="/#veiculos" className="hover:text-white">Nosso estoque</Link>
            <Link to="/#servicos" className="hover:text-white">Serviços</Link>
            <Link to="/#financiamento" className="hover:text-white">Financiamento</Link>
            <Link to="/#contato" className="hover:text-white">Contato</Link>
          </nav>
        </div>
        <div><h3 className="mb-5 text-sm font-extrabold uppercase tracking-wider">Visite a VIP</h3>
          <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="mb-5 flex items-start gap-3 text-sm leading-6 text-white/65 hover:text-white"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />{address}</a>
          <a href="tel:+553335210184" className="flex items-center gap-3 text-sm text-white/75 hover:text-white"><Phone className="h-5 w-5 text-secondary" />(33) 3521-0184</a>
        </div>
      </div>
      <div className="flex flex-col justify-between gap-4 border-t border-white/10 pt-7 text-xs text-white/45 sm:flex-row">
        <p>© {new Date().getFullYear()} Vip Veículos. Todos os direitos reservados.</p>
        <p>Teófilo Otoni · MG</p>
      </div>
    </div>
  </footer>;
}
