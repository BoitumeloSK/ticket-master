const {
  getAllUsers,
  signup,
  login,
  updateUserPassword,
  updateUserRole,
  deleteUser,
} = require("../controllers/user-controller");
const router = require("express").Router();
const { validate } = require("../helpers");

router.get("/", getAllUsers);
router.post("/", validate, signup);
router.post("/login", login);
router.put("/password/:userId", updateUserPassword);
router.put("/role/:id", updateUserRole);
router.delete("/:id", deleteUser);

module.exports = router;
