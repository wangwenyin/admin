<template>
  <div id="commodityList">
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
    <!-- 添加按钮 -->
    <el-button type="primary" icon="plus" @click="$router.push({name: 'commodityEdit'})"></el-button>
    <!-- 数据表格 -->
    <el-table
      :data="resource.content"
      border
      >
      <el-table-column
        label="编号"
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
      <!-- <el-table-column
        label="商品标签"
        prop="labels">
        <template scope="scope">
          <div style="display:inline-block;" v-for="img in scope.row.labels" :key="img">
             <img style="width: 40px;height: 40px;" :src="$api.file.see(img)">
          </div>
        </template>
      </el-table-column> -->
      <el-table-column
        label="商品小图"
        prop="small_picture"
        width="170">
        <template scope="scope">
           <el-button size="mini" style="overflow:hidden" @click="showBigImg(scope.row.small_picture)">
             <img style="width:130px;height:100px;" :src="$api.file.see(scope.row.small_picture)">
          </el-button>
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
        label="票数控线"
        prop="control_line">
      </el-table-column>
       <el-table-column
        label="是否前端展示"
        prop="front_show"
        min-width="80">
        <template scope="scope">
          <el-switch
            v-model="scope.row.front_show"
            on-text=""
            off-text=""
            @change="updateShowEnable($event, scope.row)">
          </el-switch>
        </template>
      </el-table-column>
       <el-table-column
        label="是否新手商品"
        prop="novice"
        min-width="80">
        <template scope="scope">
          <el-switch
            v-model="scope.row.novice"
            on-text=""
            off-text=""
            @change="updateNoviceEnable($event, scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="禁用"
        prop="disable"
        min-width="80">
        <template scope="scope">
          <el-switch
            v-model="scope.row.disable"
            on-text=""
            off-text=""
            @change="updateEnable($event, scope.row)">
          </el-switch>
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
        width="120">
        <template scope="scope">
          <!-- <el-button :plain="true" type="primary" size="mini">设置单词加码数</el-button> -->
          <el-button :plain="true" type="primary" size="mini" style="margin-left: 0;" @click="showBigImg(scope.row.bigPictures)">查看商品图片</el-button>
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
          <el-popover
            placement="top"
            width="160"
            v-model="showSuperDeletePopover[scope.$index]">
            <p>此操作将永久删除该数据, 是否继续?</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$set(showSuperDeletePopover, scope.$index, false)">取消</el-button>
              <el-button type="primary" size="mini" :loading="superDelLoading" @click="superDelItem(scope.$index, scope.row)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" style="margin-left: 0;" size="mini">强制删除</el-button>
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
    <!-- 查看大图 -->
    <el-dialog v-model="imgDialogVisiable" size="tiny">
      <img width="100%" v-for="item in dialogImages" :key="item" :src="$api.file.see(item)" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'commodityList',
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
      },
      delLoading: false,
      showDeletePopover: [],
      imgDialogVisiable: false,
      dialogImages: [],
      superDelLoading: false,
      showSuperDeletePopover: []
    }
  },
  computed: {
    RunningPrograms: function () {
      return this.$globalBus.RunningPrograms || []
    }
  },
  created () {
    this.findCommoditys()
  },
  methods: {
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
    editItem (index, row) {
      this.$router.push({name: 'commodityEdit', query: {id: row.id}})
    },
    delItem (index, row) {
      this.delLoading = true
      this.$api.deleteCommodity(row.id, data => {
        this.$set(this.showDeletePopover, index, false)
        this.delLoading = false
        this.findCommoditys()
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
    superDelItem (index, row) {
      this.superDelLoading = true
      this.$api.superDeleteCommodity(row.id, data => {
        this.$set(this.showSuperDeletePopover, index, false)
        this.superDelLoading = false
        this.findCommoditys()
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }, e => {
        this.$set(this.showSuperDeletePopover, index, false)
        this.superDelLoading = false
        this.$message({
          type: 'error',
          message: `删除失败,${e.message}`
        })
      })
    },
    updateEnable (value, row) {
      this.$api.updateCommodityEnable(row.id, data => {
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
    updateNoviceEnable (value, row) {
      this.$api.updateNoviceEnable(row.id, data => {
        if (row.novice) {
          this.$message({ type: 'success', message: '启用成功' })
        } else {
          this.$message({ type: 'success', message: '禁用成功' })
        }
      }, e => {
        if (row.novice) {
          this.$message({ type: 'error', message: `启用失败,${e.message}` })
        } else {
          this.$message({ type: 'error', message: `禁用失败,${e.message}` })
        }
        this.$set(row, 'novice', !row.novice)
      })
    },
    updateShowEnable (value, row) {
      this.$api.updateCommodityShowEnable(row.id, data => {
        if (row.front_show) {
          this.$message({ type: 'success', message: '启用成功' })
        } else {
          this.$message({ type: 'success', message: '禁用成功' })
        }
      }, e => {
        if (row.front_show) {
          this.$message({ type: 'error', message: `启用失败,${e.message}` })
        } else {
          this.$message({ type: 'error', message: `禁用失败,${e.message}` })
        }
        this.$set(row, 'front_show', !row.front_show)
      })
    },
    showBigImg (id) {
      this.dialogImages = []
      if (id instanceof Array) {
        this.dialogImages.push(...id)
      } else {
        this.dialogImages.push(id)
      }
      this.imgDialogVisiable = true
    }
  }
}
</script>

<style>
</style>
