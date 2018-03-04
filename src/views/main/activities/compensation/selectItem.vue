<template>
  <div class="commodityList">
    <h2>商品列表</h2>
    <div>
      <el-form :model="query" inline>
        <el-form-item>
          <el-input size="small" v-model="query.name" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item >
          <el-input size="small" v-model="query.item_type" placeholder="商品类型"></el-input>
        </el-form-item>
        <el-form-item >
          <el-input size="small" v-model="query.plus_code" placeholder="每轮加码数"></el-input>
        </el-form-item>
        <el-form-item >
          <el-select size="small" v-model="query.disable" clearable placeholder="是否禁用">
            <el-option
              v-for="item in [{label: '禁用', value: true}, {label: '启用', value: false}]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item >
          <el-select size="small" v-model="query.running_program" clearable placeholder="机器人运行方案">
            <el-option
              v-for="(label, key) in RunningPrograms"
              :key="key"
              :label="label"
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
        label="ID"
        prop="id">
      </el-table-column>
      <el-table-column
        label="商品名称"
        prop="name">
      </el-table-column>
      <el-table-column
        label="商品类型"
        prop="item_type">
      </el-table-column>
      <el-table-column
        label="市场价"
        prop="price">
      </el-table-column>
      <el-table-column
        label="商品小图"
        prop="small_picture"
        width="170">
        <template scope="scope">
           <el-button size="mini" style="overflow:hidden">
             <img style="width:130px;height:100px;" :src="$api.file.see(scope.row.small_picture)">
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="成本价"
        prop="cost">
      </el-table-column>
      <el-table-column
        label="实物"
        prop="in_kind">
        <template scope="scope">
          <el-tag type="primary" v-if="scope.row.in_kind">是</el-tag>
          <el-tag v-else>否</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="票数控线"
        prop="control_line">
      </el-table-column>
       <el-table-column
        label="是否前端展示"
        prop="front_show"
        min-width="80">
        <template scope="scope">
          <el-tag type="primary" v-if="scope.row.front_show">展示</el-tag>
          <el-tag v-else></el-tag>
        </template>
      </el-table-column>
       <el-table-column
        label="新手商品"
        prop="novice"
        min-width="80">
        <template scope="scope">
          <el-tag type="primary" v-if="scope.row.novice">是</el-tag>
          <el-tag v-else>否</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        prop="disable"
        min-width="80">
        <template scope="scope">
          <el-tag v-if="scope.row.disable">禁用</el-tag>
          <el-tag type="primary" v-else>启用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="运行方案"
        prop="running_program">
        <template scope="scope">
          <span>{{RunningPrograms[scope.row.running_program]}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="120"
        fixed="right">
        <template scope="scope">
          <el-button type="primary" size="mini" style="margin-left: 0;" @click="select(scope.$index, scope.row)">选中</el-button>
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
  name: 'selcommodityList',
  data () {
    return {
      query: {
        name: '',
        item_type: '',
        disable: '',
        plus_code: '',
        running_program: '',
        pageNo: 1,
        pageSize: 10
      },
      resource: {
        content: [],
        totalElements: 0
      }
    }
  },
  computed: {
    RunningPrograms: function () {
      return this.$globalBus.RunningPrograms || []
    }
  },
  created () {
    this.findCommoditys()
    this.findRunningProgram()
  },
  methods: {
    findRunningProgram () {
      this.$api.getRuningProgram(data => {
        this.$globalBus.RunningPrograms = {}
        data.resource.forEach(item => {
          this.$globalBus.RunningPrograms[item.english] = item.chinese
        })
      }, err => {
        this.$message({
          type: 'error',
          message: err.message
        })
      })
    },
    findCommoditys () {
      this.$api.findCommoditys(this.query, data => {
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
      this.findCommoditys()
    },
    pageChange (current) {
      this.query.pageNo = current
      this.findCommoditys()
    },
    select (index, row) {
      this.$confirm('确定选择？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.$api.setCompensationItem(row.id, data => {
          this.$emit('selItem', row)
          this.$message({
            type: 'success',
            message: '设置成功'
          })
        }, err => {
          this.$message({
            type: 'error',
            message: `设置失败,${err.message}`
          })
        })
      }).catch(() => {
      })
    }
  }
}
</script>

<style>
</style>
