const {
  getAllPurchases,
  createPurchase,
  userCancelPurchase,
  adminCancelPurchase,
  //   updatePurchase,
} = require("../controllers/purchase-controller");
const router = require("express").Router();
const { auth, admin } = require("../middleware/auth");

router.get("/", getAllPurchases);
router.post("/", auth, createPurchase);
//router.put("/:id", admin, updatePurchase);
router.delete("/user/delete/:id", auth, userCancelPurchase);
router.delete("/admin/delete/:id", admin, adminCancelPurchase);

module.exports = router;
