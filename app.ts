var express = require("express");
const app = express();
var expressWs = require("express-ws")(app);

import { Request, Response } from "express";
import { MessageType, State } from "./types";

app.use(express.json());

const pPrefix = "/:orgId";
const pLightsWs = `${pPrefix}/lights/ws`;
const pRc = `${pPrefix}/rc`;
const pWebWs = `${pPrefix}/web/ws`;

const getLightsClients = (orgId: string) =>
  Array.from(expressWs.getWss().clients).filter(
    (w: any) => w.route == pLightsWs
  );

const getLightsAudioClients = (orgId: string) =>
  getLightsClients(orgId).filter((w: any) => w.info?.vs1053);

const getWebClients = (orgId: string) =>
  Array.from(expressWs.getWss().clients).filter((w: any) => w.route == pWebWs);

app.ws(pLightsWs, (ws, req: Request) => {
  ws.orgId = req.params.orgId;
  ws.route = pLightsWs;

  ws.on("message", (m) => {
    process.stdout.write("<");
    const msg = JSON.parse(m);
    switch (msg.type) {
      case MessageType.TYPE_MOTION:
        console.log(`Motion ${msg.motion ? "begin" : "end"}`);
        const out = {
          senderID: 255,
          type: msg.type,
          state: msg.state,
          motion: msg.motion,
        };
        getLightsAudioClients(ws.orgId).forEach(function (client: any) {
          client.send(JSON.stringify(out));
          process.stdout.write(">");
        });
        break;
      case MessageType.TYPE_INFO:
        console.log(`Info msg: ${JSON.stringify(msg.info)}`);
        ws.info = msg.info;
        break;
    }
  });
  ws.on("error", (err) => {
    console.log("/lights/ws err: " + err);
  });
  ws.on("close", () => {
    console.log("Closing /lights/ws");
  });
});

app.ws(pWebWs, (ws, req: Request) => {
  ws.orgId = req.params.orgId;
  ws.route = pWebWs;

  ws.on("message", (m) => {
    console.log(`Web ws msg: ${m}`);
  });
  ws.on("error", (err) => {
    console.log("/lights/ws err: " + err);
  });
  ws.on("close", () => {
    console.log("Closing /lights/ws");
  });
});

app.post(pRc, (req: Request, res: Response) => {
  if (req.body.type === MessageType.TYPE_CHANGE_STATE) {
    console.log("Sending state change messages: " + req.body.state);
    const msg = JSON.stringify(req.body);
    const c = getLightsClients(req.params.orgId);
    c.forEach((client: any) => {
      client.send(msg);
      console.log("sent");
    });

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
