<template>
  <div ref="mapContainer" class="map-content" :style="cursorStyle"></div>
</template>

<script>
import { useAreaDataStore } from "@/stores/common/areaData/store.js";
import * as PIXI from "pixi.js";
import MapImage from "./files/map.png";
import RobotImage from "./files/robot.png";
import { mockAreas } from "./mockDataArea.js";

export default {
  name: "MapContent",
  setup() {
    const areaDataStore = useAreaDataStore();

    return { areaDataStore };
  },
  data() {
    return {
      // PIXI App instance
      app: null,

      // Textures and sprites
      mapTexture: null,
      robotTexture: null,
      robotSprite: null,
      mapSprite: null,

      // Robot movement
      currentPathIndex: 0,
      isMoving: false,

      // Container and interaction
      mapContainer: null,
      isDragging: false,
      lastPointerPosition: { x: 0, y: 0 },

      // Observers
      resizeObserver: null,
      originalCursor: null,
      visibleElements: new Set(),
      cullThrottle: null,
    };
  },

  computed: {
    mapResolution() {
      return mockAreas.find((x) => x.name === this.areaDataStore.areaName).mapResolution;
    },
    originX() {
      return mockAreas.find((x) => x.name === this.areaDataStore.areaName).originX;
    },
    originY() {
      return mockAreas.find((x) => x.name === this.areaDataStore.areaName).originY;
    },
    cursorStyle() {
      if (this.isDragging) {
        return "cursor: grabbing";
      }
      return "cursor: default";
    },
    mapPoints() {
      if (!this.areaDataStore.areaMapPoints?.spots) return [];

      return Object.entries(this.areaDataStore.areaMapPoints.spots).map(([_, spot]) => {
        const pixelCoords = this.worldToPixel(spot.entrance.position.x, spot.entrance.position.y);

        return {
          id: spot.id,
          name: spot.name,
          x: pixelCoords.x,
          y: pixelCoords.y,
          worldX: spot.entrance.position.x,
          worldY: spot.entrance.position.y,
          worldZ: spot.entrance.position.z,
          orientation: spot.entrance.orientation,
        };
      });
    },
  },

  watch: {
    "areaDataStore.areaMapPoints": {
      handler() {
        if (this.areaDataStore.areaMapPoints && this.app) {
          this.updateMapPoints();
        }
      },
      deep: true,
    },
  },

  async mounted() {
    await this.initPixi();
    await this.areaDataStore.getAreaMapPoints(this.areaDataStore.areaName);
  },

  beforeUnmount() {
    this.cleanup();
  },

  methods: {
    getVisibleBounds() {
      const padding = 100; // buffer
      return {
        left: -this.mapContainer.x / this.mapContainer.scale.x - padding,
        right: (-this.mapContainer.x + this.app.screen.width) / this.mapContainer.scale.x + padding,
        top: -this.mapContainer.y / this.mapContainer.scale.y - padding,
        bottom: (-this.mapContainer.y + this.app.screen.height) / this.mapContainer.scale.y + padding,
      };
    },
    isElementVisible(element, bounds) {
      return (
        element.x >= bounds.left && element.x <= bounds.right && element.y >= bounds.top && element.y <= bounds.bottom
      );
    },
    // === COORDINATE CONVERSION ===
    worldToPixel(worldX, worldY) {
      const pixelX = (worldX + this.originX) / this.mapResolution;
      const pixelY = this.mapTexture.height - (worldY - this.originY) / this.mapResolution;
      return { x: pixelX, y: pixelY };
    },

    // === INITIALIZATION ===
    async initPixi() {
      await this.createApplication();
      await this.loadAssets();
      this.createMap();
      this.handleInitialData();
      this.createRobot();
      this.setupInteractions();
      this.startRobotMovement();
    },

    async createApplication() {
      this.app = new PIXI.Application();
      await this.app.init({
        width: this.$refs.mapContainer.offsetWidth,
        height: this.$refs.mapContainer.offsetHeight,
        backgroundColor: 0x808080,
        antialias: true,
        preference: "webgl",
        powerPreference: "high-performance",
      });

      this.$refs.mapContainer.appendChild(this.app.canvas);

      this.mapContainer = new PIXI.Container({
        scale: 1,
        isRenderGroup: true,
        cullable: true,
        eventMode: "passive",
      });
      this.app.stage.addChild(this.mapContainer);
    },

    async loadAssets() {
      const [mapTexture, robotTexture] = await Promise.all([PIXI.Assets.load(MapImage), PIXI.Assets.load(RobotImage)]);

      this.mapTexture = mapTexture;
      this.robotTexture = robotTexture;
    },

    // === MAP CREATION ===
    createMap() {
      if (!this.mapTexture) return;

      const mapSprite = PIXI.Sprite.from(this.mapTexture);
      mapSprite.label = "map";
      mapSprite.width = this.mapTexture.width;
      mapSprite.height = this.mapTexture.height;

      this.mapSprite = mapSprite;
      this.mapContainer.addChild(mapSprite);
    },

    // === POINTS MANAGEMENT ===
    handleInitialData() {
      if (this.areaDataStore.areaMapPoints) {
        this.drawPoints();
        this.drawPaths();
      }
    },

    drawPoints() {
      this.clearExistingPoints();

      this.mapPoints.forEach((point) => {
        this.createPointSprite(point);
      });
    },

    clearExistingPoints() {
      const pointsToRemove = this.mapContainer.children.filter(
        (child) => child.label && child.label.startsWith("point"),
      );
      pointsToRemove.forEach((point) => this.mapContainer.removeChild(point));
    },

    createPointSprite(point) {
      if (!this.pointsContainer) {
        this.pointsContainer = new PIXI.Container({ isRenderGroup: true, cullable: true, cullableChildren: false });
        this.mapContainer.addChild(this.pointsContainer);
      }
      const context = new PIXI.GraphicsContext().circle(0, 0, 8).fill("red");
      const pointGraphics = new PIXI.Graphics(context, {
        label: `point_${point.id}`,
      });
      pointGraphics.position.set(point.x, point.y);

      this.pointsContainer.addChild(pointGraphics);
      // Create label
      const label = new PIXI.BitmapText({
        text: point.name,
        position: { x: point.x, y: point.y },
        anchor: { x: -0.2, y: -0.2 },
        style: {
          fontName: "Arial",
          fontSize: 12,
          fill: "black",
        },
      });
      label.label = `label_${point.id}`;

      this.setupPointInteraction(pointGraphics);
      this.pointsContainer.addChild(label);
    },

    setupPointInteraction(pointGraphics) {
      pointGraphics.on("pointerover", () => {
        console.log(pointGraphics);
        pointGraphics.clear();
        pointGraphics.circle(0, 0, 10);
        pointGraphics.fill(0x00ff00);
      });

      pointGraphics.on("pointerout", () => {
        pointGraphics.clear();
        pointGraphics.circle(0, 0, 8);
        pointGraphics.fill(0xff0000);
      });
    },

    updateMapPoints() {
      this.drawPoints();
      this.drawPaths();
    },

    // === ROBOT MANAGEMENT ===
    createRobot() {
      if (!this.robotTexture || !this.mapPoints.length) return;

      this.robotSprite = PIXI.Sprite.from(this.robotTexture);
      this.robotSprite.anchor.set(0.5);
      this.robotSprite.width = 110;
      this.robotSprite.height = 50;
      this.robotSprite.label = "robot";

      const firstPoint = this.mapPoints[0];
      this.robotSprite.x = firstPoint.x;
      this.robotSprite.y = firstPoint.y;

      this.mapContainer.addChild(this.robotSprite);
    },

    startRobotMovement() {
      if (!this.robotSprite || this.mapPoints.length < 2) return;

      this.moveRobotToNextPoint();
    },

    moveRobotToNextPoint() {
      if (this.isMoving || !this.robotSprite) return;

      const nextIndex = (this.currentPathIndex + 1) % this.mapPoints.length;
      const targetPoint = this.mapPoints[nextIndex];

      this.isMoving = true;

      this.animateRobotToPoint(targetPoint, () => {
        this.currentPathIndex = nextIndex;
        this.isMoving = false;

        setTimeout(() => this.moveRobotToNextPoint(), 2000);
      });
    },

    animateRobotToPoint(targetPoint, onComplete) {
      const startX = this.robotSprite.x;
      const startY = this.robotSprite.y;
      const duration = 3000;
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = this.easeInOutQuad(progress);

        this.robotSprite.x = startX + (targetPoint.x - startX) * easeProgress;
        this.robotSprite.y = startY + (targetPoint.y - startY) * easeProgress;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          onComplete?.();
        }
      };

      requestAnimationFrame(animate);
    },

    // === PATH DRAWING ===
    drawPaths() {
      this.clearExistingPaths();

      // Pobierz connections z mockData lub store
      const connections = this.areaDataStore.areaMapPoints?.transitions || [];

      connections.forEach((connection) => {
        const fromPoint = this.mapPoints.find((p) => p.id === connection.startSpotId);
        const toPoint = this.mapPoints.find((p) => p.id === connection.endSpotId);

        if (fromPoint && toPoint) {
          const line = new PIXI.Graphics();
          line.moveTo(fromPoint.x, fromPoint.y).lineTo(toPoint.x, toPoint.y).stroke({ width: 2, color: 0x0066cc });

          line.label = `path_${connection.from}_${connection.to}`;
          this.mapContainer.addChild(line);
        }
      });
    },

    clearExistingPaths() {
      const pathsToRemove = this.mapContainer.children.filter((child) => child.label === "paths");
      pathsToRemove.forEach((path) => this.mapContainer.removeChild(path));
    },

    // === INTERACTIONS SETUP ===
    setupInteractions() {
      this.setupResize();
      this.setupPanZoom();
    },

    setupResize() {
      this.resizeObserver = new ResizeObserver(() => {
        this.handleResize();
      });
      this.resizeObserver.observe(this.$refs.mapContainer);

      window.addEventListener("resize", this.handleResize);
    },

    setupPanZoom() {
      this.app.stage.eventMode = "static";
      this.app.stage.hitArea = this.app.screen;

      this.app.stage.on("pointerdown", this.onDragStart);
      this.app.stage.on("pointermove", this.onDragMove);
      this.app.stage.on("pointerup", this.onDragEnd);
      this.app.stage.on("pointerupoutside", this.onDragEnd);
      this.app.stage.on("wheel", this.onWheel);
    },

    // === EVENT HANDLERS ===
    handleResize() {
      if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        if (!this.app || !this.$refs.mapContainer) return;
        this.app.renderer.resize(this.$refs.mapContainer.offsetWidth, this.$refs.mapContainer.offsetHeight);
      }, 16); // ~60fps
    },

    onDragStart(event) {
      this.isDragging = true;
      this.lastPointerPosition = {
        x: event.global.x,
        y: event.global.y,
      };
    },

    onDragMove(event) {
      if (!this.isDragging) return;

      const deltaX = event.global.x - this.lastPointerPosition.x;
      const deltaY = event.global.y - this.lastPointerPosition.y;

      this.mapContainer.x += deltaX;
      this.mapContainer.y += deltaY;

      this.lastPointerPosition = { x: event.global.x, y: event.global.y };
      console.log("XD");
    },

    onDragEnd() {
      this.isDragging = false;
    },

    onWheel(event) {
      event.preventDefault();

      const scaleFactor = event.deltaY > 0 ? 0.9 : 1.1;
      const newScale = this.mapContainer.scale.x * scaleFactor;

      if (newScale < 0.1 || newScale > 5) return;

      const mousePosition = this.app.stage.toLocal(event.global);

      this.mapContainer.scale.set(newScale);

      const newMousePosition = this.app.stage.toLocal(event.global);
      this.mapContainer.x += (mousePosition.x - newMousePosition.x) * newScale;
      this.mapContainer.y += (mousePosition.y - newMousePosition.y) * newScale;
    },

    // === UTILITY FUNCTIONS ===
    easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },

    // === CLEANUP ===
    cleanup() {
      if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
      if (this.resizeFrame) cancelAnimationFrame(this.resizeFrame);
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }

      window.removeEventListener("resize", this.handleResize);

      if (this.app) {
        this.app.destroy(true);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.map-content {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
