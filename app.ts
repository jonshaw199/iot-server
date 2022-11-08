import express, { Response } from "express";
import express_ws, { Application } from "express-ws";
import dotenv from "dotenv";
import mongoose from "mongoose";

const baseApp = express();
const expressWs = express_ws(baseApp);
const app = baseApp as unknown as Application;

dotenv.config();

import webRouter from "./routes/web";
import lightsRouter from "./routes/lights";
import rcRouter from "./routes/rc";
import Connections from "./connections";
import { Request } from "./types";

Connections.init(expressWs);

app.use(express.json());

app.use((req: Request, res: Response, next) => {
  console.log(req);
  next();
});

app.use("/", lightsRouter);

app.use("/", webRouter);

app.use("/", rcRouter);

mongoose.connect(process.env.MONGODB_URI, null, (err) => {
  console.log(err || `Connected to MongoDB.`);
});

app.listen(process.env.PORT, () => {
  console.log(`AF1 server is running on port ${process.env.PORT}.`);
});
