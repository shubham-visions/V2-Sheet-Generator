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

const ipcopay = [
  '$0, 0% Co-insurance, $0 Out of pocket',
  '$0, 10% Co-insurance, $2,000 Out of pocket',
  '$0, 10% Co-insurance, $5,000 Out of pocket',
  '$0, 20% Co-insurance, $2,000 Out of pocket',
  '$0, 20% Co-insurance, $5,000 Out of pocket',
  '$0, 30% Co-insurance, $2,000 Out of pocket',
  '$0, 30% Co-insurance, $5,000 Out of pocket',
  '$1,500, 0% Co-insurance, $0 Out of pocket',
  '$1,500, 10% Co-insurance, $2,000 Out of pocket',
  '$1,500, 10% Co-insurance, $5,000 Out of pocket',
  '$1,500, 20% Co-insurance, $2,000 Out of pocket',
  '$1,500, 20% Co-insurance, $5,000 Out of pocket',
  '$1,500, 30% Co-insurance, $2,000 Out of pocket',
  '$1,500, 30% Co-insurance, $5,000 Out of pocket',
  '$10,000, 0% Co-insurance, $0 Out of pocket',
  '$10,000, 10% Co-insurance, $2,000 Out of pocket',
  '$10,000, 10% Co-insurance, $5,000 Out of pocket',
  '$10,000, 20% Co-insurance, $2,000 Out of pocket',
  '$10,000, 20% Co-insurance, $5,000 Out of pocket',
  '$10,000, 30% Co-insurance, $2,000 Out of pocket',
  '$10,000, 30% Co-insurance, $5,000 Out of pocket',
  '$3,000, 0% Co-insurance, $0 Out of pocket',
  '$3,000, 10% Co-insurance, $2,000 Out of pocket',
  '$3,000, 10% Co-insurance, $5,000 Out of pocket',
  '$3,000, 20% Co-insurance, $2,000 Out of pocket',
  '$3,000, 20% Co-insurance, $5,000 Out of pocket',
  '$3,000, 30% Co-insurance, $2,000 Out of pocket',
  '$3,000, 30% Co-insurance, $5,000 Out of pocket',
  '$375, 0% Co-insurance, $0 Out of pocket',
  '$375, 10% Co-insurance, $2,000 Out of pocket',
  '$375, 10% Co-insurance, $5,000 Out of pocket',
  '$375, 20% Co-insurance, $2,000 Out of pocket',
  '$375, 20% Co-insurance, $5,000 Out of pocket',
  '$375, 30% Co-insurance, $2,000 Out of pocket',
  '$375, 30% Co-insurance, $5,000 Out of pocket',
  '$7,500, 0% Co-insurance, $0 Out of pocket',
  '$7,500, 10% Co-insurance, $2,000 Out of pocket',
  '$7,500, 10% Co-insurance, $5,000 Out of pocket',
  '$7,500, 20% Co-insurance, $2,000 Out of pocket',
  '$7,500, 20% Co-insurance, $5,000 Out of pocket',
  '$7,500, 30% Co-insurance, $2,000 Out of pocket',
  '$7,500, 30% Co-insurance, $5,000 Out of pocket',
  '$750, 0% Co-insurance, $0 Out of pocket',
  '$750, 10% Co-insurance, $2,000 Out of pocket',
  '$750, 10% Co-insurance, $5,000 Out of pocket',
  '$750, 20% Co-insurance, $2,000 Out of pocket',
  '$750, 20% Co-insurance, $5,000 Out of pocket',
  '$750, 30% Co-insurance, $2,000 Out of pocket',
  '$750, 30% Co-insurance, $5,000 Out of pocket'
]

const opcopay = [
  '$0, 0% Co-insurance',
  '$0, 10% Co-insurance, $3,000 Out of pocket',
  '$0, 20% Co-insurance, $3,000 Out of pocket',
  '$0, 30% Co-insurance, $3,000 Out of pocket',
  '$1,000, 0% Co-insurance',
  '$1,000, 10% Co-insurance, $3,000 Out of pocket',
  '$1,000, 20% Co-insurance, $3,000 Out of pocket',
  '$1,000, 30% Co-insurance, $3,000 Out of pocket',
  '$1,500, 0% Co-insurance',
  '$1,500, 10% Co-insurance, $3,000 Out of pocket',
  '$1,500, 20% Co-insurance, $3,000 Out of pocket',
  '$1,500, 30% Co-insurance, $3,000 Out of pocket',
  '$150, 0% Co-insurance',
  '$150, 10% Co-insurance, $3,000 Out of pocket',
  '$150, 20% Co-insurance, $3,000 Out of pocket',
  '$150, 30% Co-insurance, $3,000 Out of pocket',
  '$500, 0% Co-insurance',
  '$500, 10% Co-insurance, $3,000 Out of pocket',
  '$500, 20% Co-insurance, $3,000 Out of pocket',
  '$500, 30% Co-insurance, $3,000 Out of pocket'
]
  
    const files = [
      "/home/support/Desktop/Saleslab/V2-Sheet-Generator/Input/Cigna_Global_Health/cignaScript/inputRates/benefits.xlsx",
    ];
  
    const xlsx = require("xlsx")
    const jsonToCSV = require("json-to-csv");
    
    var wholeData = []
    files.forEach((path, p) => {
      console.log('path >> ', path)
      const rate = xlsx.readFile(path);
  
      console.log('rate >> ', rate.SheetNames);
  
      codes.forEach((codeName, i) => {
          const wb = xlsx.utils.book_new();
          rate.SheetNames.forEach((sheet, j) => {
              let sheetData = xlsx.utils.sheet_to_json(rate.Sheets[sheet]);
  
            //   if(sheet.includes("Addon")) {
            //       sheetData = sheetData.filter(sd => sd.code == codeName)
            //   }

            console.log('sheetData >> ', sheetData[0].copayIP);
            console.log('codeName >> ', codeName);
            sheetData[0].residency = codeName.trimEnd()
  
              ws = xlsx.utils.json_to_sheet(sheetData);
  
              xlsx.utils.book_append_sheet(wb, ws, sheet);
          })
          xlsx.writeFile(
            wb,
            `/home/support/Desktop/Saleslab/V2-Sheet-Generator/Input/Cigna_Global_Health/cignaScript/output/benefits/benefits${i}.xlsx`
          );
      })
      
    })
  
  
  
  