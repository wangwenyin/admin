<template>
    <div>
      <h2>分享配置</h2>
      <div>
        <span>注册送赠币数：</span>
        <el-input-number v-model="shareNum" size="small" :min="0" :disabled="!isUpdateShareNum"></el-input-number>
        <div style="display: inline-block;">
          <template v-if="isUpdateShareNum">
            <el-button type="warning" size="small" :loading="updateShareNuming" @click="updateShareNum">保存</el-button>
            <el-button type="danger" size="small" @click="cancelUpdateShareNum">取消</el-button>
          </template>
          <template v-else>
            <el-button type="primary" size="small" @click="updateShareNum">修改</el-button>
          </template>
        </div>
      </div>
      <br/>
      <div>
        <div style="display: inline-block;vertical-align: top;">ios应用链接</div>
        <el-input
          style="width: 40%;vertical-align: top;"
          type="textarea"
          :rows="3"
          :readonly="!isUpdateIosUrl"
          v-model="iosUrl"
          >
        </el-input>
        <div style="display: inline-block;">
          <template v-if="isUpdateIosUrl">
            <el-button type="warning" size="small" @click="updateIosUrl">保存</el-button>
            <br/>
            <br/>
            <el-button type="danger" size="small" @click="cancelUpdateIosUrl">取消</el-button>
          </template>
          <template v-else>
            <el-button type="primary" size="small" @click="updateIosUrl">修改</el-button>
          </template>
        </div>
      </div>
      <br/>
      <div>
        <div style="display: inline-block;">android应用(apk)</div>
        <!--<el-input-->
          <!--style="width: 20%;vertical-align: top;"-->
          <!--:disabled="true"-->
          <!--:readonly="true"-->
          <!--v-model="androidApk"-->
          <!--&gt;-->
        <!--</el-input>-->
        <!--<el-upload-->
          <!--style="display: inline-block;"-->
          <!--action=""-->
          <!--:show-file-list="false"-->
          <!--:disabled="androidUploading"-->
          <!--:http-request="androidUpload">-->
          <!--<el-button type="primary" size="small" :loading="androidUploading">上传apk应用</el-button>-->
        <!--</el-upload>-->
        <el-input
          style="width: 40%;vertical-align: top;"
          type="textarea"
          :rows="3"
          :readonly="!isUpdateAndroidUrl"
          v-model="androidUrl"
        >
        </el-input>
        <div style="display: inline-block;">
          <template v-if="isUpdateAndroidUrl">
            <el-button type="warning" size="small" @click="updateAndroidUrl">保存</el-button>
            <br/>
            <br/>
            <el-button type="danger" size="small" @click="cancelUpdateAndroidUrl">取消</el-button>
          </template>
          <template v-else>
            <el-button type="primary" size="small" @click="updateAndroidUrl">修改</el-button>
          </template>
        </div>
      </div>
      <br/>
      <div>
        <div style="display: inline-block;">微信分享设置</div>
        <el-button type="primary" size="small" :loading="wxgetiing" @click="showWXShareDataDialog">查看</el-button>
        <el-dialog title="微信分享设置" :visible.sync="wxShareDataDialogVisible">
          <el-form ref="wxShareDataForm" :rules="wxShareDataFormRules" :model="wxShareData" label-width="100px">
            <el-form-item label="标题" prop="title">
              <el-input size="small" v-model="wxShareData.title" :maxlength="50" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="context">
              <el-input type="textarea" size="small" v-model="wxShareData.context" :maxlength="100"
                        auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="链接" prop="shareUrl">
              <el-input type="textarea" size="small" v-model="wxShareData.shareUrl" :maxlength="255" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="图标" prop="imgId">
              (小于32kb, png格式)
              <el-upload
                class="picture-uploader"
                style="width: 80px;height: 80px;border-width: 2px"
                action=""
                accept="image/*"
                :show-file-list="false"
                :data="{
                  type: 'IMAGE'
                }"
                :disabled="uploading"
                :http-request="uploadHandle">
                <img v-if="wxShareData.imgId" :src="$api.file.see(wxShareData.imgId)" class="picture" style="width: 80px;height: 80px;">
                <i v-else style="width: 80px;height: 80px;line-height: 80px;" class="picture-uploader-icon" :class="uploading?'el-icon-loading':'el-icon-plus'"></i>
              </el-upload>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer" style="text-align: center;">
            <el-button @click="wxShareDataDialogVisible = false">取 消</el-button>
            <el-button type="primary" :loading="editingWXShare" @click="setWXShareData('wxShareDataForm')">修 改</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
</template>

