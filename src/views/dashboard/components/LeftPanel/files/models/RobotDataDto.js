// files/models/RobotDataDto.js
export class RobotDataDto {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || "";
    this.type = data.type || "";
    this.battery = data.battery || 0;
    this.isConnected = data.isConnected || false;
    this.currentAction = data.currentAction || null;
    this.missionStartTime = data.missionStartTime || null;
    this.missionExecutionTime = data.missionExecutionTime || null;
    this.isOperational = data.isOperational || false;
  }

  static fromArray(dataArray) {
    return dataArray.map((data) => new RobotDataDto(data));
  }

  get hasMission() {
    return this.missionStartTime !== null;
  }

  get isCharging() {
    return this.currentAction === "GOCHARGING";
  }

  get hasAction() {
    return this.currentAction !== null;
  }
}
