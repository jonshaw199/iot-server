import express, { Response } from "express";
import { Router } from "express-ws";
import Connections from "../connections";

import { MessageType, Request } from "../types";
import { PATH_RC } from "../paths";

const rcRouter = express.Router() as Router;

rcRouter.post(PATH_RC, (req: Request, res: Response) => {
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

export default rcRouter;
