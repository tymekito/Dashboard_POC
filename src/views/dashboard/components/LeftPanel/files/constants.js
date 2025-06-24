// files/constants.js

export const RobotAction = {
  GOTO: "GOTO",
  GOLOAD: "GOLOAD",
  GOUNLOAD: "GOUNLOAD",
  GOCHARGING: "GOCHARGING",
};

export const RobotType = {
  FORK: "fork",
  PICKER: "picker",
};

export const BatteryStatus = {
  GREEN: "green",
  YELLOW: "yellow",
  ORANGE: "orange",
  RED: "red",
};

export const BatteryThreshold = {
  GREEN: 75,
  YELLOW: 50,
  ORANGE: 25,
  RED: 0,
};

export const IconType = {
  BATTERY_CHARGING: "batteryCharging",
  PLAY: "play",
  PAUSE: "pause",
  GO_TO: "goTo",
  GO_LOAD: "goLoad",
  GO_UNLOAD: "goUnload",
  WIFI: "wifi",
  WIFI_OFF: "wifiOff",
  OPERATIONAL: "operational",
  NOT_OPERATIONAL: "notOperational",
};
