import { Router } from "express";
import { listVitalSigns, createVitalSigns } from "../controllers/vitalSigns.controller";
import { listVitalSignsValidator, createVitalSignsValidator } from "../validators/vitalSigns.validators";
import { validate } from "../middleware/validate";

const router = Router();

router.get("/", listVitalSignsValidator, validate, listVitalSigns);
router.post("/", createVitalSignsValidator, validate, createVitalSigns);

export default router;
