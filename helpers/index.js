const { check } = require("express-validator");
const validate = [
  check("email", "Please enter a valid email.").isEmail(),
  check(
    "password",
    "Please input a password of min length 6 characters"
  ).isLength({ min: 6 }),
];
module.exports = {
  validate,
};
