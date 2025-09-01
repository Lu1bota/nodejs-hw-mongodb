export const convertToBoolean = (req, res, next) => {
  if (req.body.isFavourite === 'true') req.body.isFavourite = true;
  if (req.body.isFavourite === 'false') req.body.isFavourite = false;
  next();
};
