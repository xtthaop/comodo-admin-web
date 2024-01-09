<template>
  <div class="navbar">
    <BaseHamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <BaseBreadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="hover" :show-timeout="200">
        <div class="avatar-wrapper">
          <div class="avatar">
            <span>{{ firstOfUsername }}</span>
          </div>
          <el-icon class="caret-bottom"><CaretBottom /></el-icon>
        </div>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleModifyPassword">修改密码</el-dropdown-item>
            <el-dropdown-item v-if="showSettings" @click.stop="settingVisible = !settingVisible"
              >系统设置</el-dropdown-item
            >
            <el-dropdown-item divided @click="handleLogOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <ResetPwdForm ref="modifyForm" @logout="handleLogOut"></ResetPwdForm>

    <el-drawer
      v-model="settingVisible"
      direction="rtl"
      :append-to-body="true"
      :show-close="false"
      :with-header="false"
      :size="260"
    >
      <SystemSettings />
    </el-drawer>
  </div>
</template>

<script>
import SystemSettings from './component/Settings/index.vue'
import { mapGetters, mapState } from 'vuex'
import ResetPwdForm from './component/ResetPwdForm.vue'
import BaseHamburger from '@/components/Hamburger/index.vue'
import BaseBreadcrumb from '@/components/Breadcrumb/index.vue'

export default {
  name: 'BaseNavbar',
  components: {
    ResetPwdForm,
    BaseHamburger,
    BaseBreadcrumb,
    SystemSettings,
  },
  data() {
    return {
      settingVisible: false,
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'username']),
    ...mapState({
      showSettings: (state) => state.settings.showSettings,
    }),
    firstOfUsername() {
      return this.username.substr(0, 1).toUpperCase()
    },
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async handleLogOut() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    handleModifyPassword() {
      this.$refs.modifyForm.open()
    },
  },
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  background-color: #f5f5f5;

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: all 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    display: flex;
    align-items: center;
    height: 100%;

    .avatar-container {
      cursor: pointer;
      margin-right: 20px;

      :deep(.el-tooltip__trigger:focus-visible) {
        outline: unset;
      }

      .avatar-wrapper {
        display: flex;
        align-items: center;

        .avatar {
          display: inline-block;
          width: 30px;
          height: 30px;
          background: #333;
          border-radius: 5px;
          text-align: center;
          transition: all 0.1s;

          span {
            color: #fff;
            line-height: 30px;
            font-size: 16px;
          }
        }

        .caret-bottom {
          margin-left: 5px;
        }
      }
    }
  }
}
</style>
