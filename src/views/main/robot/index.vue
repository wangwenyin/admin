<template>
  <div id="robot">
    <div v-if="$route.name === 'robot'">
      <h2>机器人模块</h2>
      <div>
        <span>后台进程</span>
        <el-switch
          @change="updateEnable"
          v-model="value"
          on-text="开"
          off-text="关">
        </el-switch>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: false
    }
  },
  created () {
    this.$api.isBackgroundServiceRunning({}, data => {
      this.value = data.resource
    }, err => {
      this.$notify({
        type: 'error',
        message: err.message
      })
    })
  },
  methods: {
    updateEnable (value) {
      this.$api.startOrStopBackgroundService({}, data => {
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
    }
  }
}
</script>

<style>

</style>
