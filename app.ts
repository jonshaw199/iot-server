var express = require("express");
const app = express();
var expressWs = require("express-ws")(app);

import demo4 from "./demos/demo4/demo4";
import { Request, Response } from "express";
import { MessageType, State } from "./types";

app.use(express.json());

app.ws("/rc/demo5/ws", (ws, req: Request) => {
  ws.on("message", (m) => {
    process.stdout.write("<");
    const msg = JSON.parse(m);
    const out = {
      senderID: -1,
      type: MessageType.TYPE_RUN_DATA,
      state: State.STATE_DEMO5,
      red: Math.max(100 + 100 * (msg.accX || 0), 0),
      blue: Math.max(100 + 100 * (msg.accY || 0), 0),
      green: Math.max(100 + 100 * (msg.accZ || 0), 0),
      brightness: 200,
    };
    ws.send(JSON.stringify(out));
    process.stdout.write(">");
  });
  ws.on("error", (err) => {
    console.log("/rc/demo5/ws err: " + err);
  });
  ws.on("close", () => {
    console.log("Closing /rc/demo5/ws");
  });
});

app.ws("/lights/ws", (ws, req: Request) => {
  ws.on("message", (m) => {
    process.stdout.write("<");
  });
  ws.on("error", (err) => {
    console.log("/lights/ws err: " + err);
  });
  ws.on("close", () => {
    console.log("Closing /lights/ws");
  });
});

const rcWss = expressWs.getWss("/rc/ws");
const lightsWss = expressWs.getWss("lights/ws");

app.post("/rc", (req: Request, res: Response) => {
  if (req.body.type === MessageType.TYPE_CHANGE_STATE) {
    const msg = JSON.stringify(req.body);
    (lightsWss.clients || []).forEach((client) => client.send(msg));

    if (req.body.state === State.STATE_DEMO4) {
      demo4.toggle(lightsWss.clients);
    }

    return res.send(`/rc: state change notification messages sent`);
  }
  res.send("/rc: message type not recognized");
});

const port = 3000;
app.listen(port, () => {
  console.log(`AF1 server is running on port ${port}.`);
});
