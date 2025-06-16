<template>
  <div ref="mapContainer" class="map-content"></div>
</template>

<script>
import { useMapPointsStore } from "@/stores/external/mapPoints.js";
import * as PIXI from "pixi.js";
import MapImage from "./files/map.png";
import RobotImage from "./files/robot.png";

export default {
  name: "MapContent",
  setup() {
    const mapPointsStore = useMapPointsStore();
    return { mapPointsStore };
  },
  data() {
    return {
      app: null,
      mapTexture: null,
      robotTexture: null,
      robotSprite: null,
      mapSprite: null,
      currentPathIndex: 0,
      isMoving: false,
      mapResolution: 0.05,
      originX: 17.6,
      originY: -70,
      resizeObserver: null,
      mapContainer: null,
      isDragging: false,
      lastPointerPosition: { x: 0, y: 0 },
    };
  },
  computed: {
    mapPoints() {
      if (!this.mapPointsStore.facilityData?.spots) return [];
      console.log(this.mapPointsStore.facilityData.spots);
      return Object.entries(this.mapPointsStore.facilityData.spots).map(([key, spot]) => ({
        id: key,
        name: spot.name || key,
        x: this.worldToPixel(spot.entrance.position.x, spot.entrance.position.y).x,
        y: this.worldToPixel(spot.entrance.position.x, spot.entrance.position.y).y,
        worldX: spot.entrance.position.x,
        worldY: spot.entrance.position.y,
        worldZ: spot.entrance.position.z,
        orientation: spot.entrance.orientation,
      }));
    },
  },
  watch: {
    "mapPointsStore.facilityData": {
      handler() {
        if (this.mapPointsStore.facilityData && this.app) {
          this.updateMapPoints();
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.initPixi();
  },
  beforeUnmount() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    window.removeEventListener("resize", this.handleResize);
    if (this.app) {
      this.app.destroy(true);
    }
  },
  methods: {
    // Convert world coordinates to pixel coordinates
    worldToPixel(worldX, worldY) {
      console.log(this.originX, this.originY, this.mapResolution);
      const pixelX = (worldX + this.originX) / this.mapResolution;
      const pixelY = this.mapTexture.height - (worldY - this.originY) / this.mapResolution;
      return { x: pixelX, y: pixelY };
    },

    async initPixi() {
      this.app = new PIXI.Application();

      await this.app.init({
        width: this.$refs.mapContainer.offsetWidth,
        height: this.$refs.mapContainer.offsetHeight,
        backgroundColor: 0x808080,
        antialias: true,
      });

      this.$refs.mapContainer.appendChild(this.app.canvas);

      this.mapContainer = new PIXI.Container({ scale: 1 });
      this.app.stage.addChild(this.mapContainer);

      await this.loadAssets();
      this.createMap();

      // Create points from store if data is already loaded
      if (this.mapPointsStore.facilityData) {
        this.createPointsFromStore();
      }

      this.createRobot();
      this.setupResize();
      this.setupPanZoom();
    },

    async loadAssets() {
      const map = await PIXI.Assets.load(MapImage);
      const robot = await PIXI.Assets.load(RobotImage);
      this.mapTexture = map;
      this.robotTexture = robot;
    },

    createMap() {
      if (this.mapTexture) {
        const mapSprite = PIXI.Sprite.from(this.mapTexture);
        mapSprite.label = "map";
        console.log(this.mapTexture);
        mapSprite.width = this.mapTexture.width;
        mapSprite.height = this.mapTexture.height;

        this.mapContainer.addChild(mapSprite);
      }
    },

    createPointsFromStore() {
      // Clear existing points
      this.clearPoints();

      this.mapPoints.forEach((point) => {
        // Create circle for point
        const circle = new PIXI.Graphics();
        circle.circle(0, 0, 8).fill(0x000000);
        circle.x = point.x;
        circle.y = point.y;
        circle.label = `point_${point.id}`;
        this.mapContainer.addChild(circle);

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
        this.mapContainer.addChild(label);
      });
    },

    clearPoints() {
      // Remove existing points and labels
      const toRemove = this.mapContainer.children.filter(
        (child) => child.label && (child.label.startsWith("point_") || child.label.startsWith("label_")),
      );
      toRemove.forEach((child) => this.mapContainer.removeChild(child));
    },

    updateMapPoints() {
      if (this.app && this.mapContainer) {
        this.createPointsFromStore();
      }
    },

    createRobot() {
      if (this.robotTexture && this.mapPoints.length > 0) {
        this.robotSprite = PIXI.Sprite.from(this.robotTexture);
        this.robotSprite.anchor.set(0.5, 0.5);
        this.robotSprite.width = 20;
        this.robotSprite.height = 20;

        // Start at first point
        const firstPoint = this.mapPoints[0];
        this.robotSprite.x = firstPoint.x;
        this.robotSprite.y = firstPoint.y;

        this.mapContainer.addChild(this.robotSprite);
      }
    },

    setupResize() {
      this.resizeObserver = new ResizeObserver(() => {
        this.handleResize();
      });
      this.resizeObserver.observe(this.$refs.mapContainer);
      window.addEventListener("resize", this.handleResize);
    },

    handleResize() {
      if (!this.app || !this.$refs.mapContainer) return;

      const containerWidth = this.$refs.mapContainer.offsetWidth;
      const containerHeight = this.$refs.mapContainer.offsetHeight;

      if (containerWidth === this.app.screen.width && containerHeight === this.app.screen.height) {
        return;
      }

      this.app.renderer.resize(containerWidth, containerHeight);
    },

    setupPanZoom() {
      this.app.stage.eventMode = "static";
      this.app.stage.hitArea = this.app.screen;

      // Mouse wheel zoom
      this.app.canvas.addEventListener("wheel", (e) => {
        e.preventDefault();

        if (!this.mapContainer || this.mapContainer.children.length === 0) return;

        const pointer = { x: e.offsetX, y: e.offsetY };
        const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;

        const worldPos = {
          x: (pointer.x - this.mapContainer.x) / this.mapContainer.scale.x,
          y: (pointer.y - this.mapContainer.y) / this.mapContainer.scale.y,
        };

        this.mapContainer.scale.x *= zoomFactor;
        this.mapContainer.scale.y *= zoomFactor;

        this.mapContainer.scale.x = Math.max(0.1, Math.min(3, this.mapContainer.scale.x));
        this.mapContainer.scale.y = Math.max(0.1, Math.min(3, this.mapContainer.scale.y));

        this.mapContainer.x = pointer.x - worldPos.x * this.mapContainer.scale.x;
        this.mapContainer.y = pointer.y - worldPos.y * this.mapContainer.scale.y;
      });

      // Mouse drag pan
      this.app.stage.on("pointerdown", (e) => {
        this.isDragging = true;
        this.lastPointerPosition = { x: e.globalX, y: e.globalY };
      });

      this.app.stage.on("pointermove", (e) => {
        if (this.isDragging) {
          const deltaX = e.globalX - this.lastPointerPosition.x;
          const deltaY = e.globalY - this.lastPointerPosition.y;

          this.mapContainer.x += deltaX;
          this.mapContainer.y += deltaY;

          this.lastPointerPosition = { x: e.globalX, y: e.globalY };
        }
      });

      this.app.stage.on("pointerup", () => {
        this.isDragging = false;
      });

      this.app.stage.on("pointerupoutside", () => {
        this.isDragging = false;
      });
    },
  },
};
</script>

<style scoped lang="scss">
@use "@/assets/styles/abstracts/_colors.module.scss" as colors;

.map-content {
  width: 100%;
  height: 100%;
  position: relative;
  background: #808080;
}
</style>
