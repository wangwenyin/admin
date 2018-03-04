<template>
  <div>
    <h2>充值卡优惠卡使用记录</h2>
    <div>
      <el-form :model="query" inline>
        <el-form-item>
          <el-input size="small" v-model="query.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input size="small" v-model="query.money" placeholder="充值金额"></el-input>
        </el-form-item>
        <el-form-item >
          <el-select size="small" v-model="query.cardType" clearable placeholder="类型">
            <el-option
              v-for="(value, key) in $const.RECHARGE_CARD_TYPE"
              :key="key"
              :label="value"
              :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item >
          <el-select style="width: 90px;" size="small" v-model="query.isUse" clearable placeholder="状态">
            <el-option v-for="item in [{label: '未使用', value: false}, {label: '使用', value: true}]" :key="item.value" :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item >
          <el-button icon="search" type="primary" size="small" native-type="submit" @click.prevent="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 数据表格 -->
    <el-table
      :data="resource.content"
      border
    >
      <el-table-column
        label="用户">
        <template scope="scope">
          <span>{{scope.row.userId}}</span>
          <hr/>
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="类型"
        prop="type">
        <template scope="scope">
          {{$const.RECHARGE_CARD_TYPE[scope.row.type]}}
        </template>
      </el-table-column>
      <el-table-column
        label="充值金额"
        prop="money">
      </el-table-column>
      <el-table-column
        label="赠送金额"
        prop="give">
      </el-table-column>
      <el-table-column
        label="是否永久"
        prop="isForever">
        <template scope="scope">
          {{scope.row.isForever ? '是':'否'}}
        </template>
      </el-table-column>
      <el-table-column
        label="是否使用"
        prop="isUse">
        <template scope="scope">
          {{scope.row.isUse ? '是':'否'}}
        </template>
      </el-table-column>
      <el-table-column
        label="开始时间"
        prop="startAt">
        <template scope="scope">
          {{$filter.date(scope.row.startAt)}}
        </template>
      </el-table-column>
      <el-table-column
        label="结束时间"
        prop="endAt">
        <template scope="scope">
          {{$filter.date(scope.row.endAt)}}
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
    name: 'used',
    data () {
      return {
        query: {
          username: '',
          money: '',
          cardType: '',
          isUse: '',
          pageNo: 1,
          pageSize: 10
        },
        resource: {
          content: [],
          totalElements: 0
        }
      }
    },
    created () {
      this.findRechargeCardUsed()
    },
    methods: {
      findRechargeCardUsed () {
        this.$api.findRechargeCardUsed(this.query, data => {
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
        this.findRechargeCardUsed()
      },
      pageChange (current) {
        this.query.pageNo = current
        this.findRechargeCardUsed()
      }
    }
  }
</script>

<style>
</style>
