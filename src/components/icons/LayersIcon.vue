<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.99167 15.45L3.85 10.675L2.5 11.725L10 17.5583L17.5 11.725L16.1417 10.6667L9.99167 15.45ZM10 13.3333L16.1333 8.55834L17.5 7.5L10 1.66667L2.5 7.5L3.85833 8.55834L10 13.3333Z"
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
