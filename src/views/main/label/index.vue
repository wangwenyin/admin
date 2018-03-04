<template>
  <div id="label">
    <h2>标签列表</h2>
    <!-- 添加按钮 -->
    <el-button type="primary" icon="plus" @click="editItem()"></el-button>
    <!-- 数据表格 -->
    <el-table
      :data="resource.content"
      border
      >
      <el-table-column 
        label="标签ID"
        prop="id"
        min-width="66">
      </el-table-column>
      <el-table-column 
        label="标签名称"
        prop="name"
        min-width="100">
      </el-table-column>
      <el-table-column 
        label="标签图标"
        prop="picture"
        width="166"
        align="center">
        <template scope="scope">
          <el-button size="mini" style="overflow:hidden" @click="showBigImg(scope.row.picture)">
            <img style="width:130px;height:100px;" :src="$api.file.see(scope.row.picture)">
          </el-button>
        </template>
      </el-table-column>
      <el-table-column 
        label="标签url"
        prop="url"
        min-width="130">
      </el-table-column>
      <!-- <el-table-column 
        label="设置地址"
        prop="setting_url">
      </el-table-column> -->
      <el-table-column 
        label="创建时间"
        prop="time">
        <template scope="scope">
          <span>{{$filter.date(scope.row.time)}}</span>
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
        <el-form-item label="标题" prop="name">
          <el-input size="small" v-model="formModel.name" :maxlength="50" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="链接" prop="url">
          <el-input size="small" v-model="formModel.url" :maxlength="255" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="picture">
          <el-upload
            class="picture-uploader"
            action=""
            accept="image/*"
            :show-file-list="false"
            :data="{
              type: 'IMAGE'
            }"
            :disabled="uploading || formModel.picture?true:false"
            :http-request="uploadHandle">
            <template v-if="formModel.picture">
              <img :src="$api.file.see(formModel.picture)" class="picture">
              <span class="picture-uploader-list-item-action">
                  <span class="picture-uploader-list-item-preview" @click="showBigImg(formModel.picture)">
                    <i class="el-icon-view"></i>
                  </span>
                  <span class="picture-uploader-list-item-remove" @click.stop.prevent="formModel.picture=''">
                    <i class="el-icon-delete2"></i>
                  </span>
                </span>
              </template>
            <i v-else class="picture-uploader-icon" :class="uploading?'el-icon-loading':'el-icon-plus'"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="editting" @click="submitLabel('editForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看大图 -->
    <el-dialog v-model="imgDialogVisiable" size="tiny">
      <img width="100%" :src="$api.file.see(dialogImageUrl)" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'label',
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
        name: '',
        url: '',
        picture: ''
      },
      editDialogVisible: false,
      dialogImageUrl: '',
      imgDialogVisiable: false,
      uploading: false,
      editting: false,
      editFormRules: {
        name: [
          {required: true, message: '标题不能为空', trigger: 'blur'}
        ],
        url: [
          {required: true, message: '链接不能为空', trigger: 'blur'}
        ],
        picture: [
          {required: true, message: '图片不能为空', trigger: 'change'}
        ]
      }
    }
  },
  created () {
    this.findLabels()
  },
  methods: {
    findLabels () {
      this.$api.findLabels(this.query, this.findSuccess, this.findFailure)
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
      this.findLabels()
    },
    updateEnable (value, row) {
      this.$api.updateLabelEnable(row.id, data => {
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
        this.findLabels()
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
    showBigImg (picture) {
      this.dialogImageUrl = picture
      this.imgDialogVisiable = true
    },
    uploadHandle (_this) {
      let file = _this.file
      if (!/image\/\w+/.test(file.type)) {
        this.$message({
          type: 'info',
          message: '只能上传图片'
        })
        return
      }
      if (file.size >= 5000000) {
        this.$message({
          type: 'warning',
          message: '图片不能大于5M'
        })
        return
      }
      let data = new FormData()
      data.append('file', file)
      data.append('type', 'IMAGE')
      this.uploading = true
      this.$api.uploadImage(data, (data) => {
        this.$set(this.formModel, 'picture', data.file.id)
        this.$refs['editForm'].validateField('picture')
        this.uploading = false
      }, (e) => {
        this.$message({
          type: 'error',
          message: e.message
        })
        this.uploading = false
      })
    },
    submitLabel (formName) {
      this.$refs[formName].validate(valid => {
        if (valid && !this.editting) {
          this.editting = true
          if (this.formModel.id) {
            this.$api.updateLabel(this.formModel, data => {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.findLabels()
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
            this.$api.addLabel(this.formModel, data => {
              this.$message({
                type: 'success',
                message: '添加成功'
              })
              this.findLabels()
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
