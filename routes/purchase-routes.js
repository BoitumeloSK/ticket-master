const {
  getAllPurchases,
  createPurchase,
  userCancelPurchase,
  adminCancelPurchase,
  getPurchases,
} = require("../controllers/purchase-controller");
const router = require("express").Router();
const { auth, admin } = require("../middleware/auth");

router.get("/", admin, getAllPurchases);
router.get("/:UserId", auth, getPurchases);
router.post("/", auth, createPurchase);
router.delete("/user/delete/:id", auth, userCancelPurchase);
router.delete("/admin/delete/:id", admin, adminCancelPurchase);

module.exports = router;
