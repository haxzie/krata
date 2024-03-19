<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="2" class="svg-fill" />
    <circle cx="12" cy="12" r="10" class="svg-stroke" stroke-width="2" />
    <rect x="12" y="11" width="7" height="2" class="svg-fill" />
    <path d="M17 15V9L21 12L17 15Z" class="svg-fill" />
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
