var express = require("express");
const app = express();
var expressWs = require("express-ws")(app);

import demo4 from "./demos/demo4/demo4";
import { Request, Response } from "express";

enum MessageType {
  TYPE_NONE = 0,
  TYPE_HANDSHAKE_REQUEST = 1,
  TYPE_HANDSHAKE_RESPONSE = 2,
  TYPE_CHANGE_STATE = 3,
  TYPE_RUN_DATA = 4,
}

app.use(express.json());

app.ws("/ws", (ws, req: Request) => {
  ws.on("message", (msg) => {
    console.log(msg);
    ws.send(`Message received`);
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
    return res.send("State change success");
  }
  demo4.toggle(rootWss.clients);
  res.send();
});

const port = 3000;
app.listen(port, () => {
  console.log(`AF1 server is running on port ${port}.`);
});
