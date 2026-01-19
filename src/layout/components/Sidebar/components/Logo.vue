<template>
  <div class="sidebar-logo-container" :class="{ collapse }">
    <transition name="sidebar-logo-fade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img class="sidebar-logo" src="/logo.png" />
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img class="sidebar-logo" src="/logo.png" />
        <h1 class="sidebar-title">{{ systemName }}</h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
import { systemName } from '@/settings'
import { mapGetters } from 'vuex'

export default {
  name: 'SidebarLogo',
  data() {
    return {
      systemName,
    }
  },
  computed: {
    ...mapGetters(['sidebar']),
    collapse() {
      return !this.sidebar.opened
    },
  },
}
</script>

<style lang="scss" scoped>
.sidebar-logo-fade-enter-active {
  transition: opacity 1.5s;
}

.sidebar-logo-fade-enter-from,
.sidebar-logo-fade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  overflow: hidden;
  background-color: var(--sidebar-logo-bg);

  .sidebar-logo-link {
    height: 100%;
    width: 100%;

    .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    .sidebar-title {
      display: inline-block;
      margin: 0;
      color: var(--sidebar-title-color);
      font-weight: 600;
      line-height: 50px;
      font-size: 15px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
