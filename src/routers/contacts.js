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
import { validateQuery } from '../middlewares/validateQuery.js';
import { querySchema } from '../validation/querySchema.js';

const router = Router();

router.get('/contacts', validateQuery(querySchema), getContactsController);

router.get('/contacts/:contactId', isValidId, getContactByIdController);

router.post(
  '/contacts',
  validateBody(createContactSchema),
  createContactController,
);

router.patch(
  '/contacts/:contactId',
  validateBody(patchContactSchema),
  isValidId,
  updateContactController,
);

router.delete('/contacts/:contactId', isValidId, deleteContactController);

export default router;
