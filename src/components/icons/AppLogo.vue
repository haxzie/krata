<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 1000 1000"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_134_117)">
      <path
        d="M373.688 790.337V80.1596L82.8362 205.957V918.811L373.688 790.337Z"
        fill-opacity="0.33"
        class="svg-fill"
      />
      <path
        d="M373.688 790.337V80.1596L624.391 204.173V917.027L373.688 790.337Z"
        class="svg-fill"
      />
      <path
        d="M915.242 796.582V80.1596L624.391 204.173V917.027L915.242 796.582Z"
        fill-opacity="0.33"
        class="svg-fill"
      />
    </g>
    <defs>
      <clipPath id="clip0_134_117">
        <rect width="1000" height="1000" class="svg-fill" />
      </clipPath>
    </defs>
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
