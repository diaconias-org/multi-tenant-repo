/**
 * lib/middlewares/auth.middleware.js
 * Middleware dedicado à proteção de rotas administrativas via NextAuth.
 * Edge-safe (não importa módulos nativos do Node).
 */
import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';

const { auth } = NextAuth(authConfig);

export async function authMiddleware(request) {
  const { nextUrl } = request;

  // Protege rotas que começam com /admin
  if (nextUrl.pathname.startsWith('/admin')) {
    const authRes = await auth(request);
    
    // Se o NextAuth gerou um redirecionamento (ex: não logado ou tenant divergente), retorna a resposta
    if (authRes && authRes.status && authRes.status !== 200) {
      return authRes;
    }
    return authRes;
  }

  // Para rotas públicas, não há necessidade de checagem prévia
  return null;
}
