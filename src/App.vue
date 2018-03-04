<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data () {
      return {
      }
    },
    watch: {},
    created () {
    },
    mounted () {
    },
    methods: {
    },
    destroyed () {
    }
  }
</script>

<style>
  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
  }
  #app {
    /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /*color: #2c3e50;*/
    min-width: 1200px;
    height: 100%;
  }

</style>
