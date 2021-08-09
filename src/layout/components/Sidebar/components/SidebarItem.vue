<template>
  <div v-if="!item.hidden">
    <template v-if="hasNoShowingChild(item.children)">
      <AppLink v-if="item.meta" :to="resolvePath(item)">
        <el-menu-item :index="resolvePath(item)" :class="{ 'submenu-title-noDropdown' : !isNest }">
          <Item :icon="item.meta.icon || (item.meta && item.meta.icon)" :title="item.meta.title"></Item>
        </el-menu-item>
      </AppLink>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item)">
      <template slot="title">
        <Item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title"></Item>
      </template>

      <SidebarItem
        v-for="child in item.children"
        :key="resolveKey(child)"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child)"
        class="nest-menu"
      ></SidebarItem>
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {
    hasNoShowingChild(children = []) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          return true
        }
      })

      if (showingChildren.length === 0) {
        return true
      }

      return false
    },
    resolvePath(item) {
      if (!item.path) {
        return String(item.meta && item.meta.id)
      }

      if (isExternal(item.path)) {
        return item.path
      }

      if (isExternal(this.basePath)) {
        return this.basePath
      }

      return path.resolve(this.basePath, item.path)
    },
    resolveKey(route) {
      const path = route.path ? route.path : ''
      const id = (route.meta && route.meta.id) ? route.meta.id : ''
      return '' + path + id
    }
  }
}
</script>
