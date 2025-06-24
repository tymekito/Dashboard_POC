import { RobotDataDto } from "./models/RobotDataDto.js";

// Function to generate more robots if needed
export function generateRobots(count) {
  const robots = [];
  const types = ["fork", "picker"];
  const actions = ["GOTO", "GOLOAD", "GOUNLOAD", "GOCHARGING", null];

  for (let i = 1; i <= count; i++) {
    const hasAction = Math.random() > 0.3;
    robots.push(
      new RobotDataDto({
        id: i,
        name: `Robot-${String(i).padStart(3, "0")}`,
        type: types[Math.floor(Math.random() * types.length)],
        battery: Math.floor(Math.random() * 100),
        isConnected: Math.random() > 0.2,
        currentAction: hasAction ? actions[Math.floor(Math.random() * (actions.length - 1))] : null,
        missionStartTime: hasAction ? new Date(Date.now() - Math.random() * 600000) : null,
        missionExecutionTime: hasAction ? new Date(Date.now() - Math.random() * 600000) : null,
        isOperational: Math.random() > 0.1,
      }),
    );
  }

  return robots;
}
