<template>
   <el-tabs v-model="activeName" >
     <el-tab-pane label="配置管理" name="setConfig">
      <setConfig></setConfig>
    </el-tab-pane>
    <el-tab-pane label="使用记录" name="used">
      <used></used>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import used from './used.vue'
import setConfig from './setConfig.vue'
export default {
  name: 'compensation',
  components: {
    used,
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
