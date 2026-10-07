'use client';

import { useState } from 'react';
import { signIn }   from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [email,   setEmail]   = useState('');
  const [senha,   setSenha]   = useState('');
  const [erro,    setErro]    = useState('');
  const [loading, setLoading] = useState(false);
  const router                = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password: senha,
        redirect: false,
      });

      if (result?.error) {
        setErro('Email ou senha incorretos.');
        setLoading(false);
      } else {
        // Redirecionamento completo para sincronizar os cookies de sessão com o servidor
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = '/admin';
      }
    } catch (err) {
      setErro('Erro de conexão ao tentar entrar.');
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-[400px] rounded-3xl border border-border bg-card px-10 py-12 text-center shadow-lift">
        <div className="mb-4 flex justify-center text-primary"><Lock size={32} /></div>
        <h1 className="mb-1.5 font-heading text-[26px] font-bold text-foreground">Painel Administrativo</h1>
        <p className="mb-8 text-[13px] text-muted-foreground">Diaconia Territorial São Raimundo Nonato</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-[18px] text-left" noValidate>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              autoComplete="email"
              className="h-12 border-[1.5px] px-3.5 text-[15px] focus-visible:border-primary focus-visible:ring-primary/10 focus-visible:ring-[3px]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
              autoComplete="current-password"
              className="h-12 border-[1.5px] px-3.5 text-[15px] focus-visible:border-primary focus-visible:ring-primary/10 focus-visible:ring-[3px]"
            />
          </div>
          {erro && <p className="text-center text-[13px] font-medium text-primary">{erro}</p>}
          <Button type="submit" variant="brand" size="lg" className="w-full text-[15px] font-bold" disabled={loading}>
            {loading ? 'Entrando…' : 'Entrar'}
          </Button>
        </form>
      </div>
    </main>
  );
}
