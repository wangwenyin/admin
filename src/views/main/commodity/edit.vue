<template>
  <div id="commodityEdit">
      <h2>{{item.id?'修改':'添加'}}商品</h2>
      <el-form ref="form" :rules="formRules"  :model="item" label-width="120px">
        <el-form-item prop="name" label="商品名称">
          <el-input size="small" style="width:30%;" v-model="item.name" placeholder="商品名称" :maxlength="16"></el-input>
        </el-form-item>
        <el-form-item prop="item_type" label="商品类型">
          <el-input size="small" style="width:30%;" v-model="item.item_type" placeholder="商品类型" ></el-input>
        </el-form-item>
        <el-form-item prop="cost" label="成本价">
          <el-input-number :controls="false" size="small" :min="0" style="width:30%;" v-model="item.cost" placeholder="成本价"></el-input-number>
        </el-form-item>
        <el-form-item prop="price" label="市场价">
          <el-input-number :controls="false" size="small" :min="0" style="width:30%;" v-model="item.price" placeholder="市场价"></el-input-number>
        </el-form-item>
        <el-form-item prop="control_line" label="票数控线">
          <el-input-number :controls="false" size="small" :min="0" style="width:30%;" v-model="item.control_line" placeholder="票数控线"></el-input-number>
        </el-form-item>
        <el-form-item prop="small_picture" label="商品小图">
           <el-upload
            class="picture-uploader"
            action=""
            accept="image/*"
            :show-file-list="false"
            :data="{
              type: 'IMAGE'
            }"
            :disabled="uploading || item.small_picture?true:false"
            :http-request="smallUploadHandle">
            <template v-if="item.small_picture">
              <img :src="$api.file.see(item.small_picture)" class="picture" style="height: 150px;">
              <span class="picture-uploader-list-item-action">
                  <span class="picture-uploader-list-item-preview" @click="showBigImg(item.small_picture)">
                    <i class="el-icon-view"></i>
                  </span>
                  <span class="picture-uploader-list-item-remove" @click.stop.prevent="item.small_picture=''">
                    <i class="el-icon-delete2"></i>
                  </span>
                </span>
              </template>
            <i v-else class="picture-uploader-icon" :class="uploading?'el-icon-loading':'el-icon-plus'"></i>
          </el-upload>
        </el-form-item>
         <el-form-item prop="bigPictures" label="商品大图">
            <div class="picture-uploader-list-item" v-for="(img, index) in item.bigPictures" :key="img">
              <img class="picture-uploader-list-item-img" :src="$api.file.see(img)">
              <span class="picture-uploader-list-item-action">
                <span class="picture-uploader-list-item-preview" @click="showBigImg(img)">
                  <i class="el-icon-view"></i>
                </span>
                <span class="picture-uploader-list-item-remove" @click.stop.prevent="item.bigPictures.splice(index, 1)">
                  <i class="el-icon-delete2"></i>
                </span>
              </span>
            </div>
            <el-upload
                style="display:inline-block;"
                class="picture-uploader"
                action=""
                accept="image/*"
                multiple
                :show-file-list="false"
                :data="{
                  type: 'IMAGE'
                }"
                :disabled="bigUploading"
                :http-request="bigUploadHandle">
                <i class="picture-uploader-icon" :class="bigUploading?'el-icon-loading':'el-icon-plus'"></i>
              <i class="el-icon-plus"></i>
            </el-upload>
        </el-form-item>
        <el-form-item prop="running_program" label="机器人运行方案">
          <el-select size="small" v-model="item.running_program" clearable placeholder="机器人运行方案">
            <el-option
              v-for="(label, key) in RunningPrograms"
              :key="key"
              :label="label"
              :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="increase_the_price" label="每轮加价数">
          <el-input-number :controls="false" :step="0.1" size="small" :min="0.1" style="width:30%;" v-model="item.increase_the_price" placeholder="每轮加价数"></el-input-number>
        </el-form-item>
        <el-form-item prop="plus_code" label="每轮加码数">
          <el-input-number :controls="false" size="small" :min="1" style="width:30%;" v-model="item.plus_code" placeholder="每轮加码数"></el-input-number>
        </el-form-item>
        <el-form-item prop="in_kind" label="是否实物">
          <el-switch v-model="item.in_kind" :width="50" on-text="是" off-text="否"></el-switch>
        </el-form-item>
        <el-form-item prop="purchaseAddress" label="购买地址">
          <el-input type="textarea" size="small" style="width:30%;" v-model="item.purchaseAddress"></el-input>
        </el-form-item>
         <el-form-item >
          <el-button :icon="item.id?'edit':'plus'" type="primary" size="small" @click="submit('form')" :loading="committing">{{item.id?'修改':'添加'}}</el-button>
          <el-button icon="close" type="primary" size="small" @click.prevent="$router.go(-1)">取消</el-button>
        </el-form-item>
      </el-form>
      <!-- 查看大图 -->
      <el-dialog v-model="imgDialogVisiable" size="tiny">
        <img width="100%" v-for="item in dialogImages" :key="item" :src="$api.file.see(item)" alt="">
      </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'commodityEdit',
  data () {
    return {
      committing: false,
      item: {
        name: '',
        item_type: '',
        cost: 0,
        price: 0,
        control_line: 0,
        increase_the_price: 0,
        plus_code: 0,
        labels: [],
        small_picture: '',
        bigPictures: [],
        in_kind: false,
        running_program: ''
      },
      uploading: false,
      bigUploading: false,
      dialogImages: [],
      imgDialogVisiable: false,
      formRules: {
        name: [
          {required: true, message: '请输入商品名称', trigger: 'blur'}
        ],
        item_type: [
          {required: true, message: '请输入商品名称', trigger: 'blur'}
        ],
        cost: [
          {required: true, type: 'number', message: '请输入成本价', trigger: 'blur'}
        ],
        price: [
          {required: true, type: 'number', message: '请输入市场价', trigger: 'blur'}
        ],
        control_line: [
          {required: true, type: 'number', message: '请输入票数控线', trigger: 'blur'}
        ],
        increase_the_price: [
          {required: true, type: 'number', message: '请输入每轮加价数', trigger: 'blur'}
        ],
        plus_code: [
          {required: true, type: 'number', message: '请输入每轮加码数', trigger: 'blur'}
        ],
        small_picture: [
          {required: true, message: '请上传商品小图', trigger: 'change'}
        ],
        bigPictures: [
          {required: true, type: 'array', message: '请上传商品大图', trigger: 'change'}
        ],
        in_kind: [
           {required: true, type: 'boolean', message: '', trigger: 'change'}
        ],
        running_program: [
           {required: true, message: '请选择运行方案', trigger: 'change'}
        ]
      }
    }
  },
  computed: {
    RunningPrograms: function () {
      return this.$globalBus.RunningPrograms || []
    }
  },
  created () {
    if (this.$route.query.id) {
      this.$api.getCommodity(this.$route.query.id, data => {
        this.item = data.resource
      }, err => {
        this.$notify({
          type: 'error',
          message: err.message
        })
        this.$router.go(-1)
      })
    }
  },
  methods: {
    smallUploadHandle (_this) {
      this.uploadHandle(_this, 'small_picture')
    },
    bigUploadHandle (_this) {
      this.uploadHandle(_this, 'bigPictures')
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
      if (key === 'small_picture') {
        this.uploading = true
      } else if (key === 'bigPictures') {
        this.bigUploading = true
      }
      this.$api.uploadImage(data, (data) => {
        if (this.item.hasOwnProperty(key)) {
          if (key === 'small_picture') {
            this.$set(this.item, key, data.file.id)
          } else {
            this.item[key].push(data.file.id)
          }
        }
        this.uploading = false
        this.bigUploading = false
        this.$refs['form'].validateField(key)
      }, (e) => {
        this.$message({
          type: 'error',
          message: e.message
        })
        this.uploading = false
        this.bigUploading = false
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
    },
    submit (formName) {
      this.$refs[formName].validate(valid => {
        if (valid && !this.committing) {
          this.committing = true
          if (this.item.id) {
            this.$api.updateCommodity(this.item, data => {
              this.$message({type: 'success', message: '修改成功'})
              this.committing = false
              this.$router.go(-1)
            }, err => {
              this.$message({type: 'error', message: err.message})
              this.committing = false
            })
          } else {
            this.$api.addCommodity(this.item, data => {
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
    }
  }
}
</script>

<style>
</style>
