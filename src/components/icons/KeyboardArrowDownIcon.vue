<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.41 8.59L12 13.17L16.59 8.59L18 10L12 16L6 10L7.41 8.59Z"
      class="svg-fill"
      fill-opacity="0.81"
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
