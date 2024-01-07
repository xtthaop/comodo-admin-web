<template>
  <div class="icon-body">
    <el-input
      v-model="name"
      style="margin-bottom: 10px"
      clearable
      placeholder="搜索图标"
      @clear="filterIcons"
      @input="filterIcons"
    ></el-input>

    <el-tabs tab-position="top" type="border-card">
      <el-tab-pane label="自定义 SVG">
        <div class="icon-list">
          <div
            v-for="(item, index) in iconList"
            class="icon-item"
            :key="index"
            @click="selectedIcon(item)"
          >
            <svg-icon :name="item" style="margin-right: 5px" />
            <span>{{ item }}</span>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Element Icon">
        <div class="icon-list">
          <div
            v-for="(item, index) in elementIconList"
            class="icon-item"
            :key="index"
            @click="selectedElementIcon(item)"
          >
            <el-icon style="margin-right: 5px"><component :is="item" /></el-icon>
            <span>{{ item }}</span>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import icons from './requireIcons'
import elementIcons from './requireElementIcons'
import { toHorizontalLine } from '@/utils/index'

export default {
  name: 'IconSelect',
  data() {
    return {
      name: '',
      iconList: icons,
      elementIconList: elementIcons,
    }
  },
  methods: {
    filterIcons() {
      if (this.name) {
        this.iconList = this.iconList.filter((item) => item.includes(this.name))
        this.elementIconList = this.elementIconList.filter((item) => item.includes(this.name))
      } else {
        this.iconList = icons
        this.elementIconList = elementIcons
      }
    },
    selectedIcon(name) {
      this.$emit('selected', name)
      document.body.click()
    },
    selectedElementIcon(name) {
      this.$emit('selected', `el-icon-${toHorizontalLine(name)}`)
      document.body.click()
    },
    reset() {
      this.name = ''
      this.iconList = icons
    },
  },
}
</script>

<style lang="scss" scoped>
.icon-body {
  width: 100%;
  padding: 10px;

  .icon-list {
    height: 200px;
    overflow-y: scroll;

    .icon-item {
      display: inline-flex;
      align-items: center;
      height: 35px;
      line-height: 35px;
      cursor: pointer;
      width: 33%;
    }

    span {
      fill: currentColor;
      overflow: hidden;
    }
  }
}
</style>
