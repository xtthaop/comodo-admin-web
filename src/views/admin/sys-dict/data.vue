<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item prop="dict_label">
          <el-input
            v-model="queryParams.dict_data_label"
            placeholder="请输入字典标签"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item prop="status">
          <el-select v-model="queryParams.status" placeholder="字典数据状态" clearable>
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
            v-actionpermission="['admin:sysdictdata:add']"
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd"
            >新增</el-button
          >
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="dataList" border>
        <el-table-column label="ID" align="center" prop="dict_data_id" />
        <el-table-column label="标签" align="center" prop="dict_data_label" />
        <el-table-column label="键值" align="center" prop="dict_data_value" />
        <el-table-column label="排序" align="center" prop="dict_data_sort" />
        <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" />
        <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
        <el-table-column label="创建时间" align="center" prop="created_at" width="180">
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
              >修改</el-button
            >
            <el-button
              v-actionpermission="['admin:sysdictdata:remove']"
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
    this.queryParams.dict_id = this.$route.params && this.$route.params.dictId
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
      this.$confirm('确认删除数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteDictData({ dict_data_id: item.dict_data_id }).then(() => {
            this.$message.success('删除成功')
            this.handleGetDataList()
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
