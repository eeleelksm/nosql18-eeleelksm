const router = require("express").Router();

const {
  getAllUsers,
  createUser,
  getUserById
} = require("../../controllers/user-controller");

// GET all and POST at /api/users
router
  .route("/")
  .get(getAllUsers)
  .post(createUser);


router
  .router("/:id")
  .get(getUserById);

module.exports = router;