// --------------------------------- Rate Table -------------------------------------------------------
function rateTable(store, Id, rateSheet, provider) {
    try {
      let result = [];
      let num = 1;
      store?.plans.forEach((plan) => {
        store.coverages.forEach((coverages) => {
          let coverage = coverages.coverageName;
          ["coPayIP", "coPayOP"].forEach((types) => {
            store[types].forEach((copays, i) => {
              let [copay] = copays;
              let type = types.split("y")[1];
              let Schema = {
                _id: `-generateMongoIdFromString('${provider} rateTable ${i + 1}')-`,
                plans: [`-${provider}.plans.${plan[1]}-`],
                filters: [
                  {
                    type: "DEDUCTIBLE",
                    // values: [${type.toLowerCase()}-option-${i + 1}],
                    // value: -cigna_global_health.modifiers.deductible.${type}-,
                    value: `${type.toLowerCase()}-option-${i + 1}`,
                  },
                  {
                    type: "COVERAGE",
                    value: `-cigna_global_health.coverages.${coverage[0]}-`,
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
              // if (rates.length == 0) {
              //   console.log("--> ", type, plan[1], coverage[1], copay);
​
              //   throw new Error("rates 0");
              // }
​
              Schema.rates = rates;
              result.push(Schema);
            });
          });
        });
      });
      return result;
    } catch (error) {
      console.log("error --> ", { msg: error.message, stack: error.stack });
    }
  }
  let rateArr = Arr.reduce((acc, v, i) => {
    let data = rateTable(GlobalDatas[i], Ids[i], rateSheets[i], provider);
    return [...acc, ...data];
  }, []);

  createFile("RateTable", "index", rateArr, provider, false, true);
})();