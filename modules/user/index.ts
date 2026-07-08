import { Elysia } from 'elysia';
import { userModels } from './model';
import { authGuard } from '@/modules/auth';

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

export const userModule = new Elysia({ name: 'user', prefix: '/user' })
  .use(authGuard)
  .model(userModels)
  .get('/profile', ({ user }) => serializeUser(user as unknown as UserLike), { auth: true, response: 'Profile' })
  .patch('/profile', async ({ user, body }) => {
    const u = user as unknown as UserLike;
    return serializeUser({ ...u, ...body });
  }, { auth: true, body: 'UpdateProfile', response: 'Profile' });
