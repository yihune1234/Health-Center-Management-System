const Queue = require("../models/queue.model");

exports.addToQueue = async (req, res) => {
  try {
    const data = req.body;

    // === BASIC VALIDATION ===
    const requiredFields = ["patient_id", "clinic_id"];

    const missing = requiredFields.filter(field => !data[field]);

    if (missing.length > 0) {
      return res.status(400).json({
        error: "Validation Error",
        message: `Missing required fields: ${missing.join(", ")}`
      });
    }

    // Default queue status
    data.status = data.status || "waiting";

    const queue = await Queue.add(data);
    res.json({ message: "Patient added to queue", queue });

  } catch (error) {
    res.status(500).json({
      error: "Server Error",
      details: error.message
    });
  }
};

exports.getQueue = async (req, res) => {
  try {
    res.json(await Queue.findAll());
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};

exports.callPatient = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Queue ID is required" });
    }

    await Queue.callPatient(req.params.id);
    res.json({ message: "Patient called" });

  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};

exports.startService = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Queue ID is required" });
    }

    const staffId = req.body.assigned_staff_id || null;
    await Queue.startService(req.params.id, staffId);
    res.json({ message: "Patient now in service" });

  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};

exports.complete = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Queue ID is required" });
    }

    await Queue.complete(req.params.id);
    res.json({ message: "Service completed" });

  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};
