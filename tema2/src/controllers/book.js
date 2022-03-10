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

const patchBook = async (bookId, reqData) => {
  if ((await BookModel.getById(bookId)).length === 0) {
    return utils.notFound(`Book with id ${bookId} not found`);
  }

  // safely extract category ids
  const categoryIds = await BookModel.extractAndDecorateCatIdsInput(
    reqData["categoryIds"]
  );
  // safely extract book properties
  const bookInput = BookModel.validateAndDecorateBookInput(reqData, true);

  await BookModel.patchBookEntity(bookInput, bookId);
  await BookModel.removeBookCategoriesIfAny(bookId, categoryIds);
  await BookModel.addCategories(bookId, categoryIds);

  return getSingleBook(bookId);
};

const putUpdateOrReplaceBook = async (bookId, reqData) => {
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

const deleteById = async (bookId) => {
  if ((await BookModel.getById(bookId)).length === 0) {
    return utils.notFound("Book not found.");
  }

  await BookModel.deleteBook(bookId);

  return {
    headers: {
      "Content-Type": contentTypes.json,
    },
    code: 200,
    data: {},
  };
};

const deleteAllBooks = async () => {
  await BookModel.deleteAllBooks();

  return {
    headers: {
      "Content-Type": contentTypes.json,
    },
    code: 200,
    data: {},
  };
};

const extractAndValidateBookItems = async (data, usePatch) => {
  if (!Array.isArray(data)) {
    throw {
      myHTTPResponse: utils.badRequest(`Request data should be a list.`),
    };
  }

  // may reject bad stucture
  let badIndex = data.findIndex((i) => !i || typeof i !== "object");
  if (badIndex > -1) {
    throw {
      myHTTPResponse: utils.badRequest(`Bad item at index ${badIndex}.`),
    };
  }

  // may reject attempts at injection or passing bad bookIds
  badIndex = data.findIndex((i) => !Number.isInteger(Number(String(i.bookId))));
  if (badIndex > -1) {
    throw {
      myHTTPResponse: utils.badRequest(`Bad id at index ${badIndex}.`),
    };
  }

  // may reject bookIds that point to non-existing books
  // safely extract data about the book from input
  const output = [];
  for (let rawInput of data) {
    if ((await BookModel.getById(rawInput.bookId)).length === 0) {
      throw {
        myHTTPResponse: utils.notFound(
          `Books with id ${rawInput.bookId} not found.`
        ),
      };
    }

    // safely extract category ids
    const cotegories = await BookModel.extractAndDecorateCatIdsInput(
      rawInput["categoryIds"]
    );
    // safely extract book properties
    const bookInput = await BookModel.validateAndDecorateBookInput(
      rawInput,
      usePatch
    );
    bookInput["bookId"] = rawInput.bookId;

    output.push([cotegories, bookInput]);
  }

  return output;
};

const putAllBooks = async (data) => {
  const processedItems = await extractAndValidateBookItems(data);

  for (let item of processedItems) {
    const [categoryIds, bookInput] = item;
    const bookId = bookInput.bookId;

    await BookModel.updateBookEntity(bookInput, bookId);
    await BookModel.removeAllBookCategories(bookId);
    await BookModel.addCategories(bookId, categoryIds);
  }
  await BookModel.deleteAllBooksExeptIds(processedItems.map(i => i[1].bookId));

  return {
    headers: {
      "Content-Type": contentTypes.json,
    },
    code: 200,
    data: {},
  };
};

const patchAllBooks = async (data) => {
  const processedItems = await extractAndValidateBookItems(data, true);

  for (let item of processedItems) {
    const [categoryIds, bookInput] = item;
    const bookId = bookInput.bookId;

    await BookModel.patchBookEntity(bookInput, bookId);
    await BookModel.removeBookCategoriesIfAny(bookId, categoryIds);
    await BookModel.addCategories(bookId, categoryIds);
  }

  return {
    headers: {
      "Content-Type": contentTypes.json,
    },
    code: 200,
    data: {},
  };
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
      return putUpdateOrReplaceBook(matched[1], data);
    },
  },
  {
    regex: /\/api\/books\/([\d]+)$/,
    method: "PATCH",
    handler: (get, data, url) => {
      const matched = url.match(/\/api\/books\/([\d]+)$/);
      return patchBook(matched[1], data);
    },
  },
  {
    regex: /\/api\/books\/([\d]+)$/,
    method: "DELETE",
    handler: (get, data, url) => {
      const matched = url.match(/\/api\/books\/([\d]+)$/);
      return deleteById(matched[1]);
    },
  },
  {
    path: "/api/books",
    method: "DELETE",
    handler: deleteAllBooks,
  },
  {
    path: "/api/books",
    method: "PUT",
    handler: (get, data, url) => {
      return putAllBooks(data);
    },
  },
  {
    path: "/api/books",
    method: "PATCH",
    handler: (get, data, url) => {
      return patchAllBooks(data);
    },
  },
];
