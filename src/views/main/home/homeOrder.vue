<template>
  <div>
    <h2>订单数据</h2>
    <div>
      <el-row type="flex" class="row-bg">
        <el-col :span="2"><div class="grid-content bg-purple-light">订单数量<span>{{this.totalOrder.totalNum}} 条</span></div></el-col>
        <el-col :span="2"><div class="grid-content bg-purple-light">充值订单数<span>{{this.totalOrder.cNum}} 条</span></div></el-col>
        <el-col :span="2"><div class="grid-content bg-purple-light">充值金额<span>{{this.totalOrder.cAmount}} 元</span></div></el-col>
        <el-col :span="2"><div class="grid-content bg-purple-light">付款订单数<span>{{this.totalOrder.fNum}} 条</span></div></el-col>
        <el-col :span="2"><div class="grid-content bg-purple-light">付款金额<span>{{this.totalOrder.fAmount}} 元</span></div></el-col>
        <el-col :span="3"><div class="grid-content bg-purple-light">支付宝订单数<span>{{this.totalOrder.zNum}} 条</span></div></el-col>
        <el-col :span="3"><div class="grid-content bg-purple-light">支付宝订单金额<span>{{this.totalOrder.zAmount}} 元</span></div></el-col>
        <el-col :span="2"><div class="grid-content bg-purple-light">微信订单数<span>{{this.totalOrder.wNum}} 条</span></div></el-col>
        <el-col :span="2"><div class="grid-content bg-purple-light">微信订单金额<span>{{this.totalOrder.wAmount}} 元</span></div></el-col>
      </el-row>
    </div>
    <div>
      <el-form :model="query" inline>
        <el-form-item>
          <el-input size="small" v-model="query.userId" placeholder="用户ID"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input size="small" v-model="query.name" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input size="small" v-model="query.phone" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input size="small" v-model="query.payType" placeholder="支付渠道"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="startDate"
            size="small"
            align="right"
            type="date"
            placeholder="交易开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="endDate"
            size="small"
            align="right"
            type="date"
            placeholder="交易截止日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item >
          <el-button icon="search" type="primary" size="small" native-type="submit" @click.prevent="search">搜索</el-button>
        </el-form-item>
        <el-form-item >
          <el-button  type="primary" size="small" native-type="submit" @click.prevent="exHomeOrder">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 数据表格 -->
    <div>
      <h3>充值详情</h3>
    </div>
    <el-table
      :data="resource.content"
      border
    >
      <el-table-column
        label="用户ID"
        min-width="200"
        prop="userId">
      </el-table-column>
      <el-table-column
        label="用户名"
        width="100"
        prop="username">
      </el-table-column>
      <el-table-column
        label="手机号"
        width="150"
        prop="iphone">
      </el-table-column>
      <el-table-column
        label="订单号"
        width="200"
        prop="orderNo">
      </el-table-column>
      <el-table-column
        label="充值金额"
        min-width="60"
        prop="coin">
      </el-table-column>
      <el-table-column
        label="交易日期"
        prop="time_end"
        width="165">
      </el-table-column>
      <el-table-column
        label="支付渠道"
        prop="payType">
      </el-table-column>
      <el-table-column
        label="商品名称"
        min-width="200"
        prop="goods_tag">
      </el-table-column>
    </el-table>
    <!-- 分页栏 -->
    <el-pagination
      @current-change="pageChange"
      :current-page="query.pageNo"
      :page-size="query.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="resource.totalElements">
    </el-pagination>
    <br/>
    <br/>

    <div>
      <h3>付款详情</h3>
    </div>
    <el-table
      :data="payResource.content"
      border
    >
      <el-table-column
        label="用户ID"
        min-width="200"
        prop="userId">
      </el-table-column>
      <el-table-column
        label="账号"
        width="100"
        prop="name">
      </el-table-column>
      <el-table-column
        label="手机号"
        width="150"
        prop="iphone">
      </el-table-column>
      <el-table-column
        label="订单号"
        width="200"
        prop="serial">
      </el-table-column>
      <el-table-column
        label="付款金额"
        min-width="60"
        prop="price">
      </el-table-column>
      <el-table-column
        label="交易时间"
        prop="paymentTime"
        width="165">
        <template scope="scope">
          {{$filter.date(scope.row.paymentTime)}}
        </template>
      </el-table-column>
      <el-table-column
        label="支付渠道"
        prop="payType">
      </el-table-column>
      <el-table-column
        label="商品名称"
        min-width="200"
        prop="item_name">
      </el-table-column>
    </el-table>
    <!-- 分页栏 -->
    <el-pagination
      @current-change="pageChangePay"
      :current-page="pquery.pageNo"
      :page-size="pquery.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="payResource.totalElements">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: 'effectiveUser',
    data () {
      return {
        startDate: '',
        endDate: '',
        query: {
          userId: '',
          name: '',
          phone: '',
          payType: '',
          startTime: '',
          endTime: '',
          pageNo: 1,
          pageSize: 10
        },
        pquery: {
          userId: '',
          name: '',
          phone: '',
          payType: '',
          startTime: '',
          endTime: '',
          pageNo: 1,
          pageSize: 10
        },
        resource: {
          content: [],
          totalElements: 0
        },
        payResource: {
          content: [],
          totalElements: 0
        },
        totalOrder: {content: []}
      }
    },
    watch: {
      startDate: function (val, oldVal) {
        if (val) {
          this.query.startTime = val.getTime() + ''
        } else {
          this.query.startTime = ''
        }
      },
      endDate: function (val, oldVal) {
        if (val) {
          this.query.endTime = val.getTime() + ''
        } else {
          this.query.endTime = ''
        }
      }
    },
    created () {
      this.getHomeRecharge()
      this.getHomeOrderTotal()
      this.getHomePay()
    },
    methods: {
      getHomeRecharge () {
        this.$api.getHomeRecharge(this.query, data => {
          // data.resource.content.reverse()
          this.resource = data.resource
        }, err => {
          this.$notify({
            type: 'error',
            message: err.message
          })
        })
      },
      getHomePay () {
        this.pquery.userId = this.query.userId
        this.pquery.name = this.query.name
        this.pquery.phone = this.query.phone
        this.pquery.payType = this.query.payType
        this.pquery.startTime = this.query.startTime
        this.pquery.endTime = this.query.endTime
        this.$api.getHomePay(this.pquery, data => {
          // data.resource.content.reverse()
          this.payResource = data.resource
        }, err => {
          this.$notify({
            type: 'error',
            message: err.message
          })
        })
      },
      getHomeOrderTotal () {
        this.$api.getHomeOrderTotal(this.query, data => {
          this.totalOrder = data.resource
        }, err => {
          this.$notify({
            type: 'error',
            message: err.message
          })
        })
      },
      exHomeOrder () {
        var params = 'userId='+this.query.userId+'&name='+this.query.name+'&phone='+this.query.phone+'&payType='+this.query.payType+'&startTime='+this.query.startTime+'&endTime='+this.query.endTime
        window.location.href=window.basePath+'/pay/home/exportHomeOrder?'+params
      },
      search () {
        this.query.pageNo = 1
        this.getHomeRecharge()
        this.getHomePay()
        this.getHomeOrderTotal()
      },
      pageChange (current) {
        this.query.pageNo = current
        this.getHomeRecharge()
      },
      pageChangePay (current) {
        this.pquery.pageNo = current
        this.getHomePay()
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
