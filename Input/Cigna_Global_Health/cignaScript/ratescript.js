let codes = [
    'High-Africa - High-Africa - Low',
    'High-Africa - Low-Africa - Low',
    'High-Asia - High-Asia - High',
    'High-Asia - Mid-High-Asia - Mid-High',
    'High-Asia - Middle-Asia - Mid-High',
    'High-Middle East-Middle East',
    'Low-Asia - Low-Asia - Low',
    'Low-Asia - Mid-Low-Asia - Mid-Low',
    'Low-Europe - Low-Europe - Low',
    'Low-Oceania-Oceania',
    'Medium-Africa - High-Africa - High',
    'Medium-Americas - High-Americas - High',
    'Medium-Americas - High-Americas - Middle',
    'Medium-Americas - Low-Americas - Low',
    'Medium-Americas - Low-Americas - Middle',
    'Medium-Americas - Mid-High-Americas - Mid-High',
    'Medium-Americas - Middle-Americas - Middle',
    'Medium-Asia - Low-Asia - Low',
    'Medium-Asia - Mid-Low-Asia - Low',
    'Medium-Asia - Mid-Low-Asia - Mid-Low',
    'Medium-Asia - Middle-Asia - Middle',
    'Medium-Europe - High-Europe - High',
    'Medium-Europe - Mid-High-Europe - Mid-High',
    'Medium-Europe - Middle-Europe - Middle',
    'Medium-Oceania-Oceania',
    'United States-United States-United States'
  ];

  const files = [
    "/home/support/Downloads/V2 Generator/V2-Sheet-Generator/Input/Cigna_Global_Health/cignaScript/inputRates/IP_1.xlsx",
    "/home/support/Downloads/V2 Generator/V2-Sheet-Generator/Input/Cigna_Global_Health/cignaScript/inputRates/IP_2.xlsx",
    "/home/support/Downloads/V2 Generator/V2-Sheet-Generator/Input/Cigna_Global_Health/cignaScript/inputRates/IP_3.xlsx",
    "/home/support/Downloads/V2 Generator/V2-Sheet-Generator/Input/Cigna_Global_Health/cignaScript/inputRates/OP_1.xlsx",
    "/home/support/Downloads/V2 Generator/V2-Sheet-Generator/Input/Cigna_Global_Health/cignaScript/inputRates/OP_2.xlsx"
  ]

  const xlsx = require("xlsx")
  const jsonToCSV = require("json-to-csv");
  
  var wholeData = []
  files.forEach((path, p) => {
    console.log('path >> ', path)
    const rate = xlsx.readFile(path);
    let sheetData = xlsx.utils.sheet_to_json(rate.Sheets[rate.SheetNames[0]]);

    console.log(`sheetData ${p+1} data >> `, sheetData.length);

    
    if(p <=3 ) {
        wholeData = wholeData.concat(sheetData)
        return
    }

    console.log('wholeData ', wholeData.length);

    codes.forEach(async (countryCode, i) => {
        let cData = wholeData.filter((v) => v.code == countryCode)
        .map((data, j) => {
            return {
                planName: data.planName,
                network: data.network,
                copay: data.copay,
                ageStart: data.ageStart,
                ageEnd: data.ageEnd,
                code: data.code,
                coverages: data.coverages,
                rates: data.rates,
                type: data.type,
                frequency: "Annually",
                curreny: "USD"
            }
        })

        let countryCodeName = countryCode.replaceAll(" ", "")
        console.log('cData >> ', cData.length);
        await jsonToCSV(cData, `/home/support/Downloads/V2 Generator/V2-Sheet-Generator/Input/Cigna_Global_Health/cignaScript/output/latestRates/rateSheet${i}.xlsx`)
        .then(() => {
          console.log("Sheet Generated Successfully!");
        })
        .catch((error) => {
          console.log("Something went wrong");
          console.log({ err: error });
        });
    })
    
  })



