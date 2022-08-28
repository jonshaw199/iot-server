import { clearDriftless, setDriftlessInterval } from "driftless";

const MAX_BRIGHTNESS = 200;
const COEFS = [
  0, 0.00001, 0.0001, 0.0003, 0.0005, 0.001, 0.003, 0.005, 0.01, 0.03, 0.05,
  0.1, 0.15, 0.3, 0.5, 0.7, 0.9, 1, 1, 1, 0.9, 0.7, 0.5, 0.3, 0.15, 0.1, 0.05,
  0.03, 0.01, 0.005, 0.003, 0.001, 0.0005, 0,
];
const SCENE_MS = 7000;
const INTERVAL_MS = 200;

export default class Demo4 {
  private static intervalId: number = -1;
  private static startMs: number;
  private static clients: any[];

  static demo() {
    const curMs = new Date().getTime();
    const elapsedMs = curMs - Demo4.startMs;

    const curSceneMs = elapsedMs % SCENE_MS;
    const curSceneRatio = curSceneMs / SCENE_MS;
    const coefArrIdxExact = curSceneRatio * COEFS.length;
    const coefArrIdxTrunc = Math.floor(coefArrIdxExact);
    const coefArrIdxRem = coefArrIdxExact - coefArrIdxTrunc;

    const coefA = COEFS[coefArrIdxTrunc];
    const coefB = COEFS[coefArrIdxTrunc + 1];
    const min = Math.min(coefA, coefB);
    const max = Math.max(coefA, coefB);
    const dif = max - min;

    const rem = coefArrIdxRem * dif;
    const curCoef = min === coefA ? min + rem : max - rem;

    const newBrightness = curCoef * MAX_BRIGHTNESS;
    const msg = {
      brightness: newBrightness,
      color: "red",
    };
    console.log(`Sending msg: ${JSON.stringify(msg)}`);
    (Demo4.clients || []).forEach((client) => client.send(JSON.stringify(msg)));
  }

  static init(c: any[]) {
    this.startMs = new Date().getTime();
    this.intervalId = setDriftlessInterval(this.demo, INTERVAL_MS);
    this.clients = c;
  }

  static deinit() {
    clearDriftless(this.intervalId);
    this.intervalId = -1;
  }

  static toggle(c: any[]) {
    if (this.intervalId < 0) {
      this.init(c);
    } else {
      this.deinit();
    }
  }
}
