import { Facebook, Instagram, MapPin, Phone } from 'lucide-react';
import logo from '@/assets/logo-vip-veiculos.png';

const financingPartners = ['Banco Santander', 'Bradesco', 'Itaú', 'BV Financeira', 'Pan'];

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <img src={logo} alt="Vip Veículos" className="h-14 w-auto mb-4" />
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Sua concessionária de confiança. Compra, venda, troca e financiamento com as melhores condições.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <div className="space-y-3 text-sm text-primary-foreground/70">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-secondary flex-shrink-0" />
                <a href="https://www.google.com/maps/search/?api=1&query=Avenida+Alberto+Laender+276+Letra+C+Sao+Diogo+Teofilo+Otoni+MG+39803-008" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">Avenida Alberto Laender, nº 276, Letra C, Bairro São Diogo, Teófilo Otoni - MG, CEP: 39803-008</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-secondary flex-shrink-0" />
                <a href="tel:+553335210184" className="hover:text-secondary transition-colors">(33) 3521-0184</a>
              </div>
            </div>
          </div>

          {/* Financing partners */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Parceiros de Financiamento</h3>
            <div className="flex flex-wrap gap-2">
              {financingPartners.map((partner) => (
                <span key={partner} className="text-xs bg-primary-foreground/10 text-primary-foreground/80 px-3 py-1.5 rounded-full">
                  {partner}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-10 pt-6 text-center text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} Vip Veículos. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
