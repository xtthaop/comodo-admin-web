<template>
  <div id="tags-view-container" class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper" @scroll="handleScroll">
      <div id="draggable-tags">
        <router-link
          v-for="tag in visitedViews"
          ref="tag"
          class="tags-view-item"
          :key="tag.fullPath"
          :class="isActive(tag) ? 'active' : ''"
          :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
          @contextmenu.prevent="openMenu(tag, $event)"
        >
          {{ tag.title }}
          <el-icon
            v-if="!isAffix(tag) && isActive(tag)"
            class="el-icon-close"
            @click.prevent.stop="closeSelectedTag(tag)"
          >
            <Close />
          </el-icon>
        </router-link>
      </div>
    </scroll-pane>
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">刷新当前标签页</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">关闭当前标签页</li>
      <li @click="closeOthersTags">关闭其他标签页</li>
      <li @click="closeAllTags(selectedTag)">关闭所有标签页</li>
    </ul>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import ScrollPane from './ScrollPane.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'TagsView',
  components: { ScrollPane },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: [],
    }
  },
  computed: {
    ...mapGetters(['permissionroutes']),
    visitedViews: {
      get() {
        return this.$store.state.tagsView.visitedViews
      },
      set(value) {
        this.$store.dispatch('tagsView/updateList', value)
      },
    },
  },
  watch: {
    $route() {
      this.addTags()
      this.moveToCurrentTag()
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    },
  },
  mounted() {
    this.initTags()
    this.addTags()
    this.initDraggable()
  },
  beforeUnmount() {
    if (this._sortable !== undefined) this._sortable.destroy()
  },
  methods: {
    initDraggable() {
      const el = document.getElementById('draggable-tags')
      const sortableOptions = {
        group: 'draggable-tags',
        animation: 500,
        ghostClass: 'ghost',
        onUpdate: this.onDragUpdate,
      }
      this._sortable = new Sortable(el, sortableOptions)
    },
    onDragUpdate(evt) {
      const { oldIndex, newIndex } = evt
      const newList = [...this.visitedViews]
      newList.splice(newIndex, 0, newList.splice(oldIndex, 1)[0])
      this.visitedViews = newList
      this.$refs.tag.splice(newIndex, 0, this.$refs.tag.splice(oldIndex, 1)[0])
    },
    isActive(route) {
      return route.fullPath === this.$route.fullPath
    },
    isAffix(tag) {
      return tag.meta && tag.meta.affix
    },
    filterAffixTags(routes) {
      let tags = []
      routes.forEach((route) => {
        if (route.meta && route.meta.affix) {
          const tagPath = route.path
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta },
          })
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })
      return tags
    },
    initTags() {
      const affixTags = (this.affixTags = this.filterAffixTags(this.permissionroutes))
      for (const tag of affixTags) {
        this.$store.dispatch('tagsView/addVisitedView', tag)
        if (tag.name) {
          this.$store.dispatch('tagsView/addCachedView', tag)
        }
      }
    },
    addTags() {
      const { name } = this.$route
      this.$store.dispatch('tagsView/addVisitedView', this.$route)
      if (name) {
        this.$store.dispatch('tagsView/addCachedView', this.$route)
      }
      return false
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.fullPath === this.$route.fullPath) {
            this.$refs.scrollPane.moveToTarget(tag)
            break
          }
        }
      })
    },
    refreshSelectedTag(view) {
      this.$store.dispatch('tagsView/delCachedView', view).then(() => {
        const { path, query } = view
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + path,
            query,
          })
        })
      })
    },
    closeSelectedTag(view) {
      this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          this.toLastView(visitedViews, view)
        }
      })
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag)
      this.$store.dispatch('tagsView/delOthersViews', this.selectedTag)
    },
    closeAllTags(view) {
      this.$store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
        if (this.affixTags.some((tag) => tag.fullPath === view.fullPath)) {
          return
        }
        this.toLastView(visitedViews, view)
      })
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView.fullPath)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.path, query: view.query })
        } else {
          this.$router.push('/')
        }
      }
    },
    openMenu(tag, e) {
      const menuMinWidth = 116
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 15

      if (left > maxLeft) {
        this.left = left - menuMinWidth - 30
      } else {
        this.left = left
      }

      this.top = e.clientY
      this.visible = true
      this.selectedTag = tag
    },
    closeMenu() {
      this.visible = false
    },
    handleScroll() {
      this.closeMenu()
    },
  },
}
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #eee;

  .tags-view-wrapper {
    display: flex;
    align-items: center;

    .tags-view-item {
      display: inline-flex;
      align-items: center;
      position: relative;
      cursor: pointer;
      height: 25px;
      line-height: 25px;
      border: 1px solid #e4e7ed;
      border-radius: 5px;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 10px;
      }
      &:last-of-type {
        margin-right: 10px;
      }
      &.active {
        color: var(--el-color-primary);
        border-color: var(--el-color-primary);
      }

      .el-icon-close {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        text-align: center;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        transform-origin: 100% 50%;
        margin-left: 8px;
        &:hover {
          background-color: #fe5f57;
          color: #fff;
        }
      }
    }
  }
  .contextmenu {
    position: absolute;
    margin: 0;
    background: #fff;
    z-index: 3000;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 5px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 1px 2px 10px #ccc;
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #e6f4ff;
      }
    }
  }
}

.ghost {
  opacity: 0;
}
</style>
