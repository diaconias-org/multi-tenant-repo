'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Copy,
  Globe,
  EyeOff,
  Star,
  Calendar,
  AlertTriangle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Dialog, DialogTitle } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import AdminHeader from '@/components/admin/AdminHeader';
import { AdminPage, AdminMain } from '@/components/admin/AdminLayout';

const iconBtn = 'inline-flex cursor-pointer rounded p-1.5 transition-colors hover:bg-secondary';

export default function NoticiasAdminClient({
  inicialNoticias = [],
  paginacao = {},
  categorias = [],
  usuarioNome,
  usuarioEmail,
}) {
  const router = useRouter();
  const [noticias, setNoticias] = useState(inicialNoticias);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [confirmModal, setConfirmModal] = useState(null); // { tipo, id, titulo, acao }
  const [processando, setProcessando] = useState(false);

  // Filtragem local / pesquisa
  const noticiasFiltradas = noticias.filter((n) => {
    const matchBusca =
      !busca.trim() ||
      n.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      n.resumo?.toLowerCase().includes(busca.toLowerCase());

    const matchStatus = !filtroStatus || n.status === filtroStatus;
    const matchCategoria = !filtroCategoria || String(n.categoria_id) === String(filtroCategoria);

    return matchBusca && matchStatus && matchCategoria;
  });

  async function handleAcao(tipo, id) {
    try {
      setProcessando(true);
      let url = '';
      let method = 'PATCH';

      if (tipo === 'publicar') url = `/api/noticias/${id}/publicar`;
      if (tipo === 'despublicar') url = `/api/noticias/${id}/despublicar`;
      if (tipo === 'duplicar') {
        url = `/api/noticias/${id}/duplicar`;
        method = 'POST';
      }
      if (tipo === 'excluir') {
        url = `/api/noticias/${id}`;
        method = 'DELETE';
      }

      const res = await fetch(url, { method });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.erro || 'Falha ao executar ação.');
      }

      setConfirmModal(null);
      router.refresh();
      // Atualização rápida de estado
      if (tipo === 'excluir') {
        setNoticias((prev) => prev.filter((n) => n.id !== id));
      } else if (tipo === 'publicar') {
        setNoticias((prev) =>
          prev.map((n) => (n.id === id ? { ...n, status: 'publicada', publicado_em: new Date() } : n))
        );
      } else if (tipo === 'despublicar') {
        setNoticias((prev) =>
          prev.map((n) => (n.id === id ? { ...n, status: 'rascunho' } : n))
        );
      } else if (tipo === 'duplicar') {
        const nova = await res.json();
        setNoticias((prev) => [nova, ...prev]);
      }
    } catch (err) {
      alert(err.message || 'Erro ao processar.');
    } finally {
      setProcessando(false);
    }
  }

  function renderStatusBadge(status) {
    switch (status) {
      case 'publicada':
        return <Badge variant="success">Publicada</Badge>;
      case 'rascunho':
        return <Badge variant="secondary">Rascunho</Badge>;
      case 'agendada':
        return <Badge variant="info">Agendada</Badge>;
      case 'arquivada':
        return <Badge variant="warning">Arquivada</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  }

  return (
    <AdminPage>
      <AdminHeader usuarioNome={usuarioNome} usuarioEmail={usuarioEmail} />

      <AdminMain>
        {/* Cabeçalho da Seção de Notícias */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="m-0 font-heading text-2xl font-bold text-primary">
              Gerenciador de Notícias
            </h2>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Publique comunicados, pastorais, memórias e acontecimentos da paróquia.
            </p>
          </div>
          <Link href="/admin/noticias/novo" className={cn(buttonVariants(), 'px-5 shadow-soft')}>
            <Plus size={16} /> Nova Notícia
          </Link>
        </div>

        {/* Barra de Filtros e Busca */}
        <div className="mb-5 flex flex-wrap items-center gap-3.5 rounded-md border border-border bg-card px-5 py-4">
          {/* Busca */}
          <div className="relative min-w-[200px] flex-[1_1_240px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por título ou resumo..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="h-auto w-full border-[1.5px] border-input py-[11px] pl-9 pr-4 text-sm focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/10"
            />
          </div>

          {/* Filtro Status */}
          <Select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
            <option value="">Todos os status</option>
            <option value="publicada">Publicada</option>
            <option value="rascunho">Rascunho</option>
            <option value="agendada">Agendada</option>
            <option value="arquivada">Arquivada</option>
          </Select>

          {/* Filtro Categoria */}
          <Select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
            <option value="">Todas as categorias</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </Select>

          {(busca || filtroStatus || filtroCategoria) && (
            <Button
              variant="link"
              onClick={() => {
                setBusca('');
                setFiltroStatus('');
                setFiltroCategoria('');
              }}
              className="h-auto px-2.5 py-1.5 text-[13px] no-underline hover:no-underline"
            >
              Limpar filtros
            </Button>
          )}
        </div>

        {/* Tabela de Notícias */}
        <Table>
          <TableHeader>
            <TableRow className="border-0 hover:bg-transparent">
              <TableHead className="w-[60px]">Capa</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criação</TableHead>
              <TableHead>Publicação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {noticiasFiltradas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="px-5 py-10 text-center text-muted-foreground">
                  Nenhuma notícia encontrada com os filtros aplicados.
                </TableCell>
              </TableRow>
            ) : (
              noticiasFiltradas.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.imagem_capa ? (
                      <div className="size-11 overflow-hidden rounded-md bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.imagem_capa} alt="" className="size-full object-cover" />
                      </div>
                    ) : (
                      <div className="flex size-11 items-center justify-center rounded-md bg-secondary text-[10px] font-bold text-primary">
                        SEM FOTO
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {item.destaque && (
                        <span title="Notícia em Destaque" className="text-accent">
                          <Star size={14} fill="currentColor" />
                        </span>
                      )}
                      <strong className="text-foreground">{item.titulo}</strong>
                    </div>
                    <small className="mt-0.5 block text-muted-foreground">
                      /noticias/{item.slug}
                    </small>
                  </TableCell>
                  <TableCell>
                    {item.categoria?.nome ? (
                      <span className="rounded bg-muted px-2 py-[3px] text-xs text-soft">
                        {item.categoria.nome}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-[13px]">{item.autor_nome || '—'}</TableCell>
                  <TableCell>{renderStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {item.criado_em ? new Date(item.criado_em).toLocaleDateString('pt-BR') : '—'}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {item.publicado_em ? new Date(item.publicado_em).toLocaleDateString('pt-BR') : '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-1">
                      {/* Ver pública */}
                      {item.status === 'publicada' && (
                        <Link
                          href={`/noticias/${item.slug}`}
                          target="_blank"
                          title="Ver notícia pública"
                          className={cn(iconBtn, 'text-muted-foreground')}
                        >
                          <ExternalLink size={15} />
                        </Link>
                      )}

                      {/* Publicar / Despublicar */}
                      {item.status === 'publicada' ? (
                        <button
                          type="button"
                          onClick={() =>
                            setConfirmModal({
                              tipo: 'despublicar',
                              id: item.id,
                              titulo: item.titulo,
                              mensagem: 'Deseja despublicar esta notícia? Ela voltará para rascunho e sairá do site público.',
                            })
                          }
                          title="Despublicar (Reverter para Rascunho)"
                          className={cn(iconBtn, 'text-amber-500')}
                        >
                          <EyeOff size={15} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            setConfirmModal({
                              tipo: 'publicar',
                              id: item.id,
                              titulo: item.titulo,
                              mensagem: 'Deseja publicar esta notícia no site agora?',
                            })
                          }
                          title="Publicar imediatamente"
                          className={cn(iconBtn, 'text-emerald-500')}
                        >
                          <Globe size={15} />
                        </button>
                      )}

                      {/* Duplicar */}
                      <button
                        type="button"
                        onClick={() => handleAcao('duplicar', item.id)}
                        title="Duplicar como rascunho"
                        className={cn(iconBtn, 'text-blue-500')}
                      >
                        <Copy size={15} />
                      </button>

                      {/* Editar */}
                      <Link
                        href={`/admin/noticias/${item.id}`}
                        title="Editar notícia"
                        className={cn(iconBtn, 'text-primary')}
                      >
                        <Edit size={15} />
                      </Link>

                      {/* Excluir */}
                      <button
                        type="button"
                        onClick={() =>
                          setConfirmModal({
                            tipo: 'excluir',
                            id: item.id,
                            titulo: item.titulo,
                            mensagem: 'Tem certeza que deseja excluir esta notícia? Esta ação é irreversível.',
                          })
                        }
                        title="Excluir notícia"
                        className={cn(iconBtn, 'text-red-500')}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </AdminMain>

      {/* Modal de Confirmação de Ações Destrutivas ou Relevantes */}
      {confirmModal && (
        <Dialog
          onClose={() => setConfirmModal(null)}
          overlayClassName="bg-black/50 p-4 backdrop-blur-none"
          className="max-w-[440px] rounded-md p-6"
        >
          <div className="mb-3 flex items-center gap-3">
            <div
              className={cn(
                'flex size-10 items-center justify-center rounded-full',
                confirmModal.tipo === 'excluir' ? 'bg-red-100 text-red-500' : 'bg-amber-100 text-amber-500'
              )}
            >
              <AlertTriangle size={20} />
            </div>
            <DialogTitle className="m-0">
              {confirmModal.tipo === 'excluir' ? 'Excluir Notícia' : 'Confirmar Ação'}
            </DialogTitle>
          </div>
          <p className="mb-2 text-sm text-muted-foreground">
            <strong>{confirmModal.titulo}</strong>
          </p>
          <p className="mb-5 text-[13px] text-foreground">
            {confirmModal.mensagem}
          </p>
          <div className="flex justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmModal(null)}
              disabled={processando}
              className="h-auto rounded-md border-gray-300 px-4 py-2 text-[13px]"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={() => handleAcao(confirmModal.tipo, confirmModal.id)}
              disabled={processando}
              variant={confirmModal.tipo === 'excluir' ? 'destructive' : 'default'}
              className={cn(
                'h-auto rounded-md px-[18px] py-2 text-[13px]',
                confirmModal.tipo === 'excluir' && 'bg-red-600 hover:bg-red-700'
              )}
            >
              {processando ? 'Processando…' : 'Confirmar'}
            </Button>
          </div>
        </Dialog>
      )}
    </AdminPage>
  );
}
