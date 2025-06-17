<template>
  <div>
    <!-- Collapsed Icon -->
    <div
      v-if="isCollapsed"
      class="legend-collapsed-icon"
      @click="showLegend"
      :style="{ left: iconPosition.x + 'px', top: iconPosition.y + 'px' }"
      @mousedown="startIconDrag"
    >
      📋
    </div>

    <!-- Full Legend Panel -->
    <div
      v-else
      class="bottom-panel"
      :class="{ hover: isHovered, dragging: isDragging }"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      :style="{
        left: position.x + 'px',
        top: position.y + 'px',
        width: panelSize.width + 'px',
        height: panelSize.height + 'px',
      }"
    >
      <!-- Resize Handles -->
      <div class="resize-handle resize-n" @mousedown="startResize($event, 'n')"></div>
      <div class="resize-handle resize-s" @mousedown="startResize($event, 's')"></div>
      <div class="resize-handle resize-e" @mousedown="startResize($event, 'e')"></div>
      <div class="resize-handle resize-w" @mousedown="startResize($event, 'w')"></div>
      <div class="resize-handle resize-ne" @mousedown="startResize($event, 'ne')"></div>
      <div class="resize-handle resize-nw" @mousedown="startResize($event, 'nw')"></div>
      <div class="resize-handle resize-se" @mousedown="startResize($event, 'se')"></div>
      <div class="resize-handle resize-sw" @mousedown="startResize($event, 'sw')"></div>

      <!-- Header with drag area and close button -->
      <div class="legend-header" @mousedown="startDrag">
        <h3 class="legend-title">Legenda</h3>
        <button class="close-button" @click="hideLegend" @mousedown.stop>✕</button>
      </div>

      <div class="legend-content">
        <div class="legend-items">
          <div
            v-for="item in legendItems"
            :key="item.id"
            class="legend-item"
            :class="{ hidden: hiddenItems.includes(item.id) && !isHovered }"
          >
            <div class="legend-icon">
              <div class="icon" :style="{ backgroundColor: item.color }" v-html="item.icon"></div>
            </div>
            <span class="legend-text">{{ item.name }}</span>
            <div class="legend-checkbox">
              <input
                type="checkbox"
                :id="`legend-${item.id}`"
                :checked="!hiddenItems.includes(item.id)"
                @change="toggleItem(item.id)"
              />
              <label :for="`legend-${item.id}`"></label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { legendData } from "./mockData.js";

