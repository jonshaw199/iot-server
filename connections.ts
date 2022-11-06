import { Instance } from "express-ws";

import { PATH_LIGHTS_WS, PATH_WEB_WS } from "./paths";
import { WebSocket } from "./types";

export default class Connections {
  private expressWsInstance: Instance;

  constructor(e: Instance) {
    this.expressWsInstance = e;
  }

  getLightsClients = (orgId: string) =>
    Array.from(this.expressWsInstance.getWss().clients).filter(
      (w: WebSocket) => w.path == PATH_LIGHTS_WS && w.orgId == orgId
    );

  getLightsAudioClients = (orgId: string) =>
    this.getLightsClients(orgId).filter((w: any) => w.info?.vs1053);

  getWebClients = (orgId: string) =>
    Array.from(this.expressWsInstance.getWss().clients).filter(
      (w: WebSocket) => w.path == PATH_WEB_WS
    );
}
