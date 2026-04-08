import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Send, Loader2 } from 'lucide-react';

const ContactSection = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    vehicle_interest: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Preencha os campos obrigatórios.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('contacts').insert([form]);
    setLoading(false);
    if (error) {
      toast.error('Erro ao enviar. Tente novamente.');
    } else {
      toast.success('Mensagem enviada com sucesso!');
      setForm({ name: '', email: '', vehicle_interest: '', message: '' });
    }
  };

  return (
    <section id="contato" className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
          Entre em Contato
        </h2>
        <p className="text-muted-foreground text-center mb-12">
          Tem interesse em algum veículo? Envie uma mensagem e retornaremos em breve.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 bg-card p-8 rounded-xl shadow-[var(--shadow-card)] border border-border/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-card-foreground mb-1.5 block">Nome *</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Seu nome"
                maxLength={100}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-card-foreground mb-1.5 block">Email *</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="seu@email.com"
                maxLength={255}
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-card-foreground mb-1.5 block">Veículo de interesse</label>
            <Input
              value={form.vehicle_interest}
              onChange={(e) => setForm({ ...form, vehicle_interest: e.target.value })}
              placeholder="Ex: Honda Civic 2023"
              maxLength={200}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-card-foreground mb-1.5 block">Mensagem *</label>
            <Textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Sua mensagem..."
              rows={4}
              maxLength={1000}
              required
            />
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Send className="h-4 w-4" />
                Enviar Mensagem
              </>
            )}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
