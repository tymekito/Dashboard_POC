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

    // Nowe pola
    this.fleet = data.fleet || { name: "DEFAULT", color: "#666666" };
    this.programName = data.programName || null;
    this.cargoCount = data.cargoCount || 0;
    this.lastMissionEnd = data.lastMissionEnd || null;
    this.startTime = data.startTime || new Date();
    this.isError = data.isError || false;
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

  get hascargo() {
    return this.cargoCount > 0;
  }
}

// Floty robotów - 3 rodzaje z losowymi kolorami
const ROBOT_FLEETS = [
  { name: "ALPHA", color: "#E91E63" }, // Różowy
  { name: "BETA", color: "#9C27B0" }, // Fioletowy
  { name: "GAMMA", color: "#FF5722" }, // Pomarańczowy
];

// Programy misji
const MISSION_PROGRAMS = [
  "Transport_A1_B2",
  "Picking_Zone_C",
  "Delivery_Route_D4",
  "Inventory_Check_E1",
  "Material_Transfer_F2",
  "Patrol_Area_G",
  "Cleaning_Zone_H1",
  "Service_Check_I2",
];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateCargoCount(robotType) {
  if (robotType === "picker") {
    return Math.floor(Math.random() * 9); // 0-8 dla picker
  } else if (robotType === "fork") {
    return Math.floor(Math.random() * 2); // 0-1 dla fork
  }
  return 0;
}

// Function to generate more robots if needed
export function generateRobots(count) {
  const robots = [];
  const types = ["fork", "picker"];
  const actions = ["GOTO", "GOLOAD", "GOUNLOAD", "GOCHARGING", null];

  for (let i = 1; i <= count; i++) {
    const robotType = getRandomElement(types);
    const hasAction = Math.random() > 0.3;
    const hasMission = hasAction && Math.random() > 0.4;

    // Generuj czasy
    const startTime = new Date(Date.now() - Math.random() * 86400000); // Ostatnie 24h
    const lastMissionEnd = hasMission ? null : new Date(Date.now() - Math.random() * 3600000); // Ostatnia godzina

    robots.push(
      new RobotDataDto({
        id: i,
        name: `Robot-${String(i).padStart(3, "0")}`,
        type: robotType,
        battery: Math.floor(Math.random() * 100),
        isConnected: Math.random() > 0.2,
        currentAction: hasAction ? getRandomElement(actions.slice(0, -1)) : null, // Bez null
        missionStartTime: hasMission ? new Date(Date.now() - Math.random() * 600000) : null,
        missionExecutionTime: hasMission ? new Date(Date.now() - Math.random() * 60000000) : null,
        isOperational: Math.random() > 0.1,
        isError: Math.random() > 0.9,

        // Nowe pola
        fleet: getRandomElement(ROBOT_FLEETS),
        programName: hasMission ? getRandomElement(MISSION_PROGRAMS) : null,
        cargoCount: generateCargoCount(robotType),
        lastMissionEnd: lastMissionEnd,
        startTime: startTime,
      }),
    );
  }
  return robots;
}
