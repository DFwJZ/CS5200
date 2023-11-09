var express = require("express");
var router = express.Router();
const {
  createPatient,
  readPatient,
  updatePatient,
  deletePatient,
  getPatients,
  getTreatmentPlans,
  getTreatmentPlan,
  createTreatmentPlan,
  updateTreatmentPlan,
  deleteTreatmentPlan,
} = require("../db/dbConnector_Sqlite.js");

/* GET home page and list all patients. */
router.get("/", async function (req, res) {
  try {
    const patients = await getPatients();
    res.render("index", {
      title: "Healthcare Dashboard",
      patients: patients,
      err: null,
      type: "success",
    });
  } catch (exception) {
    console.log("Error exceuting sql", exception);
    res.render("index", {
      trips: [],
      err: `Error executing SQL ${exception}`,
      type: "danger",
    });
  }
});

// GET route to display the form for creating a new patient
router.get("/patient/create", function (req, res) {
  res.render("patient_create", {
    // You can pass additional variables if needed
  });
});

// POST Create a patient
router.post("/patient/create", async function (req, res) {
  try {
    await createPatient(req.body);
    res.redirect("/"); // Redirect back to home page to see the list of patients
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GET a single patient's detail
router.get("/patient/:id", async function (req, res) {
  try {
    const patient = await readPatient(req.params.id);
    const treatmentPlans = await getTreatmentPlans(req.params.id);
    if (!patient) {
      // Pass the error message and type to the view
      res.render("patient_detail", {
        patient: null,
        err: "No patient found with ID " + req.params.id,
        type: "danger", // Bootstrap class for a red alert box
      });
    } else {
      console.log(`GetDetail: Patient found with ID ${req.params.id}`);
      // No error, so pass null for err and type
      res.render("patient_detail", {
        patient: patient,
        treatmentPlans: treatmentPlans,
        err: null,
        type: null,
      });
    }
  } catch (error) {
    console.error(
      `Error when rendering detail page for patient ID ${req.params.id}:`,
      error
    );
    // Pass the error message and type to the view
    res.render("patient_detail", {
      patient: null,
      err: "Internal Server Error",
      type: "danger", // Bootstrap class for a red alert box
    });
  }
});

// GET a patient for editing
router.get("/patient/:id/edit", async function (req, res) {
  try {
    const patient = await readPatient(req.params.id);
    if (!patient) {
      console.log(`No patient found with ID ${req.params.id}`);
      return res.status(404).send("Patient not found");
    }
    console.log(`Patient found with ID ${req.params.id}`);
    res.render("patient_edit", {
      patient: patient,
      previous_id: req.params.id,
    });
  } catch (error) {
    console.error(
      `Error when rendering edit page for patient ID ${req.params.id}:`,
      error
    );
    res.status(500).send("Internal Server Error");
  }
});

// POST Update a patient
router.post("/patient/:id/edit", async function (req, res) {
  try {
    await updatePatient(req.params.id, req.body);
    // Redirect to the home page with a success message
    res.redirect("/?success=Patient " + req.params.id + " has been updated");
    // res.redirect("/patient/${req.params.id}");
  } catch (error) {
    console.error("Failed to update patient:", error);
    res.status(500).send("Failed to update patient");
  }
});

// DELETE a patient
// Using GET for simplicity since HTML forms do not support DELETE method
router.get("/patient/:id/delete", async function (req, res) {
  try {
    await deletePatient(req.params.id);
    res.redirect("/"); // Redirect to the home page after deletion
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Create a treatment plan for a patient
router.post("/treatment_plans/create", async function (req, res) {
  console.log("Create treatment plan route", req.body);

  const newPlan = req.body;

  try {
    const sqlResCreate = await createTreatmentPlan(newPlan);
    console.log("Creating treatment plan result", sqlResCreate);

    res.redirect(`/patient/${newPlan.PatientID}/?msg=Treatment plan added`);
  } catch (exception) {
    console.log("Error executing sql", exception);
    res.render("patient_detail", {
      patient: null,
      treatmentPlans: [],
      err: "Error adding treatment plan " + exception,
      type: "danger",
    });
  }
});

// Update a treatment plan from the patient_details view
router.post("/treatment_plans/:plan_id/edit", async function (req, res) {
  const planId = req.params.plan_id;
  const planData = req.body;

  try {
    const sqlResUpdate = await updateTreatmentPlan(planId, planData);
    console.log("Updating comment", sqlResUpdate);

    const editedTreatment = (await getTreatmentPlan(planId))[0];

    console.log("Edited Treatment", editedTreatment);

    if (sqlResUpdate.changes === 1) {
      res.redirect(
        `/patient/${editedTreatment.PatientID}/?msg=TreatmentPlan modified`
      );
    } else {
      // More than one comment found
      res.redirect(
        `/patient/${editedTreatment.PatientID}/?msg=Error editing TreatmentPlan`
      );
    }
  } catch (exception) {
    console.log("Error exceuting sql", exception);
    res.render("patients_details", {
      patient: null,
      treatmentPlans: [],
      err: "Error deleting treatment plan " + exception,
      type: "danger",
    });
  }
});

// Delete a treatment plan from the patient_details view
router.get("/treatment_plans/:plan_id/delete", async function (req, res) {
  console.log("Delete treatment plan route", req.params.plan_id);

  const plan_id = req.params.plan_id;

  try {
    const sqlResFindTreatment = await getTreatmentPlan(plan_id);
    const oldTreatment = sqlResFindTreatment[0];
    const sqlResUpdate = await deleteTreatmentPlan(plan_id);
    console.log("Deleting treatment plan", sqlResUpdate);

    if (sqlResUpdate.changes === 1) {
      res.redirect(
        `/patient/${oldTreatment.PatientID}/?msg=Treatment plan deleted`
      );
    } else {
      res.redirect(
        `/patient/${oldTreatment.PatientID}/?msg=Error deleting treatment plan`
      );
    }
  } catch (exception) {
    console.log("Error executing sql", exception);
    res.render("patient_detail", {
      patient: null,
      treatmentPlans: [],
      err: "Error deleting treatment plan " + exception,
      type: "danger",
    });
  }
});

module.exports = router;
