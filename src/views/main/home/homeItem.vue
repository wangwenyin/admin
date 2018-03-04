<template>
  <div>
    <h2>商品数据</h2>
    <div>
      <el-form :model="query" inline>
        <el-form-item>
          <el-input size="small" v-model="query.itemName" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input size="small" v-model="query.periods" placeholder="期数"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="startDate"
            size="small"
            align="right"
            type="date"
            placeholder="上架起始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="endDate"
            size="small"
            align="right"
            type="date"
            placeholder="上架截止时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item >
          <el-button icon="search" type="primary" size="small" native-type="submit" @click.prevent="search">搜索</el-button>
        </el-form-item>
        <el-form-item >
          <el-button  type="primary" size="small" native-type="submit" @click.prevent="exHomeItem">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 数据表格 -->
    <el-table
      :data="resource.content"
      border
    >
      <el-table-column
        label="商品编号"
        prop="id">
      </el-table-column>
      <el-table-column
        label="商品名称"
        prop="name">
      </el-table-column>
      <el-table-column
        label="消耗拍币赠币总数"
        prop="coin">
        <template scope="scope">
          {{scope.row.rechargeNum + scope.row.giftNum}}
        </template>
      </el-table-column>
      <el-table-column
        label="消耗拍币总数"
        prop="rechargeNum">
      </el-table-column>
      <el-table-column
        label="消耗赠币总数"
        prop="giftNum">
      </el-table-column>
      <el-table-column
        label="用户参与成交期数"
        prop="joinNum">
      </el-table-column>
      <el-table-column
        label="上架时间"
        prop="time"
        width="165">
        <template scope="scope">
          {{$filter.date(scope.row.time)}}
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
          itemName: '',
          periods: '',
          startTime: '',
          endTime: '',
          pageNo: 1,
          pageSize: 10
        },
        resource: {
          content: [],
          totalElements: 0
        }
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
      this.getHomeItems()
    },
    methods: {
      getHomeItems () {
        this.$api.getHomeItems(this.query, data => {
          // data.resource.content.reverse()
          this.resource = data.resource
        }, err => {
          this.$notify({
            type: 'error',
            message: err.message
          })
        })
      },
      exHomeItem () {
        var params = 'itemName='+this.query.itemName+'&periods='+this.query.periods+'&startTime='+this.query.startTime+'&endTime='+this.query.endTime
        window.location.href=window.basePath+'/admin/home/exportItem?'+params
      },
      search () {
        this.query.pageNo = 1
        this.getHomeItems()
      },
      pageChange (current) {
        this.query.pageNo = current
        this.getHomeItems()
      }
    }
  }
</script>

<style>

</style>
