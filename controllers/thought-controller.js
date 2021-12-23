const { User, Thought }  = require("../models");

const thoughtController = {
  // get all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .sort({ _id: -1 })
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      })
  },

  // get a thought by id
  getThoughtById({ params}, res) {
    Thought.findOne({ _id: params.id })
      .then(dbUserData => {
        // if the user isn't found, send 404
        if(!dbThoughtData) {
          res.status(404).json({ message: "There isn't a user with this id."})
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => {
        console.log(err)
        res.status(400).json(err);
      });
  },

  // add a thought
  createThought({ params, body }, res) {
    console.log(body);
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then (dbUserData => {
        if(!dbUserData) {
          res.status(404).json({ message: "There isn't a user with this id."})
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err)
        res.status(400).json(err);
      });
  }
}

module.exports = thoughtController;