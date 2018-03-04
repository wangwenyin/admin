<template>
  <div class="login">
    <div class="logo">
      <img src="" />
      <div>后台管理系统</div>
    </div>
    <el-card class="box-card">
      <el-form ref="form" :model="formData" :rules="rules" label-width="54px">
        <el-form-item label="账号" prop="identifier">
          <el-input v-model="formData.identifier" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="formData.password" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="validate">
          <el-input v-model="formData.validate" placeholder="验证码" style="width: 200px;display: inline-block;"></el-input>
          <div class="validate">
            <img :src="imgUrl" alt="code" class="login-code" @click="getImgCode">
          </div>
        </el-form-item>
        <el-form-item style="text-align: center" label-width="0px">
          <el-button class="loginBtn" type="primary" native-type="submit" :loading="loading" @click.prevent="onSubmit('form')">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'login',
    data () {
      const validateIdentifier = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入账号'))
        } else {
          callback()
        }
      }
      const validatePwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          callback()
        }
      }
      const validateValidate = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入验证码'))
        } else {
          callback()
        }
      }
      return {
        imgUrl: this.$ajax.defaults.baseURL + '/validate.jpg',
        formData: {
          identifier: '',
          password: '',
          validate: ''
        },
        loading: false,
        rules: {
          identifier: [
            {validator: validateIdentifier, trigger: 'blur'}
          ],
          password: [
            {validator: validatePwd, trigger: 'blur'}
          ],
          validate: [
            {validator: validateValidate, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      getImgCode () {
        this.imgUrl = this.$ajax.defaults.baseURL + '/validate.jpg?' + new Date().getTime()
      },
      onSubmit: function (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && !this.loading) {
            this.loading = true
            this.$api.login(this.formData, data => {
              let path = '/'
              if (this.$route.query.redirect) {
                path = this.$route.query.redirect
              }
              this.$router.push({path: path})
              this.$message({
                type: 'success',
                message: '登录成功'
              })
              this.loading = false
            }, err => {
              this.$message({
                type: 'error',
                message: `登录失败,${err.message}`
              })
              this.getImgCode()
              this.loading = false
            })
          } else {
            return false
          }
        })
      }
    }
  }
</script>

<style>
  .login {
    height: 100%;
    background-color: #f1f1f1;
  }
  .login:before {
    content: "";
    display: inline-block;
    height: 20%;
    vertical-align: middle;
  }

  .login .logo {
    position: absolute;
    top: 56px;
    margin-left: 50px;
  }

  .login .box-card {
    width: 400px;
    margin: auto;
  }
  .login .validate {
    width: 100px;
    display: inline-block;
  }
  .login .validate img {
    width: 100%;
    height: 34px;
    vertical-align: middle;
  }
  .login .loginBtn {
    width: 120px;
  }
</style>
