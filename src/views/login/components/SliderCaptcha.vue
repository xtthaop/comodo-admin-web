<template>
  <div class="captcha-container">
    <div class="header">
      <div>
        <span style="margin-right: 5px">完成拼图验证</span>
        <span style="color: #409eff; cursor: pointer" @click="canvasInt">换一张</span>
      </div>
      <el-icon
        style="font-size: 1.2em; cursor: pointer"
        @click="$emit('update:captchaVisible', false)"
      >
        <Close />
      </el-icon>
    </div>
    <div class="img-container">
      <canvas id="puzzle" width="320" height="170" :style="{ left: puzzleLeft }"></canvas>
      <canvas id="img" width="320" height="170"></canvas>
    </div>
    <div class="slider-container" id="slider">
      <div class="status" :style="status"><span v-show="!btnShow">拼接成功！</span></div>
      <div class="btn" @mousedown.prevent="drag" :style="btnStyle" v-show="btnShow">
        <el-icon><Right /></el-icon>
      </div>
      <div class="track">向右滑动完成拼图</div>
    </div>
  </div>
</template>

<script>
import { getJigsaw } from '@/api/user'

export default {
  name: 'SliderCaptcha',
  emits: ['update:captchaVisible', 'verify'],
  props: {
    captchaVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      puzzleLeft: 0,
      btnStyle: {
        left: 0,
        transition: '',
      },
      downX: 0,
      offset: 0,
      status: {
        width: 0,
        background: '#67C23A',
        transition: '',
      },
      btnShow: true,
    }
  },
  watch: {
    captchaVisible(val) {
      if (val) {
        this.btnShow = true
        this.puzzleLeft = 0
        this.btnStyle.left = 0
        this.status.width = 0
        this.canvasInt()
      }
    },
  },
  methods: {
    canvasInt() {
      getJigsaw().then((res) => {
        this.draw(res.data)
      })
    },
    draw(imgInfo) {
      const imgDom = document.querySelector('#img')
      const imgCtx = imgDom.getContext('2d')

      const puzzleDom = document.querySelector('#puzzle')
      const puzzleCtx = puzzleDom.getContext('2d')

      // 重绘清空画布
      imgDom.height = 170
      puzzleDom.height = 170

      const dstImg = new Image()
      const jigsawImg = new Image()

      dstImg.src = imgInfo.dst_img
      jigsawImg.src = imgInfo.jigsaw_img

      dstImg.onload = () => {
        imgCtx.drawImage(dstImg, 0, 0, 320, 170)
      }

      jigsawImg.onload = () => {
        puzzleCtx.drawImage(jigsawImg, 2, imgInfo.y, 50, 50)
      }
    },
    drag(e) {
      this.downX = e.x

      this.btnStyle.transition = ''
      this.status.transition = ''
      this.status.background = '#67C23A'

      document.getElementById('slider').addEventListener('mousemove', this.move)
      document.addEventListener('mouseup', this.up)
    },
    move(e) {
      this.offset = e.x - this.downX

      if (this.offset >= 320 - 52 || this.offset <= 0) return

      this.puzzleLeft = this.offset + 'px'
      this.btnStyle.left = this.offset + 'px'
      this.status.width = this.offset + 50 + 'px'
    },
    up() {
      document.getElementById('slider').removeEventListener('mousemove', this.move)
      document.removeEventListener('mouseup', this.up)

      this.$emit('verify', this.offset)
    },
    handleVerifySuccess() {
      this.btnShow = false
      this.status.width = '100%'
    },
    handleVerifyFail() {
      this.btnStyle.transition = 'left 1s'
      this.status.transition = 'width 1s'
      this.status.background = '#F56C6C'
      this.status.width = '50px'
      this.puzzleLeft = 0
      this.btnStyle.left = 0
      this.canvasInt()
    },
  },
}
</script>

<style lang="scss" scoped>
.captcha-container {
  width: 320px;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;
  }

  .img-container {
    position: relative;
    width: 320px;
    height: 170px;
    background-color: #eee;
    border-radius: 8px;
    overflow: hidden;

    #img,
    #puzzle {
      width: 100%;
      height: 100%;
    }

    #puzzle {
      position: absolute;
      top: 0;
    }
  }

  .slider-container {
    position: relative;
    width: 320px;
    margin-top: 10px;

    .status {
      position: absolute;
      left: 0;
      top: 0;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-radius: 20px;
      font-size: 14px;
      color: #fff;
    }

    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: -6px;
      width: 52px;
      height: 52px;
      background: #409eff;
      border-radius: 100%;
      cursor: pointer;

      i {
        font-size: 24px;
        color: #fff;
      }
    }

    .track {
      width: 320px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background: #ebeef5;
      border-radius: 20px;
      font-size: 14px;
      color: #606266;
    }
  }
}
</style>
