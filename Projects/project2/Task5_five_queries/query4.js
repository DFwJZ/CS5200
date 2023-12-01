const { MongoClient } = require("mongodb");

// Replace with your MongoDB connection string
const uri = "mongodb://localhost:27017";

// multiple stages: grouping, sorting, and limiting the results.
async function complexAggregation() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db("smart_healthcare_management_system");
    const appointmentDetails = database.collection("appointment_details");

    const pipeline = [
      {
        $group: { _id: "$department.Location", totalAppointments: { $sum: 1 } },
      },
      { $sort: { totalAppointments: -1 } },
      { $limit: 5 },
    ];

    const result = await appointmentDetails.aggregate(pipeline).toArray();
    console.log("Top Departments by Appointment Count:", result);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

complexAggregation().catch(console.dir);
