<template>
  <div>
    <el-dialog :title="title" v-model="dialogVisible" width="500px">
      <el-form ref="dataForm" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标签" prop="dict_data_label">
          <el-input v-model="form.dict_data_label" placeholder="请输入数据标签" maxlength="128" />
        </el-form-item>
        <el-form-item label="键值" prop="dict_data_value">
          <el-input v-model="form.dict_data_value" placeholder="请输入数据键值" maxlength="255" />
        </el-form-item>
        <el-form-item label="显示排序" prop="dict_data_sort">
          <el-input-number
            v-model="form.dict_data_sort"
            controls-position="right"
            :min="0"
            :max="4294967295"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dict_value"
              :label="Number(dict.dict_value)"
              >{{ dict.dict_label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
            maxlength="255"
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
import { addDictData, updateDictData } from '@/api/admin/sys-dict-data'

export default {
  name: 'DataForm',
  props: {
    dictId: {
      type: [String, Number],
    },
    statusOptions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      title: '',
      form: {
        status: 1,
        dict_data_sort: 0,
      },
      dialogVisible: false,
      submitLoading: false,
      rules: {
        dict_data_label: [{ required: true, message: '数据标签不能为空', trigger: 'blur' }],
        dict_data_value: [{ required: true, message: '数据键值不能为空', trigger: 'blur' }],
        dict_data_sort: [{ required: true, message: '数据顺序不能为空', trigger: 'blur' }],
      },
    }
  },
  methods: {
    open(item) {
      this.dialogVisible = true
      this.reset()
      if (!item) {
        this.title = '新增字典数据'
      } else {
        this.$nextTick(() => {
          Object.assign(this.form, item)
        })
        this.title = '编辑字典数据'
      }
    },
    reset() {
      this.form.dict_data_id = undefined
      this.resetForm('dataForm')
    },
    submitForm() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.submitLoading = true
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
      addDictData(this.form)
        .then(() => {
          this.$message.success('新增成功')
          this.dialogVisible = false
          this.$emit('update')
        })
        .finally(() => {
          this.submitLoading = false
        })
    },
    handleUpdateDictData() {
      updateDictData(this.form)
        .then(() => {
          this.$message.success('编辑成功')
          this.dialogVisible = false
          this.$emit('update')
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
