import createHttpError from 'http-errors';
import { SessionCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    throw createHttpError(401, 'Please provide auth header');
  }

  const [bearer, accessToken] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !accessToken) {
    throw createHttpError(401, 'Token should be on type Bearer');
  }

  const session = await SessionCollection.findOne({ accessToken });

  if (!session) {
    await SessionCollection.deleteOne({ accessToken });
    throw createHttpError(401, 'Session not found');
  }

  if (session.accessTokenValidUntil < new Date()) {
    await SessionCollection.deleteOne({ accessToken });
    throw createHttpError(401, 'Access token expired');
  }

  const user = await UsersCollection.findOne({ _id: session.userId });

  if (!user) {
    await SessionCollection.deleteOne({ accessToken });
    throw createHttpError(401, 'User not found');
  }

  req.user = user;

  next();
};
