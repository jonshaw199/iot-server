var express = require("express");

const app = express();
var expressWs = require("express-ws")(app);

const port = 3000;

app.ws("/", (ws, req) => {
  ws.on("message", (msg) => {
    console.log(msg);
    ws.send(`fluck you`);
  });
});

app.listen(port, () => {
  console.log(`AF1 server is running on port ${port}.`);
});
