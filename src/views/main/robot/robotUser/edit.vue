<template>
  <div id="robotUserEdit">
    <h2>编辑机器人</h2>
    <hr/>
    <h4>单个</h4>
    <el-form ref="form" :rules="formRules"  :model="item" label-width="120px">
        <el-form-item prop="username" label="用户名">
          <el-input size="small" style="width:30%;" v-model="item.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="address" label="地址">
          <el-input size="small" style="width:30%;" v-model="item.address" placeholder="地址"></el-input>
        </el-form-item>
        <el-form-item prop="headImageFileId" label="头像">
          <el-upload
            style="width: 50px;height:50px;"
            class="picture-uploader"
            action=""
            accept="image/*"
            :show-file-list="false"
            :data="{
              type: 'IMAGE'
            }"
            :disabled="headImageUploading"
            :http-request="headImageUploadHandle">
            <template v-if="item.headImageFileId">
              <img class="picture-uploader-list-item-img" :src="$api.file.see(item.headImageFileId)">
            </template>
            <template v-else>
              <i style="width: 50px; height:50px; color: #8c939d; line-height:50px;" :class="headImageUploading?'el-icon-loading':'el-icon-plus'"></i>
            </template>
          </el-upload>
          <div
            style="width: 50px;height:50px;margin-top:4px;"
            class="picture-uploader-list-item"
            v-for="(img, index) in imgs"
            :key="img.headImageFileId"
            @click="item.headImageFileId = img.headImageFileId">
            <img class="picture-uploader-list-item-img" :src="$api.file.see(img.headImageFileId)">
          </div>
        </el-form-item>
        <el-form-item >
          <el-button :icon="item.id?'edit':'plus'" type="primary" size="small" @click="submit('form')" :loading="committing">{{item.id?'修改':'添加'}}</el-button>
          <el-button icon="close" type="primary" size="small" @click.prevent="$router.go(-1)">取消</el-button>
        </el-form-item>
      </el-form>
    <h4>批量上传</h4>
    <el-button type="primary" size="small" @click.prevent="tempDownLoad">下载模板</el-button>
    <!--<el-button type="primary" :href="$api.tempFile()">下载模板</el-button>-->
    <div>
      <div style="display: inline-block;margin-top:4px;vertical-align: top">头像:</div>
        <div style="width: 50px;height:80px; margin: 4px; cursor:default; border: none;" class="picture-uploader-list-item" v-for="(img, index) in imgs" :key="img.headImageFileId">
          <img class="picture-uploader-list-item-img" style="display: inline-block;height:50px;" :src="$api.file.see(img.headImageFileId)">
          <span style="display: inline-block;width:100%;text-align:center;">{{img.headImageName}}</span>
        </div>
    </div>
    <el-upload
      action=""
      :show-file-list="false"
      :disabled="batchUploading"
      :http-request="batchUpload">
        <el-button type="primary" size="small" :loading="batchUploading">批量上传</el-button>
      </el-upload>
  </div>
</template>

<script>
export default {
  name: 'robotUserEdit',
  data () {
    return {
      committing: false,
      item: {
        username: '',
        address: '',
        headImageFileId: ''
      },
      imgs: [],
      headImageUploading: false,
      batchUploading: false,
      formRules: {
        username: [
          {required: true, message: '请输入用户名称', trigger: 'blur'}
        ],
        address: [
          {required: true, message: '请输入地址', trigger: 'blur'}
        ]
      }
    }
  },
  created () {
    this.findUser()
    this.fingHeadImgs()
  },
  methods: {
    findUser () {
      if (this.$route.query.id) {
        this.$api.getRobotUser(this.$route.query.id, data => {
          data.resource.headImageFileId = data.resource.head_pic
          this.item = data.resource
        }, err => {
          this.$message({type: 'error', message: err.message})
        })
      }
    },
    fingHeadImgs () {
      this.$api.findDefaultRobotUserHeadImg({}, data => {
        this.imgs = data.resource
      }, err => {
        this.$notify({
          type: 'error',
          message: err.message
        })
      })
    },
    headImageUploadHandle (_this) {
      this.uploadHandle(_this, 'headImageFileId')
    },
    submit (formName) {
      this.$refs[formName].validate(valid => {
        if (valid && !this.committing) {
          this.committing = true
          if (this.item.id) {
            this.$api.updateRobotUser(this.item, data => {
              this.$message({type: 'success', message: '修改成功'})
              this.committing = false
              this.$router.go(-1)
            }, err => {
              this.$message({type: 'error', message: err.message})
              this.committing = false
            })
          } else {
            this.$api.addRobotUser(this.item, data => {
              this.$message({type: 'success', message: '添加成功'})
              this.$router.go(-1)
              this.committing = false
            }, err => {
              this.$message({type: 'error', message: err.message})
              this.committing = false
            })
          }
        }
      })
    },
    uploadHandle (_this, key) {
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
      this.headImageUploading = true
      this.$api.uploadImage(data, (data) => {
        if (this.item.hasOwnProperty(key)) {
          this.$set(this.item, key, data.file.id)
          this.imgs.push(data.file.id)
        }
        this.headImageUploading = false
      }, (e) => {
        this.$message({
          type: 'error',
          message: e.message
        })
        this.headImageUploading = false
      })
    },
    tempDownLoad () {
      window.location.href = this.$api.tempFile()
    },
    batchUpload (_this) {
      let file = _this.file
      let data = new FormData()
      data.append('file', file)
      this.batchUploading = true
      this.$api.uploadRobotUsers(data, (data) => {
        this.$message({
          type: 'success',
          message: '上传成功'
        })
        this.batchUploading = false
      }, (e) => {
        this.$message({
          type: 'error',
          message: e.message
        })
        this.batchUploading = false
      })
    }
  }
}
</script>

<style>

</style>
