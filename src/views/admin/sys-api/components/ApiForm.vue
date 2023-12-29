<template>
  <div>
    <el-dialog :title="title" v-model="dialogVisible" width="500px">
      <el-form ref="apiForm" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="接口名称" prop="title">
          <el-input v-model="form.title" placeholder="接口名称" />
        </el-form-item>
        <el-form-item label="请求类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择请求类型" clearable>
            <el-option value="GET">GET</el-option>
            <el-option value="POST">POST</el-option>
            <el-option value="PUT">PUT</el-option>
            <el-option value="DELETE">DELETE</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="接口路径" prop="path">
          <el-input v-model="form.path" placeholder="请求地址" />
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
import { addApi, updateApi } from '@/api/admin/sys-api'

export default {
  name: 'ApiForm',
  data() {
    return {
      title: '',
      form: {},
      dialogVisible: false,
      rules: {
        title: [{ required: true, message: '接口名称不能为空', trigger: 'blur' }],
        path: [{ required: true, message: '接口路径不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '请求类型不能为空', trigger: 'blur' }],
      },
    }
  },
  methods: {
    open(item) {
      if (!item) {
        this.reset()
        this.title = '新增接口'
      } else {
        this.form = Object.assign({}, item)
        this.title = '编辑接口'
      }
      this.dialogVisible = true
    },
    reset() {
      this.form = {
        id: undefined,
        title: undefined,
        path: undefined,
        type: undefined,
      }
      this.resetForm('apiForm')
    },
    submitForm() {
      this.$refs.apiForm.validate((valid) => {
        if (valid) {
          if (this.form.id === undefined) {
            this.handleAddApi()
          } else {
            this.handleUpdateApi()
          }
        }
      })
    },
    handleAddApi() {
      addApi(this.form).then(() => {
        this.$message.success('新增成功')
        this.$emit('update')
        this.dialogVisible = false
      })
    },
    handleUpdateApi() {
      updateApi(this.form).then(() => {
        this.$message.success('编辑成功')
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
