<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    enable-background="new 0 0 24 24"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    class="svg-fill"
  >
    <!-- <g><rect fill="none" height="24" width="24" /></g> -->
    <g><circle cx="12" cy="12" r="5" /></g>
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
