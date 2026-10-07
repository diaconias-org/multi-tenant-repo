'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Tag,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Save,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogTitle } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import AdminHeader from '@/components/admin/AdminHeader';
import { AdminPage, AdminMain } from '@/components/admin/AdminLayout';

const iconBtn = 'inline-flex cursor-pointer rounded p-1.5 transition-colors hover:bg-secondary';
const fieldClass = 'h-auto rounded-md border-[1.5px] border-input px-3 py-2 text-sm';

export default function CategoriasAdminClient({
  inicialCategorias = [],
  usuarioNome,
  usuarioEmail,
}) {
  const router = useRouter();
  const [categorias, setCategorias] = useState(inicialCategorias);
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [nome, setNome] = useState('');
  const [slug, setSlug] = useState('');
  const [descricao, setDescricao] = useState('');
  const [ativo, setAtivo] = useState(true);

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  function abrirModalCriacao() {
    setEditandoId(null);
    setNome('');
    setSlug('');
    setDescricao('');
    setAtivo(true);
    setErro('');
    setModalAberto(true);
  }

  function abrirModalEdicao(cat) {
    setEditandoId(cat.id);
    setNome(cat.nome);
    setSlug(cat.slug);
    setDescricao(cat.descricao || '');
    setAtivo(cat.ativo);
    setErro('');
    setModalAberto(true);
  }

  async function handleSalvar(e) {
    e.preventDefault();
    setErro('');

    if (!nome.trim()) {
      setErro('O nome da categoria é obrigatório.');
      return;
    }

    try {
      setSalvando(true);
      const url = editandoId ? `/api/noticias/categorias/${editandoId}` : '/api/noticias/categorias';
      const method = editandoId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, slug, descricao, ativo }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.erro || 'Erro ao salvar categoria.');
      }

      setModalAberto(false);
      router.refresh();
      if (editandoId) {
        setCategorias((prev) => prev.map((c) => (c.id === editandoId ? { ...c, ...data } : c)));
      } else {
        setCategorias((prev) => [...prev, data]);
      }
    } catch (err) {
      setErro(err.message || 'Erro inesperado.');
    } finally {
      setSalvando(false);
    }
  }

  async function handleAlternarStatus(id) {
    try {
      const res = await fetch(`/api/noticias/categorias/${id}`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Erro ao alternar status.');
      const data = await res.json();
      setCategorias((prev) => prev.map((c) => (c.id === id ? { ...c, ativo: data.ativo } : c)));
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleExcluir(id) {
    try {
      setSalvando(true);
      const res = await fetch(`/api/noticias/categorias/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.erro || 'Erro ao excluir.');
      }
      setConfirmDelete(null);
      setCategorias((prev) => prev.filter((c) => c.id !== id));
      router.refresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <AdminPage>
      <AdminHeader usuarioNome={usuarioNome} usuarioEmail={usuarioEmail} />

      <AdminMain>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="m-0 font-heading text-2xl font-bold text-primary">
              Categorias de Notícias
            </h2>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Organize os artigos em editoriais (ex: Liturgia, Avisos, Pastorais, Eventos).
            </p>
          </div>
          <Button type="button" onClick={abrirModalCriacao} className="px-5 shadow-soft">
            <Plus size={16} /> Nova Categoria
          </Button>
        </div>

        {/* Tabela de Categorias */}
        <Table>
          <TableHeader>
            <TableRow className="border-0 hover:bg-transparent">
              <TableHead>Nome</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Notícias</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categorias.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="px-5 py-10 text-center text-muted-foreground">
                  Nenhuma categoria cadastrada até o momento.
                </TableCell>
              </TableRow>
            ) : (
              categorias.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>
                    <strong className="text-foreground">{cat.nome}</strong>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                      {cat.slug}
                    </code>
                  </TableCell>
                  <TableCell className="max-w-[280px] text-[13px] text-muted-foreground">
                    {cat.descricao || '—'}
                  </TableCell>
                  <TableCell className="text-[13px] font-semibold">
                    {cat._count?.noticias || 0}
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => handleAlternarStatus(cat.id)}
                      className="cursor-pointer p-0"
                      title="Clique para alternar status"
                    >
                      {cat.ativo ? (
                        <Badge variant="success">Ativo</Badge>
                      ) : (
                        <Badge variant="secondary">Inativo</Badge>
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => abrirModalEdicao(cat)}
                        title="Editar Categoria"
                        className={cn(iconBtn, 'text-primary')}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(cat)}
                        title="Excluir Categoria"
                        className={cn(iconBtn, 'text-red-500')}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </AdminMain>

      {/* Modal de Criação / Edição de Categoria */}
      {modalAberto && (
        <Dialog overlayClassName="bg-black/50 p-4 backdrop-blur-none" className="max-w-[480px] rounded-md p-0">
          <form onSubmit={handleSalvar} className="p-6">
            <DialogTitle className="mb-4">
              {editandoId ? 'Editar Categoria' : 'Nova Categoria'}
            </DialogTitle>

            {erro && (
              <div className="mb-3.5 rounded-md bg-red-100 px-3 py-2 text-[13px] text-red-700">
                {erro}
              </div>
            )}

            <div className="mb-3.5">
              <Label className="mb-1 block text-xs text-muted-foreground">
                Nome da Categoria *
              </Label>
              <Input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Pastorais"
                className={fieldClass}
                required
              />
            </div>

            <div className="mb-3.5">
              <Label className="mb-1 block text-xs text-muted-foreground">
                Slug (Opcional - gerado automaticamente)
              </Label>
              <Input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="Ex: pastorais"
                className={fieldClass}
              />
            </div>

            <div className="mb-4">
              <Label className="mb-1 block text-xs text-muted-foreground">
                Descrição (Opcional)
              </Label>
              <Textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Breve descrição da categoria..."
                rows={3}
                className="resize-y rounded-md border-[1.5px] border-input px-3 py-2 text-[13px]"
              />
            </div>

            <div className="mb-6 flex items-center gap-2.5">
              <input
                type="checkbox"
                id="cat-ativo"
                checked={ativo}
                onChange={(e) => setAtivo(e.target.checked)}
                className="size-4 cursor-pointer accent-primary"
              />
              <Label htmlFor="cat-ativo" className="cursor-pointer text-[13px] text-foreground">
                Categoria Ativa
              </Label>
            </div>

            <div className="flex justify-end gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalAberto(false)}
                disabled={salvando}
                className="h-auto rounded-md border-gray-300 px-4 py-2 text-[13px]"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={salvando} className="h-auto rounded-md px-[18px] py-2 text-[13px]">
                {salvando ? 'Salvando…' : 'Salvar Categoria'}
              </Button>
            </div>
          </form>
        </Dialog>
      )}

      {/* Modal de Exclusão de Categoria */}
      {confirmDelete && (
        <Dialog
          onClose={() => setConfirmDelete(null)}
          overlayClassName="bg-black/50 p-4 backdrop-blur-none"
          className="max-w-[420px] rounded-md p-6"
        >
          <div className="mb-3 flex items-center gap-3">
            <div className="flex size-[38px] items-center justify-center rounded-full bg-red-100 text-red-500">
              <AlertTriangle size={20} />
            </div>
            <DialogTitle className="m-0 text-[17px]">Excluir Categoria</DialogTitle>
          </div>
          <p className="mb-4 text-[13px] text-foreground">
            Tem certeza que deseja excluir a categoria <strong>{confirmDelete.nome}</strong>?
            As notícias vinculadas permanecerão salvas, porém sem categoria.
          </p>
          <div className="flex justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmDelete(null)}
              disabled={salvando}
              className="h-auto rounded-md border-gray-300 px-3.5 py-2 text-[13px]"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => handleExcluir(confirmDelete.id)}
              disabled={salvando}
              className="h-auto rounded-md bg-red-600 px-4 py-2 text-[13px] hover:bg-red-700"
            >
              {salvando ? 'Excluindo…' : 'Excluir'}
            </Button>
          </div>
        </Dialog>
      )}
    </AdminPage>
  );
}
