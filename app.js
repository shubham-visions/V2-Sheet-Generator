const xlsx = require("xlsx");
const fs = require("fs");
const { getList, createFile, remove, splitFile } = require("./Code/List");
const generateCodeIndex = require("./Code/generateId");
const {
  maxArrLength,
  benefitCore,
  enumData,
  indexData,
  UAE,
  NE,
  NE_Dubai,
  AbuDhabi,
} = require("./Code/constants");

let resCount = process.argv.find((v) => v.includes("res"));
if (!resCount) {
  console.log("residency count not found!!");
  process.exit(1);
}
resCount = parseInt(resCount.split(":")[1]);
if (resCount == NaN || resCount > 3) {
  console.log("res value should be Number & upto 3");
  process.exit(1);
}
let folderName = process.argv.find((v) => v.includes("name"));
if (!folderName) {
  console.log("Company folder not found!!");
  process.exit(1);
}
folderName = folderName.split(":")[1];

let Arr = new Array(resCount).fill(null);

const code = () => {
  const replaceChar = (word) => {
    word = word.replace(" ", "");
    while (word.includes(" ")) {
      word = word.replace(" ", "");
    }
    word = word.replace("/", "");
    word = word.replace("-", "");
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
  const benefitSheet = xlsx.readFile(`./Input/${folderName}/userType.xlsx`);
  const Benefits = xlsx.utils
    .sheet_to_json(benefitSheet.Sheets[benefitSheet.SheetNames[0]])
    .map((v) => {
      return { benefits: remove(v.benefits), userType: v.userType };
    });
  let str = "12";
  const planSheets = new Array(resCount).fill(null).map((v, i) => {
    return xlsx.readFile(
      `./Input/${folderName}/benefits${str[i - 1] ? str[i - 1] : ""}.xlsx`
    );
  });
  const GlobalDatas = planSheets.map((v) =>
    convertXlsx(v.Sheets[v.SheetNames[0]])
  );
  const rateSheets = new Array(resCount).fill(null).map((v, i) => {
    let rates = xlsx.readFile(
      `./Input/${folderName}/rateSheet${str[i - 1] ? str[i - 1] : ""}.xlsx`
    );
    return xlsx.utils.sheet_to_json(rates.Sheets[rates.SheetNames[0]]);
  });
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
      },
    ];
    createFile("provider", "index", str, provider);
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
    let coverage_data = store.coverages.map((v) => {
      let clone = {
        _id: `-${provider}.coverages${id}.${v.coverageName[0]}-`,
        title: v.coverageName[1],
        internalTitle: v.coverageName[1],
        includedResidence:
          DATA[0].residency == "UAE"
            ? UAE[0]
            : DATA[0].residency == "NE"
            ? NE[0]
            : DATA[0].residency == "Dubai"
            ? Dubai[0]
            : DATA[0].residency == "NE/Dubai"
            ? NE_Dubai[0]
            : AbuDhabi[0],
        excludedResidence:
          DATA[0].residency == "UAE"
            ? UAE[1]
            : DATA[0].residency == "NE"
            ? NE[1]
            : DATA[0].residency == "Dubai"
            ? Dubai[1]
            : DATA[0].residency == "NE/Dubai"
            ? NE_Dubai[1]
            : AbuDhabi[1],
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
  function plan(store, Id, n) {
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
            userType: "-Enum.userType.All-",
            benefitTypes: ["-core.benefitTypes.physiotherapy-"],
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
            userType: "-Enum.userType.Starter-",
            benefitTypes: ["-core.benefitTypes.outPatientBenefit-"],
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
    let Plans = store.plans.map((plan) => {
      let tableIds = [];
      for (const key in Id.pricingTables[plan[0]]) {
        tableIds.push(`-${provider}.pricingTables${n}.${plan[0]}.${key}-`);
      }
      let clone = {
        _id: `-${provider}.plans${n}.${plan[0]}-`,
        provider: `-${provider}.providers-`,
        title: plan[1],
        notes: "",
        benefitCategories: benefitTypes,
        pricingTables: tableIds,
        modifiers: modifiersId,
      };
      return clone;
    });
    return Plans;
  }
  let Plans = Arr.reduce((acc, v, i) => {
    let data = plan(GlobalDatas[i], Ids[i], resCount > 1 ? i + 1 : "");
    return [...acc, ...data];
  }, []);
  createFile("plans", "index", Plans, provider, true, true);
  // -----------------------------------------------------------------------------------------------------

  // ----------------------------------Pricing Table -----------------------------------------------------
  let addUp = ["", 1];
  function rateTable(store, Id, DATA, n, rateSheet) {
    try {
      let splitted;
      const conversion =
        DATA[0].rateIn == "USD"
          ? 1
          : DATAs[0][0].conversionRate
          ? DATAs[0][0].conversionRate
          : 3.6725;
      let PricingTable = [];
      let tableCount = 1;
      for (const key in Id.pricingTables) {
        let plan = Id.pricingTables[key];
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
        ).copay;
        let plan_network = rateSheet.find(
          (r) => r.planName == originalName(key)
        ).network;
        for (let v in plan) {
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
            if (DATA[0].planCopay == "-Enum.maritalStatus.single-") {
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
            DATA[0].planCopay != "-Enum.maritalStatus.single-"
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
                    value: t.maternity
                      ? t.dental
                        ? parseFloat(
                            (
                              parseFloat(t.dental / conversion) +
                              parseFloat(t.maternity / conversion) +
                              parseFloat(t.rates / conversion)
                            ).toFixed(2)
                          )
                        : parseFloat(
                            (
                              parseFloat(t.maternity / conversion) +
                              parseFloat(t.rates / conversion)
                            ).toFixed(2)
                          )
                      : parseFloat((t.rates / conversion).toFixed(2)),
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
              return { ...str };
            });
          } else {
            let n = pricing.reduce((acc, v) => {
              if (acc.includes(v.network)) return acc;
              else return [...acc, v.network];
            }, []);
            pricing = pricing.filter((v) => v.network == plan_network);
            table = pricing.map((t) => {
              let str = {
                fromAge: t.ageStart,
                toAge: t.ageEnd,
                gender: `-Enum.gender.${t.gender.toLowerCase()}-`,
                price: [
                  {
                    value: 0,
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
              return { ...str };
            });
          }
          if (table.length > maxArrLength) {
            splitted = splitFile(table, key, "PricingTable", addUp[1]);
            if (splitted == 1) {
              addUp[0] += `const table${addUp[1]} = require("../${key}/${key}1.js"); `;
              addUp[1]++;
            } else {
              for (i = 1; i <= splitted; i++) {
                addUp[0] += `const table${addUp[1]} = require("../${key}/${key}${addUp[1]}.js"); `;
                addUp[1]++;
              }
            }
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
            includedResidence:
              DATA[0].residency == "UAE"
                ? UAE[0]
                : DATA[0].residency == "NE"
                ? NE[0]
                : DATA[0].residency == "Dubai"
                ? Dubai[0]
                : DATA[0].residency == "NE/Dubai"
                ? NE_Dubai[0]
                : AbuDhabi[0],
            excludedResidence:
              DATA[0].residency == "UAE"
                ? UAE[1]
                : DATA[0].residency == "NE"
                ? NE[1]
                : DATA[0].residency == "Dubai"
                ? Dubai[1]
                : DATA[0].residency == "NE/Dubai"
                ? NE_Dubai[1]
                : AbuDhabi[1],
            coverage: [`-${provider}.coverages${n}.${v}-`],
            baseAnnualPremium: splitted
              ? `-[...tables${tableCount}]-`
              : [...table],
          };
          if (addUp[1] > 0 && splitted) {
            let str = `let tables${tableCount} = [`;
            for (i = addUp[1] - splitted; i < addUp[1]; i++) {
              str += "...table" + i + ", ";
            }
            addUp[0] += str + "]; ";
            tableCount++;
          }
          PricingTable.push({ ...clone });
        }
      }
      return PricingTable;
    } catch (error) {
      console.log("error --> ", { msg: error.message, stack: error.stack });
    }
  }
  let pricingArr = Arr.reduce((acc, v, i) => {
    let data = rateTable(
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
    GlobalDatas[0].filters.networkType != "-Enum.maritalStatus.single-"
      ? "Prices are based on deductible so prices are list as 0"
      : "",
    addUp[0]
  );
  // -----------------------------------------------------------------------------------------------------

  // -------------------------------- Modifiers file -----------------------------------------------------
  function modifiers(store, Id, DATA, n, rateSheet) {
    const conversion =
      DATA[0].rateIn == "USD"
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
        if (modifiers.length == 0)
          modifiers[key] = [{ plans: [PlanName], value: d[key] }];
        else if (modifiers[key]) {
          if (modifiers[key][modifiers[key].length - 1].value == d[key]) {
            let index = modifiers[key].findIndex((v) => v.value == d[key]);
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
    store.Modifiers.forEach((key) => {
      // console.log("keys -- ", key);
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
          let str = {
            _id: `-${provider}.modifiers${n}.benefits.${
              Benefits.find((v) => v.benefits[1] == key).benefits[0]
            }-`,
            plans: [...planIds],
            title: key,
            label: key,
            type: "-core.modifierTypes.benefit-",
            assignmentType: "PER_PLAN",
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
              : modifiers[key][0].value.toString().includes("$copay")
              ? ""
              : modifiers[key][0].value;
          str.isOptional = false;
          str.hasOptions = modifiers[key].length > 1;
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
                str.options.push(cc);
                count++;
              }
            });
          } else if (modifiers[key][0].value.toString().includes("$copay")) {
            str.options = [];
            let count = 1;
            if (DATA[0].$copay) {
              let $copay = DATA.reduce((acc, v) => {
                if (v.$copay) return [...acc, v.$copay];
                return acc;
              }, []);
              $copay.forEach((v) => {
                let [value, copays] = v.split(" - ");
                let cc = {
                  id: "option-" + count,
                  label: value,
                  description: value,
                  conditions: [
                    {
                      type: "-Enum.conditions.deductible-",
                      value: copays.includes("/")
                        ? copays.split("/")
                        : [copays],
                    },
                  ],
                };
                str.options.push(cc);
                count++;
              });
            } else
              store.coPays.forEach((v) => {
                let [copay, scope] = v;
                if (!scope.includes("all") && scope.includes(m.plans)) return;
                let cc = {
                  id: "option-" + count,
                  label: copay[0],
                  description: copay[0],
                  conditions: [
                    {
                      type: "-Enum.conditions.deductible-",
                      value: [copay[0]],
                    },
                  ],
                };
                str.options.push(cc);
                count++;
              });
          }
          newArr.push(str);
        }
      }
      if (key == "discount") {
        let str = {
          _id: `-${provider}.modifiers${n}.discount-`,
          plans: [...planIds],
          title: key,
          label: key,
          type: `-core.modifierTypes.discount,-`,
          assignmentType: "PER_PLAN",
          includedBenefits: [],
          isOptional: false,
          description: "",
          addonCost: {},
          premiumMod: "",
          conditions: [],
          hasOptions: true,
        };
        store[key].forEach((v1) => {
          let [discount, numCustomer] = v1;
          str.options = {
            id: `${discount}-discount`,
            label: `${discount} Discount`,
            premiumMod: {
              type: "percentage",
              price: [{ value: -Number(discount.replace("%", "")) }],
            },
            description: `${discount} Discount`,
            conditions: [
              {
                type: "NUM_CUSTOMERS",
                value: Number(numCustomer),
              },
            ],
          };
          newArr.push(str);
        });
      }
      // deductible -----------------------------------------
      if (key == "deductible") {
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
                          value: t.maternity
                            ? t.dental
                              ? parseFloat(
                                  (
                                    parseFloat(t.dental / conversion) +
                                    parseFloat(t.maternity / conversion) +
                                    parseFloat(t.rates / conversion)
                                  ).toFixed(2)
                                )
                              : parseFloat(
                                  (
                                    parseFloat(t.maternity / conversion) +
                                    parseFloat(t.rates / conversion)
                                  ).toFixed(2)
                                )
                            : parseFloat((t.rates / conversion).toFixed(2)),
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
                });
                if (clone.premiumMod.conditionalPrices.length == 0) return;
                clonearray.push(clone);
                count++;
              });
            });
          });
        });
        // for (let i = 0; i < 4; i++) {
        //   let data = clonearray.splice(0, 54);
        //   createFile("copay", `index-${i}`, data, provider, true);
        // }

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
      if (key == "network") {
        if (store.filters.networkType == "multiple") {
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
              conditions: [{ type: "-Enum.conditions.plans-", value: p_ }],
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
      let name = key == "paymentFrequency" ? "frequency" : false;
      // console.log(store[name]);
      if (!name) return false;
      // if (!(store[name].length > 1)) return;
      // paymentFrequency -----------------------------------

      function rateExtraction(fr) {
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
                if (
                  DATA[0].planCopay == "-Enum.maritalStatus.single-" &&
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
                        value: t.maternity
                          ? t.dental
                            ? parseFloat(
                                (
                                  parseFloat(t.dental / conversion) +
                                  parseFloat(t.maternity / conversion) +
                                  parseFloat(t.rates / conversion)
                                ).toFixed(2)
                              )
                            : parseFloat(
                                (
                                  parseFloat(t.maternity / conversion) +
                                  parseFloat(t.rates / conversion)
                                ).toFixed(2)
                              )
                          : parseFloat((t.rates / conversion).toFixed(2)),
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
                clonearray.push(clone);
                count++;
              });
            });
          });
        });
        return clonearray;
      }

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
              semiAnnual.premiumMod = {
                type: "conditional-override",
                conditionalPrices: rateExtraction("Semi-Annually"),
              };
            } else
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
          if (DATA[0]["Quarterly Surcharge"] != "N/A") {
            let quarterly = {
              id: "quarterly-payment-surcharge",
              title: "Quarterly Surcharge payment",
              label: "Quarterly Surcharge",
              description: "Quarterly Surcharge payment frequency",
              premiumMod: {},
            };
            if (DATA.find((v) => v.frequency == "Quarterly")) {
              quarterly.premiumMod = {
                type: "conditional-override",
                conditionalPrices: rateExtraction("Quarterly"),
              };
            } else
              quarterly.premiumMod = {
                type: "percentage",
                price: [
                  {
                    value: +parseInt(DATA[0]["Quarterly Surcharge"]),
                  },
                ],
              };
            str.options.push(quarterly);
          }
          if (DATA[0]["Monthly Surcharge"] != "N/A") {
            let monthly = {
              id: "Monthly-Surcharge-surcharge",
              title: "Monthly Surcharge payment",
              label: "Monthly Surcharge",
              description: "Monthly Surcharge payment frequency",
              premiumMod: {},
            };
            if (DATA.find((v) => v.frequency == "Monthly")) {
              monthly.premiumMod = {
                type: "conditional-override",
                conditionalPrices: rateExtraction("Monthly"),
              };
            } else
              monthly.premiumMod = {
                type: "percentage",
                price: [
                  {
                    value: +parseInt(DATA[0]["Monthly Surcharge"]),
                  },
                ],
              };
            str.options.push(monthly);
          }
          newArr.push({ ...str });
        }
      });
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
    //                           parseFloat((t.rates / conversion).toFixed(2)) +
    //                           (t.healthy / conversion).toFixed(2),
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
    //                           parseFloat((t.rates / conversion).toFixed(2)) +
    //                           (t.healthy / conversion).toFixed(2),
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
  createFile("modifiers", "index", modifierArr, provider, true, true);
  // ----------------------------------------------------------------------
};

code();
