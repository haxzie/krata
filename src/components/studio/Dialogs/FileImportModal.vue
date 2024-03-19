<template>
  <div
    class="file-import-modal-background"
    @dragover.prevent
    @click.self="$emit('close')"
  >
    <div class="import-modal">
      <div class="header">
        <div class="tabs">
          <div
            v-for="tab in tabs"
            :key="tab.id"
            :class="['tab', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            {{ tab.name }}
          </div>
        </div>
        <button class="close-btn" @click="$emit('close')">
          <ClearIcon size="20" />
        </button>
      </div>
      <div class="contents">
        <div v-if="csvData" class="csv-options">
          <div class="content-header">
            <div class="icon-wrapper">
              <FileUploadIcon :size="24" class="icon" />
            </div>
            <div class="texts">
              <h4>{{ csvData.filename }}</h4>
              <p>{{ csvData.data.length }} records found in this file</p>
            </div>
            <button class="clear-btn" @click="resetCSVImport">
              <ClearIcon size="20" />
            </button>
          </div>
          <div class="import-form">
            <div class="input-wrapper">
              <label for="latitude">Latitude Column</label>
              <v-select
                :placeholder="'Choose column'"
                :value="latitudeColumn"
                :options="coordinateOptions"
                @select="(value) => (latitudeColumn = value)"
              />
            </div>
            <div class="input-wrapper">
              <label for="longitude">Longitude Column</label>
              <v-select
                :placeholder="'Choose column'"
                :value="longitudeColumn"
                :options="coordinateOptions"
                @select="(value) => (longitudeColumn = value)"
              />
            </div>
          </div>
          <div class="input-wrapper" style="margin-top: 10px">
            <label for="longitude" style="margin-bottom: 5px"
              >Name Column (Optional)</label
            >
            <v-select
              :placeholder="'Choose column'"
              :value="nameColumn"
              :options="columnOptions"
              @select="(value) => (nameColumn = value)"
            />
            <p class="help-text">
              This column values will be used to name the imported points.
            </p>
          </div>
        </div>
        <div
          v-else
          :class="['drop-zone', { disabled: isReadingFile }]"
          @click="openFilePicker"
          @drop="captureDrop"
        >
          <div class="icon-wrapper">
            <FileUploadIcon :size="40" class="icon" />
          </div>
          <div v-if="isReadingFile" class="progress-bar"></div>
          <div v-else class="texts">
            <h4>Click here or drag and drop your file here to import.</h4>
            <p>Supports .geojson, .json, and .csv file formats</p>
          </div>
          <input
            type="file"
            ref="fileImportInputRef"
            id="fileImportInput"
            v-show="false"
            accept="text/csv, application/json, application/geo+json"
            @change="loadSelectedFile"
          />
        </div>
      </div>
      <div v-if="showFooter" class="footer">
        <v-button
          :text="'Import'"
          :disabled="isButtonDisabled"
          :isLoading="isReadingFile"
          @click="() => loadCSVFeatures()"
          small
        >
          <template v-slot:iconLeft>
            <add-icon style="margin-right: 5px" />
          </template>
        </v-button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import ClearIcon from "@/components/icons/ClearIcon.vue";
import VButton from "@/components/base/v-button.vue";
import VSelect from "@/components/base/v-select.vue";
import AddIcon from "@/components/icons/AddIcon.vue";
import FileUploadIcon from "@/components/icons/FileUploadIcon.vue";
import { useStoreModule } from "@/composables/useStoreModule";
import { POSITION, useToast } from "vue-toastification";

