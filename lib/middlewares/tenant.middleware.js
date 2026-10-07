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

    // 3. Sem fallback silencioso: se não foi informado subdomínio ou query, tenantId permanece nulo
  }

  // 4. Se uma rota de paróquia for acessada sem tenant, redireciona para a raiz
  if (!tenantId && (nextUrl.pathname.startsWith('/noticias') || nextUrl.pathname.startsWith('/comprovante'))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 5. Clona os headers da requisição e injeta (ou remove) o x-tenant-id
  const requestHeaders = new Headers(request.headers);
  if (tenantId) {
    requestHeaders.set('x-tenant-id', tenantId);
  } else {
    requestHeaders.delete('x-tenant-id');
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
