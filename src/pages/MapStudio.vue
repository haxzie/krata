<template>
  <StudioSkeletonLoader v-if="isLoading" />
  <div
    v-else
    :class="['studio-layout']"
    ref="studioLayoutRef"
    @drop.prevent="captureDrop"
    @dragover.prevent
  >
    <nav-bar @share="showShareModal = true" />
    <div class="content-layout">
      <explorer-panel />
      <div class="editor-area">
        <editor-view />
      </div>
      <details-panel />
    </div>
    <FileImportModal
      v-if="showImportModal"
      :file="fileToImport"
      @close="closeImportModal"
    />
    <!-- <DropZone
      v-if="showImportModal"
      :file="fileToImport"
      @close="closeImportModal"
    /> -->
    <MapSearch v-if="showMapSearch" @close="setShowMapSearch(false)" />
    <GenerateImageModal v-if="isGeneratingImage" />
    <ShareMapModal v-if="showShareModal" @close="showShareModal = false" />
  </div>
</template>

<script>
import NavBar from "@/components/studio/NavBar.vue";
import ExplorerPanel from "@/components/studio/Explorer/ExplorerPanel.vue";
import DetailsPanel from "@/components/studio/DetailsPanel.vue";
import FileImportModal from "@/components/studio/Dialogs/FileImportModal.vue";

import {
  computed,
  defineAsyncComponent,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  ref,
} from "vue";
import { useStoreModule } from "@/composables/useStoreModule";
import { useRoute } from "vue-router";
import StudioSkeletonLoader from "@/components/studio/StudioSkeletonLoader.vue";
import GenerateImageModal from "@/components/studio/Dialogs/ImageGenerationDialog.vue";
import ShareMapModal from "@/components/studio/Dialogs/ShareMapModal.vue";
import MapSearch from "@/components/studio/Dialogs/MapSearch.vue";
import EditorLoader from "@/components/studio/Editor/EditorLoader.vue";
const EditorView = defineAsyncComponent({
  loader: () => import("@/components/studio/Editor/EditorView.vue"),
  loadingComponent: EditorLoader,
});

export default {
  components: {
    NavBar,
    ExplorerPanel,
    EditorView,
    DetailsPanel,
    // DropZone,
    StudioSkeletonLoader,
    GenerateImageModal,
    ShareMapModal,
    MapSearch,
    FileImportModal,
  },
  setup() {
    const studioLayoutRef = ref(null);
    const UIStore = useStoreModule("UI");
    const MapStore = useStoreModule("map");
    const EditorStore = useStoreModule("editor");
    const ProjectStore = useStoreModule("projects");
    const isLoading = ref(false);
    const route = useRoute();
    const showImportModal = computed(() => UIStore.getters.showImportModal);
    const showMapSearch = computed(() => UIStore.getters.showMapSearch);
    const setShowMapSearch = UIStore.actions.setShowMapSearch;
    const setShowImportModal = UIStore.actions.setShowImportModal;
    const fileToImport = ref(null);
    const isPreviewMode = computed(() => !!route.query?.preview);
    const isGeneratingImage = computed(
      () => EditorStore.getters.isGeneratingImage
    );
    const showShareModal = ref(false);

    const captureDrop = (event) => {
      const { dataTransfer } = event;
      const files = dataTransfer.files;
      if (files && files.length > 0) {
        const filename = files[0]?.name;
        const regex = new RegExp(`.*[.geojson|.json|.kml|.csv]`, "i");
        if (filename && regex.test(filename)) {
          fileToImport.value = files[0];
          setShowImportModal(true);
        }
      }
    };

    const closeImportModal = () => {
      setShowImportModal(false);
      fileToImport.value = null;
    };

    const initializeProject = async () => {
      isLoading.value = true;
      await ProjectStore.actions.initializeProject();
      isLoading.value = false;
    };

    onMounted(() => {
      initializeProject();
    });

    const resetSotres = () => {
      MapStore.actions.reset();
      EditorStore.actions.reset();
    };
    onBeforeUnmount(resetSotres);
    onBeforeMount(resetSotres);
    return {
      studioLayoutRef,
      showImportModal,
      setShowImportModal,
      captureDrop,
      fileToImport,
      closeImportModal,
      isLoading,
      isPreviewMode,
      isGeneratingImage,
      showShareModal,
      showMapSearch,
      setShowMapSearch,
    };
  },
};
</script>

<style lang="scss" scoped>
.studio-layout {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;

  .content-layout {
    display: grid;
    column-gap: 1px;
    grid-template-columns: 270px 1fr 270px;
    overflow: hidden;

    .editor-area {
      width: 100%;
      height: 100%;
    }
  }

  &.preview {
    grid-template-rows: 1fr;

    .content-layout {
      height: 100%;
      grid-template-columns: 1fr;
    }
  }
}
</style>
