<template>
  <div class="errPage-container">
    <el-button class="pan-back-btn" @click="back">返回首页</el-button>
    <el-row>
      <el-col :span="12">
        <h2 class="text-jumbo text-ginormous">OOPS!</h2>
        <h3>您没有该页面的权限，请联系管理员</h3>
      </el-col>
      <el-col :span="12">
        <img :src="errGif" width="313" height="428" alt="Girl has dropped her ice cream." />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import errGif from '@/assets/401_images/401.gif'

export default {
  name: 'ErrorPage401',
  data() {
    return {
      errGif: errGif,
    }
  },
  methods: {
    back() {
      this.$router.push('/')
    },
  },
}
</script>

<style lang="scss" scoped>
.errPage-container {
  width: 800px;
  max-width: 100%;
  margin: 100px auto;
  .pan-back-btn {
    background: #008489;
    color: #fff;
    border: none !important;
  }
  .pan-gif {
    margin: 0 auto;
    display: block;
  }
  .pan-img {
    display: block;
    margin: 0 auto;
    width: 100%;
  }
  .text-jumbo {
    font-size: 60px;
    font-weight: 700;
    color: #484848;
  }
  .list-unstyled {
    font-size: 14px;
    li {
      padding-bottom: 5px;
    }
    a {
      color: #008489;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
