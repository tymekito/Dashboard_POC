<template>
  <div ref="mapContainer" class="map-content" :style="cursorStyle"></div>
</template>

<script>
import { useAreaDataStore } from "@/stores/common/dashboard/areaData/store.js";
import { useRobotStore } from "@/stores/common/dashboard/robots/store.js";
import * as PIXI from "pixi.js";
import MapImage from "./files/map.png";
import RobotImage from "./files/robot.png";
import { mockAreas } from "./mockDataArea.js";

export default {
  name: "MapContent",
  setup() {
    const areaDataStore = useAreaDataStore();
    const robotStore = useRobotStore();

    return { areaDataStore, robotStore };
  },
  data() {
    return {
      // PIXI App instance
      app: null,

      // Textures and sprites
      mapTexture: null,
      robotTexture: null,
      robotSprites: [], // Array robotów zamiast pojedynczego
      mapSprite: null,

      // Container and interaction
      mapContainer: null,
      pointsContainer: null,
      cargoContainer: null, // Nowy kontener dla ładunków
      isDragging: false,
      lastPointerPosition: { x: 0, y: 0 },

      // Observers and utilities
      resizeObserver: null,
      resizeTimeout: null,
      dragThrottle: null,
      originalCursor: null,
      visibleElements: new Set(),
      cullThrottle: null,
      pathGenerationInterval: null,
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
    transitions() {
      return this.areaDataStore.areaMapPoints?.transitions || [];
    },
    cursorStyle() {
      if (this.isDragging) {
        return "cursor: grabbing";
      }
      return "cursor: default";
    },
    robotCount() {
      return this.robotStore.robots.length;
    },
    mapPoints() {
      if (!this.areaDataStore.areaMapPoints?.spots) return [];

      return this.areaDataStore.areaMapPoints.spots.map((spot) => {
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
          this.startPathGeneration();
        }
      },
      deep: true,
    },
    robotCount: {
      handler(newCount, oldCount) {
        if (this.app && newCount !== oldCount) {
          this.updateRobots();
        }
      },
    },
    "robotStore.robots": {
      handler() {
        if (this.app) {
          this.updateRobotsCargo();
        }
      },
      deep: true,
    },
  },

  async mounted() {
    await this.initPixi();
  },

  beforeUnmount() {
    this.cleanup();
  },

  methods: {
    getVisibleBounds() {
      const padding = 100;
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
      this.updateRobots();
      this.setupInteractions();
      this.startPathGeneration();
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
        this.drawPaths();
        this.drawPoints();
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
      const context = new PIXI.GraphicsContext().circle(0, 0, 4).fill("red");
      const pointGraphics = new PIXI.Graphics(context, {
        label: `point_${point.id}`,
      });
      pointGraphics.position.set(point.x, point.y);

      this.pointsContainer.addChild(pointGraphics);
    },

    updateMapPoints() {
      this.drawPoints();
      this.drawPaths();
    },

    // === ROBOT MANAGEMENT ===
    updateRobots() {
      this.clearRobots();
      this.createRobots();
      this.startAllRobotsMovement();
    },

    clearRobots() {
      this.robotSprites.forEach((robot) => {
        if (robot.sprite) {
          this.mapContainer.removeChild(robot.sprite);
        }
        // Usuń również ładunek
        if (robot.cargoSprites && robot.cargoSprites.length > 0) {
          robot.cargoSprites.forEach((cargo) => {
            this.mapContainer.removeChild(cargo);
          });
        }
      });
      this.robotSprites = [];
    },

    createRobots() {
      if (!this.robotTexture || !this.mapPoints.length) return;

      const robotCount = this.robotCount;

      for (let i = 1; i <= robotCount; i++) {
        const robotData = this.robotStore.robots.find((x) => x.id === i);
        const robotSprite = PIXI.Sprite.from(this.robotTexture);
        robotSprite.anchor.set(0.5);
        robotSprite.width = 110;
        robotSprite.height = 50;
        robotSprite.label = `robot_${i}`;

        // Różne pozycje startowe - rozmieść roboty równomiernie
        const startPointIndex = i % this.mapPoints.length;
        const startPoint = this.mapPoints[startPointIndex];
        robotSprite.x = startPoint.x;
        robotSprite.y = startPoint.y;

        this.mapContainer.addChild(robotSprite);

        const robotObj = {
          sprite: robotSprite,
          id: i,
          robotData: robotData,
          nextPoint: null,
          isMoving: false,
          cargoSprites: [], // Array dla sprite'ów ładunków
        };

        // Stwórz ładunki dla robota
        this.createCargoSprites(robotObj);

        this.robotSprites.push(robotObj);
      }
    },

    // === CARGO MANAGEMENT ===
    createCargoSprites(robot) {
      const cargoCount = robot.robotData.cargoCount || 0;
      robot.cargoSprites = [];

      if (cargoCount === 0) return;

      // Jeden sprite ładunku z cyferką całkowitej ilości
      const cargoContainer = new PIXI.Container();

      // Brązowy kwadrat dla ładunku
      const cargoBox = new PIXI.Graphics();
      cargoBox.rect(-12, -12, 24, 24);
      cargoBox.fill(0x8b4513); // Brązowy kolor
      cargoBox.stroke({ width: 2, color: 0x654321 });

      // Cyfra z ilością ładunków
      const cargoText = new PIXI.BitmapText({
        text: cargoCount.toString(),
        style: {
          fontSize: 14,
          fill: 0xffffff,
          fontWeight: "bold",
          align: "center",
        },
      });
      cargoText.anchor.set(0.5);

      cargoContainer.addChild(cargoBox);
      cargoContainer.addChild(cargoText);
      cargoContainer.label = `cargo_${robot.id}`;

      // Pozycja ładunku za robotem
      cargoContainer.x = robot.sprite.x - 35;
      cargoContainer.y = robot.sprite.y;

      this.mapContainer.addChild(cargoContainer);
      robot.cargoSprites.push(cargoContainer);
    },

    updateRobotsCargo() {
      this.robotSprites.forEach((robot) => {
        const robotData = this.robotStore.robots.find((r) => r.id === robot.robotData.id);
        if (robotData && robotData.cargoCount !== robot.robotData.cargoCount) {
          // Usuń stary ładunek
          robot.cargoSprites.forEach((cargo) => {
            this.mapContainer.removeChild(cargo);
          });
          robot.cargoSprites = [];

          // Zaktualizuj dane robota
          robot.robotData = robotData;
          // Stwórz nowy ładunek
          this.createCargoSprites(robot);
        }
      });
    },

    updateCargoPositions(robot) {
      if (!robot.cargoSprites || robot.cargoSprites.length === 0) return;

      const cargo = robot.cargoSprites[0]; // Tylko jeden sprite ładunku
      if (!cargo) return;

      // Ładunek podąża za robotem
      const targetX = robot.sprite.x - 35;
      const targetY = robot.sprite.y;

      // Płynne przesuwanie ładunku
      const lerpFactor = 0.15;
      cargo.x += (targetX - cargo.x) * lerpFactor;
      cargo.y += (targetY - cargo.y) * lerpFactor;
    },

    startAllRobotsMovement() {
      this.robotSprites.forEach((robot, index) => {
        setTimeout(() => {
          this.moveRobotToNextPoint(robot);
        }, 1000);
      });
    },

    moveRobotToNextPoint(robot) {
      if (robot.isMoving || !robot.sprite) return;
      const robotPath = this.robotStore.robotPaths[robot.id];
      if (!robotPath) return;

      if (!robot.nextPoint) {
        robot.nextPoint = robotPath[0];
      } else {
        const lastVisitedPoint = robot.nextPoint;
        const nextPointIndex = robotPath.findIndex((x) => x === lastVisitedPoint);
        if (nextPointIndex + 1 <= robotPath.length) {
          robot.nextPoint = robotPath[nextPointIndex + 1];
        }
      }

      const targetPoint = this.mapPoints.find((x) => x.id === robot.nextPoint);
      if (!targetPoint) {
        return;
      }
      robot.isMoving = true;

      this.animateRobotToPoint(robot, targetPoint, () => {
        robot.isMoving = false;

        // Różne opóźnienia dla każdego robota
        const delay = 2000 + robot.id * 200;
        setTimeout(() => this.moveRobotToNextPoint(robot), delay);
      });
    },

    animateRobotToPoint(robot, targetPoint, onComplete) {
      const startX = robot.sprite.x;
      const startY = robot.sprite.y;
      const duration = 3000 + robot.id * 100; // Różne prędkości
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = this.easeInOutQuad(progress);

        robot.sprite.x = startX + (targetPoint.x - startX) * easeProgress;
        robot.sprite.y = startY + (targetPoint.y - startY) * easeProgress;

        // Aktualizuj pozycję ładunków
        this.updateCargoPositions(robot);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          onComplete?.();
        }
      };

      requestAnimationFrame(animate);
    },

    // === PATH DRAWING ===
    startPathGeneration() {
      this.stopPathGeneration(); // Clear existing interval

      if (this.mapPoints.length < 2 || this.transitions.length === 0) {
        console.warn("Not enough points or transitions for path generation");
        return;
      }

      // Generate initial paths
      this.robotStore.generatePathsForAllRobots(this.mapPoints, this.transitions);

      // Set up interval for path regeneration every 20 seconds
      this.pathGenerationInterval = setInterval(() => {
        this.robotStore.generatePathsForAllRobots(this.mapPoints, this.transitions);
      }, 20000);
    },

    stopPathGeneration() {
      if (this.pathGenerationInterval) {
        clearInterval(this.pathGenerationInterval);
        this.pathGenerationInterval = null;
      }
    },
    drawPaths() {
      this.clearExistingPaths();

      const connections = this.areaDataStore.areaMapPoints?.transitions || [];

      connections.forEach((connection) => {
        const fromPoint = this.mapPoints.find((p) => p.id === connection.startSpotId);
        const toPoint = this.mapPoints.find((p) => p.id === connection.endSpotId);

        if (fromPoint && toPoint) {
          const line = new PIXI.Graphics();
          line.moveTo(fromPoint.x, fromPoint.y).lineTo(toPoint.x, toPoint.y).stroke({ width: 2, color: 0x0066cc });

          line.label = `path_${connection.startSpotId}_${connection.endSpotId}`;
          this.mapContainer.addChild(line);
        }
      });
    },

    clearExistingPaths() {
      const pathsToRemove = this.mapContainer.children.filter((child) => child.label && child.label.startsWith("path"));
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
      }, 16);
    },

    onDragStart(event) {
      this.isDragging = true;
      this.lastPointerPosition = {
        x: event.global.x,
        y: event.global.y,
      };
      if (this.pointsContainer) {
        this.pointsContainer.interactiveChildren = false;
      }
    },

    onDragMove(event) {
      if (!this.isDragging) return;

      if (this.dragThrottle) return;
      this.dragThrottle = requestAnimationFrame(() => {
        const deltaX = event.global.x - this.lastPointerPosition.x;
        const deltaY = event.global.y - this.lastPointerPosition.y;

        this.mapContainer.x += deltaX;
        this.mapContainer.y += deltaY;
        this.lastPointerPosition = { x: event.global.x, y: event.global.y };

        this.dragThrottle = null;
      });
    },

    onDragEnd() {
      this.isDragging = false;
      if (this.pointsContainer) {
        this.pointsContainer.interactiveChildren = true;
      }
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
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }

      window.removeEventListener("resize", this.handleResize);
      this.stopPathGeneration();

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
