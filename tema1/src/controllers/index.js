const { default: axios } = require("axios");
const mock = require("./../mock/mockResponses");
const constants = require("./../constants");
const db = require("./../database/db");

const contentTypes = constants.contentTypes;
const googleAPIKey = constants.googleAPIKey;
const wikiApiToken = constants.wikiApiToken;
const wikiUserAgent = constants.wikiUserAgent;
const useMock = constants.useMock;

const getBooksResponse = () => {
  if (useMock) {
    return mock.getBooksMock();
  }
  return axios.get(
    `https://www.googleapis.com/books/v1/volumes?printType=books&q=dostoevsky+fyodor&maxResults=1&source=gbs_lp_bookshelf_list&key=${googleAPIKey}`
  );
};

const getCountryResponse = (countryCode) => {
  if (useMock) {
    return mock.getCountryMock();
  }
  return axios.get(`https://restcountries.com/v2/alpha/${countryCode}`);
};

const getWikiResponse = (languageCode, searchQuery) => {
  if (useMock) {
    return mock.getWikiMock();
  }
  return axios.get(
    `https://api.wikimedia.org/core/v1/wikipedia/${languageCode}/search/page?q=${encodeURIComponent(
      searchQuery
    )}&limit=5`,
    {
      config: {
        headers: {
          Authorization: `Bearer ${wikiApiToken}`,
          "User-Agent": wikiUserAgent,
        },
      },
    }
  );
};

const index = async () => {
  /**
   * @param {IResponse} response
   */
  const insertLogs = (response, latency = -1) => {
    const sql = `
        INSERT INTO 
            logs(
                status,
                method,
                url,
                latency,
                data,
                headers,
                req_params
                )
            VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    return db.sql(sql, [
      response.status,
      response.config.method,
      response.config.url,
      latency,
      JSON.stringify(response.data),
      JSON.stringify(response.headers),
      JSON.stringify(response.config.data),
    ]);
  };

  let time = Date.now();
  try {
    // fetch books
    const bookResponse = await getBooksResponse();
    const book = bookResponse.data.items[0];
    const languageCode = book.accessInfo.country;
    const bookTitle = book.volumeInfo.title;
    await insertLogs(bookResponse, Date.now() - time);

    // fetch full name
    time = Date.now();
    const countryNameResponse = await getCountryResponse(languageCode);
    const countryName = countryNameResponse.data.name;
    const flag = countryNameResponse.data.flags.svg;
    await insertLogs(countryNameResponse, Date.now() - time);

    //fetch wiki of book using the search query formed by country and book name
    time = Date.now();
    const wikiResponse = await getWikiResponse(
      languageCode,
      `${bookTitle} ${countryName}`
    );
    const wikiData = wikiResponse.data;
    await insertLogs(wikiResponse, Date.now() - time);

    return {
      headers: { "Content-Type": contentTypes.json },
      code: 200,
      data: {
        book,
        bookTitle,
        languageCode,
        countryName,
        flag,
        wikiData,
      },
    };
  } catch (err) {
    const isHttpRequestError = !!err?.response?.config?.url;
    if (isHttpRequestError) {
      insertLogs(err.response, Date.now() - time);
    }

    console.log("error for request", err);
    return {
      headers: { "Content-Type": contentTypes.json },
      code: 500,
      data: {
        message: "Something went wrong.",
      },
    };
  }
};

module.exports = [
  {
    path: "/api/data",
    method: "GET",
    handler: index,
  },
];

/**
 * @typedef IResponse
 * @type {object}
 * @property  {any} data
 * @property  {number} status
 * @property  {string} statusText
 * @property  {object} headers
 * @property  {object} config
 * @property  {object} request?
 */
