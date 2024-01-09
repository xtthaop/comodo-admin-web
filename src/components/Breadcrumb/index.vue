<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="resolveKey(item)">
        <span v-if="index == levelList.length - 1" class="no-redirect">{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import { mapGetters } from 'vuex'
import { compile } from 'path-to-regexp'
import utils from '@/layout/components/Sidebar/components/utils'

export default {
  name: 'BaseBreadcrumb',
  mixins: [utils],
  data() {
    return {
      levelList: null,
    }
  },
  computed: {
    ...mapGetters(['permissionroutes']),
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith('/redirect/')) {
        return
      }
      this.getBreadcrumb()
    },
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getMatched(routes, sign, array) {
      for (let i = 0; i < routes.length; i++) {
        if (routes[i].meta?.id === sign || routes[i].path === sign) {
          array.unshift(routes[i])
          return true
        } else {
          if (routes[i].children && routes[i].children.length > 0) {
            const res = this.getMatched(routes[i].children, sign, array)
            if (res) {
              array.unshift(routes[i])
              return true
            }
          }
        }
      }
    },
    getBreadcrumb() {
      const matched = []
      const lastMatched = this.$route.matched[this.$route.matched.length - 1]
      this.getMatched(this.permissionroutes, lastMatched.meta?.id || lastMatched.path, matched)
      this.levelList = matched.filter((item) => item.meta?.title)
    },
    // 深层次嵌套的路由跳转到存在动态参数的上一级时可根据此函数匹配到上一级参数
    pathCompile(path) {
      const { params } = this.$route
      var toPath = compile(path)
      return toPath(params)
    },
    handleLink(item) {
      const { path, meta, children } = item
      if (meta.type === 'F') {
        this.$router.push(this.pathCompile(children[0].path))
        return
      }
      this.$router.push(this.pathCompile(path))
    },
  },
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
