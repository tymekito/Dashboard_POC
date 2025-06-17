<template>
  <div class="right-panel-content">
    <div class="missions-list">
      <div v-for="mission in missions" :key="mission.id" class="mission-item">
        <div
          class="mission-header"
          @click="toggleMission(mission.id)"
          :class="{ expanded: expandedMissions.includes(mission.id) }"
        >
          <span class="mission-name">{{ mission.name }}</span>
          <span class="mission-status" :class="mission.status.toLowerCase()">
            {{ mission.status }}
          </span>
          <span class="expand-icon">
            {{ expandedMissions.includes(mission.id) ? "−" : "+" }}
          </span>
        </div>

        <div v-if="expandedMissions.includes(mission.id)" class="mission-details">
          <div class="detail-row"><strong>Robot:</strong> {{ mission.robot }}</div>
          <div class="detail-row"><strong>Rozpoczęta:</strong> {{ mission.startedAt }}</div>
          <div class="detail-row" v-if="mission.completedAt">
            <strong>Zakończona:</strong> {{ mission.completedAt }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { missions } from "./mockData.js";

export default {
  name: "RightPanel",
  data() {
    return {
      expandedMissions: [],
      missions,
    };
  },
  methods: {
    toggleMission(missionId) {
      const index = this.expandedMissions.indexOf(missionId);
      if (index > -1) {
        this.expandedMissions.splice(index, 1);
      } else {
        this.expandedMissions.push(missionId);
      }
    },
  },
};
</script>

<style scoped lang="scss">
@use "@/assets/styles/abstracts/_colors.module.scss" as colors;

.right-panel-content {
  padding: 0.5rem;
}
.mission-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 8px;
  overflow: hidden;
}

.mission-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  font-size: 1.2rem;
  color: colors.$black;

  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #e9ecef;
  }

  &.expanded {
    background: #e3f2fd;
  }
}

.mission-name {
  flex: 1;
  font-weight: 500;
  max-width: 10rem;
}

.mission-status {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  margin-right: 12px;

  &.aktywna {
    background: #4caf50;
    color: white;
  }

  &.zakończona {
    background: #9e9e9e;
    color: white;
  }

  &.w.trakcie {
    background: #ff9800;
    color: white;
  }

  &.oczekuje {
    background: #2196f3;
    color: white;
  }
}

.expand-icon {
  font-weight: bold;
  font-size: 18px;
  width: 20px;
  text-align: center;
}

.mission-details {
  padding: 16px;
  background: white;
  border-top: 1px solid #e0e0e0;
}

.detail-row {
  font-size: 1.2rem;
  margin-bottom: 8px;
  color: colors.$black;

  &:last-child {
    margin-bottom: 0;
  }

  strong {
    display: inline-block;
    width: 100px;
    color: #666;
  }
}
</style>
