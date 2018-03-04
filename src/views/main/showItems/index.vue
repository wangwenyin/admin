<template>
  <div>
    <h2>用户晒单列表</h2>
    <!-- 数据表格 -->
    <el-table
      :data="resource.content"
      border
      >
      <el-table-column 
        label="用户" 
        prop="userId">
        <template scope="scope">
          <div>{{scope.row.userId}}</div>
          <hr/>
          <div>{{scope.row.username}}</div>
        </template>
      </el-table-column>
      <el-table-column 
        label="商品" >
        <template scope="scope">
          <div>{{scope.row.itemId}}</div>
          <hr/>
          <div>{{scope.row.itemName}}</div>
        </template>
      </el-table-column>
      <el-table-column 
        label="晒单标题" 
        prop="title" >
      </el-table-column>
      <el-table-column 
        label="图片"
        prop="pictureList">
        <template scope="scope">
          <div style="display:inline-block;" v-for="img in scope.row.pictureList" :key="img">
            <el-button size="mini" style="overflow:hidden" @click="showBigImg(img)">
              <img style="width:80px;height:60px;" :src="$api.file.see(img)">
            </el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column 
        label="评论内容" 
        prop="context" >
      </el-table-column>
      <el-table-column 
        label="时间" 
        prop="time" >
        <template scope="scope">
          <span>{{$filter.date(scope.row.time)}}</span>
        </template>
      </el-table-column>
      <el-table-column 
        label="是否显示"
        width="100"
        prop="disable">
        <template scope="scope">
          <el-switch
            @change="updateEnable($event, scope.row)"
            v-model="scope.row.disable"
            on-text="显示"
            off-text="隐藏">
          </el-switch>
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
      <img width="100%" :src="$api.file.see(dialogImageUrl)" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'showItems',
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
      dialogImageUrl: '',
      imgDialogVisiable: false
    }
  },
  created () {
    this.findShowItems()
  },
  methods: {
    findShowItems () {
      this.$api.findShowItems(this.query, this.findSuccess, this.findFailure)
    },
    findSuccess (data) {
//      data.resource.content.forEach((item) => {
//        item.enable = !item.disable
//      })
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
      this.findShowItems()
    },
    updateEnable (value, row) {
      this.$api.updateShowItemState(row.id, data => {
        if (row.disable) {
          this.$message({ type: 'success', message: '显示成功' })
        } else {
          this.$message({ type: 'success', message: '隐藏成功' })
        }
      }, e => {
        if (row.disable) {
          this.$message({ type: 'error', message: `显示失败,${e.message}` })
        } else {
          this.$message({ type: 'error', message: `隐藏失败,${e.message}` })
        }
        this.$set(row, 'disable', !row.disable)
      })
    },
    showBigImg (pictureId) {
      this.dialogImageUrl = pictureId
      this.imgDialogVisiable = true
    }
  }
}
</script>

<style>
</style>
