<template>
  <div>
    <el-dialog :title="title" v-model="dialogVisible" width="700px">
      <el-form ref="menuForm" :model="form" :rules="rules" label-position="top" label-width="106px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item prop="parent_id">
              <template #label>
                <span>父级菜单</span>
              </template>
              <el-tree-select
                ref="treeSelect"
                v-model="form.parent_id"
                :data="menuOptions"
                :props="defaultProps"
                value-key="id"
                placeholder="请选择父级菜单"
                check-strictly
                default-expand-all
                @change="handleParentMenuChange"
                style="width: 100%"
              >
                <template #default="{ data }">
                  <div style="display: flex; align-items: center">
                    <el-icon style="margin-right: 3px; opacity: 0.5">
                      <template v-if="data.nodeData.menu_type === 'F'">
                        <Folder />
                      </template>
                      <template v-else-if="data.nodeData.menu_type === 'P'">
                        <Document />
                      </template>
                      <template v-else-if="data.nodeData.menu_type === 'B'">
                        <Place />
                      </template>
                    </el-icon>
                    <span>{{ data.label }}</span>
                  </div>
                </template>
              </el-tree-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item prop="title">
              <template #label>
                <span>菜单名称</span>
              </template>
              <el-input v-model="form.title" placeholder="请输入菜单名称" maxlength="128" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="sort">
              <template #label>
                <span>排序</span>
              </template>
              <el-input-number
                v-model="form.sort"
                controls-position="right"
                :min="0"
                :max="4294967295"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item prop="menu_type">
              <template #label>
                <span>菜单类型</span>
              </template>
              <el-radio-group v-model="form.menu_type" @change="handleMenuTypeChange">
                <el-radio label="F" :disabled="parentMenuType === 'P'">页面夹</el-radio>
                <el-radio label="P">页面</el-radio>
                <el-radio label="B">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="24" v-if="form.menu_type != 'B'">
            <el-form-item label="菜单图标">
              <el-popover width="605" trigger="click" @show="$refs['iconSelect'].reset()">
                <IconSelect ref="iconSelect" @selected="selected" />
                <template #reference>
                  <el-input v-model="form.icon" placeholder="请选择图标" clearable maxlength="128">
                    <template #prefix>
                      <UniIcon
                        v-if="form.icon"
                        :icon="form.icon"
                        class="el-input__icon"
                        style="width: 25px"
                      />
                      <el-icon v-else class="el-input__icon"><Search /></el-icon>
                    </template>
                  </el-input>
                </template>
              </el-popover>
            </el-form-item>
          </el-col>

          <el-col :span="12" v-if="form.menu_type != 'B'">
            <el-form-item prop="visible">
              <template #label>
                <span>是否显示菜单</span>
              </template>
              <el-radio-group v-model="form.visible" :disabled="this.isInnerPage">
                <el-radio
                  v-for="dict in visibleOptions"
                  :key="dict.dict_value"
                  :label="Number(dict.dict_value)"
                  >{{ dict.dict_label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menu_type === 'P'">
            <el-form-item>
              <template #label>
                <span>是否为外部链接</span>
              </template>
              <el-radio-group v-model="form.is_link" :disabled="this.isInnerPage">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="12" v-if="form.menu_type === 'P' && !form.is_link">
            <el-form-item>
              <template #label>
                <span>是否使用缓存</span>
              </template>
              <el-radio-group
                v-model="form.cache"
                @change="$refs.menuForm.clearValidate('route_name')"
              >
                <el-radio :label="1">使用</el-radio>
                <el-radio :label="0">不使用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menu_type === 'P' && !form.is_link">
            <el-form-item>
              <template #label>
                <span>是否显示布局</span>
              </template>
              <el-radio-group v-model="form.layout">
                <el-radio :label="1">显示</el-radio>
                <el-radio :label="0">不显示</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="12" v-if="form.menu_type === 'P' && !form.is_link">
            <el-form-item
              prop="route_name"
              :rules="
                form.cache
                  ? [{ required: this.form?.cache, message: '路由名称不能为空', trigger: 'blur' }]
                  : null
              "
            >
              <template #label>
                <div style="display: inline-flex; align-items: center">
                  <span style="margin-right: 5px; vertical-align: middle">路由名称</span>
                  <el-tooltip
                    v-if="form.cache"
                    content="使用缓存需保持路由名称与代码中组件名称一致"
                    placement="top"
                    effect="dark"
                  >
                    <el-icon style="color: var(--el-color-danger); font-size: 16px"
                      ><WarningFilled
                    /></el-icon>
                  </el-tooltip>
                </div>
              </template>
              <el-input v-model="form.route_name" placeholder="示例：SysMenu" maxlength="128" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menu_type === 'P' && !form.is_link">
            <el-form-item prop="component">
              <template #label>
                <span>组件路径</span>
              </template>
              <el-input
                v-model="form.component"
                placeholder="示例：/admin/sys-menu/index.vue"
                maxlength="255"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12" v-if="form.menu_type === 'P'">
            <el-form-item prop="path">
              <template #label>
                <span>{{ form.is_link ? '外部链接地址' : '路由地址' }}</span>
              </template>
              <el-input
                v-model="form.path"
                :placeholder="
                  form.is_link ? '示例：https://www.zxctb.top' : '示例：/admin/sys-menu'
                "
                maxlength="255"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <template #label>
                <span>权限标识</span>
              </template>
              <el-input
                v-model="form.permission"
                :placeholder="`示例：${
                  form.menu_type === 'F'
                    ? 'admin'
                    : form.menu_type === 'P'
                    ? 'admin:sysmenu'
                    : 'admin:sysmenu:add'
                }`"
                maxlength="255"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24" v-if="form.menu_type === 'P' && !form.is_link && isInnerPage">
            <el-form-item>
              <template #label>
                <span>高亮菜单</span>
              </template>
              <el-input
                v-model="form.active_menu"
                placeholder="请输入在访问此页面时需要高亮显示的菜单路由地址如：/admin/sys-menu"
                maxlength="255"
              />
            </el-form-item>
          </el-col>

          <el-col
            :span="24"
            v-if="form.menu_type === 'B' || (form.menu_type === 'P' && !form.is_link)"
          >
            <el-form-item>
              <template #label>
                <span>接口权限</span>
              </template>
              <el-transfer
                v-model="form.apis"
                filterable
                :props="{
                  key: 'id',
                  label: 'title',
                }"
                :titles="['未授权', '已授权']"
                :format="{
                  noChecked: '${total}',
                  hasChecked: '${checked}/${total}',
                }"
                :data="allApiList"
              >
                <template v-slot="{ option }">
                  <span>{{ option.title }}</span>
                </template>
              </el-transfer>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <el-button @click="cancel" :disabled="submitLoading">取 消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitLoading">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getMenuTree, addMenu, updateMenu } from '@/api/admin/sys-menu'
import IconSelect from '@/components/IconSelect/index.vue'
import UniIcon from '@/components/UniIcon/index.vue'
import { isExternal } from '@/utils/validate'

export default {
  name: 'MenuForm',
  components: {
    IconSelect,
    UniIcon,
  },
  props: {
    visibleOptions: {
      type: Array,
      default: () => [],
    },
    allApiList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      title: '',
      dialogVisible: false,
      submitLoading: false,
      form: {},
      rules: {
        parent_id: [{ required: true, message: '父级菜单不能为空', trigger: 'change' }],
        title: [{ required: true, message: '菜单标题不能为空', trigger: 'blur' }],
        sort: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
        menu_type: [{ required: true, message: '菜单类型不能为空', trigger: 'change' }],
        component: [
          { required: true, message: '组件路径不能为空', trigger: 'blur' },
          { validator: this.validatePath, trigger: 'blur' },
        ],
        path: [
          { required: true, message: '路由地址不能为空', trigger: 'blur' },
          { validator: this.validatePath, trigger: 'blur' },
        ],
      },
      menuOptions: [],
      parent: '',
      parentMenuType: '',
      defaultProps: {
        value: 'id',
        label: 'label',
        children: 'children',
        disabled: 'disabled',
      },
    }
  },
  computed: {
    isInnerPage() {
      return this.parentMenuType === 'P' && this.form.menu_type === 'P'
    },
  },
  watch: {
    'form.is_link'() {
      if (this.form.path) {
        this.$refs.menuForm?.validateField('path')
      }
    },
  },
  methods: {
    open(type, item) {
      this.dialogVisible = true
      this.reset()
      if (type === 'add') {
        if (item) {
          this.form.parent_id = item.menu_id
          this.handleChangeParentMenuType(item)
        } else {
          this.form.parent_id = 0
        }
        this.title = '新增菜单'
      } else {
        this.$nextTick(() => {
          Object.assign(this.form, item)
          if (!this.form.cache && this.form.cache !== 0) this.form.cache = 0
          if (!this.form.layout && this.form.layout !== 0) this.form.layout = 1
          if (!this.form.visible && this.form.visible !== 0) this.form.visible = 1
          if (!this.form.is_link && this.form.is_link !== 0) this.form.is_link = 0
          this.form.apis = this.form.api_list.map((api) => api.id)
        })
        this.title = '编辑菜单'
      }

      this.getTreeSelect()
    },
    getTreeSelect() {
      getMenuTree().then((res) => {
        this.sourceData = []
        const menu = {
          menu_id: 0,
          menu_type: 'F',
          title: '根目录',
          children: [],
        }
        menu.children = res.data.sys_menu_tree
        this.sourceData.push(menu)
        this.menuOptions = this.sourceData.map((item) => this.normalizer(item))

        this.$nextTick(() => {
          this.handleParentMenuChange(this.form.parent_id)
        })
      })
    },
    normalizer(node) {
      let children = node.children.filter((item) => item.menu_type !== 'B')
      if (!(children && !children.length)) {
        children = children.map((item) => this.normalizer(item))
      }

      let disabled = false
      // 编辑时选择父菜单不能选自身
      if (this.form.menu_id && this.form.menu_id === node.menu_id) {
        disabled = true
      }

      return {
        id: node.menu_id,
        label: node.title,
        children,
        disabled,
        nodeData: node,
      }
    },
    handleMenuTypeChange() {
      this.menuOptions = this.sourceData.map((item) => this.normalizer(item))
      this.handleInnerPage(this.parent)
    },
    handleParentMenuChange(val) {
      const treeNode = this.$refs.treeSelect.getNode(val)
      this.handleChangeParentMenuType(treeNode.data.nodeData)
    },
    handleChangeParentMenuType(node) {
      this.parent = node
      this.parentMenuType = node.menu_type
      if (this.parentMenuType === 'P' && this.form.menu_type === 'F') {
        this.form.menu_type = 'P'
      }
      this.handleInnerPage(node)
    },
    handleInnerPage(node) {
      if (this.isInnerPage) {
        this.form.visible = 0
        this.form.is_link = 0
        this.changeActiveMenu(node)
      } else {
        this.form.active_menu = undefined
      }
    },
    changeActiveMenu(node) {
      if (!node.visible && node.visible !== undefined) {
        const parentNode = this.$refs.treeSelect.getNode(node.parent_id)
        this.changeActiveMenu(parentNode.data.nodeData)
      } else {
        this.form.active_menu = node.path
      }
    },
    reset() {
      this.form = {
        menu_id: undefined,
        parent_id: 0,
        route_name: undefined,
        icon: undefined,
        menu_type: 'F',
        apis: [],
        sort: 0,
        is_link: 0,
        visible: 1,
        title: undefined,
        component: undefined,
        path: undefined,
        permission: undefined,
        layout: 1,
        cache: 0,
        active_menu: undefined,
      }
      this.disabled = false
      this.parentMenuType = ''
      this.resetForm('menuForm')
    },
    selected(name) {
      this.form.icon = name
    },
    validatePath(rule, value, callback) {
      if (value && !this.form.is_link && !value.startsWith('/')) {
        callback(new Error('请以 "/" 开头'))
      } else if (value && this.form.is_link && !isExternal(value)) {
        callback(new Error('不支持的外部链接地址'))
      } else {
        callback()
      }
    },
    submitForm() {
      this.$refs.menuForm.validate((valid) => {
        if (valid) {
          this.submitLoading = true
          const data = this.convertFormContent()
          if (this.form.menu_id === undefined) {
            this.handleAddMenu(data)
          } else {
            this.handleUpdateMenu(data)
          }
        }
      })
    },
    handleAddMenu(data) {
      addMenu(data)
        .then(() => {
          this.$message.success('新增成功')
          this.$emit('update')
          this.dialogVisible = false
        })
        .finally(() => {
          this.submitLoading = false
        })
    },
    handleUpdateMenu(data) {
      updateMenu(data)
        .then(() => {
          this.$message.success('修改成功')
          this.$emit('update')
          this.dialogVisible = false
        })
        .finally(() => {
          this.submitLoading = false
        })
    },
    convertFormContent() {
      const { parent_id, menu_id, title, sort, menu_type } = this.form
      const baseObj = { parent_id, menu_id, title, sort, menu_type }
      switch (menu_type) {
        case 'F': {
          const { icon, visible, permission } = this.form
          return Object.assign(baseObj, { icon, visible, permission })
        }
        case 'P': {
          const { icon, is_link } = this.form
          let { visible } = this.form
          if (this.isInnerPage) visible = 0
          if (is_link) {
            const { path, permission } = this.form
            return Object.assign(baseObj, { icon, visible, is_link, path, permission })
          } else {
            return Object.assign({}, this.form, { visible })
          }
        }
        case 'B': {
          const { permission, apis } = this.form
          return Object.assign(baseObj, { permission, apis })
        }
      }
    },
    cancel() {
      this.dialogVisible = false
    },
  },
}
</script>
