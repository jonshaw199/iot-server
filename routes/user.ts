import express from "express";
import * as usersCtrl from "../controllers/user";
import { verifyToken } from "../serverAuth";

const usersRouter = express.Router();

usersRouter.route("/").get(usersCtrl.index).post(usersCtrl.create);

usersRouter.post("/authenticate", usersCtrl.authenticate);

usersRouter.use(verifyToken);
usersRouter
  .route("/:id")
  .get(usersCtrl.show)
  .patch(usersCtrl.update)
  .delete(usersCtrl.destroy);

export default usersRouter;
