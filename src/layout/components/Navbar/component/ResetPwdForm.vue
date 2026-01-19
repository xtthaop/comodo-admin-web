<template>
  <div>
    <el-dialog :title="title" v-model="dialogVisible" width="600px" :append-to-body="true">
      <el-form ref="resetPwdForm" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="旧密码" prop="old_password">
          <el-input
            v-model="form.old_password"
            show-password
            placeholder="请输入旧密码"
            type="password"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item label="新密码" prop="new_password">
          <el-input
            v-model="form.new_password"
            show-password
            placeholder="请输入新密码"
            type="password"
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirm_password">
          <el-input
            v-model="form.confirm_password"
            show-password
            placeholder="请确认密码"
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
import { changePassword } from '@/api/user'

export default {
  name: 'ResetPwdForm',
  data() {
    const equalToNewPassword = (rule, value, callback) => {
      if (this.form.new_password !== value) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }

    return {
      title: '修改密码',
      dialogVisible: false,
      form: {},
      rules: {
        old_password: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
        new_password: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { min: 6, max: 20, message: '长度需在 6 到 20 个字符', trigger: 'blur' },
        ],
        confirm_password: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { required: true, validator: equalToNewPassword, trigger: 'blur' },
        ],
      },
      submitLoading: false,
    }
  },
  methods: {
    open() {
      this.reset()
      this.dialogVisible = true
    },
    reset() {
      this.resetForm('resetPwdForm')
    },
    submitForm() {
      this.$refs['resetPwdForm'].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          const data = {}
          for (let key in this.form) {
            data[key] = this.md5Password(this.form[key])
          }
          changePassword(data)
            .then(() => {
              this.$message.success('密码修改成功！请重新登录！')
              this.submitLoading = false
              this.dialogVisible = false
              setTimeout(async () => {
                await this.$store.dispatch('user/reset')
                location.reload()
              }, 300)
            })
            .catch(() => {
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
