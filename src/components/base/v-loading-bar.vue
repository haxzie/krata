<template>
  <div class="continuous-1"></div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.continuous-1 {
  width: 100%;
  height: 5px;
  margin: 5px 0;
  border-radius: 3px;
  background: linear-gradient(90deg, var(--color-primary) 33%, var(--color-primary-white) 50%, var(--color-primary) 66%) var(--color-primary-light);
  background-size: 300% 100%;
  animation: ct1 1s infinite linear;
}

@keyframes ct1 {
  0% {
    background-position: right;
  }
}
</style>
