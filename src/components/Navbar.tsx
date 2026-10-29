import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import logo from '@/assets/logo-vip-veiculos.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  const isActive = (path: string) => location.pathname + location.hash === path || (path === '/' && location.pathname === '/' && !location.hash);

  const navLinkClass = (path: string) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive(path)
        ? 'text-secondary'
        : 'text-primary-foreground/80 hover:text-secondary'
    }`;

  useEffect(() => {
    if (location.pathname !== '/' || !location.hash) return;
    const id = decodeURIComponent(location.hash.slice(1));
    const frame = window.requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);

  const goToSection = (id: string) => {
    if (location.pathname === '/' && location.hash === '#' + id) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-primary shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Vip Veículos" className="h-12 w-auto" />
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={navLinkClass('/')}>Home</Link>
            <Link to="/#veiculos" onClick={() => goToSection("veiculos")} className={navLinkClass('/#veiculos')}>Veículos</Link>
            <Link to="/#contato" onClick={() => goToSection("contato")} className={navLinkClass('/#contato')}>Contato</Link>
            {isAdmin && (
              <>
                <Link to="/admin/vehicles" className={navLinkClass('/admin/vehicles')}>Veículos (admin)</Link>
                <Link to="/admin/contacts" className={navLinkClass('/admin/contacts')}>Contatos (admin)</Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-primary-foreground/80 hover:text-secondary">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-primary-foreground" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-3 animate-in slide-in-from-top-2">
            <Link to="/" className="block text-primary-foreground/80 hover:text-secondary py-1" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/#veiculos" className="block text-primary-foreground/80 hover:text-secondary py-1" onClick={() => goToSection("veiculos")}>Veículos</Link>
            <Link to="/#contato" className="block text-primary-foreground/80 hover:text-secondary py-1" onClick={() => goToSection("contato")}>Contato</Link>
            {isAdmin && (
              <>
                <Link to="/admin/vehicles" className="block text-primary-foreground/80 hover:text-secondary py-1" onClick={() => setIsOpen(false)}>Veículos (admin)</Link>
                <Link to="/admin/contacts" className="block text-primary-foreground/80 hover:text-secondary py-1" onClick={() => setIsOpen(false)}>Contatos (admin)</Link>
                <button onClick={handleLogout} className="block text-primary-foreground/80 hover:text-secondary py-1">Sair</button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
