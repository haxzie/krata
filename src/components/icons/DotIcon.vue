<template>
  <svg
    :width="size"
    :height="size"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    class="svg-fill"
  >
    <path d="M24 24H0V0h24v24z" fill="none" />
    <circle cx="12" cy="12" r="8" />
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
