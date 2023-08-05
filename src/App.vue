<template>
  <!-- 
    hasLayout 控制是否显示侧边栏等页面布局
    值类型必须为 true 或者 false
  -->
  <template v-if="hasLayout === false">
    <router-view />
  </template>
  <template v-else-if="hasLayout === true">
    <MainLayout />
  </template>
</template>

<script>
import MainLayout from './layout/index.vue'

export default {
  name: 'App',
  components: {
    MainLayout,
  },
  computed: {
    hasLayout() {
      return this.$route.meta.layout
    },
  },
}
</script>
