<template>
  <div id="carousel">
    <h2>版本更新管理</h2>
    <!-- 数据表格 -->
    <el-table
      :data="resource"
      border
      >
      <el-table-column 
        label="平台"
        prop="platform">
      </el-table-column>
      <el-table-column 
        label="版本"
        prop="version"
        min-width="90">
      </el-table-column>
      <el-table-column 
        label="地址"
        prop="path"
        min-width="400" width='400'>
      </el-table-column>
      <el-table-column 
        label="强制更新"
        prop="forceUp"
        min-width="100">
       <template scope="scope">
       	{{scope.row.forceUp?'是':'否'}}
             
        </template>
      </el-table-column>
      <el-table-column 
        label="采用cdn"
        prop="isCdn"
        min-width="90">
        <template scope="scope">
        	{{scope.row.isCdn?'是':'否'}}
        </template>
      </el-table-column>
      <el-table-column 
        label="更新说明"
        prop="description"
        min-width="400" width='400'>
      </el-table-column>
      <el-table-column
        label="操作" width="80">
        <template scope="scope">
          <el-button :plain="true" type="primary" size="mini" @click="editItem(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
   

    <!-- 编辑弹出框 -->
    <el-dialog :visible.sync="editDialogVisible">
      <span slot="title">更新配置</span>
          <el-form ref="editForm" :model="formModel" :rules="editFormRules" label-width="70px">
            <el-form-item prop="platform" label="平台">
              <el-input size="small" v-model="formModel.platform" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item prop="version" label="版本">
              <el-input size="small" v-model="formModel.version"></el-input>
            </el-form-item>

            <el-form-item prop="path" label="更新地址">
              <el-input size="small" v-model="formModel.path"></el-input>
            </el-form-item>

            <el-form-item prop="forceUp" label="强制更新">
              <el-switch 
                :width="75"
                v-model="formModel.forceUp"
                on-text="是" 
                off-text="否" 
                >
              </el-switch>
            </el-form-item>

            <el-form-item prop="description" label="更新内容">
              <el-input type="textarea" size="small" v-model="formModel.description"></el-input>
            </el-form-item>

            <el-form-item prop="isCdn" label="用CDN">
              <el-switch 
                :width="75"
                v-model="formModel.isCdn"
                on-text="是" 
                off-text="否" 
                >
              </el-switch>
            </el-form-item>
            <el-input type="hidden" size="small" v-model="formModel.id"></el-input>
          </el-form>
          <div style="text-align: center;">
            <el-button size="small" :loading="editting" @click="saveAppInfo('editForm')">确定</el-button>
            <el-button size="small" @click="editDialogVisible = false">取消</el-button>
          </div>
      </el-form>
    </el-dialog>


  </div>
</template>

<script>
export default {
  name: 'noticeList',
  data () {
    return {
      query: {
       
      },
      resource:[],
      formModel: {
        platform: '',
        version: '',
        path: '',
        forceUp:false,
        isCdn:false,
        id:0,
        descripiton:''
      },
      editDialogVisible: false,
      editting: false,
      editFormRules: {
        version: [
          { required: true, message: '请输入版本号', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入更新地址', trigger: 'blur' }
        ]
      },
      showDialogVisiable: false,
      sleItem: {}
    }
  },
  created () {
    this.appinfo()
  },
  methods: {
    appinfo () {
      this.$api.appinfo(this.query, this.findSuccess, this.findFailure)
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
    	console.log(row)
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
    saveAppInfo (formName) {
      this.$refs[formName].validate(valid => {
        if (valid && !this.editting) {
          this.editting = true
          if (this.formModel.id) {
            this.$api.saveAppInfo(this.formModel, data => {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.appinfo()
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
