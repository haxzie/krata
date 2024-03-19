<template>
  <div class="nav-bar">
    <div class="header">
      <a
        href="https://github.com/haxzie/krata?utm_source=krata"
        class="brand-logo"
      >
        <Logo />
        <!-- <KeyboardArrowIcon size="14" /> -->
      </a>
      <form
        @submit.prevent="$refs.fileNameRef.blur()"
        @click="setFilenameEditable"
      >
        <input
          ref="fileNameRef"
          class="filename"
          v-model="filename"
          :readonly="readonly"
          @blur="updateFilename"
          placeholder="Enter File Name"
        />
        <input
          v-if="accessFlags.canChangeProjectName"
          v-show="false"
          type="submit"
        />
      </form>
      <lock-icon
        v-if="!accessFlags.canChangeProjectName"
        size="18"
        class="lock-icon"
      />
    </div>
    <div class="tool-bar">
      <div
        v-if="accessFlags.showTools"
        class="draw-tools"
        @mouseenter="createToolTipTrigger"
        @mouseleave="clearToolTipTrigger"
      >
        <div
          v-for="(tool, index) in tools"
          :key="tool.id"
          :class="['tool', { active: activeTool === tool.id }]"
          @click="setActiveTool(tool.id)"
          @mouseenter="setActiveHoverItemIndex(index)"
        >
          <component :is="tool.icon" :size="18" />
        </div>
        <div
          v-if="showHelpToolTip"
          class="help-tooltip"
          :style="{
            transform: `translateX(${activeHoverItemIndex * 42}px)`,
          }"
        >
          <h4>
            {{ hoveredTool.name }}
            <span class="shortcut">{{ hoveredTool.shortcut }}</span>
          </h4>
          <p>
            {{ hoveredTool.description }}
          </p>
        </div>
      </div>
      <div v-else class="view-options"></div>
    </div>
    <div class="map-options">
      <button class="btn-download" @click="toggleDownloadOptions">
        <DownloadIcon :size="18" />
        Export
        <KeyboardArrowIcon :size="14" />
      </button>
      <a class="github-link" href="https://github.com/haxzie/krata" target="_blank"><GitHubIcon class="icon" :size="20"/></a>
      <!-- <button class="btn-share" @click="$emit('share')">
        <span>Share</span><ShareIcon clas="icon" :size="18" />
      </button> -->
      <DownloadOptions
        v-if="showDownloadOptions"
        @close="showDownloadOptions = false"
        @saveLocal="saveFile"
        @saveGeoJson="saveGeoJson"
        @saveKML="saveKML"
        @saveScreenshot="saveScreenshot"
      />
    </div>
  </div>
</template>

<script>
import SelectIcon from "@/components/icons/SelectIcon.vue";
import GitHubIcon from "@/components/icons/GitHubIcon.vue";
import DotIcon from "@/components/icons/DotIcon.vue";
import PinIcon from "@/components/icons/PinIcon.vue";
import ShapeIcon from "@/components/icons/ShapeIcon.vue";
import LineIcon from "@/components/icons/LineIcon.vue";
import MeasureIcon from "@/components/icons/MeasureIcon.vue";
import HandIcon from "@/components/icons/HandIcon.vue";
import DownloadIcon from "@/components/icons/DownloadIcon.vue";
import ShareIcon from "@/components/icons/ShareIcon.vue";
import EllipseIcon from "@/components/icons/EllipseIcon.vue";
import RectangleIcon from "@/components/icons/RectangleIcon.vue";
import PolygonIcon from "@/components/icons/PolygonIcon.vue";
import CrossHairIcon from "@/components/icons/CrossHairIcon.vue";
import KeyboardArrowIcon from "@/components/icons/KeyboardArrowDownIcon.vue";
import Logo from "@/components/icons/AppLogo.vue";
import DownloadOptions from "@/components/studio/Menus/DownloadOptions.vue";
import { MAP_TOOLS } from "@/store/modules/editor/initialState.js";
import { computed, ref, watch } from "vue";
import { useStoreModule } from "@/composables/useStoreModule.js";
import LockIcon from "@/components/icons/LockIcon.vue";
import { createRoute } from "@/router";

