const express = require("express");
const router = express.Router();
const mu = require("../db/MongoUtils.js"); // Correct the path as necessary
const ru = require("../db/RedisUtils.js"); // Correct the path as necessary

router.get("/", async function (req, res, next) {
  try {
    const totalDocuments = await mu.countAppointments({}); // Count all documents
    const appointments = await mu.findAppointments({}); // Find appointments
    console.log("totalDocuments:", totalDocuments);

    // Use totalDocuments and appointments in your response
    res.render("index", {
      title: "Appointment Details",
      totalDocuments,
      appointments,
    });
  } catch (error) {
    console.error(error);
    next(error); // Pass the error to the Express error handler
  }
});

// appointment details
router.get("/appointment_detail/:id", async function (req, res, next) {
  const appointmentId = req.params.id;
  try {
    // Try to get data from Redis cache
    const cachedAppointment = await ru.getData(`appointment:${appointmentId}`);
    if (cachedAppointment) {
      // Cache hit
      res.render("appointment_detail", {
        title: `Appointment Details - ${appointmentId}`,
        appointment: cachedAppointment,
      });
      console.log("Cache hit for appointment:", appointmentId);
      console.log("cachedAppointment:", cachedAppointment);
    } else {
      // Cache miss, get data from MongoDB
      console.log(
        `Cache miss for appointment:${appointmentId}, adding to cache`
      );
      const appointmentDetails = await mu.findAppointmentById(appointmentId);
      if (appointmentDetails) {
        // Store in Redis for subsequent requests
        await ru.setData(`appointment:${appointmentId}`, appointmentDetails);
        res.render("appointment_detail", {
          title: `Appointment Details - ${appointmentId}`,
          appointment: appointmentDetails,
        });
      } else {
        res.status(404).send("Appointment not found");
      }
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// delete a new appointment
router.post("/delete_appointment/:id", async function (req, res, next) {
  try {
    const appointment_id = req.params.id;
    const existinMongo = await mu.findAppointmentById(appointment_id);
    if (!existinMongo) {
      res.status(404).send("Appointment not found");
    }

    await mu.deleteAppointment(appointment_id);
    await ru.deleteData(`appointment:${appointment_id}`);

    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// create an appointment
router.post("/add_appointment", async function (req, res, next) {
  try {
    // Generate a new appointment ID, needs to convert to string format
    const newAppointmentId = Math.floor(Math.random() * 1000000).toString();

    const newAppointment = {
      appointment_id: newAppointmentId,
      patient: {
        // Required fields
        PatientID: req.body.patientId,
        Name: req.body.patientName,
      },
      doctor: {
        // Required fields
        DoctorID: req.body.doctorId,
        Name: req.body.doctorName,
      },
      // Required fields
      date: req.body.date,
      time: req.body.time,
    };
    await mu.addAppointment(newAppointment);
    console.log("Created new appointment, id is:", newAppointmentId);
    await ru.setData(`appointment:${newAppointmentId}`, newAppointment);

    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// update an appointment
router.post("/update_appointment/:id", async function (req, res, next) {
  try {
    const appointmentId = req.params.id;
    const updatedData = {
      "patient.Name": req.body.patientName,
      "patient.DateOfBirth": req.body.patientDOB,
      "patient.Address": req.body.patientAddress,
      "patient.InsuranceID": req.body.patientInsuranceID,
      "doctor.Name": req.body.doctorName,
      "doctor.Schedule": req.body.doctorSchedule,
      "doctor.PrimaryCare": req.body.doctorPrimaryCare,
      "treatment_plan.Diagnosis": req.body.treatmentDiagnosis,
      "treatment_plan.Treatment": req.body.treatmentPlan,
    };
    await mu.updateAppointment(appointmentId, updatedData);
    res.redirect("/appointment_detail/" + appointmentId);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
