import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Vehicle } from '@/types/database';
import { getVehicleImages, moveItem, storagePathFromPublicUrl } from '@/lib/vehicle-images';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  ImagePlus,
  Loader2,
  MessageSquare,
  Pencil,
  Plus,
  Star,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import VehicleCard from '@/components/VehicleCard';
import VehicleCardSkeleton from '@/components/VehicleCardSkeleton';
import VehicleFilters, { applyVehicleFilters, defaultFilters, type VehicleFilterState } from '@/components/VehicleFilters';
import PaginationControls from '@/components/PaginationControls';

const PAGE_SIZE = 6;
const MAX_VEHICLE_PHOTOS = 20;
const MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024;

interface PhotoItem {
  id: string;
  previewUrl: string;
  existingUrl?: string;
  file?: File;
}

const createId = () => globalThis.crypto?.randomUUID?.()
  ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const extensionForFile = (file: File) => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (extension && /^[a-z0-9]{2,5}$/.test(extension)) return extension;
  return file.type.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';
};

const AdminVehicles = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const photoItemsRef = useRef<PhotoItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [form, setForm] = useState({ name: '', year: '', km: '', description: '', price: '', is_sold: false });
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState<VehicleFilterState>(defaultFilters);
  const [page, setPage] = useState(1);

  const updatePhotos = (updater: (current: PhotoItem[]) => PhotoItem[]) => {
    setPhotos((current) => {
      const next = updater(current);
      photoItemsRef.current = next;
      return next;
    });
  };

  const replacePhotos = (next: PhotoItem[]) => {
    updatePhotos((current) => {
      current.forEach((photo) => {
        if (photo.file) URL.revokeObjectURL(photo.previewUrl);
      });
      return next;
    });
  };

  useEffect(() => () => {
    photoItemsRef.current.forEach((photo) => {
      if (photo.file) URL.revokeObjectURL(photo.previewUrl);
    });
  }, []);

  const { data: interestedCount } = useQuery({
    queryKey: ['admin-interested-count'],
    queryFn: async () => {
      const { count, error } = await supabase.from('contacts').select('id', { count: 'exact', head: true });
      if (error) throw error;
      return count ?? 0;
    },
    refetchInterval: 60_000,
  });

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

  const years = useMemo(
    () => Array.from(new Set((vehicles ?? []).map((vehicle) => vehicle.year))).sort((a, b) => b - a),
    [vehicles],
  );
  const filtered = useMemo(() => applyVehicleFilters(vehicles ?? [], filters), [vehicles, filters]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => { setPage(1); }, [filters]);
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const statusMutation = useMutation({
    mutationFn: async ({ id, is_sold }: { id: string; is_sold: boolean }) => {
      const { data, error } = await supabase.from('vehicles').update({ is_sold }).eq('id', id).select('id').single();
      if (error) throw error;
      if (!data) throw new Error('Não foi possível atualizar o status.');
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle', variables.id] });
      toast.success(variables.is_sold ? 'Veículo marcado como vendido!' : 'Veículo disponível novamente!');
    },
    onError: () => toast.error('Erro ao alterar a disponibilidade.'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (vehicle: Vehicle) => {
      const { data, error } = await supabase.from('vehicles').delete().eq('id', vehicle.id).select('id').single();
      if (error) throw error;
      if (!data) throw new Error('Não foi possível excluir o veículo.');

      const paths = Array.from(new Set(
        getVehicleImages(vehicle)
          .map(storagePathFromPublicUrl)
          .filter((path): path is string => Boolean(path)),
      ));
      if (paths.length === 0) return { cleanupFailed: false };

      const { error: cleanupError } = await supabase.storage.from('vehicles').remove(paths);
      return { cleanupFailed: Boolean(cleanupError) };
    },
    onSuccess: ({ cleanupFailed }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      if (cleanupFailed) {
        toast.warning('Veículo excluído, mas algumas fotos não puderam ser removidas do armazenamento.');
      } else {
        toast.success('Veículo excluído!');
      }
    },
    onError: () => toast.error('Erro ao excluir.'),
  });

  const closeForm = () => {
    replacePhotos([]);
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (vehicle: Vehicle) => {
    setEditing(vehicle);
    setForm({
      name: vehicle.name,
      year: String(vehicle.year),
      km: String(vehicle.km),
      description: vehicle.description || '',
      price: vehicle.price == null ? '' : String(vehicle.price),
      is_sold: vehicle.is_sold,
    });
    replacePhotos(getVehicleImages(vehicle).map((url, index) => ({
      id: `${url}-${index}`,
      previewUrl: url,
      existingUrl: url,
    })));
    setShowForm(true);
  };

  const openNew = () => {
    setEditing(null);
    setForm({ name: '', year: '', km: '', description: '', price: '', is_sold: false });
    replacePhotos([]);
    setShowForm(true);
  };

  const addFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    const selected = Array.from(fileList);
    const validImages = selected.filter((file) => file.type.startsWith('image/') && file.size <= MAX_IMAGE_SIZE_BYTES);
    const availableSlots = Math.max(0, MAX_VEHICLE_PHOTOS - photos.length);
    const accepted = validImages.slice(0, availableSlots);

    if (validImages.length !== selected.length) {
      toast.warning('Algumas fotos foram ignoradas. Use imagens de até 15 MB.');
    }
    if (accepted.length < validImages.length) {
      toast.warning(`É possível cadastrar até ${MAX_VEHICLE_PHOTOS} fotos por veículo.`);
    }

    if (accepted.length > 0) {
      updatePhotos((current) => [
        ...current,
        ...accepted.map((file) => ({
          id: createId(),
          previewUrl: URL.createObjectURL(file),
          file,
        })),
      ]);
    }
  };

  const removePhoto = (index: number) => {
    updatePhotos((current) => {
      const removed = current[index];
      if (removed?.file) URL.revokeObjectURL(removed.previewUrl);
      return current.filter((_, photoIndex) => photoIndex !== index);
    });
  };

  const movePhoto = (from: number, to: number) => {
    updatePhotos((current) => moveItem(current, from, to));
  };

  const formatKmInput = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const parsePrice = (raw: string) => Number(raw.trim().replace(/\./g, '').replace(',', '.'));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (form.price.trim() !== '' && (!Number.isFinite(parsePrice(form.price)) || parsePrice(form.price) < 0)) {
      toast.error('Informe um preço válido.');
      return;
    }

    setSaving(true);
    const vehicleId = editing?.id ?? createId();
    const uploadedPaths: string[] = [];

    try {
      const finalUrls: string[] = [];

      for (const photo of photos) {
        if (photo.existingUrl) {
          finalUrls.push(photo.existingUrl);
          continue;
        }
        if (!photo.file) continue;

        const storagePath = `${vehicleId}/${createId()}.${extensionForFile(photo.file)}`;
        const { error: uploadError } = await supabase.storage.from('vehicles').upload(storagePath, photo.file, {
          cacheControl: '3600',
          upsert: false,
        });
        if (uploadError) throw new Error('Não foi possível enviar todas as fotos.');

        uploadedPaths.push(storagePath);
        const { data: publicData } = supabase.storage.from('vehicles').getPublicUrl(storagePath);
        finalUrls.push(publicData.publicUrl);
      }

      const payload = {
        name: form.name.trim(),
        year: Number.parseInt(form.year, 10),
        km: Number.parseInt(form.km.replace(/\D/g, ''), 10),
        description: form.description.trim() || null,
        price: form.price.trim() === '' ? null : parsePrice(form.price),
        image_url: finalUrls[0] ?? null,
        image_urls: finalUrls,
        is_sold: form.is_sold,
      };

      if (editing) {
        const { data, error } = await supabase.from('vehicles').update(payload).eq('id', editing.id).select('id').single();
        if (error) throw error;
        if (!data) throw new Error('Não foi possível atualizar o veículo.');
      } else {
        const { data, error } = await supabase.from('vehicles').insert([{ id: vehicleId, ...payload }]).select('id').single();
        if (error) throw error;
        if (!data) throw new Error('Não foi possível cadastrar o veículo.');
      }

      const removedPaths = editing
        ? getVehicleImages(editing)
          .filter((url) => !finalUrls.includes(url))
          .map(storagePathFromPublicUrl)
          .filter((path): path is string => Boolean(path))
        : [];

      if (removedPaths.length > 0) {
        const { error: cleanupError } = await supabase.storage.from('vehicles').remove(Array.from(new Set(removedPaths)));
        if (cleanupError) toast.warning('Veículo salvo, mas algumas fotos removidas ainda permanecem no armazenamento.');
      }

      toast.success(editing ? 'Veículo atualizado!' : 'Veículo cadastrado!');
      closeForm();
      queryClient.invalidateQueries({ queryKey: ['admin-vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle', vehicleId] });
    } catch (error) {
      if (uploadedPaths.length > 0) await supabase.storage.from('vehicles').remove(uploadedPaths);
      toast.error(error instanceof Error ? error.message : 'Não foi possível salvar o veículo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f6fb]">
      <Navbar />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-primary">Gestão de Veículos</h1>
            <p className="text-sm text-muted-foreground mt-1">Gerencie os anúncios e a disponibilidade do estoque.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="outline" className="gap-2 border-primary/20 bg-white text-primary hover:bg-primary/5">
              <Link to="/admin/contacts">
                <MessageSquare className="h-4 w-4" />
                Interessados {interestedCount !== undefined && <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">{interestedCount}</span>}
              </Link>
            </Button>
            <Button onClick={openNew}><Plus className="h-4 w-4" /> Novo Veículo</Button>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4" role="dialog" aria-modal="true" aria-labelledby="vehicle-form-title">
            <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-border/50 bg-card p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 id="vehicle-form-title" className="text-xl font-bold text-card-foreground">{editing ? 'Editar Veículo' : 'Novo Veículo'}</h2>
                <button type="button" onClick={closeForm} disabled={saving} className="text-muted-foreground hover:text-foreground disabled:opacity-50" aria-label="Fechar formulário">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-card-foreground">Nome/Modelo *</label>
                  <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ex: Honda Civic EXL" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-card-foreground">Ano *</label>
                    <Input type="number" value={form.year} onChange={(event) => setForm({ ...form, year: event.target.value })} placeholder="2024" required />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-card-foreground">KM *</label>
                    <Input value={formatKmInput(form.km)} onChange={(event) => setForm({ ...form, km: event.target.value })} placeholder="50.000" required />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-card-foreground">Valor do veículo (R$)</label>
                  <Input inputMode="decimal" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value.replace(/[^0-9,.]/g, '') })} placeholder="Ex: 89.900,00 (opcional)" />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-card-foreground">Descrição</label>
                  <Textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Detalhes do veículo..." rows={3} />
                </div>

                <section className="space-y-3 rounded-2xl border border-border bg-muted/20 p-4" aria-labelledby="vehicle-photos-title">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 id="vehicle-photos-title" className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
                        <ImagePlus className="h-4 w-4 text-secondary" /> Fotos do veículo
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">A primeira foto é a capa. Use as setas para mudar a ordem.</p>
                    </div>
                    <span className="rounded-full bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground">{photos.length}/{MAX_VEHICLE_PHOTOS}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" size="sm" className="gap-2 bg-background" onClick={() => galleryInputRef.current?.click()}>
                      <Upload className="h-4 w-4" /> Escolher fotos
                    </Button>
                    <input
                      ref={galleryInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(event) => {
                        addFiles(event.target.files);
                        event.target.value = '';
                      }}
                    />
                    <Button type="button" variant="outline" size="sm" className="gap-2 bg-background" onClick={() => cameraInputRef.current?.click()}>
                      <Camera className="h-4 w-4" /> Tirar foto
                    </Button>
                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(event) => {
                        addFiles(event.target.files);
                        event.target.value = '';
                      }}
                    />
                  </div>

                  {photos.length === 0 ? (
                    <button type="button" onClick={() => galleryInputRef.current?.click()} className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-background/70 px-4 py-8 text-muted-foreground transition-colors hover:border-secondary hover:text-secondary">
                      <ImagePlus className="mb-2 h-8 w-8" />
                      <span className="text-sm font-medium">Adicione uma ou mais fotos</span>
                      <span className="mt-1 text-xs">No celular, você também pode abrir a câmera diretamente.</span>
                    </button>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                      {photos.map((photo, index) => (
                        <div key={photo.id} className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
                          <div className="relative aspect-square bg-muted">
                            <img src={photo.previewUrl} alt={index === 0 ? 'Foto principal do veículo' : `Foto ${index + 1} do veículo`} className="h-full w-full object-cover" />
                            {index === 0 && (
                              <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-white shadow">
                                <Star className="h-3 w-3 fill-current" /> CAPA
                              </span>
                            )}
                            <button type="button" onClick={() => removePhoto(index)} className="absolute right-2 top-2 rounded-full bg-destructive p-1.5 text-white shadow hover:bg-destructive/90" aria-label={`Remover foto ${index + 1}`}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <div className="flex items-center justify-center gap-1 p-2">
                            {index > 0 && (
                              <button type="button" onClick={() => movePhoto(index, 0)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-primary" aria-label={`Definir foto ${index + 1} como capa`} title="Definir como capa">
                                <Star className="h-4 w-4" />
                              </button>
                            )}
                            <button type="button" disabled={index === 0} onClick={() => movePhoto(index, index - 1)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-primary disabled:opacity-25" aria-label={`Mover foto ${index + 1} para a esquerda`}>
                              <ArrowLeft className="h-4 w-4" />
                            </button>
                            <button type="button" disabled={index === photos.length - 1} onClick={() => movePhoto(index, index + 1)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-primary disabled:opacity-25" aria-label={`Mover foto ${index + 1} para a direita`}>
                              <ArrowRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border bg-muted/40 px-4 py-3">
                  <span>
                    <span className="block text-sm font-semibold text-card-foreground">Disponibilidade</span>
                    <span className="block text-xs text-muted-foreground">{form.is_sold ? 'Vendido — identificado no catálogo' : 'Disponível para venda'}</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={form.is_sold}
                    onChange={(event) => setForm({ ...form, is_sold: event.target.checked })}
                    className="h-5 w-5 accent-secondary"
                    aria-label="Marcar veículo como vendido"
                  />
                </label>

                <Button type="submit" className="w-full" disabled={saving}>
                  {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Salvando fotos e veículo...</> : editing ? 'Salvar Alterações' : 'Cadastrar Veículo'}
                </Button>
              </form>
            </div>
          </div>
        )}

        <VehicleFilters filters={filters} onChange={setFilters} years={years} priceLimit={Math.max(50000, Math.ceil(Math.max(...(vehicles ?? []).map((vehicle) => vehicle.price ?? 0), 0) / 10000) * 10000)} />

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: PAGE_SIZE }).map((_, index) => <VehicleCardSkeleton key={index} />)}
          </div>
        ) : pageItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((vehicle) => (
                <div key={vehicle.id} className="group relative">
                  <VehicleCard vehicle={vehicle} />
                  <div className="absolute left-3 top-3 z-20 flex gap-2">
                    <button type="button" title="Editar veículo" aria-label="Editar veículo" onClick={() => openEdit(vehicle)} className="rounded-lg border border-border/50 bg-card/90 p-2 text-secondary shadow-md hover:bg-card">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      disabled={statusMutation.isPending}
                      title={vehicle.is_sold ? 'Marcar como disponível' : 'Marcar como vendido'}
                      aria-label={vehicle.is_sold ? 'Marcar como disponível' : 'Marcar como vendido'}
                      onClick={() => statusMutation.mutate({ id: vehicle.id, is_sold: !vehicle.is_sold })}
                      className={`rounded-lg border border-border/50 bg-card/95 p-2 shadow-md hover:bg-card ${vehicle.is_sold ? 'text-destructive' : 'text-emerald-600'} disabled:opacity-50`}
                    >
                      {vehicle.is_sold ? <ToggleLeft className="h-4 w-4" /> : <ToggleRight className="h-4 w-4" />}
                    </button>
                    <button type="button" title="Excluir veículo" aria-label="Excluir veículo" onClick={() => { if (window.confirm('Deseja excluir este veículo e todas as fotos definitivamente?')) deleteMutation.mutate(vehicle); }} className="rounded-lg border border-border/50 bg-card/90 p-2 text-destructive shadow-md hover:bg-card">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        ) : (
          <p className="py-16 text-center text-muted-foreground">Nenhum veículo encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default AdminVehicles;
