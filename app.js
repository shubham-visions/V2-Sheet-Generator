const xlsx = require("xlsx");
const fs = require("fs");
const {
  getList,
  createFile,
  remove,
  splittingFile,
  generateShortCode,
  extractAddon,
  readFile,
  fetchAddons,
} = require("./Code/List");
const generateCodeIndex = require("./Code/generateId");
const {
  benefitCore,
  enumData,
  indexData,
  UAE,
  NE,
  NE_Dubai,
  AbuDhabi,
  Dubai,
  singleChild,
} = require("./Code/constants");
let residencyIPOptions = 1;
let residencyOPOptions = 1;
let residencyIPOptionsRatetable = 1;
let residencyOPOptionsRatetable = 1;

const OPCopayOptions = [
  'op-option-1',  'op-option-2',  'op-option-3',
  'op-option-4',  'op-option-5',  'op-option-6',
  'op-option-7',  'op-option-8',  'op-option-9',
  'op-option-10', 'op-option-11', 'op-option-12',
  'op-option-13', 'op-option-14', 'op-option-15',
  'op-option-16', 'op-option-17', 'op-option-18',
  'op-option-19', 'op-option-20', 'op-option-21',
  'op-option-22', 'op-option-23', 'op-option-24',
  'op-option-25', 'op-option-26', 'op-option-27',
  'op-option-28', 'op-option-29', 'op-option-30',
  'op-option-31', 'op-option-32', 'op-option-33',
  'op-option-34', 'op-option-35', 'op-option-36',
  'op-option-37', 'op-option-38', 'op-option-39',
  'op-option-40'
]

const countryWiseTaxes = [
  { country: "AT", tax: { label: "TAX", percentage: 0.01 } },
  { country: "BE", tax: { label: "TAX", percentage: 0.0925 } },
  { country: "BG", tax: { label: "TAX", percentage: 0.02 } },
  { country: "DK", tax: { label: "TAX", percentage: 0.011 } },
  { country: "FR", tax: { label: "TAX", percentage: 0.14 } },
  { country: "GR", tax: { label: "TAX", percentage: 0.17 } },
  { country: "HK", tax: { label: "TAX", percentage: 0.001 } },
  { country: "IE", tax: { label: "TAX", percentage: 0.05 } },
  { country: "IT", tax: { label: "TAX", percentage: 0.025 } },
  { country: "KE", tax: { label: "TAX", percentage: 0.012 } },
  { country: "LU", tax: { label: "TAX", percentage: 0.04 } },
  { country: "PT", tax: { label: "TAX", percentage: 0.07742 } },
  { country: "SG", tax: { label: "TAX", percentage: 0.09 } },
  { country: "SK", tax: { label: "TAX", percentage: 0.08 } },
  { country: "SI", tax: { label: "TAX", percentage: 0.085 } },
  { country: "ES", tax: { label: "TAX", percentage: 0.0015 } },
  { country: "GB", tax: { label: "TAX", percentage: 0.12 } },
];

const countryCodes = [
  {
    code: "Medium-Asia - Low-Asia - Low",
    countries: [
      "Abkhazia",
      "Afghanistan",
      "Armenia",
      "Azerbaijan",
      "Bangladesh",
      "Bhutan",
      "British Indian Ocean Territory",
      "Brunei Darussalam",
      "Cambodia",
      "Christmas Island",
      "Cocos (Keeling) Islands",
      "Georgia",
      "Kazakhstan",
      "Kyrgyzstan",
      "Lao People's Democratic Republic",
      "Malaysia",
      "Maldives",
      "Mongolia",
      "Myanmar",
      "Nagorno-Karabakh",
      "Nepal",
      "North Korea",
      "Pakistan",
      "Philippines",
      "South Korea",
      "South Ossetia",
      "Sri Lanka",
      "Tajikistan",
      "Thailand",
      "Timor-Leste",
      "Transnistria",
      "Turkmenistan",
      "Uzbekistan",
    ],
    count: 33,
    alphaCodes: [
      "AF",
      "AM",
      "AZ",
      "BD",
      "BT",
      "IO",
      "BN",
      "KH",
      "CX",
      "CC",
      "GE",
      "KZ",
      "KP",
      "KG",
      "LA",
      "MY",
      "MV",
      "MN",
      "MM",
      "NP",
      "PK",
      "PH",
      "LK",
      "TJ",
      "TH",
      "TL",
      "TM",
      "UZ",
    ],
  },
  {
    code: "Medium-Europe - Middle-Europe - Middle",
    countries: [
      "Aland Islands",
      "Andorra",
      "Austria",
      "Belarus",
      "Belgium",
      "Bulgaria",
      "Czech Republic",
      "Estonia",
      "Finland",
      "France",
      "Germany",
      "Gibraltar",
      "Greece",
      "Guernsey",
      "Holy See (Vatican City State)",
      "Ireland",
      "Isle of Man",
      "Italy",
      "Jersey",
      "Latvia",
      "Liechtenstein",
      "Lithuania",
      "Moldova",
      "Monaco",
      "Montenegro",
      "Portugal",
      "San Marino",
      "Serbia",
      "Spain",
      "Svalbard and Jan Mayen",
      "Ukraine",
    ],
    count: 31,
    alphaCodes: [
      "AX",
      "AD",
      "AT",
      "BY",
      "BE",
      "BG",
      "CZ",
      "EE",
      "FI",
      "FR",
      "DE",
      "GI",
      "GR",
      "GG",
      "VA",
      "IE",
      "IT",
      "JE",
      "LV",
      "LI",
      "LT",
      "MD",
      "MC",
      "ME",
      "PT",
      "SM",
      "RS",
      "ES",
      "UA",
    ],
  },
  {
    code: "Low-Europe - Low-Europe - Low",
    countries: [
      "Albania",
      "Bosnia and Herzegovina",
      "Croatia",
      "Denmark",
      "Faroe Islands",
      "Hungary",
      "Iceland",
      "Kosovo",
      "Luxembourg",
      "Macedonia",
      "Malta",
      "Netherlands",
      "Norway",
      "Poland",
      "Romania",
      "Slovakia",
      "Slovenia",
      "Sweden",
    ],
    count: 18,
    alphaCodes: [
      "AL",
      "HR",
      "DK",
      "FO",
      "HU",
      "IS",
      "LU",
      "MK",
      "MT",
      "NL",
      "NO",
      "PL",
      "RO",
      "SK",
      "SI",
      "SE",
    ],
  },
  {
    code: "High-Africa - Low-Africa - Low",
    countries: [
      "Algeria",
      "Angola",
      "Benin",
      "Botswana",
      "Burkina Faso",
      "Burundi",
      "Cameroon",
      "Cape Verde",
      "Central African Republic",
      "Chad",
      "Comoros",
      "Congo",
      "Congo, DR of",
      "Djibouti",
      "Equatorial Guinea",
      "Eritrea",
      "Ethiopia",
      "Gabon",
      "Gambia",
      "Ghana",
      "Guinea",
      "Guinea-Bissau",
      "Lesotho",
      "Liberia",
      "Libyan Arab Jamahiriya",
      "Madagascar",
      "Malawi",
      "Mali",
      "Mauritania",
      "Mauritius",
      "Mayotte",
      "Morocco",
      "Mozambique",
      "Namibia",
      "Niger",
      "Reunion",
      "Rwanda",
      "Sao Tome and Principe",
      "Senegal",
      "Seychelles",
      "Sierra Leone",
      "Somalia",
      "Somaliland",
      "Sudan",
      "Swaziland",
      "Togo",
      "Tunisia",
      "Uganda",
      "Western Sahara",
      "Zambia",
      "Zimbabwe",
    ],
    count: 51,
    alphaCodes: [
      "DZ",
      "AO",
      "BJ",
      "BW",
      "BF",
      "BI",
      "CM",
      "CV",
      "CF",
      "TD",
      "KM",
      "CG",
      "DJ",
      "GQ",
      "ER",
      "ET",
      "GA",
      "GM",
      "GH",
      "GN",
      "GW",
      "LS",
      "LR",
      "LY",
      "MG",
      "MW",
      "ML",
      "MR",
      "MU",
      "YT",
      "MA",
      "MZ",
      "NA",
      "NE",
      "RE",
      "RW",
      "SN",
      "SC",
      "SL",
      "SO",
      "SD",
      "SZ",
      "TG",
      "TN",
      "UG",
      "EH",
      "ZM",
      "ZW",
    ],
  },
  {
    code: "Medium-Oceania-Oceania",
    countries: [
      "American Samoa",
      "Antarctica",
      "Australia",
      "Cook Islands",
      "Federated States of Micronesia",
      "Fiji",
      "French Polynesia",
      "French Southern Territories",
      "Guam",
      "Heard Islands and McDonald Islands",
      "Kiribati",
      "Marshall Islands",
      "Nauru",
      "New Caledonia",
      "Niue",
      "Norfolk Island",
      "Northern Mariana Islands",
      "Palau",
      "Papua New Guinea",
      "Pitcairn Islands",
      "Samoa",
      "Solomon Islands",
      "South Georgia and the South Sandwich Islands",
      "Tokelau",
      "Tonga",
      "Tuvalu",
      "Vanuatu",
      "Wallis and Futuna",
    ],
    count: 28,
    alphaCodes: [
      "AS",
      "AQ",
      "AU",
      "CK",
      "FJ",
      "PF",
      "TF",
      "GU",
      "KI",
      "MH",
      "NR",
      "NC",
      "NU",
      "NF",
      "MP",
      "PW",
      "PG",
      "WS",
      "SB",
      "TK",
      "TO",
      "TV",
      "VU",
    ],
  },
  {
    code: "Medium-Americas - Middle-Americas - Middle",
    countries: [
      "Anguilla",
      "Antigua and Barbuda",
      "Aruba",
      "Bahamas",
      "Barbados",
      "Belize",
      "Bermuda",
      "Bolivia",
      "Chile",
      "Colombia",
      "Costa Rica",
      "Cuba",
      "Dominica",
      "Dominican Republic",
      "Ecuador",
      "El Salvador",
      "Falkland Islands",
      "French Guiana",
      "Greenland",
      "Grenada",
      "Guadeloupe",
      "Guatemala",
      "Guyana",
      "Honduras",
      "Jamaica",
      "Martinique",
      "Montserrat",
      "Netherlands Antilles",
      "Nicaragua",
      "Panama",
      "Paraguay",
      "Puerto Rico",
      "Saint Barthelemy",
      "Saint Kitts and Nevis",
      "Saint Lucia",
      "Saint Martin",
      "Saint Pierre and Miquelon",
      "Saint Vincent and the Grenadines",
      "Suriname",
      "Trinidad and Tobago",
      "Uruguay",
      "Venezuela",
      "Virgin Islands (British)",
      "Virgin Islands (US)",
    ],
    count: 44,
    alphaCodes: [
      "AI",
      "AG",
      "AW",
      "BS",
      "BB",
      "BZ",
      "BM",
      "BO",
      "CL",
      "CO",
      "CR",
      "CU",
      "DM",
      "DO",
      "EC",
      "SV",
      "GF",
      "GL",
      "GD",
      "GP",
      "GT",
      "GY",
      "HN",
      "JM",
      "MQ",
      "MS",
      "AN",
      "NI",
      "PA",
      "PY",
      "PR",
      "BL",
      "KN",
      "LC",
      "MF",
      "PM",
      "SR",
      "TT",
      "UY",
      "VE",
      "VG",
      "VI",
    ],
  },
  {
    code: "Medium-Americas - Low-Americas - Middle",
    countries: ["Argentina", "Peru", "Turks and Caicos Islands"],
    count: 3,
    alphaCodes: ["AR", "PE", "TC"],
  },
  {
    code: "High-Middle East-Middle East",
    countries: [
      "Bahrain",
      "Cyprus",
      "Cyprus Northern",
      "Egypt",
      "Iran",
      "Iraq",
      "Israel",
      "Jordan",
      "Kuwait",
      "Lebanon",
      "Oman",
      "Palestine",
      "Qatar",
      "Saudi Arabia",
      "Syria",
      "Turkey",
      "Yemen",
    ],
    count: 17,
    alphaCodes: [
      "BH",
      "CY",
      "EG",
      "IQ",
      "IL",
      "JO",
      "KW",
      "LB",
      "OM",
      "QA",
      "SA",
      "TR",
      "YE",
    ],
  },
  {
    code: "Medium-Americas - Mid-High-Americas - Mid-High",
    countries: ["Brazil"],
    count: 1,
    alphaCodes: ["BR"],
  },
  {
    code: "Medium-Americas - Low-Americas - Low",
    countries: ["Canada"],
    count: 1,
    alphaCodes: ["CA"],
  },
  {
    code: "Medium-Americas - High-Americas - Middle",
    countries: ["Cayman Islands", "Haiti"],
    count: 2,
    alphaCodes: ["KY", "HT"],
  },
  {
    code: "High-Asia - Middle-Asia - Mid-High",
    countries: ["China", "Macao"],
    count: 2,
    alphaCodes: ["CN", "MO"],
  },
  {
    code: "High-Africa - High-Africa - Low",
    countries: ["Cote d'Ivoire", "Nigeria", "Tanzania"],
    count: 3,
    alphaCodes: ["CI", "NG", "TZ"],
  },
  {
    code: "High-Asia - High-Asia - High",
    countries: ["Hong Kong"],
    count: 1,
    alphaCodes: ["HK"],
  },
  {
    code: "Low-Asia - Low-Asia - Low",
    countries: ["India"],
    count: 1,
    alphaCodes: ["IN"],
  },
  {
    code: "Medium-Asia - Mid-Low-Asia - Mid-Low",
    countries: ["Indonesia", "Taiwan"],
    count: 2,
    alphaCodes: ["ID", "TW"],
  },
  {
    code: "Low-Asia - Mid-Low-Asia - Mid-Low",
    countries: ["Japan"],
    count: 1,
    alphaCodes: ["JP"],
  },
  {
    code: "Medium-Africa - High-Africa - High",
    countries: [
      "Kenya",
      "Saint Helena, Ascension and Tristan da Cunha",
      "South Africa",
    ],
    count: 3,
    alphaCodes: ["SH", 'KE', 'ZA' ],
  },
  {
    code: "Medium-Americas - High-Americas - High",
    countries: ["Mexico"],
    count: 1,
    alphaCodes: ["MX"],
  },
  {
    code: "Low-Oceania-Oceania",
    countries: ["New Zealand"],
    count: 1,
    alphaCodes: ["NZ"],
  },
  {
    code: "Medium-Europe - Mid-High-Europe - Mid-High",
    countries: ["Russia", "Switzerland"],
    count: 2,
    alphaCodes: ["RU", "CH"],
  },
  {
    code: "High-Asia - Mid-High-Asia - Mid-High",
    countries: ["Singapore", "Singapore"],
    count: 2,
    alphaCodes: ["SG"],
  },
  {
    code: "Medium-Asia - Middle-Asia - Middle",
    countries: [
      "UAE-Abu Dhabi",
      "UAE-Ajman",
      "UAE-Dubai",
      "UAE-Fujairah",
      "UAE-Ras al-Khaimah",
      "UAE-Sharjah",
      "UAE-Umm al-Quwain",
    ],
    count: 7,
    alphaCodes: [],
  },
  {
    code: "Medium-Europe - High-Europe - High",
    countries: ["United Kingdom"],
    count: 1,
    alphaCodes: ["GB"],
  },
  {
    code: "United States-United States-United States",
    countries: [
      "United States Minor Outlying Islands",
      "United States of America",
    ],
    count: 2,
    alphaCodes: ["UM", "US"],
  },
  {
    code: "Medium-Asia - Mid-Low-Asia - Low",
    countries: ["Vietnam"],
    count: 1,
    alphaCodes: ["VN"],
  },
];

