import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/database";
import patientRouter from "./routes/patient.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/patients", patientRouter);

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established.");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

start();
