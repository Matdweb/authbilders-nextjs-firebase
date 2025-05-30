import { z } from 'zod'

export const passwordSchema = z.string().min(6, { message: 'Password must be 6 characters or more' })
  .refine(v => /[A-Z]/.test(v), { message: 'Password needs at least 1 uppercase letter' })
  .refine(v => /[^a-z0-9]/gi.test(v), { message: 'Password needs at least 1 symbol' })

  export const FormDataSchema = z.object({
    email: z.string().email(),
    password: passwordSchema,
  });