const fs = require("fs");
const xlsx = require("xlsx");
const { maxArrLength, singleChild } = require("./constants");

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
    alphaCodes: [],
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
    alphaCodes: [],
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

const remove = (str, n) => {
  !str && console.log("n --> ", n, str);
  let v = str;
  str = str.toString();
  if (str.includes(" ")) {
    str = str
      .split(" ")
      .map((v) => v.replace(v[0], v[0]?.toUpperCase()))
      .join("");
  }
  if (str.includes("&")) {
    str = str.split("&").join("And");
  }
  if (str.includes("-")) {
    str = str
      .split("-")
      .map((v, i) => (i == 1 ? v.replace(v[0], v[0].toUpperCase()) : v))
      .join("");
  }
  while (str.includes(",")) str = str.replace(",", "");
  while (str.includes(":")) str = str.replace(":", "");
  while (str.includes(".")) str = str.replace(".", "");
  while (str.includes("(")) str = str.replace("(", "");
  while (str.includes(")")) str = str.replace(")", "");
  while (str.includes("/")) str = str.replace("/", "Or");
  while (str.includes("+")) str = str.replace("+", "plus");
  while (str.includes("*")) str = str.replace("*", "");
  while (str.includes("\n")) str = str.replace("\n", "");
  return [str, v];
};

