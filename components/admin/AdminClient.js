'use client';

import { useState }    from 'react';
import { signOut }     from 'next-auth/react';
import { useRouter }   from 'next/navigation';
import Link            from 'next/link';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Badge }        from '@/components/ui/badge';
import { Button }       from '@/components/ui/button';
import { Input }        from '@/components/ui/input';
import { Dialog, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import AdminHeader     from '@/components/admin/AdminHeader';
import { AdminPage, AdminMain } from '@/components/admin/AdminLayout';

export default function AdminClient({ comprovantes, usuarioNome, usuarioEmail }) {
  const [busca, setBusca]         = useState('');
  const [saindo, setSaindo]       = useState(false);
  const [fotoModal, setFotoModal] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const router = useRouter();

  const filtrados = comprovantes.filter(c =>
    c.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  async function handleLogout() {
    setSaindo(true);
    await signOut({ callbackUrl: '/login' });
  }

  async function alterarStatus(id, novoStatus) {
    try {
      const res = await fetch(`/api/comprovantes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: novoStatus })
      });
      if (res.ok) {
        setConfirmDialog(null);
        router.refresh(); // atualiza a prop comprovantes do server
      } else {
        alert('Erro ao atualizar status.');
      }
    } catch (err) {
      alert('Erro de conexão.');
    }
  }

  return (
    <AdminPage>
      <AdminHeader usuarioNome={usuarioNome} usuarioEmail={usuarioEmail} />


      <AdminMain>
        {/* BUSCA */}
        <div className="mb-[18px]">
          <Input
            type="search"
            placeholder="🔍  Buscar por nome…"
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="h-auto max-w-[380px] border-[1.5px] border-input px-4 py-[11px] text-sm focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/10"
          />
        </div>

        {/* TABELA */}
        {filtrados.length === 0 ? (
          <div className="rounded-md border border-border bg-card p-10 text-center text-sm text-muted-foreground shadow-soft">
            Nenhum registro encontrado.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-0 hover:bg-transparent">
                <TableHead>#</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Data do registro</TableHead>
                <TableHead>Comprovante</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtrados.map((c, i) => (
                <TableRow key={c.id}>
                  <TableCell className="text-[13px] text-muted-foreground">{filtrados.length - i}</TableCell>
                  <TableCell className="font-semibold">{c.nome}</TableCell>
                  <TableCell>{c.telefone || '—'}</TableCell>
                  <TableCell>{c.criado_em}</TableCell>
                  <TableCell>
                    {c.foto_url ? (
                      <Button
                        size="sm"
                        className="h-auto rounded-md px-3 py-[5px] text-[12.5px] hover:-translate-y-px"
                        onClick={() => setFotoModal(c.foto_url)}
                      >
                        Ver foto
                      </Button>
                    ) : (
                      <span className="text-[12.5px] text-muted-foreground">Não enviado</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {c.status === 'valido' && <Badge variant="success"><CheckCircle2 size={13}/> Válido</Badge>}
                    {c.status === 'invalido' && <Badge variant="danger"><XCircle size={13}/> Inválido</Badge>}
                    {(!c.status || c.status === 'pendente') && <Badge variant="warning"><Clock size={13}/> Pendente</Badge>}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-green-600 transition-all duration-250 hover:-translate-y-px hover:bg-green-600 hover:text-white"
                        title="Marcar como Válido"
                        onClick={() => setConfirmDialog({ id: c.id, nome: c.nome, action: 'valido' })}
                      >
                        <CheckCircle2 size={16} />
                      </button>
                      <button
                        className="flex size-8 items-center justify-center rounded-lg bg-red-50 text-primary transition-all duration-250 hover:-translate-y-px hover:bg-primary hover:text-white"
                        title="Marcar como Inválido"
                        onClick={() => setConfirmDialog({ id: c.id, nome: c.nome, action: 'invalido' })}
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </AdminMain>

      {/* MODAL DE FOTO */}
      {fotoModal && (
        <Dialog onClose={() => setFotoModal(null)} className="max-w-[600px] p-5">
          <button
            className="absolute right-3.5 top-3.5 flex size-8 items-center justify-center rounded-full bg-secondary text-base transition-all duration-250 hover:bg-border"
            onClick={() => setFotoModal(null)}
          >✕</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={fotoModal} alt="Comprovante" className="max-h-[70vh] w-full rounded-xl object-contain" />
          <a
            href={fotoModal}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3.5 block rounded-md border-[1.5px] border-primary p-2.5 text-center text-[13.5px] font-semibold text-primary transition-all duration-250 hover:bg-primary hover:text-primary-foreground"
          >
            ⬇ Abrir em nova aba
          </a>
        </Dialog>
      )}

      {/* MODAL DE CONFIRMACAO */}
      {confirmDialog && (
        <Dialog onClose={() => setConfirmDialog(null)} className="max-w-[440px] p-6 text-center">
          <DialogTitle className="mb-3">Confirmar Ação</DialogTitle>
          <DialogDescription className="mb-6">
            Tem certeza que deseja marcar o comprovante de <strong>{confirmDialog.nome}</strong> como{' '}
            <strong className={confirmDialog.action === 'valido' ? 'text-green-600' : 'text-primary'}>
              {confirmDialog.action === 'valido' ? 'VÁLIDO' : 'INVÁLIDO'}
            </strong>?
          </DialogDescription>
          <div className="flex justify-center gap-3">
            <Button variant="secondary" className="border border-input px-5 py-2.5 text-soft" onClick={() => setConfirmDialog(null)}>Cancelar</Button>
            <Button
              variant={confirmDialog.action === 'valido' ? 'default' : 'destructive'}
              className={confirmDialog.action === 'valido'
                ? 'bg-green-600 px-5 text-white hover:bg-green-700'
                : 'bg-primary px-5 text-primary-foreground hover:bg-primary-dark'}
              onClick={() => alterarStatus(confirmDialog.id, confirmDialog.action)}
            >
              Confirmar
            </Button>
          </div>
        </Dialog>
      )}
    </AdminPage>
  );
}
