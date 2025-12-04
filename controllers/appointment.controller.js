const Appointment = require("../models/appointment.model");

exports.createAppointment = async (req, res) => {
  try {
    const data = req.body;

    // === VALIDATION ===
    const requiredFields = ["patient_id", "staff_id", "clinic_id", "appointment_time", "appointment_type"];

    const missing = requiredFields.filter(f => !data[f]);

    if (missing.length > 0) {
      return res.status(400).json({
        error: "Validation failed",
        message: `Missing required fields: ${missing.join(", ")}`
      });
    }

    // Validate date format
    if (isNaN(Date.parse(data.appointment_time))) {
      return res.status(400).json({
        error: "Invalid format",
        message: "appointment_time must be a valid date format"
      });
    }

    // Default value for status
    data.status = data.status || "scheduled";

    const appointment = await Appointment.create(data);

    res.json({ message: "Appointment created", appointment });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// ===================== GET ALL =====================
exports.getAppointments = async (req, res) => {
  try {
    res.json(await Appointment.findAll());
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// ===================== GET ONE =====================
exports.getOne = async (req, res) => {
  try {
    if (!req.params.id) return res.status(400).json({ error: "ID is required" });

    res.json(await Appointment.findById(req.params.id));
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// ===================== UPDATE =====================
exports.update = async (req, res) => {
  try {
    if (!req.params.id) return res.status(400).json({ error: "ID is required" });

    await Appointment.update(req.params.id, req.body);
    res.json({ message: "Appointment updated" });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// ===================== DELETE =====================
exports.delete = async (req, res) => {
  try {
    if (!req.params.id) return res.status(400).json({ error: "ID is required" });

    await Appointment.delete(req.params.id);
    res.json({ message: "Appointment deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};
