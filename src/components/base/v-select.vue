<template>
  <div class="dropdown">
    <div class="dropdown-select" @click="openDropDownOptions">
      <span :class="[{ placeholder: !selectedItem }]">{{
        selectedItem && selectedItem.name ? selectedItem.name : placeholder
      }}</span>
      <keyboard-arrow-down-icon
        :class="['icon', { rotate: showDropDownOptions }]"
        size="18"
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
        v-for="(item, index) in getOptions"
        :key="`${index}_${item.id}`"
        class="item"
        @click="selectItem(item.id)"
      >
        <span>{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import KeyboardArrowDownIcon from "@/components/icons/KeyboardArrowDownIcon.vue";
import { computed, defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    value: {
      type: String,
    },
    options: {
      type: Object,
      required: true,
    },
    placeholder: {
      type: String,
      default: "Choose Option",
    },
  },
  components: {
    KeyboardArrowDownIcon,
  },
  setup(props, { emit }) {
    const showDropDownOptions = ref(false);

    const selectedItem = computed(() => {
      return props.value ? props.options[props.value] : null;
    });

    const getOptions = computed(() => {
      return Object.values(props.options);
    });

    const openDropDownOptions = () => {
      if (!showDropDownOptions.value) {
        showDropDownOptions.value = true;
      }
    };

    const selectItem = (itemId) => {
      emit("select", itemId);
      showDropDownOptions.value = false;
    };

    return {
      selectedItem,
      getOptions,
      showDropDownOptions,
      openDropDownOptions,
      selectItem,
    };
  },
});
</script>

<style lang="scss" scoped>
.dropdown {
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;

  .dropdown-select {
    background-color: transparent;
    border: 1px solid var(--color-input-border);
    background: transparent;
    color: var(--font-color);
    padding: 10px 10px 10px 15px;
    border-radius: 6px;
    filter: none;
    outline: none !important;
    transition: 0.3s border ease-in-out;
    size: 1;
    flex: 1;
    display: flex;
    align-items: center;

    &:focus {
      border-color: var(--color-accent);
    }

    &:invalid {
      border-color: var(--color-error);
    }

    span {
      flex: 1;
      padding: 0;
      margin: 0;

      &.placeholder {
        opacity: 0.5;
      }
    }

    .icon {
      transition: 0.1s all ease-in-out;
      &.rotate {
        transform: rotate(180deg);
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
    max-height: 200px;
    overflow: auto;
    border: 1px solid var(--border-color);
    border-radius: 3px;
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
    background: var(--color-secondary);
    position: absolute;
    top: 40px;
    left: 0;
    width: 100%;
    z-index: 9;
    box-sizing: border-box;

    .item {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 5px;
      border-radius: 3px;

      span {
        margin-left: 10px;
        flex: 1;
      }

      &:hover {
        cursor: pointer;
        background: var(--color-secondary-light);
      }
    }
  }
}
</style>
