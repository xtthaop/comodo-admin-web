<template>
  <el-dialog v-model="localVisible" :title="title" :width="390" @close="handleClose">
    <div class="confirm-dialog-content">
      <el-icon :class="type"><WarningFilled /></el-icon>
      <span class="text">{{ text }}</span>
    </div>
    <template #footer>
      <el-button @click="handleCancel" :disabled="confirmLoading">取消</el-button>
      <el-button type="primary" @click="handleConfirm" :loading="confirmLoading">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { ElDialog, ElButton, ElIcon } from 'element-plus'
import { WarningFilled } from '@element-plus/icons-vue'
export default {
  name: 'ConfirmDialog',
  components: {
    ElDialog,
    ElButton,
    ElIcon,
    WarningFilled,
  },
  emits: ['update:visible', 'cancel', 'confirm'],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '确认',
    },
    text: {
      type: String,
      default: '您确定要执行此操作吗？',
    },
    type: {
      type: String,
      default: 'warning', // 可选值：'warning', 'info', 'success', 'error'
    },
  },
  data() {
    return {
      localVisible: this.visible,
      confirmLoading: false,
    }
  },
  watch: {
    visible(val) {
      this.localVisible = val
    },
    localVisible(val) {
      this.$emit('update:visible', val)
    },
  },
  methods: {
    handleCancel() {
      this.$emit('cancel')
    },
    handleClose() {
      this.$emit('close')
    },
    handleConfirm() {
      this.confirmLoading = true
      this.$emit('confirm')
    },
  },
}
</script>

<style scoped lang="scss">
.confirm-dialog-content {
  display: flex;
  align-items: center;

  .el-icon {
    margin-right: 5px;
    font-size: 32px;

    &.warning {
      color: #e6a23c;
    }
    &.info {
      color: #909399;
    }
    &.success {
      color: #67c23a;
    }
    &.error {
      color: #f56c6c;
    }
  }

  .text {
    font-size: 16px;
    color: #606266;
  }
}
</style>
