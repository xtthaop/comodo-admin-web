<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item>
          <el-date-picker
            v-model="queryParams.date_range"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button
            v-actionpermission="['admin:sysoperationlog:remove']"
            type="danger"
            icon="el-icon-delete"
            :disabled="multiple"
            @click="handleDelete"
            >删除</el-button
          >
        </el-form-item>
      </el-form>

      <el-table
        v-loading="loading"
        :data="operationLoglist"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" width="70" prop="id" />
        <el-table-column label="请求类型" width="120">
          <template #default="scope">
            <el-tag :type="getType(scope.row.type)">{{ scope.row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="接口信息">
          <template #default="scope">
            <el-popover trigger="hover" placement="top" width="200">
              <p>IP地址: {{ scope.row.ipaddr }}</p>
              <p>耗时: {{ scope.row.latency_time }}</p>

              <template #reference>
                {{ scope.row.path }}
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="operation" width="200" :show-overflow-tooltip="true" />
        <el-table-column label="操作人" prop="operator" width="120" :show-overflow-tooltip="true" />
        <el-table-column
          label="操作耗时"
          prop="latency_time"
          width="120"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="操作日期" width="160">
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
        date_range: [],
      },
      total: 0,
      multiple: true,
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
      this.$confirm('确认删除数据?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteOperationlog({ ids }).then(() => {
            this.$message.success('删除成功')
            this.handleGetOperationLogList()
          })
        })
        .catch(() => {})
    },
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.multiple = !selection.length
    },
  },
}
</script>
