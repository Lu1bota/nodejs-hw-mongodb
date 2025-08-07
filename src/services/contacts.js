import { ContactsCollection } from '../db/models/contact.js';

export async function getContacts() {
  const contacts = await ContactsCollection.find();
  return contacts;
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
