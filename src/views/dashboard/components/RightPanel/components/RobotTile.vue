<template>
  <div class="robot-tile" :style="tileStyle">
    <div class="robot-header-main">
      <div class="robot-type-icon" :class="typeIconClass">
        <img :src="typeIcon" :alt="robot.type" />
      </div>
      <div class="robot-name">
        {{ truncatedName }}
      </div>
      <div class="battery-icon" :class="`battery-${batteryStatus}`">
        <div class="battery-level" :style="batteryLevelStyle"></div>
        <span class="battery-text">{{ robot.battery }}%</span>
      </div>
      <div class="fleet-label" :style="{ backgroundColor: robot.fleet.color }">
        {{ robot.fleet.name }}
      </div>
      <div class="icon-wrapper" :class="wifiClass">
        <img :src="wifiIcon" alt="WiFi" />
      </div>
    </div>
    <div class="robot-details">
      <div class="mission-row">
        <div class="icon-wrapper" :class="missionClass">
          <img :src="missionIcon" />
        </div>
        <div v-if="robot.missionStartTime" class="mission-time">
          {{ robot.programName || "Program" }} ({{ missionExecutionTime }})
        </div>
        <div v-else class="idle-time">({{ idleTime }})</div>
      </div>
      <div v-if="actionIcon" class="action-icon" :class="actionClass">
        <img :src="actionIcon" :alt="robot.currentAction" />
      </div>
      <div class="cargo-icon" :class="cargoClass">
        <img :src="cargoIcon" :alt="cargoText" />
        <span class="cargo-count">{{ robot.cargoCount }}</span>
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

