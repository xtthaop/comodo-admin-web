<template>
  <div v-if="item.hidden"></div>

  <div v-else-if="hasNoShowingChild(item.children)">
    <AppLink v-if="item.meta" :to="resolvePath(item)">
      <el-menu-item :index="resolvePath(item)" :class="{ 'submenu-title-no-dropdown': !isNest }">
        <ItemIcon :icon="item.meta.icon"></ItemIcon>
        <template #title>{{ item.meta.title }}</template>
      </el-menu-item>
    </AppLink>
  </div>

  <el-sub-menu v-else ref="subMenu" :index="resolvePath(item)">
    <template v-if="item.meta" #title>
      <ItemIcon :icon="item.meta.icon"></ItemIcon>
      <span>{{ item.meta.title }}</span>
    </template>

    <SidebarItem
      v-for="child in item.children"
      :key="resolveKey(child)"
      :is-nest="true"
      :item="child"
      class="nest-menu"
    ></SidebarItem>
  </el-sub-menu>
</template>

<script>
import ItemIcon from './ItemIcon.vue'
import AppLink from './Link.vue'
import FixiOSBug from './FixiOSBug'
import utils from './utils'

export default {
  name: 'SidebarItem',
  mixins: [FixiOSBug, utils],
  components: { AppLink, ItemIcon },
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
