<template>
  <div class="feature-details">
    <v-section title="Measures" bold>
      <div class="metadata uneditable">
        <dl
          v-for="itemKey in Object.keys(defaultProperties)"
          :key="itemKey"
          class="item"
        >
          <dt>{{ defaultProperties[itemKey].name }}</dt>
          <dd>{{ defaultProperties[itemKey].value }}</dd>
        </dl>
      </div>
    </v-section>
    <v-section title="Custom Properties" bold>
      <template v-if="isShapesEditable" v-slot:header>
        <button class="add-btn" @click="addNewProperty">
          <AddIcon size="20" />
        </button>
      </template>
      <EditablePropertyRow
        v-for="itemKey in [...Object.keys(customProperties)].reverse()"
        :key="itemKey"
        :name="itemKey"
        :value="customProperties[itemKey]"
        @update="
          ({ name, value }) => updateProperty({ itemId: itemKey, name, value })
        "
        :disabled="!isShapesEditable"
        @delete="deleteProperty"
      />
    </v-section>
  </div>
</template>

<script>
import VSection from "@/components/base/v-section.vue";
import { computed } from "vue";
import omit from "lodash/omit";
import { DEFAULT_PROPERTIES } from "@/models/Feature.model";
import { areaFormatter, distanceFormatter } from "@/utils/formatter.js";
import AddIcon from "@/components/icons/AddIcon.vue";
import EditablePropertyRow from "./EditablePropertyRow.vue";
import { useStoreModule } from "@/composables/useStoreModule";

export default {
  components: {
    VSection,
    AddIcon,
    EditablePropertyRow,
  },
  props: {
    feature: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { actions } = useStoreModule("editor");
    const UIStore = useStoreModule("UI");
    const isShapesEditable = computed(() => UIStore.getters.getAccessFlags.isShapesEditable);
    const defaultProperties = computed(() => {
      const { area, distance, perimeter, pointRadius, radiusScale } =
        props.feature.properties;
      const rawMeta = {
        area: area && areaFormatter(area),
        distance: distance && distanceFormatter(distance),
        perimeter: perimeter && distanceFormatter(perimeter),
        radius: pointRadius && `${pointRadius} ${radiusScale}`,
      };
      const meta = Object.keys(rawMeta).reduce((result, key) => {
        if (rawMeta[key]) {
          result.push({
            name: key,
            value: rawMeta[key],
          });
        }
        return result;
      }, []);
      return meta;
    });

    const customProperties = computed(() =>
      omit(props?.feature?.properties, DEFAULT_PROPERTIES)
    );

    const propertyIds = computed(() => Object.keys(props.feature.properties));

    const generateNextPropertyName = (properties) => {
      const regex = new RegExp(`property ([0-9]+)`);
      let currentIndex = 0;
      Object.keys(properties).forEach((key) => {
        if (regex.test(key)) {
          const index = parseInt(key.match(regex)[1]);
          if (index > currentIndex) {
            currentIndex = index;
          }
        }
      });
      return `property ${currentIndex + 1}`;
    };

    const addNewProperty = () => {
      if (!isShapesEditable.value) return;
      const propertyName = generateNextPropertyName(customProperties.value);
      actions.updateFeatureProperties({
        featureId: props.feature?.properties?.id,
        properties: {
          [propertyName]: "",
        },
        shouldSync: true,
      });
    };

    const updateProperty = ({ itemId, name, value }) => {
      actions.updateFeatureProperties({
        featureId: props.feature?.properties?.id,
        properties: propertyIds.value.reduce((result, key) => {
          if (key === itemId) {
            result[name] = value;
          } else {
            result[key] = props.feature?.properties[key];
          }
          return result;
        }, {}),
        replaceProperties: true,
        shouldSync: true,
      });
    };

    const deleteProperty = (name) => {
      actions.updateFeatureProperties({
        featureId: props.feature?.properties?.id,
        properties: propertyIds.value.reduce((result, key) => {
          if (key === name) {
            // do nothing
          } else {
            result[key] = props.feature?.properties[key];
          }
          return result;
        }, {}),
        replaceProperties: true,
        shouldSync: true,
      });
    };

    return {
      defaultProperties,
      customProperties,
      addNewProperty,
      updateProperty,
      deleteProperty,
      isShapesEditable,
    };
  },
};
</script>

<style lang="scss" scoped>
.feature-details {
  display: flex;
  flex-direction: column;
  flex: 1;

  .metadata {
    display: flex;
    flex-direction: column;
    margin-top: 5px;

    .item {
      display: flex;
      padding: 8px 0;
      //   border-bottom: 1px solid var(--color-secondary-light);

      &:last-child {
        border-bottom: none;
      }
      dt,
      dd {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      dt {
        text-transform: capitalize;
      }
    }
  }

  .add-btn {
    border: 0;
    padding: 5px;
    margin: 0;
    background: transparent;
    border-radius: 5px;
    display: flex;

    &:hover {
      cursor: pointer;
      background: var(--color-secondary-light);
    }
  }
}
</style>
