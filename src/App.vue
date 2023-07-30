<template>
  <!-- 
    layout 控制是否显示侧边栏等布局
    值类型必须为 true 或者 false
  -->
  <div id="app">
    <template v-if="layout === false">
      <router-view />
    </template>
    <template v-else-if="layout === true">
      <!-- <Layout /> -->
    </template>
  </div>
</template>

<script>
// import Layout from './layout/index.vue'

export default {
  name: 'App',
  components: {
    // Layout,
  },
  computed: {
    layout() {
      return this.$route.meta.layout
    },
  },
}
</script>
