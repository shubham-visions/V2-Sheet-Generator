const generateCodeIndex = (data, benefits, DATA, n = false) => {
  try {
    let struc = {
      providers: `-generateMongoIdFromString('${data.Provider}')-`,
      plans: "",
      pricingTables: "",
      coverages: "",
      modifiers: "",
    };

    for (const key in struc) {
      let value = {};
      if (key === "providers" || key === "core") continue;
      data[key]?.forEach((v, i) => {
        if (key == "coverages") {
          value[v.coverageName[0]] = `-generateMongoIdFromString('${key} ${
            v.coverageName[0]
          } ${data.Provider} ${n ? n : ""}')-`;
          return;
        }
        if (key == "pricingTables") {
          let temp = {};
          v[1].forEach((cc) => {
            temp[cc[0]] = `-generateMongoIdFromString('${v[0][0]} ${cc[0]} ${
              data.Provider
            } ${n ? n : ""}')-`;
          });
          value[v[0][0]] = temp;
          return;
        }

        value[v[0]] = `-generateMongoIdFromString('${v[0]} ${data.Provider} ${
          n ? n : ""
        }')-`;
      });
      if (key == "modifiers") {
        let obj = {};
        data["Modifiers"].forEach((v) => {
          if (v == "deductible") {
            obj[v] = `-generateMongoIdFromString('${data.Provider} ${
              n ? n : ""
            } ${v}')-`;
          }
          if (v == "benefits") {
            let b = {};
            benefits.forEach((k) => {
              if (k.userType == "type") return;
              b[k.benefits[0]] = `-generateMongoIdFromString('${
                data.Provider
              } ${n ? n : ""} ${k.benefits[0]}')-`;
            });
            obj[v] = b;
            return;
          }
          if (v == "discount") {
            let b = {};
            DATA.forEach((v) => {
              if (v.discounts)
                b = `-generateMongoIdFromString('${data.Provider} ${
                  n ? n : ""
                } ${v.discounts}')-`;
            });
            obj[v] = b;
            return;
          }
          if (v == "network") {
            let b = {};

            if (data.filters.networkType == "single") {
              data["Networks"].forEach((v1) => {
                if (Array.isArray(v1)) v1 = v1[0];
                b[v1] = `-generateMongoIdFromString('${v1} ${data.Provider} ${
                  n ? n : ""
                }')-`;
              });
            } else {
              b = `-generateMongoIdFromString('${data.Provider} ${v} ${
                n ? n : ""
              }')-`;
            }

            obj[v] = b;
          }
          let b = {};

          let name = v == "paymentFrequency" ? "frequency" : false;
          if (!name) return;
          data[name].forEach((v1) => {
            if (Array.isArray(v1)) v1 = v1[0];
            b[v1] = `-generateMongoIdFromString('${data.Provider} ${
              n ? n : ""
            } ${v1}')-`;
          });
          obj[v] = b;
        });
        value = obj;
      }
      struc[key] = value;
    }

    let check = DATA[0].extra == "Healthy Connect Module";
    if (check)
      struc.modifiers.benefits[
        "Healthy Connect Module"
      ] = `-generateMongoIdFromString('Healthy Connect Module')-`;
    if (data.filters.addons.includes("Repat"))
      struc.modifiers.benefits[
        "extendedEvacuation"
      ] = `-generateMongoIdFromString('${data.Provider} Extended Evacuation ${n}')-`;
    return struc;
  } catch (error) {
    console.log({ err: error.message, stack: error.stack });
    process.exit(1);
  }
};

module.exports = generateCodeIndex;
