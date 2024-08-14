import xlsx from "xlsx";
​
const rate = xlsx.readFile(
  "/home/support/Downloads/V1 Generator/Input/April/UAE/aprilRatescript/Allianz-ratesExtraction/r1.xlsx"
);
let sheetData = xlsx.utils.sheet_to_json(rate.Sheets[rate.SheetNames[0]]);
​
let columnsArray = xlsx.utils.sheet_to_json(rate.Sheets[rate.SheetNames[0]], {
  header: 1,
})[0];
​
import jsonToCSV from "json-to-csv";
​
​
const OPs = [
  "Gold",
  "Gold 10%",
  "Gold 20%",
  "Pearl",
  "Pearl 10%",
  "Pearl 20%",
  "Silver",
  "Silver 10%",
  "Silver 20%",
];
​
const plans = [
    "Elite",
    "Prime",
    "Select"
  ];
​
function genrateRate() {
    let ratesArray = []
  for (let i = 0; i < 3; i++) {
    for (let k = 0; k < sheetData.length; k++) {
      const rate = sheetData[k];
      const rateKeys = Object.keys(rate)
      for (let l = 0; l < plans.length; l++) {
        const planName = plans[l];
        for (let j = 0; j < OPs.length; j++) {
            const OpRates = OPs[j];
            // const keys = Object.keys(OpRates)
​
            // console.log('rateKeys >> ', rateKeys);
​
            const opName = OpRates.split(" ")
            var planLastName = opName[0]
             
            let obj = {
                "planName": l == 0 ?  `${rateKeys[2]} ${planLastName}` : l == 1 ? `${rateKeys[4]} ${planLastName}` : `${rateKeys[5]} ${planLastName}`,
                "network": "",
                "coverage": rate.coverage,
                "gender": rate.Gender,
                "ageStart": rate['Age'],
                "ageEnd": rate['Age'],
                "rates": rate[planName] + rate[OpRates],
                "copay": OpRates.includes("10%") ? "10% with USD 14 per visit" : OpRates.includes("20%") ? "20% with USD 28 per visit" : "NIL co-pay",
                "frequency": "Annually",
                "currency": "USD",
                "repat": rate.repat,
                "dental": i == 0 ? rate['Dental 1'] : i == 1 ? rate['Dental 2'] : rate['Dental 3'],
                "dentalType": i+1,
                "maternity": (planName == "Elite" && rate['Elite Maternity']) ? rate['Elite Maternity'] : (planName == "Prime" && rate['Prime Maternity']) ? rate['Prime Maternity'] : '',
                "singleChild": "1"
            }
    
            // console.log('obj >> ', obj);
​
            ratesArray.push(obj)
    
            // if(k>1) break;
          }
      }
    }
  }
​
  jsonToCSV(ratesArray, '/home/support/Downloads/V1 Generator/Input/April/UAE/aprilRatescript/Allianz-ratesExtraction/rateOutput/rateSheet1.csv')
        .then(() => {
          console.log("Sheet Generated Successfully!");
        })
        .catch((error) => {
          console.log("Something went wrong");
          console.log({ err: error });
        });
}
​
genrateRate();