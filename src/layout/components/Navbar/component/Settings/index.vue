<template>
  <div class="drawer-container">
    <div>
      <div class="setting-drawer-content">
        <div class="setting-drawer-title">主题</div>
        <el-row :gutter="10" class="setting-drawer-block-checbox">
          <el-radio-group v-model="theme" size="small" style="width: 100%">
            <el-col
              :span="8"
              v-for="item in ['default', 'fire', 'calamus', 'classic', 'light']"
              :key="item"
            >
              <div
                class="setting-drawer-block-checbox-item"
                @click="handleChangeTheme(item)"
                :style="{ borderColor: theme === item ? 'var(--el-color-primary)' : '' }"
              >
                <div class="example-bg" :style="{ backgroundColor: primaryColorDict[item] }"></div>
                <div class="option-content">
                  <el-radio :label="item" style="height: 20px">
                    {{ nameDict[item] }}
                  </el-radio>
                </div>
              </div>
            </el-col>
          </el-radio-group>
        </el-row>
      </div>
      <el-divider />
      <div class="setting-drawer-content">
        <div class="setting-drawer-title">布局</div>
        <div class="drawer-item">
          <span>显示系统标识</span>
          <el-switch v-model="sidebarLogo" class="drawer-switch" />
        </div>
        <div class="drawer-item">
          <span>固定头部导航</span>
          <el-switch v-model="fixedHeader" class="drawer-switch" />
        </div>
        <div class="drawer-item">
          <span>开启标签视图</span>
          <el-switch v-model="tagsView" class="drawer-switch" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import utils from '../../mixins/utils'

export default {
  name: 'SystemSetting',
  mixins: [utils],
  data() {
    return {
      nameDict: {
        default: '默认',
        fire: '花火',
        calamus: '菖蒲',
        classic: '经典',
        light: '明亮',
      },
      primaryColorDict: {
        default: '#0f7af5',
        fire: '#d65c75',
        calamus: '#5d4256',
        classic: '#304156',
        light: '#ffffff',
      },
    }
  },
  computed: {
    theme: {
      get() {
        return this.$store.state.settings.theme
      },
      set(val) {
        this.handleChangeTheme(val)
      },
    },
    fixedHeader: {
      get() {
        return this.$store.state.settings.fixedHeader
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'fixedHeader',
          value: val,
        })
      },
    },
    tagsView: {
      get() {
        return this.$store.state.settings.tagsView
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'tagsView',
          value: val,
        })
      },
    },
    sidebarLogo: {
      get() {
        return this.$store.state.settings.sidebarLogo
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'sidebarLogo',
          value: val,
        })
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 10px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right;
  }
}

.setting-drawer-content {
  .setting-drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
    font-weight: bold;
  }

  .setting-drawer-block-checbox {
    .setting-drawer-block-checbox-item {
      position: relative;
      width: 100%;
      height: 54px;
      margin-bottom: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      cursor: pointer;

      .example-bg {
        height: 30px;
        border-start-start-radius: 5px;
        border-start-end-radius: 5px;
      }

      .option-content {
        height: 24px;
        padding: 0 3px;
        border-top: 1px solid #ddd;
      }
    }
  }
}
</style>
