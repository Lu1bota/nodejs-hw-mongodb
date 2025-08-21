import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  updateContactController,
} from '../controllers/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema } from '../validation/createContactSchema.js';
import { patchContactSchema } from '../validation/patchContactSchema.js';
import { isValidId } from '../middlewares/isValidId.js';
import { querySchema } from '../validation/querySchema.js';

export const contactRouter = Router();

contactRouter.get('/', validateBody(querySchema), getContactsController);

contactRouter.get('/:contactId', isValidId, getContactByIdController);

contactRouter.post(
  '/',
  validateBody(createContactSchema),
  createContactController,
);

contactRouter.patch(
  '/:contactId',
  validateBody(patchContactSchema),
  isValidId,
  updateContactController,
);

contactRouter.delete('/:contactId', isValidId, deleteContactController);
