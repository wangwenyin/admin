<template>
  <div>
    <h2>新人充值优惠15天统计</h2>
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
        label="金额"
        prop="money">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'benefitCardStatisticsLast',
  data () {
    return {
      resource: []
    }
  },
  created () {
    this.benefitCardStatisticsLastRegisterGive()
  },
  methods: {
    benefitCardStatisticsLastRegisterGive () {
      this.$api.benefitCardStatisticsLastRegisterGive(this.query, data => {
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
