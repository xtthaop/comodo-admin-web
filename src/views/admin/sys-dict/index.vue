<template>
  <div class="app-container">
    <el-card shadow="never" v-loading="loading">
      <el-form ref="queryForm" class="common-query-form" :model="queryParams" :inline="true">
        <el-form-item prop="dict_name">
          <el-input v-model="queryParams.dict_name" placeholder="请输入字典名称" clearable />
        </el-form-item>
        <el-form-item prop="dict_type">
          <el-input v-model="queryParams.dict_type" placeholder="请输入字典类型" clearable />
        </el-form-item>
        <el-form-item prop="status">
          <el-select v-model="queryParams.status" placeholder="字典状态" clearable>
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
            v-actionpermission="['admin:sysdicttype:add']"
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd"
            >新增</el-button
          >
        </el-form-item>
      </el-form>

      <el-table
        :data="typeList"
        border
        show-overflow-tooltip
        :tooltip-options="{ popperClass: 'custom-tooltip-style' }"
      >
        <el-table-column label="ID" width="75" prop="dict_id" />
        <el-table-column label="字典名称" prop="dict_name" min-width="120" />
        <el-table-column label="字典类型" width="200" min-width="200">
          <template #default="scope">
            <el-button link type="primary">
              <router-link :to="{ name: 'SysDictData', params: { dictId: scope.row.dict_id } }">
                <span>{{ scope.row.dict_type }}</span>
              </router-link>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          prop="status"
          :formatter="statusFormat"
          align="center"
          min-width="80"
        />
        <el-table-column label="备注" prop="remark" min-width="200" />
        <el-table-column label="创建时间" prop="created_at" width="160">
          <template #default="scope">
            <span>{{ parseTime(scope.row.created_at) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="160">
          <template #default="scope">
            <el-button
              v-actionpermission="['admin:sysdicttype:edit']"
              link
              type="primary"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              >编辑</el-button
            >
            <el-button
              v-actionpermission="['admin:sysdicttype:remove']"
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
        @pagination="handleGetTypeList"
      />
    </el-card>

    <DictForm ref="dictForm" @update="handleGetTypeList" :statusOptions="statusOptions" />
  </div>
</template>

<script>
import DictForm from './components/DictForm.vue'
import { getDictTypeList, deleteDictType } from '@/api/admin/sys-dict-type'

export default {
  name: 'SysDict',
  components: {
    DictForm,
  },
  data() {
    return {
      queryParams: {
        page: 1,
        page_size: 10,
        dict_name: undefined,
        dict_type: undefined,
        status: undefined,
      },
      statusOptions: [],
      loading: false,
      typeList: [],
      total: 0,
    }
  },
  created() {
    this.handleGetTypeList()
    this.getDicts('sys_normal_disable').then((res) => {
      this.statusOptions = res.data
    })
  },
  methods: {
    handleQuery() {
      this.queryParams.page = 1
      this.handleGetTypeList()
    },
    handleReset() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    handleGetTypeList() {
      this.loading = true
      getDictTypeList(this.queryParams)
        .then((res) => {
          this.typeList = res.data.dict_type_list
          this.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleAdd() {
      this.$refs.dictForm.open()
    },
    handleUpdate(item) {
      this.$refs.dictForm.open(item)
    },
    handleDelete(item) {
      this.baseConfirm('确认删除字典？')
        .then((done) => {
          deleteDictType({ dict_id: item.dict_id })
            .then(() => {
              this.$message.success('删除成功')
              this.handleGetTypeList()
            })
            .finally(() => {
              done()
            })
        })
        .catch(() => {})
    },
    statusFormat(row) {
      return this.selectDictLabel(this.statusOptions, parseInt(row.status))
    },
  },
}
</script>
