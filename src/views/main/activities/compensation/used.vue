<template>
  <div>
    <h2>不中包赔记录</h2>
    <div>
      <el-form :model="query" inline>
        <el-form-item>
          <el-input size="small" v-model="query.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item >
          <el-select size="small" v-model="query.state" clearable placeholder="状态">
            <el-option
              v-for="(value, key) in $const.INDEMNITY_STATE"
              :key="key"
              :label="value"
              :value="key">
            </el-option>
          </el-select>
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
        label="用户">
        <template scope="scope">
          <span>{{scope.row.userId}}</span>
          <hr/>
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="商品">
        <template scope="scope">
          <span>{{scope.row.itemBean.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="竞拍机会"
        prop="chance">
      </el-table-column>
      <el-table-column
        label="返送拍币"
        prop="give">
      </el-table-column>
      <el-table-column
        label="已使用的机会"
        prop="userChance">
        <template scope="scope">
          {{scope.row.userChance || 0}}
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        prop="state">
        <template scope="scope">
          {{$const.INDEMNITY_STATE[scope.row.state]}}
        </template>
      </el-table-column>
      <el-table-column
        label="参与时间">
        <template scope="scope">
          {{$filter.date(scope.row.createAt)}}
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
    name: 'used',
    data () {
      return {
        query: {
          username: '',
          state: '',
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
      this.findCompensation()
    },
    methods: {
      findCompensation () {
        this.$api.findCompensation(this.query, data => {
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
        this.findCompensation()
      },
      pageChange (current) {
        this.query.pageNo = current
        this.findCompensation()
      }
    }
  }
</script>

<style>
</style>
