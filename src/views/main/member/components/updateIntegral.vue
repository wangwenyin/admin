<template>
<el-dialog v-model="show" size="small" :close-on-click-modal='false'>
  <span slot="title">修改积分</span>
  <el-form ref="formDataForm" :model="formData" :rules="rules" label-width="70px">
    <el-form-item prop="number" label="数目">
      <el-input-number v-model="formData.number" :step="1" :controls="false"></el-input-number>
    </el-form-item>
    <el-form-item prop="reason" label="原因">
      <el-input type="textarea" size="small" v-model="formData.reason"></el-input>
    </el-form-item>
  </el-form>
  <div style="text-align: center;">
    <el-button size="small" :loading="submiting" @click="submit('formDataForm')">确定</el-button>
    <el-button size="small" @click="show = false">取消</el-button>
  </div>
</el-dialog>

</template>

<script>
  export default {
    name: 'updateGift',
    props: {
      currentView: String,
      visiable: {
        type: Boolean,
        default: false
      },
      item: {
        type: Object,
        default: {}
      }
    },
    computed: {
      show: {
        get: function () {
          return this.visiable
        },
        set: function (val) {
          if (!val) {
            this.$emit('update:visiable', false)
            this.$emit('update:currentView', '')
          }
        }
      }
    },
    data () {
      return {
        submiting: false,
        formData: {
          userId: '',
          number: '',
          reason: ''
        },
        rules: {
          number: [
            { required: true, type: 'number', message: '请输入数量', trigger: 'blur' }
          ],
          reason: [
            { required: true, message: '请输入原因', trigger: 'blur' }
          ]
        }
      }
    },
    created () {
      this.formData.userId = this.item.id
    },
    methods: {
      submit (formName) {
        this.$refs[formName].validate(valid => {
          if (valid && !this.submiting) {
            this.submiting = true
            this.$api.giftIntegral(this.formData, data => {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.submiting = false
              this.show = false
              this.$emit('updateTableData')
            }, err => {
              this.submiting = false
              this.$message({
                type: 'error',
                message: err.message
              })
            })
          }
        })
      }
    }
  }

</script>

<style>

</style>
