import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/database";

interface VitalSignsAttributes {
  id: string;
  patientId: string;
  heartRate: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  temperature: number;
}

// For creation, 'id' is optional because it will be auto-generated
export interface VitalSignsCreationAttributes extends Optional<
  VitalSignsAttributes,
  "id"
> {}

export class VitalSigns
  extends Model<VitalSignsAttributes, VitalSignsCreationAttributes>
  implements VitalSignsAttributes
{
  declare id: string;
  declare patientId: string;
  declare heartRate: number;
  declare respiratoryRate: number;
  declare oxygenSaturation: number;
  declare bloodPressureSystolic: number;
  declare bloodPressureDiastolic: number;
  declare temperature: number;
}

VitalSigns.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    patientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "patients", // Matches the table name of the Patient model
        key: "id",
      },
      onDelete: "CASCADE", // If a patient is deleted, their vitals go too
    },
    heartRate: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 0, max: 300 },
    },
    respiratoryRate: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 0, max: 100 },
    },
    oxygenSaturation: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 0, max: 100 },
    },
    bloodPressureSystolic: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bloodPressureDiastolic: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    temperature: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "vital_signs",
    underscored: true, // Crucial: ensures DB columns are heart_rate, not heartRate
  },
);

export default VitalSigns;
