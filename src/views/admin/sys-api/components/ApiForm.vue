<template>
  <div>
    <el-dialog :title="title" v-model="dialogVisible" width="500px">
      <el-form ref="apiForm" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="接口名称" prop="title">
          <el-input v-model="form.title" placeholder="接口名称" maxlength="128" />
        </el-form-item>
        <el-form-item label="请求类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择请求类型" clearable>
            <el-option
              v-for="dict in typeOptions"
              :key="dict.dict_value"
              :label="dict.dict_label"
              :value="dict.dict_value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="接口路径" prop="path">
          <el-input v-model="form.path" placeholder="接口路径" maxlength="128" />
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
import { addApi, updateApi } from '@/api/admin/sys-api'

export default {
  name: 'ApiForm',
  props: {
    typeOptions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      title: '',
      form: {},
      dialogVisible: false,
      submitLoading: false,
      rules: {
        title: [{ required: true, message: '接口名称不能为空', trigger: 'blur' }],
        path: [{ required: true, message: '接口路径不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '请求类型不能为空', trigger: 'blur' }],
      },
    }
  },
  methods: {
    open(item) {
      this.dialogVisible = true
      this.reset()
      if (!item) {
        this.title = '新增接口'
      } else {
        this.$nextTick(() => {
          Object.assign(this.form, item)
        })
        this.title = '编辑接口'
      }
    },
    reset() {
      this.form.id = undefined
      this.resetForm('apiForm')
    },
    submitForm() {
      this.$refs.apiForm.validate((valid) => {
        if (valid) {
          this.submitLoading = true
          if (this.form.id === undefined) {
            this.handleAddApi()
          } else {
            this.handleUpdateApi()
          }
        }
      })
    },
    handleAddApi() {
      addApi(this.form)
        .then(() => {
          this.$message.success('新增成功')
          this.$emit('update')
          this.dialogVisible = false
        })
        .finally(() => {
          this.submitLoading = false
        })
    },
    handleUpdateApi() {
      updateApi(this.form)
        .then(() => {
          this.$message.success('编辑成功')
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
