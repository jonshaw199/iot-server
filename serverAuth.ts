import { Response } from "express";
import jwt from "jsonwebtoken";
import { Document } from "mongoose";
import UserModel from "./models/user";

import { User, Request } from "./types";

const { JWT_SECRET } = process.env;

// function for creating tokens
export function signToken(user: Document<User>) {
  // toObject() returns a basic js object with only the info from the db
  const userData = user.toObject();
  delete userData.password;
  return jwt.sign(userData, JWT_SECRET);
}

// function for verifying tokens
export function verifyToken(req: Request, res: Response, next) {
  // grab token from either headers, req.body, or query string
  const token = req.get("token") || req.body.token || req.query.token;
  // if no token present, deny access
  if (!token) return res.json({ success: false, message: "No token provided" });
  // otherwise, try to verify token
  jwt.verify(token, JWT_SECRET, (err, decodedData) => {
    // if problem with token verification, deny access
    if (err) return res.json({ success: false, message: "Invalid token." });
    // otherwise, search for user by id that was embedded in token
    UserModel.findById(decodedData._id, (err, user) => {
      // if no user, deny access
      if (!user) return res.json({ success: false, message: "Invalid token." });
      // otherwise, add user to req object
      req.user = user;
      // go on to process the route:
      next();
    });
  });
}
