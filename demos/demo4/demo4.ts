import { clearDriftless, setDriftlessInterval } from "driftless";

const MAX_BRIGHTNESS = 200;
const SCENE_MS = 7000;
const INTERVAL_MS = 100;

let coefs = [
  ...Array(MAX_BRIGHTNESS / 10).fill(0),
  ...Array(MAX_BRIGHTNESS).keys(),
  ...Array(MAX_BRIGHTNESS / 10).fill(MAX_BRIGHTNESS),
];
coefs = [...coefs, ...coefs.reverse()];

export default class Demo4 {
  private static intervalId: number = -1;
  private static startMs: number;
  private static clients: any[];

  static demo() {
    const curMs = new Date().getTime();
    const elapsedMs = curMs - Demo4.startMs;

    const curSceneMs = elapsedMs % SCENE_MS;
    const curSceneRatio = curSceneMs / SCENE_MS;

    const curArrIdx = Math.floor(curSceneRatio * coefs.length);
    const newBrightness = coefs[curArrIdx];

    const msg = {
      brightness: newBrightness,
      color: "red",
      state: 3, // Demo4
      senderID: -1, // Server
      type: 4, // TYPE_RUN_DATA
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
