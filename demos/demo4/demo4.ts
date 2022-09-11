import { clearDriftless, setDriftlessInterval } from "driftless";

import { MessageType } from "../../types";

const MAX_BRIGHTNESS = 200;
const SCENE_MS = 7000;
const BRIGHTNESS_INTERVAL_MS = 50;
const COLOR_INTERVAL_MS = 60000;

let coefs = [
  ...Array(MAX_BRIGHTNESS / 10).fill(0),
  ...Array(MAX_BRIGHTNESS).keys(),
  ...Array(MAX_BRIGHTNESS / 10).fill(MAX_BRIGHTNESS),
];
coefs = [...coefs, ...coefs.reverse()];

export default class Demo4 {
  private static brightnessIntervalId: number = -1;
  private static colorIntervalId: number = -1;
  private static startMs: number;
  private static clients: any[];
  private static rgb = { r: 255, g: 0, b: 0 };

  static updateRGB() {
    if (Demo4.rgb.r) {
      Demo4.rgb.g = 255;
      Demo4.rgb.r = 0;
    } else if (Demo4.rgb.g) {
      Demo4.rgb.b = 255;
      Demo4.rgb.g = 0;
    } else {
      Demo4.rgb.r = 255;
      Demo4.rgb.b = 0;
    }
  }

  static getRGB() {
    return [Demo4.rgb.r, Demo4.rgb.g, Demo4.rgb.b];
  }

  static demo() {
    const curMs = new Date().getTime();
    const elapsedMs = curMs - Demo4.startMs;

    const curSceneMs = elapsedMs % SCENE_MS;
    const curSceneRatio = curSceneMs / SCENE_MS;

    const curArrIdx = Math.floor(curSceneRatio * coefs.length);
    const newBrightness = coefs[curArrIdx];
    const [red, green, blue] = Demo4.getRGB();

    const msg = {
      state: 3, // Demo4
      senderID: -1, // Server
      type: MessageType.TYPE_RUN_DATA, // TYPE_RUN_DATA,
      brightness: newBrightness,
      red,
      green,
      blue,
    };
    // console.log(`Sending msg: ${JSON.stringify(msg)}`);
    process.stdout.write(Demo4.clients?.length.toString());
    process.stdout.write(">");
    (Demo4.clients || []).forEach((client) => client.send(JSON.stringify(msg)));
  }

  static init(c: any[]) {
    Demo4.startMs = new Date().getTime();
    Demo4.brightnessIntervalId = setDriftlessInterval(
      Demo4.demo,
      BRIGHTNESS_INTERVAL_MS
    );
    Demo4.colorIntervalId = setDriftlessInterval(
      Demo4.updateRGB,
      COLOR_INTERVAL_MS
    );
    Demo4.clients = c;
  }

  static deinit() {
    clearDriftless(Demo4.brightnessIntervalId);
    clearDriftless(Demo4.colorIntervalId);
    Demo4.brightnessIntervalId = -1;
    Demo4.colorIntervalId = -1;
  }

  static toggle(c: any[]) {
    if (Demo4.brightnessIntervalId < 0) {
      Demo4.init(c);
      console.log("Starting");
    } else {
      Demo4.deinit();
      console.log("Stopping");
    }
  }
}
