<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item prop="username">
          <el-input
            v-model="queryParams.username"
            placeholder="请输入用户名"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item prop="ipaddr">
          <el-input
            v-model="queryParams.ipaddr"
            placeholder="请输入IP地址"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button
            v-actionpermission="['admin:sysloginlog:remove']"
            type="danger"
            icon="el-icon-delete"
            :disabled="multiple"
            @click="handleDelete"
          >删除</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="sysloginlogList" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          label="用户名"
          align="center"
          prop="username"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="IP地址"
          align="center"
          prop="ipaddr"
        >
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>IP: {{ scope.row.ipaddr }}</p>
              <p>归属地: {{ scope.row.location }}</p>
              <p>浏览器: {{ scope.row.browser }}</p>
              <p>系统: {{ scope.row.os }}</p>

              <div slot="reference">
                {{ scope.row.ipaddr }}
              </div>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column
          label="登录时间"
          align="center"
          prop="login_time"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.login_time) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-actionpermission="['admin:sysloginlog:remove']"
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
      multiple: true,
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
      getLoginLogList(this.queryParams).then(res => {
        this.sysloginlogList = res.data.sys_login_log_list
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleQuery() {
      this.queryParams.page = 1
      this.handleGetLoginLogList()
    },
    handleDelete(row) {
      const ids = (row.id && [row.id]) || this.ids
      this.$confirm('确认删除数据?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteLoginlog({ ids }).then(() => {
          this.$message.success('删除成功')
          this.handleGetLoginLogList()
        })
      }).catch(() => {})
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.multiple = !selection.length
    }
  }
}
</script>
