<template>
  <div>
    <el-dialog :title="title" v-model="dialogVisible" width="600px">
      <el-form ref="roleForm" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="role_name">
          <el-input v-model="form.role_name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色标识" prop="role_key">
          <el-input v-model="form.role_key" placeholder="请输入权限字符" :disabled="disabled" />
        </el-form-item>
        <el-form-item label="角色顺序" prop="role_sort">
          <el-input-number v-model="form.role_sort" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status" :disabled="disabled">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dict_value"
              :label="dict.dict_value"
              >{{ dict.dict_label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单权限">
          <div v-show="form.role_key !== 'admin'">
            <el-tree
              ref="menuTree"
              :data="menuOptions"
              show-checkbox
              node-key="menu_id"
              :props="defaultProps"
            />
          </div>
          <div v-show="form.role_key === 'admin'">
            <span style="color: #ccc; font-weight: 500">系统管理员不需要设置菜单权限</span>
          </div>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
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
      form: {
        sysMenu: [],
      },
      rules: {
        role_name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        role_key: [{ required: true, message: '权限字符不能为空', trigger: 'blur' }],
        role_sort: [{ required: true, message: '角色顺序不能为空', trigger: 'blur' }],
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
      this.reset()
      if (!item) {
        this.title = '新增角色'
      } else {
        if (item.role_key === 'admin') {
          this.disabled = true
        }
        this.form = Object.assign({}, item)
        this.form.status = String(this.form.status)
        this.$nextTick(() => {
          this.handleSetCheckedKeys(this.form.menu_list.map((i) => i.menu_id))
        })
        this.title = '编辑角色'
      }
      this.dialogVisible = true
    },
    handleSetCheckedKeys(menuIds) {
      if (menuIds.length) {
        const filterCheckedKeys = []
        menuIds.forEach((item) => {
          const node = this.$refs.menuTree.getNode(item)
          if (!node.childNodes || !node.childNodes.length) {
            filterCheckedKeys.push(item)
          }
        })
        this.$refs.menuTree.setCheckedKeys(filterCheckedKeys)
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
      if (this.$refs.menuTree !== undefined) {
        this.$refs.menuTree.setCheckedKeys([])
      }
      this.form = {
        role_id: undefined,
        role_name: undefined,
        role_key: undefined,
        role_sort: 0,
        status: '1',
        menu_ids: [],
        remark: undefined,
      }
      this.disabled = false
      this.resetForm('roleForm')
    },
    getMenuAllCheckedKeys() {
      const halfCheckedKeys = this.$refs.menuTree.getHalfCheckedKeys()
      const checkedKeys = this.$refs.menuTree.getCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },
    submitForm() {
      if (!this.form.role_id) {
        this.handleAddRole()
      } else {
        this.handleUpdateRole()
      }
    },
    handleAddRole() {
      this.form.menu_ids = this.getMenuAllCheckedKeys()
      addRole(this.form).then(() => {
        this.$message.success('新增成功')
        this.$emit('update')
        this.dialogVisible = false
      })
    },
    handleUpdateRole() {
      this.form.menu_ids = this.getMenuAllCheckedKeys()
      updateRole(this.form).then(() => {
        this.$message.success('修改成功')
        this.$emit('update')
        this.dialogVisible = false
      })
    },
    cancel() {
      this.reset()
      this.dialogVisible = false
    },
  },
}
</script>
