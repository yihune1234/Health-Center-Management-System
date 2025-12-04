// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// ROUTES
const patientRoutes = require("./routes/patient.routes");
const appointmentRoutes = require("./routes/appointment.routes");
const queueRoutes = require("./routes/queue.routes");
const medicalRecordRoutes = require("./routes/medicalRecord.routes");

// ERROR HANDLER
const errorHandler = require("./middleware/error.middleware");

const app = express();

// ======== MIDDLEWARES =========
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("University Clinic Management System API is running...");
});

// ======== API ROUTES ==========
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/queue", queueRoutes);
app.use("/api/medical-records", medicalRecordRoutes);

// ======== ERROR HANDLER ========
app.use(errorHandler);

// ======== SERVER PORT ==========
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`);
});
