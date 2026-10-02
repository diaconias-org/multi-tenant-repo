/**
 * lib/sanitize.js
 * Sanitização de conteúdo HTML para proteção contra ataques XSS.
 * Permite tags de formatação rica seguras para notícias e artigos.
 */
import sanitizeHtml from 'sanitize-html';

export function sanitizarHtml(conteudoSujo) {
  if (!conteudoSujo || typeof conteudoSujo !== 'string') return '';

  return sanitizeHtml(conteudoSujo, {
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'blockquote', 'p', 'a', 'ul', 'ol',
      'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 's', 'u', 'code', 'hr', 'br',
      'div', 'span', 'pre',
      'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td',
      'img', 'figure', 'figcaption'
    ],
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel', 'title', 'class'],
      img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading', 'class', 'style'],
      table: ['class', 'style'],
      th: ['scope', 'colspan', 'rowspan', 'class', 'style'],
      td: ['colspan', 'rowspan', 'class', 'style'],
      span: ['class', 'style'],
      div: ['class', 'style'],
      p: ['class', 'style'],
      h1: ['class', 'id'],
      h2: ['class', 'id'],
      h3: ['class', 'id'],
      h4: ['class', 'id'],
      code: ['class'],
      pre: ['class']
    },
    selfClosing: ['img', 'br', 'hr'],
    allowedSchemes: ['http', 'https', 'mailto', 'tel', 'data'],
    allowedSchemesByTag: {
      img: ['http', 'https', 'data']
    },
    transformTags: {
      a: (tagName, attribs) => {
        // Força rel="noopener noreferrer" e target="_blank" em links externos
        const href = attribs.href || '';
        if (href.startsWith('http://') || href.startsWith('https://')) {
          attribs.target = '_blank';
          attribs.rel = 'noopener noreferrer';
        }
        return {
          tagName: 'a',
          attribs
        };
      },
      img: (tagName, attribs) => {
        attribs.loading = 'lazy';
        return {
          tagName: 'img',
          attribs
        };
      }
    }
  });
}
