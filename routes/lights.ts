import { PATH_LIGHTS_WS } from "../paths";
import { Router } from "express-ws";
import express from "express";

import { handleLightsReq } from "../controllers/lights";

const lightsRouter = express.Router() as Router;

lightsRouter.ws(PATH_LIGHTS_WS, handleLightsReq);

export default lightsRouter;
