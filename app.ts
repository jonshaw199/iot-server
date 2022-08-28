var express = require("express");
const app = express();
var expressWs = require("express-ws")(app);

import demo4 from "./demos/demo4/demo4";

app.ws("/ws", (ws, req) => {
  ws.on("message", (msg) => {
    console.log(msg);
    ws.send(`Message received`);
  });
});
const rootWss = expressWs.getWss("/");

app.post("/remote", (req, res) => {
  demo4.toggle(rootWss.clients);
  res.send();
});

const port = 3000;
app.listen(port, () => {
  console.log(`AF1 server is running on port ${port}.`);
});
