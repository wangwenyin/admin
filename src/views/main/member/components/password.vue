<template>
  <el-dialog v-model="show" size="tiny" :close-on-click-modal='false'>
    <span slot="title">修改密码</span>
    <el-form ref="pwdForm" :model="formData" :rules="pwdRules" label-width="90px">
      <!-- <el-form-item prop="adminPwd" label="管理员密码">
              <el-input size="small" type="password" v-model="pwd.adminPwd"></el-input>
            </el-form-item> -->
      <el-form-item prop="newPassword" label="用户密码">
        <el-input style="width: 200px" size="small" type="password" v-model="formData.newPassword"></el-input>
      </el-form-item>
      <el-form-item prop="pwdCheck" label="重输密码">
        <el-input style="width: 200px" size="small" type="password" v-model="formData.pwdCheck"></el-input>
      </el-form-item>
    </el-form>
    <div style="text-align: center;">
      <el-button size="small" :loading="submiting" @click="submit('pwdForm')">确定</el-button>
      <el-button size="small" @click="show = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: 'password',
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
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.formData.pwdCheck !== '') {
            // 对第二个密码框单独验证
            this.$refs['pwdForm'].validateField('pwdCheck')
          }
          callback()
        }
      }
      const validatePassCheck = (rule, value, callback) => {
        if (value !== this.formData.newPassword) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        formData: {
          userId: '',
          newPassword: '',
          pwdCheck: ''
        },
        submiting: false,
        pwdRules: {
          newPassword: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { validator: validatePass, trigger: 'blur' }
          ],
          pwdCheck: [
            {required: true, message: '请再次输入密码', trigger: 'blur'},
            {validator: validatePassCheck, trigger: 'blur'}
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
            this.$api.updateUsersPwd(this.formData, data => {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.submiting = false
              this.show = false
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