<script>
export default {
  name: 'share',
  data () {
    return {
      shareNum: 0,
      isUpdateShareNum: false,
      updateShareNuming: false,
      iosUrl: '',
      oldIosUrl: '',
      isUpdateIosUrl: false,
      androidUrl: '',
      oldAndroidUrl: '',
      isUpdateAndroidUrl: false,
      androidUploading: false,
      androidApk: '',
      wxShareData: {
        title: '',
        imgId: '',
        context: '',
        shareUrl: ''
      },
      wxgetiing: false,
      editingWXShare: false,
      uploading: false,
      wxShareDataDialogVisible: false,
      wxShareDataFormRules: {
        title: [
          {required: true, message: '标题不能为空', trigger: 'blur'}
        ],
        context: [
          {required: true, message: '描述不能为空', trigger: 'blur'}
        ],
        shareUrl: [
          {required: true, message: '链接不能为空', trigger: 'blur'}
        ],
        imgId: [
          {required: true, message: '图片不能为空', trigger: 'change'}
        ]
      }
    }
  },
  created () {
    this.getShareNum()
    this.getIosUrl()
    this.getAndroidUrl()
  },
  methods: {
    getShareNum () {
      this.$api.getShareNum(null, data => {
        this.shareNum = data.resource
      }, err => {
        this.$notify({
          type: 'error',
          message: err.message
        })
      })
    },
    updateShareNum () {
      if (this.isUpdateShareNum) {
        if (this.updateShareNuming) {
          return
        }
        this.updateShareNuming = true
        this.$api.setShareNum(this.shareNum, data => {
          this.updateShareNuming = false
          this.isUpdateShareNum = false
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        }, err => {
          this.updateShareNuming = false
          this.$notify({
            type: 'error',
            message: err.message
          })
        })
      } else {
        this.oldShareNum = this.shareNum
        this.isUpdateShareNum = true
      }
    },
    cancelUpdateShareNum () {
      this.shareNum = this.oldShareNum
      this.isUpdateShareNum = false
    },
    updateIosUrl () {
      if (this.isUpdateIosUrl) {
        if (!this.iosUrl.trim()) {
          this.$message({
            type: 'error',
            message: '请输入url'
          })
          return
        }
        this.$api.setIosUrl(this.iosUrl, data => {
          this.isUpdateIosUrl = false
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        }, err => {
          this.$notify({
            type: 'error',
            message: err.message
          })
        })
      } else {
        this.oldIosUrl = this.iosUrl
        this.isUpdateIosUrl = true
      }
    },
    cancelUpdateIosUrl () {
      this.iosUrl = this.oldIosUrl
      this.isUpdateIosUrl = false
    },
    getIosUrl () {
      this.$api.getIosUrl(null, data => {
        this.iosUrl = data.resource
      }, err => {
        this.$notify({
          type: 'error',
          message: err.message
        })
      })
    },
    updateAndroidUrl () {
      if (this.isUpdateAndroidUrl) {
        if (!this.androidUrl.trim()) {
          this.$message({
            type: 'error',
            message: '请输入url'
          })
          return
        }
        this.$api.setAndroidUrl(this.androidUrl, data => {
          this.isUpdateAndroidUrl = false
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        }, err => {
          this.$notify({
            type: 'error',
            message: err.message
          })
        })
      } else {
        this.oldAndroidUrl = this.androidUrl
        this.isUpdateAndroidUrl = true
      }
    },
    cancelUpdateAndroidUrl () {
      this.androidUrl = this.oldAndroidUrl
      this.isUpdateAndroidUrl = false
    },
    getAndroidUrl () {
      this.$api.getAndroidUrl(null, data => {
        this.androidUrl = data.resource
      }, err => {
        this.$notify({
          type: 'error',
          message: err.message
        })
      })
    },
//    getAndroidApk () {
//      this.$api.getAndroidApk(null, data => {
//        this.androidApk = data.resource
//      }, err => {
//        this.$notify({
//          type: 'error',
//          message: err.message
//        })
//      })
//    },
//    androidUpload (_this) {
//      let file = _this.file
//      let data = new FormData()
//      data.append('file', file)
//      this.androidUploading = true
//      this.$api.uploadFile(data, (data) => {
//        this.$api.setAndroidApk(data.file.id, data => {
//          this.$message({
//            type: 'success',
//            message: '上传成功'
//          })
//        }, err => {
//          this.$message({
//            type: 'error',
//            message: err.message
//          })
//        })
//        this.androidUploading = false
//      }, (e) => {
//        this.$message({
//          type: 'error',
//          message: e.message
//        })
//        this.androidUploading = false
//      })
//    },
    showWXShareDataDialog () {
      this.wxShareDataDialogVisible = true
      this.getWXShareData()
    },
    getWXShareData () {
      if (!this.wxgetiing) {
        this.wxgetiing = true
        this.$api.getWXShareData(null, data => {
          this.wxShareData = {
            title: data.resource.title || '',
            imgId: data.resource.imgId || '',
            context: data.resource.context || '',
            shareUrl: data.resource.shareUrl || ''
          }
          this.wxShareDataDialogVisible = true
          this.wxgetiing = false
        }, err => {
          this.wxShareDataDialogVisible = false
          this.wxgetiing = false
          this.$message({
            type: 'error',
            message: err.message
          })
        })
      }
    },
    setWXShareData (formName) {
      this.$refs[formName].validate(valid => {
        if (valid && !this.editingWXShare) {
          this.editingWXShare = true
          this.$api.setWXShareData(this.wxShareData, data => {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.wxShareDataDialogVisible = false
            this.editingWXShare = false
          }, err => {
            this.$message({
              type: 'error',
              message: err.message
            })
            this.editingWXShare = false
          })
        }
      })
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
      if (file.type.toLowerCase().indexOf('png') === -1) {
        this.$message({
          type: 'info',
          message: '只能上传PNG格式图片'
        })
        return
      }
      if (file.size >= 32000) {
        this.$message({
          type: 'warning',
          message: '图片不能大于32kb'
        })
        return
      }
      let data = new FormData()
      data.append('file', file)
      data.append('type', 'IMAGE')
      this.uploading = true
      this.$api.uploadImage(data, (data) => {
        this.$set(this.wxShareData, 'imgId', data.file.id)
        this.$refs['wxShareDataForm'].validateField('imgId')
        this.uploading = false
      }, (e) => {
        this.$message({
          type: 'error',
          message: e.message
        })
        this.uploading = false
      })
    }
  }
}
</script>

<style>

</style>
