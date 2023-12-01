const { MongoClient } = require("mongodb");

// Replace with your MongoDB connection string
const uri = "mongodb://localhost:27017";

async function findPatientsWithLimit() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("smart_healthcare_management_system");
    const appointmentDetails = database.collection("appointment_details");

    const diagnosisCriteria = "Arthritis";
    const limitResults = 5;

    // Find patients with specific diagnosis and limit results
    const patients = await appointmentDetails
      .find({ "treatment_plan.Diagnosis": diagnosisCriteria })
      .limit(limitResults)
      .toArray();
    console.log(
      `Patients with ${diagnosisCriteria} Diagnosis:`,
      patients,
      "\n\n\tTotal patients found: ",
      patients.length
    );
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

findPatientsWithLimit().catch(console.dir);
