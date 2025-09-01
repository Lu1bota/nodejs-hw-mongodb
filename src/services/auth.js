import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';
import bcrypt from 'bcrypt';
import { SessionCollection } from '../db/models/session.js';
import { randomBytes } from 'crypto';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/time.js';
import jwt from 'jsonwebtoken';
import { getEnvVar } from '../utils/getEnvVar.js';
import { SEND_EMAIL } from '../constants/sendEmail.js';
import { sendEmail } from '../utils/createTransporter.js';
import path from 'node:path';
import { TEMPLATES_DIR } from '../constants/index.js';
import fs from 'node:fs/promises';
import handlebars from 'handlebars';

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

export const sendResetEmail = async (email) => {
  try {
    const user = await UsersCollection.findOne({ email });

    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    const host = getEnvVar(SEND_EMAIL.APP_DOMAIN);
    const token = jwt.sign(
      {
        email,
      },
      getEnvVar(SEND_EMAIL.JWT_SECRET),
      {
        expiresIn: '5m',
      },
    );

    const resetTemplatePath = path.join(TEMPLATES_DIR, 'send-reset-email.html');

    const templateSource = (await fs.readFile(resetTemplatePath)).toString();

    const tempalte = handlebars.compile(templateSource);
    const html = tempalte({
      firstName: user.name,
      message:
        'Будь ласка, натисніть кнопку нижче, щоб підтвердити свій акаунт.',
      frontendUrl: `${host}/reset-password?token=${token}`,
    });

    await sendEmail({
      from: getEnvVar(SEND_EMAIL.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, getEnvVar(SEND_EMAIL.JWT_SECRET));
  } catch {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const user = await UsersCollection.findOne({
    email: entries.email,
  });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const password = bcrypt.hash(payload.password, 10);

  await UsersCollection.deleteOne({ email: entries.email });

  await UsersCollection.updateOne({ _id: user._id, password });
};
