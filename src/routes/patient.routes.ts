import { Router } from "express";
import {
  listPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
} from "../controllers/patient.controller";
import {
  listPatientsValidator,
  getPatientValidator,
  createPatientValidator,
  updatePatientValidator,
  deletePatientValidator,
} from "../validators/patient.validators";
import { validate } from "../middleware/validate";
import vitalSignsRouter from "./vitalSigns.routes";

const router = Router();

router.use("/:patientId/vitals", vitalSignsRouter);

router.get("/", listPatientsValidator, validate, listPatients);
router.post("/find", getPatientValidator, validate, getPatient);
router.post("/", createPatientValidator, validate, createPatient);
router.put("/", updatePatientValidator, validate, updatePatient);
router.delete("/", deletePatientValidator, validate, deletePatient);

export default router;
