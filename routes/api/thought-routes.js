const router = require("express").Router();

const {
  getAllThoughts,
  createThought,
  getThoughtById
} = require("../../controllers/thought-controller");

// GET all and POST at /api/users
router
  .route("/")
  .get(getAllThoughts)
  .post(createThought);


router
  .route("/:id")
  .get(getThoughtById)
  // .put(updateUser)
  // .delete(deleteUser)

module.exports = router;