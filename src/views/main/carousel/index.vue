<template>
  <div id="carousel">
    <h2>轮播图列表</h2>
    <!-- 添加按钮 -->
    <el-button type="primary" icon="plus" @click="editItem()"></el-button>
    <!-- 数据表格 -->
    <el-table
      :data="resource.content"
      border
      >
      <el-table-column 
        label="序号"
        min-width="50">
        <template scope="scope">
          <span v-text="resource.number * resource.size + scope.$index + 1"></span>
        </template>
      </el-table-column>
      <el-table-column 
        label="标题"
        prop="title"
        min-width="100">
      </el-table-column>
      <el-table-column 
        label="图片"
        prop="pictureId"
        width="166"
        align="center">
        <template scope="scope">
          <el-button size="mini" style="overflow:hidden" @click="showBigImg(scope.row.pictureId)">
            <img style="width:130px;height:100px;" :src="$api.file.see(scope.row.pictureId)">
          </el-button>
        </template>
      </el-table-column>
      <el-table-column 
        label="链接"
        prop="url"
        min-width="130">
      </el-table-column>
      <el-table-column 
        label="排序"
        prop="sort">
      </el-table-column>
      <el-table-column 
        label="是否显示"
        width="100"
        prop="disable">
        <template scope="scope">
          <el-switch
            @change="updateEnable($event, scope.row)"
            v-model="scope.row.enable"
            on-text="显示"
            off-text="隐藏">
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
    <el-dialog :title="(formModel.id?'修改':'添加')+'轮播图'" :visible.sync="editDialogVisible">
      <el-form ref="editForm" :rules="editFormRules" :model="formModel" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input size="small" v-model="formModel.title" :maxlength="50" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="链接" prop="url">
          <el-input size="small" v-model="formModel.url" :maxlength="255" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="pictureId">
          <el-upload
            class="picture-uploader"
            action=""
            accept="image/*"
            :show-file-list="false"
            :data="{
              type: 'IMAGE'
            }"
            :disabled="uploading || formModel.pictureId?true:false"
            :http-request="uploadHandle">
            <template v-if="formModel.pictureId">
              <img :src="$api.file.see(formModel.pictureId)" class="picture">
              <span class="picture-uploader-list-item-action">
                  <span class="picture-uploader-list-item-preview" @click="showBigImg(formModel.pictureId)">
                    <i class="el-icon-view"></i>
                  </span>
                  <span class="picture-uploader-list-item-remove" @click.stop.prevent="formModel.pictureId=''">
                    <i class="el-icon-delete2"></i>
                  </span>
                </span>
              </template>
            <i v-else class="picture-uploader-icon" :class="uploading?'el-icon-loading':'el-icon-plus'"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number size="small" v-model="formModel.sort" :min="0" :max="99999" :controls="false" :debounce="0"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="editting" @click="submitCarousel('editForm')">确 定</el-button>
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
  name: 'carousel',
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
        url: '',
        pictureId: '',
        sort: 0,
        disable: false
      },
      editDialogVisible: false,
      dialogImageUrl: '',
      imgDialogVisiable: false,
      uploading: false,
      editting: false,
      editFormRules: {
        title: [
          {required: true, message: '标题不能为空', trigger: 'blur'}
        ],
        url: [
          {required: true, message: '链接不能为空', trigger: 'blur'}
        ],
        pictureId: [
          {required: true, message: '图片不能为空', trigger: 'change'}
        ]
      }
    }
  },
  created () {
    this.findCarousel()
  },
  methods: {
    findCarousel () {
      this.$api.findCarousel(this.query, this.findSuccess, this.findFailure)
    },
    findSuccess (data) {
      data.resource.content.forEach((item) => {
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
      this.findCarousel()
    },
    updateEnable (value, row) {
      this.$api.updateCarouselEnable(row.id, data => {
        if (row.enable) {
          this.$message({ type: 'success', message: '启用成功' })
        } else {
          this.$message({ type: 'success', message: '禁用成功' })
        }
      }, e => {
        if (row.enable) {
          this.$message({ type: 'error', message: `启用失败,${e.message}` })
        } else {
          this.$message({ type: 'error', message: `禁用失败,${e.message}` })
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
      this.$api.deleteCarousel(row.id, data => {
        this.$set(this.showDeletePopover, index, false)
        this.delLoading = false
        this.findCarousel()
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
    showBigImg (pictureId) {
      this.dialogImageUrl = pictureId
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
        this.$set(this.formModel, 'pictureId', data.file.id)
        this.$refs['editForm'].validateField('pictureId')
        this.uploading = false
      }, (e) => {
        this.$message({
          type: 'error',
          message: e.message
        })
        this.uploading = false
      })
    },
    submitCarousel (formName) {
      this.$refs[formName].validate(valid => {
        if (valid && !this.editting) {
          this.editting = true
          if (this.formModel.id) {
            this.$api.updateCarousel(this.formModel, data => {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.findCarousel()
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
            this.$api.addCarousel(this.formModel, data => {
              this.$message({
                type: 'success',
                message: '添加成功'
              })
              this.findCarousel()
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
