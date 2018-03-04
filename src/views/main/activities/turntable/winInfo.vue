<template>
  <div>
    <h2>大转盘中奖信息</h2>
    <div>
      <el-form :model="query" inline>
        <el-form-item>
          <el-input size="small" v-model="query.userId" placeholder="用户ID"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input size="small" v-model="query.itemName" placeholder="奖品名称"></el-input>
        </el-form-item>
        <el-form-item >
          <el-select size="small" v-model="query.type" clearable placeholder="奖品类型">
            <el-option
              v-for="(value, key) in $const.TURNTABLE_WIN_TYPE"
              :key="key"
              :label="value"
              :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item >
          <el-select size="small" v-model="query.state" clearable placeholder="状态">
             <el-option
              v-for="(value, key) in $const.TURNTABLE_WIN_STATE"
              :key="key"
              :label="value"
              :value="key">
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
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="用户手机号"
        prop="phone"
        max-width="125">
      </el-table-column>
      <el-table-column
        label="奖品"
        prop="itemName">
      </el-table-column>
      <el-table-column
        label="类型"
        prop="type"
        width="80">
        <template scope="scope">
          {{$const.TURNTABLE_WIN_TYPE[scope.row.type]}}
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        prop="state">
        <template scope="scope">
          {{$const.TURNTABLE_WIN_STATE[scope.row.state]}}
        </template>
      </el-table-column>
      <el-table-column
        label="需要地址"
        prop="needAddress"
        width="50">
        <template scope="scope">
          <span v-text="scope.row.needAddress?'是':'否'"></span>
        </template>
      </el-table-column>
      <el-table-column
        label="收货信息"
        max-width="200">
        <el-table-column
        label="联系人">
        <template scope="scope">
            <div style="font-size: 12px;" v-if="scope.row.address">
              <div>{{scope.row.address.name}}</div>
              <div><el-tag type="primary">{{scope.row.address.phone}}</el-tag></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
        label="地址信息">
          <template scope="scope">
            <div style="font-size: 12px;" v-if="scope.row.address">
              <div>{{scope.row.address.name}}</div>
              <div><el-tag type="primary">{{scope.row.address.detailed_address}}</el-tag></div>
            </div>
            </template>
        </el-table-column>
        <el-table-column
        label="其他">
        <template scope="scope">
            <table style="font-size: 12px;" v-if="scope.row.address">
              <tr>
                <td>QQ</td>
                <td>{{scope.row.address.penguin}}</td>
              </tr>
              <tr>
                <td>支付宝</td>
                <td>{{scope.row.address.alipay}}</td>
              </tr>
            </table>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="时间"
        prop="time">
        <template scope="scope">
          {{$filter.date(scope.row.time)}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="120">
        <template scope="scope">
          <el-button v-if="scope.row.state != 'CONSUMMATION' && scope.row.state != 'CANCAL' " :plain="true" type="danger" style="margin-left: 0;" size="mini" @click="showShip(scope.$index, scope.row)">发货</el-button>
          <!-- <el-popover
            v-if="scope.row.state != 'CONSUMMATION' || scope.row.state != 'CANCAL'"
            placement="top"
            width="160"
            v-model="shipPopover[scope.$index]">
            <p>确定发货?</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$set(shipPopover, scope.$index, false)">取消</el-button>
              <el-button type="primary" size="mini" :loading="shiping" @click="ship(scope.$index, scope.row)">确定</el-button>
            </div>
            <el-button slot="reference" :plain="true" type="danger" style="margin-left: 0;" size="mini">发货</el-button>
          </el-popover> -->
          <el-popover
            v-if="scope.row.state != 'CONSUMMATION' && scope.row.state != 'CANCAL'"
            placement="top"
            width="160"
            v-model="confirmPopover[scope.$index]">
            <p>确定完成?</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$set(confirmPopover, scope.$index, false)">取消</el-button>
              <el-button type="primary" size="mini" :loading="canceling" @click="confirm(scope.$index, scope.row)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" style="margin-left: 0;" size="mini">完成</el-button>
          </el-popover>
          <el-button v-if="scope.row.state != 'CONSUMMATION'" type="danger" style="margin-left: 0;" size="mini" @click="showCancel(scope.$index, scope.row)">{{scope.row.state == 'CANCAL' ? '已取消' : '取消'}}</el-button>
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
    <el-dialog v-model="shipVisiable" :size="'tiny'" :close-on-click-modal='false'>
      <template v-if="showShipMessage">
        <span slot="title">发货信息</span>
        <div>
          {{shipForm.shipMessage}}
        </div>
      </template>
      <template v-else>
        <span slot="title">发货</span>
          <el-form ref="shipForm" :model="shipForm" :rules="shipRules" label-width="70px">
            <el-form-item prop="reason" label="发货信息">
              <el-input type="textarea" size="small" :maxlength="100" v-model="shipForm.shipMessage"></el-input>
            </el-form-item>
          </el-form>
          <div style="text-align: center;">
            <el-button size="small" :loading="shiping" @click="ship('shipForm')">确定</el-button>
            <el-button size="small" @click="shipVisiable = false">取消</el-button>
          </div>
      </template>
    </el-dialog>
    <!-- 弹出框 -->
    <el-dialog v-model="visiable" :size="'tiny'" :close-on-click-modal='false'>
      <template v-if="showReason">
        <span slot="title">取消原因</span>
        <div>
          {{reason}}
        </div>
      </template>
      <template v-else>
        <span slot="title">确定取消中奖？</span>
          <el-form ref="cancelForm" :model="cancelForm" :rules="cancelRules" label-width="70px">
            <el-form-item prop="reason" label="原因">
              <el-input type="textarea" size="small" :maxlength="100" v-model="cancelForm.reason"></el-input>
            </el-form-item>
          </el-form>
          <div style="text-align: center;">
            <el-button size="small" :loading="canceling" @click="cancel('cancelForm')">确定</el-button>
            <el-button size="small" @click="visiable = false">取消</el-button>
          </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'winInfo',
    data () {
      return {
        query: {
          userId: '',
          itemName: '',
          type: '',
          state: '',
          pageNo: 1,
          pageSize: 10
        },
        resource: {
          content: [],
          totalElements: 0
        },
        shipForm: {
          winningId: '',
          shipMessage: ''
        },
        shipRules: {
          reason: [
            { required: true, message: '请输入发货信息', trigger: 'blur' }
          ]
        },
        shipVisiable: false,
        showShipMessage: false,
        shiping: false,
        shipPopover: [],
        confirming: false,
        confirmPopover: [],
        canceling: false,
        cancelPopover: [],
        visiable: false,
        showReason: false,
        reason: '',
        cancelForm: {
          winningId: '',
          reason: ''
        },
        cancelRules: {
          reason: [
            { required: true, message: '请输入原因', trigger: 'blur' }
          ]
        }
      }
    },
    created () {
      this.findTurntableWinInfo()
    },
    methods: {
      findTurntableWinInfo () {
        this.$api.findTurntableWinInfo(this.query, data => {
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
        this.findTurntableWinInfo()
      },
      pageChange (current) {
        this.query.pageNo = current
        this.findTurntableWinInfo()
      },
      showShip (index, row) {
        this.shipVisiable = true
        console.log(row)
        if (row.state !== 'WAITING_SHIP' && row.state !== 'WAITING_CHOICE_ADDRESS') {
          this.showShipMessage = true
          this.shipForm.winningId = row.id
          this.shipForm.shipMessage = row.shipMessage
        } else {
          this.showShipMessage = false
          this.$nextTick(() => {
            this.$refs.shipForm.resetFields()
            this.shipForm.winningId = row.id
          })
        }
      },
      ship (index, row) {
        this.shiping = true
        this.$api.shipTurntableWin(this.shipForm, data => {
          // this.$set(this.shipPopover, index, false)
          this.shiping = false
          this.findTurntableWinInfo()
          this.$set(this, 'shipVisiable', false)
          this.$message({
            type: 'success',
            message: '发货成功'
          })
        }, e => {
          // this.$set(this.shipPopover, index, false)
          this.shiping = false
          this.$message({
            type: 'error',
            message: `发货失败,${e.message}`
          })
        })
      },
      confirm (index, row) {
        this.confirming = true
        this.$api.finishTurntableWin(row.id, data => {
          this.$set(this.confirmPopover, index, false)
          this.confirming = false
          this.findTurntableWinInfo()
          this.$message({
            type: 'success',
            message: '完成'
          })
        }, e => {
          this.$set(this.confirmPopover, index, false)
          this.confirming = false
          this.$message({
            type: 'error',
            message: `失败,${e.message}`
          })
        })
      },
      showCancel (index, row) {
        this.visiable = true
        if (row.state === 'CANCAL') {
          this.showReason = true
          this.reason = row.cancelReason
        } else {
          this.showReason = false
          this.$nextTick(() => {
            this.$refs.cancelForm.resetFields()
            this.cancelForm.winningId = row.id
          })
        }
      },
      cancel () {
        this.$refs.cancelForm.validate(valid => {
          if (valid && !this.canceling) {
            this.canceling = true
            this.$api.cancelTurntableWin(this.cancelForm, data => {
              this.$set(this, 'visiable', false)
              this.canceling = false
              this.findTurntableWinInfo()
              this.$message({
                type: 'success',
                message: '取消成功'
              })
            }, e => {
              this.canceling = false
              this.$message({
                type: 'error',
                message: `取消失败,${e.message}`
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
