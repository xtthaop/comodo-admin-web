<template>
  <div>
    <el-dialog :title="title" v-model="dialogVisible" width="600px">
      <el-form ref="roleForm" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="role_name">
          <el-input v-model="form.role_name" placeholder="请输入角色名称" maxlength="128" />
        </el-form-item>
        <el-form-item label="角色标识" prop="role_key">
          <el-input
            v-model="form.role_key"
            placeholder="请输入权限字符"
            :disabled="disabled"
            maxlength="128"
          />
        </el-form-item>
        <el-form-item label="角色排序" prop="role_sort">
          <el-input-number
            v-model="form.role_sort"
            controls-position="right"
            :min="0"
            :max="4294967295"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status" :disabled="disabled">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dict_value"
              :label="Number(dict.dict_value)"
              >{{ dict.dict_label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单权限">
          <div v-show="form.role_key !== 'admin'">
            <div style="margin-bottom: 10px">
              <el-checkbox label="selectAll" @change="handleCheckedTreeNodeAll">全选</el-checkbox>
              <el-checkbox label="expandAll" @change="handleCheckedTreeExpand">展开</el-checkbox>
            </div>
            <el-tree
              ref="menuTree"
              :data="menuOptions"
              show-checkbox
              node-key="menu_id"
              :props="defaultProps"
              :default-expand-all="false"
            >
              <template #default="{ node }">
                <el-icon style="margin-right: 3px; opacity: 0.5">
                  <template v-if="node.data.menu_type === 'F'">
                    <Folder />
                  </template>
                  <template v-else-if="node.data.menu_type === 'P'">
                    <Document />
                  </template>
                  <template v-else-if="node.data.menu_type === 'B'">
                    <Place />
                  </template>
                </el-icon>
                <span>{{ node.label }}</span>
              </template>
            </el-tree>
          </div>
          <div v-show="form.role_key === 'admin'">
            <span style="color: #ccc; font-weight: 500">此角色默认拥有所有菜单权限</span>
          </div>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
            maxlength="255"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancel" :disabled="submitLoading">取 消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitLoading">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getMenuTree } from '@/api/admin/sys-menu'
import { addRole, updateRole } from '@/api/admin/sys-role'

export default {
  name: 'RoleForm',
  props: {
    statusOptions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      title: '',
      dialogVisible: false,
      submitLoading: false,
      form: {
        role_sort: 0,
        status: 1,
      },
      rules: {
        role_name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        role_key: [{ required: true, message: '权限字符不能为空', trigger: 'blur' }],
        role_sort: [{ required: true, message: '角色排序不能为空', trigger: 'blur' }],
      },
      menuOptions: [],
      defaultProps: {
        children: 'children',
        label: 'title',
      },
      disabled: false,
    }
  },
  created() {
    this.handleGetMenuTree()
  },
  methods: {
    open(item) {
      this.dialogVisible = true
      this.reset()
      if (!item) {
        this.title = '新增角色'
      } else {
        if (item.role_key === 'admin') {
          this.disabled = true
        }
        this.$nextTick(() => {
          Object.assign(this.form, item)
        })
        this.title = '编辑角色'
      }

      this.$nextTick(() => {
        this.handleSetCheckedKeys(this.form.menu_ids)
      })
    },
    handleSetCheckedKeys(menuIds) {
      if (menuIds && menuIds.length) {
        this.$refs.menuTree.setCheckedKeys(menuIds)
      } else {
        this.$refs.menuTree.setCheckedKeys([])
      }
    },
    handleGetMenuTree() {
      getMenuTree().then((res) => {
        this.menuOptions = res.data.sys_menu_tree
      })
    },
    reset() {
      this.form.role_id = undefined
      this.form.menu_ids = undefined
      this.disabled = false
      this.resetForm('roleForm')
    },
    getMenuAllCheckedKeys() {
      const halfCheckedKeys = this.$refs.menuTree.getHalfCheckedKeys()
      const checkedKeys = this.$refs.menuTree.getCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },
    setMenuExpanded(nodes, expanded) {
      nodes.forEach((node) => {
        this.$refs.menuTree.store.nodesMap[node.menu_id].expanded = expanded
        if (node.children && node.children.length) {
          this.setMenuExpanded(node.children, expanded)
        }
      })
    },
    handleCheckedTreeExpand(value) {
      this.setMenuExpanded(this.menuOptions, value)
    },
    handleCheckedTreeNodeAll(value) {
      if (value) {
        this.$refs.menuTree.setCheckedKeys(this.menuOptions.map((item) => item.menu_id))
      } else {
        this.$refs.menuTree.setCheckedKeys([])
      }
    },
    submitForm() {
      this.$refs.roleForm.validate((valid) => {
        if (valid) {
          this.submitLoading = true
          if (!this.form.role_id) {
            this.handleAddRole()
          } else {
            this.handleUpdateRole()
          }
        }
      })
    },
    handleAddRole() {
      this.form.menu_ids = this.getMenuAllCheckedKeys()
      addRole(this.form)
        .then(() => {
          this.$message.success('新增成功')
          this.$emit('update')
          this.dialogVisible = false
        })
        .finally(() => {
          this.submitLoading = false
        })
    },
    handleUpdateRole() {
      this.form.menu_ids = this.getMenuAllCheckedKeys()
      updateRole(this.form)
        .then(() => {
          this.$message.success('修改成功')
          this.$emit('update')
          this.dialogVisible = false
        })
        .finally(() => {
          this.submitLoading = false
        })
    },
    cancel() {
      this.dialogVisible = false
    },
  },
}
</script>
