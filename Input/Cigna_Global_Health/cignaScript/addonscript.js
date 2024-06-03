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
    "/home/support/Desktop/Saleslab/V2-Sheet-Generator/Input/Cigna_Global_Health/cignaScript/inputRates/addon.xlsx",
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
            const columnsArray = xlsx.utils.sheet_to_json(rate.Sheets[sheet], { header: 1 })[0];
            let sheetData = xlsx.utils.sheet_to_json(rate.Sheets[sheet]);

            if(sheet.includes("Addon")) {
                sheetData = sheetData.filter(sd => sd.code == codeName)
            }

            ws = xlsx.utils.json_to_sheet(sheetData);

            xlsx.utils.book_append_sheet(wb, ws, sheet);
        })
        xlsx.writeFile(
          wb,
          `/home/support/Desktop/Saleslab/V2-Sheet-Generator/Input/Cigna_Global_Health/cignaScript/output/addons/addon${i}.xlsx`
        );
    })
    
  })



