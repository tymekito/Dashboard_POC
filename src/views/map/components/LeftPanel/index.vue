<template>
  <div class="right-panel-content">
    <div class="robots-list">
      <div v-for="robot in robots" :key="robot.id" class="robot-item" :class="{ expanded: isRobotExpanded(robot.id) }">
        <div class="robot-header" @click="toggleRobot(robot.id)">
          <span class="robot-name">{{ robot.name }}</span>
          <div class="robot-status">
            <div class="battery-container">
              <div class="battery-icon" :class="getBatteryClass(robot.batteryLevel)">
                <div class="battery-fill" :style="{ width: robot.batteryLevel + '%' }"></div>
              </div>
              <span class="battery-percent">{{ robot.batteryLevel }}%</span>
            </div>
            <div class="mission-icon">
              <span v-if="robot.isOnMission" class="mission-active">🔄</span>
              <span v-else class="mission-idle">⏸️</span>
            </div>
          </div>
        </div>

        <div v-if="isRobotExpanded(robot.id)" class="robot-details">
          <div class="mission-info">
            <p><strong>Misja:</strong> {{ robot.mission.name }}</p>
            <p><strong>Cel:</strong> {{ robot.mission.destination }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mockData } from "@/views/map/components/LeftPanel/mockData.js";

export default {
  name: "RightPanel",
  data() {
    return {
      robots: mockData.robots,
      expandedRobots: [],
    };
  },
  methods: {
    toggleRobot(robotId) {
      const index = this.expandedRobots.indexOf(robotId);
      if (index > -1) {
        this.expandedRobots.splice(index, 1);
      } else {
        this.expandedRobots.push(robotId);
      }
    },
    isRobotExpanded(robotId) {
      return this.expandedRobots.includes(robotId);
    },
    getBatteryClass(level) {
      if (level <= 20) return "battery-low";
      if (level <= 50) return "battery-medium";
      return "battery-high";
    },
  },
};
</script>

<style scoped lang="scss">
.right-panel-content {
  padding: 0.5rem;
  height: 100%;
  overflow-y: auto;
}

.robot-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  background: #fff;
  color: #000;
  transition: all 0.3s ease;

  &.expanded {
    border-color: #007bff;
    box-shadow: 0 2px 8px rgba(0, 123, 255, 0.2);
  }
}

.robot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  user-select: none;

  &:hover {
    background: #f0f0f0;
    border-radius: 8px;
  }
}

.robot-name {
  font-weight: 600;
  font-size: 1.5rem;
}

.robot-status {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.battery-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.battery-icon {
  width: 30px;
  height: 16px;
  border: 2px solid #333;
  border-radius: 2px;
  position: relative;
  background: #fff;

  &::after {
    content: "";
    position: absolute;
    right: -4px;
    top: 4px;
    width: 2px;
    height: 8px;
    background: #333;
    border-radius: 0 1px 1px 0;
  }

  &.battery-low {
    border-color: #dc3545;
    &::after {
      background: #dc3545;
    }
  }

  &.battery-medium {
    border-color: #ffc107;
    &::after {
      background: #ffc107;
    }
  }

  &.battery-high {
    border-color: #28a745;
    &::after {
      background: #28a745;
    }
  }
}

.battery-fill {
  height: 100%;
  transition: width 0.3s ease;

  .battery-low & {
    background: #dc3545;
  }
  .battery-medium & {
    background: #ffc107;
  }
  .battery-high & {
    background: #28a745;
  }
}

.battery-percent {
  font-size: 1.2rem;
  font-weight: 500;
}

.mission-icon {
  font-size: 2rem;
}

.mission-active {
  animation: spin 2s linear infinite;
}

.robot-details {
  padding: 0 1rem 1rem 1rem;
  border-top: 1px solid #eee;
  background: #fff;
}

.mission-info {
  margin-top: 0.5rem;

  p {
    margin: 0.25rem 0;
    font-size: 1.5rem;
  }

  strong {
    color: #555;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
