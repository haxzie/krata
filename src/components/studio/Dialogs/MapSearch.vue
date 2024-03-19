<template>
  <div class="map-search-background" @click.self="$emit('close')">
    <div class="map-search">
      <form class="header" @submit.prevent="selectActiveItem">
        <SearchIcon size="20" />
        <input
          ref="searchInputRef"
          v-model="searchQuery"
          type="text"
          placeholder="Search placess..."
        />
        <button type="submit" v-show="false"/>
        <button class="close-btn" @click="$emit('close')">
          <ClearIcon size="20" />
        </button>
      </form>
      <div v-if="searchResults && searchResults.length" class="contents">
        <div
          v-for="(feature, index) in searchResults"
          :key="feature.id"
          :class="['search-result', { selected: selectedItemIndex === index}]"
          @click="selectFeature(feature)"
          @mouseenter="selectedItemIndex = index"
        >
          <h4>{{ feature.text }}</h4>
          <p class="ellipsis">{{ feature.place_name || feature.place_name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ClearIcon from "@/components/icons/ClearIcon.vue";
import SearchIcon from "@/components/icons/SearchIcon.vue";
import { getMapboxSearch } from "@/api/mapbox";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import debounce from "lodash/debounce";
import { useStoreModule } from "@/composables/useStoreModule";
import bbox from "@turf/bbox";

export default {
  components: {
    ClearIcon,
    SearchIcon,
  },
  setup(_, { emit }) {
    const searchInputRef = ref();
    const searchQuery = ref("");
    const isSearchingMapbox = ref(false);
    const searchResults = ref([]);
    const EditorStore = useStoreModule("editor");
    const MapStore = useStoreModule("map");
    const searchLocation = computed(()=> MapStore.getters.getSearchLocation);
    const selectedItemIndex = ref(0);

    const triggerSearch = async () => {
      if (!searchQuery.value) return;
      isSearchingMapbox.value == true;
      try {
        const { status, data } = await getMapboxSearch(searchQuery.value, searchLocation.value);
        if (status === 200 && data && data.features) {
          searchResults.value = Object.freeze(data.features);
          selectedItemIndex.value = 0;
        }
      } catch (error) {
        console.error(error);
      }
      isSearchingMapbox.value = false;
    };

    const debouncedMapboxSearch = debounce(triggerSearch, 300);

    const selectFeature = (feature) => {
      if (feature.bbox) {
        const _bbox = [
          [feature.bbox[0], feature.bbox[1]],
          [feature.bbox[2], feature.bbox[3]],
        ];
        EditorStore.actions.updateBoundingBox({ bbox: _bbox });
      } else {
        const bb = bbox({ 
          type: "Feature",
          geometry: feature.geometry
        });
        const _bbox = [
          [bb[0], bb[1]],
          [bb[2], bb[3]],
        ];
        EditorStore.actions.updateBoundingBox({ bbox: _bbox });
        MapStore.actions.setTemporarySearchMarkerLocation(feature.geometry.coordinates);
      }
      emit("close");
    };

    watch(searchQuery, () => {
      debouncedMapboxSearch();
    });

    const setupShortCuts = (event) => {
      const end = searchQuery.value.length;
      switch(event.key) {
        case "Escape":
          emit('close');
          break;
        case "ArrowDown":
          searchInputRef.value.setSelectionRange(end, end);
          selectedItemIndex.value = Math.min(selectedItemIndex.value + 1, searchResults.value.length-1);
          break;
        case "ArrowUp":
          searchInputRef.value.setSelectionRange(end, end);
          selectedItemIndex.value = Math.max(selectedItemIndex.value - 1, 0);
          break;
      }
    }

    const selectActiveItem = () => {
      if (searchResults.value[selectedItemIndex.value]) {
        selectFeature(searchResults.value[selectedItemIndex.value])
      } else {
        emit('close');
      }
    }

    onMounted(() => {
      setTimeout(() => {
        searchInputRef.value.focus();
      }, 100);
      document.addEventListener('keyup', setupShortCuts);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('keyup', setupShortCuts);
      MapStore.actions.setSearchLocation(null);
    })
    return {
      searchInputRef,
      searchQuery,
      searchResults,
      selectFeature,
      selectedItemIndex,
      selectActiveItem
    };
  },
};
</script>

<style lang="scss" scoped>
.map-search-background {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 999;
  background: var(--popup-background);
  display: flex;
  align-items: center;
  justify-content: center;

  .map-search {
    position: absolute;
    top: 100px;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 500px;
    height: auto;
    background: var(--color-secondary);
    border-radius: 6px;
    box-shadow: var(--smooth-shadow);

    .header {
      display: flex;
      align-items: center;
      color: var(--font-color);
      padding: 5px 10px;

      input {
        padding: 10px;
        border: 0;
        outline: 0;
        background: transparent;
        flex: 1;
      }

      .close-btn {
        display: flex;
        align-items: center;
        border: 0;
        background: 0;
        padding: 5px;
        border-radius: 6px;

        &:hover {
          cursor: pointer;
          background: var(--color-secondary-light);
        }
      }
    }

    .contents {
      border-top: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      max-height: 400px;
      overflow: auto;

      .search-result {
        display: flex;
        flex-direction: column;
        padding: 10px;

        h4 {
          font-weight: 500;
        }

        p {
          opacity: 0.7;
        }

        &:last-child {
          border-radius: 0 0 6px 6px;
        }

        &:hover, &.selected{
          cursor: pointer;
          background: var(--color-secondary-light);
        }
      }
    }
  }
}
</style>