// Ikony typu robota - używamy dostępnych
const TYPE_ICON_MAP = {
  fork: IconType.OPERATIONAL, // Fork używa operational icon
  picker: IconType.GO_TO, // Picker używa target icon
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
      default: 120,
    },
    width: {
      type: Number,
      default: 200,
    },
  },

  data: () => ({
    icons: ICONS,
    maxNameLength: 10,
  }),

  computed: {
    truncatedName() {
      const { name } = this.robot;
      return name.length > this.maxNameLength ? `${name.substring(0, this.maxNameLength)}...` : name;
    },

    typeIcon() {
      const iconKey = TYPE_ICON_MAP[this.robot.type];
      return iconKey ? ICONS[iconKey] : ICONS[IconType.OPERATIONAL];
    },

    typeIconClass() {
      return {
        "type-operational": this.robot.isOperational,
        "type-non-operational": !this.robot.isOperational,
      };
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

    missionExecutionTime() {
      return this.robot.missionStartTime ? this.formatElapsedTime(this.robot.missionExecutionTime) : "";
    },

    missionStartTime() {
      return this.robot.missionStartTime ? this.formatStartTime(this.robot.missionStartTime) : "";
    },

    idleTime() {
      const idleStart = this.robot.lastMissionEnd || this.robot.startTime || new Date();
      return this.formatElapsedTime(idleStart);
    },

    actionIcon() {
      const iconType = ACTION_ICON_MAP[this.robot.currentAction];
      return iconType ? ICONS[iconType] : null;
    },

    actionClass() {
      return `action-${this.robot.currentAction?.toLowerCase() || ""}`;
    },

    cargoIcon() {
      return this.robot.cargoCount > 0 ? ICONS[IconType.GO_LOAD] : ICONS[IconType.GO_UNLOAD];
    },

    cargoClass() {
      return {
        "cargo-loaded": this.robot.cargoCount > 0,
        "cargo-empty": this.robot.cargoCount === 0,
      };
    },

    cargoText() {
      return this.robot.cargoCount > 0 ? `${this.robot.cargoCount} ładunków` : "Brak ładunku";
    },

    tileStyle() {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`,
        fontSize: `${Math.max(10, this.height / 10)}px`,
      };
    },

    operationalIcon() {
      return this.robot.isOperational ? ICONS[IconType.OPERATIONAL] : ICONS[IconType.NOT_OPERATIONAL];
    },

    operationalAlt() {
      return this.robot.isOperational ? "Operational" : "Error";
    },

    wifiClass() {
      return `wifi-${this.robot.isConnected ? "on" : "off"}`;
    },

    wifiIcon() {
      return this.robot.isConnected ? ICONS[IconType.WIFI] : ICONS[IconType.WIFI_OFF];
    },

    missionClass() {
      return `mission-${this.robot.missionStartTime ? "active" : "idle"}`;
    },

    missionIcon() {
      return this.robot.currentAction ? ICONS[IconType.PLAY] : ICONS[IconType.PAUSE];
    },
  },

  methods: {
    formatElapsedTime(startTime) {
      const elapsedSeconds = Math.floor((new Date() - new Date(startTime)) / 1000);
      const hours = Math.floor(elapsedSeconds / 3600);
      const minutes = Math.floor((elapsedSeconds % 3600) / 60);

      if (hours === 0) {
        return `${minutes} m`;
      }

      return `${hours}:${minutes.toString().padStart(2, "0")} h`;
    },

    formatStartTime(startTime) {
      const date = new Date(startTime);
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");

      return `${hours}:${minutes}`;
    },
  },
};
</script>

<style scoped lang="scss">
@use "@/assets/styles/abstracts/_colors.module.scss" as colors;

$tile-title--height: 35px;
$icon-size: 25px;
$small-icon-size: 20px;
$battery-width: 30px;
$battery-height: 16px;
$battery-terminal-width: 2px;
$battery-terminal-height: 6px;
$battery-terminal-offset: 3px;

@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.robot-tile {
  background: linear-gradient(135deg, colors.$whiteAlfa05 0%, colors.$whiteAlfa04 100%);
  border: 1px solid colors.$whiteAlfa25;
  border-radius: 4px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    border-color: colors.$lightBlue;
    box-shadow: 0 2px 8px rgba(0, 154, 190, 0.2);
  }
}

.robot-header-main {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 0.5rem;
  height: $tile-title--height;
  background-color: colors.$lightBlue;
  padding: 0 0.5rem;

  .robot-name {
    color: colors.$white;
    font-weight: 600;
    font-size: 1.2rem;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

// Ikona typu robota w headerze
.robot-type-icon {
  @include flex-center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  flex-shrink: 0;

  &.type-operational {
    background-color: colors.$green;
  }

  &.type-non-operational {
    background-color: colors.$yellow;
  }

  img {
    width: 14px;
    height: 14px;
    filter: brightness(0) invert(1); // Białe ikony
  }
}

// Label floty w headerze
.fleet-label {
  padding: 0.15rem 0.4rem;
  border-radius: 3px;
  color: colors.$white;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  flex-shrink: 0;
}

.robot-details {
  height: calc(100% - $tile-title--height);
  padding: 0 0.5rem;
  row-gap: 0;
  column-gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.25rem;
  @include flex-center;
}

.robot-status {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  gap: 0.5rem;
  height: 50%;
  margin-top: 0.1rem;
}

.icon-wrapper {
  @include flex-center;
  width: $icon-size;
  height: $icon-size;

  img {
    width: $icon-size;
    height: $icon-size;
  }

  &.status-ok img {
    fill: colors.$green;
  }

  &.status-error img {
    fill: colors.$red;
  }

  &.wifi-on img {
    fill: colors.$green;
  }

  &.wifi-off img {
    fill: colors.$red;
  }

  &.mission-active img {
    fill: colors.$yellow;
  }

  &.mission-idle img {
    fill: colors.$whiteAlfa60;
  }
}

.battery-icon {
  position: relative;
  min-width: $battery-width;
  height: $battery-height;
  margin: 4.5px 0;
  border: 1px solid colors.$whiteAlfa60;
  border-radius: 2px;
  background: colors.$darkBlue;

  &::after {
    content: "";
    position: absolute;
    right: -$battery-terminal-offset;
    top: calc(50% - #{$battery-terminal-height} / 2);
    width: $battery-terminal-width;
    height: $battery-terminal-height;
    background: colors.$whiteAlfa60;
    border-radius: 0 1px 1px 0;
  }

  .battery-level {
    height: 100%;
    border-radius: 1px;
    transition: width 0.3s ease;
  }

  .battery-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -55%);
    font-size: 1.1rem;
    color: colors.$white;
  }

  &.battery-green .battery-level {
    background: colors.$green;
  }

  &.battery-yellow .battery-level {
    background: colors.$yellow;
  }

  &.battery-orange .battery-level {
    background: colors.$orange;
  }

  &.battery-red .battery-level {
    background: colors.$red;
  }
}

.action-section {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  gap: 1rem;
  height: 50%;
  padding-bottom: 0.1rem;
}

.action-icon {
  @include flex-center;
  border-radius: 6px;
  min-width: 20px;
  min-height: 20px;

  img {
    width: $small-icon-size;
    height: $small-icon-size;
    fill: white;
  }

  &.action-goto {
    background: colors.$blue;
  }

  &.action-goload {
    background: colors.$green;
  }

  &.action-gounload {
    background: colors.$orange;
  }

  &.action-gocharging {
    background: colors.$yellow;
  }
}

// Ikona ładunku w statusie
.cargo-icon {
  @include flex-center;
  position: relative;
  border-radius: 6px;
  min-width: 20px;
  min-height: 20px;

  img {
    width: $small-icon-size;
    height: $small-icon-size;
  }

  .cargo-count {
    position: absolute;
    top: -6px;
    right: -6px;
    background: colors.$white;
    color: colors.$black;
    font-size: 1rem;
    border-radius: 50%;
    min-width: 14px;
    height: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  &.cargo-loaded {
    background: colors.$green;
    img {
      filter: brightness(0) invert(1);
    }
  }

  &.cargo-empty {
    background: colors.$whiteAlfa25;
    img {
      filter: brightness(0) saturate(100%) invert(100%);
    }
  }
}

.mission-row {
  display: flex;
  align-items: center;
  gap: 4px;

  .mission-time,
  .idle-time {
    color: colors.$white;
    font-family: monospace;
    font-size: 1.1rem;
    font-weight: 500;
    text-wrap: wrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .idle-time {
    color: colors.$white;
  }
}

.operational-row {
  display: flex;
  align-items: center;
}
</style>
