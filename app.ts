import express, { Response } from "express";
import express_ws, { Application } from "express-ws";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { WebSocket as WS } from "ws";

const baseApp = express();
const expressWs = express_ws(baseApp);
const app = baseApp as unknown as Application;

dotenv.config();

import webRouter from "./routes/web";
import lightsRouter from "./routes/lights";
import rcRouter from "./routes/rc";
import Connections from "./connections";
import { Request, WebSocket } from "./types";

Connections.init(expressWs);

app.ws("*", (w: WS, req: Request, next) => {
  const ws = w as WebSocket;
  ws.path = req.path;
  ws.orgId = req.query.orgId?.toString();
  ws.deviceId = req.query.deviceId?.toString();
  next();
});

app.use(express.json());

app.use("/lights", lightsRouter);

app.use("/web", webRouter);

app.use("/rc", rcRouter);

mongoose.connect(process.env.MONGODB_URI, null, (err) => {
  console.log(err || `Connected to MongoDB.`);
});

app.listen(process.env.PORT, () => {
  console.log(`AF1 server is running on port ${process.env.PORT}.`);
});
