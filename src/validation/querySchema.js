import Joi from 'joi';
import { CONTACT_VALUES } from '../constants/contactValues.js';
import { SORT_ORDER } from '../constants/sortOrder.js';
import { CONTACT_TYPES } from '../constants/contactTypes.js';

export const querySchema = Joi.object({
  page: Joi.number().min(1).default(1),
  perPage: Joi.number().min(1).default(10),
  sortBy: Joi.string()
    .valid(...Object.values(CONTACT_VALUES))
    .default(CONTACT_VALUES.NAME),
  sortOrder: Joi.string()
    .valid(...Object.values(SORT_ORDER))
    .default(SORT_ORDER.ASC),
  type: Joi.string().valid(...Object.values(CONTACT_TYPES)),
  isFavourite: Joi.boolean(),
});
