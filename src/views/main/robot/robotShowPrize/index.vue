<template>
  <div id="robotShowPrize">
    <h2>机器人未晒单中奖记录</h2>
    <div>
      <el-form :model="query" inline>
        <el-form-item>
          <el-input size="small" v-model="query.username" placeholder="中奖人"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input size="small" v-model="query.itemName" placeholder="商品名称"></el-input>
        </el-form-item>
<!--        <el-form-item label="中奖时间">
          <el-date-picker
            size="small"
            v-model="startTime"
            type="date"
            format="yyyy-MM-dd"
            @change="dateHandel($event,'startTime')"
            placeholder="选择开始日期">
          </el-date-picker>
          -
          <el-date-picker
            size="small"
            v-model="endTime"
            type="date"
            format="yyyy-MM-dd"
            @change="dateHandel($event,'endTime')"
            placeholder="选择结束日期">
          </el-date-picker>
        </el-form-item>-->
         <el-form-item >
          <el-button icon="search" type="primary" size="small" native-type="submit" @click.prevent="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 数据表格 -->
    <el-table
      :data="resource.content"
      border
      >
      <el-table-column
        label="商品名称"
        prop="itemName">
      </el-table-column>
      <el-table-column
        label="中奖时间"
        prop="time">
        <template scope="scope">
          <span>{{$filter.date(scope.row.time)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="中奖人"
        prop="name">
      </el-table-column>
      <el-table-column
        label="操作"
        width="120">
        <template scope="scope">
          <el-button :plain="true" type="primary" size="mini" style="margin-left: 0;" @click="show(scope.$index, scope.row)">晒单</el-button>
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
    <!-- 弹出框 -->
    <el-dialog v-model="dialogVisiable" size="small" :close-on-click-modal='false'>
      <span slot="title">添加晒单</span>
        <el-form ref="showForm" :model="item" :rules="showRules" label-width="70px">
          <el-form-item prop="title" label="标题">
            <el-input size="small" v-model="item.title"></el-input>
          </el-form-item>
          <el-form-item prop="context" label="内容">
            <el-input type="textarea" size="small" v-model="item.context"></el-input>
          </el-form-item>
          <el-form-item prop="grade" label="评分">
            <el-rate v-model="item.grade"></el-rate>
          </el-form-item>
          <el-form-item prop="pictureList" label="图片">
            <div class="picture-uploader-list-item" v-for="(img, index) in item.pictureList" :key="img">
              <img class="picture-uploader-list-item-img" :src="$api.file.see(img)">
              <span class="picture-uploader-list-item-action">
                <span class="picture-uploader-list-item-preview" @click="showBigImg(img)">
                  <i class="el-icon-view"></i>
                </span>
                <span class="picture-uploader-list-item-remove" @click.stop.prevent="item.pictureList.splice(index, 1)">
                  <i class="el-icon-delete2"></i>
                </span>
              </span>
            </div>
            <el-upload
                v-if="item.pictureList.length < 3"
                style="display:inline-block;"
                class="picture-uploader"
                action=""
                accept="image/*"
                multiple
                :show-file-list="false"
                :data="{
                  type: 'IMAGE'
                }"
                :disabled="uploading"
                :http-request="uploadHandle">
                <i class="picture-uploader-icon" :class="uploading?'el-icon-loading':'el-icon-plus'"></i>
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <div style="text-align: center;">
          <el-button size="small" :loading="committing" @click="addSealedBeforeShow('showForm')">确定</el-button>
          <el-button size="small" @click="dialogVisiable = false">取消</el-button>
        </div>
    </el-dialog>
    <!-- 查看大图 -->
    <el-dialog v-model="imgDialogVisiable" size="tiny">
      <img width="100%" v-for="item in dialogImages" :key="item" :src="$api.file.see(item)" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'robotShowPrize',
  data () {
    return {
      committing: false,
      query: {
        username: '',
        itemName: '',
        startTime: '',
        endTime: '',
        pageNo: 1,
        pageSize: 10
      },
      startTime: '',
      endTime: '',
      resource: {
        content: [],
        totalElements: 0
      },
      dialogVisiable: false,
      item: {
        sealedId: '',
        title: '',
        context: '',
        grade: 5,
        pictureList: []
      },
      uploading: false,
      showRules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        context: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      },
      imgDialogVisiable: false,
      dialogImages: []
    }
  },
  created () {
    this.findSealedBeforeShow()
  },
  methods: {
    findSealedBeforeShow () {
      this.$api.findSealedBeforeShow(this.query, data => {
        this.resource = data.resource
      }, err => {
        this.$notify({
          type: 'error',
          message: err.message
        })
      })
    },
    search () {
      this.query.pageNo = 1
      this.findSealedBeforeShow()
    },
    pageChange (current) {
      this.query.pageNo = current
      this.findSealedBeforeShow()
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
        this.item['pictureList'].push(data.file.id)
        this.uploading = false
      }, (e) => {
        this.$message({
          type: 'error',
          message: e.message
        })
        this.uploading = false
      })
    },
    dateHandel (value, name) {
      if (value && name === 'startTime') {
        this.query[name] = value + ' 00:00:00'
      } else if (value && name === 'endTime') {
        this.query[name] = value + ' 23:59:59'
      } else {
        this.query[name] = ''
      }
    },
    show (index, row) {
      this.dialogVisiable = true
      this.$nextTick(() => {
        this.$refs['showForm'].resetFields()
        this.item.sealedId = row.id
      })
    },
    addSealedBeforeShow (formNmae) {
      this.$refs[formNmae].validate(valid => {
        if (valid && !this.committing) {
          this.$api.addSealedBeforeShow(this.item, data => {
            this.findSealedBeforeShow()
            this.$message({
              type: 'success',
              message: '晒单成功'
            })
            this.committing = false
            this.dialogVisiable = false
          }, err => {
            this.$message({
              type: 'success',
              message: err.message
            })
            this.committing = false
          })
        }
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
    }
  }
}
</script>

<style>

</style>

