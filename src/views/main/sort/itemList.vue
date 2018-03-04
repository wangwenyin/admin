<template>
  <div id="itemList">
    <div>
      <el-form :model="query" inline>
        <el-form-item>
          <el-input size="small" v-model="query.name" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item >
          <el-input size="small" v-model="query.item_type" placeholder="商品类型"></el-input>
        </el-form-item>
        <el-form-item >
          <el-input size="small" v-model="query.plus_code" placeholder="加价码"></el-input>
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
              v-for="(value, key) in RunningPrograms"
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
      ref="table"
      :data="resource.content"
      border
      @select="select"
      @select-all="selectAll"
      >
      <el-table-column
        type="selection"
        width="55"
        fixed="left"
        :selectable="getSelectable">
      </el-table-column>
      <el-table-column
        label="序号"
        min-width="65">
        <template scope="scope">
          <span v-text="resource.number * resource.size + scope.$index + 1"></span>
        </template>
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
        label="商品标签"
        prop="labels">
        <template scope="scope">
          <div style="display:inline-block;" v-for="img in scope.row.labels" :key="img">
             <img style="width: 40px;height: 40px;" :src="$api.file.see(img)">
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="商品小图"
        prop="small_picture"
        width="170">
        <template scope="scope">
           <div size="mini" style="overflow:hidden">
             <img style="width:130px;height:100px;" :src="$api.file.see(scope.row.small_picture)">
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="成本价"
        prop="cost">
      </el-table-column>
      <el-table-column
        label="是否实物"
        prop="in_kind">
        <template scope="scope">
          <span v-text="scope.row.in_kind?'是':'否'"></span>
        </template>
      </el-table-column>
      <el-table-column
        label="加价码"
        prop="plus_code">
      </el-table-column>
      <el-table-column
        label="票数控线"
        prop="control_line">
      </el-table-column>
      <el-table-column
        label="禁用"
        prop="disable"
        min-width="80">
        <template scope="scope">
          <span>{{scope.row.disable ? '是':'否'}}</span>
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
    <div style="text-align: right;">
      <el-button @click="$emit('update:visible', false)">取 消</el-button>
      <el-button type="primary" :loading="committing" @click="submit">确 定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'itemList',
  props: {
    ownList: {
      type: Array,
      default: function () {
        return []
      }
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      query: {
        name: '',
        item_type: '',
        plus_code: '',
        disable: '',
        running_program: '',
        pageNo: 1,
        pageSize: 10
      },
      resource: {
        content: [],
        totalElements: 0
      },
      imgDialogVisiable: false,
      dialogImages: [],
      selecteds: {},
      committing: false
    }
  },
  computed: {
    RunningPrograms: function () {
      return this.$globalBus.RunningPrograms || []
    },
    own: function () {
      let obj = {}
      this.ownList.forEach((item, index) => {
        obj[item.id] = item
      })
      return obj
    }
  },
  created () {
    this.findCommoditys()
  },
  methods: {
    findCommoditys () {
      this.$api.findCommoditys(this.query, data => {
        this.resource = data.resource
        this.$nextTick(() => {
          this.resource.content.forEach((item, index) => {
            if (this.own.hasOwnProperty(item.id)) {
              this.$refs['table'].toggleRowSelection(item, true)
              item.isOwn = true
            }
            if (this.selecteds.hasOwnProperty(item.id)) {
              this.$refs['table'].toggleRowSelection(item, true)
            }
          })
        })
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
    getSelectable (row, index) {
      if (row.isOwn) {
        return false
      } else {
        return true
      }
    },
    select (selection, row) {
      let isSelected = selection.indexOf(row) > -1
      if (!this.selecteds.hasOwnProperty(row.id) && isSelected) {
        this.selecteds[row.id] = row
      } else if (this.selecteds.hasOwnProperty(row.id) && !isSelected) {
        delete this.selecteds[row.id]
      }
    },
    selectAll (selection) {
      if (selection.length > 0) {
        selection.forEach(item => {
          if (!this.selecteds.hasOwnProperty(item.id)) {
            this.selecteds[item.id] = item
          }
        })
      } else {
        this.resource.content.forEach(item => {
          if (this.selecteds.hasOwnProperty(item.id)) {
            delete this.selecteds[item.id]
          }
        })
      }
    },
    submit () {
      if (this.committing) {
        return
      }
      let list = []
      for (let key in this.selecteds) {
        let temp = Object.assign({}, this.selecteds[key])
        if (!temp.isOwn) {
          list.push(temp)
        }
      }
      this.committing = true
      this.$emit('backSelection', list)
      this.$emit('update:visible', false)
      this.committing = false
    }
  }
}
</script>

<style>
</style>
