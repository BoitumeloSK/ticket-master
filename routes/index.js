const router = require("express").Router();
const userRoutes = require("./user-routes");
const eventRoutes = require("./event.routes");
const purchaseRoutes = require("./purchase-routes");

router.use("/users", userRoutes);
router.use("/events", eventRoutes);
router.use("/purchases", purchaseRoutes);

module.exports = router;
