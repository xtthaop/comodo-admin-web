<template>
  <div>
    <el-dialog :title="title" v-model="dialogVisible" width="500px">
      <el-form ref="dictForm" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="字典名称" prop="dict_name">
          <el-input v-model="form.dict_name" placeholder="请输入字典名称" maxlength="128" />
        </el-form-item>
        <el-form-item label="字典类型" prop="dict_type">
          <el-input v-model="form.dict_type" placeholder="请输入字典类型" maxlength="128" />
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
import { addDictType, updateDictType } from '@/api/admin/sys-dict-type'

export default {
  name: 'DictForm',
  props: {
    statusOptions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dialogVisible: false,
      submitLoading: false,
      form: {
        status: 1,
      },
      rules: {
        dict_name: [{ required: true, message: '字典名称不能为空', trigger: 'blur' }],
        dict_type: [{ required: true, message: '字典类型不能为空', trigger: 'blur' }],
      },
      title: '',
    }
  },
  methods: {
    open(item) {
      this.dialogVisible = true
      this.reset()
      if (!item) {
        this.title = '新增字典类型'
      } else {
        this.$nextTick(() => {
          Object.assign(this.form, item)
        })
        this.title = '编辑字典类型'
      }
    },
    reset() {
      this.form.dict_id = undefined
      this.resetForm('dictForm')
    },
    submitForm() {
      this.$refs.dictForm.validate((valid) => {
        if (valid) {
          this.submitLoading = true
          if (this.form.dict_id === undefined) {
            this.handleAddDictType()
          } else {
            this.handleUpdateDictType()
          }
        }
      })
    },
    handleAddDictType() {
      addDictType(this.form)
        .then(() => {
          this.$message.success('新增成功')
          this.dialogVisible = false
          this.$emit('update')
        })
        .finally(() => {
          this.submitLoading = false
        })
    },
    handleUpdateDictType() {
      updateDictType(this.form)
        .then(() => {
          this.$message.success('修改成功')
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
