<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="500px"
    >
      <el-form ref="dataForm" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="数据标签" prop="dict_data_label">
          <el-input v-model="form.dict_data_label" placeholder="请输入数据标签" />
        </el-form-item>
        <el-form-item label="数据键值" prop="dict_data_value">
          <el-input v-model="form.dict_data_value" placeholder="请输入数据键值" />
        </el-form-item>
        <el-form-item label="显示排序" prop="dict_data_sort">
          <el-input-number v-model="form.dict_data_sort" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dict_value"
              :label="dict.dict_value"
            >{{ dict.dict_label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addDictData, updateDictData } from '@/api/admin/sys-dict-data'

export default {
  name: 'DataForm',
  props: {
    dictId: {
      type: [String, Number],
    },
    statusOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      title: '',
      form: {},
      dialogVisible: false,
      rules: {
        dict_data_label: [{ required: true, message: '数据标签不能为空', trigger: 'blur' }],
        dict_data_value: [{ required: true, message: '数据键值不能为空', trigger: 'blur' }],
        dict_data_sort: [{ required: true, message: '数据顺序不能为空', trigger: 'blur' }],
      },
    }
  },
  methods: {
    open(item) {
      if (!item) {
        this.reset()
        this.title = '新增字典数据'
      } else {
        this.form = Object.assign({}, item)
        this.form.status = String(this.form.status)
        this.title = '编辑字典数据'
      }
      this.dialogVisible = true
    },
    reset() {
      this.form = {
        dict_data_id: undefined,
        dict_data_label: undefined,
        dict_data_value: undefined,
        dict_data_sort: 0,
        status: '1',
        remark: undefined
      }
      this.resetForm('dataForm')
    },
    submitForm() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.form.dict_id = this.dictId
          if (this.form.dict_data_id === undefined) {
            this.handleAddDictData()
          } else {
            this.handleUpdateDictData()
          }
        }
      })
    },
    handleAddDictData() {
      addDictData(this.form).then(() => {
        this.$message.success('新增成功')
        this.dialogVisible = false
        this.$emit('update')
      })
    },
    handleUpdateDictData() {
      updateDictData(this.form).then(() => {
        this.$message.success('编辑成功')
        this.dialogVisible = false
        this.$emit('update')
      })
    },
    cancel() {
      this.dialogVisible = false
      this.reset()
    }
  }
}
</script>
