<template>
  <avatar :size="size" :variant="variant" :name="name" :colors="colors" />
</template>

<script>
import Avatar from "vue-boring-avatars";
export default {
  components: {
    Avatar,
  },
  props: {
    colors: {
      type: Array,
      default: () => ["#92A1C6", "#1c83c7", "#F0AB3D", "#27be84", "#db7b21"],
    },
    name: {
      type: String,
      default: "krata",
    },
    variant: {
      type: String,
      default: "beam",
    },
    size: {
      type: [String, Number],
      default: 24,
    },
  },
};
</script>

<style>
.test {
  color: #92A1C6 #1c83c7 #F0AB3D #27be84 #db7b21;
}
</style>