export default {
  name: "BottomPanel",
  data() {
    return {
      isHovered: false,
      isCollapsed: false,
      isDragging: false,
      isResizing: false,
      resizeDirection: null,

      // Position and size
      position: { x: 20, y: window.innerHeight - 320 },
      panelSize: { width: 250, height: 280 },
      iconPosition: { x: 20, y: 20 },

      // Size constraints
      minSize: { width: 180, height: 150 },
      maxSize: { width: window.innerWidth, height: 500 },

      // Drag/resize state
      dragStart: { x: 0, y: 0 },
      resizeStart: { x: 0, y: 0, width: 0, height: 0 },

      hiddenItems: [],
      legendItems: legendData.items,
    };
  },
  mounted() {
    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("mouseup", this.handleMouseUp);
    window.addEventListener("resize", this.updateMaxSize);
  },
  beforeUnmount() {
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("mouseup", this.handleMouseUp);
    window.removeEventListener("resize", this.updateMaxSize);
  },
  methods: {
    // Legend show/hide
    showLegend() {
      this.isCollapsed = false;
    },

    hideLegend() {
      this.isCollapsed = true;
    },

    // Dragging
    startDrag(e) {
      this.isDragging = true;
      this.dragStart = {
        x: e.clientX - this.position.x,
        y: e.clientY - this.position.y,
      };
      document.body.style.userSelect = "none";
      e.preventDefault();
    },

    startIconDrag(e) {
      if (e.target === e.currentTarget) return; // Only if clicking the icon itself
      this.isDragging = true;
      this.dragStart = {
        x: e.clientX - this.iconPosition.x,
        y: e.clientY - this.iconPosition.y,
      };
      document.body.style.userSelect = "none";
      e.preventDefault();
    },

    // Resizing
    startResize(e, direction) {
      this.isResizing = true;
      this.resizeDirection = direction;
      this.resizeStart = {
        x: e.clientX,
        y: e.clientY,
        width: this.panelSize.width,
        height: this.panelSize.height,
        posX: this.position.x,
        posY: this.position.y,
      };
      e.preventDefault();
      e.stopPropagation();
    },

    // Mouse events
    handleMouseMove(e) {
      if (this.isDragging && !this.isResizing) {
        if (this.isCollapsed) {
          // Drag icon
          this.iconPosition = {
            x: e.clientX - this.dragStart.x,
            y: e.clientY - this.dragStart.y,
          };
          this.constrainIconPosition();
        } else {
          // Drag panel
          this.position = {
            x: e.clientX - this.dragStart.x,
            y: e.clientY - this.dragStart.y,
          };
          this.constrainPosition();
        }
      } else if (this.isResizing) {
        requestAnimationFrame(() => this.handleResize(e));
      }
    },

    handleMouseUp() {
      this.isDragging = false;
      this.isResizing = false;
      this.resizeDirection = null;
      document.body.style.userSelect = "";
    },

    handleResize(e) {
      const deltaX = e.clientX - this.resizeStart.x;
      const deltaY = e.clientY - this.resizeStart.y;

      let newWidth = this.resizeStart.width;
      let newHeight = this.resizeStart.height;
      let newX = this.resizeStart.posX;
      let newY = this.resizeStart.posY;

      // Handle different resize directions
      if (this.resizeDirection.includes("e")) {
        newWidth = this.resizeStart.width + deltaX;
      }
      if (this.resizeDirection.includes("w")) {
        newWidth = this.resizeStart.width - deltaX;
        newX = this.resizeStart.posX + deltaX;
      }
      if (this.resizeDirection.includes("s")) {
        newHeight = this.resizeStart.height + deltaY;
      }
      if (this.resizeDirection.includes("n")) {
        newHeight = this.resizeStart.height - deltaY;
        newY = this.resizeStart.posY + deltaY;
      }

      // Apply constraints
      newWidth = Math.max(this.minSize.width, Math.min(newWidth, this.maxSize.width));
      newHeight = Math.max(this.minSize.height, Math.min(newHeight, this.maxSize.height));

      // Update if width/height changed due to constraints
      if (this.resizeDirection.includes("w") && newWidth !== this.resizeStart.width - deltaX) {
        newX = this.position.x;
      }
      if (this.resizeDirection.includes("n") && newHeight !== this.resizeStart.height - deltaY) {
        newY = this.position.y;
      }

      this.panelSize = { width: newWidth, height: newHeight };
      this.position = { x: newX, y: newY };

      this.constrainPosition();
    },

    // Position constraints
    constrainPosition() {
      const maxX = window.innerWidth - this.panelSize.width;
      const maxY = window.innerHeight - this.panelSize.height;

      this.position.x = Math.max(0, Math.min(this.position.x, maxX));
      this.position.y = Math.max(0, Math.min(this.position.y, maxY));
    },

    constrainIconPosition() {
      const maxX = window.innerWidth - 50; // Icon width
      const maxY = window.innerHeight - 50; // Icon height

      this.iconPosition.x = Math.max(0, Math.min(this.iconPosition.x, maxX));
      this.iconPosition.y = Math.max(0, Math.min(this.iconPosition.y, maxY));
    },

    updateMaxSize() {
      this.maxSize.width = window.innerWidth;
      this.constrainPosition();
    },

    // Legend functionality
    toggleItem(itemId) {
      const index = this.hiddenItems.indexOf(itemId);
      if (index > -1) {
        this.hiddenItems.splice(index, 1);
      } else {
        this.hiddenItems.push(itemId);
      }
    },
  },
};
</script>

