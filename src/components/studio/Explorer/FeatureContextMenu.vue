<template>
  <div
    class="context-menu"
    :style="{
      top: `${y + 10}px`,
      left: `${x + 10}px`,
    }"
  >
    <div class="options">
      <div
        class="option"
        v-for="item in options"
        :key="item.id"
        @click="selectOption(item.id)"
      >
        <component :is="item.icon" size="18" class="icon" />
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
import PinIcon from "@/components/icons/PinIcon.vue";
import ShapeIcon from "@/components/icons/ShapeIcon.vue";
import LineIcon from "@/components/icons/LineIcon.vue";
import TransformIcon from "@/components/icons/TransformIcon.vue";
import DeleteIcon from "@/components/icons/DeleteIcon.vue";
import SearchIcon from "@/components/icons/SearchIcon.vue";
import CopyIcon from "@/components/icons/CopyIcon.vue";
import { useStoreModule } from "@/composables/useStoreModule.js";

export default {
  components: {
    PinIcon,
    ShapeIcon,
    LineIcon,
    DeleteIcon,
    CopyIcon,
    TransformIcon,
    SearchIcon,
  },
  props: {
    x: {
      type: Number,
      default: 0,
    },
    y: {
      type: Number,
      default: 0,
    },
    features: {
      type: Array,
    },
  },
  setup(props, { emit }) {
    const options = [
      {
        id: "delete",
        icon: "DeleteIcon",
        name: "Delete",
      },
    ];

    const { actions } = useStoreModule("editor");
    const selectOption = (itemId) => {
      switch (itemId) {
        case "delete":
          actions.deleteSelectedFeatures();
          break;
      }
      emit("close");
    };

    return { options, selectOption };
  },
};
</script>

<style lang="scss" scoped>
.context-menu {
  width: 200px;
  background: var(--color-secondary);
  position: absolute;
  z-index: 99;
  border-radius: 2px;
  border: 1px solid var(--color-secondary-light);
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
  // transition: 0.01s ease-in-out;

  .options {
    display: flex;
    flex-direction: column;

    .option {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 10px;

      .icon {
        margin-right: 10px;
      }

      &:hover {
        background: var(--color-secondary-light);
        cursor: pointer;
      }
    }
  }
}
</style>
