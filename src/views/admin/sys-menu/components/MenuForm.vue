<template>
  <div>
    <el-dialog :title="title" v-model="dialogVisible" width="700px">
      <div class="form-container" ref="formContainer">
        <el-form
          ref="menuForm"
          :model="form"
          :rules="rules"
          label-position="top"
          label-width="106px"
        >
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
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item prop="title">
                <template #label>
                  <span>菜单名称</span>
                </template>
                <el-input v-model="form.title" placeholder="请输入菜单名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="sort">
                <template #label>
                  <span>显示排序</span>
                </template>
                <el-input-number v-model="form.sort" controls-position="right" :min="0" />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item prop="menu_type">
                <template #label>
                  <span>菜单类型</span>
                </template>
                <el-radio-group
                  v-model="form.menu_type"
                  :disabled="disabled"
                  @change="handleMenuTypeChange"
                >
                  <el-radio label="M" :disabled="parentMenuType === 'C'">页面夹</el-radio>
                  <el-radio label="C" :disabled="parentMenuType === 'C'">页面</el-radio>
                  <el-radio label="F">按钮</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <el-col :span="24" v-if="form.menu_type != 'F'">
              <el-form-item label="菜单图标">
                <el-popover
                  placement="bottom-start"
                  width="460"
                  trigger="click"
                  @show="$refs['iconSelect'].reset()"
                >
                  <IconSelect ref="iconSelect" @selected="selected" />
                  <template #reference>
                    <el-input v-model="form.icon" placeholder="点击选择图标" clearable>
                      <template #prefix>
                        <svg-icon
                          v-if="form.icon"
                          :name="form.icon"
                          class="el-input__icon"
                          style="width: 25px"
                        />
                        <i v-else class="el-icon-search el-input__icon"></i>
                      </template>
                    </el-input>
                  </template>
                </el-popover>
              </el-form-item>
            </el-col>

            <el-col :span="12" v-if="form.menu_type === 'C'">
              <el-form-item prop="route_name">
                <template #label>
                  <span>路由名称</span>
                </template>
                <el-input
                  v-model="form.route_name"
                  placeholder="请输入路由名称"
                  :disabled="disabled"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="form.menu_type === 'C'">
              <el-form-item prop="component">
                <template #label>
                  <span>组件路径</span>
                </template>
                <el-input
                  v-model="form.component"
                  placeholder="请输入组件路径"
                  :disabled="disabled"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12" v-if="form.menu_type === 'C'">
              <el-form-item>
                <template #label>
                  <span>是否外链</span>
                </template>
                <el-radio-group v-model="form.is_frame" :disabled="disabled">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="form.menu_type === 'C'">
              <el-form-item prop="path">
                <template #label>
                  <span>路由地址</span>
                </template>
                <el-input v-model="form.path" placeholder="请输入路由地址" :disabled="disabled" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="form.menu_type !== 'M'">
              <el-form-item>
                <template #label>
                  <span>权限标识</span>
                </template>
                <el-input
                  v-model="form.permission"
                  placeholder="请输入权限标识"
                  maxlength="50"
                  :disabled="disabled"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12" v-if="form.menu_type != 'F'">
              <el-form-item>
                <template #label>
                  <span>菜单状态</span>
                </template>
                <el-radio-group v-model="form.visible" :disabled="disabled">
                  <el-radio
                    v-for="dict in visibleOptions"
                    :key="dict.dict_value"
                    :label="dict.dict_value"
                    >{{ dict.dict_label }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="form.menu_type === 'C'">
              <el-form-item>
                <template #label>
                  <span>显示布局</span>
                </template>
                <el-radio-group v-model="form.layout" :disabled="disabled">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="form.menu_type === 'C'">
              <el-form-item>
                <template #label>
                  <span>使用缓存</span>
                </template>
                <el-radio-group v-model="form.cache" :disabled="disabled">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <el-col :span="24" v-if="form.menu_type !== 'M'">
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
      </div>

      <template #footer>
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getMenuTree, addMenu, updateMenu } from '@/api/admin/sys-menu'
import IconSelect from '@/components/IconSelect/index.vue'

