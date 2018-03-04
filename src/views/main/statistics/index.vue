<template>
  <div>
    <h2>普通会员充值统计</h2>
    <!-- <div>
      <el-form :model="query" inline>
        <el-form-item>
          <el-input size="small" v-model="query.name" placeholder="用户名称"></el-input>
        </el-form-item>
        <el-form-item >
          <el-input size="small" v-model="query.phone" placeholder="手机号码"></el-input>
        </el-form-item>
         <el-form-item >
          <el-button icon="search" type="primary" size="small" native-type="submit" @click.prevent="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div> -->
    <!-- 数据表格 -->
    <el-table
      :data="resource.content"
      border
      @sort-change="sortChange"
      >
      <el-table-column
        label="用户ID"
        prop="userId">
      </el-table-column>
      <el-table-column
        label="用户名称"
        prop="userName">
      </el-table-column>
      <el-table-column
        label="充值总数"
        sortable="custom"
        prop="rechargeNumber">
      </el-table-column>
      <el-table-column
        label="充值次数"
        prop="rechargeCount">
      </el-table-column>
      <el-table-column
        label="操作"
        width="120">
        <template scope="scope">
          <el-button :plain="true" type="primary" size="mini" style="margin-left: 0;" @click="showHistory(scope.$index, scope.row, 'history')">充值历史</el-button>
        </template>
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
    <!-- 弹出框 -->
    <el-dialog v-model="visiable.dialog" :size="(visiable.addr || visiable.notice || visiable.history || visiable.flow)?'small':'tiny'" :close-on-click-modal='false'>
      <template v-if="visiable.history">
        <span slot="title">详细充值历史记录</span>
        <el-table :data="historyResource.content" border>
          <el-table-column label="充值拍币数" prop="number">
          </el-table-column>
          <el-table-column label="金额" prop="price">
          </el-table-column>
          <el-table-column label="充值备注" prop="message">
          </el-table-column>
          <el-table-column label="时间" prop="date">
            <template scope="scope">
              {{ $filter.date(scope.row.date) }}
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="state">
            <template scope="scope">
              <span>{{scope.row.state == 'true' ? '成功' : '失败'}}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="historyPageChange"
          :current-page="historyQuery.pageNo"
          :page-size="historyQuery.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="historyResource.totalElements">
        </el-pagination>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'statistics',
  data () {
    return {
      query: {
        sort: '',
        pageNo: 1,
        pageSize: 10
      },
      resource: {
        content: [],
        totalElements: 0
      },
      visiable: {
        dialog: false,
        history: false
      },
      historyQuery: {
        userId: '',
        pageNo: 1,
        pageSize: 10
      },
      historyResource: {
        content: [],
        totalElements: 0
      }
    }
  },
  watch: {
  },
  created () {
    this.findNewUserRecharge()
  },
  methods: {
    findNewUserRecharge () {
      this.$api.findNewUserRecharge(this.query, data => {
        data.resource.totalElements = parseInt(data.resource.totalElements)
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
      this.findNewUserRecharge()
    },
    pageChange (current) {
      this.query.pageNo = current
      this.findNewUserRecharge()
    },
    showDialog (tempName) {
      for (let key in this.visiable) {
        this.$set(this.visiable, key, false)
      }
      if (this.visiable.hasOwnProperty(tempName)) {
        this.$set(this.visiable, tempName, true)
      }
      this.$set(this.visiable, 'dialog', true)
    },
    findHistory () {
      this.$api.findNewUserAllRecharge(this.historyQuery, data => {
        this.historyResource = data.resource
      }, err => {
        this.$notify({
          type: 'error',
          message: err.message
        })
      })
    },
    showHistory (index, row) {
      this.historyQuery.userId = row.userId
      this.findHistory()
      this.showDialog('history')
    },
    historyPageChange (current) {
      this.historyQuery.pageNo = current
      this.findHistory()
    },
    sortChange (sortData) {
      this.query.pageNo = 1
      if (sortData.prop === 'rechargeNumber') {
        this.query.sort = sortData.order
      } else {
        this.query.sort = ''
      }
      this.findNewUserRecharge()
    }
  }
}
</script>

<style>

</style>

