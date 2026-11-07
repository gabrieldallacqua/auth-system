import { z } from 'zod';

export const authSchema = z.object({
  email: z
    .string()
    .min(1, 'O e-mail é obrigatório.')
    .email('O e-mail precisa ter um formato válido (ex: usuario@email.com).'),
    
  password: z
    .string()
    .min(1, 'A senha é obrigatória.')
    .min(6, 'A senha precisa ter no mínimo 6 caracteres.'),
});