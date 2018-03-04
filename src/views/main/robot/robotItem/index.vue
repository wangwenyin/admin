<template>
  <div id="robotItem">
    <h2>机器人商品设置列表</h2>
    <div>
      <el-form :model="query" inline>
        <el-form-item>
          <el-input size="small" v-model="query.name" placeholder="商品名称"></el-input>
        </el-form-item>
         <el-form-item >
          <el-button icon="search" type="primary" size="small" native-type="submit" @click.prevent="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 数据表格 -->
    <el-table
      :data="resource.content"
      border
      >
      <el-table-column
        label="商品名称"
        prop="name">
      </el-table-column>
      <el-table-column
        label="控线"
        prop="control_line">
      </el-table-column>
      <el-table-column
        label="控线区间"
        prop="controlLineMin">
        <template scope="scope">
          <el-input-number :disabled="updateAble[scope.row.id].disable" :controls="false" size="small" :min="0" style="width:30%;" v-model="scope.row.controlLineMin" placeholder="最小值"></el-input-number>
          <span>-</span>
          <el-input-number :disabled="updateAble[scope.row.id].disable" :controls="false" size="small" :min="0" style="width:30%;" v-model="scope.row.controlLineMax" placeholder="最大值"></el-input-number>
          <template v-if="updateAble[scope.row.id].disable">
            <el-button type="primary" size="small" @click="updateRobotItem(scope.$index, scope.row)">修改</el-button>
          </template>
          <template v-else>
            <el-button type="warning" size="small" :loading="updateAble[scope.row.id].updating" @click="updateRobotItem(scope.$index, scope.row)">保存</el-button>
          </template>
        </template>
      </el-table-column>
      <el-table-column
        label="运行方案"
        prop="running_program">
        <template scope="scope">
          <span>{{RunningPrograms[scope.row.running_program]}}</span>
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
  name: 'robotItem',
  data () {
    return {
      query: {
        name: '',
        pageNo: 1,
        pageSize: 10
      },
      resource: {
        content: [],
        totalElements: 0
      },
      RunningPrograms: {},
      updateAble: {}
    }
  },
  created () {
    this.findRunningProgram()
    this.findRobotItems()
  },
  methods: {
    findRunningProgram () {
      this.$api.getRuningProgram(data => {
        data.resource.forEach(item => {
          this.RunningPrograms[item.english] = item.chinese
        })
      }, err => {
        this.$message({
          type: 'error',
          message: err.message
        })
      })
    },
    findRobotItems () {
      this.$api.findRobotItems(this.query, data => {
        this.updateAble = {}
        data.resource.content.forEach(item => {
          this.updateAble[item.id] = {
            disable: true,
            updating: false
          }
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
      this.findRobotItems()
    },
    pageChange (current) {
      this.query.pageNo = current
      this.findRobotItems()
    },
    updateRobotItem (index, row) {
      let temp = this.updateAble[row.id]
      if (temp.disable) {
        temp.oldRow = Object.assign({}, row)
        temp.disable = false
        delete this.updateAble[temp.id]
        this.$set(this.updateAble, temp.id, temp)
      } else if (!temp.updating) {
        this.$api.updateRobotItem(row, data => {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          temp.disable = true
          delete this.updateAble[temp.id]
          this.$set(this.updateAble, temp.id, temp)
        }, err => {
          this.$message({
            type: 'error',
            message: err.message
          })
          if (temp.oldRow) {
            this.$set(row, 'controlLineMin', temp.oldRow.controlLineMin)
            this.$set(row, 'controlLineMax', temp.oldRow.controlLineMax)
          }
        })
      }
    }
  }
}
</script>

<style>

</style>
