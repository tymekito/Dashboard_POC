<template>
  <div class="mission-tile" :style="tileStyle">
    <div class="mission-header">
      <div class="program-name">
        {{ mission.programName }}
        <div v-if="mission.isService" class="service-icon">
          <img :src="icons.service" />
        </div>
        <div class="created-time">Created {{ formatTime(mission.createdTime) }}</div>
      </div>
    </div>
    <div class="mission-content">
      <div class="robot-section">
        <span class="robot-icon"> <img :src="icons.robot" /> </span>
        <span class="robot-name">{{ mission.robotName }}</span>
      </div>
      <div class="time-section">
        <div class="start-time">Start {{ formatTime(mission.startTime) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import ServiceIcon from "@/assets/icons/cog-icon.svg";
import RobotIcon from "@/assets/icons/robot-icon.svg";

export default {
  name: "MissionTile",
  props: {
    mission: {
      type: Object,
      required: true,
    },
    height: {
      type: Number,
      default: 120,
    },
  },

  data: () => ({
    icons: {
      service: ServiceIcon,
      robot: RobotIcon,
    },
  }),

  computed: {
    tileStyle() {
      return {
        height: `${this.height}px`,
        fontSize: `${Math.max(10, this.height / 10)}px`,
      };
    },
  },

  methods: {
    formatTime(timestamp) {
      const date = new Date(timestamp);
      return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    },
  },
};
</script>

<style scoped lang="scss">
@use "@/assets/styles/abstracts/_colors.module.scss" as colors;

$header-height: 25px;
$icon-size: 20px;

@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.mission-tile {
  background: linear-gradient(135deg, colors.$whiteAlfa05 0%, colors.$whiteAlfa04 100%);
  border: 1px solid colors.$whiteAlfa25;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: colors.$lightBlue;
    box-shadow: 0 2px 8px rgba(0, 154, 190, 0.2);
  }
}

.mission-header {
  @include flex-center;
  background-color: colors.$lightBlue;
  min-height: $header-height;
  gap: 1rem;

  .program-name {
    @include flex-center;
    color: colors.$white;
    font-weight: 600;
    font-size: 1.4rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    .created-time {
      margin-left: 1rem;
    }
  }

  .service-icon {
    margin-left: 1rem;
    width: $icon-size;
    height: $icon-size;

    img {
      width: $icon-size;
      height: $icon-size;
      filter: invert(84%) sepia(51%) saturate(1434%) hue-rotate(358deg) brightness(103%) contrast(104%);
    }
  }
}

.mission-content {
  flex: 1;
  padding: 0.5rem 0.75rem 0 0.75rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.5rem;
  height: calc(100% - $header-height);
}

.robot-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .robot-icon {
    width: $icon-size;
    height: $icon-size;
  }

  .robot-name {
    color: colors.$lightBlue;
    font-weight: 500;
    font-size: 1.4rem;
  }
}

.time-section {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;

  .start-time {
    color: colors.$green;
    font-weight: 600;
    font-size: 1.4rem;
  }

  .created-time {
    color: colors.$whiteAlfa60;
    font-size: 1.1rem;
    margin-left: 1rem;
  }
}
</style>
