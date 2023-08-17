<template>
  <div class="sidebar-container" :class="classObj">
    <SidebarLogo v-if="showLogo"></SidebarLogo>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="false"
        :collapse-transition="false"
        :style="styleObj"
        mode="vertical"
      >
        <SidebarItem v-for="route in permissionroutes" :key="resolveKey(route)" :item="route" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import SidebarLogo from './components/Logo.vue'
import SidebarItem from './components/SidebarItem.vue'
import variables from './variables.module.scss'
import utils from './components/utils'

export default {
  name: 'BaseSidebar',
  mixins: [utils],
  components: {
    SidebarItem,
    SidebarLogo,
  },
  computed: {
    ...mapGetters(['permissionroutes', 'sidebar']),
    ...mapState({
      showLogo: (state) => state.settings.sidebarLogo,
      pageStyle: (state) => state.settings.pageStyle,
    }),
    classObj() {
      return {
        hasLogo: this.showLogo,
        light: this.isLight,
      }
    },
    styleObj() {
      const {
        menuLightText,
        menuText,
        menuLightActiveText,
        menuActiveText,
        menuLightBg,
        menuBg,
        menuHoverBg,
        menuLightHoverBg,
      } = variables

      return {
        '--el-menu-text-color': this.isLight ? menuLightText : menuText,
        '--el-menu-active-color': this.isLight ? menuLightActiveText : menuActiveText,
        '--el-menu-bg-color': this.isLight ? menuLightBg : menuBg,
        '--el-menu-hover-bg-color': this.isLight ? menuLightHoverBg : menuHoverBg,
      }
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    isLight() {
      return this.pageStyle === 'light'
    },
    isCollapse() {
      return !this.sidebar.opened
    },
  },
}
</script>

<style lang="scss">
@import './variables.module.scss';

.hideSidebar {
  .sidebar-container {
    width: $sideBarHideWidth !important;
  }
}

// 全局样式
.sidebar-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: $sideBarWidth !important;
  height: 500px;
  overflow: hidden;
  transition: width 0.28s;
  font-size: 0px;
  z-index: 1001;
  // 自定义背景色
  background-color: $menuBg;
  // 自定义边框
  border-right: 1px solid $menuBg;

  &.light {
    // 自定义背景色
    background-color: $menuLightBg;
    // 自定义边框
    border-right: 1px solid #ececec;
  }

  &.hasLogo {
    .el-scrollbar {
      height: calc(100% - 50px) !important;
    }
  }

  .el-scrollbar {
    height: 100%;
  }

  .el-menu {
    width: 100% !important;
    height: 100%;
    // 不显示边框
    border: none;
  }

  a {
    display: inline-block;
    width: 100%;
    overflow: hidden;
  }

  .scrollbar-wrapper {
    overflow-x: hidden !important;
  }

  // 永远不显示水平滚动条
  .el-scrollbar__bar.is-horizontal {
    display: none;
  }
  // 竖直滚动条紧贴右边框显示
  .el-scrollbar__bar.is-vertical {
    right: 0;
  }
}
</style>
