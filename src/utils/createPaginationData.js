import createHttpError from 'http-errors';

export const createPaginationData = (page, perPage, documentsCount) => {
  const totalPages = Math.ceil(documentsCount / perPage);

  if (page > totalPages && totalPages !== 0) {
    throw createHttpError(
      400,
      `Invalid page count, max available page is ${totalPages}`,
    );
  }

  return {
    page,
    perPage,
    totalItems: documentsCount,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
};