export default {
  components: {
    SelectIcon,
    PinIcon,
    ShapeIcon,
    DotIcon,
    LineIcon,
    MeasureIcon,
    HandIcon,
    DownloadIcon,
    ShareIcon,
    RectangleIcon,
    EllipseIcon,
    PolygonIcon,
    CrossHairIcon,
    Logo,
    KeyboardArrowIcon,
    DownloadOptions,
    LockIcon,
    GitHubIcon
  },
  setup() {
    const { getters, actions } = useStoreModule("editor");
    const UIStore = useStoreModule("UI");
    const accessFlags = computed(() => UIStore.getters.getAccessFlags);
    const activeTool = computed(() => getters.getActiveTool);
    const tools = Object.values(MAP_TOOLS);
    const setActiveTool = actions.setActiveTool;
    const saveFile = actions.saveAsGeoJson;
    const saveGeoJson = actions.saveAsGeoJson;
    const saveKML = actions.saveAsKML;
    const activeHoverItemIndex = ref(0);
    const hoveredTool = computed(() => tools[activeHoverItemIndex.value]);
    const showHelpToolTip = ref(false);
    const tooltipTrigger = ref(null);
    const fileNameRef = ref(null);
    const showDownloadOptions = ref(false);

    const filename = computed({
      get() {
        return getters.getFilename;
      },
      set(value) {
        actions.setFilename(value);
      },
    });
    const readonly = ref(true);
    const setFilenameEditable = () => {
      if (accessFlags.value.canChangeProjectName) {
        readonly.value = false;
      }
    };

    watch(readonly, (value) => {
      if (!value) {
        fileNameRef.value.focus();
        fileNameRef.value.select();
      }
    });
    const updateFilename = () => {
      if (!accessFlags.value.canChangeProjectName) {
        return;
      }
      readonly.value = true;
      if (!filename.value) {
        filename.value = "Untitled File";
      } else {
        actions.syncFileName();
      }
    };

    const setActiveHoverItemIndex = (index) => {
      activeHoverItemIndex.value = index;
    };

    const createToolTipTrigger = () => {
      tooltipTrigger.value = setTimeout(() => {
        showHelpToolTip.value = true;
      }, 1000);
    };

    const clearToolTipTrigger = () => {
      showHelpToolTip.value = false;
      if (tooltipTrigger.value) {
        window.clearTimeout(tooltipTrigger.value);
      }
    };

    const toggleDownloadOptions = () => {
      if (!showDownloadOptions.value) {
        showDownloadOptions.value = true;
      }
    };

    const saveScreenshot = () => {
      actions.saveAsImage();
    };
    return {
      updateFilename,
      fileNameRef,
      filename,
      setFilenameEditable,
      readonly,
      accessFlags,
      tools,
      activeTool,
      setActiveTool,
      saveFile,
      setActiveHoverItemIndex,
      hoveredTool,
      activeHoverItemIndex,
      showHelpToolTip,
      clearToolTipTrigger,
      createToolTipTrigger,
      toggleDownloadOptions,
      showDownloadOptions,
      saveGeoJson,
      saveKML,
      saveScreenshot,
      createRoute,
    };
  },
};
</script>

<style lang="scss" scoped>
.nav-bar {
  display: grid;
  height: 50px;
  background: var(--color-dark-background);
  grid-template-columns: 270px 1fr 270px;
  color: var(--color-secondary);

  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 5px 5px 5px 10px;

    .brand-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 5px 5px 5px 0;
      color: var(--color-secondary);

      &:hover {
        cursor: pointer;
      }
    }

    .lock-icon {
      color: var(--font-color-light);
    }

    form {
      flex: 1;
      display: flex;
      flex-direction: row;

      .filename {
        background: transparent;
        color: var(--color-secondary);
        border: 2px solid transparent;
        outline: none;
        padding: 5px;
        min-width: 0;
        width: 100%;

        &[readonly] {
          pointer-events: none;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }

        &:focus {
          border: 2px solid var(--color-primary);
        }
      }
    }
  }
  .tool-bar {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 5px;
    border-left: 1px solid var(--color-dark-background-light);
    border-right: 1px solid var(--color-dark-background-light);

    .draw-tools {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      position: relative;

      .tool {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background: transparent;
        border-radius: 3px;
        margin-right: 2px;
        opacity: 0.7;

        &:hover {
          cursor: pointer;
          background: var(--color-dark-background-light);
          opacity: 1;
        }

        &.active {
          background: var(--color-primary);
          opacity: 1;
        }
      }

      .help-tooltip {
        width: 200px;
        position: absolute;
        top: 60px;
        left: -90px;
        z-index: 4;
        background: var(--color-primary);
        color: var(--color-secondary);
        padding: 10px;
        border-radius: 6px;
        transition: 0.2s all ease-in-out;

        &:after {
          content: " ";
          position: absolute;
          bottom: 100%; /* At the top of the tooltip */
          left: 50%;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: transparent transparent var(--color-primary) transparent;
        }

        h4,
        p {
          color: var(--color-secondary);
        }

        h4 {
          font-weight: bold;

          span.shortcut {
            opacity: 0.5;
            margin-left: 5px;
            color: var(--color-secondary);
            text-transform: capitalize;
          }
        }
      }
    }
  }
  .map-options {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0px;

    .btn-share {
      background: var(--color-primary);
      border: 0;
      border-radius: 3px;
      height: 40px;
      padding: 0 10px;
      margin-right: 5px;
      color: var(--color-secondary);
      display: flex;
      align-items: center;
      opacity: 0.9;

      span {
        margin-right: 5px;
        color: currentColor;
      }

      &:hover {
        cursor: pointer;
        opacity: 1;
      }
    }

    .btn-download {
      background: var(--color-dark-background-light);
      color: var(--color-secondary);
      border: 0;
      width: auto;
      padding: 0 10px;
      height: 40px;
      border-radius: 3px;
      opacity: 0.7;
      margin-right: 5px;
      display: flex;
      align-items: center;
      gap: 10px;

      &:hover {
        cursor: pointer;
        opacity: 1;
      }
    }

    .github-link {
      background: var(--color-dark-background-light);
      color: var(--color-secondary);
      border: 0;
      width: auto;
      padding: 0 10px;
      height: 40px;
      border-radius: 3px;
      opacity: 0.7;
      margin-right: 5px;
      display: flex;
      align-items: center;
      gap: 10px;

      &:hover {
        cursor: pointer;
        opacity: 1;
      }
    }
  }
}
</style>
