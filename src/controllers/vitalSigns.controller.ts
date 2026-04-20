import type { Request, Response } from "express";
import { Patient, VitalSigns } from "../models/index";

export const listVitalSigns = async (req: Request, res: Response) => {
  try {
    const patientId = req.params["patientId"] as string;

    const patient = await Patient.findByPk(patientId);

    if (!patient) {
      return res.status(404).json({ error: `Patient with id '${patientId}' not found.` });
    }

    const vitals = await VitalSigns.findAll({
      where: { patientId },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(vitals);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const createVitalSigns = async (req: Request, res: Response) => {
  try {
    const patientId = req.params["patientId"] as string;

    const patient = await Patient.findByPk(patientId);

    if (!patient) {
      return res.status(404).json({ error: `Patient with id '${patientId}' not found.` });
    }

    const {
      heartRate,
      respiratoryRate,
      oxygenSaturation,
      bloodPressureSystolic,
      bloodPressureDiastolic,
      temperature,
    } = req.body as {
      heartRate: number;
      respiratoryRate: number;
      oxygenSaturation: number;
      bloodPressureSystolic: number;
      bloodPressureDiastolic: number;
      temperature: number;
    };

    const vitals = await VitalSigns.create({
      patientId,
      heartRate,
      respiratoryRate,
      oxygenSaturation,
      bloodPressureSystolic,
      bloodPressureDiastolic,
      temperature,
    });

    return res.status(201).json(vitals);
  } catch (error: any) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({ error: error.errors.map((e: any) => e.message) });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};
