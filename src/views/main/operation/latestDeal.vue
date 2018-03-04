<template>
  <div id="latestDeal">
    <h2>最新成交</h2>
    <div>
      <el-form :model="query" inline>
      <el-form-item>
          <el-input size="small" v-model="query.name" placeholder="中奖人"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input size="small" v-model="query.itemName" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item >
           <el-select size="small" v-model="query.join" clearable placeholder="是否真人参与">
            <el-option
              v-for="(item, key) in [{label: '是', value: true}, {label: '否', value: false}]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item >
           <el-select size="small" v-model="query.robot" clearable placeholder="是否机器人">
            <el-option
              v-for="(item, key) in [{label: '机器人', value: true}, {label: '不是机器人', value: false}]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item >
          <el-button icon="search" type="primary" size="small" native-type="submit" @click.prevent="search">搜索</el-button>
        </el-form-item>
        <el-form-item >
          <el-button  type="primary" size="small" native-type="submit" @click.prevent="exportWin">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 数据表格 -->
    <el-table :data="resource.content" border>
      <el-table-column label="编号" prop="id">
      </el-table-column>
      <el-table-column label="商品名称" prop="itemName">
      </el-table-column>
      <el-table-column label="商品小图" prop="picture" width="170">
        <template scope="scope">
          <el-button size="mini" style="overflow:hidden" @click="showImg(scope.row.picture)">
            <img style="width:130px;height:100px;" :src="$api.file.see(scope.row.picture)">
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="成本价" prop="cost">
      </el-table-column>
      <!-- <el-table-column label="市场价" prop="market_price">
      </el-table-column> -->
      <el-table-column label="成交价" prop="market_price">
      </el-table-column>
      <el-table-column label="实际投票数" prop="income">
      </el-table-column>
      <el-table-column label="盈亏值" prop="profit">
      </el-table-column>
      <el-table-column label="中奖人" prop="name">
      </el-table-column>
      <el-table-column label="交易时间" prop="time">
        <template scope="scope">
          <span>{{$filter.date(scope.row.time)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template scope="scope">
          <el-button :plain="true" type="primary" size="mini" style="margin-left: 0;" @click="showInfo(scope.$index, scope.row)">详情</el-button>
          <el-button :plain="true" type="primary" size="mini" style="margin-left: 0;" @click="showRecord(scope.$index, scope.row)">出价记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页栏 -->
    <el-pagination @current-change="pageChange" :current-page="query.pageNo" :page-size="query.pageSize" layout="total, prev, pager, next, jumper" :total="resource.totalElements">
    </el-pagination>
    <!-- 弹出框 -->
    <el-dialog v-model="visiable.dialog" :size="visiable.record?'large':'small'" :close-on-click-modal='false'>
      <template v-if="visiable.img">
        <span slot="title">图片</span>
        <img width="100%" v-for="item in dialogImages" :key="item" :src="$api.file.see(item)" alt="">
      </template>
      <template v-else-if="visiable.info">
        <span slot="title">详情</span>
        <table>
          <tr>
            <td style="text-align: right;">编号:</td>
            <td>{{info.id}}</td>
          </tr>
          <tr>
            <td style="text-align: right;">商品名称:</td>
            <td>{{info.itemName}}</td>
          </tr>
          <tr>
            <td style="text-align: right;">商品ID:</td>
            <td>{{info.itemMessage.id}}</td>
          </tr>
          <tr>
            <td style="text-align: right;">商品小图:</td>
            <td>
              <img width="100px" height="100px" :src="$api.file.see(info.picture)">
            </td>
          </tr>
          <tr>
            <td style="text-align: right;">成本价:</td>
            <td>{{info.cost}}</td>
          </tr>
          <tr>
            <td style="text-align: right;">成交价:</td>
            <td>{{info.market_price}}</td>
          </tr>
          <tr>
            <td style="text-align: right;">总投票:</td>
            <td>{{info.total}}</td>
          </tr>
          <!-- <tr>
            <td style="text-align: right;">预设控线:</td>
            <td>{{}}</td>
          </tr> -->
          <tr>
            <td style="text-align: right;">有效投票:</td>
            <td>{{info.income}}</td>
          </tr>
          <tr>
            <td style="text-align: right;">盈亏值:</td>
            <td>{{info.profit}}</td>
          </tr>
          <tr>
            <td style="text-align: right;">中奖人id:</td>
            <td>{{info.userMessage.id}}</td>
          </tr>
          <tr>
            <td style="text-align: right;">中奖人名称:</td>
            <td>{{info.name}}</td>
          </tr>
          <tr>
            <td style="text-align: right;">是否机器人:</td>
            <td>{{info.robot ? '是':'否'}}</td>
          </tr>
        </table>
      </template>
      <template v-else-if="visiable.record">
        <el-table :data="record.content">
          <el-table-column prop="userId" label="用户id">
          </el-table-column>
          <el-table-column prop="name" label="用户名称">
          </el-table-column>
          <el-table-column prop="address" label="地址">
          </el-table-column>
          <el-table-column prop="price" label="价格">
          </el-table-column>
          <el-table-column prop="time" label="时间">
            <template scope="scope">
              <span>{{$filter.date(scope.row.time)}}</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页栏 -->
        <el-pagination @current-change="recordPageChange" :current-page="recordQuery.pageNo" :page-size="recordQuery.pageSize" layout="total, prev, pager, next, jumper" :total="record.totalElements">
        </el-pagination>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'latestDeal',
  data () {
    return {
      query: {
        itemName: '',
        robot: '',
        name: '',
        join: '',
        pageNo: 1,
        pageSize: 10
      },
      resource: {
        content: [],
        totalElements: 0
      },
      visiable: {
        dialog: false,
        img: false,
        info: false,
        record: false
      },
      dialogImages: [],
      info: {
        itemMessage: {},
        userMessage: {}
      },
      recordQuery: {
        sealId: '',
        pageNo: 1,
        pageSize: 10
      },
      record: {
        content: [],
        totalElements: 0
      }
    }
  },
  created () {
    this.findLatestDeals()
  },
  methods: {
    findLatestDeals () {
      this.$api.findLatestDeals(this.query, data => {
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
      this.findLatestDeals()
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
    showImg (id) {
      this.dialogImages = []
      if (id instanceof Array) {
        this.dialogImages.push(...id)
      } else {
        this.dialogImages.push(id)
      }
      this.showDialog('img')
    },
    showInfo (index, row) {
      this.$api.getLatestDeal(row.id, data => {
        this.info = data.resource
      }, err => {
        this.$notify({
          type: 'error',
          message: err.message
        })
      })
      this.showDialog('info')
    },
    showRecord (index, row) {
      this.recordQuery.sealId = row.id
      this.recordQuery.pageNo = 1
      this.findBidders()
      this.showDialog('record')
    },
    findBidders () {
      this.$api.findBidders(this.recordQuery, data => {
        this.record = data.resource
      }, err => {
        this.$notify({
          type: 'error',
          message: err.message
        })
      })
    },recordPageChange (current) {
      this.recordQuery.pageNo = current
      this.findBidders()
    },exportWin(){
        var params = 'name='+this.query.name+'&itemName='+this.query.itemName+'&robot='+this.query.robot+'&join='+this.query.join;
        window.location.href=window.basePath+'/admin/exportSeals?'+params
    },search () {
        this.query.pageNo = 1
        this.findLatestDeals()
      }
  }
}
</script>

<style>

</style>
