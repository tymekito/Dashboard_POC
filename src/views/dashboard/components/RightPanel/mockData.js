// src/views/dashboard/components/RightPanel/mockData.js

const PROGRAM_NAMES = [
  "Patrol_Floor_A1",
  "Transport_Goods_B2",
  "Clean_Zone_C",
  "Delivery_Route_D4",
  "Inspection_Area_E",
  "Material_Transfer_F1",
  "Security_Patrol_G",
  "Inventory_Check_H2",
  "Service_Check",
  "Battery_Diagnostic",
  "System_Calibration",
  "Sensor_Test",
];

const ROBOT_NAMES = ["AMR-001", "AMR-002", "AMR-003", "AMR-004", "AMR-005", "AMR-006", "AMR-007", "AMR-008"];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateMissionTime(baseTime, offsetMinutes) {
  const time = new Date(baseTime);
  time.setMinutes(time.getMinutes() + offsetMinutes);
  return time;
}

export function generateMissions(count = 15) {
  const missions = [];
  const baseTime = new Date();
  baseTime.setHours(8, 0, 0, 0); // Start at 8:00 AM

  for (let i = 0; i < count; i++) {
    const createdOffset = i * 30; // Every 30 minutes
    const startOffset = createdOffset + 15 + Math.floor(Math.random() * 15); // 15-30 minutes after creation

    const programName = getRandomElement(PROGRAM_NAMES);
    const isService =
      programName.includes("Service") ||
      programName.includes("Diagnostic") ||
      programName.includes("Calibration") ||
      programName.includes("Test");

    missions.push({
      id: i + 1,
      startTime: generateMissionTime(baseTime, startOffset),
      createdTime: generateMissionTime(baseTime, createdOffset),
      programName: programName,
      isService: isService,
      robotName: getRandomElement(ROBOT_NAMES),
    });
  }

  return missions;
}
