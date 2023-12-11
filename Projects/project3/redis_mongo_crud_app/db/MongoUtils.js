const { MongoClient } = require("mongodb");
const app = require("../app");

const MongoUtils = () => {
  const mu = {};
  const url = "mongodb://localhost:27017";
  const dbName = "smart_healthcare_management_system";
  const colName = "appointment_details";

  let db;
  let client;

  // Function to connect to the database
  mu.connect = async () => {
    if (!db) {
      client = new MongoClient(url);
      await client.connect();
      db = client.db(dbName);
    }
    return db;
  };

  // count the number of appointments
  mu.countAppointments = async (query) => {
    try {
      const database = await mu.connect();
      const collection = database.collection(colName);
      return await collection.countDocuments(query);
    } catch (error) {
      console.error("Error in countAppointments:", error);
      throw error;
    }
  };

  // Example function to find appointments
  mu.findAppointments = async (query) => {
    try {
      const database = await mu.connect();
      const collection = database.collection(colName);
      return await collection
        .find(query)
        .sort({ "patient.PatientID": 1 })
        .limit(10)
        .toArray();
    } catch (error) {
      console.error("Error in findAppointments:", error);
      throw error;
    }
  };

  // get appointment details by id
  mu.findAppointmentById = async (appointmentId) => {
    try {
      console.log("appointmentId:", appointmentId);
      const database = await mu.connect();
      const collection = database.collection(colName);

      const appointment_found = await collection.findOne({
        appointment_id: appointmentId,
      });
      return appointment_found;
    } catch (error) {
      console.error("Error in findAppointmentById:", error);
      throw error;
    }
  };

  //delete an appointment
  mu.deleteAppointment = async (appointmentId) => {
    try {
      const database = await mu.connect();
      const collection = database.collection(colName);
      const appointmentExists = await collection.findOne({
        appointment_id: appointmentId,
      });
      if (appointmentExists) {
        const deleteResult = await collection.deleteOne({
          appointment_id: appointmentId,
        });
        console.log("Delete Result:", deleteResult);
      } else {
        console.log("No appointment found with ID:", appointmentId);
      }
    } catch (error) {
      console.error("Error in deleteAppointment:", error);
      throw error;
    }
  };

  // add a new appointment
  mu.addAppointment = async (appointmentData) => {
    try {
      const database = await mu.connect();
      const collection = database.collection(colName);
      await collection.insertOne(appointmentData);
    } catch (error) {
      console.error("Error in addAppointment:", error);
      throw error;
    }
  };

  // udpdate an appointment
  mu.updateAppointment = async (appointmentId, updatedData) => {
    try {
      const database = await mu.connect();
      const collection = database.collection(colName);
      await collection.updateOne(
        { appointment_id: appointmentId },
        { $set: updatedData }
      );
    } catch (error) {
      console.error("Error in updateAppointment:", error);
      throw error;
    }
  };

  return mu;
};

module.exports = MongoUtils();
