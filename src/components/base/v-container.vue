<template>
  <div :class="['container', { small }, { xs }]">
      <slot/>
  </div>
</template>

<script>
export default {
  props: {
    small: {
      type: Boolean,
      default: false
    },
    xs: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
    display: block;
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;

    &.small {
      max-width: 900px;
    }

    &.xs {
      max-width: 600px;
    }
}
</style>