let resCount = process.argv.find((v) => v.includes("res"));
if (!resCount) {
  console.log("residency count not found!!");
  process.exit(1);
}
resCount = parseInt(resCount.split(":")[1]);
if (resCount == NaN /* || resCount > 3 */) {
  console.log("res value should be Number & upto 3");
  process.exit(1);
}
let folderName = process.argv.find((v) => v.includes("name"));
if (!folderName) {
  console.log("Company folder not found!!");
  process.exit(1);
}
folderName = folderName.split(":")[1];

// splitFile input
let splitFile = process.argv.find((v) => v.includes("splitFile"));
splitFile = splitFile
  ? splitFile.split(":")[1] == "true"
    ? true
    : false
  : false;

// rate in usd
let rateUSD = process.argv.find((v) => v.includes("rate"));
rateUSD = rateUSD ? (rateUSD.split(":")[1] == "USD" ? true : false) : false;

let Arr = new Array(resCount).fill(null);

(function () {
  const replaceChar = (word) => {
    word = word.replace(" ", "");
    while (word.includes(" ")) {
      word = word.replace(" ", "");
    }
    // word = word.replace("/", "");
    // word = word.replace("-", "");
    return word;
  };
  const convertXlsx = (sheet) => {
    try {
      let result = [];
      let data = xlsx.utils.sheet_to_json(sheet);
      data.forEach((v) => {
        let clone = {};
        for (let key in v) {
          let newKey = key.includes(" ") ? replaceChar(key) : key;
          clone[newKey] = v[key];
        }
        result.push(clone);
      });

      return getList(result);
    } catch (error) {
      console.log({ err: error.message, stack: error.stack });
      process.exit(1);
    }
  };
  const Benefits = readFile(folderName, "userType").map((v) => {
    return { benefits: remove(v.benefits), userType: v.userType };
  });
  let str = "12";
  const planSheets = new Array(resCount).fill(null).map((v, i) => {
    // console.log('i >> ', i);
    // console.log('path >> ', `./Input/${folderName}/benefits${i > 0 ? i : ""}.xlsx`);
    return xlsx.readFile(
      // `./Input/${folderName}/benefits${str[i - 1] ? str[i - 1] : ""}.xlsx`
      `./Input/${folderName}/benefits${i > 0 ? i : ""}.xlsx`
    );
  });
  const GlobalDatas = planSheets.map((v) =>
    convertXlsx(v.Sheets[v.SheetNames[0]])
  );

  // GlobalDatas.forEach(d => {
  //   console.log('d.residency >> ', d.residency);
  // })

  console.log('GlobalDatas >> ', GlobalDatas.length);
  console.log("resCount ", resCount)
  console.log("str ", str)
  const rateSheets = new Array(resCount)
    .fill(null)
    .map((v, i) =>
      // readFile(folderName, `rateSheet${str[i - 1] ? str[i - 1] : ""}`)
      readFile(folderName, `rateSheet${i > 0 ? i : ""}`)

    );
  const DATAs = planSheets.map((v) =>
    xlsx.utils.sheet_to_json(v.Sheets[v.SheetNames[0]]).map((v) => {
      let obj = {};
      for (let key in v) {
        let a = key;
        if (
          key.charCodeAt(key.length - 1) == 160 ||
          key.charCodeAt(key.length - 1) == 32
        ) {
          key = key.slice(0, -1);
        }
        obj[key] = v[a];
      }
      return obj;
    })
  );

  const provider = DATAs[0][0].companyName;


  const Ids = GlobalDatas.map((v, i) =>
    generateCodeIndex(v, Benefits, DATAs[i], resCount > 1 ? i + 1 : "")
  );
  const combinedIDs = (Ids) => {
    let len = Ids.length > 1;
    let id = {
      providers: Ids[0].providers,
    };
    Ids.forEach((v, i) => {
      let obj = {};
      for (let key in {
        plans: "",
        pricingTables: "",
        coverages: "",
        modifiers: "",
      }) {
        obj[`${key}${len ? i + 1 : ""}`] = v[key];
      }
      id = { ...id, ...obj };
    });

    return id;
  };

  // Deletes Output folder for every new sheet generated
  fs.rmSync("./Output", { recursive: true, force: true });
  fs.mkdirSync("Output");

  if (process.argv.includes("print")) {
    createFile("log", "GlobalData", GlobalDatas, provider, false);
    createFile("log", "Ids", combinedIDs(Ids), provider, false);
  }
  if (process.argv.includes("noCode")) {
    process.exit(0);
  }

  // ----------------------- Index ---------------------------
  function createIndex() {
    fs.appendFile(`Output/index.js`, indexData, function (err) {
      try {
        if (err) throw err;
        console.log(`index Created!`);
      } catch (error) {
        console.log(`error: ${error.message}`);
      }
    });
  }
  createIndex();
  // ---------------------------------------------------------

  // ----------------------- Enum ---------------------------
  function createEnum() {
    try {
      fs.appendFileSync(`Output/enum.js`, enumData);
      console.log(`Enum Created!`);
    } catch (error) {
      console.log(`error: ${error.message}`);
    }
  }
  createEnum();
  // ---------------------------------------------------------

  // -------------------------- Core-index ---------------------------------
  function createCore() {
    let clone_ids = combinedIDs(Ids);
    clone_ids = JSON.stringify(clone_ids);
    while (clone_ids.includes(`"-`)) {
      clone_ids = clone_ids.replace(`"-`, "");
    }
    while (clone_ids.includes(`-"`)) {
      clone_ids = clone_ids.replace(`-"`, "");
    }

    fs.appendFile(
      `Output/core-index.js`,
      `const Utils = require('../../services/utils/utils');
        const utils = new Utils({ config: { logging: false }});
        const { generateMongoIdFromString } = utils;
        module.exports = ${clone_ids}`,
      function (err) {
        try {
          if (err) throw err;
          console.log(`Output/core-index.js Created!`);
        } catch (error) {
          console.log(`error: ${error.message}`);
        }
      }
    );
  }
  createCore();
  // -----------------------------------------------------------------------

  // ----------------------- Provider -------------------------
  function createProvider() {
    let str = [
      {
        _id: `-${provider}.providers-`,
        title: provider,
        logo: "",
        colors: {},
        ageCalculationMethod:
          DATAs[0][0]["183_rule"] == "applied"
            ? "-Enum.ageCalculationMethod.advanced-"
            : "-Enum.ageCalculationMethod.standard-",
        exchangeRates: [
          {
            from: "-Enum.currency.AED-",
            to: "-Enum.currency.USD-",
            rate: 0.272479564,
            type: "-Enum.conversionRateType.benefit-",
          },
          {
            from: "-Enum.currency.AED-",
            to: "-Enum.currency.USD-",
            rate: 0.272294078,
            type: "-Enum.conversionRateType.premium-",
          },
          {
            from: "-Enum.currency.USD-",
            to: "-Enum.currency.AED-",
            rate: 3.67,
            type: "-Enum.conversionRateType.benefit-",
          },
          {
            from: "-Enum.currency.USD-",
            to: "-Enum.currency.AED-",
            rate: 3.6725,
            type: "-Enum.conversionRateType.premium-",
          },
        ],
        hasRateTable: true,
        countrySpecificTaxes: countryWiseTaxes,
      },
    ];
    if (DATAs[0][0].conversionRate)
      str[0].exchangeRates[3].rate = parseFloat(DATAs[0][0].conversionRate);
    // else if (!rateUSD)
    //   str[0].exchangeRates.push({
    //     from: "-Enum.currency.USD-",
    //     to: "-Enum.currency.AED-",
    //     rate: 3.6725,
    //     type: "-Enum.conversionRateType.premium-",
    //   });
    createFile("provider", "index", str, provider, false, true);
  }
  createProvider();
  // -------------------------------------------------------------

  // --------------------------------- Coverage File ---------------------------------------------------
  function coverage(store, DATA, id) {
    let coveredCountries = [
      "US",
      "AU",
      "DK",
      "IT",
      "MX",
      "RU",
      "AT",
      "FI",
      "JP",
      "MC",
      "SG",
      "BE",
      "FR",
      "SA",
      "NL",
      "CH",
      "BR",
      "DE",
      "LU",
      "NZ",
      "AE",
      "CN",
      "HK",
      "MO",
      "NO",
      "GB",
      "AD",
      "CC",
      "GL",
      "JM",
      "ES",
      "AI",
      "CO",
      "GD",
      "JE",
      "KN",
      "AG",
      "CK",
      "GP",
      "KW",
      "LC",
      "AR",
      "CR",
      "GT",
      "LB",
      "SX",
      "AW",
      "CY",
      "GG",
      "MT",
      "VC",
      "BS",
      "DM",
      "GY",
      "MQ",
      "SR",
      "BB",
      "DO",
      "HT",
      "AN",
      "SE",
      "BZ",
      "HN",
      "NI",
      "TT",
      "BM",
      "SV",
      "HU",
      "PA",
      "TR",
      "BO",
      "FO",
      "IS",
      "PY",
      "TC",
      "VG",
      "FJ",
      "IQ",
      "PE",
      "TV",
      "KY",
      "PF",
      "IE",
      "PT",
      "UY",
      "CL",
      "GI",
      "IM",
      "QA",
      "VE",
      "CX",
      "GR",
      "SM",
      "EC",
      "IL",
      "AF",
      "HR",
      "KG",
      "OM",
      "TJ",
      "AL",
      "CZ",
      "LV",
      "PS",
      "TM",
      "AM",
      "EE",
      "LI",
      "PL",
      "UA",
      "AZ",
      "GE",
      "LT",
      "RO",
      "UZ",
      "BH",
      "IN",
      "MK",
      "RS",
      "YE",
      "BA",
      "JO",
      "MD",
      "SK",
      "BG",
      "KZ",
      "ME",
      "SI",
      "BD",
      "KI",
      "MM",
      "PW",
      "TW",
      "BT",
      "LA",
      "NR",
      "TH",
      "BN",
      "MY",
      "NP",
      "PH",
      "TO",
      "KH",
      "MV",
      "NC",
      "SB",
      "VU",
      "TL",
      "MH",
      "KR",
      "VN",
      "ID",
      "MN",
      "PK",
      "LK",
      "DZ",
      "PG",
      "GW",
      "MZ",
      "ZA",
      "AO",
      "CD",
      "KE",
      "NA",
      "SS",
      "BJ",
      "DJ",
      "LS",
      "NE",
      "SD",
      "BW",
      "EG",
      "LR",
      "NG",
      "SZ",
      "BF",
      "GQ",
      "LY",
      "CG",
      "TZ",
      "BI",
      "ER",
      "MG",
      "RW",
      "TG",
      "CM",
      "ET",
      "MW",
      "ST",
      "TN",
      "CV",
      "GA",
      "ML",
      "SN",
      "UG",
      "CF",
      "GM",
      "MR",
      "SC",
      "ZM",
      "TD",
      "GH",
      "MU",
      "SL",
      "ZW",
      "KM",
      "GN",
      "MA",
      "SO",
    ];
    console.log('DATA[0].residency >> ', DATA[0].residency);

    let coverage_data = store.coverages.map((v) => {

      let clone = {
        _id: `-${provider}.coverages${id}.${v.coverageName[0]}-`,
        title: v.coverageName[1],
        internalTitle: v.coverageName[1],
        // includedResidence:
        //   DATA[0].residency == "UAE"
        //     ? UAE[0]
        //     : DATA[0].residency == "NE"
        //     ? NE[0]
        //     : DATA[0].residency == "Dubai"
        //     ? Dubai[0]
        //     : DATA[0].residency == "NE/Dubai"
        //     ? NE_Dubai[0]
        //     : AbuDhabi[0],
        // excludedResidence:
        //   DATA[0].residency == "UAE"
        //     ? UAE[1]
        //     : DATA[0].residency == "NE"
        //     ? NE[1]
        //     : DATA[0].residency == "Dubai"
        //     ? Dubai[1]
        //     : DATA[0].residency == "NE/Dubai"
        //     ? NE_Dubai[1]
        //     : AbuDhabi[1],

        includedResidence: countryCodes.find(codes => codes.code == DATA[0].residency.trim())?.alphaCodes,
        excludedResidence: countryCodes.filter(codes => codes.code != DATA[0].residency.trim())?.alphaCodes,
        coveredCountries,
        notes: "",
      };

      return clone;
    });
    return coverage_data;
  }
  let coverage_data = Arr.reduce((acc, v, i) => {
    let data = coverage(GlobalDatas[i], DATAs[i], resCount > 1 ? i + 1 : "");
    return [...acc, ...data];
  }, []);
  createFile("coverage", "index", coverage_data, provider);
  // ----------------------------------------------------------------------------------------------------

  // ----------------------------------- Plans file -----------------------------------------------------
  function plan(store, Id, n, DATA) {
    const benefitTypes = [
      {
        categoryTitle: "General Benefits",
        includedBenefits: [
          {
            userType: "-Enum.userType.All-",
            benefitTypes: [
              "-core.benefitTypes.chronicConditions-",
              "-core.benefitTypes.preExistingCoverCondition-",
            ],
          },
          {
            userType: "-Enum.userType.Pro-",
            benefitTypes: ["-core.benefitTypes.claimHandling-"],
          },
        ],
      },
      {
        categoryTitle: "In-patient (Hospitalization & Surgery)",
        includedBenefits: [
          {
            userType: "-Enum.userType.All-",
            benefitTypes: ["-core.benefitTypes.accomodation-"],
          },
          {
            userType: "-Enum.userType.Pro-",
            benefitTypes: [
              "-core.benefitTypes.diagnosticsAndTest-",
              "-core.benefitTypes.organTransplant-",
              "-core.benefitTypes.surgeriesAndAnthesia-",
              "-core.benefitTypes.oncology-",
            ],
          },
          {
            userType: "-Enum.userType.Starter-",
            benefitTypes: [
              "-core.benefitTypes.inPatientHospitializationandsurgery-",
            ],
          },
        ],
      },
      {
        categoryTitle:
          "Out-patient (Consultations, Lab & Diagnostics, Pharmacy, Physiotherapy)",
        includedBenefits: [
          {
            userType: "-Enum.userType.Starter-",
            benefitTypes: ["-core.benefitTypes.outPatientBenefit-"],
          },
          {
            userType: "-Enum.userType.Pro-",
            benefitTypes: [
              "-core.benefitTypes.outPatientConsultation-",
              "-core.benefitTypes.specialist-",
              "-core.benefitTypes.medicine-",
              "-core.benefitTypes.vaccination-",
              "-core.benefitTypes.tests-",
            ],
          },
          {
            userType: "-Enum.userType.All-",
            benefitTypes: ["-core.benefitTypes.physiotherapy-"],
          },
        ],
      },
      {
        categoryTitle: "Maternity",
        includedBenefits: [
          {
            userType: "-Enum.userType.All-",
            benefitTypes: [
              "-core.benefitTypes.maternity-",
              "-core.benefitTypes.maternityWaitingPeriod-",
            ],
          },
          {
            userType: "-Enum.userType.Pro-",
            benefitTypes: [
              "-core.benefitTypes.complicationOfPregnancy-",
              "-core.benefitTypes.newBornCoverage-",
            ],
          },
        ],
      },
      {
        categoryTitle: "Dental Benefit",
        includedBenefits: [
          {
            userType: "-Enum.userType.All-",
            benefitTypes: [
              "-core.benefitTypes.dental-",
              "-core.benefitTypes.dentalWaitingPeriod-",
            ],
          },
        ],
      },
      {
        categoryTitle: "Additional Benefits",
        includedBenefits: [
          {
            userType: "-Enum.userType.All-",
            benefitTypes: [
              "-core.benefitTypes.optical-",
              "-core.benefitTypes.repatriation-",
              "-core.benefitTypes.wellness-",
              "-core.benefitTypes.emergencyEvacution-",
            ],
          },
          {
            userType: "-Enum.userType.Pro-",
            benefitTypes: [
              "-core.benefitTypes.alternativeMedicine-",
              "-core.benefitTypes.mentalHealth-",
              "-core.benefitTypes.memberWebPortal-",
              "-core.benefitTypes.mobileApplication-",
              "-core.benefitTypes.virtualTele-",
              "-core.benefitTypes.otherServices-",
            ],
          },
        ],
      },
      {
        categoryTitle: "Added (Optional) Benefits",
        includedBenefits: [
          {
            userType: "-Enum.userType.All-",
            benefitTypes: [
              "-core.benefitTypes.extendedEvacuation-",
              "-core.benefitTypes.nonEmergency-",
            ],
          },
        ],
      },
    ];
    let modifiersId = [];
    // console.log(Ids.modifiers);
    for (let key in Id.modifiers) {
      if (typeof Id.modifiers[key] == "string") {
        modifiersId.push(`-${provider}.modifiers${n}.${key}-`);
        continue;
      }
      for (let v in Id.modifiers[key]) {
        modifiersId.push(`-${provider}.modifiers${n}.${key}.${v}-`);
      }
    }
    // console.log(modifiersId);
    let Plans = store.plans.map((plan) => {
      let tableIds = [];
      let plan_modifiersIds = [...modifiersId];
      for (const key in Id.pricingTables[plan[0]]) {
        tableIds.push(`-${provider}.pricingTables${n}.${plan[0]}.${key}-`);
      }
      let have_NotIncludedBenefits = store.filters.notIncludedBenefits.find(
        (v) => v.plan == plan[0]
      );
      if (have_NotIncludedBenefits) {
        plan_modifiersIds = plan_modifiersIds.filter((id) => {
          let benefit = id.split(".")[3]?.replace("-", "");
          return !have_NotIncludedBenefits.benefits.includes(benefit);
        });
      }
      if (store.filters.networkType == "single") {
        plan_modifiersIds = plan_modifiersIds.filter((id) => {
          let plan_network = DATA.find((v) => v.PlanName == plan[1])[
            "Network Details"
          ];
          plan_network = remove(plan_network)[0];
          let benefit = id.split(".")[2];
          if (benefit == "network") {
            // console.log(
            //   "plan_network --> ",
            //   plan_network,
            //   id.split(".")[3]?.replace("-", ""),
            //   plan[0]
            // );
            return plan_network == id.split(".")[3]?.replace("-", "");
          }
          return true;
        });
      }
      let clone = {
        _id: `-${provider}.plans${n}.${plan[0]}-`,
        provider: `-${provider}.providers-`,
        hasRateTable: true,
        title: plan[1],
        notes: "",
        benefitCategories: benefitTypes,
        pricingTables: tableIds,
        modifiers: plan_modifiersIds,
      };
      return clone;
    });
    return Plans;
  }
  let Plans = Arr.reduce((acc, v, i) => {
    let data = plan(
      GlobalDatas[i],
      Ids[i],
      resCount > 1 ? i + 1 : "",
      DATAs[i]
    );
    return [...acc, ...data];
  }, []);
  createFile("plans", "index", Plans, provider, true, true);
  // -----------------------------------------------------------------------------------------------------

  // ----------------------------------Pricing Table -----------------------------------------------------
  function pricingTable(store, Id, DATA, n, rateSheet) {
    try {
      let splitted;
      let short_coverageName;
      const conversion =
        DATA[0].rateIn == "USD" || rateUSD
          ? 1
          : DATAs[0][0].conversionRate
          ? DATAs[0][0].conversionRate
          : 3.6725;
      let PricingTable = [];
      let tableCount = 1;
      for (const key in Id.pricingTables) {
        let plan = Id.pricingTables[key];
        addUp[1] = 1;
        let originalName = (z) => {
          return store.plans.find((v) => v[0] == z)[1];
        };
        let planValue = DATA.find(
          (p) => p.PlanName === originalName(key) || p.PlanName == "All"
        );
        if (!planValue) {
          console.log("plan-", key, originalName(key), n);
          throw new Error();
        }
        planValue = planValue["Annual Limit"];
        let plan_copay = rateSheet.find(
          (r) => r.planName == originalName(key)
        )?.copay;
        let plan_network = rateSheet.find(
          (r) => r.planName == originalName(key)
        )?.network;
        for (let v in plan) {
          // console.log("key --> ", v, key, n);
          let pricing = rateSheet.filter((n) => {
            // if (
            //   n.planName == "Extensive (IP) / Essential (OP)" &&
            //   n.coverage == "Worldwide including USA" &&
            //   n.copay ==
            //     "15% co-pay with USD 20 per visit max on all OP Services" &&
            //   n.frequency == "Annually"
            // ) {
            //   console.log({
            //     name: [n.planName, key, n.planName == key],
            //     cov: [n.coverage, v, n.coverage == v],
            //     copay: [
            //       n.copay,
            //       store.coPays[0][0],
            //       n.copay == store.coPays[0][0],
            //     ],
            //     fre: [
            //       n.frequency,
            //       store.frequency[0],
            //       n.frequency == store.frequency[0],
            //     ],
            //   });
            //   throw new Error();
            // }
            if (DATA[0].planCopay == "single") {
              return (
                n.planName == originalName(key) &&
                n.coverage ==
                  store.coverages.find((k) => k.coverageName[0] == v)
                    .coverageName[1] &&
                // n.copay == store.coPays[0][0] &&
                n.frequency == store.frequency[0]
              );
            }
            return (
              n.planName == originalName(key) &&
              n.coverage ==
                store.coverages.find((k) => k.coverageName[0] == v)
                  .coverageName[1] &&
              n.copay == plan_copay &&
              n.frequency == store.frequency[0]
            );
          });

          if (
            pricing.length == 0 &&
            DATA[0].planCopay != "single" &&
            !DATA[0].copayIP
          )
            throw new Error(
              store.coPays[0][0][0] +
                " | " +
                originalName(key) +
                " | " +
                store.coverages.find((k) => k.coverageName[0] == v)
                  .coverageName[1] +
                " | " +
                store.frequency[0],
              `n - ${n}`
            );
          if (pricing.length == 0 && DATA[0].planCopay == "single") continue;
          let table;
          if (store.filters.networkType == "single") {
            table = pricing.map((t) => {
              let str = {
                fromAge: t.ageStart,
                toAge: t.ageEnd,
                gender: `-Enum.gender.${t.gender.toLowerCase()}-`,
                price: [
                  {
                    value: parseFloat(t.rates / conversion),
                    currency: `-Enum.currency.${t.currency}-`,
                  },
                ],
              };
              if (t.married === 0) {
                str.maritalStatus = "-Enum.maritalStatus.married-";
              }
              if (t.married === 1) {
                str.maritalStatus = "-Enum.maritalStatus.single-";
              }
              if (t.category) str.category = `-Enum.category.${t.category}-`;
              if (t.relation) str.relation = `-Enum.relation.${t.relation}-`;
              return { ...str };
            });
          } else {
            let n = pricing.reduce((acc, v) => {
              if (acc.includes(v.network)) return acc;
              else return [...acc, v.network];
            }, []);
            pricing = pricing.filter((v) => v.network == plan_network);
            table = [
              {
                fromAge: pricing[0].ageStart,
                toAge: pricing[pricing.length - 1].ageEnd,
                gender: `-Enum.gender.male-`,
                price: [
                  {
                    value: 0,
                    currency: `-Enum.currency.${pricing[0].currency}-`,
                  },
                ],
              },
              {
                fromAge: pricing[0].ageStart,
                toAge: pricing[pricing.length - 1].ageEnd,
                gender: `-Enum.gender.female-`,
                price: [
                  {
                    value: 0,
                    currency: `-Enum.currency.${pricing[0].currency}-`,
                  },
                ],
              },
            ];
          }
          if (splitFile && store.filters.networkType == "single") {
            short_coverageName = generateShortCode(v);
            if (!coveragesArr.includes(v)) {
              coveragesArr.push(v);
              comment += `// ${short_coverageName} - ${v} (coverage) \n`;
            }
            splitted = splittingFile(
              table,
              key,
              "PricingTable",
              short_coverageName
            );
            addUp[0] += `const ${key}_${short_coverageName} = require("./${key}/${key}_${short_coverageName}.js"); `;
          }
          let res = store.coverages.find((vv) => vv.coverageName == v);
          let check =
            planValue.toString().includes("AED") ||
            planValue.toString().includes("USD")
              ? true
              : false;
          let clone = {
            _id: `-${provider}.pricingTables${n}.${key}.${v}-`,
            plan: `-${provider}.plans${n}.${key}-`,
            annualLimit:
              planValue.toString().toLowerCase() != "unlimited"
                ? [
                    {
                      currency: `-Enum.currency.${
                        check ? planValue.split(" ")[0] : "USD"
                      }-`,
                      value: check
                        ? Number(planValue.split(" ")[1].split(",").join(""))
                        : planValue,
                    },
                  ]
                : [],
            startDate: new Date(store.startDate).toISOString(),
            endDate: store.endDate ? new Date(store.endDate).toISOString() : "",
            // includedResidence:
            //   DATA[0].residency == "UAE"
            //     ? UAE[0]
            //     : DATA[0].residency == "NE"
            //     ? NE[0]
            //     : DATA[0].residency == "Dubai"
            //     ? Dubai[0]
            //     : DATA[0].residency == "NE/Dubai"
            //     ? NE_Dubai[0]
            //     : AbuDhabi[0],
            // excludedResidence:
            //   DATA[0].residency == "UAE"
            //     ? UAE[1]
            //     : DATA[0].residency == "NE"
            //     ? NE[1]
            //     : DATA[0].residency == "Dubai"
            //     ? Dubai[1]
            //     : DATA[0].residency == "NE/Dubai"
            //     ? NE_Dubai[1]
            //     : AbuDhabi[1],

            includedResidence: countryCodes.find(codes => codes.code == DATA[0].residency.trim())?.alphaCodes,
            excludedResidence: countryCodes.filter(codes => codes.code != DATA[0].residency.trim())?.alphaCodes,
            coverage: [`-${provider}.coverages${n}.${v}-`],
            baseAnnualPremium: [
              {
                fromAge: 0,
                toAge: 82,
                gender: `-Enum.gender.male-`,
                price: [{ value: 0, currency: `-Enum.currency.USD-` }],
              },
              {
                fromAge: 0,
                toAge: 82,
                gender: `-Enum.gender.female-`,
                price: [{ value: 0, currency: `-Enum.currency.USD-` }],
              },
            ]
          };
          addUp[1]++;
          PricingTable.push({ ...clone });
        }
      }
      if (PricingTable.length < store.plans.length)
        throw new Error(
          `Plan mising in pricingTable, PricingTable.length - ${PricingTable.length}, store.plans.length - ${store.plans.length}  ${n}`
        );
      return PricingTable;
    } catch (error) {
      console.log("error --> ", { msg: error.message, stack: error.stack });
    }
  }
  let addUp = ["", 1];
  let comment = "";
  let coveragesArr = [];
  let pricingArr = Arr.reduce((acc, v, i) => {
    let data = pricingTable(
      GlobalDatas[i],
      Ids[i],
      DATAs[i],
      resCount > 1 ? i + 1 : "",
      rateSheets[i]
    );
    return [...acc, ...data];
  }, []);

  createFile(
    "PricingTable",
    "index",
    pricingArr,
    provider,
    false,
    true,
    GlobalDatas[0].filters.networkType != "single"
      ? comment + "Prices are based on network so prices are list as 0"
      : comment,
    addUp[0]
  );
  // -----------------------------------------------------------------------------------------------------

  // -------------------------------- Modifiers file -----------------------------------------------------
  function modifiers(store, Id, DATA, n, rateSheet) {
    const conversion =
      DATA[0].rateIn == "USD" || rateUSD
        ? 1
        : DATAs[0][0].conversionRate
        ? DATAs[0][0].conversionRate
        : 3.6725;
    let benefitsKeys = DATA[0];
    let modifiers = {};
    for (let key in benefitsKeys) {
      if (
        key == "PlanName" ||
        key == "Annual Limit" ||
        key == "Network Details" ||
        key == "Geographical Coverage" ||
        key == "GeographicalCoverage"
      )
        continue;
      if (
        key == "Modes of Payment" ||
        key == "Payment Terms Available" ||
        key == "Semi Annual Surcharge"
      ) {
        break;
      }
      if (
        key.charCodeAt(key.length - 1) == 160 ||
        key.charCodeAt(key.length - 1) == 32
      ) {
        key = key.slice(0, -1);
      }
      DATA.forEach((d) => {
        while (d[key]?.includes("\n")) d[key] = d[key].replace("\n", " ");
        let { PlanName } = d;
        if (!PlanName) return;
        let have_NotIncludedBenefits = store.filters.notIncludedBenefits.find(
          (v) => v.plan == remove(PlanName)[0]
        );
        if (
          have_NotIncludedBenefits &&
          have_NotIncludedBenefits.benefits.includes(remove(key)[0])
        )
          return;
        if (modifiers.length == 0)
          modifiers[key] = [{ plans: [PlanName], value: d[key] }];
        else if (modifiers[key]) {
          let index = modifiers[key].findIndex((v) => v.value == d[key]);
          if (index != -1) {
            modifiers[key][index].plans.push(PlanName);
          } else modifiers[key].push({ plans: [PlanName], value: d[key] });
        } else {
          modifiers[key] = [{ plans: [PlanName], value: d[key] }];
        }
      });
    }
    // console.log(modifiers);
    if (Object.keys(modifiers).length == 0)
      throw new Error("modifiers object not created");

    let newArr = [];
    let planIds = [];
    for (let key in Id.plans) {
      planIds.push(`-${provider}.plans${n}.${key}-`);
    }

    let addonBeneits = ["Dental", "Optical Benefits", "Wellness & Health Screening", "Repatriation-Benefit", "Dental_Waiting_Period", "Out-patient benefits", "Emergency Evacuation"]
    let perCustomer = ["Dental", "Wellness & Health Screening", "Repatriation-Benefit"]
    store.Modifiers.forEach((key) => {

      // benefits --------------------------------------------
      if (key == "benefits") {
        for (const key in modifiers) {
          if (
            key.charCodeAt(key.length - 1) == 160 ||
            key.charCodeAt(key.length - 1) == 32
          ) {
            key = key.slice(0, -1);
          }
          !Benefits.find((v) => v.benefits[1] == key) &&
            console.log("k ", n, key, Benefits);
          !benefitCore.find((v) => v[0] == key) &&
            console.log("core-", n, key, benefitCore);
          let benefits_plans_ids = [...planIds];
          if (store.filters.notIncludedBenefits.length > 0) {
            let benefit_plans = modifiers[key].reduce((acc, v) => {
              let plans = v.plans.map((p) => remove(p)[0]);
              return [...acc, ...plans];
            }, []);
            benefits_plans_ids = benefits_plans_ids.filter((id) =>
              benefit_plans.includes(id.split(".")[2].replace("-", ""))
            );
          }

          let str = {
            _id: `-${provider}.modifiers${n}.benefits.${
              Benefits.find((v) => v.benefits[1] == key).benefits[0]
            }-`,
            plans: [...benefits_plans_ids],
            title: key,
            label: key,
            type: "-core.modifierTypes.benefit-",
            assignmentType: !addonBeneits.includes(key) ? "PER_PLAN" : "PER_CUSTOMER",
            includedBenefits: [benefitCore.find((v) => v[0] == key)[1]],
            isOptional: false,
            description: "",
            addonCost: {},
            premiumMod: "",
            conditions: [],
            hasOptions: true,
          };
          // throw new Error();
          str.description =
            modifiers[key].length > 1
              ? ""
              : modifiers[key][0].value.toString().includes(" $ ")
              ? ""
              : (modifiers[key][0].value.toString().includes("$copay") || modifiers[key][0].value.toString().includes("$outPatient") 
            || modifiers[key][0].value.toString().includes("$vaccination") || modifiers[key][0].value.toString().includes("$physiotherepy")
          ||modifiers[key][0].value.toString().includes("$medicines"))
              ? ""
              : modifiers[key][0].value;
          // str.isOptional = false;
          // str.hasOptions = modifiers[key].length > 1;
          str.isOptional = addonBeneits.includes(key) && key != "Dental_Waiting_Period" && key != "Optical Benefits" && key != "Out-patient benefits" && key != "Emergency Evacuation" ? true : false;
          str.hasOptions = addonBeneits.includes(key) ? true : modifiers[key].length > 1;
          if (!modifiers[key][0].value.toString().includes("$copay")) {
            str.options = [];
            let count = 1;
            modifiers[key].forEach((m) => {
              if (!m.value) console.log("m --> ", m, modifiers[key], key, n);
              if (
                m.value.toString().includes(" $ ") &&
                modifiers[key].length == 1
              ) {
                store.coPays.forEach((v) => {
                  let [copay, scope] = v;
                  if (!scope.includes("all") && scope.includes(m.plans)) return;
                  let text = m.value;
                  copay.forEach((co, i) => {
                    if (i == 0) return;
                    text = text.replace("$", co);
                  });
                  let cc = {
                    id: "option-" + count,
                    label: text,
                    description: text,
                    conditions: [
                      {
                        type: "-Enum.conditions.deductible-",
                        value: [copay[0]],
                      },
                    ],
                  };
                  str.hasOptions = true;
                  str.options.push(cc);
                  count++;
                });
              } else if (
                m.value.toString().includes(" $ ") &&
                modifiers[key].length > 1
              ) {
                store.coPays.forEach((v) => {
                  let [copay, scope] = v;
                  if (!scope.includes("all") && scope.includes(m.plans)) return;
                  let text = m.value;
                  copay.forEach((co, i) => {
                    if (i == 0) return;
                    text = text.replace("$", co);
                  });
                  let cc = {
                    id: "option-" + count,
                    label: text,
                    description: text,
                    conditions: [
                      {
                        type: "-Enum.conditions.deductible-",
                        value: [copay[0]],
                      },
                      {
                        type: "-Enum.conditions.plans-",
                        value: [
                          ...m.plans.reduce((acc, v) => {
                            return [
                              ...acc,
                              `-${provider}.plans${n}.${remove(v)[0]}-`,
                            ];
                          }, []),
                        ],
                      },
                    ],
                  };
                  str.hasOptions = true;
                  str.options.push(cc);
                  count++;
                });
              } else if (modifiers[key].length > 1) {
                let cc = {
                  id: "option-" + count,
                  label: m.value,
                  description: m.value,
                  conditions: [
                    {
                      type: "-Enum.conditions.plans-",
                      value: [
                        ...m.plans.reduce((acc, v) => {
                          return [
                            ...acc,
                            `-${provider}.plans${n}.${remove(v)[0]}-`,
                          ];
                        }, []),
                      ],
                    },
                  ],
                };
                str.hasOptions = true;
                str.options.push(cc);
                count++;
              }
            });
          } else if (modifiers[key][0].value.toString().includes("$copay")) {
            str.options = [];
            str.hasOptions = true;
            let count = 1;
            if (DATA[0].$copay) {
              let $copay = DATA.reduce((acc, v) => {
                if (v.$copay) return [...acc, v.$copay];
                return acc;
              }, []);
              $copay.forEach((v) => {
                const benefitsVal = v.split(" ^ ");
                benefitsVal.forEach((e) => {
                  let [value, copays, planName] = e.split(" - ");
                let cc = {
                  id: "option-" + count,
                  label: value,
                  description: value,
                  conditions: [
                    {
                      type: "-Enum.conditions.deductible-",
                      value: OPCopayOptions
                    },
                    {
                      type: "-Enum.conditions.plans-",
                      value: [`-${provider}.plans${n}.${planName}-`]
                    }
                  ],
                };
                str.options.push(cc);
                count++;
                })
              });
            } else
              store.coPays.forEach((v) => {
                let [copay, scope] = v;
                let conditions = [];
                conditions.push({
                  type: "-Enum.conditions.deductible-",
                  value: [copay[0]],
                });
                if (!scope.includes("all")) {
                  let con = {
                    type: "-Enum.conditions.plans-",
                    value: [],
                  };
                  store.plans.forEach((m) => {
                    if (!scope.includes(m[1])) return;
                    con.value.push(`-${provider}.plans${n}.${m[0]}-`);
                  });
                  conditions.push(con);
                }
                let cc = {
                  id: "option-" + count,
                  label: copay[0],
                  description: copay[0],
                  conditions: [...conditions],
                };
                str.options.push(cc);
                count++;
              });
          }

          if (modifiers[key][0].value.toString().includes("$outPatient")) {
            str.options = [];
            str.hasOptions = true;
            let count = 1;
            if (DATA[0].$outPatient) {
              let $outPatient = DATA.reduce((acc, v) => {
                if (v.$outPatient) return [...acc, v.$outPatient];
                return acc;
              }, []);
              $outPatient.forEach((v) => {
                const benefitsVal = v.split(" ^ ");
                benefitsVal.forEach((e) => {
                  let [value, copays, planName] = e.split(" - ");
                let cc = {
                  id: "option-" + count,
                  label: value,
                  description: value,
                  conditions: [
                    {
                      type: "-Enum.conditions.deductible-",
                      value: OPCopayOptions
                    },
                    {
                      type: "-Enum.conditions.plans-",
                      value: [`-${provider}.plans${n}.${planName}-`]
                    }
                  ],
                };
                str.options.push(cc);
                count++;
                })
              });
            } else
              store.coPays.forEach((v) => {
                let [copay, scope] = v;
                let conditions = [];
                conditions.push({
                  type: "-Enum.conditions.deductible-",
                  value: [copay[0]],
                });
                if (!scope.includes("all")) {
                  let con = {
                    type: "-Enum.conditions.plans-",
                    value: [],
                  };
                  store.plans.forEach((m) => {
                    if (!scope.includes(m[1])) return;
                    con.value.push(`-${provider}.plans${n}.${m[0]}-`);
                  });
                  conditions.push(con);
                }
                let cc = {
                  id: "option-" + count,
                  label: copay[0],
                  description: copay[0],
                  conditions: [...conditions],
                };
                str.options.push(cc);
                count++;
              });
          }

          if (modifiers[key][0].value.toString().includes("$vaccination")) {
            str.options = [];
            str.hasOptions = true;
            let count = 1;
            if (DATA[0].$vaccination) {
              let $vaccination = DATA.reduce((acc, v) => {
                if (v.$vaccination) return [...acc, v.$vaccination];
                return acc;
              }, []);
              $vaccination.forEach((v) => {
                const benefitsVal = v.split(" ^ ");
                benefitsVal.forEach((e) => {
                  let [value, copays, planName] = e.split(" - ");
                let cc = {
                  id: "option-" + count,
                  label: value,
                  description: value,
                  conditions: [
                    {
                      type: "-Enum.conditions.deductible-",
                      value: OPCopayOptions
                    },
                    {
                      type: "-Enum.conditions.plans-",
                      value: [`-${provider}.plans${n}.${planName}-`]
                    }
                  ],
                };
                str.options.push(cc);
                count++;
                })
              });
            } else
              store.coPays.forEach((v) => {
                let [copay, scope] = v;
                let conditions = [];
                conditions.push({
                  type: "-Enum.conditions.deductible-",
                  value: [copay[0]],
                });
                if (!scope.includes("all")) {
                  let con = {
                    type: "-Enum.conditions.plans-",
                    value: [],
                  };
                  store.plans.forEach((m) => {
                    if (!scope.includes(m[1])) return;
                    con.value.push(`-${provider}.plans${n}.${m[0]}-`);
                  });
                  conditions.push(con);
                }
                let cc = {
                  id: "option-" + count,
                  label: copay[0],
                  description: copay[0],
                  conditions: [...conditions],
                };
                str.options.push(cc);
                count++;
              });
          }

          if (modifiers[key][0].value.toString().includes("$physiotherepy")) {
            str.options = [];
            str.hasOptions = true;
            let count = 1;
            if (DATA[0].$physiotherepy) {
              let $physiotherepy = DATA.reduce((acc, v) => {
                if (v.$physiotherepy) return [...acc, v.$physiotherepy];
                return acc;
              }, []);
              $physiotherepy.forEach((v) => {
                const benefitsVal = v.split(" ^ ");
                benefitsVal.forEach((e) => {
                  let [value, copays, planName] = e.split(" - ");
                let cc = {
                  id: "option-" + count,
                  label: value,
                  description: value,
                  conditions: [
                    {
                      type: "-Enum.conditions.deductible-",
                      value: OPCopayOptions
                    },
                    {
                      type: "-Enum.conditions.plans-",
                      value: [`-${provider}.plans${n}.${planName}-`]
                    }
                  ],
                };
                str.options.push(cc);
                count++;
                })
              });
            } else
              store.coPays.forEach((v) => {
                let [copay, scope] = v;
                let conditions = [];
                conditions.push({
                  type: "-Enum.conditions.deductible-",
                  value: [copay[0]],
                });
                if (!scope.includes("all")) {
                  let con = {
                    type: "-Enum.conditions.plans-",
                    value: [],
                  };
                  store.plans.forEach((m) => {
                    if (!scope.includes(m[1])) return;
                    con.value.push(`-${provider}.plans${n}.${m[0]}-`);
                  });
                  conditions.push(con);
                }
                let cc = {
                  id: "option-" + count,
                  label: copay[0],
                  description: copay[0],
                  conditions: [...conditions],
                };
                str.options.push(cc);
                count++;
              });
          }

          if (modifiers[key][0].value.toString().includes("$medicines")) {
            str.options = [];
            str.hasOptions = true;
            let count = 1;
            if (DATA[0].$medicines) {
              let $medicines = DATA.reduce((acc, v) => {
                if (v.$medicines) return [...acc, v.$medicines];
                return acc;
              }, []);
              $medicines.forEach((v) => {
                const benefitsVal = v.split(" ^ ");
                benefitsVal.forEach((e) => {
                  let [value, copays, planName] = e.split(" - ");
                let cc = {
                  id: "option-" + count,
                  label: value,
                  description: value,
                  conditions: [
                    {
                      type: "-Enum.conditions.deductible-",
                      value: OPCopayOptions
                    },
                    {
                      type: "-Enum.conditions.plans-",
                      value: [`-${provider}.plans${n}.${planName}-`]
                    }
                  ],
                };
                str.options.push(cc);
                count++;
                })
              });
            } else
              store.coPays.forEach((v) => {
                let [copay, scope] = v;
                let conditions = [];
                conditions.push({
                  type: "-Enum.conditions.deductible-",
                  value: [copay[0]],
                });
                if (!scope.includes("all")) {
                  let con = {
                    type: "-Enum.conditions.plans-",
                    value: [],
                  };
                  store.plans.forEach((m) => {
                    if (!scope.includes(m[1])) return;
                    con.value.push(`-${provider}.plans${n}.${m[0]}-`);
                  });
                  conditions.push(con);
                }
                let cc = {
                  id: "option-" + count,
                  label: copay[0],
                  description: copay[0],
                  conditions: [...conditions],
                };
                str.options.push(cc);
                count++;
              });
          }
          newArr.push(str);
        }
        // Addons --------------------------------------------
        store.filters.addons.map((addon) => {
          if (addon == "Repat") {
            let repat = { ...newArr[0] };
            repat._id = `-${provider}.modifiers${n}.benefits.extendedEvacuation-`;
            repat.title = "Extended Evacuation optional benefit";
            repat.label = "Extended Evacuation";
            repat.assignmentType = "PER_CUSTOMER";
            repat.isOptional = true;
            repat.description = "";
            repat.hasOptions = true;
            let i_ = newArr.length;
            newArr.push(repat);
            fetchAddons(newArr[i_], addon, folderName, provider, n, conversion);
            return;
          }
          let i_ = newArr.findIndex((v) => v.label == addon);
          fetchAddons(newArr[i_], addon, folderName, provider, n, conversion);
        });

                // Dependent benefits --------------------------------------------
                store.filters.dependentBenefits.map(({ core, dependent }) => {
                  let benefit = newArr.find((b) => b.title == dependent);
                  if (!benefit) throw new Error(`not found ${benefit}`);
                  benefit.dependsOn = `-${provider}.modifiers${n}.benefits.${
                    Benefits.find((v) => v.benefits[1] == core).benefits[0]
                  }-`;
                });

        // bundle benefits --------------------------------------------
        store.filters.bundleBenefits.map((v) => {
          let benefit = newArr.find((b) => b.title == v);
          if (!benefit) throw new Error(`not found ${benefit}`);
          benefit.dependentModifiers = [
            ...store.filters.bundleBenefits.reduce((acc, item) => {
              if (item == v) return acc;
              return [
                ...acc,
                `-${provider}.modifiers${n}.benefits.${
                  Benefits.find((v) => v.benefits[1] == item).benefits[0]
                }-`,
              ];
            }, []),
          ];
        });

      }
      if (key == "discount") {
        let str = {
          _id: `-${provider}.modifiers${n}.discount-`,
          plans: [...planIds],
          title: key,
          label: key,
          type: `-core.modifierTypes.discount-`,
          assignmentType: "PER_CUSTOMER",
          includedBenefits: [],
          isOptional: false,
          description: "",
          addonCost: {},
          premiumMod: "",
          conditions: [],
          hasOptions: true,
          options: []
        };
        // store[key].forEach((v1) => {
        //   let [discount, numCustomer] = v1;
          // str.options = {
          //   id: `${discount}-discount`,
          //   label: `${discount} Discount`,
          //   premiumMod: {
          //     type: "percentage",
          //     price: [{ value: -Number(discount.replace("%", "")) }],
          //   },
          //   description: `${discount} Discount`,
          //   conditions: [
          //     {
          //       type: "NUM_CUSTOMERS",
          //       value: Number(numCustomer),
          //     },
          //   ],
          // };
          // newArr.push(str);
        // });

        // [1,2].forEach((v) => {
          // if(v == 1) {
            str.options.push({
              id: `option-1`,
              label: `10% Discount`,
              premiumMod: {
                type: "percentage",
                price: [{ value: -10 }],
              },
              description: `10% Discount`,
              conditions: [
                {
                  type: "-Enum.conditions.plans-",
                  value: [`-${provider}.plans${n}.Silver-`],
                },
                {
                  type: "-Enum.customer.min_age-",
                  value: 60,
                },
                {
                  type: "-Enum.customer.max_age-",
                  value: 82,
                },
              ],
            });
              // newArr.push(str);

          // } else {
            str.options.push({
              id: "option-2",
              label: "10% Discount",
              premiumMod: { type: "percentage", price: [{ value: -10 }] },
              description: "10% Discount",
              conditions: [
                {
                  type: "-Enum.customer.config-",
                  value: [
                    {
                      type: "-Enum.customer.category-",
                      value:  `-Enum.category.primary-`,
                      count: "==1",
                    },
                    {
                      type: "-Enum.customer.relation-",
                      value:  `-Enum.relation.Spouse-`,
                      count: "==1",
                    },
                    {
                      type: "-Enum.customer.relation-",
                      value: `-Enum.relation.Child-`,
                      count: "==2",
                    },
                  ],
                },
              ],
            })
              // newArr.push(str);

          // }

        // })
        newArr.push(str);
        

      }
      // deductible -----------------------------------------
      if (key == "deductible") {
        if (store["coPays"].length > 0) {
          let splitted;
          let clonearray = [];
          let count = 1;
          let fileName;
          store["pricingTables"].forEach((plan) => {
            let [planName, coverage] = plan;
            addUp2[1] = 1;
            store.Networks.forEach((net) => {
              let bool = DATA.find((v) => {
                if (v.PlanName == planName[1]) {
                  return v["Network Details"].includes("/")
                    ? v["Network Details"].split("/").find((x) => x == net[1])
                    : v["Network Details"] == net[1];
                }
                return false;
              });
              if (!bool) return;
              if (splitFile && !included.includes(net[1])) {
                included.push(net[1]);
                comment2 += `// ${generateShortCode(net[1])} - ${
                  net[1]
                } (network) \n`;
              }
              coverage.forEach((cc) => {
                let c_id = `-${provider}.coverages${n}.${cc[0]}-`;
                if (splitFile && !included.includes(cc[1])) {
                  included.push(cc[1]);
                  comment2 += `// ${generateShortCode(cc[1])} - ${
                    cc[1]
                  } (coverage) \n`;
                }

                store["coPays"].forEach((v1, index) => {
                  let [copays, scope] = v1;
                  let [copay] = copays;
                  if (!scope.includes("all") && scope.includes(planName[1])) {
                    return;
                  }
                  if ([0, 1, "2a", "2b"].includes(rateSheet[0].singleChild)) {
                    [0, 1, "2a", "2b"].forEach((sc) => {
                      if (splitFile && !included.includes(copay)) {
                        included.push(copay);
                        comment2 += `// ${generateShortCode(
                          copay
                        )} - ${copay} (copay) \n`;
                      }
                      let copayArr = [];
                      clone = {
                        id: "option-" + count,
                        label: copay,
                        premiumMod: {
                          type: "conditional-override",
                          conditionalPrices: [],
                        },
                        conditions: [
                          {
                            type: "-Enum.conditions.modifier-", // Network modifier with OPTION ID Network_B included
                            value: [net[1]],
                          },
                          {
                            type: "-Enum.conditions.coverage-",
                            value: [c_id],
                          },
                          {
                            type: "-Enum.conditions.plans-",
                            value: [`-${provider}.plans${n}.${planName[0]}-`],
                          },
                          singleChild[`_${sc}`],
                        ],
                      };
                      store["frequency"].forEach((fr, f_index) => {
                        if (f_index > 0) return;
                        let pricing = rateSheet.filter((n) => {
                          // if (
                          //   n.planName == "IPMI 1" &&
                          //   n.coverage == "Worldwide excluding USA & Canada"
                          // ) {
                          //   console.log(
                          //     n.planName == plan[0][1],
                          //     n.coverage == cc[1],
                          //     n.frequency == fr,
                          //     n.network,
                          //     " | ",
                          //     net[1],
                          //     cc[1] == "Worldwide excluding USA & Canada",
                          //     "\n",
                          //     `-${cc[1]}-`,
                          //     " | ",
                          //     n.coverage
                          //   );
                          // }
                          // if (DATA[0].planCopay == "-Enum.maritalStatus.single-")
                          //   return (
                          //     n.planName == plan[0][1] &&
                          //     n.coverage == cc[1] &&
                          //     n.frequency == fr &&
                          //     n.network == net[1]
                          //   );
                          // let n_check;
                          // if (n.network != net[1]) {
                          //   n_check = DATA.find((dd) => dd.PlanName == plan[0][1])[
                          //     "Network Details"
                          //   ];
                          //   n_check = n_check.includes("/")
                          //     ? n_check.split("/")
                          //     : [n_check];
                          //   n_check = n_check.includes(net[1]);
                          // } else n_check = true;
                          return (
                            n.planName == plan[0][1] &&
                            n.coverage == cc[1] &&
                            n.copay == copay &&
                            n.frequency == fr &&
                            n.network == net[1] &&
                            n.singleChild == sc
                          );
                        });
                        // console.log(
                        //   "copay, plan --> ",
                        //   copay,
                        //   " || ",
                        //   planName[1],
                        //   " | '" +
                        //     plan[0][1] +
                        //     "' | '" +
                        //     cc[1] +
                        //     "' | '" +
                        //     copay +
                        //     "' | '" +
                        //     fr +
                        //     "' | '" +
                        //     net[1]
                        // );

                        if (
                          (DATA[0].planCopay == "single" ||
                            store.filters.networkType == "custom") &&
                          pricing.length == 0
                        )
                          return;
                        if (pricing.length == 0) {
                          throw new Error(
                            n +
                              " | '" +
                              plan[0][1] +
                              "' | '" +
                              cc[1] +
                              "' | '" +
                              copay +
                              "' | '" +
                              fr +
                              "' | '" +
                              net[1] +
                              "' | '" +
                              DATA[0].planCopay
                          );
                        }
                        if (!pricing[0].currency)
                          throw new Error(
                            "Currecny is not included in rateSheet",
                            n
                          );
                        let table = pricing.map((t) => {
                          let str = {
                            conditions: [
                              {
                                type: "-Enum.customer.min_age-",
                                value: t.ageStart,
                              },
                              {
                                type: "-Enum.customer.max_age-",
                                value: t.ageEnd,
                              },
                              {
                                type: "-Enum.customer.gender-",
                                value: `-Enum.gender.${t.gender}-`,
                              },
                            ],
                            price: [
                              {
                                value: parseFloat(t.rates / conversion),
                                currency: `-Enum.currency.${t.currency}-`,
                              },
                            ],
                          };
                          if (t.married === 0) {
                            str.conditions.push({
                              type: "-Enum.customer.maritalStatus-",
                              value: "-Enum.maritalStatus.married-",
                            });
                          }
                          if (t.married === 1) {
                            str.conditions.push({
                              type: "-Enum.customer.maritalStatus-",
                              value: "-Enum.maritalStatus.single-",
                            });
                          }
                          if (t.category)
                            str.conditions.push({
                              type: "-Enum.customer.category-",
                              value: `-Enum.category.${t.category}-`,
                            });
                          if (t.relation)
                            str.conditions.push({
                              type: "-Enum.customer.relation-",
                              value: `-Enum.relation.${t.relation}-`,
                            });

                          return { ...str };
                        });
                        if (splitFile) {
                          // console.log("length >>", table.length);
                          fileName = `${plan[0][0]}_${generateShortCode(
                            cc[0]
                          )}_${generateShortCode(net[0])}_${generateShortCode(
                            copay
                          )}_Config${sc}`;
                          splitted = splittingFile(
                            table,
                            plan[0][0],
                            "modifiers",
                            fileName
                              .split("_")
                              .filter((v, i) => i !== 0)
                              .join("_")
                          );

                          addUp2[0] += `const ${fileName} = require("./${plan[0][0]}/${fileName}.js"); `;
                        }
                        clone.premiumMod.conditionalPrices = splitted
                          ? `-[...${fileName}]-`
                          : [...table];
                      });
                      if (clone.premiumMod.conditionalPrices.length == 0)
                        return;
                      clonearray.push(clone);
                      count++;
                      addUp2[1]++;
                    });
                  } else {
                    if (splitFile && !included.includes(copay)) {
                      included.push(copay);
                      comment2 += `// ${generateShortCode(
                        copay
                      )} - ${copay} (copay) \n`;
                    }
                    let copayArr = [];
                    clone = {
                      id: "option-" + count,
                      label: copay,
                      premiumMod: {
                        type: "conditional-override",
                        conditionalPrices: [],
                      },
                      conditions: [
                        {
                          type: "-Enum.conditions.modifier-", // Network modifier with OPTION ID Network_B included
                          value: [net[1]],
                        },
                        {
                          type: "-Enum.conditions.coverage-",
                          value: [c_id],
                        },
                        {
                          type: "-Enum.conditions.plans-",
                          value: [`-${provider}.plans${n}.${planName[0]}-`],
                        },
                      ],
                    };
                    store["frequency"].forEach((fr, f_index) => {
                      if (f_index > 0) return;
                      let pricing = rateSheet.filter((n) => {
                        // if (
                        //   n.planName == "IPMI 1" &&
                        //   n.coverage == "Worldwide excluding USA & Canada"
                        // ) {
                        //   console.log(
                        //     n.planName == plan[0][1],
                        //     n.coverage == cc[1],
                        //     n.frequency == fr,
                        //     n.network,
                        //     " | ",
                        //     net[1],
                        //     cc[1] == "Worldwide excluding USA & Canada",
                        //     "\n",
                        //     `-${cc[1]}-`,
                        //     " | ",
                        //     n.coverage
                        //   );
                        // }
                        // if (DATA[0].planCopay == "-Enum.maritalStatus.single-")
                        //   return (
                        //     n.planName == plan[0][1] &&
                        //     n.coverage == cc[1] &&
                        //     n.frequency == fr &&
                        //     n.network == net[1]
                        //   );
                        // let n_check;
                        // if (n.network != net[1]) {
                        //   n_check = DATA.find((dd) => dd.PlanName == plan[0][1])[
                        //     "Network Details"
                        //   ];
                        //   n_check = n_check.includes("/")
                        //     ? n_check.split("/")
                        //     : [n_check];
                        //   n_check = n_check.includes(net[1]);
                        // } else n_check = true;
                        return (
                          n.planName == plan[0][1] &&
                          n.coverage == cc[1] &&
                          n.copay == copay &&
                          n.frequency == fr &&
                          n.network == net[1]
                        );
                      });
                      // console.log(
                      //   "copay, plan --> ",
                      //   copay,
                      //   " || ",
                      //   planName[1],
                      //   " | '" +
                      //     plan[0][1] +
                      //     "' | '" +
                      //     cc[1] +
                      //     "' | '" +
                      //     copay +
                      //     "' | '" +
                      //     fr +
                      //     "' | '" +
                      //     net[1]
                      // );

                      if (DATA[0].planCopay == "single" && pricing.length == 0)
                        return;
                      if (pricing.length == 0) {
                        throw new Error(
                          n +
                            " | '" +
                            plan[0][1] +
                            "' | '" +
                            cc[1] +
                            "' | '" +
                            copay +
                            "' | '" +
                            fr +
                            "' | '" +
                            net[1] +
                            "' | '" +
                            DATA[0].planCopay
                        );
                      }
                      if (!pricing[0].currency)
                        throw new Error(
                          "Currecny is not included in rateSheet",
                          n
                        );
                      let table = pricing.map((t) => {
                        let str = {
                          conditions: [
                            {
                              type: "-Enum.customer.min_age-",
                              value: t.ageStart,
                            },
                            {
                              type: "-Enum.customer.max_age-",
                              value: t.ageEnd,
                            },
                            {
                              type: "-Enum.customer.gender-",
                              value: `-Enum.gender.${t.gender}-`,
                            },
                          ],
                          price: [
                            {
                              value: parseFloat(t.rates / conversion),
                              currency: `-Enum.currency.${t.currency}-`,
                            },
                          ],
                        };
                        if (t.married === 0) {
                          str.conditions.push({
                            type: "-Enum.customer.maritalStatus-",
                            value: "-Enum.maritalStatus.married-",
                          });
                        }
                        if (t.married === 1) {
                          str.conditions.push({
                            type: "-Enum.customer.maritalStatus-",
                            value: "-Enum.maritalStatus.single-",
                          });
                        }
                        if (t.category)
                          str.conditions.push({
                            type: "-Enum.customer.category-",
                            value: `-Enum.category.${t.category}-`,
                          });
                        if (t.relation)
                          str.conditions.push({
                            type: "-Enum.customer.relation-",
                            value: `-Enum.relation.${t.relation}-`,
                          });
                        if (
                          t.singleChild == 0 ||
                          t.singleChild == 1 ||
                          t.singleChild == 2 ||
                          t.singleChild
                        ) {
                          str.conditions.push(singleChild[`_${t.singleChild}`]);
                        }
                        return { ...str };
                      });
                      if (splitFile) {
                        // console.log("length >>", table.length);
                        fileName = `${plan[0][0]}_${generateShortCode(
                          cc[0]
                        )}_${generateShortCode(net[0])}_${generateShortCode(
                          copay
                        )}`;
                        splitted = splittingFile(
                          table,
                          plan[0][0],
                          "modifiers",
                          fileName
                            .split("_")
                            .filter((v, i) => i !== 0)
                            .join("_")
                        );

                        addUp2[0] += `const ${fileName} = require("./${plan[0][0]}/${fileName}.js"); `;
                      }
                      clone.premiumMod.conditionalPrices = splitted
                        ? `-[...${fileName}]-`
                        : [...table];
                    });
                    if (clone.premiumMod.conditionalPrices.length == 0) return;
                    clonearray.push(clone);
                    count++;
                    addUp2[1]++;
                  }
                });
              });
            });
          });

          str = {
            _id: `-${provider}.modifiers${n}.deductible-`,
            plans: [...planIds],
            title: "Deductible modifier",
            label: "Deductibles",
            type: `-core.modifierTypes.deductible-`,
            assignmentType: "PER_CUSTOMER",
            includedBenefits: [],
            isOptional: true,
            description: "",
            addonCost: {},
            premiumMod: "",
            conditions: [],
            hasOptions: true,
            options: clonearray,
          };
          newArr.push({ ...str });
        }
        if (store["coPayIP"].length > 0) {
          let splitted;
          let clonearray = [];
          let count = 1;
          let fileName;
          
          // console.log("1 >> ", store["pricingTables"].length)
          // console.log("3 >> ", store["coPayIP"].length)
          store["pricingTables"].forEach((plan) => {
            let [planName, coverage] = plan;
          // console.log("2 >> ", coverage.length)

            addUp2[1] = 1;
            store.Networks.forEach((net) => {
              let bool = DATA.find((v) => {
                if (v.PlanName == planName[1]) {
                  return v["Network Details"].includes("/")
                    ? v["Network Details"].split("/").find((x) => x == net[1])
                    : v["Network Details"] == net[1];
                }
                return false;
              });
              if (!bool) return;
              if (splitFile && !included.includes(net[1])) {
                included.push(net[1]);
                comment2 += `// ${generateShortCode(net[1])} - ${
                  net[1]
                } (network) \n`;
              }
              coverage.forEach((cc) => {
                let c_id = `-${provider}.coverages${n}.${cc[0]}-`;
                if (splitFile && !included.includes(cc[1])) {
                  included.push(cc[1]);
                  comment2 += `// ${generateShortCode(cc[1])} - ${
                    cc[1]
                  } (coverage) \n`;
                }
                store["coPayIP"].forEach((v1, index) => {
                  let [copays, scope] = v1;
                  let [copay] = copays;
                  if (!scope.includes("all") && scope.includes(planName[1])) {
                    return;
                  }
                  let copayArr = [];
                  clone = {
                    id: "ip-option-" + (index+1),
                    label: copay,
                    conditions: [
                      {
                        type: "-Enum.conditions.modifier-", // Network modifier with OPTION ID Network_B included
                        value: [net[1]],
                      },
                      {
                        type: "-Enum.conditions.coverage-",
                        value: [c_id],
                      },
                      {
                        type: "-Enum.conditions.plans-",
                        value: [`-${provider}.plans${n}.${planName[0]}-`],
                      },
                    ],
                  };
                  clonearray.push(clone);
                  count++;
                  addUp2[1]++;
                  residencyIPOptions++;
                });
              });
            });
          });

          str = {
            _id: `-${provider}.modifiers${n}.deductible.IP-`,
            plans: [...planIds],
            title: "Deductible modifier",
            label: "Deductibles",
            type: `-core.modifierTypes.deductible-`,
            inputLabel: "IP Co/pay",
            assignmentType: "PER_CUSTOMER",
            includedBenefits: [],
            isOptional: false,
            description: "",
            addonCost: {},
            premiumMod: "",
            conditions: [],
            hasOptions: true,
            options: clonearray,
          };
          newArr.push({ ...str });
        }
        if (store["coPayOP"].length > 0) {
          let splitted;
          let clonearray = [];
          let count = 1;
          let fileName;
          store["pricingTables"].forEach((plan) => {
            let [planName, coverage] = plan;
            addUp2[1] = 1;
            store.Networks.forEach((net) => {
              let bool = DATA.find((v) => {
                if (v.PlanName == planName[1]) {
                  return v["Network Details"].includes("/")
                    ? v["Network Details"].split("/").find((x) => x == net[1])
                    : v["Network Details"] == net[1];
                }
                return false;
              });
              if (!bool) return;
              if (splitFile && !included.includes(net[1])) {
                included.push(net[1]);
                comment2 += `// ${generateShortCode(net[1])} - ${
                  net[1]
                } (network) \n`;
              }
              coverage.forEach((cc) => {
                let c_id = `-${provider}.coverages${n}.${cc[0]}-`;
                if (splitFile && !included.includes(cc[1])) {
                  included.push(cc[1]);
                  comment2 += `// ${generateShortCode(cc[1])} - ${
                    cc[1]
                  } (coverage) \n`;
                }
                store["coPayOP"].forEach((v1, index) => {
                  // console.log("residencyOPOptions >> ", residencyOPOptions)
                  let [copays, scope] = v1;
                  let [copay] = copays;
                  if (!scope.includes("all") && scope.includes(planName[1])) {
                    return;
                  }
                  let copayArr = [];
                  clone = {
                    id: "op-option-" + (index+1),
                    label: copay,
                    conditions: [
                      {
                        type: "-Enum.conditions.modifier-", // Network modifier with OPTION ID Network_B included
                        value: [net[1]],
                      },
                      {
                        type: "-Enum.conditions.coverage-",
                        value: [c_id],
                      },
                      {
                        type: "-Enum.conditions.plans-",
                        value: [`-${provider}.plans${n}.${planName[0]}-`],
                      },
                    ],
                  };
                  clonearray.push(clone);
                  count++;
                  addUp2[1]++;
                  residencyOPOptions++;
                });
              });
            });
          });

          str = {
            _id: `-${provider}.modifiers${n}.deductible.OP-`,
            plans: [...planIds],
            title: "Deductible modifier",
            label: "Deductibles",
            type: `-core.modifierTypes.deductible-`,
            assignmentType: "PER_CUSTOMER",
            includedBenefits: [],
            inputLabel: "OP Co/pay",
            isOptional: true,
            description: "",
            addonCost: {},
            premiumMod: "",
            conditions: [],
            hasOptions: true,
            options: clonearray,
          };
          newArr.push({ ...str });
        }
      }
      // network -----------------------------------------
      if (key == "network") {
        if (
          store.filters.networkType == "multiple" ||
          store.filters.networkType == "custom"
        ) {
          let str = {
            _id: `-${provider}.modifiers${n}.network-`,
            plans: [...planIds],
            title: "Network modifier",
            label: "Network",
            type: `-core.modifierTypes.network-`,
            assignmentType: "PER_PLAN",
            includedBenefits: [],
            isOptional: false,
            description: "",
            addonCost: {},
            premiumMod: "",
            conditions: [],
            hasOptions: true,
            options: [],
          };
          store.Networks.forEach((net) => {
            str.options.push({
              id: net[1],
              label: net[1],
              description: net[1],
            });
          });
          newArr.push({ ...str });
        } else {
          for (let ff in Id.modifiers[key]) {
            let netlabel = store.Networks.find((n) => n.includes(ff))[1];
            let filtered_plans = store.plans.filter((pp) => {
              let n_check = DATA.find((dd) => dd.PlanName == pp[1])[
                "Network Details"
              ];

              let nn = store.Networks.find((n) => n[1] == n_check)[0];
              return nn == ff;
            });
            let p_ = filtered_plans.map(
              (v) => `-${provider}.plans${n}.${v[0]}-`
            );
            let str = {
              _id: `-${provider}.modifiers${n}.network.${ff}-`,
              plans: p_,
              title: "Network modifier",
              label: "Network",
              type: `-core.modifierTypes.network-`,
              assignmentType: "PER_PLAN",
              includedBenefits: [],
              isOptional: false,
              description: "",
              addonCost: {},
              premiumMod: "",
              conditions: [],
              hasOptions: true,
              options: [
                {
                  id: netlabel,
                  label: netlabel,
                  description: netlabel,
                },
              ],
            };
            newArr.push({ ...str });
          }
        }
      }
      // paymentFrequency -----------------------------------
      if (key == "paymentFrequency") {
        let name = "frequency";

        function rateExtraction(fr, struc, obj) {
          let clonearray = [];
          let count = 1;
          store["pricingTables"].forEach((plan) => {
            let [planName, coverage] = plan;
            store.Networks.forEach((net) => {
              let bool = DATA.find((v) => {
                if (v.PlanName == planName[1]) {
                  return v["Network Details"].includes("/")
                    ? v["Network Details"].split("/").find((x) => x == net[1])
                    : v["Network Details"] == net[1];
                }
                return false;
              });
              if (!bool) return;
              coverage.forEach((cc) => {
                let c_id = `-${provider}.coverages${n}.${cc[0]}-`;
                store["coPays"].forEach((v1, index) => {
                  let [copays, scope] = v1;
                  let [copay] = copays;
                  if (!scope.includes("all") && scope.includes(planName[1]))
                    return;
                  let copayArr = [];
                  clone = {
                    id: "option-" + count,
                    premiumMod: {
                      type: "conditional-override",
                      conditionalPrices: [],
                    },
                    conditions: [
                      {
                        type: "-Enum.conditions.modifier-", // Network modifier with OPTION ID Network_B included
                        value: [net[1]],
                      },
                      {
                        type: "-Enum.conditions.coverage-",
                        value: [c_id],
                      },
                      {
                        type: "-Enum.conditions.plans-",
                        value: [`-${provider}.plans${n}.${planName[0]}-`],
                      },
                      { type: "-Enum.conditions.deductible-", value: [copay] },
                    ],
                  };
                  let pricing = rateSheet.filter((n) => {
                    // if (n.planName == "Limited") {
                    //   console.log(
                    //     n.planName == plan[0][1],
                    //     n.coverage == cc[1],
                    //     n.frequency == fr,
                    //     n.network,
                    //     " | ",
                    //     net[1]
                    //   );
                    // }
                    // if (DATA[0].planCopay == "-Enum.maritalStatus.single-")
                    //   return (
                    //     n.planName == plan[0][1] &&
                    //     n.coverage == cc[1] &&
                    //     n.frequency == fr &&
                    //     n.network == net[1]
                    //   );
                    // let n_check;
                    // if (n.network != net[1]) {
                    //   n_check = DATA.find((dd) => dd.PlanName == plan[0][1])[
                    //     "Network Details"
                    //   ];
                    //   n_check = n_check.includes("/")
                    //     ? n_check.split("/")
                    //     : [n_check];
                    //   n_check = n_check.includes(net[1]);
                    // } else n_check = true;
                    return (
                      n.planName == plan[0][1] &&
                      n.coverage == cc[1] &&
                      n.copay == copay &&
                      n.frequency == fr &&
                      n.network == net[1]
                    );
                  });
                  if (DATA[0].planCopay == "single" && pricing.length == 0)
                    return;
                  if (pricing.length == 0) {
                    throw new Error(
                      n +
                        " | '" +
                        plan[0][1] +
                        "' | '" +
                        cc[1] +
                        "' | '" +
                        copay +
                        "' | '" +
                        fr +
                        "' | '" +
                        net[1] +
                        "' | '" +
                        DATA[0].planCopay
                    );
                  }
                  if (!pricing[0].currency)
                    throw new Error("Currecny is not included in rateSheet", n);
                  let table = pricing.map((t) => {
                    let str = {
                      conditions: [
                        {
                          type: "-Enum.customer.min_age-",
                          value: t.ageStart,
                        },
                        {
                          type: "-Enum.customer.max_age-",
                          value: t.ageEnd,
                        },
                        {
                          type: "-Enum.customer.gender-",
                          value: `-Enum.gender.${t.gender}-`,
                        },
                      ],
                      price: [
                        {
                          value: parseFloat(t.rates / conversion),
                          currency: `-Enum.currency.${t.currency}-`,
                        },
                      ],
                    };
                    if (t.married === 0) {
                      str.conditions.push({
                        type: "CUSTOMER_MARITAL_STATUS",
                        value: "-Enum.maritalStatus.married-",
                      });
                    }
                    if (t.married === 1) {
                      str.conditions.push({
                        type: "CUSTOMER_MARITAL_STATUS",
                        value: "-Enum.maritalStatus.single-",
                      });
                    }
                    if (t.category)
                      str.category = `-Enum.category.${t.category}-`;

                    return { ...str };
                  });
                  clone.premiumMod.conditionalPrices = table;
                  if (clone.premiumMod.conditionalPrices.length == 0) return;
                  let newFrequency = { ...struc };
                  newFrequency.id = newFrequency.id + "-" + count;
                  newFrequency.premiumMod = clone.premiumMod;
                  newFrequency.conditions = clone.conditions;
                  obj.push(newFrequency);
                  count++;
                });
              });
            });
          });
          return clonearray;
        }
        // paymentFrequency -----------------------------------------
        store[name].forEach((v1, index) => {
          if (index > 0) return;
          if (key == "paymentFrequency") {
            let str = {
              _id: `-${provider}.modifiers${n}.paymentFrequency.${v1}-`,
              plans: [...planIds],
              title: "Payment Frequency Modifier",
              label: "Additional Surcharges",
              type: `-core.modifierTypes.paymentFrequency-`,
              assignmentType: "PER_CUSTOMER",
              includedBenefits: [],
              isOptional: false,
              description: "",
              addonCost: {},
              premiumMod: "",
              conditions: [],
              hasOptions: true,
              options: [
                {
                  id: "annual-payment-surcharge",
                  label: "Annual",
                  premiumMod: {
                    type: "percentage",
                    price: [
                      {
                        value: 0,
                      },
                    ],
                  },
                },
              ],
            };
            if (DATA[0]["Semi Annual Surcharge"] != "N/A") {
              let semiAnnual = {
                id: "semi-annual-payment-surcharge",
                description: "Semmi-annual payment",
                title: "Semi-annual payment",
                label: "Semi-annual",
                premiumMod: {},
              };
              if (DATA.find((v) => v.frequency == "Semi-Annually")) {
                rateExtraction("Semi-Annually", semiAnnual, str.options);
              } else {
                semiAnnual.premiumMod = {
                  type: "percentage",
                  price: [
                    {
                      value: +parseInt(DATA[0]["Semi Annual Surcharge"]),
                    },
                  ],
                };
                str.options.push(semiAnnual);
              }
            }
            if (DATA[0]["Quarterly Surcharge"] != "N/A") {
              let quarterly = {
                id: "quarterly-payment-surcharge",
                title: "Quarterly Surcharge payment",
                label: "Quarterly",
                description: "Quarterly Surcharge payment frequency",
                premiumMod: {},
              };
              if (DATA.find((v) => v.frequency == "Quarterly")) {
                rateExtraction("Quarterly", quarterly, str.options);
              } else {
                quarterly.premiumMod = {
                  type: "percentage",
                  price: [
                    {
                      // value: +parseInt(DATA[0]["Quarterly Surcharge"]),
                      value: 7,
                    },
                  ],
                };
                str.options.push(quarterly);
              }
            }
            if (DATA[0]["Monthly Surcharge"] != "N/A") {
              let monthly = {
                id: "monthly-payment-surcharge",
                title: "Monthly Surcharge payment",
                label: "Monthly",
                description: "Monthly Surcharge payment frequency",
                premiumMod: {},
              };
              if (DATA.find((v) => v.frequency == "Monthly")) {
                rateExtraction("Monthly", monthly, str.options);
              } else {
                monthly.premiumMod = {
                  type: "percentage",
                  price: [
                    {
                      // value: +parseInt(DATA[0]["Monthly Surcharge"]),
                      value: 11.111111111,
                    },
                  ],
                };
                str.options.push(monthly);
              }
            }
            newArr.push({ ...str });
          }
        });
      }
    });
    // custom code here ----------------------------------
    // extra ---------------------------------------------
    // if (DATA[0].extra) {
    //   let extraArr = [];
    //   DATA.forEach((v) => {
    //     v.extra && extraArr.push(v.extra);
    //   });
    //   extraArr.forEach((v1) => {
    //     // set code here for extra benefits
    //     if (v1 === "Healthy Connect Module") {
    //       let clonearray = [];
    //       store["pricingTables"].forEach((plan) => {
    //         let [planName, coverage] = plan;
    //         store.Networks.forEach((net) => {
    //           coverage.forEach((cc) => {
    //             let c_id = Ids.coverages[cc];
    //             store["coPays"].forEach((v2, index) => {
    //               let [copay] = v2;
    //               let count = 1;
    //               let copayArr = [];
    //               clone = {
    //                 id: "option-" + (index + 1),
    //                 label: copay,
    //                 premiumMod: {
    //                   type: "conditional-override",
    //                   conditionalPrices: [],
    //                 },
    //                 conditions: [
    //                   {
    //                     type: "-Enum.conditions.modifier-", // Network modifier with OPTION ID Network_B included
    //                     value: [net],
    //                   },
    //                   {
    //                     type: "-Enum.conditions.coverage-",
    //                     value: [c_id],
    //                   },
    //                   {
    //                     type: "-Enum.conditions.plans-",
    //                     value: [Ids["plans"][planName]],
    //                   },
    //                   {
    //                     type: "FREQUENCY_EQUALS_TO",
    //                     value: [Ids["paymentFrequency"][v1]],
    //                   },
    //                 ],
    //               };
    //               store["frequency"].forEach((fr, f_index) => {
    //                 let pricing = rateSheet.filter((n) => {
    //                   // if (n.copay == "Nil") return false;
    //                   return (
    //                     n.planName == plan[0] &&
    //                     n.coverage == cc &&
    //                     n.copay == copay &&
    //                     n.frequency == v1 &&
    //                     n.network == net
    //                   );
    //                 });
    //                 let table = pricing.map((t) => {
    //                   let str = {
    //                     conditions: [
    //                       {
    //                         type: "-Enum.customer.min_age-",
    //                         value: t.ageStart,
    //                       },
    //                       {
    //                         type: "-Enum.customer.max_age-",
    //                         value: t.ageEnd,
    //                       },
    //                       {
    //                         type: "-Enum.customer.gender-",
    //                         value: t.gender.toLowerCase(),
    //                       },
    //                     ],
    //                     price: [
    //                       {
    //                         value:
    //                           parseFloat((t.rates / conversion)) +
    //                           (t.healthy / conversion),
    //                         currency: t.currency,
    //                       },
    //                     ],
    //                   };
    //                   return { ...str };
    //                 });
    //                 clone.premiumMod.conditionalPrices = table;
    //               });
    //               clonearray.push(clone);
    //             });
    //           });
    //         });
    //       });
    //       let str = {
    //         _id: Ids.modifiers["benefits"][v1],
    //         plans: [...planIds],
    //         title: v1,
    //         label: v1,
    //         type: "",
    //         assignmentType: "PER_CUSTOMER",
    //         includedBenefits: [],
    //         isOptional: false,
    //         description: "",
    //         addonCost: {},
    //         premiumMod: "",
    //         conditions: [],
    //         hasOptions: true,
    //         options: clonearray,
    //       };
    //       newArr.push({ ...str });
    //     }
    //     if (v1 === "Mother & Baby Module") {
    //       let clonearray = [];
    //       GlobalData["pricingTables"].forEach((plan) => {
    //         let [planName, coverage] = plan;
    //         GlobalData.Networks.forEach((net) => {
    //           coverage.forEach((cc) => {
    //             let c_id = Ids.coverages[cc];
    //             GlobalData["coPays"].forEach((v2, index) => {
    //               let [copay] = v2;
    //               let count = 1;
    //               let copayArr = [];
    //               clone = {
    //                 id: "option-" + (index + 1),
    //                 label: copay,
    //                 premiumMod: {
    //                   type: "conditional-override",
    //                   conditionalPrices: [],
    //                 },
    //                 conditions: [
    //                   {
    //                     type: "-Enum.conditions.modifier-", // Network modifier with OPTION ID Network_B included
    //                     value: [net],
    //                   },
    //                   {
    //                     type: "-Enum.conditions.coverage-",
    //                     value: [c_id],
    //                   },
    //                   {
    //                     type: "-Enum.conditions.plans-",
    //                     value: [Ids["plans"][planName]],
    //                   },
    //                   {
    //                     type: "FREQUENCY_EQUALS_TO",
    //                     value: [Ids["paymentFrequency"][v1]],
    //                   },
    //                 ],
    //               };
    //               GlobalData["frequency"].forEach((fr, f_index) => {
    //                 let pricing = rateSheet.filter((n) => {
    //                   // if (n.copay == "Nil") return false;
    //                   return (
    //                     n.planName == plan[0] &&
    //                     n.coverage == cc &&
    //                     n.copay == copay &&
    //                     n.frequency == v1 &&
    //                     n.network == net
    //                   );
    //                 });
    //                 let table = pricing.map((t) => {
    //                   let str = {
    //                     conditions: [
    //                       {
    //                         type: "-Enum.customer.min_age-",
    //                         value: t.ageStart,
    //                       },
    //                       {
    //                         type: "-Enum.customer.max_age-",
    //                         value: t.ageEnd,
    //                       },
    //                       {
    //                         type: "-Enum.customer.gender-",
    //                         value: t.gender.toLowerCase(),
    //                       },
    //                     ],
    //                     price: [
    //                       {
    //                         value:
    //                           parseFloat((t.rates / conversion)) +
    //                           (t.healthy / conversion),
    //                         currency: t.currency,
    //                       },
    //                     ],
    //                   };
    //                   return { ...str };
    //                 });
    //                 clone.premiumMod.conditionalPrices = table;
    //               });
    //               clonearray.push(clone);
    //             });
    //           });
    //         });
    //       });
    //       let index = newArr.findIndex(
    //         (v) =>
    //           v.title == "Maternity (Consultations, Scans and Delivery)"
    //       );
    //       newArr[index].hasOptions = true;
    //       newArr[index].options = copayArr;
    //     }
    //   });
    // }
    return newArr;
  }
  let comment2 = "// ";
  let addUp2 = ["", 1];
  let included = [];
  let modifierArr = Arr.reduce((acc, v, i) => {
    let data = modifiers(
      GlobalDatas[i],
      Ids[i],
      DATAs[i],
      resCount > 1 ? i + 1 : "",
      rateSheets[i]
    );
    return [...acc, ...data];
  }, []);
  createFile(
    "modifiers",
    "index",
    modifierArr,
    provider,
    true,
    true,
    comment2,
    addUp2[0]
  );
  // ----------------------------------------------------------------------------------------------------

  // --------------------------------- Rate Table -------------------------------------------------------
  function rateTable(store, Id, rateSheet, provider, count) {
    try {
      let result = [];
      let num = 1;
      store?.plans.forEach((plan, l) => {
        store.coverages.forEach((coverages, k) => {
          let coverage = coverages.coverageName;
          ["coPayIP", "coPayOP"].forEach((types, j) => {
            store[types].forEach((copays, i) => {
              let [copay] = copays;
              let type = types.split("y")[1];
              let Schema = {
                _id: `-generateMongoIdFromString('${provider} rateTable ${
                  l + Math.floor(Math.random() * 900) + 100
                } ${k + Math.floor(Math.random() * 900) + 100} ${
                  j + Math.floor(Math.random() * 900) + 100
                } ${i + Math.floor(Math.random() * 900) + 100}')-`,
                plans: [`-${provider}.plans${count + 1}.${plan[1]}-`],
                filters: [
                  {
                    type: "DEDUCTIBLE",
                    // values: [`${type.toLowerCase()}-option-${l + 1} ${k + 1} ${j + 1} ${i + 1}`],
                    // value: `-cigna_global_health.modifiers.deductible.${type}-`,
                    // value: `${type.toLowerCase()}-option-${type.toLowerCase() == "ip" ? residencyIPOptionsRatetable : residencyOPOptionsRatetable}`,
                    value: `${type.toLowerCase()}-option-${i+1}`,
                  },
                  {
                    type: "COVERAGE",
                    value: `-cigna_global_health.coverages${count + 1}.${
                      coverage[0]
                    }-`,
                  },
                ],
                rates: [],
              };
              let rates = rateSheet
                .filter(
                  (v) =>
                    v.type == type &&
                    v.planName == plan[1] &&
                    coverage[1] == v.coverages &&
                    copay[0] == v.copay
                )
                .map((v) => {
                  return {
                    price: { currency: "-Enum.currency.USD-", price: parseFloat(v.rates*12) },
                    customer: {
                      from: v.ageStart,
                      to: v.ageEnd,
                    },
                  };
                });

                // !rates.length && console.log('rates >> ', type, plan[1], coverage[1], copay[0]);
                // rates.length && console.log('found rates >> ', type, plan[1], coverage[1], copay[0]);
              // if (rates.length == 0) {
              //   console.log("--> ", type, plan[1], coverage[1], copay);

              //   throw new Error("rates 0");
              // }

              Schema.rates = rates;
              result.push(Schema);
              // type.toLowerCase() == "ip" ? residencyIPOptionsRatetable++ : residencyOPOptionsRatetable++
            });
          });
        });
      });
      return result;
    } catch (error) {
      console.log("error --> ", { msg: error.message, stack: error.stack });
    }
  }

  fs.mkdirSync(`Output/RateTable`)
  let residenciesRequire = ``
  let rateArr = Arr.reduce((acc, v, i) => {
    let data = rateTable(GlobalDatas[i], Ids[i], rateSheets[i], provider, i);
    const residencyName = DATAs[i][0].residency.replaceAll(" ", "").replaceAll("-", "")

    data = JSON.stringify(data);
    data = data.replace(/"-/g, "");
    data = data.replace(/-"/g, "");
    data = data.replace(/\n/g, "");
    let str = `
    const ${provider} = require("../../core-index.js");
    const Enum = require("../../../enum.js")
    const Utils = require("../../../../services/utils/utils");
    const utils = new Utils({ config: { logging: false } });
    const { generateMongoIdFromString } = utils;
    let ${residencyName} = ${data} ;
    module.exports = ${residencyName} ;`;

    if (!fs.existsSync(`Output/RateTable/${residencyName}`)) {
      fs.mkdirSync(`Output/RateTable/${residencyName}`);
    fs.appendFileSync(`Output/RateTable/${residencyName}/index.js`, str)
    };

    residenciesRequire += `const ${residencyName} = require("./${residencyName}/index.js");`

    return [...acc, `-...${residencyName}-`];
  }, []);
  createFile("RateTable", "index", rateArr, provider, false, true, false, false, residenciesRequire);
})();
