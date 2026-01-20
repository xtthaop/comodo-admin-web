<template>
  <div class="app-container">
    <el-card shadow="never">
      <el-form ref="queryForm" class="common-query-form" :model="queryParams" :inline="true">
        <el-form-item prop="username">
          <el-input v-model="queryParams.username" placeholder="请输入操作人" clearable />
        </el-form-item>
        <el-form-item prop="date_range">
          <el-date-picker
            v-model="queryParams.date_range"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="handleReset">重置</el-button>
          <el-button
            v-actionpermission="['admin:sysoperationlog:remove']"
            type="danger"
            icon="el-icon-delete"
            :disabled="!multiple"
            @click="handleDelete"
            >删除</el-button
          >
        </el-form-item>
      </el-form>

      <el-table
        v-loading="loading"
        :data="operationLoglist"
        border
        show-overflow-tooltip
        :tooltip-options="{ popperClass: 'custom-tooltip-style' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" width="75" prop="id" />
        <el-table-column label="请求类型" align="center" width="100">
          <template #default="scope">
            <el-tag :type="getType(scope.row.type)">{{ scope.row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="接口地址" prop="path" min-width="200" />
        <el-table-column label="操作" prop="operation" min-width="200" />
        <el-table-column label="IP" prop="ipaddr" min-width="120" />
        <el-table-column label="操作人" prop="operator" min-width="120" />
        <el-table-column
          label="操作耗时"
          prop="latency_time"
          min-width="120"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="操作时间" width="160">
          <template #default="scope">
            <span>{{ parseTime(scope.row.operation_time) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template #default="scope">
            <el-button
              v-actionpermission="['admin:sysoperationlog:remove']"
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
        @pagination="handleGetOperationLogList"
      />
    </el-card>
  </div>
</template>

<script>
import { getOperationLogList, deleteOperationlog } from '@/api/admin/sys-log'

export default {
  name: 'SysOperationLog',
  data() {
    return {
      queryParams: {
        page: 1,
        page_size: 10,
        username: undefined,
        date_range: [],
      },
      total: 0,
      multiple: false,
      loading: false,
      operationLoglist: [],
      ids: [],
    }
  },
  created() {
    this.handleGetOperationLogList()
  },
  methods: {
    getType(type) {
      switch (type) {
        case 'GET':
          return ''
        case 'POST':
          return 'success'
        case 'DELETE':
          return 'danger'
        case 'PUT':
          return 'warning'
      }
    },
    handleQuery() {
      this.queryParams.page = 1
      this.handleGetOperationLogList()
    },
    handleReset() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    handleGetOperationLogList() {
      this.loading = true
      getOperationLogList(this.queryParams)
        .then((res) => {
          this.operationLoglist = res.data.sys_operation_log_list
          this.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleDelete(row) {
      const ids = (row.id && [row.id]) || this.ids
      this.baseConfirm('确认删除日志?')
        .then((done) => {
          deleteOperationlog({ ids })
            .then(() => {
              this.$message.success('删除成功')
              this.handleGetOperationLogList()
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
