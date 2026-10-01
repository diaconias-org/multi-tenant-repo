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

  // Protege apenas rotas que começam com /admin
  if (nextUrl.pathname.startsWith('/admin')) {
    const authRes = await auth(request);
    
    // Se o NextAuth gerou um redirecionamento (ex: não logado), retorna a resposta
    if (authRes && authRes.status && authRes.status !== 200) {
      return authRes;
    }
  }

  // Se a rota for pública ou o usuário estiver autenticado, retorna null (deixa passar)
  return null;
}
