<template>
  <div class="turntable">
    <h2>充值优惠卡配置</h2>
    <div>
      <span>有效天数：</span>
      <el-input-number v-model="effectiveDate" size="small" :min="0" :disabled="!isUpdateDate"></el-input-number>
      <div style="display: inline-block;">
        <template v-if="isUpdateDate">
          <el-button type="warning" size="small" :loading="updateDateing" @click="updateDate">保存</el-button>
          <el-button type="danger" size="small" @click="cancelUpdateDate">取消</el-button>
        </template>
        <template v-else>
          <el-button type="primary" size="small" @click="updateDate">修改</el-button>
        </template>
      </div>
    </div>
    <br/>
    <div>
      <span>新人注册充值优惠额度:</span>
      <div style="display: inline-block;">
         充值:<el-input-number style="width: 80px;" v-model="limitRegister.money" size="small" :min="1" :step="0.01" :disabled="!isUpdateRegister" :controls="false"></el-input-number>
         送:<el-input-number style="width: 80px;" v-model="limitRegister.give" size="small" :min="1" :step="0.01" :disabled="!isUpdateRegister" :controls="false"></el-input-number>
      </div>
      <div style="display: inline-block;">
        <template v-if="isUpdateRegister">
          <el-button type="warning" size="small" :loading="updateRegistering" @click="updateRegister">保存</el-button>
          <el-button type="danger" size="small" @click="cancelUpdateRegister">取消</el-button>
        </template>
        <template v-else>
          <el-button type="primary" size="small" @click="updateRegister">修改</el-button>
        </template>
      </div>
    </div>
    <br/>
    <div>
      <span>充值卡优惠额度:&nbsp;&nbsp;</span>
      <div style="display: inline-block;vertical-align: top;">
        <table>
          <tr v-for="(item, index) in list" :key="index">
            <td>
              充值:<el-input-number style="width: 80px;" v-model="item.money" size="small" :min="1" :step="0.01" :disabled="!isUpdate" :controls="false"></el-input-number>
            </td>
            <td>
              送:<el-input-number style="width: 80px;" v-model="item.give" size="small" :min="1" :step="0.01" :disabled="!isUpdate" :controls="false"></el-input-number>
            </td>
            <td>
              <el-button type="danger" size="small" v-if="isUpdate" @click="delItem(item, index)">删除</el-button>
            </td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td><el-button type="primary" size="small" v-if="isUpdate" @click="addItem">添加</el-button></td>
          </tr>
        </table>
        <div :style="{'margin-top': isUpdate ? '30px': '0'}">
          <template v-if="isUpdate">
            <el-button type="warning" size="small" :loading="setting" @click="setRechargeCardLimit">保存</el-button>
            <el-button type="danger" size="small" @click="cancelUpdate">取消</el-button>
          </template>
          <template v-else>
            <el-button type="primary" size="small" @click="setRechargeCardLimit">修改</el-button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'rechargeCard',
  data () {
    return {
      query: {
        pageNo: 1,
        pageSize: 10
      },
      effectiveDate: '',
      oldEffectiveDate: '',
      isUpdateDate: false,
      updateDateing: false,
      limitRegister: {
        money: 1,
        give: 1
      },
      oldLimitRegister: {
        money: 1,
        give: 1
      },
      isUpdateRegister: false,
      updateRegistering: false,
      list: [],
      oldList: [],
      isUpdate: false,
      setting: false
    }
  },
  created () {
    this.getRechargeCardDay()
    this.getRechargeCardRegisteLimit()
    this.getRechargeCardLimit()
  },
  methods: {
    getRechargeCardDay () {
      this.$api.getRechargeCardDay(null, data => {
        this.effectiveDate = data.resource
      }, err => {
        this.$notify({
          type: 'error',
          message: err.message
        })
      })
    },
    updateDate () {
      if (this.isUpdateDate) {
        if (this.updateDateing) {
          return
        }
        this.updateDateing = true
        this.$api.setRechargeCardDay(this.effectiveDate, data => {
          this.updateDateing = false
          this.isUpdateDate = false
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        }, err => {
          this.updateDateing = false
          this.$notify({
            type: 'error',
            message: err.message
          })
        })
      } else {
        this.oldEffectiveDate = this.effectiveDate
        this.isUpdateDate = true
      }
    },
    cancelUpdateDate () {
      this.effectiveDate = this.oldEffectiveDate
      this.isUpdateDate = false
    },
    getRechargeCardRegisteLimit () {
      this.$api.getRechargeCardRegisteLimit(null, data => {
        this.limitRegister = data.resource
        this.oldLimitRegister = Object.assign({}, data.resource)
      }, err => {
        this.$notify({
          type: 'error',
          message: err.message
        })
      })
    },
    updateRegister () {
      if (this.isUpdateRegister) {
        if (this.updateRegistering) {
          return
        }
        this.updateRegistering = true
        this.$api.setRechargeCardRegisteLimit(this.limitRegister, data => {
          this.updateRegistering = false
          this.isUpdateRegister = false
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        }, err => {
          this.updateRegistering = false
          this.$notify({
            type: 'error',
            message: err.message
          })
        })
      } else {
        this.oldLimitRegister = Object.assign({}, this.limitRegister)
        this.isUpdateRegister = true
      }
    },
    cancelUpdateRegister () {
      this.limitRegister = Object.assign({}, this.oldLimitRegister)
      this.isUpdateRegister = false
    },
    getRechargeCardLimit () {
      this.$api.getRechargeCardLimit(null, data => {
        this.list = data.resource
        this.oldList = [].concat(data.resource)
      }, err => {
        this.$notify({
          type: 'error',
          message: err.message
        })
      })
    },
    addItem () {
      this.list.push({money: 1, give: 1})
    },
    delItem (item, index) {
      this.list.splice(index, 1)
    },
    cancelUpdate () {
      this.list = [].concat(this.oldList)
      this.isUpdate = false
    },
    setRechargeCardLimit () {
      if (this.isUpdate) {
        if (this.setting) {
          return
        }
        this.setting = true
        let list = []
        this.list.forEach(item => {
          list.push(JSON.stringify(item))
        })
        this.$api.setRechargeCardLimit(list, data => {
          this.setting = false
          this.isUpdate = false
          this.$message({
            type: 'success',
            message: '保存成功'
          })
        }, err => {
          this.setting = false
          this.$message({
            type: 'error',
            message: '保存失败' + err.message
          })
        })
      } else {
        this.oldList = [].concat(this.list)
        this.isUpdate = true
      }
    }
  }
}
</script>

<style>

</style>
