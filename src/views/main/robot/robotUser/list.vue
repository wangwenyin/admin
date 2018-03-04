<template>
  <div id="robotUserList">
    <h2>机器人用户列表</h2>
    <!-- 添加按钮 -->
    <el-button type="primary" icon="plus" @click="editItem()"></el-button>
    <!-- 数据表格 -->
    <el-table
      :data="resource.content"
      border
      >
      <el-table-column
        label="会员名称"
        prop="username"
        min-width="66">
      </el-table-column>
<!--      <el-table-column
        label="手机号码"
        prop="iphone"
        min-width="100">
      </el-table-column>-->
      <el-table-column
        label="拍币"
        prop="coin">
      </el-table-column>
      <el-table-column
        label="赠币"
        prop="gift">
      </el-table-column>
      <el-table-column
        label="积分"
        prop="integral">
      </el-table-column>
      <el-table-column
        label="最后登录时间"
        prop="final_login">
        <template scope="scope">
          <span>{{$filter.date(scope.row.final_login)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="注册时间"
        prop="join_date">
        <template scope="scope">
          <span>{{$filter.date(scope.row.join_date)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="禁用"
        width="100"
        prop="disable">
        <template scope="scope">
          <el-switch
            @change="updateEnable($event, scope.row)"
            v-model="scope.row.disable"
            on-text="是"
            off-text="否">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="定位地址"
        prop="address">
      </el-table-column>
      <el-table-column
        label="操作"
        width="190">
        <template scope="scope">
          <el-button :plain="true" type="primary" size="mini" @click="editItem(scope.$index, scope.row)">编辑</el-button>
          <el-button :plain="true" type="primary" size="mini" @click="$router.push({name: 'robotShowPrize', query: {id: scope.row.id}})">晒单</el-button>
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
  name: 'robotUserList',
  data () {
    return {
      query: {
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
    this.findRobotUsers()
  },
  methods: {
    findRobotUsers () {
      this.$api.findRobotUsers(this.query, this.findSuccess, this.findFailure)
    },
    findSuccess (data) {
      this.resource = data.resource
    },
    findFailure (e) {
      this.$notify({
        type: 'error',
        message: e.message
      })
    },
    pageChange (current) {
      this.query.pageNo = current
      this.findRobotUsers()
    },
    updateEnable (value, row) {
      this.$api.updateRobotUser(row, data => {
        if (row.disable) {
          this.$message({ type: 'success', message: '禁用成功' })
        } else {
          this.$message({ type: 'success', message: '启用成功' })
        }
      }, e => {
        if (row.disable) {
          this.$message({ type: 'error', message: `禁用失败,${e.message}` })
        } else {
          this.$message({ type: 'error', message: `启用失败,${e.message}` })
        }
        this.$set(row, 'disable', !row.disable)
      })
    },
    editItem (index, row) {
      if (row) {
        this.$router.push({name: 'robotUserEdit', query: {id: row.id}})
      } else {
        this.$router.push({name: 'robotUserEdit'})
      }
    }
  }
}
</script>

<style>
</style>
