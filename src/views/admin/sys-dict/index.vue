<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
        <el-form-item prop="dict_name">
          <el-input
            v-model="queryParams.dict_name"
            placeholder="请输入字典名称"
            clearable
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item prop="dict_type">
          <el-input
            v-model="queryParams.dict_type"
            placeholder="请输入字典类型"
            clearable
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="字典状态"
            clearable
            style="width: 240px"
          >
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
            v-actionpermission="['admin:sysdicttype:add']"
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd"
          >新增</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="typeList" border>
        <el-table-column label="ID" width="80" align="center" prop="dict_id" />
        <el-table-column label="字典名称" align="center" prop="dict_name" :show-overflow-tooltip="true" />
        <el-table-column label="字典类型" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <router-link :to="{ name: 'SysDictData', params: { dictId: scope.row.dict_id } }" class="link-type">
              <span>{{ scope.row.dict_type }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" />
        <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
        <el-table-column label="创建时间" align="center" prop="created_at" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.created_at) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="scope">
            <el-button
              v-actionpermission="['admin:sysdicttype:edit']"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >修改</el-button>
            <el-button
              v-actionpermission="['admin:sysdicttype:remove']"
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <Pagination 
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.page"
        :limit.sync="queryParams.page_size"
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
    DictForm
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
    this.getDicts('sys_normal_disable').then(res => {
      this.statusOptions = res.data
    })
  },
  methods: {
    handleQuery() {
      this.queryParams.page = 1
      this.handleGetTypeList()
    },
    handleGetTypeList() {
      this.loading = true
      getDictTypeList(this.queryParams).then(res => {
        this.typeList = res.data.dict_type_list
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
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
      this.$confirm('确认删除数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDictType({ dict_id: item.dict_id }).then(() => {
          this.$message.success('删除成功')
          this.handleGetTypeList()
        })
      }).catch(() => {})
    },
    statusFormat(row) {
      return this.selectDictLabel(this.statusOptions, parseInt(row.status))
    },
  },
}
</script>
