export function chatIdFromPatient(patient: {
  name: string;
  patientId: string;
}) {
  if (patient.patientId.includes("MT-82") || /marcus/i.test(patient.name)) {
    return "marcus-thorne";
  }
  if (patient.patientId.includes("SJ-41") || /sarah/i.test(patient.name)) {
    return "sarah-jenkins";
  }
  if (patient.patientId.includes("LR-2847") || /leo/i.test(patient.name)) {
    return "leo-richards";
  }
  return patient.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
