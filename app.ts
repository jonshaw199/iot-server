var express = require("express");

const app = express();
var expressWs = require("express-ws")(app);

app.ws("/ws", (ws, req) => {
  ws.on("message", (msg) => {
    console.log(msg);
    ws.send(`fluck you`);
  });
});
const rootWss = expressWs.getWss("/");

app.post("/remote", (req, res) => {
  res.send("Broadcasting message...");
  rootWss?.clients?.forEach((client) => client.send("Heyo"));
});

const port = 3000;
app.listen(port, () => {
  console.log(`AF1 server is running on port ${port}.`);
});
