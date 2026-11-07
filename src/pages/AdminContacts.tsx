import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Contact } from '@/types/database';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Mail, User, Car, MessageSquare, Calendar, Phone, RefreshCw, ArrowLeft } from 'lucide-react';

const AdminContacts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate('/admin/login');
    });
  }, [navigate]);

  const { data: contacts, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['admin-contacts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as Contact[];
    },
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-muted/50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link to="/admin/vehicles" className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:underline"><ArrowLeft className="h-4 w-4" /> Voltar ao painel</Link>
            <h1 className="text-3xl font-black text-primary">Interessados e mensagens</h1>
            <p className="mt-1 text-sm text-muted-foreground">Solicitações recebidas pelos formulários do site, com veículo de interesse e dados de contato.</p>
          </div>
          <Button type="button" variant="outline" disabled={isFetching} onClick={() => void refetch()}>
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl p-6 animate-pulse border border-border/50">
                <div className="h-4 bg-muted rounded w-1/3 mb-3" />
                <div className="h-3 bg-muted rounded w-1/2 mb-2" />
                <div className="h-3 bg-muted rounded w-full" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div role="alert" className="rounded-2xl border border-destructive/20 bg-card p-8 text-center">
            <p className="font-semibold text-destructive">Não foi possível carregar os interessados.</p>
            <p className="mt-2 text-sm text-muted-foreground">{error instanceof Error ? error.message : 'Verifique sua conexão e tente novamente.'}</p>
            <Button className="mt-5" variant="outline" onClick={() => void refetch()}>Tentar novamente</Button>
          </div>
        ) : contacts && contacts.length > 0 ? (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div key={contact.id} className="bg-card rounded-xl p-6 shadow-[var(--shadow-card)] border border-border/50 hover:shadow-[var(--shadow-card-hover)] transition-shadow">
                <div className="flex flex-wrap gap-4 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-secondary" />
                    <span className="font-semibold text-card-foreground">{contact.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 text-secondary" />
                    <span>{contact.email}</span>
                  </div>
                  {contact.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4 text-secondary" />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                  {contact.vehicle_interest && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Car className="h-4 w-4 text-secondary" />
                      <span>{contact.vehicle_interest}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground ml-auto">
                    <Calendar className="h-4 w-4 text-secondary" />
                    <span>{formatDate(contact.created_at)}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                  <p>{contact.message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border/70 bg-card px-6 py-16 text-center">
            <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
            <p className="font-semibold text-primary">Nenhum interessado registrado ainda.</p>
            <p className="mt-2 text-sm text-muted-foreground">Quando alguém enviar o formulário de interesse de um veículo ou a mensagem de contato, o registro aparecerá aqui.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContacts;
