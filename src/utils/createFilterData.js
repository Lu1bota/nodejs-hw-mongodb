export const ContactsFilters = (query) => {
  return {
    type: query.type,
    isFavourite: query.isFavourite,
  };
};
