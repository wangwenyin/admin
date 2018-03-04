<template>
  <div id="system">
    <h2>系统设置</h2>
    <div>
      <span>显示支付按钮</span>
      <el-switch @change="updateEnable" v-model="value" on-text="开" off-text="关">
      </el-switch>
    </div>
    <div>
      <span>是否进入系统维护状态</span>
      <el-switch @change="updateSystemState" v-model="systemState" on-text="开" off-text="关">
      </el-switch>
    </div>
  </div>
</template>

<script>
export default {
  name: 'system',
  data () {
    return {
      value: false,
      systemState: false
    }
  },
  created () {
    this.getShowPay()
    this.getSystemState()
  },
  methods: {
    getShowPay () {
      this.$api.getShowPay(null, data => {
        this.value = data.resource
      }, err => {
        this.$notify({
          type: 'error',
          message: err.message
        })
      })
    },
    updateEnable () {
      this.$api.setShowPay(null, data => {
        this.$message({
          type: 'success',
          message: '修改成功'
        })
      }, err => {
        this.$notify({
          type: 'error',
          message: err.message
        })
        this.value = !this.value
      })
    },
    getSystemState () {
      this.$api.getSystemState(null, data => {
        this.systemState = data.resource
      }, err => {
        this.$notify({
          type: 'error',
          message: err.message
        })
      })
    },
    updateSystemState () {
      this.$api.setSystemState(null, data => {
        this.$message({
          type: 'success',
          message: '修改成功'
        })
      }, err => {
        this.$notify({
          type: 'error',
          message: err.message
        })
        this.systemState = !this.systemState
      })
    }
  }
}
</script>

<style>
  
</style>
