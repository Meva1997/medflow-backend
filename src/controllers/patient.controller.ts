import type { Request, Response } from "express";
import { Patient, VitalSigns } from "../models/index";

export const listPatients = async (req: Request, res: Response) => {
  try {
    const { status, page = "1", limit = "10" } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 10));
    const offset = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const { count, rows } = await Patient.findAndCountAll({
      where,
      limit: limitNum,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      data: rows,
      meta: {
        total: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum),
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getPatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.body as { id: string };

    const patient = await Patient.findByPk(id, {
      include: [{ model: VitalSigns, as: "vitalSigns" }],
    });

    if (!patient) {
      return res.status(404).json({ error: `Patient with id '${id}' not found.` });
    }

    return res.status(200).json(patient);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const createPatient = async (req: Request, res: Response) => {
  try {
    const { fullName, dateOfBirth, gender, medicalHistoryNumber, status } = req.body;

    const patient = await Patient.create({ fullName, dateOfBirth, gender, medicalHistoryNumber, status });
    return res.status(201).json(patient);
  } catch (error: any) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "A patient with that medicalHistoryNumber already exists." });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updatePatient = async (req: Request, res: Response) => {
  try {
    const { id, fullName, dateOfBirth, gender, medicalHistoryNumber, status } = req.body as {
      id: string;
      fullName?: string;
      dateOfBirth?: string;
      gender?: "male" | "female" | "other";
      medicalHistoryNumber?: string;
      status?: "stable" | "warning" | "critical";
    };

    const patient = await Patient.findByPk(id);

    if (!patient) {
      return res.status(404).json({ error: `Patient with id '${id}' not found.` });
    }

    const updates = Object.fromEntries(
      Object.entries({ fullName, dateOfBirth, gender, medicalHistoryNumber, status }).filter(
        ([, v]) => v !== undefined,
      ),
    );
    await patient.update(updates);

    return res.status(200).json(patient);
  } catch (error: any) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "A patient with that medicalHistoryNumber already exists." });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deletePatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.body as { id: string };

    const patient = await Patient.findByPk(id);

    if (!patient) {
      return res.status(404).json({ error: `Patient with id '${id}' not found.` });
    }

    await patient.destroy();
    return res.status(200).json({ message: "Patient deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
