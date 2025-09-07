import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export const isValidId = async (req, res, next) => {
  const { contactId } = req.params;

  if (!isValidObjectId(contactId)) {
    throw createHttpError(400, 'Unknown id');
  }

  next();
};
