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
import { authenticate } from '../middlewares/authenticate.js';
import { validateQuery } from '../middlewares/validateQuery.js';
import { upload } from '../middlewares/multer.js';
import { convertToBoolean } from '../middlewares/convertToBoolean.js';

export const contactRouter = Router();

contactRouter.use(authenticate);

contactRouter.get('/', validateQuery(querySchema), getContactsController);

contactRouter.get('/:contactId', isValidId, getContactByIdController);

contactRouter.post(
  '/',
  upload.single('photo'),
  convertToBoolean,
  validateBody(createContactSchema),
  createContactController,
);

contactRouter.patch(
  '/:contactId',
  upload.single('photo'),
  convertToBoolean,
  validateBody(patchContactSchema),
  isValidId,
  updateContactController,
);

contactRouter.delete('/:contactId', isValidId, deleteContactController);
