const {
  getAllPurchases,
  createPurchase,
  cancelPurchase,
  getPurchases,
} = require("../controllers/purchase-controller");
const router = require("express").Router();
const { auth, admin } = require("../middleware/auth");

router.get("/", admin, getAllPurchases);
router.get("/:id", auth, getPurchases);
router.post("/", auth, createPurchase);
router.delete("/:id", auth, cancelPurchase);

module.exports = router;
