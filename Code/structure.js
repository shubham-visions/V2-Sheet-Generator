class Structures {
  pricing_table = {
    fromAge: "",
    toAge: "",
    gender: "",
    residency: "",
    price: [
      {
        value: "",
        currency: "",
      },
    ],
  };

  //Pricing plan Structure -
  pricing_plan = {
    _id: "",
    plan: "",
    annualLimit: [{ currency: "", value: "" }],
    startDate: "",
    endDate: "",
    includedResidence: "",
    excludedResidence: "",
    coverage: [],
    baseAnnualPremium: "",
  };

  plan_structure = {
    _id: "",
    tmpPath: "",
    provider: "",
    title: "",
    notes: "",
    benefitCategories: [],
    pricingTables: [],
    modifiers: [],
  };

  benefitCategories_structure = {
    categoryTitle: "",
    includedBenefits: [],
    userType: {
      userType: "",
      benefitTypes: [],
    },
  };

  coverage_structure = {
    _id: "",
    title: "",
    internalTitle: "",
    includedCountries: [],
    excludedCountries: [],
    notes: "",
  };

  modifiers_structure = {
    _id: "",
    plans: [],
    title: "",
    label: "",
    type: "",
    assignmentType: "",
    includedBenefits: [],
    isOptional: "",
    description: "",
    addonCost: {},
    premiumMod: "",
    conditions: [],
    hasOptions: false,
  };

  options_structure = {
    id: "",
    label: "",
    description: "",
    conditions: [
      {
        type: "",
        value: [],
      },
    ],
  };
}

module.exports = new Structures();

function check(v1, v2) {
  let arr = [
    ["Optical", "Optical Benefits"],
    ["Wellness", "Wellness & Health Screening"],
    ["Claims Handling", "Claims Handling"],
    ["Diagnostics & Test", "Diagnostics & Test"],
    ["Oncology", "Oncology"],
    ["Organ Transplant", "Organ Transplant"],
    ["Out-patient benefits", "Out-patient benefits"],
    ["Out-patient Specialists", "Out-patient-Specialists"],
    ["Out-patient Medicines", "Out-patient-Medicines"],
    ["Vaccination", "Vaccination"],
    ["Physiotherapy", "Physiotherapy"],
    ["Maternity Waiting Period", "Maternity Waiting Period"],
    ["Complications of Pregnancy", "Complications of Pregnancy"],
    ["New Born Cover", "New Born Cover"],
    ["Dental", "Dental"],
    ["Dental Waiting Period", "Dental_Waiting_Period"],
    ["Alternative Medicines", "Alternative Medicines"],
    ["Emergency Evacuation", "Emergency-Evacuation"],
    ["Virtual / Tele Doctor", "Virtual / Tele Doctor"],
    ["Other Services", "Other Services"],
    ["Member Web Portal", "Member Web Portal"],
    ["Mobile Application", "Mobile Application"],
    ["Accommodation Type", "Accommodation Type"],
    ["Surgeries & Anesthesia", "Surgeries & Anesthesia"],
    ["Pre-existing & Chronic Conditions (PEC)", "Chronic Condition Cover"],
    ["Routine Delivery", "Maternity (Consultations, Scans and Delivery)"],
    ["Out-patient General Practioner", "Out-patient-Consultations"],
    [
      "In-patient (Hospitalization & Surgery)",
      "In-patient (Hospitalization & Surgery)",
    ],
    ["Pre-existing Condition Cover", "Pre-existing Condition Cover"],
    ["Mental Health Benefit", "Mental Health Benefit"],
    ["Scans & Diagnostic Tests", "Scans"],
  ];

  let res = false;

  arr.forEach((v) => {
    let [b1, b2] = v;
    if (b1 == v1 && b2 == v2) res = true;
  });

  return res;
}
// modifiers();
// console.log(pricingArr);

// ------------------------------------------------------------------------------------------------------

// const age = ageRange(rateSheet);

// console.log(age);

// console.log(GlobalData);
// console.log("-------------------------------------------");
// console.log(Ids);

// result.forEach((v, index) => {
//   result[index].id = new ObjectId();
// });

// function generateTable(prices, gender, residency, bool) {
//   let clone = [...structure];
//   clone = clone.map((v, i) => {
//     v.price[0].value = prices[i];
//     if (gender) v.gender.toLowerCase() = gender;
//     if (residency) v.residency = residency;
//     return v;
//   });
//   console.log(clone);
// };

// console.log(result);
