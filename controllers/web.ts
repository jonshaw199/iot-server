import { WebSocket, Request } from "../types";

export const handleWebReq = (ws: WebSocket, req: Request) => {
  ws.on("message", (m) => {
    console.log(`Web ws msg: ${m}`);
  });
  ws.on("error", (err) => {
    console.log("/web/ws err: " + err);
  });
  ws.on("close", () => {
    console.log("Closing /web/ws");
  });
};
