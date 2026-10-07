/**
 * lib/tenant-theme.js
 * Utilitário de tema e design tokens dinâmicos por tenant.
 *
 * Mapeia as cores institucionais do tenant para as variáveis CSS
 * consumidas pelo Tailwind v4 e shadcn/ui.
 */

// Paletas de exemplo pré-configuradas para tenants conhecidos
export const TEMAS_PREDEFINIDOS = {
  curralinhos: {
    primary: '#8b1a1a',    // Bordô Diaconia
    accent: '#b89a5a',     // Dourado
    background: '#f9f2e8', // Creme
  },
  saojose: {
    primary: '#1e3a8a',    // Azul Real São José
    accent: '#d97706',     // Âmbar / Ouro
    background: '#f1f5f9', // Slate suave
  },
  santarita: {
    primary: '#701a75',    // Vinho / Púrpura Santa Rita
    accent: '#c026d3',     // Rosa suave
    background: '#faf5ff', // Lavanda claro
  },
};

/**
 * Retorna o mapa de CSS Variables para aplicar no estilo raiz (<html> ou <body>)
 * com base nas configurações do tenant ou no fallback padrão.
 */
export function gerarVariaveisCssTenant(tenant) {
  const tenantId = (tenant?.id || tenant || 'curralinhos').toLowerCase();
  const preset = TEMAS_PREDEFINIDOS[tenantId] || TEMAS_PREDEFINIDOS.curralinhos;

  const primary = tenant?.cor_primaria || preset.primary;
  const accent = tenant?.cor_secundaria || preset.accent;
  const background = tenant?.cor_fundo || preset.background;

  return {
    '--primary': primary,
    '--accent': accent,
    '--background': background,
  };
}
