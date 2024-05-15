const fs = require("fs");
const xlsx = require("xlsx");
const { maxArrLength, singleChild } = require("./constants");
​
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
      "addon",
      `${addonName.includes(" ") ? addonName.split(" ")[0] : addonName}-info`
    );
  ​
    console.log('info[0] >> ', info[0]);
    let addonRates = info[0].sheetName
      ? readFile(folderName, "addon", info[0].sheetName)
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
  ​
    console.log('benefit >> ', benefit._id);
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
          code: "-Enum.conditions.deductible-",
        };
  ​
        console.log('addonRates.length >> ', addonRates.length);
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
                    con.value = `-${provider}.${
                      col == "planName" ? "plans" : "coverages"
                    }${num}.${remove(rate[col])[0]}-`;
                  else if (col == "singleChild")
                    con = singleChild[`_${rate[col]}`];
                    else if (col == "code")
                    con = singleChild[`_${rate[col]}`];
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