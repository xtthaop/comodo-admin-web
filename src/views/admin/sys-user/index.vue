<template>
  <div class="app-container">
    <el-card shadow="never" v-loading="loading">
      <el-form ref="queryForm" class="common-query-form" :model="queryParams" :inline="true">
        <el-form-item prop="username">
          <el-input v-model="queryParams.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item prop="phone">
          <el-input v-model="queryParams.phone" placeholder="请输入手机号码" clearable />
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
          <el-button type="primary" icon="el-icon-refresh" @click="handleReset">重置</el-button>
          <el-button
            v-actionpermission="['admin:sysuser:add']"
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd"
            >新增</el-button
          >
        </el-form-item>
      </el-form>

      <el-table :data="userList" border>
        <el-table-column label="ID" width="75" prop="user_id" />
        <el-table-column label="用户名" prop="username" />
        <el-table-column label="昵称" prop="nickname" />
        <el-table-column label="手机号" prop="phone" />
        <el-table-column label="状态">
          <template #default="scope">
            <el-switch
              :key="scope.row.user_id"
              v-actionpermission="['admin:sysuser:status']"
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(scope.row)"
              :disabled="scope.row.username === 'admin'"
            />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="160">
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
              >编辑</el-button
            >
            <el-button
              v-show="scope.row.username !== 'admin'"
              v-actionpermission="['admin:sysuser:remove']"
              link
              type="primary"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
            <el-button
              v-show="scope.row.username !== 'admin'"
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
    <ResetPwdForm ref="resetPwdForm" />
  </div>
</template>

<script>
import UserForm from './components/UserForm.vue'
import ResetPwdForm from './components/ResetPwdForm.vue'
import { getUserList, updateUser, deleteUser } from '@/api/admin/sys-user'

export default {
  name: 'SysUser',
  components: {
    UserForm,
    ResetPwdForm,
  },
  data() {
    return {
      queryParams: {
        page: 1,
        page_size: 10,
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
    handleReset() {
      this.resetForm('queryForm')
      this.handleQuery()
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
      this.baseConfirm(`确认要${text}吗?`)
        .then((done) => {
          updateUser(row)
            .then(() => {
              done()
            })
            .catch(() => {
              done()
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
      this.baseConfirm('确认删除用户？')
        .then((done) => {
          deleteUser({ user_id: item.user_id })
            .then(() => {
              this.$message.success('删除成功')
              this.handleGetUserList()
            })
            .finally(() => {
              done()
            })
        })
        .catch(() => {})
    },
    handleResetPwd(row) {
      this.$refs.resetPwdForm.open(row)
    },
  },
}
</script>
