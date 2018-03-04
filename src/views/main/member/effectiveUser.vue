<template>
  <div>
    <h2>有效会员</h2>
    <div>
      <el-form :model="query" inline>
        <el-form-item>
          <el-input size="small" v-model="query.userId" placeholder="用户ID"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input size="small" v-model="query.name" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input size="small" v-model="query.source" placeholder="渠道ID"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input size="small" v-model="query.phone" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="mDate"
            size="small"
            align="right"
            type="date"
            placeholder="注册日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item >
          <el-select style="width: 80px;" size="small" v-model="query.disable" clearable placeholder="状态">
            <el-option
              v-for="item in [{label: '禁用', value: true}, {label: '启用', value: false}]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item >
          <el-button icon="search" type="primary" size="small" native-type="submit" @click.prevent="search">搜索</el-button>
        </el-form-item>
        <el-form-item >
          <el-button  type="primary" size="small" native-type="submit" @click.prevent="exEffectiveUser">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 数据表格 -->
    <el-table
      :data="resource.content"
      @sort-change="sortChange"
      border
    >
      <el-table-column
        label="用户信息"
        width="200">
        <template scope="scope">
        <div>
          <span style="color: #20a0ff">ID:</span> {{scope.row.id}}
        </div>
        <div>
          <span style="color: #20a0ff">账号:</span> {{scope.row.username}}
        </div>
        <div>
          <span style="color: #20a0ff">手机号码:</span> {{scope.row.iphone}}
        </div>
      </template>
      </el-table-column>
      <el-table-column
        label="状态"
        prop="disable"
        width="66">
        <template scope="scope">
          <el-dropdown trigger="click" menu-align="start" @command="updateEnable($event, scope.$index, scope.row)">
            <el-button size="mini" :type="scope.row.disable ? 'danger' : 'primary'">
              {{scope.row.disable ? '禁用' : '启用'}}
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="!scope.row.disable + ''">{{scope.row.disable ? '启用' : '禁用'}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column
        label="注册"
        prop="join_date"
        width="165">
        <template scope="scope">
          {{$filter.date(scope.row.join_date)}}
        </template>
      </el-table-column>
      <el-table-column
        label="注册IP"
        prop="ip">
      </el-table-column>
      <el-table-column
        label="余额"
        sortable="custom"
        min-width="60"
        prop="coin">
      </el-table-column>
      <el-table-column
        label="总充值"
        sortable="custom"
        min-width="60"
        prop="total_recharge">
      </el-table-column>
      <el-table-column
        label="赠币余额"
        prop="gift">
      </el-table-column>
      <el-table-column
        label="总赠币"
        prop="total_gift">
      </el-table-column>
      <el-table-column
        label="渠道"
        prop="source">
      </el-table-column>
      <el-table-column
        label="操作"
        width="170">
        <template scope="scope">
          <el-dropdown type="primary" trigger="click" @command="action($event, scope.$index, scope.row)">
            <el-button type="primary" size="small">
              编辑<i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="addr">收货地址</el-dropdown-item>
              <el-dropdown-item command="history">参与历史</el-dropdown-item>
              <el-dropdown-item command="flow">金币流动</el-dropdown-item>
              <el-dropdown-item command="statistics">金币统计</el-dropdown-item>
              <el-dropdown-item command="updateGift" divided>修改赠币</el-dropdown-item>
              <el-dropdown-item command="updateCoin">修改拍币</el-dropdown-item>
              <el-dropdown-item command="updateIntegral">修改积分</el-dropdown-item>
              <el-dropdown-item command="notice" divided>个人通知</el-dropdown-item>
              <el-dropdown-item command="password">修改密码</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
           <el-button type="primary" size="small" @click="deleteUser($event, scope.$index, scope.row)">
              删除<i class="el-icon--right"></i>
            </el-button>
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
    <component v-bind:is="componentView" :currentView.sync="componentView" :visiable.sync="dialogVisiable" :item="selectItem" @updateTableData="findEffectiveUser"></component>
  </div>
</template>

<script>
  import history from './components/history.vue'
  import addr from './components/address.vue'
  import flow from './components/flow.vue'
  import statistics from './components/statistics.vue'
  import updateGift from './components/updateGift.vue'
  import updateCoin from './components/updateCoin.vue'
  import updateIntegral from './components/updateIntegral.vue'
  import notice from './components/notice.vue'
  import password from './components/password.vue'
  export default {
    name: 'effectiveUser',
    components: {
      history,
      addr,
      flow,
      statistics,
      updateGift,
      updateCoin,
      updateIntegral,
      notice,
      password
    },
    data () {
      return {
        mDate: '',
        query: {
          userId: '',
          name: '',
          phone: '',
          disable: '',
          date: '',
          sort: '',
          pageNo: 1,
          pageSize: 10,
          source: ''
        },
        resource: {
          content: [],
          totalElements: 0
        },
        selectItem: {},
        componentView: '',
        dialogVisiable: false
      }
    },
    watch: {
      mDate: function (val, oldVal) {
        if (val) {
          this.query.date = val.getTime() + ''
        } else {
          this.query.date = ''
        }
      }
    },
    created () {
      this.findEffectiveUser()
    },
    methods: {
      findEffectiveUser () {
        this.$api.findEffectiveUser(this.query, data => {
          // data.resource.content.reverse()
          this.resource = data.resource
        }, err => {
          this.$notify({
            type: 'error',
            message: err.message
          })
        })
      },
      exEffectiveUser () {
        var params = 'userId='+this.query.userId+'&name='+this.query.name+'&source='+this.query.source+'&phone='+this.query.phone+'&disable='+this.query.disable+'&date='+this.query.date+'&sort='+this.query.sort
				window.location.href=window.basePath+'/admin/v02/exportUsers?'+params
      },
      search () {
        this.query.pageNo = 1
        this.findEffectiveUser()
      },
      pageChange (current) {
        this.query.pageNo = current
        this.findEffectiveUser()
      },
      sortChange ({column, prop, order}) {
        if (prop === 'coin') {
          this.query.sort = 'balance'
        } else if (prop === 'total_recharge') {
          this.query.sort = 'recharge'
        } else {
          this.query.sort = ''
        }
        if (order === 'ascending') {
          this.query.sort = this.query.sort + ' ASC'
        } else if (order === 'descending') {
          this.query.sort = this.query.sort + ' DESC'
        }
        this.query.pageNo = 1
        this.findEffectiveUser()
      },
      updateEnable (val, index, row) {
        this.$api.updateUserEnable(row.id, data => {
          this.findEffectiveUser()
          if (row.disable) {
            this.$message({ type: 'success', message: '启用成功' })
          } else {
            this.$message({ type: 'success', message: '禁用成功' })
          }
        }, e => {
          if (row.disable) {
            this.$message({ type: 'error', message: `启用失败,${e.message}` })
          } else {
            this.$message({ type: 'error', message: `禁用失败,${e.message}` })
          }
          this.$set(row, 'disable', !row.disable)
        })
      },
      action (val, index, row) {
        this.selectItem = row
        this.componentView = val
        this.dialogVisiable = true
      },
      deleteUser (val, index, row) {
        this.$api.deleteUserInfo(row.id, data => {
          this.findEffectiveUser()
        }, e => {
          
        })
      }
    }
  }
</script>

<style>

</style>
