const express = require("express");
const router = express.Router();

const {
  addToQueue,
  getQueue,
  callPatient,
  startService,
  complete
} = require("../controllers/queue.controller");

// ADD TO QUEUE
router.post("/", addToQueue);

// LIST ALL IN QUEUE
router.get("/", getQueue);

// CALL PATIENT (waiting → called)
router.put("/call/:id", callPatient);

// START SERVICE (called → in_service)
router.put("/start/:id", startService);

// COMPLETE VISIT (in_service → completed)
router.put("/complete/:id", complete);

module.exports = router;
