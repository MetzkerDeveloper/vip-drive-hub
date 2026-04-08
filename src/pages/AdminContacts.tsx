import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Contact } from '@/types/database';
import Navbar from '@/components/Navbar';
import { Mail, User, Car, MessageSquare, Calendar } from 'lucide-react';

const AdminContacts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate('/admin/login');
    });
  }, [navigate]);

  const { data: contacts, isLoading } = useQuery({
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
        <h1 className="text-2xl font-bold text-foreground mb-8">Contatos Recebidos</h1>

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
          <p className="text-center text-muted-foreground py-16">Nenhum contato recebido.</p>
        )}
      </div>
    </div>
  );
};

export default AdminContacts;
