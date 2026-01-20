<template>
  <div class="app-container">
    <el-card shadow="never" v-loading="loading">
      <el-form ref="queryForm" class="common-query-form" :model="queryParams" :inline="true">
        <el-form-item prop="username">
          <el-input v-model="queryParams.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item prop="ipaddr">
          <el-input v-model="queryParams.ipaddr" placeholder="请输入IP地址" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="handleReset">重置</el-button>
          <el-button
            v-actionpermission="['admin:sysloginlog:remove']"
            type="danger"
            icon="el-icon-delete"
            :disabled="!multiple"
            @click="handleDelete"
            >删除</el-button
          >
        </el-form-item>
      </el-form>

      <el-table :data="sysloginlogList" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          label="用户名"
          align="center"
          prop="username"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="IP地址" align="center" prop="ipaddr">
          <template #default="scope">
            <el-popover trigger="hover" placement="top" width="200">
              <p>IP: {{ scope.row.ipaddr }}</p>
              <p>浏览器: {{ scope.row.browser }}</p>
              <p>系统: {{ scope.row.os }}</p>

              <template #reference>
                {{ scope.row.ipaddr }}
              </template>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column label="登录时间" align="center" prop="login_time" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.login_time) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button
              v-actionpermission="['admin:sysloginlog:remove']"
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
        @pagination="handleGetLoginLogList"
      />
    </el-card>
  </div>
</template>

<script>
import { getLoginLogList, deleteLoginlog } from '@/api/admin/sys-log'

export default {
  name: 'SysLoginLog',
  data() {
    return {
      queryParams: {
        page: 1,
        page_size: 10,
        username: undefined,
        ipaddr: undefined,
      },
      total: 0,
      multiple: false,
      sysloginlogList: [],
      loading: false,
      ids: [],
    }
  },
  created() {
    this.handleGetLoginLogList()
  },
  methods: {
    handleGetLoginLogList() {
      this.loading = true
      getLoginLogList(this.queryParams)
        .then((res) => {
          this.sysloginlogList = res.data.sys_login_log_list
          this.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleQuery() {
      this.queryParams.page = 1
      this.handleGetLoginLogList()
    },
    handleReset() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    handleDelete(row) {
      const ids = (row.id && [row.id]) || this.ids
      this.baseConfirm('确认删除日志?')
        .then((done) => {
          deleteLoginlog({ ids })
            .then(() => {
              this.$message.success('删除成功')
              this.handleGetLoginLogList()
            })
            .finally(() => {
              done()
            })
        })
        .catch(() => {})
    },
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.multiple = !!selection.length
    },
  },
}
</script>
