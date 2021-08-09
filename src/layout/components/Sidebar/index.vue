<template>
  <div :class="{ hasLogo: showLogo }">
    <Logo v-if="showLogo" :collapse="isCollapse"></Logo>
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
        <SidebarItem 
          v-for="route in permissionroutes"
          :key="resolveKey(route)"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './components/Logo'
import SidebarItem from './components/SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  name: 'Sidebar',
  components: {
    SidebarItem,
    Logo,
  },
  computed: { 
    ...mapGetters([
      'permissionroutes',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    backgroundColor() {
      return this.pageStyle === 'light' ? variables.menuLightBg : variables.menuBg
    },
    menuTextColor() {
      return this.pageStyle === 'light' ? variables.menuLightText : variables.menuText
    },
    pageStyle() {
      return this.$store.state.settings.pageStyle
    },
    isCollapse() {
      return !this.sidebar.opened
    },
  },
  methods: {
    resolveKey(route) {
      const path = route.path ? route.path : ''
      const id = (route.meta && route.meta.id) ? route.meta.id : ''
      return '' + path + id
    }
  }
}
</script>
