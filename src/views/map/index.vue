<template>
    <div class="map-container">
        <!-- Left Panel -->
        <div class="side-panel left-panel" :class="{ collapsed: leftPanelCollapsed }"
            :style="{ width: leftPanelWidth + 'px' }">
            <div class="panel-header">
                <button @click="toggleLeftPanel" class="toggle-btn">
                    {{ leftPanelCollapsed ? '→' : '←' }}
                </button>
            </div>
            <div class="panel-content" v-if="!leftPanelCollapsed">
                <LeftPanel />
            </div>
            <div class="resize-handle right-handle" @mousedown="startResize('left', $event)" v-if="!leftPanelCollapsed">
            </div>
        </div>

        <!-- Map Area -->
        <div class="map-area">
            <MapContent />
        </div>

        <!-- Right Panel -->
        <div class="side-panel right-panel" :class="{ collapsed: rightPanelCollapsed }"
            :style="{ width: rightPanelWidth + 'px' }">
            <div class="panel-header">
                <button @click="toggleRightPanel" class="toggle-btn">
                    {{ rightPanelCollapsed ? '←' : '→' }}
                </button>
            </div>
            <div class="panel-content" v-if="!rightPanelCollapsed">
                <RightPanel />
            </div>
            <div class="resize-handle left-handle" @mousedown="startResize('right', $event)" v-if="!rightPanelCollapsed">
            </div>
        </div>
    </div>
</template>

<script>
import { useMapStore } from '@/stores/map.js'
import LeftPanel from './components/LeftPanel/index.vue'
import RightPanel from './components/RightPanel/index.vue'
import MapContent from './components/MapContent//index.vue'

export default {
    name: "MapContainer",
    components: {
        LeftPanel,
        RightPanel,
        MapContent
    },
    data() {
        return {
            isResizing: false,
            currentPanel: null,
            startX: 0,
            startWidth: 0
        }
    },
    computed: {
        leftPanelCollapsed() {
            return this.mapStore.leftPanelCollapsed
        },
        rightPanelCollapsed() {
            return this.mapStore.rightPanelCollapsed
        },
        leftPanelWidth() {
            return this.mapStore.leftPanelWidth
        },
        rightPanelWidth() {
            return this.mapStore.rightPanelWidth
        },
        mapStore() {
            return useMapStore()
        }
    },
    methods: {
        toggleLeftPanel() {
            this.mapStore.toggleLeftPanel()
        },
        toggleRightPanel() {
            this.mapStore.toggleRightPanel()
        },
        startResize(panel, event) {
            this.isResizing = true
            this.currentPanel = panel
            this.startX = event.clientX
            this.startWidth = panel === 'left' ? this.leftPanelWidth : this.rightPanelWidth

            document.addEventListener('mousemove', this.doResize)
            document.addEventListener('mouseup', this.stopResize)
            event.preventDefault()
        },
        doResize(event) {
            if (!this.isResizing) return

            const deltaX = event.clientX - this.startX
            let newWidth

            if (this.currentPanel === 'left') {
                newWidth = this.startWidth + deltaX
                this.mapStore.setLeftPanelWidth(Math.max(200, Math.min(600, newWidth)))
            } else if (this.currentPanel === 'right') {
                newWidth = this.startWidth - deltaX
                this.mapStore.setRightPanelWidth(Math.max(200, Math.min(600, newWidth)))
            }
        },
        stopResize() {
            this.isResizing = false
            this.currentPanel = null
            document.removeEventListener('mousemove', this.doResize)
            document.removeEventListener('mouseup', this.stopResize)
        }
    }
}
</script>

<style scoped lang="scss">
@use "@/assets/styles/abstracts/_colors.module.scss" as colors;

.map-container {
    display: flex;
    height: 100vh;
    background-color: #f5f5f5;
}

.side-panel {
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    position: relative;
    transition: width 0.3s ease;

    &.collapsed {
        width: 40px !important;
        min-width: 40px;
    }

    .panel-header {
        height: 50px;
        border-bottom: 1px solid #e0e0e0;
        display: flex;
        align-items: center;
        padding: 0 10px;

        .toggle-btn {
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
            color: #666;

            &:hover {
                color: #333;
            }
        }
    }

    .panel-content {
        padding: 20px;
    }
}

.left-panel {
    order: 1;
}

.right-panel {
    order: 3;
}

.map-area {
    flex: 1;
    background-color: #808080;
    order: 2;
}

.resize-handle {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 4px;
    cursor: col-resize;
    background-color: transparent;

    &:hover {
        background-color: #007bff;
    }

    &.right-handle {
        right: 0;
    }

    &.left-handle {
        left: 0;
    }
}
</style>