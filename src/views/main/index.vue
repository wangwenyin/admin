<template>
  <div class="layout">
    <el-row type="flex" :style="{minHeight: menuMinHeight}">
      <el-col :span="spanLeft" style="display: flex">
        <el-menu class="layout-menu-left"
          :default-active="activeName"
          :router="false"
          :unique-opened="true"
          @select="selectMenuItem"
          @open="openMenu"
          theme="dark">
          <div class="layout-logo-left">
            <!--<img style="height: 50px;" src="">-->
          </div>
          <el-menu-item index="home">
            <span>首页</span>
          </el-menu-item>
          <el-submenu index="activities">
            <span slot="title">活动管理</span>
            <el-menu-item index="turntable">
              <span>大转盘</span>
            </el-menu-item>
            <el-menu-item index="rechargeCard">
              <span>充值优惠卡</span>
            </el-menu-item>
            <el-menu-item index="compensation">
              <span>不中包赔</span>
            </el-menu-item>
            <el-menu-item index="share">
              <span>分享邀请</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="activityStatistics">
            <span slot="title">活动统计</span>
            <el-menu-item index="benefitCardRegisterStatistics">
              <span>新人充值优惠</span>
            </el-menu-item>
            <el-menu-item index="benefitCardStatistics">
              <span>充值优惠</span>
            </el-menu-item>
            <el-menu-item index="indemnityStatistics">
              <span>不中包赔</span>
            </el-menu-item>
            <el-menu-item index="turntableStatistics">
              <span>大转盘</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="effectiveUser">
            <span slot="title">会员管理</span>
            <el-menu-item index="effectiveUser">
              <span>有效会员</span>
            </el-menu-item>
            <el-menu-item index="attentionUser">
              <span>会员关注</span>
            </el-menu-item>
            <el-menu-item index="approvalShowOrder">
              <span>晒单审批</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="commodityList">
            <span slot="title">产品管理</span>
            <el-menu-item index="carousel">
              <span>轮播图设置</span>
            </el-menu-item>
            <el-menu-item index="sortList">
              <span>分类管理</span>
            </el-menu-item>
            <el-menu-item index="commodityList">
              <span>商品管理</span>
            </el-menu-item>
            <el-menu-item index="label">
              <span>标签设置</span>
            </el-menu-item>
            <el-menu-item index="winner">
              <span>中奖管理</span>
            </el-menu-item>
            <el-menu-item index="latestDeal">
							<span>最新成交</span>
						</el-menu-item>
          </el-submenu>

          


          <el-submenu index="system">
            <span slot="title">系统设置</span>
            <el-menu-item index="system">
              <span>系统设置</span>
            </el-menu-item>
            <el-menu-item index="app">
              <span>版本更新</span>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="noticeList">
            <span slot="title">通知管理</span>
            <el-menu-item index="noticeList">
              <span>公告通知</span>
            </el-menu-item>
            <el-menu-item index="systemNotice">
              <span>系统通知</span>
            </el-menu-item>
            <el-menu-item index="complainList">
              <span>投诉建议</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="robot" v-if="$globalBus.superman">
            <span slot="title">机器人系统</span>
            <el-menu-item index="robotUserList">
              <span>机器人用户列表</span>
            </el-menu-item>
            <el-menu-item index="robotItem">
              <span>机器人商品列表</span>
            </el-menu-item>
            <el-menu-item index="robotShowPrize">
              <span>机器人晒单</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
      <el-col :span="spanRight" class="content-right">
        <div class="layout-header">
          <div style="position: absolute;right: 40px;top:20px">
            <el-popover
              v-model="updatePwdPopover"
              placement="bottom"
              width="100"
              trigger="click"
              :visible-arrow="false" >
              <span slot="reference">欢迎！&nbsp;<el-button type="text">{{$globalBus.USER.username}}</el-button></span>
              <el-button style="width: 100%;background-color: #ddd" type="text" @click="updatePwd()">修改密码</el-button>
            </el-popover>
             |
            <el-button type="text" @click="loginOut">退出</el-button>
          </div>
        </div>
        <div class="layout-breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="item.path">
              <span v-if="index === breadcrumb.length - 1">{{item.cname}}</span>
              <router-link v-else :to="item.path">{{item.cname}}</router-link>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="layout-content" :style="{minHeight: contentMinHeight}">
          <div class="layout-content-main">
            <transition name="fadeIn">
              <router-view></router-view>
            </transition>
          </div>
        </div>
        <div class="layout-copy">

        </div>
        <el-dialog
          title="修改管理员密码"
          :visible.sync="updatePwdDialog"
          size="tiny">
          <el-form ref="adminPwdForm" :model="adminPwd" :rules="adminPwdRules" label-width="90px">
            <el-form-item prop="oldPassword" label="旧密码">
              <el-input size="small" type="password" v-model="adminPwd.oldPassword"></el-input>
            </el-form-item>
            <el-form-item prop="newPassword" label="新密码">
              <el-input size="small" type="password" v-model="adminPwd.newPassword"></el-input>
            </el-form-item>
            <el-form-item prop="pwdCheck" label="重输密码">
              <el-input size="small" type="password" v-model="adminPwd.pwdCheck"></el-input>
            </el-form-item>
          </el-form>
          <div style="text-align: center;">
            <el-button size="small" @click="updatePwdDialog = false">取消</el-button>
            <el-button size="small" :loading="updating" @click="updatePwd('adminPwdForm')">确定</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import globalBus from '../../globaBus'
  export default {
    name: 'main',
    data () {
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.adminPwd.pwdCheck !== '') {
            // 对第二个密码框单独验证
            this.$refs['adminPwdForm'].validateField('pwdCheck')
          }
          callback()
        }
      }
      const validatePassCheck = (rule, value, callback) => {
        if (value !== this.adminPwd.newPassword) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        spanLeft: 3,
        spanRight: 21,
        menuMinHeight: '',
        contentMinHeight: '',
        updatePwdPopover: false,
        updatePwdDialog: false,
        updating: false,
        adminPwd: {
          oldPassword: '',
          newPassword: '',
          pwdCheck: ''
        },
        adminPwdRules: {
          oldPassword: [
            { required: true, message: '请输入旧密码', trigger: 'blur' }
          ],
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
    computed: {
      activeName: function () {
        return this.$route.name
      },
      breadcrumb: function () {
        let list = []
        let matched = this.$route.matched
        for (let i in matched) {
          if (matched[i].meta.cname) {
            let obj = {
              name: matched[i].name,
              cname: matched[i].meta.cname,
              path: matched[i].path
            }
            list.push(obj)
          }
        }
        return list
      }
    },
    // 你可以在路由组件内直接定义以下路由导航守卫：在渲染该组件的对应路由被 confirm 前调用
    beforeRouteEnter (to, form, next) {
      globalBus.$api.isSuperman(null, data => {
        globalBus.superman = data.resource
        if (data.resource) {
          next()
        } else {
          let supermanAllow = ['robot', 'robotUserList', 'robotItem', 'robotShowPrize']
          if (supermanAllow.indexOf(to.name) !== -1) {
            next(form.fullPath)
          } else {
            next()
          }
        }
      }, err => {
        next(form.fullPath)
        this.$notify({
          type: 'error',
          message: err.message
        })
      })
    },
    created () {
      this.autoMinHeight()
    },
    mounted () {
    },
    methods: {
      autoMinHeight () {
        let minH = window.innerHeight
        this.menuMinHeight = minH - 10 + 'px'
        this.contentMinHeight = minH - 167 + 'px'
        window.onresize = () => {
          let minH = window.innerHeight
          this.menuMinHeight = minH - 10 + 'px'
          this.contentMinHeight = minH - 167 + 'px'
        }
      },
      selectMenuItem (index, indexPath) {
        if (index === 'loginout') {
          this.loginOut()
          return
        }
        this.$router.push({ name: index })
      },
      openMenu (index, indexPath) {
        this.$router.push({ name: index })
      },
      loginOut () {
        this.$api.loginOut(data => {
          this.$globalBus.USER = {}
          this.$message('退出成功')
          this.$router.push({ name: 'login' })
        }, err => {
          this.$message(`退出失败,${err.message}`)
          this.$router.push({ name: 'login' })
        })
      },
      updatePwd (formName) {
        if (formName) {
          this.$refs[formName].validate(valid => {
            if (valid && !this.updating) {
              this.updating = true
              this.$api.updatePwd(this.adminPwd, data => {
                this.$message('修改成功')
                this.updating = false
                this.updatePwdDialog = false
                this.$api.loginOut(data => {
                  this.$globalBus.USER = {}
                  this.$router.push({name: 'login'})
                }, err => {
                  this.$globalBus.USER = {}
                  this.$router.push({name: 'login'})
                  console.log(err.message)
                })
              }, err => {
                this.updating = false
                this.$message({
                  type: 'error',
                  message: err.message
                })
              })
            }
          })
        } else {
          this.updatePwdPopover = false
          this.updatePwdDialog = true
          this.$nextTick(() => {
            this.$refs['adminPwdForm'].resetFields()
          })
        }
      }
    },
    destroyed () {
    }
  }
</script>

<style>
@import '../../assets/css/common.css';
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}

.layout-breadcrumb {
  padding: 10px 15px 0;
}

.layout-content {
  min-height: 200px;
  margin: 15px;
  overflow: hidden;
  background: #fff;
  border-radius: 4px;
}

.layout-content-main {
  padding: 10px;
}

.layout-copy {
  text-align: center;
  padding: 10px 0 20px;
  color: #9ea7b4;
}

.layout-menu-left {
  width: 100%;
}

.layout-header {
  height: 60px;
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
}

.layout-logo-left {
  width: 90%;
  height: 60px;
  background: rgba(43, 45, 66, 0.34);
  border-radius: 3px;
  margin: 15px auto;
  text-align: center;
  padding-top: 10px;
}

.layout-ceiling-main a {
  color: #9ba7b5;
}

.layout-hide-text .layout-text {
  display: none;
}
.fadeIn-enter-active {
  animation: fade-in .8s;
}
.fadeIn-leave-active {
  display: none;
}
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to{
    opacity: 1;
  }
}

</style>