const getList = (arr) => {
  try {
    let Global = {
      plans: [],
      coverages: [],
      coPays: [],
      pricingTables: [],
      Modifiers: [
        "benefits",
        "paymentFrequency",
        "deductible",
        "discount",
        "network",
      ],
      Networks: [],
      discount: [],
      Provider: arr[0].companyName,
      frequency: [],
      startDate: arr[0].startDate,
      endDate: arr[0].endDate,
      residency: arr[0].residency,
      Deductibles: [],
      filters: {
        networkType: "",
        frequency: "",
        notIncludedBenefits: [],
        addons: [],
        bundleBenefits: [],
        dependentBenefits: [],
      },
    };

    if (arr[0].networkType == "custom") Global.filters.networkType = "custom";
    else if (arr[0].NetworkDetails.includes("/"))
      Global.filters.networkType = "multiple";
    else Global.filters.networkType = "single";

    arr.forEach((v) => {
      if (v.filters == "frequency") Global.filters.frequency = "custom";
    });

    arr.forEach((v) => {
      // plans ---------------------------
      v["PlanName"] && Global.plans.push(remove(v["PlanName"]));

      // Copay -----------------------------
      if (v.copay) {
        let v1 = !v.copay.includes(" - ")
          ? ["all"]
          : v.copay.split(" - ")[1].includes(",")
          ? v.copay.split(" - ")[1].split(",")
          : v.copay.split(" - ")[1];
        let v2 = v.copay.includes(" - ")
          ? v.copay.split(" - ")[0].split("/")
          : v.copay.split("/");
        Global.coPays.push([v2, v1]);
      }
      if (v.copayIP) {
        if (!Global.coPayIP) Global.coPayIP = [];
        let v1 = ["all"];
        let v2 = [
          v.copayIP
            .split(", ")
            .map((v) => (v.includes(" - ") ? v.split(" - ")[0] : v))
            .join(", "),
        ];
        Global.coPayIP.push([[v.copayIP], v1]);
      }
      if (v.copayOP) {
        if (!Global.coPayOP) Global.coPayOP = [];
        let v1 = ["all"];
        let v2 = [
          v.copayOP
            .split(", ")
            .map((v) => (v.includes(" - ") ? v.split(" - ")[0] : v))
            .join(", "),
        ];
        Global.coPayOP.push([[v.copayOP], v1]);
      }

      if (v.Deductible) {
        if (!Global.Deductibles) Global.Deductibles = [];
        let v1 = ["all"];
        let v2 = [
          v.Deductible
            .split(", ")
            .map((v) => (v.includes(" - ") ? v.split(" - ")[0] : v))
            .join(", "),
        ];
        Global.Deductibles.push([[v.Deductible], v2]);
      }

      // Discounts -------------------------------
      v.discounts &&
        Global.discount.push([
          v.discounts.split(" - ")[0],
          v.discounts.split(" - ")[1],
        ]);

      // coverages -----------------------------------------------------------
      let obj = {
        coverageName: "",
        includedCountries: [],
        excludedCountries: [],
      };
      if (v.coverages) {
        obj.coverageName = v.coverages;
        if (v.included)
          obj.includedCountries = v.included.includes(",")
            ? v.included.split(",")
            : [v.included];
        if (v.excluded)
          obj.excludedCountries = v.excluded.includes(",")
            ? v.excluded.split(",")
            : [v.excluded];
      }
      let check;
      if (Global.coverages.length > 0) {
        check = Global.coverages.find((v) => v.coverageName == v.coverages)
          ? false
          : true;
      } else {
        check = true;
      }
      v.coverages &&
        check &&
        Global.coverages.push({
          ...obj,
          coverageName: remove(obj.coverageName),
        });
      // Networks ------------------------------------------------------------------
      if (v.NetworkDetails) {
        let net = v.NetworkDetails.includes("/")
          ? v.NetworkDetails.split("/")
          : v.NetworkDetails;

        if (v.NetworkDetails.includes("/"))
          net.forEach(
            (n) =>
              !Global.Networks.find((v) => v?.includes(n)) &&
              Global.Networks.push(remove(n))
          );
        else
          !Global.Networks.find((p) => p.includes(v.NetworkDetails)) &&
            Global.Networks.push(remove(v.NetworkDetails));
      }

      // Frequency -----------------------------------------------------------------
      if (v.frequency) Global.frequency.push(v.frequency);
    });
    // Pricing Table -----------------------
    Global.plans.forEach((plan) => {
      let v = arr.find((v) => v.PlanName === plan[1]).GeographicalCoverage;
      let area = v.includes("/")
        ? v.split("/").map((v) => remove(v))
        : [remove(v)];
      Global.pricingTables.push([plan, area]);
    });

    // Not included benefits -----------------------------------
    arr.forEach((benefits) => {
      for (let key in benefits) {
        if (
          benefits[key] &&
          (benefits[key] == "N/A" ||
            benefits[key].toString().toLowerCase() == "not available")
        ) {
          let index = Global.filters.notIncludedBenefits.findIndex(
            (v) => v.plan == remove(benefits["PlanName"])[0]
          );
          if (index == -1) {
            Global.filters.notIncludedBenefits.push({
              plan: remove(benefits["PlanName"])[0],
              benefits: [remove(key)[0]],
            });
          } else {
            Global.filters.notIncludedBenefits[index].benefits.push(
              remove(key)[0]
            );
          }
        }
      }
    });

    // Addon Premiums -----------------------------------
    arr[0].addons &&
      arr.forEach(({ addons }) => {
        if (!addons) return;
        // let values = addons.split(" & ");
        // let struc = {
        //   benefitName: true,
        //   label: true,
        //   rateSheetLabel: true,
        //   type: true,
        //   flag: "",
        //   description: "",
        //   conditions: "",
        // };
        // values.forEach((value) => {
        //   let [field, fieldValue] = value.split(":");
        //   if (
        //     field != "description" &&
        //     field != "flag" &&
        //     field != "conditions" &&
        //     (!struc[field] || !(fieldValue && fieldValue.trim()))
        //   )
        //     throw new Error("Incorrect Addon feildName " + field);
        //   field = field.trim();
        //   fieldValue = fieldValue.trim();
        //   struc[field] = fieldValue;
        // });
        Global.filters.addons.push(addons);
      });

    // bundle benefits -----------------------------------
    arr[0]["bundle benefits"] &&
      arr.forEach((v) => {
        if (v["bundle benefits"]) return;
        let values = v["bundle benefits"].split("/");
        Global.filters.bundleBenefits.push(...values);
      });

    // Dependent benefits -----------------------------------
    arr[0]["dependentbenefits"] &&
      arr.forEach((v) => {
        if (!v["dependentbenefits"]) return;
        let [core, dependent] = v["dependentbenefits"].split(" - ");
        Global.filters.dependentBenefits.push({ core, dependent });
      });

    return Global;
  } catch (error) {
    console.log({ err: error.message, stack: error.stack });
    process.exit(1);
  }
};

// benefits Categories ------------------------------------------------------

// const benefitCategories = (data, Ids) => {
//   try {
//     let arr = [];
//     let index;

//     const check = (value) => {
//       let bool = arr[index].includedBenefits.findIndex(
//         (v) => v.userType === value
//       );
//       return bool != -1 ? [true, bool] : [false, false];
//     };

//     data.forEach((v) => {
//       if (v.userType === "type") {
//         let obj = { categoryTitle: v.benefits[1], includedBenefits: [] };
//         arr.push(obj);
//         if (!index && index != 0) index = 0;
//         else index++;
//       } else {
//         if (arr[index].includedBenefits.length == 0) {
//           let struc = {
//             userType: v.userType,
//             benefitTypes: [
//               `-.-`,
//             ],
//           };
//           arr[index].includedBenefits.push(struc);
//         } else if (check(v.userType)[0]) {
//           arr[index].includedBenefits[check(v.userType)[1]].benefitTypes.push(
//             `-.-`
//           );
//         } else {
//           let struc = {
//             userType: v.userType,
//             benefitTypes: [
//               `-.-`,
//             ],
//           };
//           arr[index].includedBenefits.push(struc);
//         }
//       }
//     });

