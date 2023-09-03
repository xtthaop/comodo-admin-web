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
      <el-dropdown
        class="avatar-container"
        trigger="hover"
        @visible-change="(val) => (avatarDropdown = val)"
        :show-timeout="0"
      >
        <div class="avatar-wrapper">
          <div class="avatar" :style="{ background: avatarBackground }">
            <span>{{ firstOfUsername }}</span>
          </div>
          <i class="el-icon-caret-bottom"></i>
        </div>

        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="handleModifyPassword">修改密码</el-dropdown-item>
          <el-dropdown-item @click.native="handleLogOut">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div
        class="setting-wrapper"
        :style="{ background: theme }"
        v-if="showSettings"
        @click.stop="settingVisible = !settingVisible"
      >
        <i class="el-icon-setting"></i>
      </div>
    </div>

    <ResetPwdForm ref="modifyForm" @logout="handleLogOut"></ResetPwdForm>

    <RightPanel v-if="showSettings" :show.sync="settingVisible">
      <Settings />
    </RightPanel>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel/index.vue'
import Settings from './component/Settings/index.vue'
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
    RightPanel,
    Settings,
  },
  data() {
    return {
      settingVisible: false,
      avatarDropdown: false,
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
    theme() {
      return this.$store.state.settings.theme
    },
    avatarBackground() {
      return this.avatarDropdown ? this.theme : '#333'
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
    height: 100%;

    .avatar-container {
      float: right;
      cursor: pointer;
      margin-right: 20px;

      .avatar-wrapper {
        .avatar {
          display: inline-block;
          width: 30px;
          height: 30px;
          margin-top: 10px;
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

        i {
          vertical-align: top;
          line-height: 50px;
          margin-left: 5px;
        }
      }
    }

    .setting-wrapper {
      float: right;
      width: 30px;
      height: 30px;
      margin-top: 10px;
      margin-right: 15px;
      border-radius: 5px;
      text-align: center;
      cursor: pointer;

      i {
        line-height: 30px;
        color: #fff;
      }
    }
  }
}
</style>
