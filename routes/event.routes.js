const {
  getAllEvents,
  getEvents,
  getPostedEvents,
  getUpcomingEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/event-controller");
const router = require("express").Router();
const { organiser } = require("../middleware/auth");

router.get("/", getAllEvents);
router.get("/:id", organiser, getEvents);
router.get("/posted/list", getPostedEvents);
router.get("/upcoming/list", getUpcomingEvents);
router.post("/", organiser, createEvent);
router.put("/:id", organiser, updateEvent);
router.delete("/:id", organiser, deleteEvent);

module.exports = router;
