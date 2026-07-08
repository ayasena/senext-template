import { Elysia, status } from 'elysia';
import { auth } from '@/lib/auth';
import { authModels } from './model';

function handleAuthResult(result: Record<string, unknown>) {
  if (result.error) {
    const err = result.error as { statusCode?: number; message?: string };
    return status(err.statusCode || 400, err.message || 'Bad Request');
  }
  return result;
}

type UserLike = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null | undefined;
  createdAt: string | Date;
  updatedAt: string | Date;
};

function serializeUser(u: UserLike) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    emailVerified: u.emailVerified,
    image: u.image ?? undefined,
    createdAt: typeof u.createdAt === 'string' ? u.createdAt : u.createdAt.toISOString(),
    updatedAt: typeof u.updatedAt === 'string' ? u.updatedAt : u.updatedAt.toISOString(),
  };
}

export const authGuard = new Elysia({ name: 'auth-guard' })
  .model(authModels)
  .macro({
    auth: {
      async resolve({ status: setStatus, request: { headers } }) {
        const session = await auth.api.getSession({ headers });
        if (!session) return setStatus(401, 'Unauthorized');
        return {
          user: session.user,
          session: session.session,
        };
      },
    },
  });

export const authModule = new Elysia({ name: 'auth-routes', prefix: '/auth' })
  .use(authGuard)
  .post('/sign-up', async ({ body }) => {
    const result = await auth.api.signUpEmail({ body }) as Record<string, unknown>;
    return handleAuthResult(result);
  }, { body: 'SignUp' })
  .post('/sign-in', async ({ body }) => {
    const result = await auth.api.signInEmail({ body }) as Record<string, unknown>;
    return handleAuthResult(result);
  }, { body: 'SignIn' })
  .post('/sign-out', async ({ request: { headers } }) => {
    await auth.api.signOut({ headers });
    return { success: true };
  })
  .get('/me', ({ user }) => serializeUser(user as unknown as UserLike), { auth: true, response: 'User' });