export default defineComponent({
  props: {
    file: {
      type: Object,
    },
  },
  components: {
    ClearIcon,
    VButton,
    AddIcon,
    FileUploadIcon,
    VSelect,
  },
  setup(props, { emit }) {
    const tabs = [
      {
        id: "fileImport",
        name: "File Import",
      },
      // {
      //   id: "mapImport",
      //   name: "Your Maps",
      // },
    ];
    const activeTab = ref("fileImport");
    const fileImportInputRef = ref();
    const isReadingFile = ref(false);
    const showFooter = ref(false);
    const EditorStore = useStoreModule("editor");
    const csvData = ref(null);
    const latitudeColumn = ref(null);
    const longitudeColumn = ref(null);
    const nameColumn = ref(null);
    const fileToLoad = ref(null);
    const toast = useToast();

    const isButtonDisabled = computed(() => {
      return !(latitudeColumn.value && longitudeColumn.value);
    });

    const columnOptions = computed(() => {
      if (csvData.value && csvData.value?.meta?.fields?.length) {
        const options = csvData.value.meta.fields.reduce((result, field) => {
          return {
            ...result,
            [field]: {
              id: field,
              name: field,
              type: typeof csvData.value.data[0][field],
            },
          };
        }, {});
        return options;
      } else {
        return {};
      }
    });

    const coordinateOptions = computed(() => {
      return Object.values(columnOptions.value).reduce(
        (result, fieldObject) => {
          if (fieldObject.type === "number") {
            return {
              ...result,
              [fieldObject.id]: fieldObject,
            };
          } else {
            return result;
          }
        },
        {}
      );
    });

    const openFilePicker = () => {
      if (isReadingFile.value) return;
      fileImportInputRef.value.click();
    };

    const loadSelectedFile = () => {
      if (isReadingFile.value) return;
      const files = fileImportInputRef.value.files;
      if (files && files[0]) {
        processFile(files[0]);
      }
    };
    const showSuccessMessage = () => {
      toast(`File imported successfully`, {
        position: POSITION.BOTTOM_CENTER,
        timeout: 1000,
        hideProgressBar: true
      });
    }
    const processFile = async (file) => {
      const filename = file?.name?.toLowerCase();
      const regex = new RegExp(`.*[.geojson|.json|.csv]`, "i");
      if (filename && regex.test(filename)) {
        isReadingFile.value = true;
        // if (filename.endsWith(".kml")) {
        //   console.log(`Parsing KML`);
        //   try {
        //     await EditorStore.actions.loadKMLFile(file);
        //   } catch (error) {
        //     console.error(error);
        //   }
        //   emit('close');
        // } else 
        if (filename.endsWith(".geojson") || filename.endsWith(".json")) {
          console.log(`Parsing geojson`);
          try {
            await EditorStore.actions.loadGeoJSONFile(file);
            showSuccessMessage();
          } catch (error) {
            console.error(error);
          }
          emit('close');
        } else if (filename.endsWith(".csv")) {
          console.log(`Parsing csv`);
          try {
            const data = await EditorStore.actions.loadCSVFileMetaData(file);
            console.log(data.errors)
            if (data && !data.meta.aborted) {
              csvData.value = {
                filename,
                ...Object.freeze(data),
              };
              fileToLoad.value = file;
              showFooter.value = true;
            } else {
              console.log({ data });
            }
          } catch (error) {
            console.error(error);
          }
        }
        isReadingFile.value = false;
      }
    };

    const loadCSVFeatures = async () => {
      if (!(fileToLoad.value && !isButtonDisabled.value && !isReadingFile.value)) return;
      isReadingFile.value = true;
      try {
        await EditorStore.actions.loadCSVFile({
          file: fileToLoad.value,
          longitudeColumn: longitudeColumn.value,
          latitudeColumn: latitudeColumn.value,
          nameColumn: nameColumn.value,
        });
        showSuccessMessage();
      } catch (error) {
        console.error(error);
      }
      emit("close");
      isReadingFile.value = false;
    };

    const captureDrop = (event) => {
      if (isReadingFile.value) return;
      const { dataTransfer } = event;
      const files = dataTransfer.files;
      if (files && files.length > 0) {
        processFile(files[0]);
      }
    };

    const resetCSVImport = () => {
      fileToLoad.value = null;
      csvData.value = null;
      showFooter.value = false;
    };

    watch(columnOptions, (value) => {
      const columns = Object.values(value);
      const latitudeRegex = new RegExp(`lat`, "i");
      const longitudeRegex = new RegExp(`lon|lng`, `i`);
      const nameRegex = new RegExp(`name`, `i`);
      const maybeLatitudeColumn = columns.find(
        (column) => column.type === "number" && latitudeRegex.test(column.id)
      );
      latitudeColumn.value = maybeLatitudeColumn
        ? maybeLatitudeColumn.id
        : null;
      const maybeLongitudeColumn = columns.find(
        (column) => column.type === "number" && longitudeRegex.test(column.id)
      );
      longitudeColumn.value = maybeLongitudeColumn
        ? maybeLongitudeColumn.id
        : null;
      const maybeNameColumn = columns.find(
        (column) => column.type === "string" && nameRegex.test(column.id)
      );
      nameColumn.value = maybeNameColumn ? maybeNameColumn.id : null;
    });

    onMounted(() => {
      if (props.file) {
        processFile(props.file);
      }
    });

    return {
      tabs: Object.values(tabs),
      activeTab,
      openFilePicker,
      fileImportInputRef,
      loadSelectedFile,
      captureDrop,
      isReadingFile,
      showFooter,
      csvData,
      resetCSVImport,
      columnOptions,
      latitudeColumn,
      longitudeColumn,
      nameColumn,
      isButtonDisabled,
      coordinateOptions,
      loadCSVFeatures,
    };
  },
});
</script>