<style scoped lang="scss">
@use "@/assets/styles/abstracts/_colors.module.scss" as colors;

.legend-collapsed-icon {
  position: fixed;
  width: 50px;
  height: 50px;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  border: 2px solid #00bcd4;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  z-index: 1000;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 188, 212, 0.3);
  will-change: transform;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 24px rgba(0, 188, 212, 0.4);
  }
}

.bottom-panel {
  position: fixed;
  background-color: colors.$darkBlue;
  backdrop-filter: blur(10px);
  border: 2px solid #00bcd4;
  border-radius: 12px;
  color: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 188, 212, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  will-change: transform;

  &.hover {
    box-shadow: 0 8px 32px rgba(0, 188, 212, 0.4);
  }

  &.dragging {
    transition: none;
    cursor: move;
    will-change: transform;
  }
}

.legend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: rgba(0, 188, 212, 0.1);
  border-bottom: 1px solid rgba(0, 188, 212, 0.3);
  cursor: move;
  user-select: none;

  .legend-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #00bcd4;
  }

  .close-button {
    background: none;
    border: none;
    color: #00bcd4;
    font-size: 16px;
    cursor: pointer;
    padding: 2px 6px;
    border-radius: 4px;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(244, 67, 54, 0.2);
      color: #f44336;
    }
  }
}

.legend-content {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
}

.legend-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  opacity: 1;

  &.hidden {
    opacity: 0.4;
    text-decoration: line-through;
    display: none;
  }
}

.legend-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  flex-shrink: 0;

  .icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    border: 2px solid rgba(255, 255, 255, 0.3);
  }
}

.legend-text {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  min-width: 0;
}

.legend-checkbox {
  opacity: 0;
  transition: opacity 0.2s ease;
  flex-shrink: 0;

  .bottom-panel.hover & {
    opacity: 1;
  }

  input[type="checkbox"] {
    display: none;
  }

  label {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 2px solid #00bcd4;
    border-radius: 3px;
    cursor: pointer;
    position: relative;
    transition: all 0.2s ease;

    &:hover {
      border-color: #26c6da;
    }

    &::after {
      content: "✓";
      position: absolute;
      top: -2px;
      left: 2px;
      color: #00bcd4;
      font-size: 14px;
      font-weight: bold;
      opacity: 0;
      transition: opacity 0.2s ease;
    }
  }

  input[type="checkbox"]:checked + label::after {
    opacity: 1;
  }
}

// Resize handles
.resize-handle {
  position: absolute;
  background: transparent;

  &:hover {
    background: rgba(0, 188, 212, 0.3);
  }
}

.resize-n,
.resize-s {
  left: 8px;
  right: 8px;
  height: 8px;
  cursor: ns-resize;
}

.resize-e,
.resize-w {
  top: 8px;
  bottom: 8px;
  width: 8px;
  cursor: ew-resize;
}

.resize-n {
  top: -4px;
}
.resize-s {
  bottom: -4px;
}
.resize-e {
  right: -4px;
}
.resize-w {
  left: -4px;
}

.resize-ne,
.resize-nw,
.resize-se,
.resize-sw {
  width: 12px;
  height: 12px;
}

.resize-ne {
  top: -4px;
  right: -4px;
  cursor: ne-resize;
}

.resize-nw {
  top: -4px;
  left: -4px;
  cursor: nw-resize;
}

.resize-se {
  bottom: -4px;
  right: -4px;
  cursor: se-resize;
}

.resize-sw {
  bottom: -4px;
  left: -4px;
  cursor: sw-resize;
}

@media (max-width: 768px) {
  .legend-collapsed-icon {
    width: 45px;
    height: 45px;
    font-size: 20px;
  }

  .bottom-panel {
    min-width: 200px;
    min-height: 150px;
  }

  .legend-content {
    padding: 12px;
  }

  .legend-text {
    font-size: 12px;
  }

  .legend-items {
    grid-template-columns: 1fr;
  }
}
</style>
