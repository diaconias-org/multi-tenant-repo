/**
 * auth.js
 * Configuração do NextAuth com Credentials Provider delegando para a camada de serviço.
 * Roda no ambiente Node.js.
 */
import NextAuth          from 'next-auth';
import Credentials       from 'next-auth/providers/credentials';
import { authConfig }    from './auth.config';
import { autenticarUsuario } from '@/services/usuario.service';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email:    { label: 'Email',  type: 'email'    },
        password: { label: 'Senha',  type: 'password' },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        return autenticarUsuario({
          email: String(credentials.email),
          senha: String(credentials.password),
        });
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge:   8 * 3600, // 8 horas
  },
});
