<template>
  <div class="login-container">
    <div class="login-card">
      <el-form :model="loginForm" class="login-form" ref="loginForm" :rules="rules">

        <div class="login-card-title">
          <img class="logo" src="@/assets/logo.png" />
          <h1 class="title">comodo-admin</h1>
        </div>

        <el-form-item prop="username">
          <el-input 
            ref="username"
            tabindex="1"
            v-model="loginForm.username" 
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
            clearable
          ></el-input>
        </el-form-item>

        <el-tooltip v-model="capsTootip" content="已开启大写锁定" placement="right" manual>
          <el-form-item prop="password">
            <el-input 
              ref="password"
              tabindex="2"
              v-model="loginForm.password" 
              placeholder="请输入密码" 
              show-password
              prefix-icon="el-icon-lock"
              clearable
              @keyup.native="checkCapslock"
              @blur="capsTootip = false"
              @keyup.enter.native="handleLogin"
            ></el-input>
          </el-form-item>
        </el-tooltip>

        <el-popover
          placement="top"
          title="完成拼图验证"
          width="344"
          trigger="manual"
          v-model="captchaVisible"
        >
          <i :class="['el-icon-close', 'popover-close']" @click="captchaVisible = false"></i>
          <captcha ref="captcha" @verify="verify" :captchaVisible="captchaVisible"></captcha>
          <el-button 
            slot="reference"
            type="primary"
            @click="handleLogin"
            style="width:100%;"
          >登录</el-button>
        </el-popover>

      </el-form>
    </div>
  </div>
</template>

<script>
import Captcha from './components/Captcha'

export default {
  name: 'Login',
  components: {
    Captcha
  },
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      capsTootip: false,
      rules: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      },
      redirect: undefined,
      otherQuery: {},
      captchaVisible: false
    }
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.captchaVisible = true
        } else {
          return false
        }
      })
    },
    verify(x) {
      const password = this.loginForm.password.trim()
      const username = this.loginForm.username.trim()
      const data = { 
        username, 
        password: this.md5Password(password),
        x 
      }

      this.$store.dispatch('user/login', data).then(() => {
        this.$refs.captcha.handleVerifySuccess()
        this.captchaVisible = false
        this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
      }).catch((error) => {
        if (error.code === 4021) {
          this.captchaVisible = false
        }
        this.$refs.captcha.handleVerifyFail()
      })
    },
    checkCapslock(e) {
      const { key } = e
      this.capsTootip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss" scoped>
$bg: #ebeff5;

.login-container {
  width: 100%;
  min-height: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-card {
    position: relative;
    width: 430px;
    margin: 130px auto 0;
    padding: 80px 50px;
    background: #fff;
    border: 1px solid #C7CBD3;
    border-radius: 5px;

    .login-card-title {
      text-align: center;
      margin-bottom: 50px;

      .logo {
        width: 39px;
        height: 39px;
        vertical-align: middle;
        margin-right: 12px;
      }

      .title {
        display: inline-block;
        margin: 0;
        font-weight: 600;
        line-height: 50px;
        font-size: 22px;
        font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
        vertical-align: middle;
      }
    }

    .login-form {
      width: 100%;
      min-width: 100%;
    }
  }
}

.popover-close {
  position: absolute;
  top: 0;
  right: 0;
  padding: 12px;
  font-size: 16px;
  cursor: pointer;
}
</style>
