<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item prop="username">
          <el-input
            v-model="queryParams.username"
            placeholder="请输入用户名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item prop="phone">
          <el-input
            v-model="queryParams.phone"
            placeholder="请输入手机号码"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item prop="status">
          <el-select v-model="queryParams.status" placeholder="用户状态" clearable>
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dict_value"
              :label="dict.dict_label"
              :value="dict.dict_value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button
            v-actionpermission="['admin:sysuser:add']"
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd"
            >新增</el-button
          >
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="userList" border>
        <el-table-column label="ID" width="75" prop="user_id" />
        <el-table-column label="用户名" prop="username" :show-overflow-tooltip="true" />
        <el-table-column label="手机号" prop="phone" />
        <el-table-column label="状态">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template #default="scope">
            <span>{{ parseTime(scope.row.created_at) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260">
          <template #default="scope">
            <el-button
              v-actionpermission="['admin:sysuser:edit']"
              link
              type="primary"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              >修改</el-button
            >
            <el-button
              v-actionpermission="['admin:sysuser:remove']"
              link
              type="primary"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
            <el-button
              v-actionpermission="['admin:sysuser:resetpassword']"
              link
              type="primary"
              icon="el-icon-key"
              @click="handleResetPwd(scope.row)"
              >重置密码</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <BasePagination
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.page_size"
        @pagination="handleGetUserList"
      />
    </el-card>

    <UserForm ref="userForm" :statusOptions="statusOptions" @update="handleGetUserList" />
  </div>
</template>

<script>
import UserForm from './components/UserForm.vue'
import { getUserList, changeUserStatus, deleteUser, resetPassword } from '@/api/admin/sys-user'

export default {
  name: 'SysUser',
  components: {
    UserForm,
  },
  data() {
    return {
      queryParams: {
        page: 1,
        page_size: 10,
        username: undefined,
        phone: undefined,
        status: undefined,
      },
      statusOptions: [],
      loading: false,
      userList: [],
      total: 0,
    }
  },
  created() {
    this.handleGetUserList()
    this.getDicts('sys_normal_disable').then((res) => {
      this.statusOptions = res.data
    })
  },
  methods: {
    handleQuery() {
      this.queryParams.page = 1
      this.handleGetUserList()
    },
    handleGetUserList() {
      this.loading = true
      getUserList(this.queryParams)
        .then((res) => {
          this.total = res.data.total
          this.userList = res.data.sys_user_list
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleAdd() {
      this.$refs.userForm.open()
    },
    handleStatusChange(row) {
      const text = row.status === 0 ? '停用' : '启用'
      this.$confirm(`确认要${text}吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const data = {
            user_id: row.user_id,
            status: row.status,
          }
          changeUserStatus(data).catch(() => {
            row.status = row.status === 0 ? 1 : 0
          })
        })
        .catch(() => {
          row.status = row.status === 0 ? 1 : 0
        })
    },
    handleUpdate(item) {
      this.$refs.userForm.open(item)
    },
    handleDelete(item) {
      this.$confirm('确认删除用户？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteUser({ user_id: item.user_id }).then(() => {
            this.$message.success('删除成功')
            this.handleGetUserList()
          })
        })
        .catch(() => {})
    },
    validateNewPassword(value) {
      if (!value) {
        return false
      } else {
        return true
      }
    },
    handleResetPwd(row) {
      this.$prompt('请输入"' + row.username + '"的新密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: this.validateNewPassword,
        inputErrorMessage: '新密码不能为空',
      })
        .then(({ value }) => {
          const data = {
            user_id: row.user_id,
            new_password: this.md5Password(value),
          }
          resetPassword(data).then(() => {
            this.$message.success('修改成功')
          })
        })
        .catch(() => {})
    },
  },
}
</script>
