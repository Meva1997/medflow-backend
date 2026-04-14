# MedFlow Backend

REST API backend for the MedFlow patient management system, built with Node.js, Express, TypeScript, and PostgreSQL via Sequelize.

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [PostgreSQL](https://www.postgresql.org/) v15+

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Meva1997/medflow-backend.git
cd medflow-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

| Variable      | Description                  | Default       |
|---------------|------------------------------|---------------|
| `DB_NAME`     | PostgreSQL database name     | `medflow_db`  |
| `DB_USER`     | PostgreSQL user              | `postgres`    |
| `DB_PASSWORD` | PostgreSQL password          | —             |
| `DB_HOST`     | Database host                | `127.0.0.1`   |
| `DB_PORT`     | Database port                | `5432`        |

### 4. Set up the database

Create the database and grant permissions to your user (run as a PostgreSQL superuser):

```bash
psql -U <superuser> -c "CREATE DATABASE <DB_NAME>;"
psql -U <superuser> -d <DB_NAME> -c "GRANT ALL ON SCHEMA public TO <DB_USER>;"
```

### 5. Seed the database

Syncs the schema and populates it with sample data:

```bash
npm run seed
```

## Project Structure

```
src/
├── config/
│   └── database.ts      # Sequelize connection setup
├── models/
│   ├── index.ts         # Model associations
│   ├── Patient.ts
│   └── VitalSigns.ts
└── seeders/
    └── seed.ts          # Sample data generator
```
