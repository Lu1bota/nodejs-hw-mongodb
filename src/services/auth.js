import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';
import bcrypt from 'bcrypt';
import { SessionCollection } from '../db/models/session.js';
import { randomBytes } from 'crypto';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/time.js';

const createSession = (user) => ({
  userId: user._id,
  accessToken: randomBytes(30).toString('base64'),
  refreshToken: randomBytes(30).toString('base64'),
  accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
  refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
});

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    password: hashedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (!user) {
    throw createHttpError(401, 'User not found');
  }

  const userPassword = bcrypt.compare(payload.password, user.password);

  if (!userPassword) {
    throw createHttpError(401, 'Invalid email or password');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  return await SessionCollection.create(createSession(user));
};

export const refreshUser = async (sessionId) => {
  const session = await SessionCollection.findOne({ _id: sessionId });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (session.refreshTokenValidUntil < new Date()) {
    await SessionCollection.deleteOne({ _id: sessionId });
    throw createHttpError(401, 'Session expired');
  }

  const user = await UsersCollection.findOne({ _id: session.userId });

  if (!user) {
    await SessionCollection.deleteOne({ _id: sessionId });
    throw createHttpError(401, 'Session not found');
  }

  await SessionCollection.deleteOne({ _id: sessionId });
  return await SessionCollection.create(createSession(user));
};

export const logoutUser = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};
