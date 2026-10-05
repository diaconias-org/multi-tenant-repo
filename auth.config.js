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
     * Garante isolamento estrito: um usuário logado em um tenant JAMAIS pode
     * acessar rotas administrativas de outro tenant.
     */
    authorized({ auth, request }) {
      const { nextUrl, headers } = request;
      const isLoggedIn   = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith('/admin');

      if (isAdminRoute) {
        if (!isLoggedIn) return false;

        const userTenantId = auth?.user?.tenant_id;
        if (userTenantId) {
          // 1. Verifica se há subdomínio na requisição e se diverge do tenant do usuário
          const host = headers?.get ? headers.get('host') || '' : '';
          const hostSemPorta = host.split(':')[0];
          const partes = hostSemPorta.split('.');
          if (partes.length >= 2 && partes[0] !== 'www' && partes[0] !== 'localhost' && !partes[0].match(/^\d+$/)) {
            const subdominio = partes[0].toLowerCase();
            if (subdominio !== userTenantId.toLowerCase()) {
              // Tentativa de acessar admin de outro tenant via subdomínio: bloqueia!
              return false;
            }
          }

          // 2. Verifica se foi enviado query param de outro tenant
          const queryTenant = nextUrl.searchParams.get('tenant');
          if (queryTenant && queryTenant.toLowerCase() !== userTenantId.toLowerCase()) {
            return false;
          }
        }

        return true;
      }

      return true; // rotas públicas
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