<style lang="scss" scoped>
.file-import-modal-background {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 9999;
  background: var(--popup-background);
  display: flex;
  align-items: center;
  justify-content: center;

  .import-modal {
    display: flex;
    flex-direction: column;
    width: 500px;
    background: var(--color-secondary);
    border-radius: 6px;

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 10px 0 10px;
      border-bottom: 1px solid var(--border-color);

      .tabs {
        display: flex;
        flex-direction: row;
        align-items: center;

        .tab {
          padding: 10px 15px 13px 15px;
          font-weight: 500;
          border-bottom: 2px solid transparent;
          opacity: 0.7;
          border-radius: 6px 6px 0 0;

          &:hover {
            cursor: pointer;
            background: var(--color-secondary-light);
            opacity: 1;
          }

          &.active {
            // border-bottom: 2px solid var(--font-color);
            opacity: 1;
          }
        }
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
      display: flex;
      flex-direction: column;
      padding: 10px;

      .csv-options {
        display: flex;
        flex-direction: column;

        .content-header {
          display: flex;
          align-items: center;
          padding: 10px;
          background: var(--color-secondary-light);
          border-radius: 6px;

          .icon-wrapper {
            width: 40px;
            height: 40px;
            background: var(--color-primary-light);
            color: var(--color-primary);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .texts {
            flex: 1;
            padding: 0 15px;

            h4 {
              font-weight: 500;
            }

            p {
              font-size: 0.8rem;
              color: var(--font-color);
            }
          }

          .clear-btn {
            display: flex;
            align-items: center;
            border: 0;
            background: 0;
            padding: 5px;
            border-radius: 6px;
            color: var(--color-primary);

            &:hover {
              cursor: pointer;
              background: var(--color-secondary-light);
            }
          }
        }

        .import-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          column-gap: 10px;
        }

        .input-wrapper {
          display: flex;
          flex-direction: column;
          margin-top: 10px;

          label {
            margin-bottom: 5px;
            font-size: 0.8rem;
            font-weight: 500;
          }

          a {
            color: var(--color-primary);
          }

          .help-text {
            margin-top: 10px;
            color: var(--font-color-light);
          }
        }

        .error-hint {
          color: var(--color-error);
        }
      }

      .drop-zone {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 250px;
        background: var(--color-secondary-light);
        border-radius: 6px;
        border: 2px dashed var(--color-input-border);

        &.disabled {
          border: 2px solid var(--color-primary-light);
        }

        .icon-wrapper {
          background: var(--color-primary-light);
          color: var(--color-primary);
          width: 70px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          margin-bottom: 15px;
          opacity: 0.7;
        }

        .progress-bar {
          top: 0;
          width: 100px;
          margin-top: 20px;
          min-height: 2px;
          max-height: 2px;
          height: 2px;
          background: repeating-linear-gradient(
            to right,
            var(--color-primary-light) 0%,
            var(--color-primary-light) 50%,
            var(--color-primary) 100%
          );
          background-size: 200% auto;
          background-position: 0 100%;
          animation: gradient 1s infinite;
          animation-fill-mode: forwards;
          animation-timing-function: linear;
        }

        @keyframes gradient {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        .texts {
          display: flex;
          flex-direction: column;

          h4 {
            font-weight: 500;
          }

          p {
            text-align: center;
            color: var(--font-color-light);
          }
        }

        &:hover {
          cursor: pointer;
          border: 2px dashed var(--color-primary);
          .icon-wrapper {
            opacity: 1;
          }
        }
      }
    }

    .footer {
      display: flex;
      flex-direction: row;
      align-content: center;
      justify-content: flex-end;
      padding: 10px;
      border-top: 1px solid var(--border-color);
    }
  }
}
</style>
