import { CONTACT_VALUES } from '../constants/contactValues.js';
import { SORT_ORDER } from '../constants/sortOrder.js';
import { ContactsCollection } from '../db/models/contact.js';
import { createPaginationData } from '../utils/createPaginationData.js';

export async function getContacts({
  page = 1,
  perPage = 10,
  sortBy = CONTACT_VALUES.NAME,
  sortOrder = SORT_ORDER.ASC,
  filter = {},
}) {
  const skip = perPage * (page - 1);
  const contactsConditions = ContactsCollection.find();

  if (filter.type) {
    contactsConditions.where('contactType').equals(filter.type);
  }
  if (typeof filter.isFavourite === 'boolean') {
    contactsConditions.where('isFavourite').equals(filter.isFavourite);
  }

  const [contacts, contactsCount] = await Promise.all([
    ContactsCollection.find()
      .merge(contactsConditions)
      .limit(perPage)
      .skip(skip)
      .sort({ [sortBy]: sortOrder }),
    ContactsCollection.find().merge(contactsConditions).countDocuments(),
  ]);

  return {
    data: contacts,
    ...createPaginationData(page, perPage, contactsCount),
  };
}

export async function getContactById(contactId) {
  const contact = await ContactsCollection.findById(contactId);
  return contact;
}

export async function createContact(payload) {
  const contact = await ContactsCollection.create(payload);
  return contact;
}

export async function updateContact(contactId, payload) {
  const contact = await ContactsCollection.findByIdAndUpdate(
    contactId,
    payload,
    { new: true },
  );
  return contact;
}

export async function deleteContact(contactId) {
  const contact = await ContactsCollection.findByIdAndDelete(contactId);
  return contact;
}
