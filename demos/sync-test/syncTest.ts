import { clearDriftless, setDriftlessInterval } from "driftless";

import { MessageType } from "../../types";

const BLINK_INTERVAL_MS = 1000;

export default class SyncTest {
  private static blinkIntervalId: number = -1;
  private static clients: any[];
  private static on = false;

  static do() {
    SyncTest.on = !SyncTest.on;

    const msg = {
      state: 0,
      senderID: -1,
      type: MessageType.TYPE_RUN_DATA,
      on: SyncTest.on,
    };

    process.stdout.write(SyncTest.clients?.length.toString());
    process.stdout.write(">");
    (SyncTest.clients || []).forEach((client) =>
      client.send(JSON.stringify(msg))
    );
  }

  static init(c: any[]) {
    SyncTest.blinkIntervalId = setDriftlessInterval(
      SyncTest.do,
      BLINK_INTERVAL_MS
    );
    SyncTest.clients = c;
  }

  static deinit() {
    clearDriftless(SyncTest.blinkIntervalId);
    SyncTest.blinkIntervalId = -1;
  }

  static toggle(c: any[]) {
    if (SyncTest.blinkIntervalId < 0) {
      SyncTest.init(c);
      console.log("Starting");
    } else {
      SyncTest.deinit();
      console.log("Stopping");
    }
  }
}
