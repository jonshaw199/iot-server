import { clearDriftless, setDriftlessInterval } from "driftless";

/*
const float Demo2Master::coefs[] = {0, .00001, .0001, .0003, .0005, .001, .003, .005, .01, .03, .05, .1, .15, .3, .5, .7, .9, 1, 1, 1, .9, .7, .5, .3, .15, .1, .05, .03, .01, .005, .003, .001, .0005, 0};
const unsigned long Demo2Master::sceneMs = 7000;
const uint8_t Demo2Master::maxBrightness = 150;

bool Demo2Master::demo2(IECBArg a)
{
  uint8_t brightness = getCurCoef(a.getElapsedMs()) * maxBrightness;
  sendMsg(brightness);
  return true;
}

void Demo2Master::sendMsg(uint8_t b)
{
  JSMessage msg;
  msg.setState(STATE_DEMO1);
  msg.setType(TYPE_RUN_DATA);
  demo2_data d;
  d.brightness = b;
  msg.setData((uint8_t *)&d);
  pushOutbox(msg);
}

// Smooths out transitions from one coef to the next
float Demo2Master::getCurCoef(unsigned long elapsedMs)
{
  float curSceneMs = elapsedMs % sceneMs;
  float curSceneRatio = curSceneMs / sceneMs;
  float coefArrIdxExact = curSceneRatio * sizeof(coefs) / sizeof(coefs[0]);
  int coefArrIdxTrunc = coefArrIdxExact;
  float coefArrIdxRem = coefArrIdxExact - coefArrIdxTrunc;

  float coefA = coefs[coefArrIdxTrunc];
  float coefB = coefs[coefArrIdxTrunc + 1];
  float min = std::min(coefA, coefB);
  float max = std::max(coefA, coefB);
  float dif = max - min;

  float rem = coefArrIdxRem * dif;
  float result = min == coefA ? min + rem : max - rem;
  return result;
}
*/

/*
let brightness = 0;
const MAX_BRIGHTNESS = 200;
const 

let intervalId;
const toggleRun = () => {
  if (intervalId) {
    driftless.clearDriftless(intervalId);
  } else {
    intervalId = driftless.setDriftlessInterval(() => {

    }, 1000);
  }
};
*/

const MAX_BRIGHTNESS = 200;
const COEFS = [
  0, 0.00001, 0.0001, 0.0003, 0.0005, 0.001, 0.003, 0.005, 0.01, 0.03, 0.05,
  0.1, 0.15, 0.3, 0.5, 0.7, 0.9, 1, 1, 1, 0.9, 0.7, 0.5, 0.3, 0.15, 0.1, 0.05,
  0.03, 0.01, 0.005, 0.003, 0.001, 0.0005, 0,
];
const SCENE_MS = 7000;
const INTERVAL_MS = 200;

export default class Demo4 {
  private static intervalId: number;
  private static startMs: number;

  static demo() {
    const curMs = new Date().getTime();
    const elapsedMs = curMs - this.startMs;

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
    // sendMsg(newBrightness)
  }

  static init() {
    this.intervalId = 0;
    this.startMs = new Date().getTime();
    this.intervalId = setDriftlessInterval(this.demo, INTERVAL_MS);
  }

  static deinit() {
    clearDriftless(this.intervalId);
  }
}
