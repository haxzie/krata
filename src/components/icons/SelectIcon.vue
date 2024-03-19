<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 3L10 22L12.051 15.846C12.3455 14.9623 12.8418 14.1592 13.5005 13.5005C14.1592 12.8418 14.9623 12.3455 15.846 12.051L22 10L3 3Z"
      stroke="white"
      stroke-width="2"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script>
export default {
    props: {
        size: {
            type: [String, Number],
            default: "24"
        }
    }
};
</script>

<style></style>
