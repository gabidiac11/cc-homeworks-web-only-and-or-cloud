const constants = require("../constants");
const db = require("../database/db");
const BookModel = require("../models/BookModel");

const contentTypes = constants.contentTypes;

const sortColumns = ["bookId", "title", "author"];
const availableDirs = ["asc", "desc"];

const getBooks = async (dataGet) => {
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

module.exports = [
  {
    path: "/api/books",
    method: "GET",
    handler: getBooks,
  },
];
