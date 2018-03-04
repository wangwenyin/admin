<template>
   <el-tabs v-model="activeName" >
     <el-tab-pane label="配置管理" name="setConfig">
      <setConfig></setConfig>
     </el-tab-pane>
     <el-tab-pane label="中奖记录" name="winInfo">
      <winInfo></winInfo>
     </el-tab-pane>
  </el-tabs>
</template>

<script>
import winInfo from './winInfo.vue'
import setConfig from './setConfig.vue'
export default {
  name: 'turntable',
  components: {
    winInfo,
    setConfig
  },
  data () {
    return {
      activeName: 'setConfig'
    }
  },
  created () {
  },
  methods: {
  }
}
</script>

<style>

</style>
