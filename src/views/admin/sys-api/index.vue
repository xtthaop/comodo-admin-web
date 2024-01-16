<template>
  <div class="app-container">
    <el-card shadow="never">
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item prop="title">
          <el-input
            v-model="queryParams.title"
            placeholder="请输入标题"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item prop="path">
          <el-input
            v-model="queryParams.path"
            placeholder="请输入地址"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item prop="action">
          <el-select
            v-model="queryParams.type"
            placeholder="请选择类型"
            clearable
            @keyup.enter="handleQuery"
          >
            <el-option value="GET">GET</el-option>
            <el-option value="POST">POST</el-option>
            <el-option value="PUT">PUT</el-option>
            <el-option value="DELETE">DELETE</el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button
            v-actionpermission="['admin:sysapi:add']"
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd"
            >新增</el-button
          >
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="apiList" border>
        <el-table-column
          label="接口名称"
          prop="title"
          width="260px"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="接口信息">
          <template #default="scope">
            <el-tag :type="getType(scope.row.type)">
              {{ '[' + scope.row.type + '] ' + scope.row.path }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="created_at" width="180px">
          <template #default="scope">
            <span>{{ parseTime(scope.row.created_at) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="160px">
          <template #default="scope">
            <el-button
              v-actionpermission="['admin:sysapi:edit']"
              link
              type="primary"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              >修改</el-button
            >
            <el-button
              v-actionpermission="['admin:sysapi:remove']"
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
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.page_size"
        @pagination="handleGetApiList"
      />
    </el-card>

    <ApiForm ref="apiForm" @update="handleGetApiList" />
  </div>
</template>

<script>
import ApiForm from './components/ApiForm.vue'
import { getApiList, deleteApi } from '@/api/admin/sys-api'

export default {
  name: 'SysApi',
  components: {
    ApiForm,
  },
  data() {
    return {
      loading: false,
      queryParams: {
        page: 1,
        page_size: 10,
        title: undefined,
        path: undefined,
        action: undefined,
      },
      apiList: [],
      total: 0,
    }
  },
  created() {
    this.handleGetApiList()
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
      this.handleGetApiList()
    },
    handleGetApiList() {
      this.loading = true
      getApiList(this.queryParams)
        .then((res) => {
          this.apiList = res.data.sys_api_list
          this.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleUpdate(item) {
      this.$refs.apiForm.open(item)
    },
    handleAdd() {
      this.$refs.apiForm.open()
    },
    handleDelete(item) {
      this.$confirm('确认删除数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteApi({ id: item.id }).then(() => {
            this.$message.success('删除成功')
            this.handleGetApiList()
          })
        })
        .catch(() => {})
    },
  },
}
</script>
