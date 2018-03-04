<template>
  <div>
    <h2>晒单记录</h2>
    <el-form :model="query" inline>
      <el-form-item>
        <el-input size="small" v-model="query.userId" placeholder="会员ID"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input size="small" v-model="query.itemName" placeholder="商品名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input size="small" v-model="query.key" placeholder="关键词"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select style="width: 80px;" size="small" v-model="query.disable" clearable placeholder="状态">
          <el-option v-for="item in [{label: '禁用', value: false}, {label: '启用', value: true}]" :key="item.value" :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item >
        <el-button icon="search" type="primary" size="small" native-type="submit" @click.prevent="pageChange(1)">搜索</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据表格 -->
    <el-table
      :data="resource.content"
      border
      >
      <el-table-column
        label="id"
        prop="id">
        <template scope="scope">
          <div>{{scope.row.id}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="商品名称" >
        <template scope="scope">
          <div>{{scope.row.itemName}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="用户ID"
        prop="userId">
      </el-table-column>
      <el-table-column
        label="内容"
        width="310">
        <template scope="scope">
          <div>
            <div>{{scope.row.title}}</div>
            <div>{{scope.row.context}}</div>
            <div>
              <div style="display:inline-block;" v-for="img in scope.row.pictureList" :key="img">
                <el-button size="mini" style="overflow:hidden" @click="showBigImg(img)">
                  <img style="width:80px;height:60px;" :src="$api.file.see(img)">
                </el-button>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="时间"
        prop="time">
        <template scope="scope">
          <span>{{$filter.date(scope.row.time)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="75"
        prop="disable">
        <template scope="scope">
          <el-tag type="success" v-if="scope.row.disable">显示</el-tag>
          <el-tag type="danger" v-else>隐藏</el-tag>
          <!-- <el-switch
            @change="updateEnable($event, scope.row)"
            v-model="scope.row.disable"
            on-text="显示"
            off-text="隐藏">
          </el-switch> -->
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="100">
        <template scope="scope">
          <el-dropdown type="primary" trigger="click" @command="action($event, scope.$index, scope.row)">
            <el-button type="primary" size="small">
              审批<i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="adopt">通过</el-dropdown-item>
              <el-dropdown-item command="refuse" divided>拒绝</el-dropdown-item>
              <el-dropdown-item command="delete">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
  name: 'approvalShowOrder',
  data () {
    return {
      query: {
        userId: '',
        itemName: '',
        key: '',
        disable: '',
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
          this.$message({ type: 'success', message: '隐藏成功' })
        } else {
          this.$message({ type: 'success', message: '显示成功' })
        }
      }, e => {
        if (row.disable) {
          this.$message({ type: 'error', message: `隐藏失败,${e.message}` })
        } else {
          this.$message({ type: 'error', message: `显示失败,${e.message}` })
        }
        this.$set(row, 'disable', !row.disable)
      })
    },
    showBigImg (pictureId) {
      this.dialogImageUrl = pictureId
      this.imgDialogVisiable = true
    },
    action (val, index, row) {
      if (val === 'adopt') {
        if (row.disable) {
          this.$message({ type: 'warning', message: '该记录已显示' })
        } else {
          this.updateEnable(false, row)
        }
      } else if (val === 'refuse') {
        if (row.disable) {
          this.updateEnable(false, row)
        } else {
          this.$message({ type: 'warning', message: '该记录已隐藏' })
        }
      } else if (val === 'delete') {
        this.deleteItem(index, row)
      }
    },
    deleteItem (index, row) {
      if (!this.deleting) {
        this.deleting = true
        this.$api.deleteShowItem(row.id, data => {
          this.findShowItems()
          this.deleting = false
          this.$message({type: 'success', message: '删除成功'})
        }, err => {
          this.deleting = false
          this.$message({type: 'error', message: `删除失败,${err.message}`})
        })
      }
    }
  }
}
</script>

<style>
</style>
