<template>
  <div class="app-wrapper" :class="classObj">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    ></div>
    <BaseSidebar></BaseSidebar>
    <div :class="{ hasTagsView: needTagsView }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <BaseNavbar></BaseNavbar>
        <!-- <TagsView v-if="needTagsView" /> -->
      </div>
      <!-- <AppMain></AppMain> -->
    </div>
  </div>
</template>

<script>
import { BaseSidebar, BaseNavbar } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'MainLayout',
  components: {
    BaseSidebar,
    BaseNavbar,
    // AppMain,
    // TagsView,
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapGetters(['sidebar']),
    ...mapState({
      device: (state) => state.app.device,
      needTagsView: (state) => state.settings.tagsView,
      fixedHeader: (state) => state.settings.fixedHeader,
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile',
      }
    },
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
  },
}
</script>

<style lang="scss" scoped>
@import './components/Sidebar/variables.module.scss';

.app-wrapper {
  position: relative;
  width: 100%;
  height: 100%;

  // 暂时看不出有什么用
  // &.mobile.openSidebar {
  //   position: fixed;
  //   top: 0;
  // }
}

.drawer-bg {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0.3;
  z-index: 999;
}

.main-container {
  min-height: 100%;
  transition: margin-left 0.28s;
  margin-left: $sideBarWidth;
  position: relative;
}

.hideSidebar {
  .main-container {
    margin-left: $sideBarHideWidth;
  }
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
  z-index: 9;
}

.hideSidebar .fixed-header {
  width: calc(100% - #{$sideBarHideWidth});
}

.mobile .fixed-header {
  width: 100%;
}
</style>
