import express from "express";

import { handleWebReq } from "../controllers/web";

const webRouter = express.Router();

webRouter.ws("/ws", handleWebReq as any);

export default webRouter;
