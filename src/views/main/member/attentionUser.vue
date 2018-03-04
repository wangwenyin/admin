<template>
  <div>
    <h2>会员关注</h2>
    <div>
      <el-form :model="query" inline>
        <el-form-item>
          <el-input size="small" v-model="query.userId" placeholder="会员ID"></el-input>
        </el-form-item>
        <el-form-item >
          <el-button icon="search" type="primary" size="small" native-type="submit" @click.prevent="search">搜索</el-button>
        </el-form-item>
        <el-form-item >
          <el-button  type="primary" size="small" native-type="submit" @click.prevent="exEffective">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 数据表格 -->
    <el-table
      :data="resource.content"
      @sort-change="sortChange"
      border
    >
      <el-table-column
        label="会员ID"
        prop="id">
      </el-table-column>
      <el-table-column
        label="用户名"
        prop="username">
      </el-table-column>
      <el-table-column
        label="手机号"
        prop="iphone">
      </el-table-column>
      <el-table-column
        label="总充值"
        min-width="100"
        prop="total_recharge">
      </el-table-column>
      <el-table-column
        label="余额"
        min-width="90"
        prop="coin">
      </el-table-column>
      <el-table-column
        label="赠币余额"
        prop="gift">
      </el-table-column>
      <el-table-column
        label="注册时间"
        sortable="custom"
        prop="reportedTime"
        width="165">
        <template scope="scope">
          {{$filter.date(scope.row.reportedTime)}}
        </template>
      </el-table-column>
      <el-table-column
        label="最后充值"
        sortable="custom"
        prop="finalRecharge"
        width="165">
        <template scope="scope">
          {{$filter.date(scope.row.finalRecharge)}}
        </template>
      </el-table-column>
      <el-table-column
        label="最后竞拍"
        sortable="custom"
        prop="finalAuction"
        width="165">
        <template scope="scope">
          {{$filter.date(scope.row.finalAuction)}}
        </template>
      </el-table-column>
      <el-table-column
        label="离开天"
        sortable="custom"
        prop="leaveDay">
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
    name: 'attentionUser',
    data () {
      return {
        query: {
          userId: '',
          pageNo: 1,
          pageSize: 15
        },
        resource: {
          content: [],
          totalElements: 0
        }
      }
    },
    created () {
      this.findUserAttention()
    },
    methods: {
      findUserAttention () {
        this.$api.findUserAttention(this.query, data => {
          this.resource = data.resource
        }, err => {
          this.$notify({
            type: 'error',
            message: err.message
          })
        })
      },
      search () {
        this.query.pageNo = 1
        this.findUserAttention()
      },
      pageChange (current) {
        this.query.pageNo = current
        this.findUserAttention()
      },
      exEffective () {
        var params = 'userId='+this.query.userId+'&sort='+this.query.sort;
        window.location.href=window.basePath+'/admin/users/exportAttention?'+params
      },
      sortChange ({column, prop, order}) {
        console.log(column, prop, order)
        if (prop === 'reportedTime') {
          this.query.sort = 'registerDate'
        } else if (prop === 'finalRecharge') {
          this.query.sort = 'finalRechargeDate'
        } else if (prop === 'finalAuction') {
          this.query.sort = 'finalAuctionDate'
        } else if (prop === 'leaveDay') {
          this.query.sort = 'leaveDay'
        } else {
          this.query.sort = ''
        }
        if (order === 'ascending') {
          this.query.sort = this.query.sort + ' ASC'
        } else if (order === 'descending') {
          this.query.sort = this.query.sort + ' DESC'
        }
        this.query.pageNo = 1
        this.findUserAttention()
      }
    }
  }
</script>

<style>

</style>
