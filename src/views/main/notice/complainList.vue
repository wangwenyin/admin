<template>
  <div id="carousel">
    <h2>投诉建议</h2>
    <!--<el-form :model="query" inline>
        <el-form-item>
          <el-input size="small" v-model="query.userId" placeholder="用户ID"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input size="small" v-model="query.source" placeholder="标题"></el-input>
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
          <el-button icon="search" type="primary" size="small" native-type="submit" @click.prevent="search">搜索</el-button>
        </el-form-item>
      </el-form>-->
    <!-- 添加按钮 -->
<!--    <el-button type="primary" icon="plus" @click="editItem()"></el-button>-->
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
        label="用户名称"
        prop="username">
      </el-table-column>
      <el-table-column 
        label="标题"
        prop="title"
        min-width="100">
      </el-table-column>
      <el-table-column 
        label="创建时间"
        prop="time"
        min-width="100">
        <template scope="scope">
          {{$filter.date(scope.row.time)}}
        </template>
      </el-table-column>
      <el-table-column 
        label="投诉状态"
        prop="isDeal"
        min-width="100">
        <template scope="scope">
          {{scope.row.isDeal?'已处理':'未处理'}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="190">
        <template scope="scope">
          <el-button :plain="true" type="primary" size="mini" @click="showItem(scope.$index, scope.row)">查看投诉</el-button>
          <el-button :plain="true" type="primary" size="mini" @click="editItem(scope.$index, scope.row)">立即处理</el-button>
          <el-popover
            placement="top"
            width="160"
            v-model="showDeletePopover[scope.$index]">
            <p>此操作将永久删除该数据, 是否继续?</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$set(showDeletePopover, scope.$index, false)">取消</el-button>
              <el-button type="primary" size="mini" :loading="delLoading" @click="delItem(scope.$index, scope.row)">确定</el-button>
            </div>
            <!--<el-button slot="reference" :plain="true" type="danger" size="mini">删除</el-button>-->
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
    <!-- 编辑弹出框 -->
    <el-dialog :visible.sync="editDialogVisible">
      <span slot="title">处理投诉</span>
          <el-form ref="editForm" :model="formModel" :rules="editFormRules" label-width="70px">
            <el-form-item prop="title" label="标题">
              <el-input size="small" v-model="formModel.title"></el-input>
            </el-form-item>
            <el-form-item prop="context" label="内容">
              <el-input type="textarea" size="small" v-model="formModel.context"></el-input>
            </el-form-item>
          </el-form>
          <div style="text-align: center;">
            <el-button size="small" :loading="editting" @click="submitComplain('editForm')">确定</el-button>
            <el-button size="small" @click="editDialogVisible = false">取消</el-button>
          </div>
      </el-form>
    </el-dialog>
    <!-- 查看内容 -->
    <el-dialog v-model="showDialogVisiable" size="tiny">
      <div style="text-align: center;">
        <h2>{{sleItem.title}}</h2>
        <b>{{$filter.date(sleItem.time)}}</b>
        <p>{{sleItem.context}}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'noticeList',
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
      showDeletePopover: [],
      formModel: {
        title: '',
        context: '',
        isDeal: '',
        id: '',
        username: ''
      },
      editDialogVisible: false,
      dialogImageUrl: '',
      imgDialogVisiable: false,
      uploading: false,
      editting: false,
      editFormRules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        context: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      },
      showDialogVisiable: false,
      sleItem: {}
    }
  },
  created () {
    this.findNotice()
  },
  methods: {
    findNotice () {
      this.$api.findComplain(this.query, this.findSuccess, this.findFailure)
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
      this.findNotice()
    },
    editItem (index, row) {
      this.editDialogVisible = true
      this.$nextTick(() => {
        this.$refs['editForm'].resetFields()
        if (!row) {
          this.formModel = this.$options.data().formModel
        } else {
          this.formModel = Object.assign({}, row)
        }
      })
    },
    delItem (index, row) {
      this.delLoading = true
      this.$api.deleteNotice(row.id, data => {
        this.$set(this.showDeletePopover, index, false)
        this.delLoading = false
        this.findNotice()
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
    submitComplain (formName) {
      this.$refs[formName].validate(valid => {
        if (valid && !this.editting) {
          this.editting = true
          if (this.formModel.id) {
            this.$api.updateComplain(this.formModel, data => {
              this.$message({
                type: 'success',
                message: '处理成功'
              })
              this.findNotice()
              this.editting = false
              this.editDialogVisible = false
            }, err => {
              this.$message({
                type: 'error',
                message: err.message
              })
              this.editting = false
              this.editDialogVisible = false
            })
          } else {
            
          }
        }
      })
    },
    showItem (index, row) {
      this.showDialogVisiable = true
      this.sleItem = row
    }
  }
}
</script>

<style>
</style>
