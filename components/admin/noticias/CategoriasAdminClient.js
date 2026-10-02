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
import { Badge } from '@/components/ui/badge';
import AdminHeader from '@/components/admin/AdminHeader';
import styles from '@/components/admin/admin.module.css';

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
    <div className={styles.page}>
      <AdminHeader usuarioNome={usuarioNome} usuarioEmail={usuarioEmail} />

      <main className={styles.main}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--bordo)', margin: 0, fontFamily: 'var(--font-cormorant)' }}>
              Categorias de Notícias
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-light)', margin: '4px 0 0' }}>
              Organize os artigos em editoriais (ex: Liturgia, Avisos, Pastorais, Eventos).
            </p>
          </div>
          <button
            type="button"
            onClick={abrirModalCriacao}
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
              border: 'none',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Plus size={16} /> Nova Categoria
          </button>
        </div>

        {/* Tabela de Categorias */}
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Slug</th>
                <th>Descrição</th>
                <th>Notícias</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {categorias.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-light)' }}>
                    Nenhuma categoria cadastrada até o momento.
                  </td>
                </tr>
              ) : (
                categorias.map((cat) => (
                  <tr key={cat.id}>
                    <td>
                      <strong style={{ color: 'var(--text)' }}>{cat.nome}</strong>
                    </td>
                    <td>
                      <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>
                        {cat.slug}
                      </code>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-light)', maxWidth: 280 }}>
                      {cat.descricao || '—'}
                    </td>
                    <td style={{ fontSize: 13, fontWeight: 600 }}>
                      {cat._count?.noticias || 0}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleAlternarStatus(cat.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        title="Clique para alternar status"
                      >
                        {cat.ativo ? (
                          <Badge variant="success">Ativo</Badge>
                        ) : (
                          <Badge variant="secondary">Inativo</Badge>
                        )}
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={() => abrirModalEdicao(cat)}
                          title="Editar Categoria"
                          style={{ padding: 6, background: 'none', border: 'none', color: '#8b1a1a', cursor: 'pointer' }}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(cat)}
                          title="Excluir Categoria"
                          style={{ padding: 6, background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                        >
                          <Trash2 size={16} />
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

      {/* Modal de Criação / Edição de Categoria */}
      {modalAberto && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 16 }}>
          <form
            onSubmit={handleSalvar}
            style={{
              background: '#fff',
              borderRadius: 'var(--radius-md)',
              maxWidth: 480,
              width: '100%',
              padding: 24,
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <h3 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>
              {editandoId ? 'Editar Categoria' : 'Nova Categoria'}
            </h3>

            {erro && (
              <div style={{ padding: '8px 12px', background: '#fee2e2', borderRadius: 6, color: '#b91c1c', fontSize: 13, marginBottom: 14 }}>
                {erro}
              </div>
            )}

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-light)', marginBottom: 4 }}>
                Nome da Categoria *
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Pastorais"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1.5px solid var(--gray-border)',
                  fontSize: 14,
                }}
                required
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-light)', marginBottom: 4 }}>
                Slug (Opcional - gerado automaticamente)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="Ex: pastorais"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1.5px solid var(--gray-border)',
                  fontSize: 14,
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-light)', marginBottom: 4 }}>
                Descrição (Opcional)
              </label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Breve descrição da categoria..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1.5px solid var(--gray-border)',
                  fontSize: 13,
                  resize: 'vertical',
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <input
                type="checkbox"
                id="cat-ativo"
                checked={ativo}
                onChange={(e) => setAtivo(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: 'var(--bordo)', cursor: 'pointer' }}
              />
              <label htmlFor="cat-ativo" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', cursor: 'pointer' }}>
                Categoria Ativa
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                disabled={salvando}
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
                type="submit"
                disabled={salvando}
                style={{
                  padding: '8px 18px',
                  borderRadius: 6,
                  border: 'none',
                  background: 'var(--bordo)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                {salvando ? 'Salvando…' : 'Salvar Categoria'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal de Exclusão de Categoria */}
      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', maxWidth: 420, width: '100%', padding: 24, boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>Excluir Categoria</h3>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text)', margin: '0 0 16px' }}>
              Tem certeza que deseja excluir a categoria <strong>{confirmDelete.nome}</strong>?
              As notícias vinculadas permanecerão salvas, porém sem categoria.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                disabled={salvando}
                style={{ padding: '8px 14px', borderRadius: 6, border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleExcluir(confirmDelete.id)}
                disabled={salvando}
                style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: '#dc2626', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
              >
                {salvando ? 'Excluindo…' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
