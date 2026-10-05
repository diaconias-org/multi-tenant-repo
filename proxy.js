/**
 * proxy.js (Next.js 16+)
 * Ponto de entrada único do Middleware no Next.js.
 * 
 * Orquestra a execução de middlewares modulares especializados:
 * - authMiddleware:   Protege rotas restritas (/admin/*) via NextAuth e bloqueia cross-tenant
 * - tenantMiddleware: Detecta a paróquia e injeta x-tenant-id nos headers
 */
import { authMiddleware }   from '@/lib/middlewares/auth.middleware';
import { tenantMiddleware } from '@/lib/middlewares/tenant.middleware';

export async function proxy(request) {
  // 1. Valida autenticação (se não autorizado ou tentativa cross-tenant, retorna redirecionamento/bloqueio)
  const authResponse = await authMiddleware(request);
  if (authResponse && authResponse.status && authResponse.status !== 200) {
    return authResponse;
  }

  // Se o NextAuth tiver um usuário autenticado na requisição, extrai o tenant
  const userTenant = authResponse?.auth?.user?.tenant_id || null;

  // 2. Injeta o tenant identificado na requisição (forçando o tenant do usuário se autenticado)
  return tenantMiddleware(request, userTenant);
}

export const config = {
  matcher: [
    /*
     * Aplica em todas as rotas exceto arquivos estáticos
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|woff|woff2)$).*)',
  ],
};
