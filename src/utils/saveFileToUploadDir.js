// import path from 'node:path';
// import fs from 'node:fs/promises';
// import { UPLOAD_DIR } from '../constants/index.js';
// import { getEnvVar } from './getEnvVar.js';
// import { SEND_EMAIL } from '../constants/sendEmail.js';
// import createHttpError from 'http-errors';

// export const saveFileToUploadDir = async (file) => {
//   try {
//     const newPath = path.join(UPLOAD_DIR, file.filename);
//     await fs.rename(file.path, newPath);
//     return `${getEnvVar(SEND_EMAIL.APP_DOMAIN)}/uploads/${file.filename}`;
//   } catch {
//     createHttpError(500, 'Failed to save file to local');
//   }
// };

import path from 'node:path';
import fs from 'node:fs/promises';
import { UPLOAD_DIR } from '../constants/index.js';
import { getEnvVar } from './getEnvVar.js';
import { SEND_EMAIL } from '../constants/sendEmail.js';
import createHttpError from 'http-errors';

export const saveFileToUploadDir = async (file) => {
  try {
    const ext = path.extname(file.originalname);
    const filenameWithExt = file.filename + ext;
    const newPath = path.join(UPLOAD_DIR, filenameWithExt);

    await fs.rename(file.path, newPath);

    return `${getEnvVar(SEND_EMAIL.APP_DOMAIN)}/uploads/${filenameWithExt}`;
  } catch {
    throw createHttpError(500, 'Failed to save file to local');
  }
};
