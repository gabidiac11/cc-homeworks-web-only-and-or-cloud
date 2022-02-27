const getBooksMock = () => new Promise((resolve) =>
  resolve({
    code: 200,
    headers: {},
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
  })
);

const getCountryMock = () => new Promise((resolve) =>
  resolve({
    code: 200,
    headers: {},
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
          code: "RON",
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
  })
);

const getWikiMock = () => new Promise((resolve) =>
  resolve({
    code: 200,
    data: ` wikipediat data `,
  })
);

module.exports = {
  getBooksMock,
  getCountryMock,
  getWikiMock,
};
