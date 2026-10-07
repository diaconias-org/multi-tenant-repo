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

// Tema neutro para a plataforma / tela de seleção de paróquia (quando nenhum tenant está ativo)
export const TEMA_PLATAFORMA = {
  primary: '#0f172a',    // Slate 900
  accent: '#1e40af',     // Blue 800
  background: '#f8fafc', // Slate 50
};

/**
 * Retorna o mapa de CSS Variables para aplicar no estilo raiz (<html> ou <body>)
 * com base nas configurações do tenant ou no tema institucional da plataforma.
 */
export function gerarVariaveisCssTenant(tenant) {
  if (!tenant) {
    return {
      '--primary': TEMA_PLATAFORMA.primary,
      '--accent': TEMA_PLATAFORMA.accent,
      '--background': TEMA_PLATAFORMA.background,
    };
  }

  const tenantId = (tenant?.id || tenant || '').toLowerCase();
  const preset = TEMAS_PREDEFINIDOS[tenantId] || {
    primary: tenant?.cor_primaria || TEMA_PLATAFORMA.primary,
    accent: tenant?.cor_secundaria || TEMA_PLATAFORMA.accent,
    background: tenant?.cor_fundo || TEMA_PLATAFORMA.background,
  };

  const primary = tenant?.cor_primaria || preset.primary;
  const accent = tenant?.cor_secundaria || preset.accent;
  const background = tenant?.cor_fundo || preset.background;

  return {
    '--primary': primary,
    '--accent': accent,
    '--background': background,
  };
}
