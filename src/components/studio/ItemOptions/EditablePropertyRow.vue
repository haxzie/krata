<template>
  <div class="editable-wrapper">
    <form class="editable-property-row" @submit.prevent="updateProperty">
      <input
        ref="propNameRef"
        v-model="propName"
        type="text"
        placeholder="Name"
        :class="['prop-name', { disabled }]"
        @blur="updateProperty"
        tabindex="0"
        :readonly="disabled"
        required
      />
      <input
        ref="propValueRef"
        v-model="propValue"
        type="text"
        placeholder="Empty"
        :class="['prop-value', { disabled }]"
        @blur="updateProperty"
        :readonly="disabled"
        tabindex="0"
        required
      />
      <input v-show="false" type="submit" name="" id="" />
      <button
        type="button"
        class="more-button"
        tabindex="0"
        @click="openDropDownOptions"
      >
        <more-icon :size="18" />
      </button>
    </form>
    <div
      v-if="showEditableOptions"
      class="editable-options"
      v-click-away="
        () => {
          showEditableOptions = false;
        }
      "
    >
      <div
        class="item"
        v-for="option in options"
        :key="option.id"
        @click="selectAction(option.id)"
      >
        <span>{{ option.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import MoreIcon from "@/components/icons/MoreIcon.vue";
import { ref, computed, watch } from "vue";

export default {
  props: {
    name: {
      type: String,
      default: "",
    },
    value: {
      type: [String, Number],
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    MoreIcon,
  },
  setup(props, { emit }) {
    const propName = ref(props.name);
    const propNameRef = ref(null);
    const propValue = ref(props.value);
    const propValueRef = ref(null);
    const showEditableOptions = ref(false);

    const editableOptions = computed(() => ({
      copyValue: {
        id: "copyValue",
        name: "Copy Value",
      },
      delete: {
        id: "delete",
        name: "Delete",
        hide: props.disabled,
      },
    }));
    const displayEditOptions = computed(() =>
      Object.values(editableOptions.value).filter((item) => !item.hide)
    );

    watch(props, (props) => {
      propName.value = props.name;
      propValue.value = props.value;
    });

    const openDropDownOptions = () => {
      if (!showEditableOptions.value) {
        showEditableOptions.value = true;
      }
    };

    const copyValue = () => {
      navigator?.clipboard?.writeText(`${props.value}`);
    };

    const selectAction = (action) => {
      switch (action) {
        case editableOptions.value.delete.id:
          emit("delete", props.name);
          break;
        case editableOptions.value.copyValue.id:
          copyValue();
          break;
      }
      showEditableOptions.value = false;
    };

    const updateProperty = () => {
      emit("update", { name: propName.value, value: propValue.value });
    };
    return {
      updateProperty,
      propName,
      propValue,
      propNameRef,
      propValueRef,
      options: displayEditOptions.value,
      showEditableOptions,
      openDropDownOptions,
      selectAction,
    };
  },
};
</script>

<style lang="scss" scoped>
.editable-wrapper {
  display: flex;
  flex-direction: column;
  position: relative;

  .editable-options {
    display: flex;
    flex-direction: column;
    max-height: 300px;
    overflow: auto;
    border: 1px solid var(--border-color);
    border-radius: 3px;
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
    background: var(--color-secondary);
    position: absolute;
    top: 35px;
    right: 0;
    width: 100px;
    z-index: 9;

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
.editable-property-row {
  display: grid;
  flex-direction: row;
  align-items: center;
  grid-template-columns: 1fr 1fr auto;
  padding: 5px 0;

  input {
    height: 20px;
    outline: none;
    border: 0;
    padding: 3px 2px;
    size: 2;
    min-width: 0;
    background: var(--color-secondary);
    border: 2px solid transparent;
    flex: 1;

    &:focus {
      border: 2px solid var(--color-primary);
    }

    &.prop-name {
      margin-right: 10px;
    }

    &.disabled {
      pointer-events: none;
    }
  }

  .more-button {
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
