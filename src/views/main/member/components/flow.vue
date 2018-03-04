<template>
<el-dialog v-model="show" size="small" :close-on-click-modal='false'>
  <span slot="title">金币流动情况</span>
  <span>金币类型:</span>
  <el-select style="width: 100px;" size="small" v-model="query.coinType" placeholder="类型" clearable>
    <el-option v-for="(value, key) in { RECHARGE: '拍币', GIFT: '赠币' }" :key="key" :label="value" :value="key">
    </el-option>
  </el-select>
  <el-button icon="search" type="primary" size="small" @click.prevent="pageChange(1)">查询</el-button>
  <el-table :data="resource.content" border>
    <el-table-column label="金币类型" prop="coinType">
      <template scope="scope">
        <span v-if="scope.row.coinType == 'RECHARGE'">拍币</span>
        <span v-else-if="scope.row.coinType == 'GIFT'">赠币</span>
      </template>
    </el-table-column>
    <el-table-column label="数额" prop="number">
    </el-table-column>
    <el-table-column label="原因" prop="reason">
    </el-table-column>
    <el-table-column label="时间" prop="time">
      <template scope="scope">
        {{ $filter.date(scope.row.time) }}
      </template>
    </el-table-column>
  </el-table>
  <el-pagination @current-change="pageChange" :current-page="query.pageNo" :page-size="query.pageSize" layout="total, prev, pager, next, jumper"
    :total="resource.totalElements">
  </el-pagination>
</el-dialog>

</template>

<script>
  export default {
    name: 'flow',
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
          pageNo: 1,
          pageSize: 10,
          coinType: ''
        },
        resource: {
          content: [],
          totalElements: 0
        }
      }
    },
    created () {
      this.query.userId = this.item.id
      this.findFlow()
    },
    methods: {
      findFlow () {
        this.$api.findUserCoinFlow(this.query, data => {
          this.resource = data.resource
        }, err => {
          this.$notify({
            type: 'error',
            message: err.message
          })
        })
      },
      pageChange (current) {
        this.query.pageNo = current
        this.findFlow()
      }
    }
  }

</script>

<style>

</style>
