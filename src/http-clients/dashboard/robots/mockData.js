// RobotDataDto.js - dodane pole cargoCount
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
    this.cargoCount = data.cargoCount || 0; // Nowe pole - liczba ładunków 0-8
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

  get hasLoadedCargo() {
    return this.cargoCount > 0;
  }
}

// Rozszerzona funkcja generateRobots z cargoCount
export function generateRobots(count) {
  const robots = [];
  const types = ["fork", "picker"];
  const actions = ["GOTO", "GOLOAD", "GOUNLOAD", "GOCHARGING", null];

  for (let i = 1; i <= count; i++) {
    const hasAction = Math.random() > 0.3;
    const cargoCount = Math.floor(Math.random() * 9); // 0-8 ładunków

    robots.push(
      new RobotDataDto({
        id: i,
        name: `Robot-${String(i).padStart(3, "0")}`,
        type: types[Math.floor(Math.random() * types.length)],
        battery: Math.floor(Math.random() * 100),
        isConnected: Math.random() > 0.2,
        currentAction: hasAction ? actions[Math.floor(Math.random() * (actions.length - 1))] : null,
        missionStartTime: hasAction ? new Date(Date.now() - Math.random() * 600000) : null,
        missionExecutionTime: hasAction ? new Date(Date.now() - Math.random() * 60000000) : null,
        isOperational: Math.random() > 0.1,
        cargoCount: cargoCount,
      }),
    );
  }

  return robots;
}
