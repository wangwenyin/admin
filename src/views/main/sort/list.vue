<template>
  <div id="sortList">
    <h2>分类列表</h2>
    <!-- 添加按钮 -->
    <el-button type="primary" icon="plus" @click="$router.push({name: 'sortEdit'})"></el-button>
    <!-- 数据表格 -->
    <el-table
      :data="resource.content"
      border
      >
      <el-table-column
        label="序号"
        min-width="65">
        <template scope="scope">
          <span v-text="resource.number * resource.size + scope.$index + 1"></span>
        </template>
      </el-table-column>
      <el-table-column
        label="名称"
        prop="name">
      </el-table-column>
      <el-table-column
        label="排序"
        prop="sort">
      </el-table-column>
      <el-table-column
        label="是否显示"
        prop="disable"
        min-width="80">
        <template scope="scope">
          <el-switch
            v-model="scope.row.enable"
            on-text="是"
            off-text="否"
            @change="updateEnable($event, scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="120">
        <template scope="scope">
          <el-button :plain="true" type="primary" size="mini" style="margin-left: 0;" @click="editItem(scope.$index, scope.row)">编辑</el-button>
          <el-popover
            placement="top"
            width="160"
            v-model="showDeletePopover[scope.$index]">
            <p>此操作将永久删除该数据, 是否继续?</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$set(showDeletePopover, scope.$index, false)">取消</el-button>
              <el-button type="primary" size="mini" :loading="delLoading" @click="delItem(scope.$index, scope.row)">确定</el-button>
            </div>
            <el-button slot="reference" :plain="true" type="danger" style="margin-left: 0;" size="mini">删除</el-button>
          </el-popover>
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
  </div>
</template>

<script>
export default {
  name: 'sortList',
  data () {
    return {
      query: {
        pageNo: 1,
        pageSize: 10
      },
      resource: {
        content: [],
        totalElements: 0
      },
      delLoading: false,
      showDeletePopover: []
    }
  },
  computed: {
  },
  created () {
    this.findSorts()
  },
  methods: {
    findSorts () {
      this.$api.findSorts(this.query, data => {
        data.resource.content.map(item => {
          item.enable = !item.disable
        })
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
      this.findSorts()
    },
    pageChange (current) {
      this.query.pageNo = current
      this.findSorts()
    },
    editItem (index, row) {
      this.$router.push({name: 'sortEdit', query: {id: row.id}})
    },
    delItem (index, row) {
      this.delLoading = true
      this.$api.deleteSort(row.id, data => {
        this.$set(this.showDeletePopover, index, false)
        this.delLoading = false
        this.findSorts()
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }, e => {
        this.$set(this.showDeletePopover, index, false)
        this.delLoading = false
        this.$message({
          type: 'error',
          message: `删除失败,${e.message}`
        })
      })
    },
    updateEnable (value, row) {
      this.$api.updateSortEnable(row.id, data => {
        if (row.enable) {
          this.$message({ type: 'success', message: '启用成功' })
        } else {
          this.$message({ type: 'success', message: '禁用成功' })
        }
      }, e => {
        if (row.enable) {
          this.$message({ type: 'error', message: `启用失败,${e.message}` })
        } else {
          this.$message({ type: 'error', message: `禁用失败,${e.message}` })
        }
        this.$set(row, 'enable', !row.enable)
      })
    }
  }
}
</script>

<style>
</style>
