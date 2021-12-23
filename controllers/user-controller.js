const { User } = require("../models");

const userController = {
  // get all users -- GET api/users
  getAllUsers(req, res) {
    User.find({})
      .populate({
        path:"thoughts",
        select: '-__v'
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // get one user by id -- GET api/users/:id
  getUserById({ params}, res) {
    User.findOne({ _id: params.id })
      .populate({
        path:"thoughts",
        select: '-__v'
      })
      .select("-__v")
      .then(dbUserData => {
        // if the user isn't found, send 404
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
  },

  // create a user -- POST api/users
  createUser({ body }, res) {
    User.create(body)
    .then(dbUserData => res.json(dbUserData))
    .catch(err => res.status(400).json(err))
  },

  // update a user -- PUT api/users/:id
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, { new: true })
      .then(dbUserData => {
        // if the user isn't found, send 404
        if(!dbUserData) {
          res.status(404).json({ message: "There isn't a user with this id."})
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },

  // delete a user -- DELETE api/users/:id
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
    .then(dbUserData => {
      // if the user isn't found, send 404
      if(!dbUserData) {
        res.status(404).json({ message: "There isn't a user with this id."})
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => res.status(400).json(err));
  },

  // addFriend({ params, body }, res) {
  //   User.findOneAndUpdate(
  //     { _id: params.userId },
  //     { $push: { friends: body } },
  //     { new: true }
  //   )
  //   .then(dbUserData => {
  //     if(!dbUserData) {
  //       res.status(404).json({ message: "There isn't a user with this id." })
  //       return;
  //     }
  //     res.json(dbUserData);
  //   })
  //   .catch(err => res.json(err));
  // }
}



module.exports = userController;