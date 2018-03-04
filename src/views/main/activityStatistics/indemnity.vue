<template>
  <div>
    <h2>不中包赔15天统计</h2>
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
        label="充值金额"
        prop="money">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'indemnity',
  data () {
    return {
      resource: []
    }
  },
  created () {
    this.indemnityStatisticsLast()
  },
  methods: {
    indemnityStatisticsLast () {
      this.$api.indemnityStatisticsLast(this.query, data => {
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
