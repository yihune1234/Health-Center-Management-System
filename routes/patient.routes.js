// routes/patient.routes.js
const express = require("express");
const router = express.Router();

const {
  createPatient,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
} = require("../controllers/patient.controller");

// CREATE PATIENT
router.post("/", createPatient);

// GET ALL PATIENTS
router.get("/", getPatients);

// GET ONE PATIENT
router.get("/:id", getPatient);

// UPDATE PATIENT
router.put("/:id", updatePatient);

// DELETE PATIENT
router.delete("/:id", deletePatient);

module.exports = router;
