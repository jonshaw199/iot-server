
import { Request, Response } from "express";
import { PATH_WEB_WS } from "../paths";
import {Router} from "express-ws";
import { WebSocket as WS } from "ws";
import { WebSocket } from "../types";

const express = require('express');
const webRouter = new express.Router() as Router;

webRouter.ws(PATH_WEB_WS, (w: WS, req: Request) => {
  const ws = w as WebSocket;
  ws.path = PATH_WEB_WS;
  ws.orgId = req.query.orgId?.toString();
  ws.deviceId = req.query.deviceId?.toString();

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

export default webRouter;