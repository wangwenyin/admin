<template>
  <el-dialog v-model="show" size="small" :close-on-click-modal='false'>
    <span slot="title">地址</span>
    <el-table :data="resource" border>
      <el-table-column label="收货人姓名" prop="name">
      </el-table-column>
      <el-table-column label="收货人联系方式" prop="phone">
      </el-table-column>
      <el-table-column label="收货人地区" prop="address">
      </el-table-column>
      <el-table-column label="详细地址" prop="detailed_address">
      </el-table-column>
      <el-table-column label="QQ号" prop="penguin">
      </el-table-column>
      <el-table-column label="支付宝" prop="alipay">
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
  export default {
    name: 'address',
    props: {
      currentView: String,
      visiable: {
        type: Boolean,
        default: false
      },
      item: {
        type: Object,
        default: {}
      }
    },
    computed: {
      show: {
        get: function () {
          return this.visiable
        },
        set: function (val) {
          if (!val) {
            this.$emit('update:visiable', false)
            this.$emit('update:currentView', '')
          }
        }
      }
    },
    data () {
      return {
        userId: this.item.id,
        resource: []
      }
    },
    created () {
      this.findHistory()
    },
    methods: {
      findHistory () {
        this.$api.findUsersAddress(this.userId, data => {
          this.resource = data.resource
        }, err => {
          this.$notify({
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
