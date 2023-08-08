<template>
  <div v-if="!item.hidden">
    <template v-if="hasNoShowingChild(item.children)">
      <AppLink v-if="item.meta" :to="resolvePath(item)">
        <el-menu-item :index="resolvePath(item)" :class="{ 'submenu-title-no-dropdown': !isNest }">
          <MenuItem :icon="item.meta.icon" :title="item.meta.title"></MenuItem>
        </el-menu-item>
      </AppLink>
    </template>

    <el-sub-menu v-else :index="resolvePath(item)">
      <template v-if="item.meta" #title>
        <MenuItem :icon="item.meta.icon" :title="item.meta.title"></MenuItem>
      </template>

      <SidebarItem
        v-for="child in item.children"
        :key="resolveKey(child)"
        :is-nest="true"
        :item="child"
        class="nest-menu"
      ></SidebarItem>
    </el-sub-menu>
  </div>
</template>

<script>
import MenuItem from './Item.vue'
import AppLink from './Link.vue'
import FixiOSBug from './FixiOSBug'
import utils from './utils'

export default {
  name: 'SidebarItem',
  mixins: [FixiOSBug, utils],
  components: { MenuItem, AppLink },
  props: {
    item: {
      type: Object,
      required: true,
    },
    isNest: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    hasNoShowingChild(children = []) {
      const showingChildren = children.filter((item) => {
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
        const id = item.meta?.id || ''
        return `path-${id}`
      }

      return item.path
    },
  },
}
</script>
