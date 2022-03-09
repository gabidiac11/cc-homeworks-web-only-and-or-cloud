const { default: axios, Axios } = require("axios");

const { baseUrl, errorMessages } = require("./../constants");

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

test("/books -> wrong filter values should not break the app ", async () => {
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

test("/books -> filter & sort should work ", async () => {
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
