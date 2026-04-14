import sequelize from "../config/database";
import { Patient, VitalSigns } from "../models";
import type { VitalSignsCreationAttributes } from "../models/VitalSigns";
import { faker } from "@faker-js/faker";

const seedDatabase = async () => {
  try {
    //! Sync the database but force: true will drop the tables if they already exist and recreate them
    await sequelize.sync({ force: true });
    console.log("Database synced successfully.");

    //data seeding for patients. The properties are from the patient model. We will create 10 patients with random data using faker.js
    const patientsToCreate = Array.from({ length: 10 }).map(() => ({
      fullName: faker.person.fullName(),
      dateOfBirth: faker.date
        .birthdate({ min: 18, max: 90, mode: "age" })
        .toISOString()
        .slice(0, 10),
      gender: faker.helpers.arrayElement(["male", "female", "other"] as const),
      medicalHistoryNumber: faker.string.alphanumeric(10).toUpperCase(),
      status: faker.helpers.arrayElement([
        "stable",
        "warning",
        "critical",
      ] as const),
    }));

    const createdPatients = await Patient.bulkCreate(patientsToCreate);
    console.log(`${createdPatients.length} patients created successfully.`);

    const vitalsToCreate: VitalSignsCreationAttributes[] = [];

    createdPatients.forEach((patient) => {
      // Creamos 3 registros históricos por paciente
      for (let i = 0; i < 3; i++) {
        vitalsToCreate.push({
          patientId: patient.id,
          heartRate: faker.number.int({ min: 50, max: 150 }),
          respiratoryRate: faker.number.int({ min: 12, max: 30 }),
          oxygenSaturation: faker.number.int({ min: 85, max: 100 }),
          bloodPressureSystolic: faker.number.int({ min: 90, max: 180 }),
          bloodPressureDiastolic: faker.number.int({ min: 60, max: 110 }),
          temperature: faker.number.float({
            min: 36.0,
            max: 39.5,
            fractionDigits: 2,
          }),
        });
      }
    });

    const createdVitals = await VitalSigns.bulkCreate(vitalsToCreate);
    console.log(
      `${createdVitals.length} vital sign records created successfully.`,
    );
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
