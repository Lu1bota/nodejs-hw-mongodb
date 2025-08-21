export const validateQuery = (schema) => async (req, res, next) => {
  const validationRes = await schema.validateAsync(req.query, {
    allowUnknown: false,
    abortEarly: false,
    convert: true,
  });

  req.validatedQuery = validationRes;
  next();
};
