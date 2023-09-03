<template>
  <div v-if="item.hidden"></div>

  <div v-else-if="hasNoShowingChild(item.children)">
    <AppLink v-if="item.meta" :to="resolvePath(item)">
      <el-menu-item :index="resolveIndex(item)" :class="{ 'submenu-title-no-dropdown': !isNest }">
        <ItemIcon :icon="item.meta.icon"></ItemIcon>
        <template #title>{{ item.meta.title }}</template>
      </el-menu-item>
    </AppLink>
  </div>

  <el-sub-menu
    v-else
    ref="subMenu"
    :index="resolveIndex(item)"
    :popper-class="`sidebar-popper ${pageStyle}`"
    :popper-offset="12"
  >
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
import FixiOSBug from './FixiOSBug' // 待验证
import utils from './utils'
import { isExternal } from '@/utils/validate'
import { mapState } from 'vuex'

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
  computed: {
    ...mapState({
      pageStyle: (state) => state.settings.pageStyle,
    }),
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
    resolveIndex(item) {
      if (item.path && isExternal(item.path)) {
        return null
      }

      if (!item.path) {
        const id = item.meta?.id || ''
        return `path-${id}`
      }

      return item.path
    },
  },
}
</script>
