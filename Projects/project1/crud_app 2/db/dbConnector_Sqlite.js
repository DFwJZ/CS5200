// dbConnector.js

const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

async function connect() {
  try {
    let db = await open({
      filename: "./db/SHMS_sql.sqlite3",
      driver: sqlite3.Database,
    });
    console.log("Connected to the SQLite database.");
    return db;
  } catch (err) {
    console.error("Could not connect to the database", err);
    throw err; // Rethrow the error so the calling function can handle it
  }
}

// Example CRUD Operations:

async function getPatients() {
  console.log("triggering the getpatient.");
  const db = await connect();
  const patients = await db.all(
    "SELECT PatientID, Name, DateOfBirth, Address, InsuranceID FROM patients ORDER BY PatientID DESC LIMIT 20;"
  );
  console.log(patients[0]);
  await db.close();
  return patients;
}

// Create
async function createPatient(patientData) {
  const db = await connect();
  const { name, dateOfBirth, address, insuranceId } = patientData;
  await db.run(
    `INSERT INTO patients (Name, DateOfBirth, Address, InsuranceID) VALUES (?, ?, ?, ?)`,
    name,
    dateOfBirth,
    address,
    insuranceId
  );
  await db.close();
}

// Read (one patient)
async function readPatient(patientId) {
  const db = await connect();
  try {
    // console.log(`Executing SQL for reading patient with ID: ${patientId}`);
    const patient = await db.get(
      "SELECT * FROM patients WHERE PatientID = ?",
      patientId
    );
    // console.log(`Result for patient with ID ${patientId}:`, patient);
    return patient;
  } catch (error) {
    console.error(`Error in readPatient function for ID ${patientId}:`, error);
    throw error; // Make sure to re-throw the error to handle it in the route
  } finally {
    await db.close();
  }
}

// Update
async function updatePatient(patientId, updateData) {
  const db = await connect();
  const { name, dateOfBirth, address, insuranceId } = updateData;
  await db.run(
    `UPDATE patients SET Name = ?, DateOfBirth = ?, Address = ?, InsuranceID = ? WHERE PatientID = ?`,
    name,
    dateOfBirth,
    address,
    insuranceId,
    patientId
  );
  await db.close();
}

// Delete
async function deletePatient(patientId) {
  const db = await connect();
  await db.run(`DELETE FROM patients WHERE PatientID = ?`, patientId);
  await db.close();
}

/****************** Patient Plans *****************/

// Get the specific treatment plan for a patient
async function getTreatmentPlan(planId) {
  console.log("Get treatment plan", planId);
  const db = await connect();
  try {
    const stmt = await db.prepare(
      `SELECT * FROM treatment_plans WHERE TreatmentPlanID = :TreatmentPlanID`
    );
    stmt.bind({
      ":TreatmentPlanID": planId,
    });
    const plans = await stmt.all();

    await stmt.finalize();
    return plans;
  } finally {
    await db.close();
  }
}

// Read all treatment plans for a patient
async function getTreatmentPlans(patientId) {
  const db = await connect();
  try {
    const plans = await db.all(
      "SELECT * FROM treatment_plans WHERE PatientID = ?",
      patientId
    );
    return plans;
  } finally {
    await db.close();
  }
}

// Create a new treatment plan
async function createTreatmentPlan(planData) {
  const db = await connect();
  try {
    const { PatientID, Diagnosis, Treatment, DoctorID } = planData;
    const result = await db.run(
      `INSERT INTO treatment_plans (PatientID, Diagnosis, Treatment, DoctorID) VALUES (?, ?, ?, ?)`,
      PatientID,
      Diagnosis,
      Treatment,
      DoctorID
    );
    return result.lastID; // Return the id of the newly inserted treatment plan
  } finally {
    await db.close();
  }
}

// Update a treatment plan
async function updateTreatmentPlan(planId, planData) {
  const db = await connect();
  try {
    const stmt = await db.prepare(`
      UPDATE treatment_plans
      SET
        Diagnosis = :Diagnosis,
        Treatment = :Treatment,
        DoctorID = :DoctorID
      WHERE
        TreatmentPlanID = :TreatmentPlanID
    `);

    stmt.bind({
      ":TreatmentPlanID": planId,
      ":Diagnosis": planData.Diagnosis,
      ":Treatment": planData.Treatment,
      ":DoctorID": planData.DoctorID,
    });

    const result = await stmt.run();
    await stmt.finalize();
    return result;
  } finally {
    await db.close();
  }
}

// Delete a treatment plan
async function deleteTreatmentPlan(TreatmentPlanID) {
  const db = await connect();
  try {
    const result = await db.run(
      `DELETE FROM treatment_plans WHERE TreatmentPlanID = ?`,
      TreatmentPlanID
    );
    return result.changes; // Return the number of rows deleted
  } finally {
    await db.close();
  }
}
module.exports = {
  getPatients,
  createPatient,
  readPatient,
  updatePatient,
  deletePatient,
  getTreatmentPlans,
  getTreatmentPlan,
  createTreatmentPlan,
  updateTreatmentPlan,
  deleteTreatmentPlan,
};
