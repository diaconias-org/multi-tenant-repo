'use client';

import { useState }    from 'react';
import { signOut }     from 'next-auth/react';
import { useRouter }   from 'next/navigation';
import Link            from 'next/link';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Badge }        from '@/components/ui/badge';
import AdminHeader     from '@/components/admin/AdminHeader';
import styles          from './admin.module.css';

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
    <div className={styles.page}>
      <AdminHeader usuarioNome={usuarioNome} usuarioEmail={usuarioEmail} />


      <main className={styles.main}>
        {/* BUSCA */}
        <div className={styles.searchWrap}>
          <input
            type="search"
            placeholder="🔍  Buscar por nome…"
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* TABELA */}
        <div className={styles.tableWrap}>
          {filtrados.length === 0 ? (
            <p className={styles.empty}>Nenhum registro encontrado.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nome</th>
                  <th>Telefone</th>
                  <th>Data do registro</th>
                  <th>Comprovante</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((c, i) => (
                  <tr key={c.id}>
                    <td className={styles.tdNum}>{filtrados.length - i}</td>
                    <td className={styles.tdNome}>{c.nome}</td>
                    <td>{c.telefone || '—'}</td>
                    <td>{c.criado_em}</td>
                    <td>
                      {c.foto_url ? (
                        <button
                          className={styles.btnVerFoto}
                          onClick={() => setFotoModal(c.foto_url)}
                        >
                          Ver foto
                        </button>
                      ) : (
                        <span className={styles.semFoto}>Não enviado</span>
                      )}
                    </td>
                    <td>
                      {c.status === 'valido' && <Badge variant="success"><CheckCircle2 size={13}/> Válido</Badge>}
                      {c.status === 'invalido' && <Badge variant="danger"><XCircle size={13}/> Inválido</Badge>}
                      {(!c.status || c.status === 'pendente') && <Badge variant="warning"><Clock size={13}/> Pendente</Badge>}
                    </td>
                    <td>
                      <div className={styles.acoesStatus}>
                        <button 
                          className={styles.btnValidar} 
                          title="Marcar como Válido"
                          onClick={() => setConfirmDialog({ id: c.id, nome: c.nome, action: 'valido' })}
                        >
                          <CheckCircle2 size={16} />
                        </button>
                        <button 
                          className={styles.btnInvalidar} 
                          title="Marcar como Inválido" 
                          onClick={() => setConfirmDialog({ id: c.id, nome: c.nome, action: 'invalido' })}
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* MODAL DE FOTO */}
      {fotoModal && (
        <div className={styles.modalOverlay} onClick={() => setFotoModal(null)}>
          <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setFotoModal(null)}>✕</button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={fotoModal} alt="Comprovante" className={styles.modalImg} />
            <a href={fotoModal} target="_blank" rel="noopener noreferrer" className={styles.btnDownload}>
              ⬇ Abrir em nova aba
            </a>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACAO */}
      {confirmDialog && (
        <div className={styles.modalOverlay} onClick={() => setConfirmDialog(null)}>
          <div className={styles.dialogBox} onClick={e => e.stopPropagation()}>
            <h3 className={styles.dialogTitle}>Confirmar Ação</h3>
            <p className={styles.dialogText}>
              Tem certeza que deseja marcar o comprovante de <strong>{confirmDialog.nome}</strong> como{' '}
              <strong style={{ color: confirmDialog.action === 'valido' ? 'var(--green)' : 'var(--bordo)' }}>
                {confirmDialog.action === 'valido' ? 'VÁLIDO' : 'INVÁLIDO'}
              </strong>?
            </p>
            <div className={styles.dialogBtns}>
              <button className={styles.btnCancel} onClick={() => setConfirmDialog(null)}>Cancelar</button>
              <button 
                className={confirmDialog.action === 'valido' ? styles.btnConfirmValid : styles.btnConfirmInvalid} 
                onClick={() => alterarStatus(confirmDialog.id, confirmDialog.action)}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
