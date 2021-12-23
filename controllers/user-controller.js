const { User, Thought } = require("../models");

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

  // add a friend -- POST api/users/:userId/friends
  addFriend({ params }, res) {
    // add friend to user's friend list
    User.findOneAndUpdate(
      { _id: params.userId },
      { $addToSet: { friends: params.friendId } },
      { new: true }
    )
    .then(dbUserData => {
      if(!dbUserData) {
        res.status(404).json({ message: "There isn't a user with this id." })
        return;
      }
      // add user to friendId list
      User.findOneAndUpdate(
        { _id: params.friendId },
        { $addToSet: { friends: params.userId } },
        { new: true }
      )
      .then(dbUserDataSecond => {
        if(!dbUserDataSecond) {
          res.status(404).json({ message: "There isn't a user with this id." })
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
    })
    .catch(err => res.json(err));
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
    return (User.updateMany(
      { _id: { $in: dbUserData.friends } },
      { $pull: { friends: params.id } },
    ))
    .then(Thought.deleteMany(
      { username: dbUserData.username }
    ))
    .catch(err => res.status(400).json(err));
    })
    .catch(err => res.status(400).json(err))
  },

  // delete a friend -- api/users/:userId/friends/:friendsId
  deleteFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
    .then(dbUserData => {
      if(!dbUserData) {
        res.status(404).json({ message: "There isn't a user with this id." })
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => res.json(err));
  },
}

module.exports = userController;