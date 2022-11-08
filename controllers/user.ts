import userModel from "../models/user";
import { signToken } from "../serverAuth";

// list all users
export const index = (req, res) => {
  userModel.find({}, (err, users) => {
    res.json(users);
  });
};

// get one user
export const show = (req, res) => {
  console.log("Current User:");
  console.log(req.user);
  userModel.findById(req.params.id, (err, user) => {
    res.json(user);
  });
};

// create a new user
export const create = (req, res) => {
  userModel.create(req.body, (err, user) => {
    if (err) return res.json({ success: false, code: err.code });
    // once user is created, generate a token to "log in":
    const token = signToken(user);
    res.json({
      success: true,
      message: "User created. Token attached.",
      token,
    });
  });
};

// update an existing user
export const update = (req, res) => {
  userModel.findById(req.params.id, (err, user) => {
    Object.assign(user, req.body);
    user.save((err, updatedUser) => {
      res.json({ success: true, message: "User updated.", user });
    });
  });
};

// delete an existing user
export const destroy = (req, res) => {
  userModel.findByIdAndRemove(req.params.id, (err, user) => {
    res.json({ success: true, message: "User deleted.", user });
  });
};

// the login route
export const authenticate = (req, res) => {
  // check if the user exists
  userModel.findOne({ email: req.body.email }, (err, user) => {
    // if there's no user or the password is invalid
    if (!user || !user.validPassword(req.body.password)) {
      // deny access
      return res.json({ success: false, message: "Invalid credentials." });
    }

    const token = signToken(user);
    res.json({ success: true, message: "Token attached.", token });
  });
};
