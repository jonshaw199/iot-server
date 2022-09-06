var express = require("express");
const app = express();
var expressWs = require("express-ws")(app);

import demo4 from "./demos/demo4/demo4";
import { Request, Response } from "express";
import { MessageType, State } from "./types";

app.use(express.json());

app.ws("/ws", (ws, req: Request) => {
  ws.on("message", (m) => {
    process.stdout.write("."); // "." w/o newline
    const msg = JSON.parse(m);
    console.log(msg);
    const out = {
      senderID: -1,
      type: 1004,
      state: 2,
      red: Math.max(100 + 100 * (msg.accX || 0), 0),
      blue: Math.max(100 + 100 * (msg.accY || 0), 0),
      green: Math.max(100 + 100 * (msg.accZ || 0), 0),
      brightness: 200,
    };
    console.log("Passing along msg");
    console.log(out);
    ws.send(JSON.stringify(out));
  });
  ws.on("error", (err) => {
    console.log(err);
  });
  ws.on("close", () => {
    console.log("close");
  });
});
const rootWss = expressWs.getWss("/");

app.post("/remote", (req: Request, res: Response) => {
  if (req.body.type === MessageType.TYPE_CHANGE_STATE) {
    const msg = JSON.stringify({
      type: MessageType.TYPE_CHANGE_STATE,
      state: req.body.state,
      senderID: -1,
    });
    (rootWss.clients || []).forEach((client) => client.send(msg));

    if (req.body.state === State.STATE_DEMO4) {
      demo4.toggle(rootWss.clients);
    }

    return res.send("State change success");
  }
  res.send("Unacceptable");
});

const port = 3000;
app.listen(port, () => {
  console.log(`AF1 server is running on port ${port}.`);
});
