import { z } from 'zod';

export const CreateHabitSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
});

export const UpdateHabitSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
});
