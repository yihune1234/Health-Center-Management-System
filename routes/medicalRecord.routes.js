const express = require("express");
const router = express.Router();

const {
  createRecord,
  getPatientRecords,
  getSingleRecord,
  updateRecord,
  deleteRecord
} = require("../controllers/medicalRecord.controller");

// ADD MEDICAL RECORD
router.post("/", createRecord);

// GET ALL RECORDS FOR A PATIENT
router.get("/patient/:patient_id", getPatientRecords);

// GET A SINGLE MEDICAL RECORD
router.get("/:id", getSingleRecord);

// UPDATE RECORD
router.put("/:id", updateRecord);

// DELETE RECORD
router.delete("/:id", deleteRecord);

module.exports = router;
