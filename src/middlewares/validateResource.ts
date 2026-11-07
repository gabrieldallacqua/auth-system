import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validateResource = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Junta todas as mensagens de erro em um único texto separado por vírgula
        const messages = error.issues.map((issue) => issue.message).join(' | ');
        return res.status(400).json({ error: messages });
      }
      return res.status(400).json({ error: 'Erro de validação nos dados.' });
    }
  };
};