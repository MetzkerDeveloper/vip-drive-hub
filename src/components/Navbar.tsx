import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, LogOut, Menu, Phone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import logo from '@/assets/logo-vip-veiculos.png';

const links = [
  { label: 'Início', to: '/' },
  { label: 'Veículos', to: '/#veiculos' },
  { label: 'Serviços', to: '/#servicos' },
  { label: 'Contato', to: '/#contato' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const verify = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setIsAdmin(false); return; }
      const { data, error } = await supabase.from('admin_users').select('user_id').maybeSingle();
      setIsAdmin(!error && !!data);
    };
    void verify();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => { void verify(); });
    return () => subscription.unsubscribe();
  }, []);
  useEffect(() => {
    setOpen(false);
    if (location.pathname !== '/' || !location.hash) return;
    const frame = requestAnimationFrame(() => document.getElementById(decodeURIComponent(location.hash.substring(1)))?.scrollIntoView({ behavior: 'smooth' }));
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);
  const navigateTo = (to: string) => {
    setOpen(false);
    if (location.pathname === '/' && (location.pathname + location.hash === to || (to === '/' && !location.hash))) {
      if (to === '/') window.scrollTo({ top: 0, behavior: 'smooth' });
      else document.getElementById(to.substring(2))?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const signOut = async () => { await supabase.auth.signOut(); setOpen(false); setIsAdmin(false); };
  const menu = (mobile = false) => links.map(item => (
    <Link key={item.to} to={item.to} onClick={() => navigateTo(item.to)}
      className={`relative rounded-lg px-3 py-2 text-sm font-semibold transition-colors hover:text-white ${mobile ? 'block text-white/85 hover:bg-white/10' : 'text-white/75'} ${location.pathname + location.hash === item.to ? 'text-white after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-secondary' : ''}`}>
      {item.label}
    </Link>
  ));
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#051b33]/95 text-white shadow-xl shadow-black/10 backdrop-blur-xl">
      <div className="container mx-auto flex min-h-[80px] items-center justify-between gap-4 px-4">
        <Link to="/" onClick={() => navigateTo('/')} className="shrink-0" aria-label="Vip Veículos, início">
          <img src={logo} alt="Vip Veículos" className="h-14 w-auto object-contain" />
        </Link>
        <nav aria-label="Navegação principal" className="hidden items-center gap-1 lg:flex">{menu()}</nav>
        <div className="hidden items-center gap-3 md:flex">
          <a className="hidden items-center gap-2 text-xs font-bold text-white/85 transition hover:text-white xl:flex" href="tel:+553335210184"><Phone className="h-4 w-4 text-sky-300" />(33) 3521-0184</a>
          {isAdmin && <Link to="/admin/vehicles" className="rounded-lg px-3 py-2 text-xs font-bold text-white/85 hover:text-white">Painel</Link>}
          {isAdmin && <Button variant="ghost" size="icon" onClick={signOut} title="Sair" className="text-white hover:bg-white/10 hover:text-white"><LogOut className="h-4 w-4" /></Button>}
          <Link to="/#veiculos" onClick={() => navigateTo('/#veiculos')} className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-secondary/20 transition hover:brightness-110">Ver estoque <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        <button type="button" className="rounded-xl border border-white/20 p-2.5 text-white md:hidden" aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} onClick={() => setOpen(v => !v)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && <nav aria-label="Menu mobile" className="border-t border-white/10 bg-[#051b33] px-4 pb-5 pt-3 md:hidden">
        <div className="container mx-auto space-y-1">{menu(true)}
          <a href="tel:+553335210184" className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm text-white/85"><Phone className="h-4 w-4" />(33) 3521-0184</a>
          {isAdmin && <><Link to="/admin/vehicles" onClick={() => setOpen(false)} className="block px-3 py-2 text-sm">Administrar veículos</Link><Link to="/admin/contacts" onClick={() => setOpen(false)} className="block px-3 py-2 text-sm">Mensagens</Link><button onClick={signOut} className="px-3 py-2 text-sm">Sair</button></>}
        </div>
      </nav>}
    </header>
  );
}
