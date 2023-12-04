var express = require("express");
var router = express.Router();
var mu = require("../db/MongoUtils.js"); // Correct the path as necessary

router.get("/", async function (req, res, next) {
  try {
    const totalDocuments = await mu.countAppointments({}); // Count all documents
    const appointments = await mu.findAppointments({}); // Find appointments
    console.log("totalDocuments:", mu.findAppointments);

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
  try {
    const appoinment_id = req.params.id;
    const appointmentDetails = await mu.findAppointmentById(appoinment_id);

    if (appointmentDetails) {
      res.render("appointment_detail", {
        title: `Appointment Details - ${appoinment_id}`,
        appointment: appointmentDetails,
      });
    } else {
      res.status(404).send("Appointment not found");
    }
  } catch (error) {
    console.error(error);
    next(error); // Pass the error to the Express error handler
  }
});

// add a new appointment
router.post("/delete_appointment/:id", async function (req, res, next) {
  try {
    const appointment_id = req.params.id;
    await mu.deleteAppointment(appointment_id);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// create an appointment
router.post("/add_appointment", async function (req, res, next) {
  try {
    // Generate a new appointment ID
    const newAppointmentId = Math.floor(Math.random() * 1000000);

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
