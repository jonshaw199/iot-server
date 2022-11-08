import { WebSocket as WS } from "ws";

import { PATH_WEB_WS } from "../paths";
import { WebSocket, Request } from "../types";

export const handleWebReq = (w: WS, req: Request) => {
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
};
