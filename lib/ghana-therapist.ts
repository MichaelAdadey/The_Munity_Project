export const ghanaRegions = [
  { value: "greater-accra", label: "Greater Accra" },
  { value: "ashanti", label: "Ashanti" },
  { value: "western", label: "Western" },
  { value: "eastern", label: "Eastern" },
  { value: "central", label: "Central" },
  { value: "volta", label: "Volta" },
  { value: "northern", label: "Northern" },
  { value: "upper-east", label: "Upper East" },
  { value: "upper-west", label: "Upper West" },
  { value: "bono", label: "Bono" },
  { value: "bono-east", label: "Bono East" },
  { value: "ahafo", label: "Ahafo" },
  { value: "western-north", label: "Western North" },
  { value: "oti", label: "Oti" },
  { value: "savannah", label: "Savannah" },
  { value: "north-east", label: "North East" },
] as const;

export const honorificTitles = [
  { value: "dr", label: "Dr." },
  { value: "mr", label: "Mr." },
  { value: "mrs", label: "Mrs." },
  { value: "ms", label: "Ms." },
  { value: "miss", label: "Miss" },
  { value: "prof", label: "Prof." },
  { value: "rev", label: "Rev." },
  { value: "other", label: "Other" },
] as const;

export const genderOptions = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "non-binary", label: "Non-binary" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
] as const;

export const ghanaLicensingBodies = [
  { value: "gpc", label: "Ghana Psychology Council (GPC)" },
  { value: "ahpc", label: "Allied Health Professions Council (AHPC)" },
  { value: "mdc", label: "Medical & Dental Council (MDC)" },
  { value: "ghs", label: "Ghana Health Service (GHS)" },
] as const;

export const ghanaLicenseTypes = [
  { value: "clinical-psychologist", label: "Registered Clinical Psychologist" },
  { value: "counselling-psychologist", label: "Registered Counselling Psychologist" },
  { value: "psychiatrist", label: "Psychiatrist" },
  { value: "mental-health-counsellor", label: "Licensed Mental Health Counsellor" },
] as const;

export const ghanaMobileMoneyProviders = [
  { value: "mtn-momo", label: "MTN Mobile Money" },
  { value: "telecel-cash", label: "Telecel Cash" },
  { value: "airteltigo", label: "AT Money" },
] as const;

export const ghanaBanks = [
  { value: "gcb", label: "GCB Bank" },
  { value: "ecobank", label: "Ecobank Ghana" },
  { value: "stanbic", label: "Stanbic Bank" },
  { value: "fidelity", label: "Fidelity Bank" },
  { value: "access", label: "Access Bank" },
  { value: "absa", label: "Absa Bank Ghana" },
] as const;

export const credentialVerificationChecklist = [
  "Ghana Card matches your legal name on your application",
  "Council registration is active and in good standing",
  "Registration certificate is issued by a recognised Ghanaian body",
  "Professional indemnity cover meets platform requirements (where applicable)",
] as const;
