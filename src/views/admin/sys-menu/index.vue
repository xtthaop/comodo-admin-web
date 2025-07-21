<template>
  <div class="app-container" v-loading="loading">
    <el-card shadow="never">
      <el-form ref="queryForm" :inline="true" class="common-query-form" :model="queryParams">
        <el-form-item prop="title">
          <el-input v-model="queryParams.title" placeholder="请输入菜单名称" clearable />
        </el-form-item>
        <el-form-item prop="visible">
          <el-select v-model="queryParams.visible" placeholder="显示状态" clearable>
            <el-option
              v-for="dict in visibleOptions"
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
            v-actionpermission="['admin:sysmenu:add']"
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd(false)"
            >新增</el-button
          >
        </el-form-item>
      </el-form>

      <el-table
        :data="menuList"
        border
        row-key="menu_id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column
          prop="title"
          label="菜单名称"
          header-align="center"
          min-width="230px"
          class-name="custom-col"
        >
          <template #default="scope">
            <div style="display: inline-flex; align-items: center">
              <el-icon style="margin-right: 3px; opacity: 0.5">
                <template v-if="scope.row.menu_type === 'F'">
                  <Folder />
                </template>
                <template v-else-if="scope.row.menu_type === 'P'">
                  <Document />
                </template>
                <template v-else-if="scope.row.menu_type === 'B'">
                  <Place />
                </template>
              </el-icon>
              <span>{{ scope.row.title }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="menu_id" label="ID" width="60px" />
        <el-table-column prop="icon" label="图标" align="center" width="80px">
          <template #default="scope">
            <span v-if="scope.row.icon"><UniIcon :icon="scope.row.icon" /></span>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="60px" />
        <el-table-column prop="permission" label="权限标识" min-width="230px">
          <template #default="scope">
            <el-popover
              v-if="scope.row.api_list.length > 0"
              trigger="hover"
              placement="top"
              :offset="5"
              :width="580"
            >
              <el-table :data="scope.row.api_list" border>
                <el-table-column prop="title" label="接口名称" min-width="100px"></el-table-column>
                <el-table-column label="接口信息" min-width="300px">
                  <template #default="scope">
                    <el-tag :type="getType(scope.row.type)">
                      {{ scope.row.type }}
                    </el-tag>
                    {{ scope.row.path }}
                  </template>
                </el-table-column>
              </el-table>

              <template #reference>
                <span>{{ scope.row.permission }}</span>
              </template>
            </el-popover>

            <span v-else>
              <span>{{ scope.row.permission }}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="菜单类型" align="center" min-width="100px">
          <template #default="scope">
            <span v-if="scope.row.menu_type === 'F'">页面夹</span>
            <span v-else-if="scope.row.menu_type === 'P'">页面</span>
            <span v-else>按钮</span>
          </template>
        </el-table-column>
        <el-table-column label="显示状态" align="center" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.menu_type !== 'B'" :type="visibleType(scope.row.visible)">
              {{ visibleFormat(scope.row) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="160">
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
              >编辑</el-button
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
import UniIcon from '@/components/UniIcon/index.vue'

export default {
  name: 'SysMenu',
  components: {
    MenuForm,
    UniIcon,
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
      getApiList().then((res) => {
        this.allApiList = res.data.sys_api_list
      })
    },
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
    handleReset() {
      this.resetForm('queryForm')
      this.handleQuery()
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
      return this.selectDictLabel(this.visibleOptions, row.visible)
    },
    visibleType(visible) {
      switch (visible) {
        case 0:
          return 'danger'
        case 1:
          return 'success'
        default:
          return 'info'
      }
    },
  },
}
</script>

<style scoped lang="scss">
:deep(.custom-col .cell) {
  display: inline-flex;
  align-items: center;
}
</style>
