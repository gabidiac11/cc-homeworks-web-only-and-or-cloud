// mock the behavior of a rejection request
const withPromise = (data) => () => {
  if ([200, 201].indexOf(data.status) === -1) {
    throw {
      response: data,
    };
  }
  return new Promise((resolve) => resolve(data));
};

const getBooksMock = withPromise({
  status: 200,
  headers: {},
  config: {
    url: "https://ceva-books.com",
    method: "get",
    data: "",
  },
  data: {
    items: [
      {
        kind: "books#volume",
        id: "iPPFCsEZVd0C",
        etag: "uk6PHXTbyCk",
        selfLink: "https://www.googleapis.com/books/v1/volumes/iPPFCsEZVd0C",
        volumeInfo: {
          title: "Notes from Underground",
          authors: ["Fyodor Dostoevsky"],
          publisher: "Vintage",
          publishedDate: "2011-01-12",
          description:
            "Dostoevsky’s most revolutionary novel, Notes from Underground marks the dividing line between nineteenth- and twentieth-century fiction, and between the visions of self each century embodied. One of the most remarkable characters in literature, the unnamed narrator is a former official who has defiantly withdrawn into an underground existence. In full retreat from society, he scrawls a passionate, obsessive, self-contradictory narrative that serves as a devastating attack on social utopianism and an assertion of man’s essentially irrational nature. Richard Pevear and Larissa Volokhonsky, whose Dostoevsky translations have become the standard, give us a brilliantly faithful edition of this classic novel, conveying all the tragedy and tormented comedy of the original.",
          industryIdentifiers: [
            {
              type: "ISBN_13",
              identifier: "9780307784643",
            },
            {
              type: "ISBN_10",
              identifier: "0307784649",
            },
          ],
          readingModes: {
            text: true,
            image: false,
          },
          pageCount: 160,
          printType: "BOOK",
          categories: ["Fiction"],
          maturityRating: "NOT_MATURE",
          allowAnonLogging: true,
          contentVersion: "3.9.7.0.preview.2",
          panelizationSummary: {
            containsEpubBubbles: false,
            containsImageBubbles: false,
          },
          imageLinks: {
            smallThumbnail:
              "http://books.google.com/books/content?id=iPPFCsEZVd0C&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_lp_bookshelf_list",
            thumbnail:
              "http://books.google.com/books/content?id=iPPFCsEZVd0C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_lp_bookshelf_list",
          },
          language: "en",
          previewLink:
            "http://books.google.ro/books?id=iPPFCsEZVd0C&printsec=frontcover&dq=dostoevsky+fyodor&hl=&as_pt=BOOKS&cd=1&source=gbs_lp_bookshelf_list",
          infoLink:
            "http://books.google.ro/books?id=iPPFCsEZVd0C&dq=dostoevsky+fyodor&hl=&as_pt=BOOKS&source=gbs_lp_bookshelf_list",
          canonicalVolumeLink:
            "https://books.google.com/books/about/Notes_from_Underground.html?hl=&id=iPPFCsEZVd0C",
        },
        saleInfo: {
          country: "RO",
          saleability: "NOT_FOR_SALE",
          isEbook: false,
        },
        accessInfo: {
          country: "RO",
          viewability: "PARTIAL",
          embeddable: true,
          publicDomain: false,
          textToSpeechPermission: "ALLOWED",
          epub: {
            isAvailable: true,
            acsTokenLink:
              "http://books.google.ro/books/download/Notes_from_Underground-sample-epub.acsm?id=iPPFCsEZVd0C&format=epub&output=acs4_fulfillment_token&dl_type=sample&source=gbs_lp_bookshelf_list",
          },
          pdf: {
            isAvailable: false,
          },
          webReaderLink:
            "http://play.google.com/books/reader?id=iPPFCsEZVd0C&hl=&as_pt=BOOKS&printsec=frontcover&source=gbs_lp_bookshelf_list",
          accessViewStatus: "SAMPLE",
          quoteSharingAllowed: false,
        },
        searchInfo: {
          textSnippet:
            "Richard Pevear and Larissa Volokhonsky, whose Dostoevsky translations have become the standard, give us a brilliantly faithful edition of this classic novel, conveying all the tragedy and tormented comedy of the original.",
        },
      },
    ],
  },
});

