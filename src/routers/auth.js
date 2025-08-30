import { Router } from 'express';
import {
  loginUserController,
  logoutUserController,
  refreshUserController,
  registerUserController,
  sendResetEmailController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  loginUserSchema,
  registerUserSchema,
  sendResetEmailSchema,
} from '../validation/auth.js';

export const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerUserSchema),
  registerUserController,
);

authRouter.post('/login', validateBody(loginUserSchema), loginUserController);

authRouter.post('/refresh', refreshUserController);

authRouter.post('/logout', logoutUserController);

authRouter.post(
  '/send-reset-email',
  validateBody(sendResetEmailSchema),
  sendResetEmailController,
);
