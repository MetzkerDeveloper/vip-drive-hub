import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, Lock } from 'lucide-react';
import logo from '@/assets/logo-vip-veiculos.png';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error('Email ou senha inválidos.');
    } else {
      toast.success('Login realizado com sucesso!');
      navigate('/admin/vehicles');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logo} alt="Vip Veículos" className="h-16 w-auto mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground">Área Administrativa</h1>
          <p className="text-muted-foreground text-sm mt-1">Acesse com suas credenciais</p>
        </div>
        <form onSubmit={handleLogin} className="bg-card p-8 rounded-xl shadow-[var(--shadow-card)] border border-border/50 space-y-5">
          <div>
            <label className="text-sm font-medium text-card-foreground mb-1.5 block">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@vipveiculos.com" required />
          </div>
          <div>
            <label className="text-sm font-medium text-card-foreground mb-1.5 block">Senha</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Lock className="h-4 w-4" /> Entrar</>}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
