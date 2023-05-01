const {
  getAllEvents,
  createEvent,
  organiserUpdateEvent,
  adminUpdateEvent,
  organiserDeleteEvent,
  adminDeleteEvent,
} = require("../controllers/event-controller");
const router = require("express").Router();
const { auth, admin, organiser } = require("../middleware/auth");

router.get("/", getAllEvents);
router.post("/", auth, createEvent);
router.put("/organiser/edit/:eventId", organiser, organiserUpdateEvent);
router.put("/admin/edit/:eventId", admin, adminUpdateEvent);
router.delete("/organiser/delete/:eventId", organiser, organiserDeleteEvent);
router.delete("/admin/delete/:eventId", admin, adminDeleteEvent);

module.exports = router;
