/**
 * lib/middlewares/tenant.middleware.js
 * Middleware dedicado à resolução e injeção do tenant na requisição.
 * Edge-safe (compatível com Edge Runtime do Next.js).
 */
import { NextResponse } from 'next/server';

export function tenantMiddleware(request, forcarTenantId = null) {
  const { nextUrl } = request;
  const host = request.headers.get('host') || '';
  const hostSemPorta = host.split(':')[0];
  let tenantId = forcarTenantId;

  if (!tenantId) {
    // 1. Detecção por subdomínio (ex: curralinhos.diaconia.org ou curralinhos.localhost)
    const partes = hostSemPorta.split('.');
    if (partes.length >= 2 && partes[0] !== 'www' && partes[0] !== 'localhost' && !partes[0].match(/^\d+$/)) {
      tenantId = partes[0].toLowerCase();
    }

    // 2. Detecção por query string (ex: ?tenant=curralinhos) ou header x-tenant-id existente
    if (!tenantId) {
      tenantId = nextUrl.searchParams.get('tenant') || request.headers.get('x-tenant-id');
    }

    // 3. Fallback padrão de desenvolvimento
    if (!tenantId) {
      tenantId = process.env.DEFAULT_TENANT_ID || 'curralinhos';
    }
  }

  // 4. Clona os headers da requisição e injeta o x-tenant-id
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-tenant-id', tenantId);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
