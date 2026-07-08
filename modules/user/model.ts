import { t } from 'elysia';

export const userModels = {
  Profile: t.Object({
    id: t.String(),
    name: t.String(),
    email: t.String({ format: 'email' }),
    image: t.Optional(t.String({ format: 'uri' })),
    createdAt: t.String(),
    updatedAt: t.String(),
  }),
  UpdateProfile: t.Object({
    name: t.Optional(t.String({ minLength: 2 })),
    image: t.Optional(t.String({ format: 'uri' })),
  }),
} as const;
