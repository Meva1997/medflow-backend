import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "medflow_db",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || "password",
  {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    dialect: "postgres",
    logging: false, // Disable logging; set to console.log to see SQL queries
    define: {
      timestamps: true, // Add createdAt and updatedAt fields
      underscored: true, // Use snake_case for column names
    },
  },
);

export default sequelize;