//     return arr;
//   } catch (err) {
//     console.log({ err: err.message, err: err.stack });
//   }
// };
// ------------------------------------------------------------------------------

const createFile = (
  folder,
  fileName,
  data,
  provider,
  core = false,
  Enum = false,
  comment = false,
  addUp = false,
  rateTable = ``
) => {
  try {
    data = JSON.stringify(data);
    data = data.replace(/"-/g, "");
    data = data.replace(/-"/g, "");
    data = data.replace(/\n/g, "");

    let str = `${addUp ? addUp : ""}
      const ${provider} = require("../core-index.js")
      ${Enum ? "const Enum = require('../../enum.js')" : ""}
    ${core ? 'const core = require("../../core");' : ""}
    ${comment ? `// ${comment}` : ""}
    ${rateTable ? rateTable : ""}
    let ${folder} = ${data} ;
    module.exports = ${folder} ;`;

    if (!fs.existsSync(`Output/${folder}`)) fs.mkdirSync(`Output/${folder}`);
    fs.appendFileSync(`Output/${folder}/${fileName}.js`, str);
    console.log(`${folder}/${fileName} Created!`);
  } catch (error) {
    console.log(`error: ${error.message}`);
  }
};

const readFile = (folderName, filename, n = 0, loc = "./Input") => {
  const Sheet = xlsx.readFileSync(`${loc}/${folderName}/${filename}.xlsx`);
  if (typeof n == "string") n = Sheet.SheetNames.indexOf(n);
  // console.log("Sheet.SheetNames --> ", Sheet.SheetNames, typeof n);
  return xlsx.utils.sheet_to_json(Sheet.Sheets[Sheet.SheetNames[n]]);
};

const splittingFile = (arr, key, folder, num) => {
  if (!fs.existsSync(`Output/${folder}`)) fs.mkdirSync(`Output/${folder}`);
  if (!fs.existsSync(`Output/${folder}/${key}`))
    fs.mkdirSync(`Output/${folder}/${key}`);
  // let count = Math.ceil(arr.length / maxArrLength);
  // for (let i = 1; i <= count; i++) {
  let count;
  let data = `
    const Enum = require("../../../enum.js");
    let table = ${JSON.stringify(arr)};
    module.exports = table;
    `;
  data = data.replace(/"-/g, "");
  data = data.replace(/-"/g, "");
  fs.appendFileSync(`Output/${folder}/${key}/${key}_${num}.js`, data);
  // }
  return count || 1;
};

const generateShortCode = (str) => {
  if (str.includes("nil")) return "Nil";
  if (str.includes("10%")) return "10";
  if (str.includes("20%")) return "20";
  let shortStr = "";
  for (let i = 0; i < str.length; i++) {
    let code = str[i].charCodeAt(0);
    if (code >= 65 && code <= 90) shortStr += str[i];
  }
  return shortStr;
};

const groupingCollection = (arr, col) => {
  // [ageStart,ageEnd,rates]
  let range = [[arr[0].ageStart, arr[0].ageStart, arr[0][col]]];

  arr.forEach((v, i) => {
    if (i == 0) return;
    let currentItem = range[range.length - 1]; // current item of ranage Arr
    if (currentItem[2] == v[col]) {
      if (i == arr.length - 1) currentItem[1] = v.ageEnd;
      return;
    }
    currentItem[1] = v.ageStart - 1;
    range.push([v.ageStart, v.ageEnd, v[col]]);
  });

  return range;
};

const fetchAddons = (
  benefit,
  addonName,
  folderName,
  provider,
  num,
  conversion
) => {
  let info = readFile(
    folderName,
    `addon${num > 0 ? num-1 : ""}`,
    `${addonName.includes(" ") ? addonName.split(" ")[0] : addonName}-info`
  );

  // console.log('info[0] >> ', info[0]);
  let addonRates = info[0].sheetName
    ? readFile(folderName, `addon${num > 0 ? num-1 : ""}`, info[0].sheetName)
    : [];
  // createFile(
  //   "Addons",
  //   addonName.includes(" ") ? addonName.split(" ")[0] : addonName,
  //   info
  // );
  // createFile(
  //   "Addons",
  //   (addonName.includes(" ") ? addonName.split(" ")[0] : addonName) + "_rates",
  //   addonRates
  // );

  // console.log('benefit >> ', benefit._id);
  if (info.find((v) => v.default.toLowerCase == "true")) {
  } else {
    let Addons = [];
    info.forEach((v, i) => {
      let obj = {
        id: "option-" + (i + 1),
        label: v.label,
        description: v.description,
      };
      if (v.plan) {
        let p_ = benefit.plans.find(
          (p) => p.split(".")[2].replace("-", "") == remove(v.plan)[0]
        );
        obj.conditions = [
          {
            type: "-Enum.conditions.plans-",
            value: [p_],
          },
        ];
      }
      let Enums = {
        planName: "-Enum.conditions.plans-",
        ageStart: "-Enum.customer.min_age-",
        ageEnd: "-Enum.customer.max_age-",
        gender: "-Enum.customer.gender-",
        married: "-Enum.customer.maritalStatus-",
        network: "-Enum.conditions.modifier-",
        coverages: "-Enum.conditions.coverage-",
        frequency: "-Enum.conditions.modifier-",
        copay: "-Enum.conditions.deductible-",
      };

      // console.log('addonRates.length >> ', addonRates.length);
      if (addonRates.length > 0)
        obj.addonCost = {
          type: v.type,
          conditionalPrices: addonRates
            .filter((r) => r.flag == v.flag)
            .map((rate) => {
              let res = {
                conditions: [],
                price: [
                  {
                    value: parseFloat(rate.rates*12),
                    currency: "-Enum.currency.USD-",
                  },
                ],
              };
              for (let col in rate) {
                let con = { type: Enums[col], value: [] };
                if (col == "ageStart" || col == "ageEnd") con.value = rate[col];
                else if (col == "gender")
                  con.value = `-Enum.gender.${rate[col].toLowerCase()}-`;
                else if (col == "copay" || col == "network")
                  con.value = [rate[col]];
                else if (col == "married") {
                  if (rate[col] == 0)
                    con.value = "-Enum.maritalStatus.married-";
                  else con.value = "-Enum.maritalStatus.single-";
                } else if (col == "planName" || col == "coverages")
                  con.value = `-${provider}.${col == "planName" ? "plans" : "coverages"}${num}.${remove(rate[col])[0]}-`;
                else if (col == "singleChild")
                  con = singleChild[`_${rate[col]}`];
                  // else if (col == "code")
                  // con = singleChild[`_${rate[col]}`];
                else if (col == "frequency") {
                  if (rate[col] == "Annually")
                    con.value = ["annual-payment-surcharge"];
                  else if (rate[col] == "Quarterly")
                    con.value = ["quarterly-payment-surcharge"];
                } else continue;
                res.conditions.push(con);
              }
              return res;
            }),
        };
      if (addonRates.length > 0 && obj.addonCost.conditionalPrices.length == 0)
        delete obj.addonCost;
      Addons.push(obj);
    });
    benefit.options = Addons;
    return benefit;
  }
};

const extractAddon = (arr, addon, search = "") => {
  const Enum = {
    network: "-Enum.conditions.modifier-",
    coverage: "-Enum.conditions.coverage-",
    planName: "-Enum.conditions.plans-",
    gender: "-Enum.customer.gender-",
    ageStart: "-Enum.customer.min_age-",
    ageEnd: "-Enum.customer.max_age-",
    curreny: "-Enum.currency.USD-",
  };
  let includedRates = [];
  arr = arr.filter((v) => v[addon]);
  let rates = arr.reduce((acc, v) => {
    if (v[addon] && !includedRates.includes(v[addon])) {
      includedRates.push(v[addon]);
      return [...acc, v];
    }
    return acc;
  }, []);
  if (rates.length == 0) throw new Error("Addon not found");
  let fields = [];
  let sheetLabels = Object.keys(Enum);
  if (arr.find((v) => v.married)) {
    Enum.married = "-Enum.customer.maritalStatus-";
  }
  for (let key in sheetLabels) {
    if (rates[0][key] != rates[1][key]) fields.push(key);
  }
  return rates.map((v) => {
    let conditions = fields.map((f) => {
      return { type: Enum[f], value: v[f] };
    });
    return {
      conditions,
      price: [{ value: v[addon], currency: Enum.curreny }],
    };
  });
};

module.exports = {
  getList,
  createFile,
  remove,
  splittingFile,
  generateShortCode,
  groupingCollection,
  extractAddon,
  readFile,
  fetchAddons,
};
