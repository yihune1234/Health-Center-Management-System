const express = require("express");
const router = express.Router();

const {
  createAppointment,
  getAppointments,
  getOne,
  update,
  delete: deleteAppointment
} = require("../controllers/appointment.controller");

router.post("/", createAppointment);
router.get("/", getAppointments);
router.get("/:id", getOne);
router.put("/:id", update);
router.delete("/:id", deleteAppointment);

module.exports = router;
