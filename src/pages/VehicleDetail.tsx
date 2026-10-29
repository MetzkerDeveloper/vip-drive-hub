import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Vehicle } from '@/types/database';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ArrowLeft, Car, Calendar, Gauge, Send, Loader2 } from 'lucide-react';

const VehicleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    window.scrollTo({ top: 0 });
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
        message: form.message,
        vehicle_interest: vehicle ? `${vehicle.name} ${vehicle.year}` : null,
      },
    ]);
    setLoading(false);
    if (error) {
      toast.error('Erro ao enviar. Tente novamente.');
    } else {
      toast.success('Mensagem enviada com sucesso!');
      setForm({ name: '', email: '', message: '' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/50 py-10">
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
              <div className="bg-card rounded-xl overflow-hidden border border-border/50 shadow-[var(--shadow-card)]">
                <div className="aspect-[4/3] bg-muted">
                  {vehicle.image_url ? (
                    <img src={vehicle.image_url} alt={vehicle.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                      <Car className="h-14 w-14 mb-2" />
                      <span className="text-sm font-medium">Foto em breve</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-3">{vehicle.name}</h1>
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
                  <div className="bg-card p-6 rounded-xl border border-border/50 shadow-[var(--shadow-card)]">
                    <h2 className="text-lg font-bold text-card-foreground mb-2">Sobre o veículo</h2>
                    <p className="text-muted-foreground whitespace-pre-line">{vehicle.description}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-xl border border-border/50 shadow-[var(--shadow-card)]">
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
                    <label className="text-sm font-medium text-card-foreground mb-1.5 block">Mensagem *</label>
                    <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} maxLength={1000} required />
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (<><Send className="h-4 w-4" /> Enviar Mensagem</>)}
                  </Button>
                </form>
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
