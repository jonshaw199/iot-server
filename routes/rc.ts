import express from "express";
import { Router } from "express-ws";

import { PATH_RC } from "../paths";
import { handleRcMsg } from "../controllers/rc";

const rcRouter = express.Router() as Router;

rcRouter.post(PATH_RC, handleRcMsg);

export default rcRouter;
