import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware, AuthenticatedRequest } from '../middlewares/authMiddleware';
import { validateResource } from '../middlewares/validateResource'; // Novo import
import { authSchema } from '../validators/authValidator';           // Novo import

const router = Router();
const userController = new UserController();

// Rotas públicas com validação do Zod inserida no meio
router.post('/register', validateResource(authSchema), userController.register);
router.post('/login', validateResource(authSchema), userController.login);

router.get('/profile', authMiddleware, (req: AuthenticatedRequest, res) => {
  return res.json({ user: req.user });
});

export default router;