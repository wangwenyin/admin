<template>
  <div id="winner">
    <h2>中奖管理</h2>
    <div>
      <el-form :model="query" inline>
        <el-form-item>
          <el-input size="small" v-model="query.itemName" placeholder="奖品名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input size="small" v-model="query.name" placeholder="中奖人姓名"></el-input>
        </el-form-item>
        <el-form-item >
          <el-select size="small" v-model="query.orderState" clearable placeholder="奖品状态">
            <el-option
              v-for="(value, key) in $const.ORDER_STATE"
              :key="key"
              :label="value"
              :value="key">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item >
           <el-select size="small" v-model="query.itemType" clearable placeholder="奖品类型">
            <el-option
              v-for="(value, key) in $const.ITEM_TYPE"
              :key="key"
              :label="value"
              :value="key">
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
    <el-table
      :data="resource.content"
      border
      >
      <el-table-column
        label="序号"
        min-width="65">
        <template scope="scope">
          <span v-text="resource.number * resource.size + scope.$index + 1"></span>
        </template>
      </el-table-column>
      <el-table-column
        label="中奖人姓名"
        prop="name">
      </el-table-column>
      <el-table-column
        label="商品名称"
        prop="item_name">
      </el-table-column>
      <el-table-column
        label="商品小图"
        prop="item_picture"
        width="170">
        <template scope="scope">
           <el-button size="mini" style="overflow:hidden" @click="showImg(scope.row.item_picture)">
             <img style="width:130px;height:100px;" :src="$api.file.see(scope.row.item_picture)">
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="成交价格"
        prop="price">
      </el-table-column>
      <el-table-column
        label="奖品状态"
        prop="order_state">
        <template scope="scope">
           <span v-text="$const.ORDER_STATE[scope.row.order_state]"></span>
        </template>
      </el-table-column>
      <el-table-column
        label="奖品类型"
        prop="item_type">
        <template scope="scope">
           <span v-text="$const.ITEM_TYPE[scope.row.item_type]"></span>
        </template>
      </el-table-column>
      <el-table-column
        label="时间"
        prop="time">
        <template scope="scope">
          <span>{{$filter.date(scope.row.time)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="120">
        <template scope="scope">
          <el-button :plain="true" type="primary" size="mini" style="margin-left: 0;" @click="showAddr(scope.$index, scope.row)">收货地址</el-button>
          <el-button :plain="true" type="primary" size="mini" style="margin-left: 0;" @click="showVoucher(scope.$index, scope.row)">发货信息</el-button>
          <el-button :plain="true" type="primary" size="mini" style="margin-left: 0;" @click="showNotice(scope.$index, scope.row)">发送通知</el-button>
          <el-button :plain="true" type="primary" size="mini" style="margin-left: 0;" @click="showInfo(scope.$index, scope.row)">查看详情</el-button>
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
    <el-dialog v-model="visiable.dialog" size="tiny" :close-on-click-modal='false'>
      <template v-if="visiable.img">
        <span slot="title">图片</span>
        <img width="100%" v-for="item in dialogImages" :key="item" :src="$api.file.see(item)" alt="">
      </template>
      <template v-else-if="visiable.addr">
        <span slot="title">地址</span>
        <table>
          <tr>
            <td style="text-align: right;">收货人姓名:</td>
            <td>{{addr.name}}</td>
          </tr>
          <tr>
            <td style="text-align: right;">收货人手机号码:</td>
            <td>{{addr.phone}}</td>
          </tr>
          <tr>
            <td style="text-align: right;">收货人地址:</td>
            <td>{{addr.address}}</td>
          </tr>
          <tr>
            <td style="text-align: right;">收货人详细地址:</td>
            <td>{{addr.detailed_address}}</td>
          </tr>
        </table>
      </template>
      <template v-else-if="visiable.voucher">
        <span slot="title">发货凭证</span>
        <el-form ref="voucherForm" :model="voucher" :rules="voucherRules" label-width="70px">
          <el-form-item label="商品购买地址">
            <a :href="voucher.purchaseAddress" target="_blank" style="word-wrap: break-word;">{{voucher.purchaseAddress}}</a>
          </el-form-item>
          <el-form-item prop="remarks" label="发货备注">
            <el-input type="textarea" size="small" v-model="voucher.remarks"></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align: center;">
          <el-button size="small" :loading="committing" @click="addVoucher('voucherForm')">确定</el-button>
          <el-button size="small" @click="visiable.dialog = false">取消</el-button>
        </div>
      </template>
      <template v-else-if="visiable.notice">
        <span slot="title">发送通知</span>
        <el-form ref="noticeForm" :model="notice" :rules="noticeRules" label-width="70px">
          <el-form-item prop="title" label="标题">
            <el-input size="small" v-model="notice.title"></el-input>
          </el-form-item>
          <el-form-item prop="context" label="内容">
            <el-input type="textarea" size="small" v-model="notice.context"></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align: center;">
          <el-button size="small" :loading="committing" @click="addNotice('noticeForm')">确定</el-button>
          <el-button size="small" @click="visiable.dialog = false">取消</el-button>
        </div>
      </template>
      <template v-else-if="visiable.info">
        <span slot="title">详情</span>
        <table>
          <tr>
            <td style="text-align: right;">中奖人ID:</td>
            <td>{{info.userId}}</td>
          </tr>
          <tr>
            <td style="text-align: right;">中奖人姓名:</td>
            <td>{{info.name}}</td>
          </tr>
          <tr>
            <td style="text-align: right;">中奖商品ID:</td>
            <td>{{info.item_id}}</td>
          </tr>
          <tr>
            <td style="text-align: right;">中奖商品名称:</td>
            <td>{{info.item_name}}</td>
          </tr>
          <tr>
            <td style="text-align: right;">中奖编码:</td>
            <td>{{info.record_id}}</td>
          </tr>
          <tr>
            <td style="text-align: right;">商品类型:</td>
            <td>{{$const.ITEM_TYPE[info.item_type]}}</td>
          </tr>
          <tr>
            <td style="text-align: right;">商品小图:</td>
            <td>
              <img width="100px" height="100px" :src="$api.file.see(info.item_picture)">
            </td>
          </tr>
          <tr>
            <td style="text-align: right;">成交价格:</td>
            <td>{{info.price}}</td>
          </tr>
          <tr>
            <td style="text-align: right;">奖品状态:</td>
            <td>{{$const.ORDER_STATE[info.order_state]}}</td>
          </tr>
          <tr>
            <td style="text-align: right;">中奖时间:</td>
            <td>{{$filter.date(info.time)}}</td>
          </tr>
          <tr>
            <td style="text-align: right;">发货备注:</td>
            <td>{{resource.ship_notes}}</td>
          </tr>
          <template v-if="info.addressBean">
            <tr>
              <td style="text-align: right;">收货人:</td>
              <td>{{info.addressBean.name}}</td>
            </tr>
            <tr>
              <td style="text-align: right;">手机号码:</td>
              <td>{{info.addressBean.phone}}</td>
            </tr>
            <tr>
              <td style="text-align: right;">收货地址:</td>
              <td>{{info.addressBean.address + ' '}}{{info.addressBean.detailed_address}}</td>
            </tr>
            <tr>
              <td style="text-align: right;">支付宝账号:</td>
              <td>{{info.addressBean.alipay}}</td>
            </tr>
          </template>
          <template v-else>
              <tr>
                <td style="text-align: right;">收货信息:</td>
                <td>无</td>
              </tr>
          </template>
        </table>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'winner',
  data () {
    return {
      query: {
        itemName: '',
        orderState: '',
        itemType: '',
        robot: '',
        pageNo: 1,
        pageSize: 10,
        name: ''
      },
      resource: {
        content: [],
        totalElements: 0
      },
      committing: false,
      visiable: {
        dialog: false,
        img: false,
        addr: false,
        voucher: false,
        notice: false,
        info: false
      },
      dialogImages: [],
      addr: {
        name: '',
        phone: '',
        address: ''
      },
      voucher: {
        orderId: '',
        remarks: ''
      },
      voucherRules: {
        remarks: [
          {
            required: true,
            message: '请输入备注信息，如快递单号，卡号卡密',
            trigger: 'blur'
          }
        ]
      },
      notice: {
        userId: '',
        title: '',
        context: ''
      },
      noticeRules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        context: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      },
      info: {
        addressBean: {}
      }
    }
  },
  created () {
    this.findWinners()
  },
  methods: {
    findWinners () {
      this.$api.findWinners(this.query, data => {
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
      this.findWinners()
    },
      exportWin () {
        var params = 'itemName='+this.query.itemName+'&orderState='+this.query.orderState+'&robot='+this.query.robot+'&itemType='+this.query.itemType+'&name='+this.query.name;
        window.location.href=window.basePath+'/admin/exportOrders?'+params
      },
    pageChange (current) {
      this.query.pageNo = current
      this.findWinners()
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
    showAddr (index, row) {
      this.$api.getOrderAddress(row.id, data => {
        this.addr = data.resource
      }, err => {
        this.$notify({
          type: 'error',
          message: err.message
        })
      })
      this.showDialog('addr')
    },
    showVoucher (index, row) {
      this.voucher = {
        purchaseAddress: row.purchaseAddress,
        orderId: row.id,
        remarks: ''
      }
      this.showDialog('voucher')
    },
    showNotice (index, row) {
      this.showDialog('notice')
      this.$nextTick(() => {
        this.$refs['noticeForm'].resetFields()
        this.notice.userId = row.userId
      })
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
      this.$api.getOrderInfo(row.id, data => {
        this.info = data.resource
      }, err => {
        this.$notify({
          type: 'error',
          message: err.message
        })
      })
      this.showDialog('info')
    },
    addVoucher (formNmae) {
      this.$refs[formNmae].validate(valid => {
        if (valid && !this.committing) {
          this.committing = true
          this.$api.addOrderDeliveryInfo(this.voucher, data => {
            this.$set(this.visiable, 'dialog', false)
            this.committing = false
            this.$message({
              type: 'success',
              message: '提交发货凭证成功'
            })
          }, err => {
            this.committing = false
            this.$message({
              type: 'error',
              message: err.message
            })
          })
        }
      })
    },
    addNotice (formNmae) {
      this.$refs[formNmae].validate(valid => {
        if (valid && !this.committing) {
          this.committing = true
          this.$api.sendOrderNotice(this.notice, data => {
            this.$set(this.visiable, 'dialog', false)
            this.committing = false
            this.$message({
              type: 'success',
              message: '发送通知成功'
            })
          }, err => {
            this.committing = false
            this.$message({
              type: 'error',
              message: err.message
            })
          })
        }
      })
    }
  }
}
</script>

<style>

</style>
