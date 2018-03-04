<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'commodity',
  data () {
    return {}
  },
  created () {
    this.findRunningProgram()
  },
  methods: {
    findRunningProgram () {
      this.$api.getRuningProgram(data => {
        this.$globalBus.RunningPrograms = {}
        data.resource.forEach(item => {
          this.$globalBus.RunningPrograms[item.english] = item.chinese
        })
      }, err => {
        this.$message({
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
