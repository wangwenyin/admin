<template>
  <div>
    <h2>充值优惠15天统计</h2>
    <el-form :model="query" inline>
        <el-form-item label="">
          <el-select size="small" v-model="query.money" placeholder="充值数额">
             <el-option
              v-for="(value, index) in list"
              :key="value.money"
              :label="value.money"
              :value="value.money">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item >
          <el-button icon="search" type="primary" size="small" native-type="submit" @click.prevent="search">搜索</el-button>
        </el-form-item>
      </el-form>
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
  name: 'benefitCard',
  data () {
    return {
      query: {
        money: 0
      },
      resource: [],
      list: []
    }
  },
  created () {
    this.getRechargeCardLimit()
  },
  methods: {
    benefitCardStatisticsLast () {
      this.$api.benefitCardStatisticsLast(this.query, data => {
        this.resource = data.resource
      }, err => {
        this.$notify({
          type: 'error',
          message: err.message
        })
      })
    },
    search () {
      this.benefitCardStatisticsLast()
    },
    getRechargeCardLimit () {
      this.$api.getRechargeCardLimit(null, data => {
        if (data.resource[0]) {
          this.query.money = data.resource[0].money
        }
        this.list = data.resource
        this.benefitCardStatisticsLast()
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
