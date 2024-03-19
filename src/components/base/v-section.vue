<template>
  <section class="options-section">
    <div class="header">
      <h2 :class="['section-title', { bold }]" v-if="title">{{ title }}</h2>
      <div class="header-options">
        <slot name="header"></slot>
      </div>
    </div>
    <div class="section-contents">
      <slot />
    </div>
  </section>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: null,
    },
    bold: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.options-section {
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-bottom: 1px solid var(--color-secondary-light);
  background: var(--color-secondary);

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h2 {
      font-weight: 500;
      padding: 5px 0;
    }
  }

  .section-contents {
    display: flex;
    flex-direction: column;
  }
}
</style>
