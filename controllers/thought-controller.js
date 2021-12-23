const { User, Thought }  = require("../models");

const thoughtController = {
  // get all thoughts -- GET api/thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .sort({ _id: -1 })
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      })
  },

  // get a thought by id -- GET api/thoughts/:id
  getThoughtById({ params}, res) {
    Thought.findOne({ _id: params.id })
      .then(dbThoughtData => {
        // if the user isn't found, send 404
        if(!dbThoughtData) {
          res.status(404).json({ message: "There isn't a thought with this id."})
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => {
        console.log(err)
        res.status(400).json(err);
      });
  },

  // add a thought -- POST api/thoughts
  createThought({ body }, res) {
    console.log(body);
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then (dbUserData => {
        if(!dbUserData) {
          res.status(404).json({ message: "There isn't a thought with this id."})
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err)
        res.status(400).json(err);
      });
  },

// update a thought -- PUT api/thoughts/:id
  updateThought({ params, body}, res) {
    Thought.findOneAndUpdate(
      { _id: params.id },
      body,
      { new: true }
      )
      .then(dbThoughtData => {
        // if the user isn't found, send 404
        if(!dbThoughtData) {
          res.status(404).json({ message: "There isn't a thought with this id."})
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.status(400).json(err));
  },

  // delete a thought -- DELETE api/thoughts/:id
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
    .then(dbThoughtData => {
      // if the user isn't found, send 404
      if(!dbThoughtData) {
        res.status(404).json({ message: "There isn't a thought with this id."})
        return;
      }
      res.json(dbThoughtData);
    })
    .catch(err => res.status(400).json(err));
  }


}

module.exports = thoughtController;