import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getContactById,
  getContacts,
  updateContact,
} from '../services/contacts.js';
import { ContactsFilters } from '../utils/createFilterData.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { CLOUDINARY } from '../constants/index.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export async function getContactsController(req, res, next) {
  const filter = ContactsFilters(req.validatedQuery);
  filter.userId = req.user._id;

  const contacts = await getContacts({
    page: req.validatedQuery.page,
    perPage: req.validatedQuery.perPage,
    sortBy: req.validatedQuery.sortBy,
    sortOrder: req.validatedQuery.sortOrder,
    filter,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}

export async function getContactByIdController(req, res, next) {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
}

export async function createContactController(req, res, next) {
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (getEnvVar(CLOUDINARY.ENABLE_CLOUDINARY) === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const contact = await createContact({
    ...req.body,
    userId: req.user._id,
    photo: photoUrl,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: {
      contact,
    },
  });
}

export async function updateContactController(req, res, next) {
  const { contactId } = req.params;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (getEnvVar(CLOUDINARY.ENABLE_CLOUDINARY) === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const contact = await updateContact(contactId, {
    ...req.body,
    photo: photoUrl,
  });

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
}

export async function deleteContactController(req, res, next) {
  const { contactId } = req.params;
  const contact = await deleteContact(contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
}
