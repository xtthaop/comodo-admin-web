<template>
  <div class="login-container">
    <div class="login-card">
      <el-form :model="loginForm" ref="loginForm" :rules="rules">
        <div class="login-card-title">
          <img class="logo" src="@/assets/logo.png" />
          <h1 class="title">{{ systemName }}</h1>
        </div>

        <el-form-item prop="username">
          <el-input
            ref="username"
            tabindex="1"
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
            clearable
            maxlength="64"
          ></el-input>
        </el-form-item>

        <el-tooltip :visible="capsTootip" content="已开启大写锁定" placement="top">
          <el-form-item prop="password">
            <el-input
              ref="password"
              tabindex="2"
              v-model="loginForm.password"
              placeholder="请输入密码"
              show-password
              prefix-icon="el-icon-lock"
              clearable
              @keyup="checkCapslock"
              @blur="capsTootip = false"
              @keyup.enter="handleLogin"
              maxlength="20"
            ></el-input>
          </el-form-item>
        </el-tooltip>

        <el-popover placement="top" width="350" :visible="captchaVisible">
          <SliderCaptcha
            ref="captcha"
            @verify="verify"
            v-model:captchaVisible="captchaVisible"
          ></SliderCaptcha>
          <template #reference>
            <el-button type="primary" @click="handleLogin" style="width: 100%">登录</el-button>
          </template>
        </el-popover>
      </el-form>
    </div>
  </div>
</template>

<script>
import SliderCaptcha from './components/SliderCaptcha.vue'
import { systemName } from '@/settings.js'

export default {
  name: 'LoginPage',
  components: {
    SliderCaptcha,
  },
  data() {
    return {
      systemName,
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      capsTootip: false,
      rules: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
      },
      redirect: undefined,
      otherQuery: {},
      captchaVisible: false,
    }
  },
  mounted() {
    this.$refs.username.focus()
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true,
    },
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.captchaVisible = true
        } else {
          return false
        }
      })
    },
    verify(x) {
      const password = this.loginForm.password
      const username = this.loginForm.username
      const data = {
        username,
        password: this.md5Password(password),
        x,
      }

      this.$store
        .dispatch('user/login', data)
        .then(() => {
          this.$refs.captcha.handleVerifySuccess()
          setTimeout(() => {
            this.captchaVisible = false
            this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
          }, 300)
        })
        .catch((error) => {
          if (error.code === 4021) {
            // 用户名密码不匹配
            this.captchaVisible = false
            this.$refs.captcha.handleVerifyFail(true)
          } else {
            this.$refs.captcha.handleVerifyFail()
          }
        })
    },
    checkCapslock(e) {
      const { key } = e
      this.capsTootip = key && key.length === 1 && key >= 'A' && key <= 'Z'
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
  },
}
</script>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  min-height: 100%;
  background-color: #ebeff5;
  overflow: hidden;

  .login-card {
    position: relative;
    width: 380px;
    margin: 130px auto 0;
    padding: 100px 50px 80px;
    background: #fff;
    border: 1px solid #c7cbd3;
    border-radius: 5px;

    .login-card-title {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 50px;

      .logo {
        width: 39px;
        height: 39px;
        margin-right: 12px;
      }

      .title {
        display: inline-block;
        margin: 0;
        font-weight: 600;
        line-height: 50px;
        font-size: 22px;
        font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      }
    }
  }
}
</style>
