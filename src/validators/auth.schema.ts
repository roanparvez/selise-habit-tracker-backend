import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email({ message: 'Please provide a valid email' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

export const LoginSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
});
