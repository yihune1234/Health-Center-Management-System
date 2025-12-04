const MR = require("../models/medicalRecord.model");

exports.createRecord = async (req, res) => {
  try {
    const data = req.body;

    // === Basic Validation ===
    const requiredFields = ["patient_id", "diagnosis", "treatment", "record_date"];

    const missing = requiredFields.filter(field => !data[field]);

    if (missing.length > 0) {
      return res.status(400).json({
        error: "Validation Error",
        message: `Missing required fields: ${missing.join(", ")}`
      });
    }

    // Validate record_date format
    if (isNaN(Date.parse(data.record_date))) {
      return res.status(400).json({
        error: "Invalid Date Format",
        message: "record_date must be a valid date"
      });
    }

    const record = await MR.create(data);
    res.json({ message: "Medical record created", record });

  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};

exports.getPatientRecords = async (req, res) => {
  try {
    if (!req.params.patient_id) {
      return res.status(400).json({ error: "patient_id is required" });
    }

    const records = await MR.findByPatient(req.params.patient_id);
    res.json(records);

  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};

exports.getSingleRecord = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Record ID is required" });
    }

    const record = await MR.findById(req.params.id);
    res.json(record);

  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};

exports.updateRecord = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Record ID is required" });
    }

    await MR.update(req.params.id, req.body);
    res.json({ message: "Record updated" });

  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};

exports.deleteRecord = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Record ID is required" });
    }

    await MR.delete(req.params.id);
    res.json({ message: "Record deleted" });

  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};
