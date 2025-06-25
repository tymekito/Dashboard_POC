<template>
  <div class="selector-overlay">
    <v-dialog
      v-if="shouldDisplay"
      :retain-focus="false"
      v-model="dialog"
      persistent
      max-width="1000px"
      min-width="500px"
      class="dashboard-selector-dialog"
    >
      <v-card class="selector-card">
        <v-card-title class="selector-header">
          <h2 class="selector-title">{{ translations.title }}</h2>
        </v-card-title>

        <v-card-text class="selector-content">
          <TextField
            v-model="searchQuery"
            :label="translations.searchLabel"
            variant="outlined"
            :clearable="true"
            :color="colors.lightBlue"
            :base-color="colors.lightBlue"
            field-class="search-field"
            @input="filterAreas"
          />

          <div class="list-container">
            <v-list class="area-list" bg-color="transparent">
              <v-list-item
                v-for="area in displayedAreas"
                :key="area.id"
                :value="area.id"
                @click="selectArea(area)"
                :class="{ selected: selectedArea?.id === area.id }"
                class="area-item"
                rounded
              >
                <v-list-item-title class="area-name">{{ area.name }}</v-list-item-title>
                <v-list-item-subtitle class="area-description">({{ area.description }})</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </div>
        </v-card-text>

        <v-card-actions class="selector-actions">
          <v-spacer />
          <TextButton
            :disabled="!selectedArea"
            :label="translations.confirmText"
            :color="colors.green"
            :min-width="100"
            :min-height="40"
            @onClickAction="confirmSelection"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import colors from "@/assets/styles/abstracts/_colors.module.scss";
import TextButton from "@/components/common/TextButton/index.vue";
import TextField from "@/components/common/TextField/index.vue";
import { translationFormatter } from "@/services/translations/translation-service.js";
import { mockAreas } from "./mockData.js";

export default {
  name: "DashboardSelector",

  components: {
    TextButton,
    TextField,
  },

  data() {
    return {
      dialog: true,
      searchQuery: "",
      areas: mockAreas,
      filteredAreas: [],
      selectedArea: null,
      colors,
    };
  },

  computed: {
    shouldDisplay() {
      return this.areas.length !== 1;
    },
    translations() {
      return {
        title: translationFormatter("views.dashboard-selector.title"),
        searchLabel: `${translationFormatter("views.dashboard-selector.search")}...`,
        confirmText: translationFormatter("views.dashboard-selector.confirm"),
      };
    },
    displayedAreas() {
      // Jeśli mamy wybrany element i nie jest w filtrowanej liście, dodajemy go
      if (this.selectedArea && !this.filteredAreas.some((area) => area.id === this.selectedArea.id)) {
        return [this.selectedArea, ...this.filteredAreas];
      }
      return this.filteredAreas;
    },
  },

  beforeMount() {
    if (this.areas.length === 1) {
      this.selectedArea = this.areas[0];
      this.confirmSelection();
    }
  },
  mounted() {
    this.filteredAreas = [...this.areas];
  },

  methods: {
    filterAreas() {
      if (!this.searchQuery) {
        this.filteredAreas = [...this.areas];
        return;
      }

      const query = this.searchQuery.toLowerCase();
      this.filteredAreas = this.areas.filter(
        (area) => area.name.toLowerCase().includes(query) || area.description.toLowerCase().includes(query),
      );
    },

    selectArea(area) {
      if (this.selectedArea?.id === area.id) {
        this.selectedArea = null;
      } else {
        this.selectedArea = area;
      }
    },

    confirmSelection() {
      if (this.selectedArea) {
        const baseUrl = window.location.origin;
        const targetUrl = `${baseUrl}/area/${this.selectedArea.name}`;
        // Open new instance of the app with clean context in the same tab
        window.open(targetUrl, "_self");
      }
    },
  },
};
</script>

<style scoped lang="scss">
@use "@/assets/styles/abstracts/_colors.module.scss" as colors;

.selector-overlay {
  width: 100vw;
  height: 100vh;
  background-color: colors.$darkBlue;
}

:deep(.dashboard-selector-dialog) {
  .v-overlay__content {
    margin: 0 !important;
    position: static !important;
  }
}

.selector-card {
  background-color: colors.$darkBlue !important;
  border: 2px solid colors.$lightBlue !important;
  border-radius: 12px !important;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 0 20px rgba(0, 154, 190, 0.2) !important;
}

.selector-header {
  background-color: colors.$lightBlue !important;
  color: colors.$white !important;
  padding: 20px 24px !important;
  border-radius: 10px 10px 0 0 !important;
  border-bottom: 2px solid colors.$lightBlue !important;
}

.selector-title {
  color: colors.$white !important;
  font-weight: 600;
  font-size: 2rem;
  margin: 0;
}

.selector-content {
  padding: 2.2rem 2.2rem 0.5rem 2.2rem !important;
  background-color: colors.$darkBlue !important;
}

.search-field {
  margin-bottom: 1.5ren;

  :deep(.v-field) {
    background-color: colors.$whiteAlfa05 !important;
    // border: 1px solid colors.$lightBlue !important;
    border-radius: 0.8rem !important;

    .v-label {
      font-size: 1.8rem !important;
    }
    .v-field__input {
      color: colors.$white !important;
    }

    .v-field__outline {
      color: colors.$lightBlue !important;
    }
  }

  :deep(.v-label) {
    color: rgba(255, 255, 255, 0.7) !important;
  }

  :deep(.v-icon) {
    color: colors.$lightBlue !important;
  }
}

.list-container {
  height: 300px;
  overflow: hidden;
}

.area-list {
  height: 100%;
  overflow-y: auto;
  transition: none;
  background: transparent !important;

  .area-item {
    background-color: colors.$whiteAlfa05 !important;
    border: 1px solid colors.$whiteAlfa25 !important;
    border-radius: 8px !important;
    margin-bottom: 8px !important;
    min-height: 72px !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;

    &:hover {
      background-color: colors.$whiteAlfa05 !important;
      border-color: colors.$lightBlue !important;
      transform: translateY(1px);
      box-shadow: 0 4px 12px rgba(0, 154, 190, 0.2);
    }

    &.selected {
      background-color: colors.$whiteAlfa05 !important;
      border: 2px solid colors.$lightBlue !important;
      box-shadow: 0 0 16px rgba(0, 154, 190, 0.4);
    }

    .area-name {
      color: colors.$white !important;
      font-weight: 600 !important;
      font-size: 1.8rem !important;
    }

    .area-description {
      color: colors.$lightGrey !important;
      font-size: 1.2rem !important;
    }
  }
}

.selector-actions {
  padding: 16px 24px 24px 24px !important;
  background-color: colors.$darkBlue !important;
}

// Scrollbar styling
.area-list::-webkit-scrollbar {
  width: 6px;
}

.area-list::-webkit-scrollbar-track {
  background-color: colors.$whiteAlfa05;
  border-radius: 3px;
}

.area-list::-webkit-scrollbar-thumb {
  background-color: colors.$lightBlue;
  border-radius: 3px;

  &:hover {
    background-color: colors.$lightBlue;
  }
}
</style>
