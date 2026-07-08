import { t } from 'elysia';

export const authModels = {
  SignUp: t.Object({
    name: t.String({ minLength: 2 }),
    email: t.String({ format: 'email' }),
    password: t.String({ minLength: 8 }),
  }),
  SignIn: t.Object({
    email: t.String({ format: 'email' }),
    password: t.String(),
  }),
  User: t.Object({
    id: t.String(),
    name: t.String(),
    email: t.String({ format: 'email' }),
    emailVerified: t.Boolean(),
    image: t.Optional(t.String({ format: 'uri' })),
    createdAt: t.String(),
    updatedAt: t.String(),
  }),
} as const;
