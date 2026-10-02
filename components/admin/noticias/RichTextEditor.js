'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  RotateCcw,
  RotateCw,
  RemoveFormatting,
  Code,
  Loader2,
} from 'lucide-react';
import styles from './RichTextEditor.module.css';

export default function RichTextEditor({ value = '', onChange, placeholder = 'Escreva o conteúdo da notícia aqui...' }) {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [modoCodigo, setModoCodigo] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Sincroniza o valor inicial no editor
  useEffect(() => {
    if (editorRef.current && !modoCodigo) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value, modoCodigo]);

  function emitChange() {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      if (onChange) onChange(html);
    }
  }

  function executarComando(comando, valor = null) {
    if (modoCodigo) return;
    editorRef.current?.focus();
    document.execCommand(comando, false, valor);
    emitChange();
  }

  function inserirLink() {
    const url = prompt('Digite a URL do link (ex: https://exemplo.com):');
    if (url) {
      executarComando('createLink', url);
    }
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fd = new FormData();
      fd.append('file', file);

      const res = await fetch('/api/noticias/upload', {
        method: 'POST',
        body: fd,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.erro || 'Falha no upload da imagem.');
      }

      const { url } = await res.json();
      editorRef.current?.focus();
      document.execCommand(
        'insertHTML',
        false,
        `<figure class="my-4"><img src="${url}" alt="Imagem do artigo" class="rounded-lg shadow-md max-w-full h-auto mx-auto" /><figcaption class="text-xs text-center text-gray-500 mt-1">Legenda da imagem</figcaption></figure>`
      );
      emitChange();
    } catch (err) {
      alert(err.message || 'Erro ao carregar imagem.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function inserirTabela() {
    const tabelaHtml = `
      <table class="w-full my-4 border-collapse border border-gray-300">
        <thead>
          <tr class="bg-gray-100">
            <th class="border border-gray-300 p-2 text-left">Cabeçalho 1</th>
            <th class="border border-gray-300 p-2 text-left">Cabeçalho 2</th>
            <th class="border border-gray-300 p-2 text-left">Cabeçalho 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-gray-300 p-2">Item 1</td>
            <td class="border border-gray-300 p-2">Item 2</td>
            <td class="border border-gray-300 p-2">Item 3</td>
          </tr>
        </tbody>
      </table><p><br></p>
    `;
    executarComando('insertHTML', tabelaHtml);
  }

  return (
    <div className={styles.editorContainer}>
      {/* Barra de Ferramentas */}
      <div className={styles.toolbar}>
        <div className={styles.group}>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={() => executarComando('formatBlock', '<h2>')}
            title="Título 2 (H2)"
          >
            <Heading2 size={16} />
          </button>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={() => executarComando('formatBlock', '<h3>')}
            title="Título 3 (H3)"
          >
            <Heading3 size={16} />
          </button>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={() => executarComando('formatBlock', '<p>')}
            title="Parágrafo normal"
          >
            P
          </button>
        </div>

        <div className={styles.divider} />

        <div className={styles.group}>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={() => executarComando('bold')}
            title="Negrito (Ctrl+B)"
          >
            <Bold size={16} />
          </button>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={() => executarComando('italic')}
            title="Itálico (Ctrl+I)"
          >
            <Italic size={16} />
          </button>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={() => executarComando('underline')}
            title="Sublinhado"
          >
            <Underline size={16} />
          </button>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={() => executarComando('strikeThrough')}
            title="Tachado"
          >
            <Strikethrough size={16} />
          </button>
        </div>

        <div className={styles.divider} />

        <div className={styles.group}>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={() => executarComando('insertUnorderedList')}
            title="Lista com marcadores"
          >
            <List size={16} />
          </button>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={() => executarComando('insertOrderedList')}
            title="Lista numerada"
          >
            <ListOrdered size={16} />
          </button>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={() => executarComando('formatBlock', '<blockquote>')}
            title="Citação"
          >
            <Quote size={16} />
          </button>
        </div>

        <div className={styles.divider} />

        <div className={styles.group}>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={() => executarComando('justifyLeft')}
            title="Alinhar à esquerda"
          >
            <AlignLeft size={16} />
          </button>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={() => executarComando('justifyCenter')}
            title="Centralizar"
          >
            <AlignCenter size={16} />
          </button>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={() => executarComando('justifyRight')}
            title="Alinhar à direita"
          >
            <AlignRight size={16} />
          </button>
        </div>

        <div className={styles.divider} />

        <div className={styles.group}>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={inserirLink}
            title="Inserir link"
          >
            <LinkIcon size={16} />
          </button>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={() => fileInputRef.current?.click()}
            title="Inserir imagem"
            disabled={uploading}
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
          </button>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={inserirTabela}
            title="Inserir tabela"
          >
            <TableIcon size={16} />
          </button>
        </div>

        <div className={styles.divider} />

        <div className={styles.group}>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={() => executarComando('undo')}
            title="Desfazer"
          >
            <RotateCcw size={16} />
          </button>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={() => executarComando('redo')}
            title="Refazer"
          >
            <RotateCw size={16} />
          </button>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={() => executarComando('removeFormat')}
            title="Limpar formatação"
          >
            <RemoveFormatting size={16} />
          </button>
          <button
            type="button"
            className={`${styles.toolBtn} ${modoCodigo ? styles.toolBtnActive : ''}`}
            onClick={() => setModoCodigo(!modoCodigo)}
            title="Alternar código HTML"
          >
            <Code size={16} />
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />

      {/* Área de Edição */}
      {modoCodigo ? (
        <textarea
          className={styles.sourceTextarea}
          value={value}
          onChange={(e) => {
            if (onChange) onChange(e.target.value);
          }}
          placeholder="Código HTML..."
        />
      ) : (
        <div
          ref={editorRef}
          className={styles.editableArea}
          contentEditable
          onInput={emitChange}
          onBlur={emitChange}
          data-placeholder={placeholder}
        />
      )}
    </div>
  );
}
