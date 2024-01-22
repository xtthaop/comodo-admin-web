<template>
  <div class="app-container">
    <el-card shadow="never">
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item prop="role_name">
          <el-input
            v-model="queryParams.role_name"
            placeholder="请输入角色名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item prop="role_key">
          <el-input
            v-model="queryParams.role_key"
            placeholder="请输入角色标识"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item prop="status">
          <el-select v-model="queryParams.status" placeholder="角色状态" clearable>
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
            v-actionpermission="['admin:sysrole:add']"
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd"
            >新增</el-button
          >
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="roleList" border>
        <el-table-column label="ID" prop="role_id" width="80" />
        <el-table-column label="角色名称" prop="role_name" :show-overflow-tooltip="true" />
        <el-table-column label="角色标识" prop="role_key" :show-overflow-tooltip="true" />
        <el-table-column label="排序" prop="role_sort" align="center" width="80" />
        <el-table-column label="状态" width="120" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              :disabled="scope.row.role_key === 'admin'"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="created_at" align="center" width="160">
          <template #default="scope">
            <span>{{ parseTime(scope.row.created_at) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="left" width="220">
          <template #default="scope">
            <el-button
              v-actionpermission="['admin:sysrole:update']"
              link
              type="primary"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              >修改</el-button
            >
            <el-button
              v-if="scope.row.role_key !== 'admin'"
              v-actionpermission="['admin:sysrole:remove']"
              link
              type="primary"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <BasePagination
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.page_size"
        @pagination="handleGetRoleList"
      />
    </el-card>

    <RoleForm ref="roleForm" :statusOptions="statusOptions" @update="handleGetRoleList" />
  </div>
</template>

<script>
import RoleForm from './components/RoleForm.vue'
import { getRoleList, deleteRole, updateRole } from '@/api/admin/sys-role'

export default {
  name: 'SysRole',
  components: {
    RoleForm,
  },
  data() {
    return {
      queryParams: {
        page: 1,
        page_size: 10,
        role_name: undefined,
        role_key: undefined,
        status: undefined,
      },
      statusOptions: [],
      loading: false,
      roleList: [],
      total: 0,
    }
  },
  created() {
    this.handleGetRoleList()
    this.getDicts('sys_normal_disable').then((res) => {
      this.statusOptions = res.data
    })
  },
  methods: {
    handleQuery() {
      this.queryParams.page = 1
      this.handleGetRoleList()
    },
    handleGetRoleList() {
      this.loading = true
      getRoleList(this.queryParams)
        .then((res) => {
          this.roleList = res.data.sys_role_list
          this.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleAdd() {
      this.$refs.roleForm.open()
    },
    handleStatusChange(row) {
      const text = row.status === 0 ? '停用' : '启用'
      this.$confirm(`确认要${text}吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          updateRole(row).catch(() => {
            row.status = row.status === 0 ? 1 : 0
          })
        })
        .catch(() => {
          row.status = row.status === 0 ? 1 : 0
        })
    },
    handleUpdate(item) {
      this.$refs.roleForm.open(item)
    },
    handleDelete(item) {
      this.$confirm('确认删除角色？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const data = {
            role_id: item.role_id,
          }

          deleteRole(data).then(() => {
            this.$message.success('删除成功')
            this.handleGetRoleList()
          })
        })
        .catch(() => {})
    },
  },
}
</script>
