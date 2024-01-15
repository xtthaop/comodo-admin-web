<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
  },
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50 = navbar = 50 */
  min-height: calc(100vh - 50px);
  width: 100%;
  background-color: #f9f9f9;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  min-height: 100vh;
  padding-top: 50px;
}

.has-tags-view {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    min-height: 100vh;
    padding-top: 84px;
  }
}
</style>
