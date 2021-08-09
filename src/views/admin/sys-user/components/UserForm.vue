<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="600px"
    >
      <el-form ref="userForm" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="20">
           <el-col :span="12">
            <el-form-item label="用户名称" prop="username">
              <el-input v-model="form.username" placeholder="请输入用户名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.user_id === undefined" label="用户密码" prop="password">
              <el-input v-model="form.password" show-password placeholder="请输入用户密码" type="password" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号码" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户性别">
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
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dict_value"
                  :label="dict.dict_value"
                >{{ dict.dict_label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色">
              <el-select v-model="form.role_ids" multiple placeholder="请选择" @change="$forceUpdate()">
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
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
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
    }
  },
  data(){
    return {
      title: '',
      dialogVisible: false,
      form: {},
      rules: {
        username: [{ required: true, message: '用户名称不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '用户密码不能为空', trigger: 'blur' }],
        email: [
          { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
          { type: 'email', message: "'请输入正确的邮箱地址", trigger: ['blur', 'change'] }
        ],
        phone: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ]
      },
      sexOptions: [],
      roleOptions: [],
    }
  },
  created() {
    this.handleGetRole()
    this.getDicts('sys_user_sex').then(response => {
      this.sexOptions = response.data
    })
  },
  methods: {
    open(item) {
      if (!item) {
        this.reset()
        this.title = '新增用户'
      } else {
        this.form = Object.assign({}, item)
        this.form.status = String(this.form.status)
        this.form.role_ids = this.form.role_list.map(item => item.role_id)
        this.title = '编辑用户'
      }
      this.dialogVisible = true
    },
    reset() {
      this.form = {
        user_id: undefined,
        username: undefined,
        password: undefined,
        phone: undefined,
        email: undefined,
        sex: undefined,
        status: '1',
        remark: undefined,
        role_ids: []
      }
      this.resetForm('userForm')
    },
    handleGetRole() {
      getRoleList().then(res => {
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
      this.reset()
      this.dialogVisible = false
    }
  }
}
</script>
