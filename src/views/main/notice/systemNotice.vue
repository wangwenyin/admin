<template>
  <div id="carousel">
    <h2>系统通知</h2>
    <div>
      <div style="width: 40.6%;display: inline-block;">
        <el-card>
          <div slot="header" class="clearfix">
            <span style="line-height: 36px;">通知</span>
            <el-button style="float: right;" type="text" @click="refresh">刷新</el-button>
          </div>
         <el-table
          :highlight-current-row="true"
          :data="resource.content"
          @current-change="currentChange"
          :show-header="false"
          style="width: 100%">
          <el-table-column
            prop="title"
            label="标题">
          </el-table-column>
          <el-table-column
            prop="time"
            label="状态">
            <template scope="scope">
              <div>
                <span :class="{stateClass: scope.row.state === 'UNREAD'}">
                  {{$const.NOTICE_STATE[scope.row.state]}}
                </span>
              </div>
              <div>
                {{$filter.date(scope.row.time)}}
              </div>
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
        </el-card>
      </div>
      <div v-if="sleItem.id" style="width: 58.6%;display: inline-block;vertical-align: top;">
        <el-card>
          <div slot="header">
            <span style="line-height: 36px;" v-text="sleItem.title">通知内容</span>
            <div style="float: right;line-height: 36px;">
              <i class="el-icon-time"></i>
              <span v-text="$filter.date(sleItem.time)"></span>
            </div>
          </div>
          <p v-html="sleItem.context">
          </p>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'noticeList',
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
      sleItem: {}
    }
  },
  created () {
    this.findSystemNotice()
  },
  methods: {
    findSystemNotice () {
      this.$api.findSystemNotice(this.query, this.findSuccess, this.findFailure)
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
      this.findSystemNotice()
    },
    currentChange (currentRow, oldCurrentRow) {
      if (!currentRow) {
        return
      }
      this.sleItem = currentRow
      if (currentRow.state === 'UNREAD') {
        this.$api.systemNoticeRead(currentRow.id, data => {
          this.$set(currentRow, 'state', 'READ')
        }, err => {
          this.$notify({
            type: 'error',
            message: err.message
          })
        })
      }
    },
    refresh () {
      this.query.pageNo = 1
      this.findSystemNotice()
    }
  }
}
</script>

<style>
.current-row td {
  background-color: #2db7f5!important;
  color: #fff;
}
.stateClass {
    padding: 0 4px;
    background-color: #ed3f14;
    text-align: center;
    border-radius: 10px;
    color: #fff;
  }
</style>
