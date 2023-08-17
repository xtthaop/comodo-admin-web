<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="resolveKey(item)">
        <span
          v-if="item.redirect === 'noRedirect' || index == levelList.length - 1"
          class="no-redirect"
          >{{ item.meta.title }}</span
        >
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import { compile } from 'path-to-regexp'

export default {
  data() {
    return {
      levelList: null,
    }
  },
  computed: {
    routes() {
      return this.$store.state.permission.routes
    },
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
        if (routes[i].children && routes[i].children.length > 0) {
          const res = this.getMatched(routes[i].children, sign, array)
          if (res) {
            array.unshift(routes[i])
            return true
          }
        } else {
          if ((routes[i].meta && routes[i].meta.id === sign) || routes[i].path === sign) {
            array.unshift(routes[i])
            return true
          }
        }
      }
    },
    getBreadcrumb() {
      let matched = []
      const lastMatched = this.$route.matched[this.$route.matched.length - 1]
      this.getMatched(
        this.routes,
        (lastMatched.meta && lastMatched.meta.id) || lastMatched.path,
        matched
      )

      const first = matched[0]

      if (!this.isDashboard(first)) {
        matched = [{ path: '/dashboard', meta: { title: '首页' } }].concat(matched)
      }

      this.levelList = matched.filter(
        (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false
      )
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    },
    pathCompile(path) {
      const { params } = this.$route
      var toPath = compile(path)
      return toPath(params)
    },
    handleLink(item) {
      const { redirect, path, meta } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      if (meta.type === 'M') {
        return
      }
      this.$router.push(this.pathCompile(path))
    },
    resolveKey(item) {
      const path = item.path ? item.path : ''
      const id = item.meta && item.meta.id ? item.meta.id : ''
      return '' + path + id
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
