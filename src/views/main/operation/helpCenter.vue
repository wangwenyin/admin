<template>
  <div id="helpCenter">
    <h2>帮助中心</h2>
    <!-- 添加按钮 -->
    <el-button type="primary" icon="plus" @click="editItem()"></el-button>
    <!-- 数据表格 -->
    <el-table
      :data="resource.content"
      border
      >
      <el-table-column 
        label="标题"
        prop="title"
        min-width="66">
      </el-table-column>
      <el-table-column 
        label="时间"
        prop="time"
        min-width="100">
      </el-table-column>
      <el-table-column 
        label="内容"
        prop="context"
        min-width="130">
      </el-table-column>
      <el-table-column 
        label="类型"
        prop="type">
        <template scope="scope">
          <span>{{$const.QUESTION_CATEGORY[scope.row.type]}}</span>
        </template>
      </el-table-column>
      <el-table-column 
        label="是否发布"
        width="100"
        prop="enable">
        <template scope="scope">
          <el-switch
            @change="updateEnable($event, scope.row)"
            v-model="scope.row.enable"
            on-text="是"
            off-text="否">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="190">
        <template scope="scope">
          <el-button :plain="true" type="primary" size="mini" @click="editItem(scope.$index, scope.row)">编辑</el-button>
          <el-popover
            placement="top"
            width="160"
            v-model="showDeletePopover[scope.$index]">
            <p>此操作将永久删除该数据, 是否继续?</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$set(showDeletePopover, scope.$index, false)">取消</el-button>
              <el-button type="primary" size="mini" :loading="delLoading" @click="delItem(scope.$index, scope.row)">确定</el-button>
            </div>
            <el-button slot="reference" :plain="true" type="danger" size="mini">删除</el-button>
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
    <el-dialog :title="(formModel.id?'修改':'添加')+'标签'" :visible.sync="editDialogVisible">
      <el-form ref="editForm" :rules="editFormRules" :model="formModel" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input size="small" v-model="formModel.title" :maxlength="50" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="context">
          <el-input type="textarea" size="small" v-model="formModel.context" :maxlength="255" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select size="small" v-model="formModel.type" clearable placeholder="类型">
            <el-option
              v-for="(value, key) in $const.QUESTION_CATEGORY"
              :key="key"
              :label="value"
              :value="key">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="editting" @click="submitQuestion('editForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'helpCenter',
  data () {
    return {
      query: {
        title: '',
        questionCategory: '',
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
        type: ''
      },
      editDialogVisible: false,
      editting: false,
      editFormRules: {
        title: [
          {required: true, message: '请输入标题', trigger: 'blur'}
        ],
        context: [
          {required: true, message: '请输入内容', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '请选择类型', trigger: 'change'}
        ]
      }
    }
  },
  created () {
    this.findQuestions()
  },
  methods: {
    findQuestions () {
      this.$api.findQuestions(this.query, this.findSuccess, this.findFailure)
    },
    findSuccess (data) {
      data.resource.content.map(item => {
        item.enable = !item.disable
      })
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
      this.findQuestions()
    },
    updateEnable (value, row) {
      this.$api.updateQuestionState(row.id, data => {
        if (row.enable) {
          this.$message({ type: 'success', message: '显示' })
        } else {
          this.$message({ type: 'success', message: '隐藏' })
        }
      }, e => {
        if (row.enable) {
          this.$message({ type: 'error', message: `显示失败,${e.message}` })
        } else {
          this.$message({ type: 'error', message: `隐藏失败,${e.message}` })
        }
        this.$set(row, 'enable', !row.enable)
      })
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
      this.$api.deleteLabel(row.id, data => {
        this.$set(this.showDeletePopover, index, false)
        this.delLoading = false
        this.findQuestions()
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
    submitQuestion (formName) {
      this.$refs[formName].validate(valid => {
        if (valid && !this.editting) {
          this.editting = true
          if (this.formModel.id) {
            this.$api.updateQuestion(this.formModel, data => {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.findQuestions()
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
            this.$api.addQuestion(this.formModel, data => {
              this.$message({
                type: 'success',
                message: '添加成功'
              })
              this.findQuestions()
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
          }
        }
      })
    }
  }
}
</script>

<style>
</style>
