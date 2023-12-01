const { MongoClient } = require("mongodb");

// Replace with your MongoDB connection string
const uri = "mongodb://localhost:27017";

//
async function run() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("smart_healthcare_management_system");
    const appointmentDetails = database.collection("appointment_details");

    const filter = {
      $and: [
        {
          "patient.DateOfBirth": {
            $gte: "2050-01-01",
            $lte: "2060-12-31",
          },
        },
        {
          "treatment_plan.Diagnosis": "Asthma",
        },
      ],
    };

    const appointments = await appointmentDetails.find(filter).toArray();
    console.log("=====+++++=====+++++=====+++++=====+++++=====+++++=====");
    console.log("Appointments Found:", appointments);
    console.log("In total", appointments.length, "valid query results found");
  } catch (e) {
    console.error(e);
  } finally {
    console.log("=====+++++=====+++++=====+++++=====+++++=====+++++=====");
    await client.close();
  }
}

run().catch(console.dir);
