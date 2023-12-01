const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function toggleDoctorPrimaryCareStatus() {
  try {
    await client.connect();
    const database = client.db("smart_healthcare_management_system");
    const appointmentDetails = database.collection("appointment_details");

    const doctorName = "Charde Clayton"; // Example doctor name

    // Fetch the current status
    const currentStatus = await appointmentDetails.findOne(
      { "doctor.Name": doctorName },
      { projection: { "doctor.PrimaryCare": 1 } }
    );
    console.log("Current Status:", currentStatus);

    if (currentStatus) {
      const newPrimaryCareStatus =
        currentStatus.doctor.PrimaryCare === "True" ? "False" : "True";

      // Perform the update
      await appointmentDetails.updateMany(
        { "doctor.Name": doctorName },
        { $set: { "doctor.PrimaryCare": newPrimaryCareStatus } }
      );

      // Log the updated status
      const updatedStatus = await appointmentDetails.findOne(
        { "doctor.Name": doctorName },
        { projection: { "doctor.PrimaryCare": 1 } }
      );
      console.log("Updated Status:", updatedStatus);
    }
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

toggleDoctorPrimaryCareStatus().catch(console.dir);
