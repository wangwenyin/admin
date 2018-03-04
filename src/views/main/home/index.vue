<template>
  <div class="home">
    <h2>首页</h2>
    <div>
      <el-row type="flex" class="row-bg">
        <el-col :span="6"><div class="grid-content bg-purple-light">当前在线:<span>{{num}} 人</span></div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple-light">注册用户:<span>{{this.resource.totalUser}} 人</span></div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple-light">充值用户:<span>{{this.resource.chargeUser}} 人</span></div></el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="6"><div class="grid-content bg-purple-light">充值总额:<span>{{this.resource.chargeAmount}} 元</span></div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple-light">拍币总额:<span>{{this.resource.recharge}} 拍币</span></div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple-light">赠币总额:<span>{{this.resource.gift}} 赠币</span></div></el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="6"><div class="grid-content bg-purple-light">产品总数:<span>{{this.resource.proTotalNum}} 件</span></div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple-light">实物总数:<span>{{this.resource.inKind}} 件</span></div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple-light">虚拟总数:<span>{{this.resource.invented}} 件</span></div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple-light">首页总数:<span>{{this.resource.frontShowNum}} 件</span></div></el-col>
      </el-row>
    </div>

    <br/>
    <br/>
    <div>
      <router-link to='homeUser'><el-button type="primary">渠道统计</el-button></router-link>&nbsp;&nbsp;&nbsp;&nbsp;
      <router-link to='homeItem'><el-button type="primary">商品统计</el-button></router-link>&nbsp;&nbsp;&nbsp;&nbsp;
      <router-link to='homeOrder'><el-button type="primary">订单统计</el-button></router-link>&nbsp;&nbsp;&nbsp;&nbsp;
      <!--<h4><a href="homeUser">渠道统计</a></h4>-->
      <!--<h4><a href="homeUser">渠道统计</a></h4>
      <h4><a href="@/views/main/home/homeUser.vue">渠道统计</a></h4>
      <h4><a href="@/views/main/home/homeUser">渠道统计</a></h4>-->
    </div>
  </div>


</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      resource: {
        content: []
      },
      num: 0
    }
  },
  created () {
    this.getOnlineNum()
  },
  mounted () {
  },
  methods: {
    getOnlineNum () {
      this.$api.getOnlineNum(null, data => {
        this.num = data.resource.onlineNumber
        this.resource = data.resource
      }, err => {
        this.$notify({
          type: 'error',
          message: err.message
        })
      })
    }
  }
}
</script>

<style>
  .el-row {
    margin-bottom: 20px;
  &:last-child {
     margin-bottom: 0;
   }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
