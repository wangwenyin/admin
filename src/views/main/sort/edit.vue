<template>
  <div id="sortEdit">
    <h2>{{item.id?'修改':'添加'}}分类</h2>
    <el-form ref="form" :rules="formRules" :model="item" label-width="120px">
      <el-form-item prop="name" label="分类名称">
        <el-input size="small" style="width:30%;" v-model="item.name" placeholder="商品名称"></el-input>
      </el-form-item>
      <el-form-item prop="sort" label="排序">
        <el-input-number :controls="false" size="small" :min="0" style="width:30%;" v-model="item.sort" placeholder="成本价"></el-input-number>
      </el-form-item>
      <el-form-item prop="enable" label="是否显示">
        <el-switch v-model="item.enable" :width="50" on-text="是" off-text="否"></el-switch>
      </el-form-item>
      <!-- <el-form-item prop="plus_code" label="单次竞拍加码数">
        <el-input-number :controls="false" size="small" :min="0" style="width:30%;" v-model="item.plus_code" placeholder="成本价"></el-input-number>
        <span style="color: #8492A6;">单次竞拍加码数为用户竞拍一次所消耗的拍币数目</span>
      </el-form-item> -->
      <el-form-item prop="items" label="已选商品">
        <el-button size="mini" type="primary" :icon="selectDialogVisible?'minus':'plus'" @click="showItemPanel"></el-button>
        <br/>
        <el-card v-for="(list,index) in itemsGroup" :key="list.id" class="card-box" :body-style="{padding: '0px'}">
          <el-table :data="list" :show-header="false" empty-text="请选择商品" :highlight-current-row="true" :stripe="true">
            <el-table-column prop="name"></el-table-column>
            <el-table-column width="66">
              <template scope="scope">
                <el-button size="small" @click='removeItem(scope.row)'>退选</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-form-item>
      <el-form-item>
        <el-button :icon="item.id?'edit':'plus'" type="primary" size="small" @click="submit('form')" :loading="committing">{{item.id?'修改':'添加'}}</el-button>
        <el-button icon="close" type="primary" size="small" @click.prevent="$router.go(-1)">取消</el-button>
      </el-form-item>
    </el-form>
    <!-- 商品选择弹出框 -->
    <el-dialog size="large" title="选择商品" :visible.sync="selectDialogVisible">
      <item-list v-if="selectDialogVisible" :visible.sync="selectDialogVisible" :ownList="item.items" @backSelection="backSelection"></item-list>
    </el-dialog>
  </div>
</template>
<script>
import itemList from './itemList'
export default {
  name: 'sortEdit',
  components: {
    itemList
  },
  data () {
    return {
      committing: false,
      item: {
        name: '',
        sort: 0,
        disable: false,
        enable: true,
        // plus_code: 0,
        items: []
      },
      query: {
        name: '',
        item_type: '',
        running_program: '',
        pageNo: 1,
        pageSize: 10
      },
      resource: {
        content: [],
        totalElements: 0
      },
      selectDialogVisible: false,
      formRules: {
        name: [
          {required: true, message: '请输入分类名称', trigger: 'blur'}
        ],
        sort: [
          {required: true, type: 'number', message: '请输入排序', trigger: 'blur'}
        ],
        // plus_code: [
        //   {required: true, type: 'number', message: '请输入排序', trigger: 'blur'}
        // ],
        enable: [
           {required: true, type: 'boolean', message: '', trigger: 'change'}
        ],
        items: [
          {required: true, type: 'array', message: '请选择商品', trigger: 'change'}
        ]
      }
    }
  },
  computed: {
    itemsGroup: function () {
      let list = []
      let sliceNum = 10
      if (!this.item.items) {
        this.$set(this.item, 'items', [])
      }
      let length = Math.ceil(this.item.items.length / sliceNum)
      for (let i = 0; i < length; i++) {
        list[i] = this.item.items.slice(i * sliceNum, (i + 1) * sliceNum)
      }
      return list
    }
  },
  created () {
    this.findRunningProgram()
    if (this.$route.query.id) {
      this.$api.getSort(this.$route.query.id, data => {
        data.resource.enable = !data.resource.disable
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
    showItemPanel () {
      this.selectDialogVisible = true
    },
    findCommoditys () {
      this.$api.findCommoditys(this.query, data => {
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
      this.findCommoditys()
    },
    pageChange (current) {
      this.query.pageNo = current
      this.findCommoditys()
    },
    submit (formName) {
      this.$refs[formName].validate(valid => {
        if (valid && !this.committing) {
          this.committing = true
          this.item.disable = !this.item.enable
          let tempItem = Object.assign({}, this.item)
          tempItem.items = []
          this.item.items.forEach(item => {
            tempItem.items.push(item.id)
          })
          if (this.item.id) {
            this.$api.updateSort(tempItem, data => {
              this.$message({type: 'success', message: '修改成功'})
              this.committing = false
              this.$router.go(-1)
            }, err => {
              this.$message({type: 'error', message: err.message})
              this.committing = false
            })
          } else {
            this.$api.addSort(tempItem, data => {
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
    findRunningProgram () {
      this.$api.getRuningProgram(data => {
        this.$globalBus.RunningPrograms = {}
        data.resource.forEach(item => {
          this.$globalBus.RunningPrograms[item.english] = item.chinese
        })
      }, err => {
        this.$message({
          type: 'error',
          message: err.message
        })
      })
    },
    backSelection (selection) {
      this.item.items.push(...selection)
    },
    removeItem (row) {
      let index = -1
      this.item.items.forEach((item, i) => {
        if (item.id === row.id) {
          index = i
        }
      })
      if (index !== -1) {
        this.item.items.splice(index, 1)
      }
    }
  }
}
</script>

<style scoped>
.card-box {
  width: 30%;
  display: inline-block;
  vertical-align: top;
}
</style>
