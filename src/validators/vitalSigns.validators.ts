import { body, param } from "express-validator";

const patientIdParam = param("patientId")
  .isUUID().withMessage("patientId must be a valid UUID.");

export const listVitalSignsValidator = [patientIdParam];

export const createVitalSignsValidator = [
  patientIdParam,
  body("heartRate")
    .notEmpty().withMessage("heartRate is required.")
    .isInt({ min: 0, max: 300 }).withMessage("heartRate must be an integer between 0 and 300."),
  body("respiratoryRate")
    .notEmpty().withMessage("respiratoryRate is required.")
    .isInt({ min: 0, max: 100 }).withMessage("respiratoryRate must be an integer between 0 and 100."),
  body("oxygenSaturation")
    .notEmpty().withMessage("oxygenSaturation is required.")
    .isInt({ min: 0, max: 100 }).withMessage("oxygenSaturation must be an integer between 0 and 100."),
  body("bloodPressureSystolic")
    .notEmpty().withMessage("bloodPressureSystolic is required.")
    .isInt({ min: 0 }).withMessage("bloodPressureSystolic must be a positive integer."),
  body("bloodPressureDiastolic")
    .notEmpty().withMessage("bloodPressureDiastolic is required.")
    .isInt({ min: 0 }).withMessage("bloodPressureDiastolic must be a positive integer."),
  body("temperature")
    .notEmpty().withMessage("temperature is required.")
    .isFloat({ min: 0 }).withMessage("temperature must be a positive number."),
];
