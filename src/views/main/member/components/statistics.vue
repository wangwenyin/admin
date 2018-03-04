<template>
  <el-dialog v-model="show" size="small" :close-on-click-modal='false'>
    <span slot="title">金币统计</span>
    <span>金币类型:</span>
    <el-select style="width: 100px;" size="small" v-model="query.coinType" placeholder="类型" @change="typeChange">
      <el-option v-for="(value, key) in { RECHARGE: '拍币', GIFT: '赠币' }" :key="key" :label="value" :value="key">
      </el-option>
    </el-select>
    <el-table :data="resource" border>
      <el-table-column label="充值总数" prop="recharge">
      </el-table-column>
      <el-table-column label="消耗总数" prop="consumption">
      </el-table-column>
      <el-table-column label="系统赠送" prop="gift">
      </el-table-column>
      <el-table-column label="剩余数" prop="remaining">
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
  export default {
    name: 'statistics',
    props: {
      currentView: String,
      visiable: {
        type: Boolean,
        default: false
      },
      item: {
        type: Object,
        default: {}
      }
    },
    computed: {
      show: {
        get: function () {
          return this.visiable
        },
        set: function (val) {
          if (!val) {
            this.$emit('update:visiable', false)
            this.$emit('update:currentView', '')
          }
        }
      }
    },
    data () {
      return {
        query: {
          userId: '',
          coinType: 'RECHARGE'
        },
        resource: []
      }
    },
    created () {
      this.query.userId = this.item.id
      this.findStatistics()
    },
    methods: {
      findStatistics () {
        this.$api.findUserCoinStatistics(this.query, data => {
          this.resource = [{
            recharge: data.resource.recharge,
            consumption: data.resource.consumption,
            gift: data.resource.gift,
            remaining: data.resource.remaining
          }]
        }, err => {
          this.$notify({
            type: 'error',
            message: err.message
          })
        })
      },
      typeChange (coinType) {
        this.query.coinType = coinType
        this.findStatistics()
      }
    }
  }

</script>

<style>


</style>
