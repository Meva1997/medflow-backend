import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/database";

interface PatientAttributes {
  id: string;
  fullName: string;
  dateOfBirth: string; // ISO format YYYY-MM-DD
  gender: "male" | "female" | "other";
  medicalHistoryNumber: string;
  status: "stable" | "warning" | "critical";
}

interface PatientCreationAttributes extends Optional<
  PatientAttributes,
  "id" | "status"
> {}

export class Patient
  extends Model<PatientAttributes, PatientCreationAttributes>
  implements PatientAttributes
{
  declare id: string;
  declare fullName: string;
  declare dateOfBirth: string;
  declare gender: "male" | "female" | "other";
  declare medicalHistoryNumber: string;
  declare status: "stable" | "warning" | "critical";

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Patient.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("male", "female", "other"),
      allowNull: false,
    },
    medicalHistoryNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Crucial for medical records
    },
    status: {
      type: DataTypes.ENUM("stable", "warning", "critical"),
      defaultValue: "stable",
    },
  },
  {
    sequelize,
    tableName: "patients",
    underscored: true,
  },
);

export default Patient;
