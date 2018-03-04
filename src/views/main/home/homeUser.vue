<template>
  <div>
    <h2>渠道数据</h2>
    <div>
      <el-row type="flex" class="row-bg">
        <el-col :span="2"><div class="grid-content bg-purple-light">注册人数<span>{{this.totalUser.totalUser}} 人</span></div></el-col>
        <el-col :span="2"><div class="grid-content bg-purple-light">激活人数<span>{{this.totalUser.giftUse}} 人</span></div></el-col>
        <el-col :span="2"><div class="grid-content bg-purple-light">充值人数<span>{{this.totalUser.chargeUser}} 人</span></div></el-col>
        <el-col :span="2"><div class="grid-content bg-purple-light">充值总额<span>{{this.totalUser.chargeAmount}} 元</span></div></el-col>
        <el-col :span="2"><div class="grid-content bg-purple-light">付款人数<span>{{this.totalUser.orderUser}} 人</span></div></el-col>
        <el-col :span="2"><div class="grid-content bg-purple-light">付款总额<span>{{this.totalUser.orderAmount}} 元</span></div></el-col>
        <el-col :span="2"><div class="grid-content bg-purple-light">拍中商品数<span>{{this.totalUser.proNumber}} 个</span></div></el-col>
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
          <el-input size="small" v-model="query.source" placeholder="渠道"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="startDate"
            size="small"
            align="right"
            type="date"
            placeholder="注册日期起始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="endDate"
            size="small"
            align="right"
            type="date"
            placeholder="注册日期截止时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item >
          <el-select style="width: 80px;" size="small" v-model="query.disable" clearable placeholder="状态">
            <el-option
              v-for="item in [{label: '禁用', value: true}, {label: '启用', value: false}]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item >
          <el-button icon="search" type="primary" size="small" native-type="submit" @click.prevent="search">搜索</el-button>
        </el-form-item>
        <el-form-item >
          <el-button  type="primary" size="small" native-type="submit" @click.prevent="exEffectiveUser">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 数据表格 -->
    <el-table
      :data="resource.content"
      border
    >
      <el-table-column
        label="用户信息"
        width="200">
        <template scope="scope">
          <div>
            <span style="color: #20a0ff">ID:</span> {{scope.row.id}}
          </div>
          <div>
            <span style="color: #20a0ff">账号:</span> {{scope.row.username}}
          </div>
          <div>
            <span style="color: #20a0ff">手机号码:</span> {{scope.row.iphone}}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        prop="disable"
        width="80">
        <template scope="scope">
            <el-tag :type="scope.row.disable ? 'danger' : 'success'">
              {{scope.row.disable ? '禁用' : '启用'}}
            </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="注册时间"
        prop="join_date"
        width="165">
        <template scope="scope">
          {{$filter.date(scope.row.join_date)}}
        </template>
      </el-table-column>
      <el-table-column
        label="最后登录时间"
        prop="final_login"
        width="165">
        <template scope="scope">
          {{$filter.date(scope.row.final_login)}}
        </template>
      </el-table-column>
      <el-table-column
        label="注册IP"
        prop="ip">
      </el-table-column>
      <el-table-column
        label="总充值"
        min-width="60"
        prop="total_recharge">
      </el-table-column>
      <el-table-column
        label="拍币余额"
        min-width="60"
        prop="coin">
      </el-table-column>
      <el-table-column
        label="赠币余额"
        prop="gift">
      </el-table-column>
      <el-table-column
        label="竞拍成功次数"
        prop="sealNumber">
      </el-table-column>
      <el-table-column
        label="竞拍商品数"
        prop="joinProNumber">
      </el-table-column>
      <el-table-column
        label="渠道"
        prop="source">
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
          disable: '',
          startTime: '',
          endTime: '',
          pageNo: 1,
          pageSize: 10,
          source: ''
        },
        resource: {
          content: [],
          totalElements: 0
        },
        totalUser: {content: []}
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
      this.getHomeUsers()
      this.getHomeTotal()
    },
    methods: {
      getHomeUsers () {
        this.$api.getHomeUsers(this.query, data => {
          // data.resource.content.reverse()
          this.resource = data.resource
        }, err => {
          this.$notify({
            type: 'error',
            message: err.message
          })
        })
      },
      getHomeTotal () {
        this.$api.getHomeTotal(this.query, data => {
          this.totalUser = data.resource
        }, err => {
          this.$notify({
            type: 'error',
            message: err.message
          })
        })
      },
      exEffectiveUser () {
        var params = 'userId='+this.query.userId+'&name='+this.query.name+'&source='+this.query.source+'&phone='+this.query.phone+'&disable='+this.query.disable+'&startTime='+this.query.startTime+'&endTime='+this.query.endTime
        window.location.href=window.basePath+'/admin/home/exportUsers?'+params
      },
      search () {
        this.query.pageNo = 1
        this.getHomeUsers()
        this.getHomeTotal()
      },
      pageChange (current) {
        this.query.pageNo = current
        this.getHomeUsers()
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
