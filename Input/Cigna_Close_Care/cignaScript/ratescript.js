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
  ];
  

  const files = [
    "/home/support/Desktop/saleslabb/V2-Sheet-Generator-Forked/Input/Cigna_Close_Care/cignaScript/inputRates/IP_1.xlsx",
    "/home/support/Desktop/saleslabb/V2-Sheet-Generator-Forked/Input/Cigna_Close_Care/cignaScript/inputRates/IP_2.xlsx",
    "/home/support/Desktop/saleslabb/V2-Sheet-Generator-Forked/Input/Cigna_Close_Care/cignaScript/inputRates/OP_1.xlsx",
    "/home/support/Desktop/saleslabb/V2-Sheet-Generator-Forked/Input/Cigna_Close_Care/cignaScript/inputRates/OP_1.xlsx",
  ];


  const ipcopay = {
    '$0, 0% Co-insurance, $0 Out of pocket': '$0, 0% Co-insurance, $0 Out of pocket',
    '$0, 10% Co-insurance, $2,000 Out of pocket - £1,330/€1,480': '$0, 10% Co-insurance, $2,000 Out of pocket',
    '$0, 10% Co-insurance, $5,000 Out of pocket - £3,325/€3,700': '$0, 10% Co-insurance, $5,000 Out of pocket',
    '$0, 20% Co-insurance, $2,000 Out of pocket - £1,330/€1,480': '$0, 20% Co-insurance, $2,000 Out of pocket',
    '$0, 20% Co-insurance, $5,000 Out of pocket - £3,325/€3,700': '$0, 20% Co-insurance, $5,000 Out of pocket',
    '$0, 30% Co-insurance, $2,000 Out of pocket - £1,330/€1,480': '$0, 30% Co-insurance, $2,000 Out of pocket',
    '$0, 30% Co-insurance, $5,000 Out of pocket - £3,325/€3,700': '$0, 30% Co-insurance, $5,000 Out of pocket',
    '$1,500 - £1,000/€1,100, 0% Co-insurance, $0 Out of pocket': '$1,500, 0% Co-insurance, $0 Out of pocket',
    '$1,500 - £1,000/€1,100, 10% Co-insurance, $2,000 Out of pocket - £1,330/€1,480': '$1,500, 10% Co-insurance, $2,000 Out of pocket',
    '$1,500 - £1,000/€1,100, 10% Co-insurance, $5,000 Out of pocket - £3,325/€3,700': '$1,500, 10% Co-insurance, $5,000 Out of pocket',
    '$1,500 - £1,000/€1,100, 20% Co-insurance, $2,000 Out of pocket - £1,330/€1,480': '$1,500, 20% Co-insurance, $2,000 Out of pocket',
    '$1,500 - £1,000/€1,100, 20% Co-insurance, $5,000 Out of pocket - £3,325/€3,700': '$1,500, 20% Co-insurance, $5,000 Out of pocket',
    '$1,500 - £1,000/€1,100, 30% Co-insurance, $2,000 Out of pocket - £1,330/€1,480': '$1,500, 30% Co-insurance, $2,000 Out of pocket',
    '$1,500 - £1,000/€1,100, 30% Co-insurance, $5,000 Out of pocket - £3,325/€3,700': '$1,500, 30% Co-insurance, $5,000 Out of pocket',
    '$10,000 - £6,650/€7,400, 0% Co-insurance, $0 Out of pocket': '$10,000, 0% Co-insurance, $0 Out of pocket',
    '$10,000 - £6,650/€7,400, 10% Co-insurance, $2,000 Out of pocket - £1,330/€1,480': '$10,000, 10% Co-insurance, $2,000 Out of pocket',
    '$10,000 - £6,650/€7,400, 10% Co-insurance, $5,000 Out of pocket - £3,325/€3,700': '$10,000, 10% Co-insurance, $5,000 Out of pocket',
    '$10,000 - £6,650/€7,400, 20% Co-insurance, $2,000 Out of pocket - £1,330/€1,480': '$10,000, 20% Co-insurance, $2,000 Out of pocket',
    '$10,000 - £6,650/€7,400, 20% Co-insurance, $5,000 Out of pocket - £3,325/€3,700': '$10,000, 20% Co-insurance, $5,000 Out of pocket',
    '$10,000 - £6,650/€7,400, 30% Co-insurance, $2,000 Out of pocket - £1,330/€1,480': '$10,000, 30% Co-insurance, $2,000 Out of pocket',
    '$10,000 - £6,650/€7,400, 30% Co-insurance, $5,000 Out of pocket - £3,325/€3,700': '$10,000, 30% Co-insurance, $5,000 Out of pocket',
    '$3,000 - £2,000/€2,200, 0% Co-insurance, $0 Out of pocket': '$3,000, 0% Co-insurance, $0 Out of pocket',
    '$3,000 - £2,000/€2,200, 10% Co-insurance, $2,000 Out of pocket - £1,330/€1,480': '$3,000, 10% Co-insurance, $2,000 Out of pocket',
    '$3,000 - £2,000/€2,200, 10% Co-insurance, $5,000 Out of pocket - £3,325/€3,700': '$3,000, 10% Co-insurance, $5,000 Out of pocket',
    '$3,000 - £2,000/€2,200, 20% Co-insurance, $2,000 Out of pocket - £1,330/€1,480': '$3,000, 20% Co-insurance, $2,000 Out of pocket',
    '$3,000 - £2,000/€2,200, 20% Co-insurance, $5,000 Out of pocket - £3,325/€3,700': '$3,000, 20% Co-insurance, $5,000 Out of pocket',
    '$3,000 - £2,000/€2,200, 30% Co-insurance, $2,000 Out of pocket - £1,330/€1,480': '$3,000, 30% Co-insurance, $2,000 Out of pocket',
    '$3,000 - £2,000/€2,200, 30% Co-insurance, $5,000 Out of pocket - £3,325/€3,700': '$3,000, 30% Co-insurance, $5,000 Out of pocket',
    '$375 - £250/€275, 0% Co-insurance, $0 Out of pocket': '$375, 0% Co-insurance, $0 Out of pocket',
    '$375 - £250/€275, 10% Co-insurance, $2,000 Out of pocket - £1,330/€1,480': '$375, 10% Co-insurance, $2,000 Out of pocket',
    '$375 - £250/€275, 10% Co-insurance, $5,000 Out of pocket - £3,325/€3,700': '$375, 10% Co-insurance, $5,000 Out of pocket',
    '$375 - £250/€275, 20% Co-insurance, $2,000 Out of pocket - £1,330/€1,480': '$375, 20% Co-insurance, $2,000 Out of pocket',
    '$375 - £250/€275, 20% Co-insurance, $5,000 Out of pocket - £3,325/€3,700': '$375, 20% Co-insurance, $5,000 Out of pocket',
    '$375 - £250/€275, 30% Co-insurance, $2,000 Out of pocket - £1,330/€1,480': '$375, 30% Co-insurance, $2,000 Out of pocket',
    '$375 - £250/€275, 30% Co-insurance, $5,000 Out of pocket - £3,325/€3,700': '$375, 30% Co-insurance, $5,000 Out of pocket',
    '$7,500 - £5,000/€5,500, 0% Co-insurance, $0 Out of pocket': '$7,500, 0% Co-insurance, $0 Out of pocket',
    '$7,500 - £5,000/€5,500, 10% Co-insurance, $2,000 Out of pocket - £1,330/€1,480': '$7,500, 10% Co-insurance, $2,000 Out of pocket',
    '$7,500 - £5,000/€5,500, 10% Co-insurance, $5,000 Out of pocket - £3,325/€3,700': '$7,500, 10% Co-insurance, $5,000 Out of pocket',
    '$7,500 - £5,000/€5,500, 20% Co-insurance, $2,000 Out of pocket - £1,330/€1,480': '$7,500, 20% Co-insurance, $2,000 Out of pocket',
    '$7,500 - £5,000/€5,500, 20% Co-insurance, $5,000 Out of pocket - £3,325/€3,700': '$7,500, 20% Co-insurance, $5,000 Out of pocket',
    '$7,500 - £5,000/€5,500, 30% Co-insurance, $2,000 Out of pocket - £1,330/€1,480': '$7,500, 30% Co-insurance, $2,000 Out of pocket',
    '$7,500 - £5,000/€5,500, 30% Co-insurance, $5,000 Out of pocket - £3,325/€3,700': '$7,500, 30% Co-insurance, $5,000 Out of pocket',
    '$750 - £500/€550, 0% Co-insurance, $0 Out of pocket': '$750, 0% Co-insurance, $0 Out of pocket',
    '$750 - £500/€550, 10% Co-insurance, $2,000 Out of pocket - £1,330/€1,480': '$750, 10% Co-insurance, $2,000 Out of pocket',
    '$750 - £500/€550, 10% Co-insurance, $5,000 Out of pocket - £3,325/€3,700': '$750, 10% Co-insurance, $5,000 Out of pocket',
    '$750 - £500/€550, 20% Co-insurance, $2,000 Out of pocket - £1,330/€1,480': '$750, 20% Co-insurance, $2,000 Out of pocket',
    '$750 - £500/€550, 20% Co-insurance, $5,000 Out of pocket - £3,325/€3,700': '$750, 20% Co-insurance, $5,000 Out of pocket',
    '$750 - £500/€550, 30% Co-insurance, $2,000 Out of pocket - £1,330/€1,480': '$750, 30% Co-insurance, $2,000 Out of pocket',
    '$750 - £500/€550, 30% Co-insurance, $5,000 Out of pocket - £3,325/€3,700': '$750, 30% Co-insurance, $5,000 Out of pocket'
  }

