<template>
  <div class="turntable">
    <h2>不中包赔配置</h2>
    <br/>
    <div>
      <span>设置不中包赔商品:</span>
      <el-button type="primary" size="small" @click="showSelect = true">修改</el-button>
      <div >
        <!-- 弹出框 -->
        <el-dialog v-model="showSelect" size="large" :close-on-click-modal='false'>
          <selectItem @selItem="selItem"></selectItem>
        </el-dialog>
        <!-- 已选商品 -->
        <div>
        <el-table
          :data="item"
          border
          >
          <el-table-column
            label="Id"
            prop="id">
          </el-table-column>
          <el-table-column
            label="商品名称"
            prop="name">
          </el-table-column>
          <el-table-column
            label="商品类型"
            prop="item_type">
          </el-table-column>
          <el-table-column
            label="市场价"
            prop="price">
          </el-table-column>
          <el-table-column
            label="商品小图"
            prop="small_picture"
            width="170">
            <template scope="scope">
              <img style="width:130px;height:100px;" :src="$api.file.see(scope.row.small_picture)">
            </template>
          </el-table-column>
          <el-table-column
            label="成本价"
            prop="cost">
          </el-table-column>
          <el-table-column
            label="是否实物"
            prop="in_kind">
            <template scope="scope">
              <span v-text="scope.row.in_kind?'是':'否'"></span>
            </template>
          </el-table-column>
          <el-table-column
            label="票数控线"
            prop="control_line">
          </el-table-column>
          <el-table-column
            label="是否前端展示"
            prop="front_show"
            min-width="80">
            <template scope="scope">
              <span>{{scope.row.front_show ? '是': '否'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="是否新手商品"
            prop="novice"
            min-width="80">
            <template scope="scope">
              <span>{{scope.row.novice ? '是': '否'}}</span>
            </template>
          </el-table-column>
        </el-table>
        </div>
      </div>
    </div>
    <br/>
    <br/>
    <div>
      <span>不中包赔额度:&nbsp;&nbsp;</span>
      <div style="display: inline-block;vertical-align: top;">
        <table>
          <tr v-for="(item, index) in list" :key="index">
            <td>
              连拍:<el-input-number style="width: 80px;" v-model="item.chance" size="small" :min="2" :step="1" :disabled="!isUpdate" :controls="false"></el-input-number>
            </td>
            <td>
              赔:<el-input-number style="width: 80px;" v-model="item.give" size="small" :min="1" :step="1" :disabled="!isUpdate" :controls="false"></el-input-number>
            </td>
            <td>
              <el-button type="danger" size="small" v-if="isUpdate" @click="delItem(item, index)">删除</el-button>
            </td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td><el-button type="primary" size="small" v-if="isUpdate" @click="addItem">添加</el-button></td>
          </tr>
        </table>
        <div :style="{'margin-top': isUpdate ? '30px': '0'}">
          <template v-if="isUpdate">
            <el-button type="warning" size="small" :loading="setting" @click="setCompensationLimits">保存</el-button>
            <el-button type="danger" size="small" @click="cancelUpdate">取消</el-button>
          </template>
          <template v-else>
            <el-button type="primary" size="small" @click="setCompensationLimits">修改</el-button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import selectItem from './selectItem.vue'
export default {
  name: 'setcompensation',
  components: {
    selectItem
  },
  data () {
    return {
      query: {
        pageNo: 1,
        pageSize: 10
      },
      item: [],
      isUpdate: false,
      updateing: false,
      list: [],
      oldList: [],
      setting: false,
      showSelect: false
    }
  },
  created () {
    this.getCompensationItem()
    this.getCompensationLimits()
  },
  methods: {
    selItem (row) {
      this.showSelect = false
      this.getCompensationItem()
    },
    getCompensationItem () {
      this.$api.getCompensationItem(null, data => {
        this.item = data.resource ? [data.resource] : []
      }, err => {
        this.$notify({
          type: 'error',
          message: err.message
        })
      })
    },
    getCompensationLimits () {
      this.$api.getCompensationLimits(null, data => {
        this.list = data.resource
        this.oldList = [].concat(data.resource)
      }, err => {
        this.$notify({
          type: 'error',
          message: err.message
        })
      })
    },
    addItem () {
      this.list.push({chance: 2, give: 1})
    },
    delItem (item, index) {
      this.list.splice(index, 1)
    },
    cancelUpdate () {
      this.list = [].concat(this.oldList)
      this.isUpdate = false
    },
    setCompensationLimits () {
      if (this.isUpdate) {
        if (this.list.length === 0) {
          return
        }
        if (this.setting) {
          return
        }
        this.setting = true
        let list = []
        this.list.forEach(item => {
          list.push(JSON.stringify(item))
        })
        this.$api.setCompensationLimits(list, data => {
          this.setting = false
          this.isUpdate = false
          this.$message({
            type: 'success',
            message: '保存成功'
          })
        }, err => {
          this.setting = false
          this.$message({
            type: 'error',
            message: '保存失败' + err.message
          })
        })
      } else {
        this.oldList = [].concat(this.list)
        this.isUpdate = true
      }
    }
  }
}
</script>

<style>

</style>
