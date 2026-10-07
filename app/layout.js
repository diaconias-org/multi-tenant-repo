import { headers } from 'next/headers';
import { Inter } from 'next/font/google';
import './globals.css';
import { obterTenant } from '@/services/tenant.service';
import { gerarVariaveisCssTenant } from '@/lib/tenant-theme';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'Devolução do Dízimo – Diaconia Territorial São Raimundo Nonato',
  description:
    'Realize a devolução do seu dízimo de forma simples e rápida. Copie a chave Pix e envie o comprovante.',
};

export default async function RootLayout({ children }) {
  let tenantId = 'curralinhos';
  let tenant = null;

  try {
    const headerList = await headers();
    tenantId = headerList.get('x-tenant-id') || 'curralinhos';
    tenant = await obterTenant(tenantId);
  } catch {
    // Fora do ciclo HTTP ou fallback padrão
  }

  const tenantStyles = gerarVariaveisCssTenant(tenant || tenantId);

  return (
    <html
      lang="pt-BR"
      className={inter.variable}
      data-scroll-behavior="smooth"
      style={tenantStyles}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