const opcopay = {
  '$0, 0% Co-insurance': '$0, 0% Co-insurance',
  '$0, 10% Co-insurance, $3,000 Out of pocket - £2,000/€2,200': '$0, 10% Co-insurance, $3,000 Out of pocket',
  '$0, 20% Co-insurance, $3,000 Out of pocket - £2,000/€2,200': '$0, 20% Co-insurance, $3,000 Out of pocket',
  '$0, 30% Co-insurance, $3,000 Out of pocket - £2,000/€2,200': '$0, 30% Co-insurance, $3,000 Out of pocket',
  '$1,000 - £600/€700, 0% Co-insurance': '$1,000, 0% Co-insurance',
  '$1,000 - £600/€700, 10% Co-insurance, $3,000 Out of pocket - £2,000/€2,200': '$1,000, 10% Co-insurance, $3,000 Out of pocket',
  '$1,000 - £600/€700, 20% Co-insurance, $3,000 Out of pocket - £2,000/€2,200': '$1,000, 20% Co-insurance, $3,000 Out of pocket',
  '$1,000 - £600/€700, 30% Co-insurance, $3,000 Out of pocket - £2,000/€2,200': '$1,000, 30% Co-insurance, $3,000 Out of pocket',
  '$1,500 - £1,000/€1,100, 0% Co-insurance': '$1,500, 0% Co-insurance',
  '$1,500 - £1,000/€1,100, 10% Co-insurance, $3,000 Out of pocket - £2,000/€2,200': '$1,500, 10% Co-insurance, $3,000 Out of pocket',
  '$1,500 - £1,000/€1,100, 20% Co-insurance, $3,000 Out of pocket - £2,000/€2,200': '$1,500, 20% Co-insurance, $3,000 Out of pocket',
  '$1,500 - £1,000/€1,100, 30% Co-insurance, $3,000 Out of pocket - £2,000/€2,200': '$1,500, 30% Co-insurance, $3,000 Out of pocket',
  '$150 - £100/€110, 0% Co-insurance': '$150, 0% Co-insurance',
  '$150 - £100/€110, 10% Co-insurance, $3,000 Out of pocket - £2,000/€2,200': '$150, 10% Co-insurance, $3,000 Out of pocket',
  '$150 - £100/€110, 20% Co-insurance, $3,000 Out of pocket - £2,000/€2,200': '$150, 20% Co-insurance, $3,000 Out of pocket',
  '$150 - £100/€110, 30% Co-insurance, $3,000 Out of pocket - £2,000/€2,200': '$150, 30% Co-insurance, $3,000 Out of pocket',
  '$500 - £335/€370, 0% Co-insurance': '$500, 0% Co-insurance',
  '$500 - £335/€370, 10% Co-insurance, $3,000 Out of pocket - £2,000/€2,200': '$500, 10% Co-insurance, $3,000 Out of pocket',
  '$500 - £335/€370, 20% Co-insurance, $3,000 Out of pocket - £2,000/€2,200': '$500, 20% Co-insurance, $3,000 Out of pocket',
  '$500 - £335/€370, 30% Co-insurance, $3,000 Out of pocket - £2,000/€2,200': '$500, 30% Co-insurance, $3,000 Out of pocket'
}



  const xlsx = require("xlsx")
  const jsonToCSV = require("json-to-csv");
  
  var wholeData = []
  files.forEach((path, p) => {
    console.log('path >> ', path)
    const rate = xlsx.readFile(path);
    let sheetData = xlsx.utils.sheet_to_json(rate.Sheets[rate.SheetNames[0]]);

    console.log(`sheetData ${p+1} data >> `, sheetData.length);
    
    if(p <=2) {
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
                copay: data.type == "IP" ? ipcopay[data.copay] : opcopay[data.copay],
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
        await jsonToCSV(
          cData,
          `/home/support/Desktop/saleslabb/V2-Sheet-Generator-Forked/Input/Cigna_Close_Care/cignaScript/output/latestRates/rateSheet${i}.xlsx`
        )
          .then(() => {
            console.log("Sheet Generated Successfully!");
          })
          .catch((error) => {
            console.log("Something went wrong");
            console.log({ err: error });
          });
    })
    
  })



