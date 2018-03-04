<template>
  <el-dialog v-model="show" size="small" :close-on-click-modal='false'>
    <span slot="title">参与竞拍历史记录</span>
    <el-table :data="resource.content" border>
      <el-table-column label="商品ID" prop="itemId">
      </el-table-column>
      <el-table-column label="商品名称" prop="itemName">
      </el-table-column>
      <el-table-column label="结算ID" prop="id">
      </el-table-column>
      <el-table-column label="状态" prop="sealed">
        <template scope="scope">
          <span>{{scope.row.sealed ? '结算' : '进行中'}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @current-change="pageChange" :current-page="query.pageNo" :page-size="query.pageSize"
      layout="total, prev, pager, next, jumper" :total="resource.totalElements">
    </el-pagination>
  </el-dialog>
</template>

<script>
  export default {
    name: 'history',
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
        query: {
          userId: '',
          pageNo: 1,
          pageSize: 10
        },
        resource: {
          content: [],
          totalElements: 0
        }
      }
    },
    created () {
      this.query.userId = this.item.id
      this.findHistory()
    },
    methods: {
      findHistory () {
        this.$api.findUserSealedHistory(this.query, data => {
          this.resource = data.resource
        }, err => {
          this.$notify({
            type: 'error',
            message: err.message
          })
        })
      },
      pageChange (current) {
        this.query.pageNo = current
        this.findHistory()
      }
    }
  }

</script>

<style>


</style>
