import { WebSocket as WS } from "ws";
import { Request as Req } from "express";
import { Document } from "mongoose";

export type Nullable<T> = null | undefined | T;

export enum MessageType {
  TYPE_MOTION = 0,
  TYPE_NONE = 100,
  TYPE_HANDSHAKE_REQUEST,
  TYPE_HANDSHAKE_RESPONSE,
  TYPE_CHANGE_STATE,
  TYPE_RUN_DATA,
  TYPE_RC_DATA,
  TYPE_TIME_SYNC,
  TYPE_TIME_SYNC_RESPONSE,
  TYPE_TIME_SYNC_START,
  TYPE_INFO,
}

export enum TransportType {
  TRANSPORT_ESPNOW,
  TRANSPORT_WEBSOCKET,
  TRANSPORT_NONE,
}

export enum State {
  STATE_HOME = 0,
  STATE_PATTERN_TWINKLEFOX,
  STATE_INIT = 100,
  STATE_PURG,
  STATE_OTA,
  STATE_RESTART,
  STATE_IDLE_BASE,
  STATE_SYNC_TEST,
}

export type Message = {
  state: State | number;
  type: MessageType | number;
  transportType: TransportType | number;
  senderID: number;
};

export type WebSocket = WS & {
  path: Nullable<string>;
  orgId: Nullable<string>;
  deviceId: Nullable<string>;
  info: Nullable<Object>; // To do
};

export type Request = Req & {
  user: Nullable<Document<User>>;
};

// Model interfaces

export type User = {
  name: string;
  email: string;
  password: string;
};
