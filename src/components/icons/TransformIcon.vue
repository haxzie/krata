<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 4H10L7 1L4 4H6V6H2V8H6V16C6 17.1 6.9 18 8 18H16V20H14L17 23L20 20H18V18H22V16H8V4ZM18 14V8C18 6.9 17.1 6 16 6H10V8H16V14H18Z"
      class="svg-fill"
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
