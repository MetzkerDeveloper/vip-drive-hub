import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Vehicle } from '@/types/database';
import { getVehicleImages } from '@/lib/vehicle-images';
import SoldRibbon from '@/components/SoldRibbon';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ArrowLeft, Car, Calendar, ChevronLeft, ChevronRight, Gauge, Images, Send, Loader2 } from 'lucide-react';

const VehicleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const { data: vehicle, isLoading, isError } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('vehicles').select('*').eq('id', id).maybeSingle();
      if (error) throw error;
      return data as Vehicle | null;
    },
    enabled: !!id,
  });
  const vehicleImages = useMemo(() => vehicle ? getVehicleImages(vehicle) : [], [vehicle]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setActiveImageIndex(0);
  }, [id]);

  useEffect(() => {
    if (vehicle) {
      setForm((f) => ({
        ...f,
        message: f.message || `Olá! Tenho interesse no ${vehicle.name} ${vehicle.year}. Podem me passar mais informações?`,
      }));
    }
  }, [vehicle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Preencha os campos obrigatórios.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('contacts').insert([
      {
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        vehicle_interest: vehicle ? `${vehicle.name} ${vehicle.year}` : null,
      },
    ]);
    setLoading(false);
    if (error) {
      toast.error('Erro ao enviar. Tente novamente.');
    } else {
      toast.success('Mensagem enviada com sucesso!');
      setForm({ name: '', email: '', phone: '', message: '' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-[#f2f6fb] py-10 md:py-16">
        <div className="container mx-auto px-4">
          <Link to="/#veiculos" className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:underline mb-6">
            <ArrowLeft className="h-4 w-4" /> Voltar para os veículos
          </Link>

          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Skeleton className="aspect-[4/3] w-full rounded-xl" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          ) : !vehicle || isError ? (
            <div className="text-center py-20">
              <Car className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">Veículo não encontrado.</p>
              <Button asChild className="mt-6"><Link to="/#veiculos">Ver outros veículos</Link></Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="premium-card overflow-hidden">
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                  {vehicle.is_sold && <SoldRibbon />}
                  {vehicleImages[activeImageIndex] ? (
                    <img
                      src={vehicleImages[activeImageIndex]}
                      alt={`${vehicle.name} — foto ${activeImageIndex + 1} de ${vehicleImages.length}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                      <Car className="h-14 w-14 mb-2" />
                      <span className="text-sm font-medium">Foto em breve</span>
                    </div>
                  )}
                  {vehicleImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setActiveImageIndex((current) => (current - 1 + vehicleImages.length) % vehicleImages.length)}
                        className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-primary shadow-lg backdrop-blur-sm transition hover:bg-white"
                        aria-label="Ver foto anterior"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveImageIndex((current) => (current + 1) % vehicleImages.length)}
                        className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-primary shadow-lg backdrop-blur-sm transition hover:bg-white"
                        aria-label="Ver próxima foto"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      <span className="absolute bottom-3 right-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-primary/85 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
                        <Images className="h-3.5 w-3.5" /> {activeImageIndex + 1}/{vehicleImages.length}
                      </span>
                    </>
                  )}
                </div>
                {vehicleImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto p-3" aria-label="Miniaturas das fotos do veículo">
                    {vehicleImages.map((imageUrl, index) => (
                      <button
                        key={imageUrl}
                        type="button"
                        onClick={() => setActiveImageIndex(index)}
                        className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition ${index === activeImageIndex ? 'border-secondary ring-2 ring-secondary/20' : 'border-transparent opacity-70 hover:opacity-100'}`}
                        aria-label={`Ver foto ${index + 1}`}
                        aria-current={index === activeImageIndex ? 'true' : undefined}
                      >
                        <img src={imageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl md:text-5xl font-black tracking-tight text-primary mb-4">{vehicle.name}</h1>
                  <p className="mb-4 text-3xl font-black text-primary">{vehicle.price == null ? "Consulte o valor" : vehicle.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                  {vehicle.is_sold && <p className="mb-3 font-semibold text-destructive">Este veículo já foi vendido.</p>}
                  <div className="flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-3 py-1.5 rounded-full">
                      <Calendar className="h-4 w-4" /> {vehicle.year}
                    </span>
                    <span className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground text-sm font-semibold px-3 py-1.5 rounded-full">
                      <Gauge className="h-4 w-4" /> {vehicle.km.toLocaleString('pt-BR')} km
                    </span>
                  </div>
                </div>

                {vehicle.description && (
                  <div className="premium-card p-6 md:p-8">
                    <h2 className="text-lg font-bold text-card-foreground mb-2">Sobre o veículo</h2>
                    <p className="text-muted-foreground whitespace-pre-line">{vehicle.description}</p>
                  </div>
                )}

                {!vehicle.is_sold && <form onSubmit={handleSubmit} className="premium-card space-y-5 p-6 md:p-8">
                  <h2 className="text-lg font-bold text-card-foreground">Tenho interesse</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-card-foreground mb-1.5 block">Nome *</label>
                      <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Seu nome" maxLength={100} required />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-card-foreground mb-1.5 block">Email *</label>
                      <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="seu@email.com" maxLength={255} required />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-card-foreground mb-1.5 block">Telefone</label>
                    <Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(33) 99999-9999" maxLength={20} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-card-foreground mb-1.5 block">Mensagem *</label>
                    <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} maxLength={1000} required />
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (<><Send className="h-4 w-4" /> Enviar Mensagem</>)}
                  </Button>
                </form>}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VehicleDetail;
