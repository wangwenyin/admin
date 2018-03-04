<template>
  <el-dialog v-model="show" size="small" :close-on-click-modal='false'>
    <template v-if="!isAdd">
      <span slot="title">个人通知</span>
      <el-button size="small" @click="showsubmit">添加通知</el-button>
      <el-table :data="resource.content" border>
        <el-table-column label="标题" prop="title">
        </el-table-column>
        <el-table-column label="内容" prop="context">
        </el-table-column>
        <el-table-column label="状态" prop="state">
          <template scope="scope">
            <span>{{$const.NOTICE_STATE[scope.row.state]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="时间" prop="time">
          <template scope="scope">
            <span>{{$filter.date(scope.row.time)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button size="small" :loading="deleting" @click="deleteNotice(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="pageChange" :current-page="query.pageNo" :page-size="query.pageSize" layout="total, prev, pager, next, jumper"
        :total="resource.totalElements">
      </el-pagination>
    </template>
    <template v-else>
      <span slot="title">添加通知</span>
      <el-form ref="form" :model="formData" :rules="rules" label-width="70px">
        <el-form-item prop="title" label="标题">
          <el-input size="small" v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item prop="context" label="内容">
          <el-input type="textarea" size="small" v-model="formData.context"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: center;">
        <el-button size="small" :loading="submiting" @click="submit('form')">确定</el-button>
        <el-button size="small" @click="isAdd = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
  export default {
    name: 'notice',
    props: {
      currentView: String,
      visiable: {
        type: Boolean,
        default: false
      },
      item: {
        type: Object,
        default: {}
      }
    },
    computed: {
      show: {
        get: function () {
          return this.visiable
        },
        set: function (val) {
          if (!val) {
            this.$emit('update:visiable', false)
            this.$emit('update:currentView', '')
          }
        }
      }
    },
    data () {
      return {
        formData: {
          userId: '',
          title: '',
          context: ''
        },
        deleting: false,
        isAdd: false,
        submiting: false,
        query: {
          userId: '',
          pageNo: 1,
          pageSize: 10
        },
        resource: {
          content: [],
          totalElements: 0
        },
        rules: {
          title: [{
            required: true,
            message: '请输入标题',
            trigger: 'blur'
          }],
          context: [{
            required: true,
            message: '请输入内容',
            trigger: 'blur'
          }]
        }
      }
    },
    created () {
      this.query.userId = this.item.id
      this.findUserNotices()
    },
    methods: {
      findUserNotices () {
        this.$api.findUserNotices(this.query, data => {
          this.resource = data.resource
        }, err => {
          this.$notify({
            type: 'error',
            message: err.message
          })
        })
      },
      pageChange (current) {
        this.query.pageNo = current
        this.findUserNotices()
      },
      deleteNotice (index, row) {
        if (this.deleting) {
          return
        }
        this.deleting = true
        this.$api.deleteNotice(row.id, data => {
          this.findUserNotices()
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.deleting = false
        }, err => {
          this.deleting = false
          this.$message({
            type: 'error',
            message: err.message
          })
        })
      },
      showsubmit () {
        this.isAdd = true
        this.$nextTick(() => {
          this.$refs['form'].resetFields()
          this.formData.title = ''
          this.formData.context = ''
          this.formData.userId = this.query.userId
        })
      },
      submit (formName) {
        this.$refs[formName].validate(valid => {
          if (valid && !this.submiting) {
            this.$api.addPersonalNotice(this.formData, data => {
              this.$message({
                type: 'success',
                message: '添加成功'
              })
              this.findUserNotices()
              this.submiting = false
              this.isAdd = false
            }, err => {
              this.submiting = false
              this.$message({
                type: 'error',
                message: err.message
              })
            })
          }
        })
      }
    }
  }

</script>

<style>


</style>
