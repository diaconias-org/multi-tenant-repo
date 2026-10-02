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
import { Badge } from '@/components/ui/badge';
import AdminHeader from '@/components/admin/AdminHeader';
import styles from '@/components/admin/admin.module.css';

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
    <div className={styles.page}>
      <AdminHeader usuarioNome={usuarioNome} usuarioEmail={usuarioEmail} />

      <main className={styles.main}>
        {/* Cabeçalho da Seção de Notícias */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--bordo)', margin: 0, fontFamily: 'var(--font-cormorant)' }}>
              Gerenciador de Notícias
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-light)', margin: '4px 0 0' }}>
              Publique comunicados, pastorais, memórias e acontecimentos da paróquia.
            </p>
          </div>
          <Link
            href="/admin/noticias/novo"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              backgroundColor: 'var(--bordo)',
              color: '#fff',
              borderRadius: 'var(--radius-sm)',
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Plus size={16} /> Nova Notícia
          </Link>
        </div>

        {/* Barra de Filtros e Busca */}
        <div style={{ background: '#fff', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--cream-dark)', marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
          {/* Busca */}
          <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 200 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input
              type="text"
              placeholder="Buscar por título ou resumo..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className={styles.searchInput}
              style={{ paddingLeft: 36, width: '100%', maxWidth: 'none' }}
            />
          </div>

          {/* Filtro Status */}
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            style={{
              padding: '10px 14px',
              fontSize: 13,
              borderRadius: 'var(--radius-sm)',
              border: '1.5px solid var(--gray-border)',
              background: '#fff',
              color: 'var(--text)',
              cursor: 'pointer',
            }}
          >
            <option value="">Todos os status</option>
            <option value="publicada">Publicada</option>
            <option value="rascunho">Rascunho</option>
            <option value="agendada">Agendada</option>
            <option value="arquivada">Arquivada</option>
          </select>

          {/* Filtro Categoria */}
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            style={{
              padding: '10px 14px',
              fontSize: 13,
              borderRadius: 'var(--radius-sm)',
              border: '1.5px solid var(--gray-border)',
              background: '#fff',
              color: 'var(--text)',
              cursor: 'pointer',
            }}
          >
            <option value="">Todas as categorias</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>

          {(busca || filtroStatus || filtroCategoria) && (
            <button
              onClick={() => {
                setBusca('');
                setFiltroStatus('');
                setFiltroCategoria('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--bordo)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                padding: '6px 10px',
              }}
            >
              Limpar filtros
            </button>
          )}
        </div>

        {/* Tabela de Notícias */}
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: 60 }}>Capa</th>
                <th>Título</th>
                <th>Categoria</th>
                <th>Autor</th>
                <th>Status</th>
                <th>Criação</th>
                <th>Publicação</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {noticiasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-light)' }}>
                    Nenhuma notícia encontrada com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                noticiasFiltradas.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.imagem_capa ? (
                        <div style={{ width: 44, height: 44, borderRadius: 6, overflow: 'hidden', background: '#f3f4f6' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.imagem_capa}
                            alt=""
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      ) : (
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 6,
                            background: '#f5ede0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#8b1a1a',
                            fontSize: 10,
                            fontWeight: 700,
                          }}
                        >
                          SEM FOTO
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {item.destaque && (
                          <span title="Notícia em Destaque" style={{ color: '#b89a5a' }}>
                            <Star size={14} fill="#b89a5a" />
                          </span>
                        )}
                        <strong style={{ color: 'var(--text)' }}>{item.titulo}</strong>
                      </div>
                      <small style={{ color: 'var(--text-light)', display: 'block', marginTop: 2 }}>
                        /noticias/{item.slug}
                      </small>
                    </td>
                    <td>
                      {item.categoria?.nome ? (
                        <span style={{ fontSize: 12, padding: '3px 8px', borderRadius: 4, background: '#f3f4f6', color: '#4b5563' }}>
                          {item.categoria.nome}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-light)', fontSize: 12 }}>—</span>
                      )}
                    </td>
                    <td style={{ fontSize: 13 }}>{item.autor_nome || '—'}</td>
                    <td>{renderStatusBadge(item.status)}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-light)' }}>
                      {item.criado_em ? new Date(item.criado_em).toLocaleDateString('pt-BR') : '—'}
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-light)' }}>
                      {item.publicado_em ? new Date(item.publicado_em).toLocaleDateString('pt-BR') : '—'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
                        {/* Ver pública */}
                        {item.status === 'publicada' && (
                          <Link
                            href={`/noticias/${item.slug}`}
                            target="_blank"
                            title="Ver notícia pública"
                            style={{
                              padding: 6,
                              borderRadius: 4,
                              color: '#6b7280',
                              display: 'inline-flex',
                            }}
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
                            style={{ padding: 6, background: 'none', border: 'none', color: '#f59e0b', cursor: 'pointer' }}
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
                            style={{ padding: 6, background: 'none', border: 'none', color: '#10b981', cursor: 'pointer' }}
                          >
                            <Globe size={15} />
                          </button>
                        )}

                        {/* Duplicar */}
                        <button
                          type="button"
                          onClick={() => handleAcao('duplicar', item.id)}
                          title="Duplicar como rascunho"
                          style={{ padding: 6, background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}
                        >
                          <Copy size={15} />
                        </button>

                        {/* Editar */}
                        <Link
                          href={`/admin/noticias/${item.id}`}
                          title="Editar notícia"
                          style={{
                            padding: 6,
                            borderRadius: 4,
                            color: '#8b1a1a',
                            display: 'inline-flex',
                          }}
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
                          style={{ padding: 6, background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal de Confirmação de Ações Destrutivas ou Relevantes */}
      {confirmModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 16,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 'var(--radius-md)',
              maxWidth: 440,
              width: '100%',
              padding: 24,
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: confirmModal.tipo === 'excluir' ? '#fee2e2' : '#fef3c7',
                  color: confirmModal.tipo === 'excluir' ? '#ef4444' : '#f59e0b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AlertTriangle size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>
                {confirmModal.tipo === 'excluir' ? 'Excluir Notícia' : 'Confirmar Ação'}
              </h3>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-light)', margin: '0 0 8px' }}>
              <strong>{confirmModal.titulo}</strong>
            </p>
            <p style={{ fontSize: 13, color: 'var(--text)', margin: '0 0 20px' }}>
              {confirmModal.mensagem}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                disabled={processando}
                style={{
                  padding: '8px 16px',
                  borderRadius: 6,
                  border: '1px solid #d1d5db',
                  background: '#fff',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleAcao(confirmModal.tipo, confirmModal.id)}
                disabled={processando}
                style={{
                  padding: '8px 18px',
                  borderRadius: 6,
                  border: 'none',
                  background: confirmModal.tipo === 'excluir' ? '#dc2626' : '#8b1a1a',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                {processando ? 'Processando…' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
