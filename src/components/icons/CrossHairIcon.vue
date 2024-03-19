<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="8" class="svg-stroke" stroke-width="2" />
    <!-- <circle cx="12" cy="12" r="3" class="svg-stroke" stroke-width="2" /> -->
    <path
      d="M12 1V6"
      class="svg-stroke"
      stroke-width="2"
      stroke-linecap="round"
    />
    <path
      d="M12 18V23"
      class="svg-stroke"
      stroke-width="2"
      stroke-linecap="round"
    />
    <path
      d="M6 12L1 12"
      class="svg-stroke"
      stroke-width="2"
      stroke-linecap="round"
    />
    <path
      d="M23 12L18 12"
      class="svg-stroke"
      stroke-width="2"
      stroke-linecap="round"
    />
  </svg>
</template>

<script>
export default {
  props: {
    size: {
      type: [String, Number],
      default: "24",
    },
  },
};
</script>

<style></style>
