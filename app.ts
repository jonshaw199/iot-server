var express = require("express");
const app = express();
var expressWs = require("express-ws")(app);

import demo4 from "./demos/demo4/demo4";
import { Request, Response } from "express";
import { MessageType, State } from "./types";

app.use(express.json());

const pRc = "/rc/ws";
const pLights = "/lights/ws";

const getRcClients = () =>
  Array.from(expressWs.getWss().clients).filter((w: any) => {
    return w.route == pRc;
  });
const getLightsClients = () =>
  Array.from(expressWs.getWss().clients).filter((w: any) => {
    return w.route == pLights;
  });

app.ws(pRc, (ws, req: Request) => {
  // https://gist.github.com/hugosp/5eeb2a375157625e21d33d75d10574df
  ws.route = pRc;

  ws.on("message", (m) => {
    process.stdout.write("<");
    /*
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

    getLightsClients().forEach(function (client: any) {
      client.send(JSON.stringify(out));
      process.stdout.write(">");
    });
    */
  });
  ws.on("error", (err) => {
    console.log("/rc/demo5/ws err: " + err);
  });
  ws.on("close", () => {
    console.log("Closing /rc/demo5/ws");
  });
});

app.ws(pLights, (ws, req: Request) => {
  ws.route = pLights;

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

app.post("/rc", (req: Request, res: Response) => {
  if (req.body.type === MessageType.TYPE_CHANGE_STATE) {
    const msg = JSON.stringify(req.body);
    const c = getLightsClients();
    c.forEach((client: any) => client.send(msg));

    /*
    if (req.body.state === State.STATE_DEMO4) {
      demo4.toggle(c);
    }
    */

    return res.send(`/rc: state change notification messages sent`);
  }
  res.send("/rc: message type not recognized");
});

const port = 3000;
app.listen(port, () => {
  console.log(`AF1 server is running on port ${port}.`);
});
