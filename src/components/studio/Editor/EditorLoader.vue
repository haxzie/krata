<template>
  <div class="loader-component">
    <logo size="40" />
    <div class="progress-bar"></div>
  </div>
</template>

<script>
import Logo from "@/components/icons/AppLogo.vue";

export default {
  components: {
    Logo,
  },
};
</script>

<style lang="scss" scoped>
.loader-component {
  width: 100%;
  height: 100%;
  background: var(--color-secondary-light);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .progress-bar {
    top: 0;
    width: 100px;
    margin-top: 20px;
    min-height: 2px;
    max-height: 2px;
    height: 2px;
    background: repeating-linear-gradient(
      to right,
      var(--color-primary-light) 0%,
      var(--color-primary-light) 50%,
      var(--color-primary) 100%
    );
    background-size: 200% auto;
    background-position: 0 100%;
    animation: gradient 1s infinite;
    animation-fill-mode: forwards;
    animation-timing-function: linear;
  }

  @keyframes gradient {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
}
</style>
