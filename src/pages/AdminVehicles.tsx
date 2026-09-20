import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Vehicle } from '@/types/database';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, X, Loader2, Upload } from 'lucide-react';
import VehicleCard from '@/components/VehicleCard';
import VehicleCardSkeleton from '@/components/VehicleCardSkeleton';
import VehicleFilters, { applyVehicleFilters, defaultFilters, type VehicleFilterState } from '@/components/VehicleFilters';
import PaginationControls from '@/components/PaginationControls';

const PAGE_SIZE = 6;

const AdminVehicles = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [form, setForm] = useState({ name: '', year: '', km: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState<VehicleFilterState>(defaultFilters);
  const [page, setPage] = useState(1);


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate('/admin/login');
    });
  }, [navigate]);

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ['admin-vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('vehicles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as Vehicle[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('vehicles').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-vehicles'] });
      toast.success('Veículo excluído!');
    },
    onError: () => toast.error('Erro ao excluir.'),
  });

  const openEdit = (v: Vehicle) => {
    setEditing(v);
    setForm({ name: v.name, year: String(v.year), km: String(v.km), description: v.description || '' });
    setImageFile(null);
    setShowForm(true);
  };

  const openNew = () => {
    setEditing(null);
    setForm({ name: '', year: '', km: '', description: '' });
    setImageFile(null);
    setShowForm(true);
  };

  const formatKmInput = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    let image_url = editing?.image_url || null;

    if (imageFile) {
      const ext = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('vehicles').upload(fileName, imageFile);
      if (uploadError) {
        toast.error('Erro no upload da imagem.');
        setSaving(false);
        return;
      }
      const { data: publicData } = supabase.storage.from('vehicles').getPublicUrl(fileName);
      image_url = publicData.publicUrl;
    }

    const payload = {
      name: form.name,
      year: parseInt(form.year),
      km: parseInt(form.km.replace(/\D/g, '')),
      description: form.description || null,
      image_url,
    };

    if (editing) {
      const { error } = await supabase.from('vehicles').update(payload).eq('id', editing.id);
      if (error) { toast.error('Erro ao atualizar.'); setSaving(false); return; }
      toast.success('Veículo atualizado!');
    } else {
      const { error } = await supabase.from('vehicles').insert([payload]);
      if (error) { toast.error('Erro ao cadastrar.'); setSaving(false); return; }
      toast.success('Veículo cadastrado!');
    }

    setSaving(false);
    setShowForm(false);
    queryClient.invalidateQueries({ queryKey: ['admin-vehicles'] });
  };

  return (
    <div className="min-h-screen bg-muted/50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-foreground">Gestão de Veículos</h1>
          <Button onClick={openNew}><Plus className="h-4 w-4" /> Novo Veículo</Button>
        </div>

        {/* Form modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4">
            <div className="bg-card rounded-xl p-6 w-full max-w-lg shadow-xl border border-border/50 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-card-foreground">{editing ? 'Editar Veículo' : 'Novo Veículo'}</h2>
                <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-card-foreground mb-1.5 block">Nome/Modelo *</label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Honda Civic EXL" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-card-foreground mb-1.5 block">Ano *</label>
                    <Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2024" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-card-foreground mb-1.5 block">KM *</label>
                    <Input
                      value={formatKmInput(form.km)}
                      onChange={(e) => setForm({ ...form, km: e.target.value })}
                      placeholder="50.000"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-card-foreground mb-1.5 block">Descrição</label>
                  <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Detalhes do veículo..." rows={3} />
                </div>
                <div>
                  <label className="text-sm font-medium text-card-foreground mb-1.5 block">Imagem</label>
                  <label className="flex items-center gap-2 cursor-pointer border border-input rounded-md px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted transition-colors">
                    <Upload className="h-4 w-4" />
                    {imageFile ? imageFile.name : 'Selecionar imagem'}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                  </label>
                </div>
                <Button type="submit" className="w-full" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editing ? 'Salvar Alterações' : 'Cadastrar Veículo'}
                </Button>
              </form>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <VehicleCardSkeleton key={i} />)}
          </div>
        ) : vehicles && vehicles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((v) => (
              <div key={v.id} className="relative group">
                <VehicleCard vehicle={v} />
                <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(v)} className="bg-card/90 hover:bg-card p-2 rounded-lg shadow-md border border-border/50 text-secondary">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => deleteMutation.mutate(v.id)} className="bg-card/90 hover:bg-card p-2 rounded-lg shadow-md border border-border/50 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-16">Nenhum veículo cadastrado.</p>
        )}
      </div>
    </div>
  );
};

export default AdminVehicles;
