<template>
  <div>
    <el-dialog :title="title" v-model="dialogVisible" width="600px">
      <el-form ref="resetPwdForm" :model="form" :rules="rules">
        <el-form-item label="" prop="new_password">
          <el-input
            v-model="form.new_password"
            show-password
            placeholder="请输入新密码"
            type="password"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancel" :disabled="submitLoading">取 消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitLoading">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { resetPassword } from '@/api/admin/sys-user'

export default {
  name: 'ResetPwdForm',
  data() {
    return {
      title: '重置密码',
      dialogVisible: false,
      submitLoading: false,
      form: {},
      rules: {
        new_password: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { min: 6, max: 20, message: '新密码长度需在 6 到 20 个字符', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    open(item) {
      this.dialogVisible = true
      this.reset()
      this.title = `请输入用户 ${item.username} 的新密码`
      this.form.user_id = item.user_id
    },
    reset() {
      this.resetForm('resetPwdForm')
    },
    submitForm() {
      this.$refs['resetPwdForm'].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          const data = {}
          data.user_id = this.form.user_id
          data.new_password = this.md5Password(this.form.new_password)
          resetPassword(data)
            .then(() => {
              this.$message.success('密码重置成功')
              this.dialogVisible = false
            })
            .finally(() => {
              this.submitLoading = false
            })
        }
      })
    },
    cancel() {
      this.dialogVisible = false
    },
  },
}
</script>
