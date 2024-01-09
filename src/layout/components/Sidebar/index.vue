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
        [this.pageStyle]: true,
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
    isCollapse() {
      return !this.sidebar.opened
    },
  },
}
</script>

<style lang="scss">
// 注意这里是全局样式
@import './variables.module.scss';

@mixin custom-style($isLight: false) {
  --el-menu-text-color: #{if($isLight, $menuLightText, $menuText)};
  --el-menu-active-color: #{if($isLight, $menuLightActiveText, $menuActiveText)};
  --el-menu-bg-color: #{if($isLight, $menuLightBg, $menuBg)};
  --el-menu-hover-bg-color: #{if($isLight, $menuLightHoverBg, $menuHoverBg)};
  --el-menu-active-bg-color: #{if($isLight, $menuLightActiveBg, $menuActiveBg)};
  --el-sub-menu-bg-color: #{if($isLight, $subMenuLightBg, $subMenuBg)};
  --el-sub-menu-hover-bg-color: #{if($isLight, $subMenuLightHover, $subMenuHover)};

  --el-menu-item-height: 40px;
  --el-menu-sub-item-height: 40px;
  --el-menu-base-level-padding: 8px;

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

  // 自定义选中菜单父级样式
  .el-sub-menu.is-active > .el-sub-menu__title {
    color: var(--el-menu-active-color);
  }
}

.closeSidebar {
  .sidebar-container {
    width: $sideBarCloseWidth !important;
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

  background-color: $menuBg;
  border-right: 1px solid $menuBg;
  @include custom-style($isLight: false);

  &.light {
    background-color: $menuLightBg;
    border-right: 1px solid #ececec;
    @include custom-style($isLight: true);
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
    // 清除边框
    border: none;
  }

  // 设置自定义填充
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

  // 自定义子菜单样式
  .el-sub-menu > .el-menu {
    margin-left: -3px;
    margin-right: -3px;
    // 创建 BFC 消除上下外边距重叠导致的抖动
    overflow: hidden;
    // 自定义背景色
    background-color: var(--el-sub-menu-bg-color);

    // 没有子节点时不显示消除空页面夹点击时抖动问题
    &:empty {
      display: none;
    }

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
}

// 清除弹出框的边框和背景
.sidebar-popper {
  border: none !important;
  background-color: transparent !important;
}

// 折叠菜单时弹出菜单保持样式一致
.sidebar-popper {
  @include custom-style($isLight: false);

  &.light {
    @include custom-style($isLight: true);
  }

  .el-menu--popup {
    // 创建 BFC
    border: 1px solid transparent !important;
    padding: 0 3px;
    border-radius: 10px;
  }
}

// 移动端
.mobile {
  .sidebar-container {
    transition: transform 0.28s;
    width: $sideBarWidth !important;
  }

  // 如果菜单处于折叠状态则将菜单移动到可视范围之外
  &.closeSidebar {
    .sidebar-container {
      pointer-events: none;
      transition-duration: 0.3s;
      transform: translate3d(-$sideBarWidth, 0, 0);
    }
  }
}

// 动态效果控制
.withoutAnimation .sidebar-container {
  transition: none;
}
</style>
