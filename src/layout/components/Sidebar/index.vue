<template>
  <div :class="{ hasLogo: showLogo }" class="sidebar-container">
    <!-- <SidebarLogo v-if="showLogo" :collapse="isCollapse"></SidebarLogo> -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="backgroundColor"
        :text-color="menuTextColor"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <!-- <SidebarItem
          v-for="route in permissionroutes"
          :key="resolveKey(route)"
          :item="route"
          :base-path="route.path"
        /> -->
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
// import SidebarLogo from './components/Logo.vue'
// import SidebarItem from './components/SidebarItem.vue'
import variables from './variables.module.scss'

export default {
  name: 'BaseSidebar',
  components: {
    // SidebarItem,
    // SidebarLogo,
  },
  props: {
    isLight: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(['permissionroutes', 'sidebar']),
    ...mapState({
      showLogo: (state) => state.settings.sidebarLogo,
    }),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    backgroundColor() {
      return this.isLight ? variables.menuLightBg : variables.menuBg
    },
    menuTextColor() {
      return this.isLight ? variables.menuLightText : variables.menuText
    },
    isCollapse() {
      return !this.sidebar.opened
    },
  },
  data() {
    return {
      variables,
    }
  },
  methods: {
    resolveKey(route) {
      const path = route.path ? route.path : ''
      const id = route.meta && route.meta.id ? route.meta.id : ''
      return '' + path + id
    },
  },
}
</script>

<style lang="scss" scoped>
@import './variables.module.scss';

.sidebar-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: $sideBarWidth !important;
  height: 100%;
  overflow: hidden;
  transition: width 0.28s;
  background-color: $menuBg;
  font-size: 0px;
  z-index: 1001;

  &.light {
    border-right: 1px solid #ececec;
  }
}
</style>
