<template>
  <div class="base-map-options">
    <div class="header">
      <div class="icon">
        <MapIcon :size="18" />
      </div>
      <h4>Map and Visuals</h4>
    </div>
    <v-section title="Map Style">
      <div class="map-style-selector">
        <div class="dropdown-select" @click="openDropDownOptions">
          <img
            :src="styles[activeStyle].image"
            :alt="styles[activeStyle].name"
            class="thumbnail"
          />
          <dl>
            <dt>{{ styles[activeStyle].name }}</dt>
            <dd>Mapbox style</dd>
          </dl>
          <KeyboardArrowDownIcon
            :class="['icon', { rotate: showDropDownOptions }]"
          />
        </div>
        <div
          v-if="showDropDownOptions"
          class="dropdown-options"
          v-click-away="
            () => {
              showDropDownOptions = false;
            }
          "
        >
          <div
            v-for="item in Object.values(styles)"
            :key="item.id"
            class="item"
            @click="selectActiveMapStyle(item.id)"
          >
            <img :src="item.image" :alt="item.name" class="thumbnail" />
            <dl>
              <dt>{{ item.name }}</dt>
              <dd>Mapbox style</dd>
            </dl>
          </div>
        </div>
      </div>
    </v-section>
    <v-section title="Map Labels">
      <div class="item-row">
        <VCheckBox
          :modelValue="showMapLabels"
          @update:modelValue="(value) => setShowMapLabels(value)"
          label="Show Map Labels"
        />
      </div>
    </v-section>
    <v-section title="Visualization">
      <!-- <div class="item-row">
        <VCheckBox
          :modelValue="getUseExactDimensions"
          @update:modelValue="(value) => setUseExactDimensions(value)"
          label="Preserve dimensions on zoom"
        />
      </div> -->
      <div class="item-row">
        <VCheckBox
          :modelValue="getShowPropertiesPopup"
          @update:modelValue="(value) => setShowPropertiesPopup(value)"
          label="Show Properties on Hover"
        />
      </div>
    </v-section>
  </div>
</template>

<script>
import VSection from "@/components/base/v-section.vue";
import MapIcon from "@/components/icons/MapIcon.vue";
import VCheckBox from "@/components/base/v-checkbox.vue";
import KeyboardArrowDownIcon from "@/components/icons/KeyboardArrowDownIcon.vue";
import { useStoreModule } from "@/composables/useStoreModule.js";

import { ref, computed } from "vue";

export default {
  components: {
    VSection,
    MapIcon,
    KeyboardArrowDownIcon,
    VCheckBox,
  },
  setup() {
    const store = useStoreModule("map");
    const { getters, actions } = store;
    const styles = computed(() => getters.getAllMapStyles);
    const activeStyle = computed(() => getters.getActiveMapStyleId);
    const showMapLabels = computed(() => getters.getShowMapLabels);
    const getShowPropertiesPopup = computed(() => getters.getShowPropertiesPopup);
    const showDropDownOptions = ref(false);
    const setShowMapLabels = actions.setShowMapLabels;
    const getUseExactDimensions = computed(
      () => getters.getUseExactDimensions
    );
    const setUseExactDimensions = actions.setUseExactDimensions;
    const setShowPropertiesPopup = actions.setShowPropertiesPopup;

    const openDropDownOptions = () => {
      if (!showDropDownOptions.value) {
        showDropDownOptions.value = true;
      }
    };

    const selectActiveMapStyle = (mapStyle) => {
      actions.setActiveMapStyleId(mapStyle);
      showDropDownOptions.value = false;
    };

    return {
      styles,
      activeStyle,
      showDropDownOptions,
      selectActiveMapStyle,
      openDropDownOptions,
      showMapLabels,
      setShowMapLabels,
      getUseExactDimensions,
      setUseExactDimensions,
      setShowPropertiesPopup,
      getShowPropertiesPopup
    };
  },
};
</script>

<style lang="scss" scoped>
.base-map-options {
  display: flex;
  flex-direction: column;

  .header {
    padding: 10px;
    border-bottom: 1px solid var(--color-secondary-light);
    display: flex;
    align-items: center;

    .icon {
      background: var(--color-tirtiary-light);
      color: var(--color-tirtiary);
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 3px;
      margin-right: 5px;
    }

    h4 {
      font-weight: bold;
    }
  }

  .map-style-selector {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    position: relative;

    .dropdown-select {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 5px;
      border-radius: 3px;

      .thumbnail {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 3px;
        border: 1px solid var(--color-secondary-light);
      }

      .icon {
        transition: 0.1s all ease-in-out;
        &.rotate {
          transform: rotate(180deg);
        }
      }

      dl {
        margin-left: 10px;
        flex: 1;

        dt {
          font-weight: bold;
        }

        dd {
          color: var(--font-color-light);
        }
      }

      &:hover {
        cursor: pointer;
        background: var(--color-secondary-light);
      }
    }

    .dropdown-options {
      display: flex;
      flex-direction: column;
      max-height: 300px;
      overflow: auto;
      border: 1px solid var(--border-color);
      border-radius: 3px;
      box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
      background: var(--color-secondary);
      position: absolute;
      top: 60px;
      left: 0;
      width: 100%;

      .item {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 5px;
        border-radius: 3px;

        .thumbnail {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 3px;
          border: 1px solid var(--color-secondary-light);
        }

        dl {
          margin-left: 10px;
          flex: 1;

          dt {
            font-weight: bold;
          }

          dd {
            color: var(--font-color-light);
          }
        }

        &:hover {
          cursor: pointer;
          background: var(--color-secondary-light);
        }
      }
    }
  }

  .item-row {
    padding: 10px 0;
  }
}
</style>
