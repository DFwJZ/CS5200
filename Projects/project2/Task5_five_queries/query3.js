const { MongoClient } = require("mongodb");

// Replace with your MongoDB connection string
const uri = "mongodb://localhost:27017";

//filters documents based on a condition and then projects (selects) specific fields from those documents.
async function matchAndProject() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db("smart_healthcare_management_system");
    const appointmentDetails = database.collection("appointment_details");

    const pipeline = [
      { $match: { "billing_information.PaymentStatus": "Pending" } },
      { $project: { patient: 1, "billing_information.AmountDue": 1 } },
    ];

    const result = await appointmentDetails.aggregate(pipeline).toArray();
    console.log(
      "Pending Billing Details:",
      result,
      "\n\n\tTotal pending payments: ",
      result.length
    );
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

matchAndProject().catch(console.dir);
