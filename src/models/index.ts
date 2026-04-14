import Patient from "./Patient";
import VitalSigns from "./VitalSigns";

//define associations here
Patient.hasMany(VitalSigns, { foreignKey: "patientId", as: "vitalSigns" });
VitalSigns.belongsTo(Patient, { foreignKey: "patientId", as: "patient" });

export { Patient, VitalSigns };
