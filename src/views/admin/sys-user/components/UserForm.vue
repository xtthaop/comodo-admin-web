<template>
  <div>
    <el-dialog
      :title="title"
      v-model="dialogVisible"
      :close-on-click-modal="false"
      :draggable="true"
      width="600px"
    >
      <el-form ref="userForm" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="登录名" prop="username">
              <el-input
                v-model="form.username"
                placeholder="请输入用户登录名"
                :disabled="disabled"
                maxlength="64"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-show="form.user_id === undefined" label="密码" prop="password">
              <el-input
                v-model="form.password"
                show-password
                placeholder="请输入用户密码"
                type="password"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="nickname">
              <el-input v-model="form.nickname" placeholder="请输入用户姓名" maxlength="64" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号码" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="128" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户性别" prop="sex">
              <el-select v-model="form.sex" placeholder="请选择">
                <el-option
                  v-for="dict in sexOptions"
                  :key="dict.dict_value"
                  :label="dict.dict_label"
                  :value="dict.dict_value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status" :disabled="disabled">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dict_value"
                  :label="Number(dict.dict_value)"
                  >{{ dict.dict_label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="角色" prop="role_ids">
              <el-select
                v-model="form.role_ids"
                multiple
                placeholder="请选择"
                @change="$forceUpdate()"
                :disabled="disabled"
                style="width: 100%"
              >
                <el-option
                  v-for="item in roleOptions"
                  :key="item.role_id"
                  :label="item.role_name"
                  :value="item.role_id"
                  :disabled="item.status === 0"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="form.remark"
                type="textarea"
                placeholder="请输入内容"
                maxlength="255"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList } from '@/api/admin/sys-role'
import { addUser, updateUser } from '@/api/admin/sys-user'

export default {
  name: 'UserForm',
  props: {
    statusOptions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      title: '',
      dialogVisible: false,
      form: {
        status: 1,
      },
      rules: {
        username: [{ required: true, message: '登录名不能为空', trigger: 'blur' }],
        nickname: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度需在 6 到 20 个字符', trigger: 'blur' },
        ],
        email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
        phone: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur',
          },
        ],
      },
      sexOptions: [],
      roleOptions: [],
      disabled: false,
    }
  },
  created() {
    this.handleGetRole()
    this.getDicts('sys_user_sex').then((response) => {
      this.sexOptions = response.data
    })
  },
  methods: {
    open(item) {
      this.dialogVisible = true
      this.reset()
      if (!item) {
        this.title = '新增用户'
      } else {
        if (item.username === 'admin') {
          this.disabled = true
        }
        this.$nextTick(() => {
          Object.assign(this.form, item)
        })
        this.title = '编辑用户'
      }
    },
    reset() {
      this.form.user_id = undefined
      this.form.role_ids = []
      this.disabled = false
      this.resetForm('userForm')
    },
    handleGetRole() {
      getRoleList().then((res) => {
        this.roleOptions = res.data.sys_role_list
      })
    },
    submitForm() {
      if (!this.form.user_id) {
        this.handleAddUser()
      } else {
        this.handleUpdateUser()
      }
    },
    handleAddUser() {
      const data = Object.assign({}, this.form)
      data.password = this.md5Password(data.password)
      addUser(data).then(() => {
        this.$message.success('新增成功')
        this.$emit('update')
        this.dialogVisible = false
      })
    },
    handleUpdateUser() {
      updateUser(this.form).then(() => {
        this.$message.success('修改成功')
        this.$emit('update')
        this.dialogVisible = false
      })
    },
    cancel() {
      this.dialogVisible = false
    },
  },
}
</script>
