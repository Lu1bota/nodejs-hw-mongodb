import Joi from 'joi';
import { CONTACT_TYPES } from '../constants/contactTypes.js';
import { isValidObjectId } from 'mongoose';

export const patchContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  isFavourite: Joi.boolean().default(false),
  contactType: Joi.string()
    .valid(...Object.values(CONTACT_TYPES))
    .default(CONTACT_TYPES.PERSONAL),
  userId: Joi.string().custom((value, helper) => {
    const isValidId = isValidObjectId(value);

    if (!isValidId) {
      return helper.message('Not valid userId');
    }

    return value;
  }),
});
