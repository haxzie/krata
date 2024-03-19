<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.9474 16.5842V13.3158H20.3684V18.1579L9.47368 23L1 14.5263L5.84211 3.63158H10.6842V6.05263H7.41579L3.90526 14.0421L9.95789 20.0947L17.9474 16.5842V16.5842ZM24 3.63158V6.05263H20.3684V9.68421H17.9474V6.05263H14.3158V3.63158H17.9474V0H20.3684V3.63158H24Z"
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
