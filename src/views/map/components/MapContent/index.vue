<template>
  <div ref="mapContainer" class="map-content"></div>
</template>

<script>
import * as PIXI from "pixi.js";
import MapImage from "./files/map.png";
import RobotImage from "./files/robot.png";
import { mockPoints, mockConnections, mockRobotPath } from "./mockDataPixi.js";

export default {
  name: "MapContent",
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
      originX: 0,
      originY: 0,
      resizeObserver: null,
      mapContainer: null,
      isDragging: false,
      lastPointerPosition: { x: 0, y: 0 },
    };
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
    async initPixi() {
      // Tworzenie aplikacji Pixi v8
      this.app = new PIXI.Application();

      await this.app.init({
        width: this.$refs.mapContainer.offsetWidth,
        height: this.$refs.mapContainer.offsetHeight,
        backgroundColor: 0x808080, // szare tło
        antialias: true,
      });

      this.$refs.mapContainer.appendChild(this.app.canvas);

      // Tworzenie kontenera dla mapy (wszystkie elementy będą w nim)
      this.mapContainer = new PIXI.Container({ scale: 1 });
      this.app.stage.addChild(this.mapContainer);

      // Ładowanie assetów
      await this.loadAssets();

      // Tworzenie mapy
      this.createMap();

      // // Tworzenie punktów i połączeń
      this.createConnections();
      this.createPoints();

      // // Tworzenie robota
      this.createRobot();

      // // Start animacji
      this.startRobotMovement();

      // Setup resize handling
      this.setupResize();

      // Setup pan and zoom
      this.setupPanZoom();
    },

    async loadAssets() {
      // Ładowanie assetów
      const map = await PIXI.Assets.load(MapImage);
      const robot = await PIXI.Assets.load(RobotImage);
      this.mapTexture = map;
      this.robotTexture = robot;
    },

    async createFallbackTextures() {
      // Fallback - tworzenie domyślnych tekstur
      const graphics = new PIXI.Graphics();

      // Mapa fallback
      graphics.rect(0, 0, 800, 600).fill(0x34495e);
      this.mapTexture = await this.app.renderer.generateTexture(graphics);

      // Robot fallback
      graphics.clear();
      graphics.circle(0, 0, 10).fill(0xe74c3c);
      this.robotTexture = await this.app.renderer.generateTexture(graphics);
    },

    createMap() {
      if (this.mapTexture) {
        const mapSprite = PIXI.Sprite.from(this.mapTexture);
        // Mapa ma stały rozmiar - nie resize do kontenera
        mapSprite.label = "map";
        mapSprite.width = this.mapTexture.width;
        mapSprite.height = this.mapTexture.height;
        this.mapContainer.addChild(mapSprite);
      }
    },

    createPoints() {
      mockPoints.forEach((point) => {
        // Tworzenie kółka punktu
        const circle = new PIXI.Graphics();
        circle.circle(0, 0, 8).fill(0x000000);
        circle.x = point.x;
        circle.y = point.y;
        this.mapContainer.addChild(circle);
        // Dodanie labelu
        const label = new PIXI.BitmapText({
          text: point.label,
          position: { x: point.x, y: point.y },
          anchor: { x: -0.2, y: -0.2 },
          style: {
            fontName: "Arial",
            fontSize: 20,
            fill: "black",
          },
        });

        this.mapContainer.addChild(label);
      });
    },

    createConnections() {
      mockConnections.forEach((connection) => {
        const fromPoint = mockPoints.find((p) => p.id === connection.from);
        const toPoint = mockPoints.find((p) => p.id === connection.to);

        if (fromPoint && toPoint) {
          const line = new PIXI.Graphics();
          line.moveTo(fromPoint.x, fromPoint.y).lineTo(toPoint.x, toPoint.y).stroke({ width: 2, color: 0x7f8c8d });

          this.mapContainer.addChild(line);
        }
      });
    },

    createRobot() {
      this.robotSprite = PIXI.Sprite.from(this.robotTexture);
      this.robotSprite.anchor.set(0.5);
      this.robotSprite.width = 100;
      this.robotSprite.height = 55;

      // Ustaw pozycję startową
      const startPoint = mockPoints.find((p) => p.id === mockRobotPath[0]);
      if (startPoint) {
        this.robotSprite.x = startPoint.x;
        this.robotSprite.y = startPoint.y;
      }

      this.mapContainer.addChild(this.robotSprite);
    },

    startRobotMovement() {
      this.moveToNextPoint();
    },

    moveToNextPoint() {
      if (this.isMoving) return;

      const nextIndex = (this.currentPathIndex + 1) % mockRobotPath.length;
      const nextPointId = mockRobotPath[nextIndex];
      const nextPoint = mockPoints.find((p) => p.id === nextPointId);

      if (!nextPoint) return;

      this.isMoving = true;
      this.currentPathIndex = nextIndex;

      // Animacja ruchu za pomocą Pixi Ticker
      const startX = this.robotSprite.x;
      const startY = this.robotSprite.y;
      const targetX = nextPoint.x;
      const targetY = nextPoint.y;

      const duration = 2000; // 2 sekundy w ms
      let elapsed = 0;

      const animate = (delta) => {
        elapsed += this.app.ticker.deltaMS;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease in-out)
        const easeProgress = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        this.robotSprite.x = startX + (targetX - startX) * easeProgress;
        this.robotSprite.y = startY + (targetY - startY) * easeProgress;

        if (progress >= 1) {
          this.app.ticker.remove(animate);
          this.isMoving = false;
          // Następny ruch po 1 sekundzie
          setTimeout(() => this.moveToNextPoint(), 1000);
        }
      };

      this.app.ticker.add(animate);
    },

    setupResize() {
      // ResizeObserver dla dokładnego monitorowania zmian rozmiaru kontenera
      this.resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          this.handleResize();
        }
      });
      this.resizeObserver.observe(this.$refs.mapContainer);

      // Window resize jako backup
      window.addEventListener("resize", this.handleResize);
    },

    handleResize() {
      if (!this.app || !this.$refs.mapContainer) return;

      const containerWidth = this.$refs.mapContainer.offsetWidth;
      const containerHeight = this.$refs.mapContainer.offsetHeight;

      // Sprawdź czy rozmiar rzeczywiście się zmienił
      if (containerWidth === this.app.screen.width && containerHeight === this.app.screen.height) {
        return;
      }

      // Resize tylko aplikacji Pixi - mapa zachowuje stały rozmiar
      this.app.renderer.resize(containerWidth, containerHeight);
    },

    setupPanZoom() {
      // Włącz interaktywność dla całego stage
      this.app.stage.eventMode = "static";
      this.app.stage.hitArea = this.app.screen;

      // Mouse wheel zoom
      this.app.canvas.addEventListener("wheel", (e) => {
        e.preventDefault();

        if (!this.mapContainer || this.mapContainer.children.length === 0) return;

        const pointer = { x: e.offsetX, y: e.offsetY };
        const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;

        // Zoom względem pozycji kursora
        const worldPos = {
          x: (pointer.x - this.mapContainer.x) / this.mapContainer.scale.x,
          y: (pointer.y - this.mapContainer.y) / this.mapContainer.scale.y,
        };

        // Skaluj tylko mapę - punkty i robot automatycznie skalują się jako jej dzieci
        this.mapContainer.scale.x *= zoomFactor;
        this.mapContainer.scale.y *= zoomFactor;

        // Ograniczenia zoom
        this.mapContainer.scale.x = Math.max(0.1, Math.min(3, this.mapContainer.scale.x));
        this.mapContainer.scale.y = Math.max(0.1, Math.min(3, this.mapContainer.scale.y));

        // Przelicz pozycję kontenera po zoom
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
  background: #808080; // szare tło
}
</style>
