const { default: axios } = require("axios");
const mock = require("./../mock/mockResponses");
const constants = require("./../constants");
const contentTypes = constants.contentTypes;
const googleAPIKey = constants.googleAPIKey;
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

const getWikiResponse = (countryName, bookName) => {
  if (useMock) {
    return mock.getWikiMock();
  }

  // TODO: use this information to do an actual request using js
  // import requests
  // https://api.wikimedia.org/wiki/Documentation/Code_samples/Search_Wikipedia
  // language_code = 'en'
  // search_query = 'solar system'
  // number_of_results = 1
  // headers = {
  //   # 'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
  //   'User-Agent': 'YOUR_APP_NAME (YOUR_EMAIL_OR_CONTACT_PAGE)'
  // }

  // base_url = 'https://api.wikimedia.org/core/v1/wikipedia/'
  // endpoint = '/search/page'
  // url = base_url + language_code + endpoint
  // parameters = {'q': search_query, 'limit': number_of_results}
  // response = requests.get(url, headers=headers, params=parameters)

  return axios.get(`https://restcountries.com/v2/alpha`);
};

const index = async () => {
  try {
    // fetch books
    const bookResponse = await getBooksResponse();
    const book = bookResponse.data.items[0];
    const countryCode = book.accessInfo.country;
    const bookTitle = book.volumeInfo.title;

    // fetch full name
    const countryNameResponse = await getCountryResponse(countryCode);
    const countryName = countryNameResponse.data.name;
    
    //fetch wiki of book using country and book name
    const wikiResponse = await getWikiResponse(countryName, bookTitle);
    const wikiData = wikiResponse.data;

    return {
      headers: { "Content-Type": contentTypes.json },
      code: 200,
      data: {
        book,
        bookTitle,
        countryName,
        wikiData
      },
    };
  } catch (err) {
    console.log(err);
    return {
      headers: { "Content-Type": contentTypes.json },
      code: 500,
      data: {
        message: "Something went wrong.",
      },
    };
  }
};

const indexRoutes = [
  {
    path: "/api/data",
    method: "GET",
    handler: index,
  },
];

module.exports = indexRoutes;
