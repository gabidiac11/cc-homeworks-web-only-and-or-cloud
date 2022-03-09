const constants = require("../constants");
const BookModel = require("../models/BookModel");
const utils = require("../utils");

const contentTypes = constants.contentTypes;

const getBooks = async (dataGet) => {
  const sortColumns = ["bookId", "title", "author"];
  const availableDirs = ["asc", "desc"];

  // extract and validate request data
  const searchQuery =
    typeof dataGet.get("searchQuery") === "string"
      ? dataGet.get("searchQuery")
      : null;

  const page = Math.abs(parseInt(dataGet.get("page"))) || 1;
  const length =
    parseInt(dataGet.get("length")) <= 40
      ? parseInt(dataGet.get("length"))
      : 20;

  const sortBy = sortColumns.find((v) => v === dataGet.get("sortBy"));
  const direction =
    availableDirs.find((v) => v === dataGet.get("direction")) ||
    availableDirs[0];

  const { rows, count } = await BookModel.get({
    page,
    length,
    searchQuery,
    sortBy,
    direction,
  });

  return {
    headers: { "Content-Type": contentTypes.json },
    code: 200,
    data: {
      count,
      length,
      page,
      searchQuery,
      sortBy,
      direction,
      rows,
    },
  };
};

const getSingleBook = async (id) => {
  const notFoundResponse = utils.notFound(`ID '${id}' not found or invalid`);

  if (!Number.isInteger(Number(id))) {
    return notFoundResponse;
  }

  const rows = await BookModel.getById(id);
  if (rows.length === 0) {
    return notFoundResponse;
  }

  return {
    headers: { "Content-Type": contentTypes.json },
    code: 200,
    data: rows[0],
  };
};

const createBook = async (reqData) => {
  // safely extract category ids
  const categoryIds = await BookModel.extractAndDecorateCatIdsInput(
    reqData["categoryIds"]
  );

  // safely extract book properties
  const bookInput = BookModel.validateAndDecorateBookInput(reqData);

  const data = (await BookModel.create(bookInput, categoryIds))[0];
  return {
    headers: {
      "Content-Type": contentTypes.json,
      Location: `${constants.baseUrl}/books/${data.bookId}`,
    },
    code: 200,
    data,
  };
};

const postToBookId = async (id) => {
  if ((await BookModel.getById(id)).length > 0) {
    return utils.conflict(`Book with id ${id} exists.`);
  }

  return utils.notFound("Route not found.");
};

const patchBook = async (bookId, data) => {
  if ((await BookModel.getById(bookId)).length === 0) {
    return utils.notFound(`Book with id ${bookId} not found`);
  }

  // safely extract category ids
  const categoryIds = await BookModel.extractAndDecorateCatIdsInput(
    postData["categoryIds"]
  );
  // safely extract book properties
  const bookInput = BookModel.validateAndDecorateBookInput(data, true);

  await BookModel.updateBookEntity(bookInput, bookId);
  await BookModel.removeBookCategoriesIfAny(bookId, categoryIds);
  await BookModel.addCategories(bookId, categoryIds);

  return getSingleBook(bookId);
};

const updateOrReplaceBook = async (bookId, reqData) => {
  if ((await BookModel.getById(bookId)).length === 0) {
    return utils.notFound(`Book with id ${bookId} not found`);
  }

  // safely extract category ids
  const categoryIds = await BookModel.extractAndDecorateCatIdsInput(
    reqData["categoryIds"]
  );

  // safely extract book properties
  const bookInput = BookModel.validateAndDecorateBookInput(reqData);

  await BookModel.updateBookEntity(bookInput, bookId);
  await BookModel.removeAllBookCategories(bookId);
  await BookModel.addCategories(bookId, categoryIds);

  return getSingleBook(bookId);
};

module.exports = [
  {
    regex: /\/api\/books\/([\d]+)$/,
    method: "GET",
    handler: (get, post, url) => {
      const matched = url.match(/\/api\/books\/([\d]+)$/);
      return getSingleBook(matched[1]);
    },
  },
  {
    path: "/api/books",
    method: "GET",
    handler: getBooks,
  },
  {
    regex: /\/api\/books\/([\d]+)$/,
    method: "POST",
    handler: (get, post, url) => {
      const matched = url.match(/\/api\/books\/([\d]+)$/);
      return postToBookId(matched[1], post);
    },
  },
  {
    path: "/api/books",
    method: "POST",
    handler: (get, post) => createBook(post),
  },
  {
    regex: /\/api\/books\/([\d]+)$/,
    method: "PUT",
    handler: (get, data, url) => {
      const matched = url.match(/\/api\/books\/([\d]+)$/);
      return updateOrReplaceBook(matched[1], data);
    },
  },
];
