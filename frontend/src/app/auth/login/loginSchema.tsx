import {z} from 'zod';

export const logInSchema = z.object({
    email: z.email('Invalid email address')
        .min(1, 'Email is required'),
    password: z.string()
        .min(1, 'Password is required'),
})
export type logInValues = z.infer<typeof logInSchema>;