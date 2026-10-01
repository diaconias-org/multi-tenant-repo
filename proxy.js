/**
 * proxy.js (Next.js 16+)
 * Ponto de entrada único do Middleware no Next.js.
 * 
 * Orquestra a execução de middlewares modulares especializados:
 * - authMiddleware:   Protege rotas restritas (/admin/*) via NextAuth
 * - tenantMiddleware: Detecta a paróquia (subdomínio/URL) e injeta x-tenant-id
 */
import { authMiddleware }   from '@/lib/middlewares/auth.middleware';
import { tenantMiddleware } from '@/lib/middlewares/tenant.middleware';

export async function proxy(request) {
  // 1. Valida autenticação (se não autorizado, retorna redirecionamento imediatamente)
  const authResponse = await authMiddleware(request);
  if (authResponse) {
    return authResponse;
  }

  // 2. Injeta o tenant identificado na requisição
  return tenantMiddleware(request);
}

export const config = {
  matcher: [
    /*
     * Aplica em todas as rotas exceto arquivos estáticos
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|woff|woff2)$).*)',
  ],
};
