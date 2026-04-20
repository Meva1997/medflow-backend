# MedFlow Backend

REST API backend for the MedFlow patient management system, built with Node.js, Express, TypeScript, and PostgreSQL via Sequelize.

## Tech Stack

| Layer        | Technology                              |
|--------------|-----------------------------------------|
| Runtime      | Node.js v20.19.0+                       |
| Framework    | Express 5                               |
| Language     | TypeScript 6                            |
| ORM          | Sequelize 6 + pg                        |
| Validation   | express-validator                       |
| Database     | PostgreSQL 15+                          |

## Prerequisites

- [Node.js](https://nodejs.org/) v20.19.0+
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
| `PORT`        | HTTP server port             | `3000`        |

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

> **Warning:** `seed` drops and recreates all tables. Never run against production data.

### 6. Start the development server

```bash
npm run dev
```

The server will be available at `http://localhost:3000`.

---

## API Reference

All endpoints are prefixed with `/api`.

### Health check

```
GET /health
```

Returns `{ "status": "ok" }`.

---

### Patients — `/api/patients`

#### List patients
```
GET /api/patients
```

Query params:

| Param    | Type    | Required | Description                              |
|----------|---------|----------|------------------------------------------|
| `status` | string  | No       | Filter by `stable`, `warning`, `critical`|
| `page`   | integer | No       | Page number (default: `1`)               |
| `limit`  | integer | No       | Results per page, max 100 (default: `10`)|

**Response `200`**
```json
{
  "data": [ ...patients ],
  "meta": { "total": 50, "page": 1, "limit": 10, "totalPages": 5 }
}
```

---

#### Get patient by ID
```
POST /api/patients/find
```

**Body**
```json
{ "id": "uuid" }
```

**Response `200`** — Patient object with nested `vitalSigns` array.  
**Response `404`** — Patient not found.

---

#### Create patient
```
POST /api/patients
```

**Body**
```json
{
  "fullName": "Jane Doe",
  "dateOfBirth": "1990-04-15",
  "gender": "female",
  "medicalHistoryNumber": "MHN-00123",
  "status": "stable"
}
```

| Field                 | Type   | Required | Values                        |
|-----------------------|--------|----------|-------------------------------|
| `fullName`            | string | Yes      | —                             |
| `dateOfBirth`         | string | Yes      | `YYYY-MM-DD`                  |
| `gender`              | string | Yes      | `male`, `female`, `other`     |
| `medicalHistoryNumber`| string | Yes      | Must be unique                |
| `status`              | string | No       | `stable`, `warning`, `critical` (default: `stable`) |

**Response `201`** — Created patient.

---

#### Update patient
```
PUT /api/patients
```

**Body** — `id` is required; all other fields are optional.
```json
{
  "id": "uuid",
  "status": "critical"
}
```

**Response `200`** — Updated patient.  
**Response `404`** — Patient not found.

---

#### Delete patient
```
DELETE /api/patients
```

**Body**
```json
{ "id": "uuid" }
```

**Response `200`** — `{ "message": "Patient deleted successfully." }`  
**Response `404`** — Patient not found.

---

### Vital Signs — `/api/patients/vitals`

#### List vital signs history
```
GET /api/patients/vitals
```

**Body**
```json
{ "patientId": "uuid" }
```

**Response `200`** — Array of vital sign records ordered by most recent.

---

#### Record new vital signs
```
POST /api/patients/vitals
```

**Body**
```json
{
  "patientId": "uuid",
  "heartRate": 72,
  "respiratoryRate": 16,
  "oxygenSaturation": 98,
  "bloodPressureSystolic": 120,
  "bloodPressureDiastolic": 80,
  "temperature": 36.6
}
```

| Field                   | Type    | Range       |
|-------------------------|---------|-------------|
| `heartRate`             | integer | 0 – 300     |
| `respiratoryRate`       | integer | 0 – 100     |
| `oxygenSaturation`      | integer | 0 – 100     |
| `bloodPressureSystolic` | integer | ≥ 0         |
| `bloodPressureDiastolic`| integer | ≥ 0         |
| `temperature`           | float   | ≥ 0         |

**Response `201`** — Created vital signs record.  
**Response `404`** — Patient not found.

---

### Error responses

All validation errors return `400` with the following shape:

```json
{
  "errors": [
    { "field": "heartRate", "msg": "heartRate must be an integer between 0 and 300." }
  ]
}
```

Server errors return `500`:

```json
{ "error": "Internal server error" }
```

---

## Project Structure

```
src/
├── config/
│   └── database.ts          # Sequelize connection
├── controllers/
│   ├── patient.controller.ts
│   └── vitalSigns.controller.ts
├── middleware/
│   └── validate.ts          # express-validator error handler
├── models/
│   ├── index.ts             # Model associations
│   ├── Patient.ts
│   └── VitalSigns.ts
├── routes/
│   ├── patient.routes.ts
│   └── vitalSigns.routes.ts
├── seeders/
│   └── seed.ts              # Sample data generator
├── validators/
│   ├── patient.validators.ts
│   └── vitalSigns.validators.ts
└── index.ts                 # Express app entry point
```
