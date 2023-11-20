let UAE = [["AE-DU", "AE-AZ", "AE-AJ", "AE-FU", "AE-SH", "AE-RK", "AE-UQ"], []];
let NE = [
  ["AE-AJ", "AE-FU", "AE-SH", "AE-RK", "AE-UQ"],
  ["AE-DU", "AE-AZ"],
];
let Dubai = [["AE-DU"], ["AE-AZ", "AE-AJ", "AE-FU", "AE-SH", "AE-RK", "AE-UQ"]];
let AbuDhabi = [
  ["AE-AZ"],
  ["AE-DU", "AE-AJ", "AE-FU", "AE-SH", "AE-RK", "AE-UQ"],
];
let NE_Dubai = [
  ["AE-AJ", "AE-FU", "AE-SH", "AE-RK", "AE-UQ", "AE-DU"],
  ["AE-AZ"],
];

const benefitCore = [
  ["Claims Handling", "-core.benefitTypes.claimHandling-"],
  ["Chronic Condition Cover", "-core.benefitTypes.chronicConditions-"],
  [
    "Pre-existing Condition Cover",
    "-core.benefitTypes.preExistingCoverCondition-",
  ],
  ["Accommodation Type", "-core.benefitTypes.accomodation-"],
  ["Diagnostics & Test", "-core.benefitTypes.diagnosticsAndTest-"],
  ["Organ Transplant", "-core.benefitTypes.organTransplant-"],
  ["Surgeries & Anesthesia", "-core.benefitTypes.surgeriesAndAnthesia-"],
  ["Oncology", "-core.benefitTypes.oncology-"],
  [
    "In-patient (Hospitalization & Surgery)",
    "-core.benefitTypes.inPatientHospitializationandsurgery-",
  ],
  ["Physiotherapy", "-core.benefitTypes.physiotherapy-"],
  ["Out-patient Consultations", "-core.benefitTypes.outPatientConsultation-"],
  ["Out-patient Specialists", "-core.benefitTypes.specialist-"],
  ["Out-patient Medicines", "-core.benefitTypes.medicine-"],
  ["Vaccination", "-core.benefitTypes.vaccination-"],
  ["Scans & Diagnostic Tests", "-core.benefitTypes.tests-"],
  ["Out-patient benefits", "-core.benefitTypes.outPatientBenefit-"],
  [
    "Maternity (Consultations, Scans and Delivery)",
    "-core.benefitTypes.maternity-",
  ],
  ["Maternity Waiting Period", "-core.benefitTypes.maternityWaitingPeriod-"],
  ["Complications of Pregnancy", "-core.benefitTypes.complicationOfPregnancy-"],
  ["New Born Cover", "-core.benefitTypes.newBornCoverage-"],
  ["Dental", "-core.benefitTypes.dental-"],
  ["Dental Waiting Period", "-core.benefitTypes.dentalWaitingPeriod-"],
  ["Optical Benefits", "-core.benefitTypes.optical-"],
  ["Wellness & Health Screening", "-core.benefitTypes.wellness-"],
  ["Emergency Evacuation", "-core.benefitTypes.emergencyEvacution-"],
  ["Alternative Medicines", "-core.benefitTypes.alternativeMedicine-"],
  ["Mental Health Benefit", "-core.benefitTypes.mentalHealth-"],
  ["Member Web Portal", "-core.benefitTypes.memberWebPortal-"],
  ["Mobile Application", "-core.benefitTypes.mobileApplication-"],
  ["Virtual / Tele Doctor", "-core.benefitTypes.virtualTele-"],
  ["Other Services", "-core.benefitTypes.otherServices-"],
  ["Extended Evacuation", "-core.benefitTypes.extendedEvacuation-"],
  ["Non Emergency Evacuation", "-core.benefitTypes.nonEmergency-"],
  ["Dental 1", "-core.benefitTypes.dental-"],
  ["Dental Waiting Period 1", "-core.benefitTypes.dentalWaitingPeriod-"],
  ["-Medical Evacuation-", "-core.benefitTypes.medicalEvacution-"],
];

const indexData = `
        const Provider = require('./provider/index');
        const Plans = require('./plans/index');
        const PricingTables = require('./PricingTable/index');
        const Coverages = require('./coverage/index');
        const Modifiers = require('./modifiers/index');
        let data = [
          // Provider data
          {
            model: "Provider",
            modelPath: "models/provider-model.js",
            documents: Provider,
          },

          // Plans
          {
            model: "Plan",
            modelPath: "models/plan-model.js",
            documents: Plans,
          },

          // Pricing Tables
          {
            model: "PricingTable",
            modelPath: "models/pricing-table-model.js",
            documents: PricingTables,
          },

          // Coverage information
          {
            model: "Coverage",
            modelPath: "models/coverage-model.js",
            documents: Coverages,
          },

          {
            // Plan modifiers
            model: "Modifier",
            modelPath: "models/modifier-model.js",
            documents: Modifiers,
          },
        ];

        module.exports = data`;

const enumData = `
        let data = {
  gender: {
    female: "female",
    male: "male",
  },
  currency: {
    USD: "USD",
    AED: "AED",
  },
  category: {
    primary: "Primary",
    primary_investor: "Primary - Investor",
    dependent: "Dependent",
    dependent_parent: "Dependent - Parent",
    primary_lsb: "Primary (Low Salary Band)",
    dependent_lsb: "Dependent (Low Salary Band)",
  },
  relation: {
    Child: "Child",
    Spouse: "Spouse",
  },
  ageCalculationMethod: {
    standard: "STANDARD",
    advanced: "HALF_YEAR_IN_ADVANCE",
  },
  conversionRateType: {
    benefit: "BENEFIT",
    premium: "PREMIUM",
  },
  customer: {
    min_age: "CUSTOMER_MIN_AGE",
    max_age: "CUSTOMER_MAX_AGE",
    gender: "CUSTOMER_GENDER",
    category: "CUSTOMER_CATEGORY",
    maritalStatus: "CUSTOMER_MARITAL_STATUS",
    relation: "CUSTOMER_RELATION",
  },
  conditions: {
    modifier: "MODIFIER_INCLUDED",
    coverage: "COVERAGE_EQUALS_TO",
    plans: "PLAN_EQUALS_TO",
    deductible: "DEDUCTIBLE_EQUALS_TO",
  },
  maritalStatus: {
    single: "single",
    married: "married",
  },
};

module.exports = data;`;

module.exports = {
  benefitCore,
  indexData,
  enumData,
  UAE,
  NE,
  Dubai,
  AbuDhabi,
  NE_Dubai,
};
