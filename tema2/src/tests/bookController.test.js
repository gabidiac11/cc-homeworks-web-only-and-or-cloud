const { default: axios, Axios } = require("axios");

const { baseUrl, errorMessages } = require("./../constants");

const editableBookProperties = [
  "author",
  "title",
  "publishedDate",
  "description",
  "thumbnail",
];

test("should return invalid json for POST", async () => {
  let response;
  try {
    response = await axios(`${baseUrl}/books`, {
      method: "POST",
      data: `{
        "author": "Diac Gabriel",
        "title": "One day maybe",
        "categoryIds": ["3",
      }`,
    });
  } catch (err) {
    response = err.response;
  }

  expect(response.status).toBe(400);
  expect(response.data?.message).toBe(errorMessages.BAD_REQUEST_BODY);
});

test("GET - /books -> wrong filter values should not break the app ", async () => {
  let response;
  try {
    const wrongColumn = "tit4le";
    const wrongDir = "bla-asc";
    response = await axios.get(
      `${baseUrl}/books?page=1&searchQuery=fyo&length=3&sortBy=${wrongColumn}&direction=${wrongDir}`
    );
  } catch (err) {
    response = err.response;
  }

  expect(response.status).toBe(200);
  expect(response.data?.direction).toBe("asc");
  expect(response.data?.title).toBe(undefined);
});

test("GET - /books -> filter & sort should work ", async () => {
  let response;
  const sortBy = "title";
  const dir = "des";
  const length = 3;

  try {
    response = await axios.get(
      `${baseUrl}/books?page=1&length=${length}&sortBy=${sortBy}&direction=${dir}`
    );
  } catch (err) {
    response = err.response;
  }

  expect(response.status).toBe(200);
  expect(Array.isArray(response.data?.rows)).toBe(true);
  expect(response.data?.rows?.length <= length).toBe(true);

  const hasTheRightSorting = response.data.rows
    .sort((a, b) => {
      if (a.title === b.title) {
        return 0;
      }
      return a.title < b.title ? 1 : -1;
    })
    .every((item, index) => item === response.data.rows[index]);
  expect(hasTheRightSorting).toBe(true);
});

test(`
  POST /books -> should add new item
  PATCH /books/{id} -> should only edit properties and leave others alone
  PUT /books/{id} -> should replace all properties`, async () => {
  const initialBook = {
    author: "Diac Gabriel",
    title: "One day maybe",
    publishedDate: "2017-02-24",
    description: "A new book with description",
    thumbnail: "image",
    categoryIds: ["1", "2"],
  };

  // ### POST
  const createBookResponse = await axios.post(`${baseUrl}/books`, initialBook);
  expect(createBookResponse.status).toBe(200);

  // expect data to be stored correctly
  const actBook = createBookResponse.data;
  for (let name of editableBookProperties) {
    expect(actBook[name]).toBe(initialBook[name]);
  }
  const actCategoryIds = actBook.categories.map((i) => i.categoryId);
  expect(actCategoryIds.length).toBe(initialBook.categoryIds.length);
  expect(
    initialBook.categoryIds.every((i) =>
      actCategoryIds.some((c) => String(c) === String(i))
    )
  ).toBe(true);

  // ### PATCH
  const patchedBookPayload = {
    author: "Diac P. Gabriel",
  };
  const patchBookResponse = await axios.patch(
    `${baseUrl}/books/${actBook.bookId}`,
    patchedBookPayload
  );

  expect(patchBookResponse.status).toBe(200);

  const bookPatched = patchBookResponse.data;
  for (let name of editableBookProperties) {
    // expect targeted properties to be updated
    if (name in patchedBookPayload) {
      expect(bookPatched[name]).toBe(patchedBookPayload[name]);
      continue;
    }
    // expect NON-targeted properties to be stay unchanged
    expect(bookPatched[name]).toBe(actBook[name]);
  }
  expect(bookPatched.categories.length).toBe(actBook.categories.length);

  // ### PUT
  const putBookPayload = {
    author: "Another author",
  };

  const putBookResponse = await axios.put(
    `${baseUrl}/books/${actBook.bookId}`,
    putBookPayload
  );

  expect(putBookResponse.status).toBe(200);

  const bookPut = putBookResponse.data;
  for (let name of editableBookProperties) {
    // expect targeted properties to be updated
    if (name in putBookPayload) {
      expect(bookPut[name]).toBe(putBookPayload[name]);
      continue;
    }
    // expect NON-targeted properties to be stay be EMPTY
    expect(bookPut[name]).toBe("");
  }
  expect(bookPut.categories.length).toBe(0);
});
