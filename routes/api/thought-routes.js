const router = require("express").Router();

const {
  getAllThoughts,
  createThought,
  getThoughtById,
  updateThought,
  deleteThought,
  createReaction,
  deleteReaction
} = require("../../controllers/thought-controller");

// GET all and POST at /api/users
router
  .route("/")
  .get(getAllThoughts)
  .post(createThought);


router
  .route("/:id")
  .get(getThoughtById)
  .put(updateThought)
  .delete(deleteThought)

router
  .route("/:thoughtId/reactions")
  .post(createReaction)

router
  .route("/:thoughtId/reactions/:reactionsId")
  .delete(deleteReaction)

module.exports = router;