const getCountryMock = withPromise({
  status: 200,
  headers: {},
  config: {
    url: "https://ceva-country.com",
    method: "get",
    data: "",
  },
  data: {
    name: "Romania",
    topLevelDomain: [".ro"],
    alpha2Code: "RO",
    alpha3Code: "ROU",
    callingCodes: ["40"],
    capital: "Bucharest",
    altSpellings: ["RO", "Rumania", "Roumania", "România"],
    subregion: "Eastern Europe",
    region: "Europe",
    population: 19286123,
    latlng: [46, 25],
    demonym: "Romanian",
    area: 238391,
    gini: 35.8,
    timezones: ["UTC+02:00"],
    borders: ["BGR", "HUN", "MDA", "SRB", "UKR"],
    nativeName: "România",
    numericCode: "642",
    flags: {
      svg: "https://flagcdn.com/ro.svg",
      png: "https://flagcdn.com/w320/ro.png",
    },
    currencies: [
      {
        status: "RON",
        name: "Romanian leu",
        symbol: "lei",
      },
    ],
    languages: [
      {
        iso639_1: "ro",
        iso639_2: "ron",
        name: "Romanian",
        nativeName: "Română",
      },
    ],
    translations: {
      br: "Romênia",
      pt: "Roménia",
      nl: "Roemenië",
      hr: "Rumunjska",
      de: "Rumänien",
      es: "Rumania",
      fr: "Roumanie",
      ja: "ルーマニア",
      it: "Romania",
      hu: "Románia",
    },
    flag: "https://flagcdn.com/ro.svg",
    regionalBlocs: [
      {
        acronym: "EU",
        name: "European Union",
      },
    ],
    cioc: "ROU",
    independent: true,
  },
});

const getWikiMock = withPromise({
  status: 200,
  config: {
    url: "https://ceva-wikipediat.com",
    method: "get",
  },
  data: {
    pages: [
      {
        id: 385829,
        key: "Kim_Stanley_Robinson",
        title: "Kim Stanley Robinson",
        excerpt:
          'Dream; publicată pentru prima dată în Orbit 19), "The Kingdom Underground" (în Escape from Katmandu) "The Lucky Strike" (în Vinland the Dream; publicată',
        matched_title: null,
        description: null,
        thumbnail: {
          mimetype: "image/jpeg",
          size: null,
          width: 172,
          height: 200,
          duration: null,
          url: "//upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Kim_Stanley_Robinson_2005.JPG/172px-Kim_Stanley_Robinson_2005.JPG",
        },
      },
      {
        id: 860494,
        key: "Hayden_White",
        title: "Hayden White",
        excerpt:
          'Interpretation: II (Winter, 1973), pp. 281–314. "Foucault Decoded: Notes from Underground", History and Theory, Vol. 12, No. 1 (1973), pp. 23–54. Metahistory:',
        matched_title: null,
        description: "istoric american",
        thumbnail: {
          mimetype: "image/jpeg",
          size: null,
          width: 150,
          height: 200,
          duration: null,
          url: "//upload.wikimedia.org/wikipedia/commons/thumb/3/32/%E0%B2%B9%E0%B3%87%E0%B2%A1%E0%B2%A8%E0%B3%8D_%E0%B2%B5%E0%B3%88%E0%B2%9F%E0%B3%8D.jpg/150px-%E0%B2%B9%E0%B3%87%E0%B2%A1%E0%B2%A8%E0%B3%8D_%E0%B2%B5%E0%B3%88%E0%B2%9F%E0%B3%8D.jpg",
        },
      },
      {
        id: 2578592,
        key: "Vremea_țiganilor",
        title: "Vremea țiganilor",
        excerpt:
          "Gocić, Notes from the underground : the cinema of Emir Kusturica, Wallflower Press, Londra, 2001, p. 65. ^ en Goran Gocić, Notes from the underground : the",
        matched_title: null,
        description: "film din 1988 regizat de Emir Kusturica",
        thumbnail: {
          mimetype: "image/jpeg",
          size: null,
          width: 141,
          height: 200,
          duration: null,
          url: "//upload.wikimedia.org/wikipedia/ro/thumb/d/dd/Dom_za_vesanje.jpg/141px-Dom_za_vesanje.jpg",
        },
      },
      {
        id: 223845,
        key: "Punk_rock",
        title: "Punk rock",
        excerpt:
          "0-312-20663-1 Taylor, Steven (2003). False Prophet: Field Notes from the Punk Underground (Middletown, Conn.: Wesleyan University Press). ISBN 0-8195-6668-3",
        matched_title: null,
        description: null,
        thumbnail: {
          mimetype: "image/jpeg",
          size: null,
          width: 200,
          height: 150,
          duration: null,
          url: "//upload.wikimedia.org/wikipedia/commons/thumb/2/2c/The_Dangerfields_in_Monto_London.jpg/200px-The_Dangerfields_in_Monto_London.jpg",
        },
      },
      {
        id: 788420,
        key: "Lista_ficțiunilor_apocaliptice_și_postapocaliptice",
        title: "Lista ficțiunilor apocaliptice și postapocaliptice",
        excerpt:
          "'Glen and Randa' Arrives X Rating Belies Film's Philosophical Intent ^ Film Notes -The Hand Maid's Tale ^ Joureny to the Center of time. Badmovieplanet.com",
        matched_title: null,
        description: "articol-listă în cadrul unui proiect Wikimedia",
        thumbnail: null,
      },
    ],
  },
});

module.exports = {
  getBooksMock,
  getCountryMock,
  getWikiMock,
};
