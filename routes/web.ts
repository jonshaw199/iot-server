import { Router } from "express-ws";
import express from "express";

import { PATH_WEB_WS } from "../paths";
import { handleWebReq } from "../controllers/web";

const webRouter = express.Router() as Router;

webRouter.ws(PATH_WEB_WS, handleWebReq);

export default webRouter;
