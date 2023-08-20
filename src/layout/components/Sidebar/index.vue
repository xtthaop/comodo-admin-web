<template>
  <div class="sidebar-container" :class="classObj">
    <SidebarLogo v-if="showLogo"></SidebarLogo>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="false"
        :collapse-transition="false"
        :popperEffect="pageStyle"
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
        subMenuBg,
        subMenuLightBg,
        subMenuHover,
        subMenuLightHover,
        menuActiveBg,
        menuLightActiveBg,
      } = variables

      return {
        '--el-menu-text-color': this.isLight ? menuLightText : menuText,
        '--el-menu-active-color': this.isLight ? menuLightActiveText : menuActiveText,
        '--el-menu-bg-color': this.isLight ? menuLightBg : menuBg,
        '--el-menu-hover-bg-color': this.isLight ? menuLightHoverBg : menuHoverBg,
        '--el-menu-active-bg-color': this.isLight ? menuLightActiveBg : menuActiveBg,
        '--el-sub-menu-bg-color': this.isLight ? subMenuLightBg : subMenuBg,
        '--el-sub-menu-hover-bg-color': this.isLight ? subMenuLightHover : subMenuHover,
        '--el-menu-item-height': '40px',
        '--el-menu-sub-item-height': '40px',
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
// 注意这里是全局样式

@import './variables.module.scss';

.hideSidebar {
  .sidebar-container {
    width: $sideBarHideWidth !important;
  }
}

.sidebar-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: $sideBarWidth !important;
  height: 100%;
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
    // 不显示边框
    border: none;
  }

  // 水平方向超出容器范围则隐藏
  .scrollbar-wrapper {
    padding-left: 3px;
    padding-right: 2px;
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

  // 自定义菜单样式
  .el-menu-item,
  .el-sub-menu__title {
    margin: 5px 0;
    border-radius: 10px;
  }

  // 自定义选中菜单背景样式
  .el-menu-item.is-active {
    background-color: var(--el-menu-active-bg-color);
  }

  // 自定义子菜单样式
  .el-sub-menu > .el-menu {
    margin-left: -3px;
    margin-right: -3px;
    // 创建 BFC
    overflow: hidden;
    // 自定义背景色
    background-color: var(--el-sub-menu-bg-color);

    .nest-menu {
      padding-left: 3px;
      padding-right: 4px;
    }

    // 自定义鼠标移上去的背景色
    .el-menu-item:not(.is-active):hover,
    .el-sub-menu__title:not(.is-active):hover {
      background-color: var(--el-sub-menu-hover-bg-color);
    }
  }
  .el-sub-menu.is-active .el-sub-menu__title {
    color: var(--el-menu-active-color);
  }
}

// 折叠菜单时弹出菜单样式一致
</style>
