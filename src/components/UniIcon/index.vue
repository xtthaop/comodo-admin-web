<template>
  <i v-if="icon" class="el-icon">
    <template v-if="isElIcon">
      <component :is="icon" class="sub-el-icon"></component>
    </template>
    <template v-else>
      <svg-icon :name="icon"></svg-icon>
    </template>
  </i>
</template>

<script>
const elIconRE = /^el-icon/

export default {
  name: 'UniIcon',
  props: {
    icon: {
      type: String,
      default: '',
    },
  },
  computed: {
    isElIcon() {
      return elIconRE.test(this.icon)
    },
  },
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
