<template>
  <div class="turntable">
    <h2>大转盘奖品列表</h2>
    <div>
      <span>活动结束时间：</span>
      <!--<el-input-number v-model="time" size="small" :min="0" :disabled="!isUpdateTime"></el-input-number>-->
      <el-date-picker
        v-model="time"
        align="right"
        type="date"
        placeholder="选择日期"
        :disabled="!isUpdateTime"
        :clearable="false"
        :default-value="new Date()"
        :picker-options="pickerOptions">
      </el-date-picker>
      <div style="display: inline-block;">
        <template v-if="isUpdateTime">
          <el-button type="warning" size="small" :loading="updateTimeing" @click="updateTime">保存</el-button>
          <el-button type="danger" size="small" @click="cancelUpdateTime">取消</el-button>
        </template>
        <template v-else>
          <el-button type="primary" size="small" @click="updateTime">修改</el-button>
        </template>
      </div>
    </div>
    <br/>
    <!-- 添加按钮 -->
    <el-button type="primary" icon="plus" @click="editItem()"></el-button>
    <!-- 数据表格 -->
    <el-table
      :data="resource"
      border
    >
      <el-table-column
        label="奖品名称"
        prop="name"
        min-width="100">
      </el-table-column>
      <el-table-column
        label="奖品图片"
        prop="small_picture"
        width="166"
        align="center">
        <template scope="scope">
          <el-button size="mini" style="overflow:hidden" @click="showBigImg(scope.row.small_picture)">
            <img style="width:130px;height:100px;" :src="$api.file.see(scope.row.small_picture)">
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="商品价值"
        prop="price">
      </el-table-column>
      <el-table-column
        label="权重"
        prop="weight">
      </el-table-column>
      <el-table-column
        label="概率"
        prop="probability">
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
              <el-button type="primary" size="mini" :loading="delLoading" @click="delItem(scope.$index, scope.row)">确定
              </el-button>
            </div>
            <el-button slot="reference" :plain="true" type="danger" size="mini">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑弹出框 -->
    <el-dialog :title="(formModel.id?'修改':'添加')+'商品'" :visible.sync="editDialogVisible">
      <el-form ref="editForm" :rules="editFormRules" :model="formModel" label-width="100px">
        <el-form-item label="商品名称" prop="name">
          <el-input size="small" v-model="formModel.name" :maxlength="15" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品价值" prop="price">
          <el-input-number v-model="formModel.price" size="small" :min="0" :controls="false"></el-input-number>
        </el-form-item>
        <el-form-item label="权重" prop="weight">
          <el-input-number v-model="formModel.weight" size="small" :min="0" :controls="false"></el-input-number>
        </el-form-item>
        <el-form-item label="商品类型" prop="type">
          <template scope="scope">
            <el-select style="width: 100px;" size="small" v-model="formModel.type" placeholder="类型" :clearable="false" >
              <el-option
                v-for="(value, key) in $const.TURNTABLE_ITEM_TYPE"
                :key="key"
                :label="value"
                :value="key">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="是否需要收货地址" prop="needAddress">
          <el-switch
            v-model="formModel.needAddress"
            on-text="是"
            off-text="否">
          </el-switch>
        </el-form-item>
        <el-form-item label="充值金额" prop="money" v-if="formModel.type === 'BENEFIT_CARD'">
          <el-input-number v-model="formModel.money" size="small" :min="0" :controls="false"></el-input-number>
        </el-form-item>
        <el-form-item label="图片" prop="small_picture">
          <el-upload
            class="picture-uploader"
            action=""
            accept="image/*"
            :show-file-list="false"
            :data="{
              type: 'IMAGE'
            }"
            :disabled="uploading || formModel.small_picture?true:false"
            :http-request="uploadHandle">
            <template v-if="formModel.small_picture">
              <img :src="$api.file.see(formModel.small_picture)" class="picture">
              <span class="picture-uploader-list-item-action">
                  <span class="picture-uploader-list-item-preview" @click="showBigImg(formModel.small_picture)">
                    <i class="el-icon-view"></i>
                  </span>
                  <span class="picture-uploader-list-item-remove" @click.stop.prevent="formModel.small_picture=''">
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
        <el-button type="primary" :loading="editting" @click="submit('editForm')">确 定</el-button>
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
  name: 'turntable',
  data () {
    return {
      query: {
        pageNo: 1,
        pageSize: 10
      },
      time: '',
      oldTime: '',
      isUpdateTime: false,
      updateTimeing: false,
      pickerOptions: {
        shortcuts: [{
          text: '一星期',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }, {
          text: '一个月',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 30)
            picker.$emit('pick', date)
          }
        }, {
          text: '三个月',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 90)
            picker.$emit('pick', date)
          }
        }, {
          text: '半年',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 180)
            picker.$emit('pick', date)
          }
        }, {
          text: '一年',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 365)
            picker.$emit('pick', date)
          }
        }]
      },
      resource: [],
      delLoading: false,
      showDeletePopover: [],
      formModel: {
        name: '',
        price: 0,
        weight: 0,
        needAddress: false,
        type: 'ITEM',
        small_picture: ''
      },
      editDialogVisible: false,
      dialogImageUrl: '',
      imgDialogVisiable: false,
      uploading: false,
      editting: false,
      editFormRules: {
        name: [
          {required: true, message: '名称不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  created () {
    this.getTime()
    this.findTurntableItems()
  },
  methods: {
    findTurntableItems () {
      this.$api.findTurntableItems(this.query, this.findSuccess, this.findFailure)
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
    getTime () {
      this.$api.getTurntableTime(null, data => {
        this.time = new Date(parseInt(data.resource))
      }, err => {
        this.$notify({
          type: 'error',
          message: err.message
        })
      })
    },
    updateTime () {
      if (this.isUpdateTime) {
        if (this.updateTimeing) {
          return
        }
        this.updateTimeing = true
        let time = this.time.getTime()
        this.$api.setTurntableTime(time, data => {
          this.updateTimeing = false
          this.isUpdateTime = false
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        }, err => {
          this.updateTimeing = false
          this.$notify({
            type: 'error',
            message: err.message
          })
        })
      } else {
        this.oldTime = this.time
        this.isUpdateTime = true
      }
    },
    cancelUpdateTime () {
      this.time = this.oldTime
      this.isUpdateTime = false
    },
    editItem (index, row) {
      if (!row && this.resource.length >= 8) {
        this.$message({
          type: 'warning',
          message: '最多只能设置8个奖品项'
        })
        return
      }
      this.editDialogVisible = true
      this.$nextTick(() => {
        this.$refs['editForm'].resetFields()
        if (row) {
          this.formModel = Object.assign({}, row)
        } else {
          this.formModel = this.$options.data().formModel
        }
      })
    },
    delItem (index, row) {
      this.delLoading = true
      this.$api.deleteTurntableItem(row.id, data => {
        this.$set(this.showDeletePopover, index, false)
        this.delLoading = false
        this.findTurntableItems()
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
        this.$set(this.formModel, 'small_picture', data.file.id)
        // this.$refs['editForm'].validateField('small_picture')
        this.uploading = false
      }, (e) => {
        this.$message({
          type: 'error',
          message: e.message
        })
        this.uploading = false
      })
    },
    submit (formName) {
      this.$refs[formName].validate(valid => {
        if (valid && !this.editting) {
          this.editting = true
          if (this.formModel.id) {
            this.$api.updateTurntableItems(this.formModel, data => {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.findTurntableItems()
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
            this.$api.addTurntableItems(this.formModel, data => {
              this.$message({
                type: 'success',
                message: '添加成功'
              })
              this.findTurntableItems()
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
