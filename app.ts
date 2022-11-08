import express from "express";
import express_ws, {Application} from "express-ws";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Request, Response } from "express";
import { WebSocket as WS } from "ws";

const baseApp = express();
const expressWs = express_ws(baseApp);
const app = baseApp as unknown as Application;

dotenv.config();

import { PATH_LIGHTS_WS, PATH_RC, PATH_WEB_WS } from "./paths";
import { MessageType, State, WebSocket } from "./types";
import webRouter from "./routes/web";
import lightsRouter from "./routes/lights";
import Connections from "./connections";

Connections.init(expressWs);

app.use(express.json());

app.use((req: Request, res: Response, next) => {
  console.log(req);
  next();
});

app.use('/', lightsRouter);

app.use('/', webRouter);

app.post(PATH_RC, (req: Request, res: Response) => {
  if (req.body.type === MessageType.TYPE_CHANGE_STATE) {
    console.log("Sending state change messages: " + req.body.state);
    const msg = JSON.stringify(req.body);
    const c = Connections.getLightsClients(req.params.orgId);
    c.forEach((client: any) => {
      client.send(msg);
      console.log("sent");
    });
    return res.send(`/rc: state change notification messages sent`);
  }
  res.send("/rc: message type not recognized");
});

mongoose.connect(process.env.MONGODB_URI, null, (err) => {
	console.log(err || `Connected to MongoDB.`)
});

app.listen(process.env.PORT, () => {
  console.log(`AF1 server is running on port ${process.env.PORT}.`);
});
