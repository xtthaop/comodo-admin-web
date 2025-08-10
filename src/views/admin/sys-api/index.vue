<template>
  <div class="app-container">
    <el-card shadow="never" v-loading="loading">
      <el-form ref="queryForm" class="common-query-form" :model="queryParams" :inline="true">
        <el-form-item prop="title">
          <el-input v-model="queryParams.title" placeholder="请输入接口名称" clearable />
        </el-form-item>
        <el-form-item prop="path">
          <el-input v-model="queryParams.path" placeholder="请输入接口路径" clearable />
        </el-form-item>
        <el-form-item prop="type">
          <el-select v-model="queryParams.type" placeholder="请选择请求类型" clearable>
            <el-option
              v-for="dict in typeOptions"
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
            v-actionpermission="['admin:sysapi:add']"
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd"
            >新增</el-button
          >
        </el-form-item>
      </el-form>

      <el-table :data="apiList" border>
        <el-table-column label="ID" prop="id" width="80px"></el-table-column>
        <el-table-column label="接口名称" prop="title" width="260px"></el-table-column>
        <el-table-column label="接口信息">
          <template #default="scope">
            <el-tag :type="getType(scope.row.type)">
              {{ scope.row.type }}
            </el-tag>
            {{ scope.row.path }}
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
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.page_size"
        @pagination="handleGetApiList"
      />
    </el-card>

    <ApiForm ref="apiForm" :typeOptions="typeOptions" @update="handleGetApiList" />
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
      typeOptions: [],
      total: 0,
    }
  },
  created() {
    this.handleGetApiList()
    this.getDicts('sys_api_type').then((res) => {
      this.typeOptions = res.data
    })
  },
  methods: {
    getType(type) {
      switch (type) {
        case 'POST':
          return 'success'
        case 'DELETE':
          return 'danger'
        case 'PUT':
          return 'warning'
        default:
          return ''
      }
    },
    handleQuery() {
      this.queryParams.page = 1
      this.handleGetApiList()
    },
    handleReset() {
      this.resetForm('queryForm')
      this.handleQuery()
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
      this.baseConfirm('确认删除接口？')
        .then((done) => {
          deleteApi({ id: item.id })
            .then(() => {
              this.$message.success('删除成功')
              this.handleGetApiList()
            })
            .finally(() => {
              done()
            })
        })
        .catch(() => {})
    },
  },
}
</script>
