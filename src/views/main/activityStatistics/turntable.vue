<template>
  <div>
    <h2>大转盘15天统计</h2>
    <!-- 数据表格 -->
    <el-table
      style="width: 50%;"
      :data="resource"
      border
      >
      <el-table-column
        label="日期"
        prop="date">
      </el-table-column>
      <el-table-column
        label="人数"
        prop="userNum">
      </el-table-column>
      <el-table-column
        label="奖品价值"
        prop="money">
      </el-table-column>
      <el-table-column
        label="充值金额"
        prop="recharge">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'turntable',
  data () {
    return {
      resource: []
    }
  },
  created () {
    this.turntableStatisticsLast()
  },
  methods: {
    turntableStatisticsLast () {
      this.$api.turntableStatisticsLast(this.query, data => {
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
</style>
