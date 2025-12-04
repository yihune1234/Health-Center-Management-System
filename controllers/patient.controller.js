const Patient = require("../models/patient.model");

exports.createPatient = async (req, res) => {
  // ===== VALIDATION =====
  const requiredFields = [
    "first_name",
    "last_name",
    "gender",
    "dob",
    "contact",
    "campus_id",
    "registered_clinic_id"
  ];

  const missing = requiredFields.filter(f => !req.body[f]);

  if (missing.length > 0) {
    return res.status(400).json({
      message: "Validation error",
      missing_fields: missing
    });
  }

  // Optional email validation
  if (req.body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Optional gender validation
  if (req.body.gender && !["Male", "Female", "Other"].includes(req.body.gender)) {
    return res.status(400).json({ message: "Invalid gender value" });
  }

  // Continue with your logic
  const patient = await Patient.create(req.body);
  res.json({ message: "Patient created", patient });
};

exports.getPatients = async (req, res) => {
  res.json(await Patient.findAll());
};

exports.getPatient = async (req, res) => {
  res.json(await Patient.findById(req.params.id));
};

exports.updatePatient = async (req, res) => {
  // ===== VALIDATION FOR UPDATE =====
  if (req.body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (req.body.gender && !["Male", "Female", "Other"].includes(req.body.gender)) {
    return res.status(400).json({ message: "Invalid gender value" });
  }

  await Patient.update(req.params.id, req.body);
  res.json({ message: "Patient updated" });
};

exports.deletePatient = async (req, res) => {
  await Patient.delete(req.params.id);
  res.json({ message: "Patient deleted" });
};

