const fs = require("fs");
const { maxArrLength } = require("./constants");

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
      filters: {
        networkType: "",
        frequency: "",
        notIncludedBenefits: [],
        addons: [],
        bundleBenefits: [],
        dependentBenefits: [],
      },
    };

    if (arr[0].NetworkDetails.includes("/"))
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
        let values = addons.split(" & ");
        let struc = {
          benefitName: true,
          label: true,
          rateSheetLabel: true,
          type: true,
          flag: "",
          description: "",
          conditions: "",
        };
        values.forEach((value) => {
          let [field, fieldValue] = value.split(":");
          if (
            field != "description" &&
            field != "flag" &&
            field != "conditions" &&
            (!struc[field] || !(fieldValue && fieldValue.trim()))
          )
            throw new Error("Incorrect Addon feildName " + field);
          field = field.trim();
          fieldValue = fieldValue.trim();
          struc[field] = fieldValue;
        });
        Global.filters.addons.push(struc);
      });

    // bundle benefits -----------------------------------
    arr[0]["bundle benefits"] &&
      arr.forEach((v) => {
        if (v["bundle benefits"]) return;
        let values = v["bundle benefits"].split("/");
        Global.filters.bundleBenefits.push(...values);
      });

    // Dependent benefits -----------------------------------
    arr[0]["dependent benefits"] &&
      arr.forEach((v) => {
        if (v["dependent benefits"]) return;
        let [core, dependent] = v["dependent benefits"].split(" - ");
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
  addUp = false
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
    let ${folder} = ${data} ;
    module.exports = ${folder} ;`;

    if (!fs.existsSync(`Output/${folder}`)) fs.mkdirSync(`Output/${folder}`);
    fs.appendFileSync(`Output/${folder}/${fileName}.js`, str);
    console.log(`${folder}/${fileName} Created!`);
  } catch (error) {
    console.log(`error: ${error.message}`);
  }
};

const splittingFile = (arr, key, folder, num) => {
  if (!fs.existsSync(`Output/${folder}`)) fs.mkdirSync(`Output/${folder}`);
  if (!fs.existsSync(`Output/${folder}/${key}`))
    fs.mkdirSync(`Output/${folder}/${key}`);
  // let count = Math.ceil(arr.length / maxArrLength);
  // for (let i = 1; i <= count; i++) {
  let count;
  let data = `
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
  if (str.includes("10")) return "10";
  if (str.includes("20")) return "20";
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
};

// const resOne = () => {
//   const planSheet = xlsx.readFile(`./Input/${folderName}/benefits.xlsx`);
//   const benefitSheet = xlsx.readFile(`./Input/${folderName}/userType.xlsx`);
//   const rate = xlsx.readFile(`./Input/${folderName}/rateSheet.xlsx`);
//   const conversion = 1; //3.6725;

//   const replaceChar = (word) => {
//     word = word.replace(" ", "");
//     while (word.includes(" ")) {
//       word = word.replace(" ", "");
//     }
//     word = word.replace("/", "");
//     word = word.replace("-", "");
//     return word;
//   };

//   const convertXlsx = (sheet) => {
//     try {
//       let result = [];
//       let data = xlsx.utils.sheet_to_json(sheet);
//       data.forEach((v) => {
//         let clone = {};
//         for (let key in v) {
//           let newKey = key.includes(" ") ? replaceChar(key) : key;
//           clone[newKey] = v[key];
//         }
//         result.push(clone);
//       });

//       return getList(result);
//     } catch (error) {
//       console.log({ err: error.message, stack: error.stack });
//       process.exit(1);
//     }
//   };

//   let GlobalData = convertXlsx(planSheet.Sheets[planSheet.SheetNames[0]]);

//   let DATA = xlsx.utils
//     .sheet_to_json(planSheet.Sheets[planSheet.SheetNames[0]])
//     .map((v) => {
//       let obj = {};
//       for (let key in v) {
//         let a = key;
//         if (
//           key.charCodeAt(key.length - 1) == 160 ||
//           key.charCodeAt(key.length - 1) == 32
//         ) {
//           key = key.slice(0, -1);
//         }
//         obj[key] = v[a];
//       }
//       return obj;
//     });

//   let Benefits = xlsx.utils
//     .sheet_to_json(benefitSheet.Sheets[benefitSheet.SheetNames[0]])
//     .map((v) => {
//       return { benefits: remove(v.benefits), userType: v.userType };
//     });
//   let rateSheet = xlsx.utils.sheet_to_json(rate.Sheets[rate.SheetNames[0]]);
//   let Ids = generateCodeIndex(GlobalData, Benefits, DATA);
//   const provider = DATA[0].companyName;

//   if (process.argv[2] == "-a") {
//     async function main() {
//       try {
//         // Deletes Output folder for every new sheet generated
//         fs.rmSync("./Output", { recursive: true, force: true });
//         fs.mkdirSync("Output");

//         let clone_ids = Ids;
//         clone_ids = JSON.stringify(clone_ids);
//         while (clone_ids.includes(`"-`)) {
//           clone_ids = clone_ids.replace(`"-`, "");
//         }
//         while (clone_ids.includes(`-"`)) {
//           clone_ids = clone_ids.replace(`-"`, "");
//         }

//         fs.appendFile(
//           `Output/core-index.js`,
//           `const Utils = require('../../services/utils/utils');
//         const utils = new Utils({ config: { logging: false }});
//         const { generateMongoIdFromString } = utils;
//         module.exports = ${clone_ids}`,
//           function (err) {
//             try {
//               if (err) throw err;
//               console.log(`${folder}/${fileName} Created!`);
//             } catch (error) {
//               console.log(`error: ${error.message}`);
//             }
//           }
//         );
//         // ---------------------------------------

//         // ----------------------- Index ---------------------------
//         function createIndex() {
//           const data = `
//         const Provider = require('./provider/index');
//         const Plans = require('./plans/index');
//         const PricingTables = require('./PricingTable/index');
//         const Coverages = require('./coverage/index');
//         const Modifiers = require('./modifiers/index');
//         let data = [
//           // Provider data
//           {
//             model: "Provider",
//             modelPath: "models/provider-model.js",
//             documents: Provider,
//           },

//           // Plans
//           {
//             model: "Plan",
//             modelPath: "models/plan-model.js",
//             documents: Plans,
//           },

//           // Pricing Tables
//           {
//             model: "PricingTable",
//             modelPath: "models/pricing-table-model.js",
//             documents: PricingTables,
//           },

//           // Coverage information
//           {
//             model: "Coverage",
//             modelPath: "models/coverage-model.js",
//             documents: Coverages,
//           },

//           {
//             // Plan modifiers
//             model: "Modifier",
//             modelPath: "models/modifier-model.js",
//             documents: Modifiers,
//           },
//         ];

//         module.exports = data`;
//           fs.appendFile(`Output/index.js`, data, function (err) {
//             try {
//               if (err) throw err;
//               console.log(`index Created!`);
//             } catch (error) {
//               console.log(`error: ${error.message}`);
//             }
//           });
//         }

//         createIndex();

//         // ----------------------- Provider -------------------------
//         function createProvider() {
//           let str = [
//             {
//               _id: `-${provider}.providers-`,
//               title: provider,
//               logo: "",
//               colors: {},
//             },
//           ];
//           createFile("provider", "index", str, provider);
//         }

//         createProvider();

//         // --------------------------------- Coverage File ---------------------------------------------------
//         function coverage() {
//           let UAE = [
//             ["AE-DU", "AE-AZ", "AE-AJ", "AE-FU", "AE-SH", "AE-RK", "AE-UQ"],
//             [],
//           ];
//           let NE = [
//             ["AE-AJ", "AE-FU", "AE-SH", "AE-RK", "AE-UQ"],
//             ["AE-DU", "AE-AZ"],
//           ];
//           let Dubai = [
//             ["AE-DU"],
//             ["AE-AZ", "AE-AJ", "AE-FU", "AE-SH", "AE-RK", "AE-UQ"],
//           ];
//           let AbuDhabi = [
//             ["AE-AZ"],
//             ["AE-DU", "AE-AJ", "AE-FU", "AE-SH", "AE-RK", "AE-UQ"],
//           ];

//           let NE_Dubai = [
//             ["AE-AJ", "AE-FU", "AE-SH", "AE-RK", "AE-UQ", "AE-DU"],
//             ["AE-AZ"],
//           ];

//           let coveredCountries = [
//             "US",
//             "AU",
//             "DK",
//             "IT",
//             "MX",
//             "RU",
//             "AT",
//             "FI",
//             "JP",
//             "MC",
//             "SG",
//             "BE",
//             "FR",
//             "SA",
//             "NL",
//             "CH",
//             "BR",
//             "DE",
//             "LU",
//             "NZ",
//             "AE",
//             "CN",
//             "HK",
//             "MO",
//             "NO",
//             "GB",
//             "AD",
//             "CC",
//             "GL",
//             "JM",
//             "ES",
//             "AI",
//             "CO",
//             "GD",
//             "JE",
//             "KN",
//             "AG",
//             "CK",
//             "GP",
//             "KW",
//             "LC",
//             "AR",
//             "CR",
//             "GT",
//             "LB",
//             "SX",
//             "AW",
//             "CY",
//             "GG",
//             "MT",
//             "VC",
//             "BS",
//             "DM",
//             "GY",
//             "MQ",
//             "SR",
//             "BB",
//             "DO",
//             "HT",
//             "AN",
//             "SE",
//             "BZ",
//             "HN",
//             "NI",
//             "TT",
//             "BM",
//             "SV",
//             "HU",
//             "PA",
//             "TR",
//             "BO",
//             "FO",
//             "IS",
//             "PY",
//             "TC",
//             "VG",
//             "FJ",
//             "IQ",
//             "PE",
//             "TV",
//             "KY",
//             "PF",
//             "IE",
//             "PT",
//             "UY",
//             "CL",
//             "GI",
//             "IM",
//             "QA",
//             "VE",
//             "CX",
//             "GR",
//             "SM",
//             "EC",
//             "IL",
//             "AF",
//             "HR",
//             "KG",
//             "OM",
//             "TJ",
//             "AL",
//             "CZ",
//             "LV",
//             "PS",
//             "TM",
//             "AM",
//             "EE",
//             "LI",
//             "PL",
//             "UA",
//             "AZ",
//             "GE",
//             "LT",
//             "RO",
//             "UZ",
//             "BH",
//             "IN",
//             "MK",
//             "RS",
//             "YE",
//             "BA",
//             "JO",
//             "MD",
//             "SK",
//             "BG",
//             "KZ",
//             "ME",
//             "SI",
//             "BD",
//             "KI",
//             "MM",
//             "PW",
//             "TW",
//             "BT",
//             "LA",
//             "NR",
//             "TH",
//             "BN",
//             "MY",
//             "NP",
//             "PH",
//             "TO",
//             "KH",
//             "MV",
//             "NC",
//             "SB",
//             "VU",
//             "TL",
//             "MH",
//             "KR",
//             "VN",
//             "ID",
//             "MN",
//             "PK",
//             "LK",
//             "DZ",
//             "PG",
//             "GW",
//             "MZ",
//             "ZA",
//             "AO",
//             "CD",
//             "KE",
//             "NA",
//             "SS",
//             "BJ",
//             "DJ",
//             "LS",
//             "NE",
//             "SD",
//             "BW",
//             "EG",
//             "LR",
//             "NG",
//             "SZ",
//             "BF",
//             "GQ",
//             "LY",
//             "CG",
//             "TZ",
//             "BI",
//             "ER",
//             "MG",
//             "RW",
//             "TG",
//             "CM",
//             "ET",
//             "MW",
//             "ST",
//             "TN",
//             "CV",
//             "GA",
//             "ML",
//             "SN",
//             "UG",
//             "CF",
//             "GM",
//             "MR",
//             "SC",
//             "ZM",
//             "TD",
//             "GH",
//             "MU",
//             "SL",
//             "ZW",
//             "KM",
//             "GN",
//             "MA",
//             "SO",
//           ];

//           let coverage_data = GlobalData.coverages.map((v) => {
//             let clone = {
//               _id: `-${provider}.coverages.${v.coverageName[0]}-`,
//               title: v.coverageName[1],
//               internalTitle: v.coverageName[1],
//               includedResidence:
//                 DATA[0].residency == "UAE"
//                   ? UAE[0]
//                   : DATA[0].residency == "NE"
//                   ? NE[0]
//                   : DATA[0].residency == "Dubai"
//                   ? Dubai[0]
//                   : DATA[0].residency == "NE/Dubai"
//                   ? NE_Dubai[0]
//                   : AbuDhabi[0],
//               excludedResidence:
//                 DATA[0].residency == "UAE"
//                   ? UAE[1]
//                   : DATA[0].residency == "NE"
//                   ? NE[1]
//                   : DATA[0].residency == "Dubai"
//                   ? Dubai[1]
//                   : DATA[0].residency == "NE/Dubai"
//                   ? NE_Dubai[1]
//                   : AbuDhabi[1],
//               coveredCountries,
//               notes: "",
//             };

//             return clone;
//           });
//           createFile("coverage", "index", coverage_data, provider);
//         }
//         // coverage();

//         // ----------------------------------------------------------------------------------------------------

//         // ----------------------------------- Plans file -----------------------------------------------------

//         function plan() {
//           const benefitTypes = [
//             {
//               categoryTitle: "General Benefits",
//               includedBenefits: [
//                 {
//                   userType: "all",
//                   benefitTypes: [
//                     "-core.benefitTypes.chronicConditions-",
//                     "-core.benefitTypes.preExistingCoverCondition-",
//                   ],
//                 },
//                 {
//                   userType: "pro",
//                   benefitTypes: ["-core.benefitTypes.claimHandling-"],
//                 },
//               ],
//             },
//             {
//               categoryTitle: "In-patient (Hospitalization & Surgery)",
//               includedBenefits: [
//                 {
//                   userType: "all",
//                   benefitTypes: ["-core.benefitTypes.accomodation-"],
//                 },
//                 {
//                   userType: "pro",
//                   benefitTypes: [
//                     "-core.benefitTypes.diagnosticsAndTest-",
//                     "-core.benefitTypes.organTransplant-",
//                     "-core.benefitTypes.surgeriesAndAnthesia-",
//                     "-core.benefitTypes.oncology-",
//                   ],
//                 },
//                 {
//                   userType: "starter",
//                   benefitTypes: [
//                     "-core.benefitTypes.inPatientHospitializationandsurgery-",
//                   ],
//                 },
//               ],
//             },
//             {
//               categoryTitle:
//                 "Out-patient (Consultations, Lab & Diagnostics, Pharmacy, Physiotherapy)",
//               includedBenefits: [
//                 {
//                   userType: "all",
//                   benefitTypes: ["-core.benefitTypes.physiotherapy-"],
//                 },
//                 {
//                   userType: "pro",
//                   benefitTypes: [
//                     "-core.benefitTypes.outPatientConsultation-",
//                     "-core.benefitTypes.specialist-",
//                     "-core.benefitTypes.medicine-",
//                     "-core.benefitTypes.vaccination-",
//                     "-core.benefitTypes.tests-",
//                   ],
//                 },
//                 {
//                   userType: "starter",
//                   benefitTypes: ["-core.benefitTypes.outPatientBenefit-"],
//                 },
//               ],
//             },
//             {
//               categoryTitle: "Maternity",
//               includedBenefits: [
//                 {
//                   userType: "all",
//                   benefitTypes: [
//                     "-core.benefitTypes.maternity-",
//                     "-core.benefitTypes.maternityWaitingPeriod-",
//                   ],
//                 },
//                 {
//                   userType: "pro",
//                   benefitTypes: [
//                     "-core.benefitTypes.complicationOfPregnancy-",
//                     "-core.benefitTypes.newBornCoverage-",
//                   ],
//                 },
//               ],
//             },
//             {
//               categoryTitle: "Dental Benefit",
//               includedBenefits: [
//                 {
//                   userType: "all",
//                   benefitTypes: [
//                     "-core.benefitTypes.dental-",
//                     "-core.benefitTypes.dentalWaitingPeriod-",
//                   ],
//                 },
//               ],
//             },
//             {
//               categoryTitle: "Additional Benefits",
//               includedBenefits: [
//                 {
//                   userType: "all",
//                   benefitTypes: [
//                     "-core.benefitTypes.optical-",
//                     "-core.benefitTypes.wellness-",
//                     "-core.benefitTypes.emergencyEvacution-",
//                   ],
//                 },
//                 {
//                   userType: "pro",
//                   benefitTypes: [
//                     "-core.benefitTypes.alternativeMedicine-",
//                     "-core.benefitTypes.mentalHealth-",
//                     "-core.benefitTypes.memberWebPortal-",
//                     "-core.benefitTypes.mobileApplication-",
//                     "-core.benefitTypes.virtualTele-",
//                     "-core.benefitTypes.otherServices-",
//                   ],
//                 },
//               ],
//             },
//             {
//               categoryTitle: "Added (Optional) Benefits",
//               includedBenefits: [
//                 {
//                   userType: "all",
//                   benefitTypes: [
//                     "-core.benefitTypes.extendedEvacuation-",
//                     "-core.benefitTypes.nonEmergency-",
//                   ],
//                 },
//               ],
//             },
//           ];
//           let modifiersId = [];
//           // console.log(Ids.modifiers);
//           for (let key in Ids.modifiers) {
//             if (typeof Ids.modifiers[key] == "string") {
//               modifiersId.push(`-${provider}.modifiers.${key}-`);
//               continue;
//             }
//             for (let v in Ids.modifiers[key]) {
//               modifiersId.push(`-${provider}.modifiers.${key}.${v}-`);
//             }
//           }
//           let Plans = GlobalData.plans.map((plan) => {
//             let tableIds = [];
//             for (const key in Ids.pricingTables[plan[0]]) {
//               tableIds.push(`-${provider}.pricingTables.${plan[0]}.${key}-`);
//             }
//             let clone = {
//               _id: `-${provider}.plans.${plan[0]}-`,
//               provider: `-${provider}.providers-`,
//               title: plan[1],
//               notes: "",
//               benefitCategories: benefitTypes,
//               pricingTables: tableIds,
//               modifiers: modifiersId,
//             };

//             return clone;
//           });

//           createFile("plans", "index", Plans, provider, true);
//         }

//         // plan();
//         // -----------------------------------------------------------------------------------------------------

//         // ----------------------------------Pricing Table -----------------------------------------------------
//         function table() {
//           let pricingArr = [];
//           let UAE = [
//             ["AE-DU", "AE-AZ", "AE-AJ", "AE-FU", "AE-SH", "AE-RK", "AE-UQ"],
//             [],
//           ];
//           let NE = [
//             ["AE-AJ", "AE-FU", "AE-SH", "AE-RK", "AE-UQ"],
//             ["AE-DU", "AE-AZ"],
//           ];
//           let Dubai = [
//             ["AE-DU"],
//             ["AE-AZ", "AE-AJ", "AE-FU", "AE-SH", "AE-RK", "AE-UQ"],
//           ];
//           let AbuDhabi = [
//             ["AE-AZ"],
//             ["AE-DU", "AE-AJ", "AE-FU", "AE-SH", "AE-RK", "AE-UQ"],
//           ];

//           let NE_Dubai = [
//             ["AE-AJ", "AE-FU", "AE-SH", "AE-RK", "AE-UQ", "AE-DU"],
//             ["AE-AZ"],
//           ];

//           for (const key in Ids.pricingTables) {
//             let plan = Ids.pricingTables[key];
//             let originalName = (z) => {
//               return GlobalData.plans.find((v) => v[0] == z)[1];
//             };
//             let planValue = DATA.find(
//               (p) => p.PlanName === originalName(key) || p.PlanName == "All"
//             );
//             if (!planValue) {
//               console.log("plan-", key, originalName(key));
//               throw new Error();
//             }
//             planValue = planValue["Annual Limit"];

//             for (let v in plan) {
//               let pricing = rateSheet.filter((n) => {
//                 // console.log({
//                 //   name: [n.planName, key, n.planName == key],
//                 //   cov: [n.coverage, v, n.coverage == v],
//                 //   copay: [
//                 //     n.copay,
//                 //     GlobalData.coPays[0][0],
//                 //     n.copay == GlobalData.coPays[0][0],
//                 //   ],
//                 //   fre: [
//                 //     n.frequency,
//                 //     GlobalData.frequency[0],
//                 //     n.frequency == GlobalData.frequency[0],
//                 //   ],
//                 // });
//                 // throw new Error();
//                 if (DATA[0].planCopay == "single") {
//                   return (
//                     n.planName == originalName(key) &&
//                     n.coverage ==
//                       GlobalData.coverages.find((k) => k.coverageName[0] == v)
//                         .coverageName[1] &&
//                     // n.copay == GlobalData.coPays[0][0] &&
//                     n.frequency == GlobalData.frequency[0]
//                   );
//                 }
//                 return (
//                   n.planName == originalName(key) &&
//                   n.coverage ==
//                     GlobalData.coverages.find((k) => k.coverageName[0] == v)
//                       .coverageName[1] &&
//                   n.copay == GlobalData.coPays[0][0][0] &&
//                   n.frequency == GlobalData.frequency[0]
//                 );
//               });
//               if (pricing.length == 0)
//                 throw new Error(
//                   GlobalData.coPays[0][0][0] +
//                     " | " +
//                     originalName(key) +
//                     " | " +
//                     GlobalData.coverages.find((k) => k.coverageName[0] == v)
//                       .coverageName[1] +
//                     " | " +
//                     GlobalData.frequency[0]
//                 );
//               let table;

//               if (GlobalData.filters.networkType == "single") {
//                 table = pricing.map((t) => {
//                   let str = {
//                     fromAge: t.ageStart,
//                     toAge: t.ageEnd,
//                     gender: t.gender.toLowerCase(),
//                     price: [
//                       {
//                         value: parseFloat((t.rates / conversion).toFixed(2)),
//                         currency: t.currency,
//                       },
//                     ],
//                   };
//                   if (t.married === 0) {
//                     str.isMarried = true;
//                   }
//                   if (t.married === 1) {
//                     str.isMarried = false;
//                   }
//                   return { ...str };
//                 });
//               } else {
//                 let n = pricing.reduce((acc, v) => {
//                   if (acc.includes(v.network)) return acc;
//                   else return [...acc, v.network];
//                 }, []);
//                 pricing = pricing.filter(
//                   (v) => v.network == GlobalData.Networks[0][1]
//                 );
//                 table = pricing.map((t) => {
//                   let str = {
//                     fromAge: t.ageStart,
//                     toAge: t.ageEnd,
//                     gender: t.gender.toLowerCase(),
//                     price: [
//                       {
//                         value: 0,
//                         currency: t.currency,
//                       },
//                     ],
//                   };
//                   if (t.married === 0) {
//                     str.isMarried = true;
//                   }
//                   if (t.married === 1) {
//                     str.isMarried = false;
//                   }
//                   return { ...str };
//                 });
//               }

//               let res = GlobalData.coverages.find((vv) => vv.coverageName == v);
//               let check =
//                 planValue.toString().includes("AED") ||
//                 planValue.toString().includes("USD")
//                   ? true
//                   : false;
//               let clone = {
//                 _id: `-${provider}.pricingTables.${key}.${v}-`,
//                 plan: `-${provider}.plans.${key}-`,
//                 annualLimit: [
//                   {
//                     currency: check ? planValue.split(" ")[0] : "USD",
//                     value: check
//                       ? Number(planValue.split(" ")[1].split(",").join(""))
//                       : planValue,
//                   },
//                 ],
//                 startDate: new Date(GlobalData.startDate).toISOString(),
//                 endDate: GlobalData.endDate
//                   ? new Date(GlobalData.endDate).toISOString()
//                   : "",
//                 includedResidence:
//                   DATA[0].residency == "UAE"
//                     ? UAE[0]
//                     : DATA[0].residency == "NE"
//                     ? NE[0]
//                     : DATA[0].residency == "Dubai"
//                     ? Dubai[0]
//                     : DATA[0].residency == "NE/Dubai"
//                     ? NE_Dubai[0]
//                     : AbuDhabi[0],
//                 excludedResidence:
//                   DATA[0].residency == "UAE"
//                     ? UAE[1]
//                     : DATA[0].residency == "NE"
//                     ? NE[1]
//                     : DATA[0].residency == "Dubai"
//                     ? Dubai[1]
//                     : DATA[0].residency == "NE/Dubai"
//                     ? NE_Dubai[1]
//                     : AbuDhabi[1],
//                 coverage: [`-${provider}.coverages.${v}-`],
//                 baseAnnualPremium: [...table],
//               };
//               pricingArr.push({ ...clone });
//             }
//           }
//           // console.log(pricingArr);
//           createFile("PricingTable", "index", pricingArr, provider);
//         }
//         // -----------------------------------------------------------------------------------------------------

//         // -------------------------------- Modifiers file -----------------------------------------------------
//         function modifiers() {
//           let benefitsKeys = DATA[0];
//           let modifiers = {};
//           for (let key in benefitsKeys) {
//             if (
//               key == "PlanName" ||
//               key == "Annual Limit" ||
//               key == "Network Details" ||
//               key == "Geographical Coverage" ||
//               key == "GeographicalCoverage"
//             )
//               continue;
//             if (
//               key == "Modes of Payment" ||
//               key == "Payment Terms Available" ||
//               key == "Semi Annual Surcharge"
//             ) {
//               break;
//             }
//             if (
//               key.charCodeAt(key.length - 1) == 160 ||
//               key.charCodeAt(key.length - 1) == 32
//             ) {
//               key = key.slice(0, -1);
//             }
//             DATA.forEach((d) => {
//               while (d[key].includes("\n")) d[key] = d[key].replace("\n", " ");
//               if (!d.PlanName) return;
//               let { PlanName } = d;
//               if (modifiers.length == 0)
//                 modifiers[key] = [{ plans: [PlanName], value: d[key] }];
//               else if (modifiers[key]) {
//                 if (modifiers[key][modifiers[key].length - 1].value == d[key]) {
//                   let index = modifiers[key].findIndex(
//                     (v) => v.value == d[key]
//                   );
//                   modifiers[key][index].plans.push(PlanName);
//                 } else
//                   modifiers[key].push({ plans: [PlanName], value: d[key] });
//               } else {
//                 modifiers[key] = [{ plans: [PlanName], value: d[key] }];
//               }
//             });
//           }
//           // console.log(modifiers);
//           // throw new Error();

//           let newArr = [];
//           let planIds = [];
//           for (let key in Ids.plans) {
//             planIds.push(`-${provider}.plans.${key}-`);
//           }
//           GlobalData.Modifiers.forEach((key) => {
//             // console.log("keys -- ", key);
//             // benefits --------------------------------------------
//             if (key == "benefits") {
//               for (const key in modifiers) {
//                 if (
//                   key.charCodeAt(key.length - 1) == 160 ||
//                   key.charCodeAt(key.length - 1) == 32
//                 ) {
//                   key = key.slice(0, -1);
//                 }
//                 !Benefits.find((v) => v.benefits[1] == key) &&
//                   console.log("k ", key, Benefits);

//                 !benefitCore.find((v) => v[0] == key) &&
//                   console.log("core-", key, benefitCore);

//                 let str = {
//                   _id: `-${provider}.modifiers.benefits.${
//                     Benefits.find((v) => v.benefits[1] == key).benefits[0]
//                   }-`,
//                   plans: [...planIds],
//                   title: key,
//                   label: key,
//                   type: "-core.modifierTypes.benefit-",
//                   assignmentType: "PER_PLAN",
//                   includedBenefits: [benefitCore.find((v) => v[0] == key)[1]],
//                   isOptional: false,
//                   description: "",
//                   addonCost: {},
//                   premiumMod: "",
//                   conditions: [],
//                   hasOptions: true,
//                 };
//                 // throw new Error();
//                 str.description =
//                   modifiers[key].length > 1
//                     ? ""
//                     : modifiers[key][0].value.toString().includes(" $ ")
//                     ? ""
//                     : modifiers[key][0].value.toString().includes("$copay")
//                     ? ""
//                     : modifiers[key][0].value;
//                 str.isOptional = false;
//                 str.hasOptions = modifiers[key].length > 1;

//                 // if (modifiers[key].length > 1) {
//                 //   str.options = [];
//                 //   let count = 1;
//                 //   modifiers[key].forEach((m) => {
//                 //     let cc = {
//                 //       id: "option-" + count,
//                 //       label: m.value,
//                 //       description: m.value,
//                 //       conditions: [
//                 //         {
//                 //           type: "PLAN_EQUALS_TO",
//                 //           value: [
//                 //             ...m.plans.reduce((acc, v) => {
//                 //               return [
//                 //                 ...acc,
//                 //                 `-${provider}.plans.${remove(v)[0]}-`,
//                 //               ];
//                 //             }, []),
//                 //           ],
//                 //         },
//                 //       ],
//                 //     };
//                 //     str.options.push(cc);
//                 //     count++;
//                 //   });
//                 // }
//                 // if (modifiers[key][0].value.toString().includes(" $ ")) {
//                 //   str.options = [];
//                 //   let count = 1;
//                 //   GlobalData.coPays.forEach((v) => {
//                 //     let [copay, scope] = v;
//                 //     modifiers[key].forEach((vt) => {
//                 //       if (!scope.includes("all") && scope.includes(planName[1]))
//                 //         return;
//                 //       let text = vt.value;
//                 //       copay.forEach((co, i) => {
//                 //         if (i == 0) return;
//                 //         text = text.replace("$", co);
//                 //       });
//                 //       let cc = {
//                 //         id: "option-" + count,
//                 //         label: text,
//                 //         description: text,
//                 //         conditions: [
//                 //           {
//                 //             type: "DEDUCTIBLE_EQUALS_TO",
//                 //             value: [copay[0]],
//                 //           },
//                 //           {
//                 //             type: "PLAN_EQUALS_TO",
//                 //             value: [
//                 //               ...vt.plans.reduce((acc, v2) => {
//                 //                 return [
//                 //                   ...acc,
//                 //                   `-${provider}.plans.${remove(v2)[0]}-`,
//                 //                 ];
//                 //               }, []),
//                 //             ],
//                 //           },
//                 //         ],
//                 //       };
//                 //       str.options.push(cc);
//                 //       count++;
//                 //     });
//                 //   });
//                 // }
//                 // if (modifiers[key][0].value.toString().includes("$copay")) {
//                 //   str.options = [];
//                 //   let count = 1;
//                 //   GlobalData.coPays.forEach((v) => {
//                 //     let cc = {
//                 //       id: "option-" + count,
//                 //       label: v[0],
//                 //       description: v[0],
//                 //       conditions: [
//                 //         {
//                 //           type: "DEDUCTIBLE_EQUALS_TO",
//                 //           value: [v[0]],
//                 //         },
//                 //       ],
//                 //     };
//                 //     str.options.push(cc);
//                 //     count++;
//                 //   });
//                 // }
//                 // ---------------------------------------------
//                 if (!modifiers[key][0].value.toString().includes("$copay")) {
//                   str.options = [];
//                   let count = 1;
//                   modifiers[key].forEach((m) => {
//                     if (
//                       m.value.toString().includes(" $ ") &&
//                       modifiers[key].length == 1
//                     ) {
//                       GlobalData.coPays.forEach((v) => {
//                         let [copay, scope] = v;
//                         if (!scope.includes("all") && scope.includes(m.plans))
//                           return;
//                         let text = m.value;
//                         copay.forEach((co, i) => {
//                           if (i == 0) return;
//                           text = text.replace("$", co);
//                         });
//                         let cc = {
//                           id: "option-" + count,
//                           label: text,
//                           description: text,
//                           conditions: [
//                             {
//                               type: "DEDUCTIBLE_EQUALS_TO",
//                               value: [copay[0]],
//                             },
//                           ],
//                         };
//                         str.options.push(cc);
//                         count++;
//                       });
//                     } else if (
//                       m.value.toString().includes(" $ ") &&
//                       modifiers[key].length > 1
//                     ) {
//                       GlobalData.coPays.forEach((v) => {
//                         let [copay, scope] = v;
//                         if (
//                           !scope.includes("all") &&
//                           m.plans.find((mp) => scope.includes(mp))
//                         )
//                           return;
//                         let text = m.value;
//                         copay.forEach((co, i) => {
//                           if (i == 0) return;
//                           text = text.replace("$", co);
//                         });
//                         let cc = {
//                           id: "option-" + count,
//                           label: text,
//                           description: text,
//                           conditions: [
//                             {
//                               type: "DEDUCTIBLE_EQUALS_TO",
//                               value: [copay[0]],
//                             },
//                             {
//                               type: "PLAN_EQUALS_TO",
//                               value: [
//                                 ...m.plans.reduce((acc, v) => {
//                                   return [
//                                     ...acc,
//                                     `-${provider}.plans.${remove(v)[0]}-`,
//                                   ];
//                                 }, []),
//                               ],
//                             },
//                           ],
//                         };
//                         str.options.push(cc);
//                         count++;
//                       });
//                     } else if (modifiers[key].length > 1) {
//                       let cc = {
//                         id: "option-" + count,
//                         label: m.value,
//                         description: m.value,
//                         conditions: [
//                           {
//                             type: "PLAN_EQUALS_TO",
//                             value: [
//                               ...m.plans.reduce((acc, v) => {
//                                 return [
//                                   ...acc,
//                                   `-${provider}.plans.${remove(v)[0]}-`,
//                                 ];
//                               }, []),
//                             ],
//                           },
//                         ],
//                       };
//                       str.options.push(cc);
//                       count++;
//                     }
//                   });
//                 } else if (
//                   modifiers[key][0].value.toString().includes("$copay")
//                 ) {
//                   str.options = [];
//                   let count = 1;
//                   GlobalData.coPays.forEach((v) => {
//                     let [copay, scope] = v;
//                     if (!scope.includes("all") && scope.includes(m.plans))
//                       return;
//                     let cc = {
//                       id: "option-" + count,
//                       label: copay[0],
//                       description: copay[0],
//                       conditions: [
//                         {
//                           type: "DEDUCTIBLE_EQUALS_TO",
//                           value: [copay[0]],
//                         },
//                       ],
//                     };
//                     str.options.push(cc);
//                     count++;
//                   });
//                 }
//                 newArr.push(str);
//               }
//             }
//             if (key == "discount") {
//               GlobalData[key].forEach((v1, index) => {
//                 let str = {
//                   _id: `-${provider}.modifiers.discount.${v1}-`,
//                   plans: [...planIds],
//                   title: key,
//                   label: key,
//                   type: `-core.modifierTypes.discount,-`,
//                   assignmentType: "PER_PLAN",
//                   includedBenefits: [],
//                   isOptional: false,
//                   description: "",
//                   addonCost: {},
//                   premiumMod: "",
//                   conditions: [],
//                   hasOptions: true,
//                 };
//                 newArr.push(str);
//               });
//             }

//             // deductible -----------------------------------------
//             if (key == "deductible") {
//               let clonearray = [];
//               let count = 1;
//               GlobalData["pricingTables"].forEach((plan) => {
//                 let [planName, coverage] = plan;
//                 GlobalData.Networks.forEach((net) => {
//                   let bool = DATA.find((v) => {
//                     if (v.PlanName == planName[1]) {
//                       return v["Network Details"].includes("/")
//                         ? v["Network Details"]
//                             .split("/")
//                             .find((x) => x == net[1])
//                         : v["Network Details"] == net[1];
//                     }
//                     return false;
//                   });
//                   if (!bool) return;
//                   coverage.forEach((cc) => {
//                     let c_id = `-${provider}.coverages.${cc[0]}-`;
//                     GlobalData["coPays"].forEach((v1, index) => {
//                       let [copays, scope] = v1;
//                       let [copay] = copays;
//                       if (!scope.includes("all") && scope.includes(planName[1]))
//                         return;
//                       let copayArr = [];
//                       clone = {
//                         id: "option-" + count,
//                         label: copay,
//                         premiumMod: {
//                           type: "conditional-override",
//                           conditionalPrices: [],
//                         },
//                         conditions: [
//                           {
//                             type: "MODIFIER_INCLUDED", // Network modifier with OPTION ID Network_B included
//                             value: [net[1]],
//                           },
//                           {
//                             type: "COVERAGE_EQUALS_TO",
//                             value: [c_id],
//                           },
//                           {
//                             type: "PLAN_EQUALS_TO",
//                             value: [`-${provider}.plans.${planName[0]}-`],
//                           },
//                         ],
//                       };
//                       GlobalData["frequency"].forEach((fr, f_index) => {
//                         if (f_index > 0) return;
//                         let pricing = rateSheet.filter((n) => {
//                           // if (
//                           //   DATA[0].planCopay != "single" &&
//                           //   n.planName == "Essential" &&
//                           //   n.coverage == "Worldwide excluding USA" &&
//                           //   n.copay == "Nil" &&
//                           //   n.frequency == "Annually" &&
//                           //   net[1] == "Worldcare Restricted"
//                           // ) {
//                           //   console.log({
//                           //     planName: {
//                           //       r: n.planName,
//                           //       b: plan[0][1],
//                           //       check: n.planName == plan[0][1],
//                           //     },
//                           //     coverage: {
//                           //       r: n.coverage,
//                           //       b: cc[1],
//                           //       check: n.coverage == cc[1],
//                           //     },
//                           //     copay: {
//                           //       r: n.copay,
//                           //       b: copay,
//                           //       check: n.copay == copay,
//                           //     },
//                           //     frequency: {
//                           //       r: n.frequency,
//                           //       b: fr,
//                           //       check: n.frequency == fr,
//                           //     },
//                           //     network: {
//                           //       r: n.network,
//                           //       b: net[1],
//                           //       check: n.network == net[1],
//                           //     },
//                           //   });
//                           //   throw new Error();
//                           // }
//                           let n_check = DATA.find(
//                             (dd) => dd.PlanName == plan[0][1]
//                           )["Network Details"];
//                           n_check = n_check.includes("/")
//                             ? n_check.split("/")
//                             : [n_check];
//                           n_check = n_check.includes(net[1]);
//                           return (
//                             n.planName == plan[0][1] &&
//                             n.coverage == cc[1] &&
//                             n.copay == copay &&
//                             n.frequency == fr &&
//                             (n.network == net[1] || n_check)
//                           );
//                         });
//                         if (
//                           DATA[0].planCopay == "single" &&
//                           pricing.length == 0
//                         )
//                           return;
//                         if (pricing.length == 0) {
//                           throw new Error(
//                             plan[0][1] +
//                               " | " +
//                               cc[1] +
//                               " | " +
//                               copay +
//                               " | " +
//                               fr +
//                               " | " +
//                               net[1]
//                           );
//                         }
//                         let table = pricing.map((t) => {
//                           let str = {
//                             conditions: [
//                               {
//                                 type: "CUSTOMER_MIN_AGE",
//                                 value: t.ageStart,
//                               },
//                               {
//                                 type: "CUSTOMER_MAX_AGE",
//                                 value: t.ageEnd,
//                               },
//                               {
//                                 type: "CUSTOMER_GENDER",
//                                 value: t.gender.toLowerCase(),
//                               },
//                             ],
//                             price: [
//                               {
//                                 value: parseFloat(
//                                   (t.rates / conversion).toFixed(2)
//                                 ),
//                                 currency: t.currency,
//                               },
//                             ],
//                           };
//                           return { ...str };
//                         });

//                         clone.premiumMod.conditionalPrices = table;
//                       });
//                       if (clone.premiumMod.conditionalPrices.length == 0)
//                         return;
//                       clonearray.push(clone);
//                       count++;
//                     });
//                   });
//                 });
//               });
//               str = {
//                 _id: `-${provider}.modifiers.deductible-`,
//                 plans: [...planIds],
//                 title: "Deductible modifier",
//                 label: "Deductibles",
//                 type: `-core.modifierTypes.deductible-`,
//                 assignmentType: "PER_PLAN",
//                 includedBenefits: [],
//                 isOptional: true,
//                 description: "",
//                 addonCost: {},
//                 premiumMod: "",
//                 conditions: [],
//                 hasOptions: true,
//                 options: clonearray,
//               };
//               newArr.push({ ...str });
//             }

//             if (key == "network") {
//               if (GlobalData.filters.networkType == "multiple") {
//                 let str = {
//                   _id: `-${provider}.modifiers.network-`,
//                   plans: [...planIds],
//                   title: "Network modifier",
//                   label: "Network",
//                   type: `-core.modifierTypes.network-`,
//                   assignmentType: "PER_PLAN",
//                   includedBenefits: [],
//                   isOptional: false,
//                   description: "",
//                   addonCost: {},
//                   premiumMod: "",
//                   conditions: [],
//                   hasOptions: true,
//                   options: [],
//                 };

//                 GlobalData.Networks.forEach((net) => {
//                   str.options.push({
//                     id: net[1],
//                     label: GlobalData.Provider + " " + net[1],
//                     description: net[1],
//                   });
//                 });

//                 newArr.push({ ...str });
//               } else {
//                 for (let ff in Ids.modifiers[key]) {
//                   let netlabel = GlobalData.Networks.find((n) =>
//                     n.includes(ff)
//                   )[1];
//                   let filtered_plans = GlobalData.plans.filter((pp) => {
//                     let n_check = DATA.find((dd) => dd.PlanName == pp[1])[
//                       "Network Details"
//                     ];

//                     let nn = GlobalData.Networks.find(
//                       (n) => n[1] == n_check
//                     )[0];
//                     return nn == ff;
//                   });
//                   let p_ = filtered_plans.map(
//                     (v) => `-${provider}.plans.${v[0]}-`
//                   );
//                   let str = {
//                     _id: `-${provider}.modifiers.network.${ff}-`,
//                     plans: p_,
//                     title: "Network modifier",
//                     label: "Network",
//                     type: `-core.modifierTypes.network-`,
//                     assignmentType: "PER_PLAN",
//                     includedBenefits: [],
//                     isOptional: false,
//                     description: "",
//                     addonCost: {},
//                     premiumMod: "",
//                     conditions: [{ type: "PLAN_EQUALS_TO", value: p_ }],
//                     hasOptions: true,
//                     options: [
//                       {
//                         id: netlabel,
//                         label: netlabel,
//                         description: netlabel,
//                       },
//                     ],
//                   };
//                   newArr.push({ ...str });
//                 }
//               }
//             }
//             let name = key == "paymentFrequency" ? "frequency" : false;
//             if (!name) return false;
//             // if (!(GlobalData[name].length > 1)) return;
//             GlobalData[name].forEach((v1, index) => {
//               // paymentFrequency -----------------------------------
//               if (
//                 key == "paymentFrequency" &&
//                 GlobalData.filters.frequency == "custom"
//               ) {
//                 if (index == 0) {
//                   let str = {
//                     _id: `-${provider}.modifiers.paymentFrequency.${v1}-`,
//                     plans: [...planIds],
//                     title: "Payment Frequency Modifier",
//                     label: "Additional Surcharges",
//                     type: `-core.modifierTypes.paymentFrequency-`,
//                     assignmentType: "PER_PLAN",
//                     includedBenefits: [],
//                     isOptional: false,
//                     description: "",
//                     addonCost: {},
//                     premiumMod: "",
//                     conditions: [],
//                     hasOptions: true,
//                     // options: pricingArr,
//                   };
//                   newArr.push({ ...str });
//                   return;
//                 }

//                 let clonearray = [];
//                 GlobalData["pricingTables"].forEach((plan) => {
//                   let [planName, coverage] = plan;
//                   GlobalData.Networks.forEach((net) => {
//                     coverage.forEach((cc) => {
//                       let c_id = `-${provider}.coverages.${cc[0]}-`;
//                       GlobalData["coPays"].forEach((v2, index) => {
//                         let [copay] = v2;
//                         let count = 1;
//                         let copayArr = [];
//                         clone = {
//                           id: "option-" + (index + 1),
//                           label: copay,
//                           premiumMod: {
//                             type: "conditional-override",
//                             conditionalPrices: [],
//                           },
//                           conditions: [
//                             {
//                               type: "MODIFIER_INCLUDED", // Network modifier with OPTION ID Network_B included
//                               value: [net],
//                             },
//                             {
//                               type: "COVERAGE_EQUALS_TO",
//                               value: [c_id],
//                             },
//                             {
//                               type: "PLAN_EQUALS_TO",
//                               value: [`-${provider}.plans.${planName[0]}-`],
//                             },
//                           ],
//                         };
//                         GlobalData["frequency"].forEach((fr, f_index) => {
//                           if (f_index > 0) return;
//                           let pricing = rateSheet.filter((n) => {
//                             // if (n.copay == "Nil") return false;
//                             return (
//                               n.planName == planName[1] &&
//                               n.coverage == cc &&
//                               n.copay == copay &&
//                               n.frequency == v1 &&
//                               n.network == net
//                             );
//                           });
//                           let table = pricing.map((t) => {
//                             let str = {
//                               conditions: [
//                                 {
//                                   type: "CUSTOMER_MIN_AGE",
//                                   value: t.ageStart,
//                                 },
//                                 {
//                                   type: "CUSTOMER_MAX_AGE",
//                                   value: t.ageEnd,
//                                 },
//                                 {
//                                   type: "CUSTOMER_GENDER",
//                                   value: t.gender.toLowerCase(),
//                                 },
//                               ],
//                               price: [
//                                 {
//                                   value: parseFloat(
//                                     (t.rates / conversion).toFixed(2)
//                                   ),
//                                   currency: t.currency,
//                                 },
//                               ],
//                             };
//                             return { ...str };
//                           });

//                           clone.premiumMod.conditionalPrices = table;
//                         });
//                         clonearray.push(clone);
//                       });
//                     });
//                   });
//                 });

//                 let str = {
//                   _id: `-${provider}.modifiers.paymentFrequency.${v1}-`,
//                   plans: [...planIds],
//                   title: v1 + " " + name,
//                   label: v1 + " " + name,
//                   type: `-core.modifierTypes.paymentFrequency-`,
//                   assignmentType: "PER_PLAN",
//                   includedBenefits: [
//                     // benefitCore.find((v) => check(v.title, key))._id,
//                   ],
//                   isOptional: false,
//                   description: "",
//                   addonCost: {},
//                   premiumMod: "",
//                   conditions: [],
//                   hasOptions: true,
//                   options: clonearray,
//                 };
//                 newArr.push({ ...str });
//               } else if (key == "paymentFrequency") {
//                 let str = {
//                   _id: `-${provider}.modifiers.paymentFrequency.${v1}-`,
//                   plans: [...planIds],
//                   title: "Payment Frequency Modifier",
//                   label: "Additional Surcharges",
//                   type: `-core.modifierTypes.paymentFrequency-`,
//                   assignmentType: "PER_PLAN",
//                   includedBenefits: [],
//                   isOptional: false,
//                   description: "",
//                   addonCost: {},
//                   premiumMod: "",
//                   conditions: [],
//                   hasOptions: true,
//                   options: [
//                     {
//                       id: "annual-payment-surcharge",
//                       label: "Annual",
//                     },
//                   ],
//                 };

//                 if (DATA[0]["Semi Annual Surcharge"] != "N/A") {
//                   str.options.push({
//                     id: "semi-annual-payment-surcharge",
//                     description: "Semmi-annual payment",
//                     title: "Semi-annual payment",
//                     label: "Semi-annual",
//                     premiumMod: {
//                       type: "percentage",
//                       price: [
//                         {
//                           value: +parseInt(DATA[0]["Semi Annual Surcharge"]),
//                         },
//                       ],
//                     },
//                   });
//                 }
//                 if (DATA[0]["Quarterly Surcharge"] != "N/A") {
//                   str.options.push({
//                     id: "quarterly-payment-surcharge",
//                     title: "Quarterly Surcharge payment",
//                     label: "Quarterly Surcharge",
//                     description: "Quarterly Surcharge payment frequency",
//                     premiumMod: {
//                       type: "percentage",
//                       price: [
//                         {
//                           value: +parseInt(DATA[0]["Quarterly Surcharge"]),
//                         },
//                       ],
//                     },
//                   });
//                 }
//                 if (DATA[0]["Monthly Surcharge"] != "N/A") {
//                   str.options.push({
//                     id: "Monthly-Surcharge-surcharge",
//                     title: "Monthly Surcharge payment",
//                     label: "Monthly Surcharge",
//                     description: "Monthly Surcharge payment frequency",
//                     premiumMod: {
//                       type: "percentage",
//                       price: [
//                         {
//                           value: +parseInt(DATA[0]["Monthly Surcharge"]),
//                         },
//                       ],
//                     },
//                   });
//                 }

//                 newArr.push(str);
//               }
//             });
//           });
//           // custom code here ----------------------------------
//           // extra ---------------------------------------------
//           // if (DATA[0].extra) {
//           //   let extraArr = [];
//           //   DATA.forEach((v) => {
//           //     v.extra && extraArr.push(v.extra);
//           //   });

//           //   extraArr.forEach((v1) => {
//           //     // set code here for extra benefits
//           //     if (v1 === "Healthy Connect Module") {
//           //       let clonearray = [];
//           //       GlobalData["pricingTables"].forEach((plan) => {
//           //         let [planName, coverage] = plan;
//           //         GlobalData.Networks.forEach((net) => {
//           //           coverage.forEach((cc) => {
//           //             let c_id = Ids.coverages[cc];
//           //             GlobalData["coPays"].forEach((v2, index) => {
//           //               let [copay] = v2;
//           //               let count = 1;
//           //               let copayArr = [];
//           //               clone = {
//           //                 id: "option-" + (index + 1),
//           //                 label: copay,
//           //                 premiumMod: {
//           //                   type: "conditional-override",
//           //                   conditionalPrices: [],
//           //                 },
//           //                 conditions: [
//           //                   {
//           //                     type: "MODIFIER_INCLUDED", // Network modifier with OPTION ID Network_B included
//           //                     value: [net],
//           //                   },
//           //                   {
//           //                     type: "COVERAGE_EQUALS_TO",
//           //                     value: [c_id],
//           //                   },
//           //                   {
//           //                     type: "Plan_EQUALS_TO",
//           //                     value: [Ids["plans"][planName]],
//           //                   },
//           //                   {
//           //                     type: "FREQUENCY_EQUALS_TO",
//           //                     value: [Ids["paymentFrequency"][v1]],
//           //                   },
//           //                 ],
//           //               };
//           //               GlobalData["frequency"].forEach((fr, f_index) => {
//           //                 let pricing = rateSheet.filter((n) => {
//           //                   // if (n.copay == "Nil") return false;
//           //                   return (
//           //                     n.planName == plan[0] &&
//           //                     n.coverage == cc &&
//           //                     n.copay == copay &&
//           //                     n.frequency == v1 &&
//           //                     n.network == net
//           //                   );
//           //                 });
//           //                 let table = pricing.map((t) => {
//           //                   let str = {
//           //                     conditions: [
//           //                       {
//           //                         type: "CUSTOMER_MIN_AGE",
//           //                         value: t.ageStart,
//           //                       },
//           //                       {
//           //                         type: "CUSTOMER_MAX_AGE",
//           //                         value: t.ageEnd,
//           //                       },
//           //                       {
//           //                         type: "CUSTOMER_GENDER",
//           //                         value: t.gender.toLowerCase(),
//           //                       },
//           //                     ],
//           //                     price: [
//           //                       {
//           //                         value:
//           //                           parseFloat((t.rates / conversion).toFixed(2)) +
//           //                           (t.healthy / conversion).toFixed(2),
//           //                         currency: t.currency,
//           //                       },
//           //                     ],
//           //                   };
//           //                   return { ...str };
//           //                 });

//           //                 clone.premiumMod.conditionalPrices = table;
//           //               });
//           //               clonearray.push(clone);
//           //             });
//           //           });
//           //         });
//           //       });
//           //       let str = {
//           //         _id: Ids.modifiers["benefits"][v1],
//           //         plans: [...planIds],
//           //         title: v1,
//           //         label: v1,
//           //         type: "",
//           //         assignmentType: "PER_CUSTOMER",
//           //         includedBenefits: [],
//           //         isOptional: false,
//           //         description: "",
//           //         addonCost: {},
//           //         premiumMod: "",
//           //         conditions: [],
//           //         hasOptions: true,
//           //         options: clonearray,
//           //       };
//           //       newArr.push({ ...str });
//           //     }
//           //     if (v1 === "Mother & Baby Module") {
//           //       let clonearray = [];
//           //       GlobalData["pricingTables"].forEach((plan) => {
//           //         let [planName, coverage] = plan;
//           //         GlobalData.Networks.forEach((net) => {
//           //           coverage.forEach((cc) => {
//           //             let c_id = Ids.coverages[cc];
//           //             GlobalData["coPays"].forEach((v2, index) => {
//           //               let [copay] = v2;
//           //               let count = 1;
//           //               let copayArr = [];
//           //               clone = {
//           //                 id: "option-" + (index + 1),
//           //                 label: copay,
//           //                 premiumMod: {
//           //                   type: "conditional-override",
//           //                   conditionalPrices: [],
//           //                 },
//           //                 conditions: [
//           //                   {
//           //                     type: "MODIFIER_INCLUDED", // Network modifier with OPTION ID Network_B included
//           //                     value: [net],
//           //                   },
//           //                   {
//           //                     type: "COVERAGE_EQUALS_TO",
//           //                     value: [c_id],
//           //                   },
//           //                   {
//           //                     type: "Plan_EQUALS_TO",
//           //                     value: [Ids["plans"][planName]],
//           //                   },
//           //                   {
//           //                     type: "FREQUENCY_EQUALS_TO",
//           //                     value: [Ids["paymentFrequency"][v1]],
//           //                   },
//           //                 ],
//           //               };
//           //               GlobalData["frequency"].forEach((fr, f_index) => {
//           //                 let pricing = rateSheet.filter((n) => {
//           //                   // if (n.copay == "Nil") return false;
//           //                   return (
//           //                     n.planName == plan[0] &&
//           //                     n.coverage == cc &&
//           //                     n.copay == copay &&
//           //                     n.frequency == v1 &&
//           //                     n.network == net
//           //                   );
//           //                 });
//           //                 let table = pricing.map((t) => {
//           //                   let str = {
//           //                     conditions: [
//           //                       {
//           //                         type: "CUSTOMER_MIN_AGE",
//           //                         value: t.ageStart,
//           //                       },
//           //                       {
//           //                         type: "CUSTOMER_MAX_AGE",
//           //                         value: t.ageEnd,
//           //                       },
//           //                       {
//           //                         type: "CUSTOMER_GENDER",
//           //                         value: t.gender.toLowerCase(),
//           //                       },
//           //                     ],
//           //                     price: [
//           //                       {
//           //                         value:
//           //                           parseFloat((t.rates / conversion).toFixed(2)) +
//           //                           (t.healthy / conversion).toFixed(2),
//           //                         currency: t.currency,
//           //                       },
//           //                     ],
//           //                   };
//           //                   return { ...str };
//           //                 });

//           //                 clone.premiumMod.conditionalPrices = table;
//           //               });
//           //               clonearray.push(clone);
//           //             });
//           //           });
//           //         });
//           //       });

//           //       let index = newArr.findIndex(
//           //         (v) =>
//           //           v.title == "Maternity (Consultations, Scans and Delivery)"
//           //       );
//           //       newArr[index].hasOptions = true;
//           //       newArr[index].options = copayArr;
//           //     }
//           //   });
//           // }

//           createFile("modifiers", "index", newArr, provider, true);
//         }

//         // ---------------------------------------

//         coverage();
//         plan();
//         table();
//         modifiers();
//       } catch (error) {
//         console.log({ err: error.message, stack: error.stack });
//       }
//     }
//     main();
//   }
//   if (process.argv[2] == "-global") {
//     console.log(Ids);
//     console.log("-------------------------");
//     console.log(GlobalData);
//   }
// };
