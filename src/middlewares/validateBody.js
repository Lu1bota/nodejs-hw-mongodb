import createHttpError from 'http-errors';

export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, {
      allowUnknown: false,
      abortEarly: false,
      convert: false,
    });
    next();
  } catch (error) {
    throw createHttpError(400, error.message);
  }
};
