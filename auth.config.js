/**
 * auth.config.js
 * Configuração "edge-safe" do NextAuth — sem imports de Node.js puro.
 * Usada pelo proxy.js (middleware) que roda no Edge Runtime.
 *
 * A lógica de verificar senha (bcrypt) NÃO pode ficar aqui,
 * pois bcrypt usa módulos nativos do Node. Fica em auth.js.
 */

export const authConfig = {
  pages: {
    signIn: '/login', // usa a nossa tela de login customizada
  },
  callbacks: {
    /**
     * authorized() é chamado pelo middleware antes de cada rota protegida.
     * Retorna true para deixar passar, false para redirecionar ao signIn.
     */
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn    = !!auth?.user;
      const isAdminRoute  = nextUrl.pathname.startsWith('/admin');
      if (isAdminRoute) return isLoggedIn; // /admin/* exige login
      return true;                          // resto é público
    },

    jwt({ token, user }) {
      if (user?.tenant_id) {
        token.tenant_id = user.tenant_id;
      }
      return token;
    },

    session({ session, token }) {
      if (token?.tenant_id && session.user) {
        session.user.tenant_id = token.tenant_id;
      }
      return session;
    },
  },
  providers: [], // os providers com bcrypt ficam em auth.js (Node.js only)
};
