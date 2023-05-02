const {
  getAllEvents,
  getEvents,
  getPostedEvents,
  getUpcomingEvents,
  createEvent,
  organiserUpdateEvent,
  adminUpdateEvent,
  organiserDeleteEvent,
  adminDeleteEvent,
} = require("../controllers/event-controller");
const router = require("express").Router();
const { admin, organiser } = require("../middleware/auth");

router.get("/", getAllEvents);
router.get("/:UserId", organiser, getEvents);
router.get("/posted", getPostedEvents);
router.get("/upcoming", getUpcomingEvents);
router.post("/", organiser, createEvent);
router.put("/organiser/edit/:eventId", organiser, organiserUpdateEvent);
router.put("/admin/edit/:eventId", admin, adminUpdateEvent);
router.delete("/organiser/delete/:eventId", organiser, organiserDeleteEvent);
router.delete("/admin/delete/:eventId", admin, adminDeleteEvent);

module.exports = router;