export default {
  name: 'MenuForm',
  components: {
    IconSelect,
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
      form: {
        apis: [],
      },
      rules: {
        title: [{ required: true, message: '菜单标题不能为空', trigger: 'blur' }],
        sort: [{ required: true, message: '菜单顺序不能为空', trigger: 'blur' }],
        component: [{ required: true, message: '组件路径不能为空', trigger: 'blur' }],
        path: [{ required: true, message: '路由地址不能为空', trigger: 'blur' }],
      },
      menuOptions: [],
      disabled: false,
      parentMenuType: '',
      defaultProps: {
        value: 'id',
        label: 'label',
        children: 'children',
        disabled: 'isDisabled',
      },
    }
  },
  methods: {
    open(type, item) {
      this.reset()
      if (type === 'add') {
        if (item) {
          this.form.parent_id = item.menu_id
          this.handleChangeParentMenuType(item)
        }
        this.title = '新增菜单'
      } else {
        if (item.permission === 'admin:sysmenu') {
          this.disabled = true
        }
        this.form = Object.assign({}, item)
        this.form.is_frame = String(this.form.is_frame)
        this.form.layout = String(this.form.layout)
        this.form.visible = String(this.form.visible)
        this.form.cache = String(this.form.cache)
        this.form.apis = this.form.api_list.map((api) => api.id)
        this.title = '修改菜单'
      }

      this.dialogVisible = true
      this.getTreeSelect()
      this.$nextTick(() => {
        this.$refs.formContainer.scrollTop = 0
      })
    },
    getTreeSelect() {
      getMenuTree().then((res) => {
        this.sourceData = []
        const menu = {
          menu_id: 0,
          menu_type: 'M',
          title: '根目录',
          children: [],
        }
        menu.children = res.data.sys_menu_tree
        this.sourceData.push(menu)
        this.menuOptions = this.sourceData.map((item) => this.normalizer(item))
        if (!this.form.parent_id) this.form.parent_id = 0
      })
    },
    normalizer(node) {
      let children = node.children.filter((item) => item.menu_type !== 'F')
      if (!(children && !children.length)) {
        children = node.children.map((item) => this.normalizer(item))
      }

      let isDisabled = false
      if (
        node.menu_type === 'F' ||
        node.menu_id === this.form.menu_id ||
        (node.menu_type !== 'M' && node.menu_type === this.form.menu_type)
      ) {
        isDisabled = true
      }

      return {
        id: node.menu_id,
        label: node.title,
        children,
        isDisabled,
        nodeData: node,
      }
    },
    handleMenuTypeChange() {
      this.menuOptions = this.sourceData.map((item) => this.normalizer(item))
    },
    handleParentMenuChange(val) {
      this.handleChangeParentMenuType(this.$refs.treeSelect.getNode(val).data.nodeData)
    },
    handleChangeParentMenuType(node) {
      this.parentMenuType = node.menu_type
      if (this.parentMenuType === 'C') {
        this.form.menu_type = 'F'
      }
    },
    reset() {
      this.form = {
        menu_id: undefined,
        parent_id: 0,
        route_name: undefined,
        icon: undefined,
        menu_type: 'M',
        apis: [],
        sort: 0,
        is_frame: '0',
        visible: '1',
        title: undefined,
        component: undefined,
        path: undefined,
        permission: undefined,
        layout: '1',
        cache: '0',
      }
      this.disabled = false
      this.parentMenuType = ''
      this.resetForm('menuForm')
    },
    selected(name) {
      this.form.icon = name
    },
    submitForm() {
      this.$refs.menuForm.validate((valid) => {
        if (valid) {
          if (this.form.menu_id === undefined) {
            this.handleAddMenu()
          } else {
            this.handleUpdateMenu()
          }
        }
      })
    },
    handleAddMenu() {
      addMenu(this.form).then(() => {
        this.$message.success('新增成功')
        this.$emit('update')
        this.dialogVisible = false
      })
    },
    handleUpdateMenu() {
      updateMenu(this.form).then(() => {
        this.$message.success('修改成功')
        this.$emit('update')
        this.dialogVisible = false
      })
    },
    cancel() {
      this.dialogVisible = false
      this.reset()
    },
  },
}
</script>

<style scoped>
.form-container {
  width: 100%;
  padding: 0 20px;
  max-height: 390px;
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>
