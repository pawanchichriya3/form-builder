import {z} from 'zod';

export const createUserWithEmailAndPasswordInput = z.object({
  fullName: z.string().min(1).max(80).describe('The full name of the user'),
  email: z.email().describe('The email address of the user'),
  password:z.string().describe('password of the user')
})

export type CreateUserWithEmailAndPasswordInputType = z.infer<typeof createUserWithEmailAndPasswordInput>