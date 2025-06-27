<template>
  <div class="robot-tile" :style="tileStyle">
    <div class="robot-row">
      <div class="robot-identity">
        <div class="robot-icon" :class="typeIconClass">
          <img :src="typeIcon" />
        </div>
        <div class="robot-info">
          <h3 class="robot-name">{{ robot.name }}</h3>
          <h4 class="robot-type">{{ robotTypeDisplay }}</h4>
        </div>
      </div>

      <div class="robot-stats">
        <div class="battery-container">
          <div class="battery-icon" :class="`battery-${batteryStatus}`">
            <div class="battery-level" :style="batteryLevelStyle"></div>
          </div>
          <span class="battery-text">{{ robot.battery }}%</span>
        </div>

        <div class="fleet-badge" :style="{ backgroundColor: robot.fleet?.color || '#009ABE' }">
          {{ robot.fleet?.name || robot.fleetName || "Fleet" }}
        </div>

        <div class="connection-status" :class="connectionClass">
          <img :src="wifiIcon" />
          <span>{{ connectionStatusText }}</span>
        </div>
      </div>
    </div>

    <div class="mission-row">
      <div class="mission-info">
        <div class="mission-status" :class="missionStatusClass">
          <img :src="missionIcon" />
          <span class="mission-name">{{ missionName }}</span>
        </div>
        <div class="mission-time">
          <span>{{ missionTimeDisplay }}</span>
        </div>
      </div>

      <div class="mission-actions">
        <div v-if="actionIcon" class="action-badge" :class="actionClass">
          <img :src="actionIcon" />
        </div>

        <div class="cargo-indicator" :class="cargoClass">
          <img :src="cargoIcon" />
          <span class="cargo-count">{{ robot.cargoCount || 0 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BatteryChargingIcon from "@/assets/icons/battery-charging-icon.svg";
import TargetIcon from "@/assets/icons/go-to-icon.svg";
import NotOperationalIcon from "@/assets/icons/not-operational-icon.svg";
import OperationalIcon from "@/assets/icons/operational-icon.svg";
import PackageInIcon from "@/assets/icons/package-in-icon.svg";
import PackageOutIcon from "@/assets/icons/package-out-icon.svg";
import PauseIcon from "@/assets/icons/pause-icon.svg";
import PlayIcon from "@/assets/icons/play-icon.svg";
import WifiIcon from "@/assets/icons/wifi-icon.svg";
import WifiOffIcon from "@/assets/icons/wifi-off-icon.svg";
import colors from "@/assets/styles/abstracts/_colors.module.scss";
import { RobotAction, BatteryStatus, BatteryThreshold, IconType } from "./constants";

const ICONS = {
  [IconType.BATTERY_CHARGING]: BatteryChargingIcon,
  [IconType.PLAY]: PlayIcon,
  [IconType.PAUSE]: PauseIcon,
  [IconType.GO_TO]: TargetIcon,
  [IconType.GO_LOAD]: PackageInIcon,
  [IconType.GO_UNLOAD]: PackageOutIcon,
  [IconType.WIFI]: WifiIcon,
  [IconType.WIFI_OFF]: WifiOffIcon,
  [IconType.OPERATIONAL]: OperationalIcon,
  [IconType.NOT_OPERATIONAL]: NotOperationalIcon,
};

const ACTION_ICON_MAP = {
  [RobotAction.GOTO]: IconType.GO_TO,
  [RobotAction.GOLOAD]: IconType.GO_LOAD,
  [RobotAction.GOUNLOAD]: IconType.GO_UNLOAD,
  [RobotAction.GOCHARGING]: IconType.BATTERY_CHARGING,
};

const ACTION_TEXT_MAP = {
  [RobotAction.GOTO]: "Moving",
  [RobotAction.GOLOAD]: "Loading",
  [RobotAction.GOUNLOAD]: "Unloading",
  [RobotAction.GOCHARGING]: "Charging",
};

export default {
  name: "RobotTile",
  props: {
    robot: {
      type: Object,
      required: true,
    },
    height: {
      type: Number,
      default: 100,
    },
    width: {
      type: Number,
      default: 350,
    },
  },

  data: () => ({
    icons: ICONS,
  }),

  computed: {
    typeIcon() {
      return this.robot.isOperational ? ICONS[IconType.OPERATIONAL] : ICONS[IconType.NOT_OPERATIONAL];
    },

    typeIconClass() {
      return this.robot.isOperational ? "icon-operational" : "icon-error";
    },

    robotTypeDisplay() {
      return this.robot.displayType || this.robot.type || "Unknown";
    },

    connectionClass() {
      return this.robot.isConnected ? "connection-online" : "connection-offline";
    },

    connectionStatusText() {
      if (this.robot.isConnected) {
        return this.robot.connectionStatusText || "";
      }
      return this.robot.connectionStatusText || "";
    },

    batteryStatus() {
      const { battery } = this.robot;
      if (battery >= BatteryThreshold.GREEN) return BatteryStatus.GREEN;
      if (battery >= BatteryThreshold.YELLOW) return BatteryStatus.YELLOW;
      if (battery >= BatteryThreshold.ORANGE) return BatteryStatus.ORANGE;
      return BatteryStatus.RED;
    },

    batteryLevelStyle() {
      return { width: `${this.robot.battery}%` };
    },

    wifiIcon() {
      return this.robot.isConnected ? ICONS[IconType.WIFI] : ICONS[IconType.WIFI_OFF];
    },

    missionStatusClass() {
      return this.robot.missionStartTime ? "mission-active" : "mission-idle";
    },

    missionIcon() {
      return this.robot.missionStartTime ? ICONS[IconType.PLAY] : ICONS[IconType.PAUSE];
    },

    missionName() {
      if (this.robot.missionStartTime && this.robot.programName) {
        return this.robot.programName;
      }
      return this.robot.idleStatus || "";
    },

    missionTimeDisplay() {
      if (this.robot.missionStartTime) {
        return this.formatElapsedTime(this.robot.missionStartTime);
      }
      // Czas bezczynności
      const idleStart = this.robot.lastMissionEnd || this.robot.startTime || new Date();
      const idleLabel = this.robot.idleLabel ?? "";
      return `${this.formatElapsedTime(idleStart)} ${idleLabel}`;
    },

    actionIcon() {
      const iconType = ACTION_ICON_MAP[this.robot.currentAction];
      return iconType ? ICONS[iconType] : null;
    },

    actionClass() {
      return `action-${this.robot.currentAction?.toLowerCase() || ""}`;
    },

    actionText() {
      return this.robot.actionText || ACTION_TEXT_MAP[this.robot.currentAction] || "";
    },

    cargoIcon() {
      return this.robot.cargoCount > 0 ? ICONS[IconType.GO_LOAD] : ICONS[IconType.GO_UNLOAD];
    },

    cargoClass() {
      return this.robot.cargoCount > 0 ? "cargo-loaded" : "cargo-empty";
    },

    tileStyle() {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`,
        border: `1px solid ${this.robot.isError ? colors.red : colors.whiteAlfa25}`,
      };
    },
  },

  methods: {
    formatElapsedTime(startTime) {
      const elapsedSeconds = Math.floor((new Date() - new Date(startTime)) / 1000);
      const hours = Math.floor(elapsedSeconds / 3600);
      const minutes = Math.floor((elapsedSeconds % 3600) / 60);

      if (hours === 0) {
        return `${minutes}m`;
      }

      return `${hours}h ${minutes}m`;
    },
  },
};
</script>

<style scoped lang="scss">
@use "@/assets/styles/abstracts/_colors.module.scss" as colors;

$bg-primary: colors.$darkBlue;
$bg-secondary: rgba(255, 255, 255, 0.11);
$border-color: rgba(255, 255, 255, 0.35);
$text-primary: rgba(255, 255, 255, 0.9);
$text-secondary: rgba(255, 255, 255, 0.8);
$text-muted: rgba(255, 255, 255, 0.7);
$accent-green: #10b981;
$accent-yellow: #f59e0b;
$accent-red: #ef4444;
$accent-blue: colors.$lightBlue;

$icon-size: 1.8rem;

.robot-tile {
  background: $bg-primary;
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 0;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  box-sizing: border-box;

  * {
    box-sizing: border-box;
  }

  &:hover {
    border-color: rgba($accent-blue, 0.4);
    box-shadow: 0 0 20px rgba($accent-blue, 0.15);
    transform: translateY(1px);
  }
}

// First Row
.robot-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 7px;
  background: $bg-secondary;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  gap: 5px;
  height: 50%;
}

.robot-identity {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.robot-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.icon-operational {
    background: rgba($accent-green, 0.15);

    img {
      filter: brightness(0) saturate(100%) invert(68%) sepia(78%) saturate(407%) hue-rotate(81deg) brightness(93%)
        contrast(89%);
    }
  }

  &.icon-error {
    background: rgba($accent-red, 0.15);

    img {
      filter: brightness(0) saturate(100%) invert(36%) sepia(94%) saturate(3204%) hue-rotate(343deg) brightness(97%)
        contrast(91%);
    }
  }

  img {
    width: $icon-size;
    height: $icon-size;
  }
}

.robot-info {
  min-width: 0;

  .robot-name {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: $text-primary;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.1;
    max-width: 140px;
  }

  .robot-type {
    font-size: 10px;
    letter-spacing: 0.5px;
    font-weight: 500;
    color: $text-muted;
    text-transform: uppercase;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.robot-stats {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

// Battery
.battery-container {
  display: flex;
  align-items: center;
  gap: 5px;

  .battery-icon {
    position: relative;
    width: 24px;
    height: 12px;
    border: 1.5px solid rgba(255, 255, 255, 0.4);
    border-radius: 2px;
    background: rgba(0, 0, 0, 0.4);

    &::after {
      content: "";
      position: absolute;
      right: -3px;
      top: 2px;
      width: 2px;
      height: 8px;
      background: rgba(255, 255, 255, 0.4);
      border-radius: 0 1px 1px 0;
    }

    .battery-level {
      height: 100%;
      border-radius: 1px;
      transition: width 0.3s ease;
    }

    &.battery-green .battery-level {
      background: $accent-green;
      box-shadow: inset 0 0 4px rgba($accent-green, 0.5);
    }

    &.battery-yellow .battery-level {
      background: $accent-yellow;
      box-shadow: inset 0 0 4px rgba($accent-yellow, 0.5);
    }

    &.battery-orange .battery-level {
      background: #fb923c;
      box-shadow: inset 0 0 4px rgba(#fb923c, 0.5);
    }

    &.battery-red .battery-level {
      background: $accent-red;
      box-shadow: inset 0 0 4px rgba($accent-red, 0.5);
    }
  }

  .battery-text {
    font-size: 12px;
    color: $text-secondary;
    font-weight: 600;
  }
}

// Fleet Badge
.fleet-badge {
  padding: 3px 8px;
  border-radius: 5px;
  font-size: 10px;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.2);
  max-width: 80px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

// Connection Status
.connection-status {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 500;

  &.connection-online {
    color: $accent-green;

    img {
      filter: brightness(0) saturate(100%) invert(68%) sepia(78%) saturate(407%) hue-rotate(81deg) brightness(93%)
        contrast(89%);
    }
  }

  &.connection-offline {
    color: $text-muted;

    img {
      opacity: 0.8;
    }
  }

  img {
    width: $icon-size;
    height: $icon-size;
  }
}

// Second Row
.mission-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 7px;
  gap: 10px;
  flex: 1;
  height: 50%;
}

.mission-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.mission-status {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;

  &.mission-active {
    img {
      width: $icon-size;
      height: $icon-size;
    }

    .mission-name {
      color: $text-primary;
      font-weight: 600;
      margin: 0;
      font-size: 14px;
      color: $text-primary;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.1;
      max-width: 140px; // Ograniczenie szerokości dla długich nazw
    }
  }

  &.mission-idle {
    img {
      opacity: 0.8;
    }

    .mission-name {
      color: $text-muted;
    }
  }

  img {
    width: $icon-size;
    height: $icon-size;
  }

  .mission-name {
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px; // Ograniczenie szerokości dla długich nazw programów
  }
}

.mission-time {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: $text-secondary;
  font-weight: 500;
  font-family: "SF Mono", Monaco, monospace;

  .time-icon {
    width: 12px;
    height: 12px;
    filter: brightness(0) invert(1);
    opacity: 0.6;
  }
  .active-time-icon {
    width: 12px;
    height: 12px;
  }
}

.mission-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

// Action Badge
.action-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  color: white;

  img {
    width: 14px;
    height: 14px;
    filter: brightness(0) invert(1);
  }

  &.action-goto {
    background: rgba($accent-blue, 0.9);
    box-shadow: 0 2px 8px rgba($accent-blue, 0.3);
  }

  &.action-goload {
    background: rgba($accent-green, 0.9);
    box-shadow: 0 2px 8px rgba($accent-green, 0.3);
  }

  &.action-gounload {
    background: rgba(#fb923c, 0.9);
    box-shadow: 0 2px 8px rgba(#fb923c, 0.3);
  }

  &.action-gocharging {
    background: rgba($accent-yellow, 0.9);
    box-shadow: 0 2px 8px rgba($accent-yellow, 0.3);
  }
}

// Cargo Indicator
.cargo-indicator {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;

  img {
    width: 16px;
    height: 16px;
  }

  &.cargo-loaded {
    background: rgba($accent-green, 0.3);
    color: $accent-green;

    img {
      filter: brightness(0) saturate(100%) invert(68%) sepia(78%) saturate(407%) hue-rotate(81deg) brightness(93%)
        contrast(89%);
    }
  }

  &.cargo-empty {
    background: rgba(255, 255, 255, 0.2);
    color: $text-muted;

    img {
      filter: brightness(0) invert(1);
      opacity: 0.5;
    }
  }
}

// Responsive - dostosowanie do minimalnej szerokości 350px
@media (max-width: 400px) {
  .robot-row {
    gap: 8px;

    .robot-info {
      .robot-name {
        font-size: 13px !important;
      }
    }
  }

  .robot-stats {
    gap: 8px;

    .fleet-badge {
      display: none; // Ukryj badge floty na małych ekranach dla oszczędności miejsca
    }
  }

  .mission-row {
    gap: 8px;
  }

  .mission-info {
    gap: 10px;

    .mission-name {
      font-size: 12px !important;
    }
  }

  .mission-actions {
    gap: 6px;

    .action-badge span {
      display: none; // Pokazuj tylko ikonę akcji
    }
  }
}
</style>
