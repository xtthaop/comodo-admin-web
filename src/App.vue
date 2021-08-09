<template>
  <div id="app">
    <template v-if="layout !== undefined">
      <template v-if="layout === false">
        <router-view />
      </template>
      <template v-else>
        <Layout />
      </template>
    </template>
  </div>
</template>

<script>
import Layout from './layout'

export default {
  name: 'App',
  components: { Layout },
  computed: {
    layout() {
      return this.$route.meta.layout
    }
  }
}
</script>
