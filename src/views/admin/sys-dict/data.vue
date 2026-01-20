<template>
  <div class="app-container">
    <el-card shadow="never" v-loading="loading">
      <el-form ref="queryForm" class="common-query-form" :model="queryParams" :inline="true">
        <el-form-item prop="dict_data_label">
          <el-input v-model="queryParams.dict_data_label" placeholder="请输入标签" clearable />
        </el-form-item>
        <el-form-item prop="status">
          <el-select v-model="queryParams.status" placeholder="状态" clearable>
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
            v-actionpermission="['admin:sysdictdata:add']"
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd"
            >新增</el-button
          >
        </el-form-item>
      </el-form>

      <el-table
        :data="dataList"
        border
        show-overflow-tooltip
        :tooltip-options="{ popperClass: 'custom-tooltip-style' }"
      >
        <el-table-column label="ID" prop="dict_data_id" width="75" />
        <el-table-column label="标签" prop="dict_data_label" min-width="160" />
        <el-table-column label="键值" prop="dict_data_value" min-width="160" />
        <el-table-column label="排序" prop="dict_data_sort" min-width="80" />
        <el-table-column
          label="状态"
          prop="status"
          :formatter="statusFormat"
          align="center"
          min-width="80"
        />
        <el-table-column label="备注" prop="remark" :show-overflow-tooltip="true" min-width="200" />
        <el-table-column label="创建时间" prop="created_at" width="160">
          <template #default="scope">
            <span>{{ parseTime(scope.row.created_at) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="160">
          <template #default="scope">
            <el-button
              v-actionpermission="['admin:sysdictdata:edit']"
              link
              type="primary"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              >编辑</el-button
            >
            <el-button
              v-actionpermission="['admin:sysdictdata:remove']"
              link
              type="danger"
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
        @pagination="handleGetDataList"
      />
    </el-card>

    <DataForm
      ref="dataForm"
      :dictId="queryParams.dict_id"
      :statusOptions="statusOptions"
      @update="handleGetDataList"
    />
  </div>
</template>

<script>
import DataForm from './components/DataForm.vue'
import { getDictDataList, deleteDictData } from '@/api/admin/sys-dict-data'

export default {
  name: 'SysDictData',
  components: {
    DataForm,
  },
  data() {
    return {
      queryParams: {
        dict_id: undefined,
        page: 1,
        page_size: 10,
        dict_data_label: undefined,
        status: undefined,
      },
      statusOptions: [],
      loading: false,
      dataList: [],
      total: 0,
    }
  },
  created() {
    this.queryParams.dict_id = this.$route.params?.dictId
    this.handleGetDataList()
    this.getDicts('sys_normal_disable').then((res) => {
      this.statusOptions = res.data
    })
  },
  methods: {
    handleQuery() {
      this.queryParams.page = 1
      this.handleGetDataList()
    },
    handleReset() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    handleGetDataList() {
      this.loading = true
      getDictDataList(this.queryParams)
        .then((res) => {
          this.dataList = res.data.dict_data_list
          this.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleAdd() {
      this.$refs.dataForm.open()
    },
    handleUpdate(item) {
      this.$refs.dataForm.open(item)
    },
    handleDelete(item) {
      this.baseConfirm('确认删除字典数据？')
        .then((done) => {
          deleteDictData({ dict_data_id: item.dict_data_id })
            .then(() => {
              this.$message.success('删除成功')
              this.handleGetDataList()
            })
            .finally(() => {
              done()
            })
        })
        .catch(() => {})
    },
    statusFormat(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
  },
}
</script>
