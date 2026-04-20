import { body, query } from "express-validator";

const VALID_STATUSES = ["stable", "warning", "critical"] as const;
const VALID_GENDERS = ["male", "female", "other"] as const;

export const listPatientsValidator = [
  query("status")
    .optional()
    .isIn(VALID_STATUSES)
    .withMessage("status must be stable, warning, or critical."),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be a positive integer."),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit must be between 1 and 100."),
];

export const getPatientValidator = [
  body("id")
    .notEmpty().withMessage("id is required.")
    .isUUID().withMessage("id must be a valid UUID."),
];

export const createPatientValidator = [
  body("fullName")
    .notEmpty().withMessage("fullName is required.")
    .isString().withMessage("fullName must be a string."),
  body("dateOfBirth")
    .notEmpty().withMessage("dateOfBirth is required.")
    .isDate({ format: "YYYY-MM-DD" }).withMessage("dateOfBirth must be a valid date in YYYY-MM-DD format."),
  body("gender")
    .notEmpty().withMessage("gender is required.")
    .isIn(VALID_GENDERS).withMessage("gender must be male, female, or other."),
  body("medicalHistoryNumber")
    .notEmpty().withMessage("medicalHistoryNumber is required.")
    .isString().withMessage("medicalHistoryNumber must be a string."),
  body("status")
    .optional()
    .isIn(VALID_STATUSES).withMessage("status must be stable, warning, or critical."),
];

export const updatePatientValidator = [
  body("id")
    .notEmpty().withMessage("id is required.")
    .isUUID().withMessage("id must be a valid UUID."),
  body("fullName")
    .optional()
    .isString().withMessage("fullName must be a string."),
  body("dateOfBirth")
    .optional()
    .isDate({ format: "YYYY-MM-DD" }).withMessage("dateOfBirth must be a valid date in YYYY-MM-DD format."),
  body("gender")
    .optional()
    .isIn(VALID_GENDERS).withMessage("gender must be male, female, or other."),
  body("medicalHistoryNumber")
    .optional()
    .isString().withMessage("medicalHistoryNumber must be a string."),
  body("status")
    .optional()
    .isIn(VALID_STATUSES).withMessage("status must be stable, warning, or critical."),
];

export const deletePatientValidator = [
  body("id")
    .notEmpty().withMessage("id is required.")
    .isUUID().withMessage("id must be a valid UUID."),
];
