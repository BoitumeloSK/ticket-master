const {
  getAllUsers,
  getUser,
  signup,
  login,
  updateUserPassword,
  updateUserRole,
  deleteUser,
} = require("../controllers/user-controller");
const router = require("express").Router();
const { validate } = require("../helpers");
const { auth, admin, user } = require("../middleware/auth");

router.get("/", admin, getAllUsers);
router.get("/", admin, getUser);
router.post("/", validate, signup);
router.post("/login", login);
router.put("/password/:id", user, updateUserPassword);
router.put("/role/:id", admin, updateUserRole);
router.delete("/:id", auth, deleteUser);

module.exports = router;
