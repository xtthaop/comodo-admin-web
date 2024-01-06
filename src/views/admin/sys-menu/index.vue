<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form :inline="true">
        <el-form-item>
          <el-input
            v-model="queryParams.title"
            placeholder="请输入菜单名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-select v-model="queryParams.visible" placeholder="菜单状态" clearable>
            <el-option
              v-for="dict in visibleOptions"
              :key="dict.dict_value"
              :label="dict.dict_label"
              :value="dict.dict_value"
            />
            <el-option key="2" label="未知" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button
            v-actionpermission="['admin:sysmenu:add']"
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd"
            >新增</el-button
          >
        </el-form-item>
      </el-form>

      <el-table
        v-loading="loading"
        :data="menuList"
        border
        row-key="menu_id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column
          prop="title"
          label="菜单名称"
          header-align="center"
          :show-overflow-tooltip="true"
          width="160px"
        />
        <el-table-column prop="menu_id" label="ID" align="center" width="60px" />
        <el-table-column prop="icon" label="图标" align="center" width="80px">
          <template #default="scope">
            <span v-if="!scope.row.icon">——</span>
            <span v-else><svg-icon :name="scope.row.icon" /></span>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" align="center" width="60px" />
        <el-table-column
          prop="permission"
          label="权限标识"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template #default="scope">
            <el-popover v-if="scope.row.api_list.length > 0" trigger="hover" placement="top">
              <el-table :data="scope.row.api_list" border style="width: 100%">
                <el-table-column prop="title" label="接口名称" width="260px"></el-table-column>
                <el-table-column label="接口信息" width="270px">
                  <template #default="scope">
                    <el-tag :type="getType(scope.row.type)">
                      {{ '[' + scope.row.type + '] ' + scope.row.path }}
                    </el-tag>
                  </template>
                </el-table-column>
              </el-table>

              <template #reference>
                <span v-if="!scope.row.permission">——</span>
                <span v-else>{{ scope.row.permission }}</span>
              </template>
            </el-popover>

            <span v-else>
              <span v-if="!scope.row.permission">——</span>
              <span v-else>{{ scope.row.permission }}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="组件路径" align="center" :show-overflow-tooltip="true">
          <template #default="scope">
            <span v-if="!scope.row.component">——</span>
            <span v-else>{{ scope.row.component }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="80">
          <template #default="scope">
            <el-tag :type="visibleType(scope.row.visible)">
              {{ visibleFormat(scope.row) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.created_at) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="230">
          <template #default="scope">
            <el-button
              v-actionpermission="['admin:sysmenu:add']"
              link
              type="primary"
              icon="el-icon-plus"
              @click="handleAdd(scope.row)"
              v-if="scope.row.menu_type !== 'B'"
              >新增</el-button
            >
            <el-button
              v-actionpermission="['admin:sysmenu:edit']"
              link
              type="primary"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              >修改</el-button
            >
            <el-button
              v-if="scope.row.permission !== 'admin:sysmenu'"
              v-actionpermission="['admin:sysmenu:remove']"
              link
              type="primary"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <MenuForm
      ref="menuForm"
      :visibleOptions="visibleOptions"
      :allApiList="allApiList"
      @update="handleGetMenuList"
    />
  </div>
</template>

<script>
import { getMenuList, getMenuTree, deleteMenu } from '@/api/admin/sys-menu'
import { getApiList } from '@/api/admin/sys-api'
import MenuForm from './components/MenuForm.vue'

export default {
  name: 'SysMenu',
  components: {
    MenuForm,
  },
  data() {
    return {
      loading: false,
      menuList: [],
      queryParams: {
        title: undefined,
        visible: undefined,
      },
      visibleOptions: [],
      allApiList: [],
    }
  },
  created() {
    this.handleGetMenuList()
    this.getApiList()
    this.getDicts('sys_show_hide').then((res) => {
      this.visibleOptions = res.data
    })
  },
  methods: {
    getApiList() {
      this.loading = true
      getApiList()
        .then((res) => {
          this.allApiList = res.data.sys_api_list
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
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
    handleGetMenuList() {
      this.loading = true
      if (this.queryParams.title || this.queryParams.visible) {
        getMenuList(this.queryParams)
          .then((res) => {
            this.menuList = res.data.sys_menu_list
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        getMenuTree()
          .then((res) => {
            this.menuList = res.data.sys_menu_tree
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    handleQuery() {
      this.handleGetMenuList()
    },
    handleAdd(item) {
      this.$refs.menuForm.open('add', item)
    },
    handleUpdate(item) {
      this.$refs.menuForm.open('update', item)
    },
    handleDelete(item) {
      this.$confirm('确认删除数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const data = {
            menu_id: item.menu_id,
          }

          deleteMenu(data).then(() => {
            this.$message.success('删除成功')
            this.handleGetMenuList()
          })
        })
        .catch(() => {})
    },
    visibleFormat(row) {
      if (row.menu_type === 'B') {
        return ' —— '
      }
      return this.selectDictLabel(this.visibleOptions, row.visible)
    },
    visibleType(visible) {
      switch (visible) {
        case 0:
          return 'danger'
        case 1:
          return 'success'
        case 2:
          return 'info'
      }
    },
  },
}
</script>
