<template>
  <div class="fj-content_view work-mis workLog">
    <div class="fj-block title">
      <fj-breadNav :bread-data="breadData"></fj-breadNav>
    </div>
    <div class="fj-block content">
      <div class="fj-block-head kaohe">
        <p class="title fj-fl">日志列表</p>
      </div>
      <div class="fj-block-body">
        <div class="fj-search-inline">
            <el-row>
          <el-form inline label-width="85px" label-position="left">
            <el-col :lg="8" :xl="7" class="time-item">
              <el-form-item label="派出所：">
                <el-select
                  @change="changeDeptId"
                  clearable
                  filterable
                  v-model="searchForm.deptId"
                  size="small"
                >
                  <el-option
                    v-for="item in deptIds"
                    :key="item.deptId"
                    :label="item.deptName"
                    :value="item.deptId"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="起止日期：" class="datepicker">
                <el-date-picker
                  v-model="searchForm.searchTime"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="changeSearchTime"
                  size="small"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :lg="6" :xl="6">
              <el-form-item label="审核结果：">
                <el-select
                  @change="changeStatus"
                  clearable
                  v-model="searchForm.status"
                  size="small"
                >
                  <el-option
                    v-for="item in statuses"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="输入查询：">
                <el-input
                  v-model="searchForm.nameOrContentOrAccount"
                  clearable
                  placeholder="请输入名称或内容"
                  size="small"
                  class="search-input"
                >
                  <el-button slot="append" @click="searchWorkLog">搜索</el-button>
                </el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        </div>
        <el-table :data="workLogData" class="el-tables">
          <el-table-column prop="userId" label="提交人" width="90px"></el-table-column>
          <el-table-column prop="deptId" label="所属单位" show-overflow-tooltip class-name="textLeft" width="120px"></el-table-column>
          <el-table-column label="提交时间" show-overflow-tooltip :formatter="dateStrFormat" prop="insTime">
            <!-- <template slot-scope="scope">
              <p>{{scope.row.insTime | getLeadTime}}</p>
            </template> -->
          </el-table-column>
          <el-table-column prop="content" label="日志内容" show-overflow-tooltip class-name="textLeft" width="380px"></el-table-column>
          <el-table-column prop="work_date" label="工作日期" show-overflow-tooltip width="100px"></el-table-column>
          <el-table-column prop="leadId" label="审核人"></el-table-column>
          <el-table-column label="审核结果" show-overflow-tooltip prop="leadResult" width="80px">
            <template slot-scope="scope">
              <span class="circle-status" :class="scope.row.leadResult == 0 ? 'grey' : scope.row.leadResult == 1 ? 'green' : 'red'">
                  {{parseInt( scope.row.leadResult) === 0 ? '待审核' : parseInt( scope.row.leadResult) === 1 ?'已通过'
                  : '被驳回'}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="处理说明" show-overflow-tooltip prop="leadContent" >
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span
                class="ope-txt"
                @click="openAddOrDetailDialog(scope.row)"
              >{{parseInt( scope.row.leadresult) === 0 ? '审批' : '详情'}}</span>

            </template>
          </el-table-column>
        </el-table>
        <div class="mj-page_wrap">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10,20,30]"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total"
            @current-change="currentPageChange"
            @prev-click="prevPageChange"
            @next-click="nextPageChange"
            @size-change="sizePageChange"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- 添加、详情弹出框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :modal-append-to-body="false"
      :append-to-body="true"
      :lock-scroll="true"
      width="883px"
      :close-on-click-modal="false"
      top="15vh"
      @close="closeDialog"
      :before-close = "beforeClose"
      center
      class="detail-dialog workLog-dialog infoDialog"
      style="position: absolute"
    >
       <el-row slot="title" class="dialog-title">
        <el-col :offset="1" :span="23">
            <span >{{dialogTitle}}</span>
            <div
              class="title-status"
              v-if="parseInt(dialogForm.status) !== 0"
              :class="parseInt(dialogForm.status) === 2 ? 'reject' : 'resolve'">
              {{parseInt(dialogForm.status) === 2 ? '被驳回' : '已通过'}}
            </div>
        </el-col>
      </el-row>
      <el-form
        :model="dialogForm"
          ref="dialogForm"
          label-position="left"
          inline
          :rules="rule">
        <el-row>
          <el-col :offset="1" :span="22" >
            <el-form-item label="工作日期："  prop="work_date">
             {{dialogForm.work_date}}
            </el-form-item>
          </el-col>
          <el-col :span="1"></el-col>
        </el-row>
        <el-row>
          <el-col :offset="1" :span="22" >
            <el-form-item label="天气："  prop="weather">
             {{dialogForm.weather}}
            </el-form-item>
          </el-col>
          <el-col :span="1"></el-col>
        </el-row>
        <el-row>
          <el-col :offset="1" :span="22" >
            <el-form-item label="工作内容："  prop="content">
             {{dialogForm.content}}
            </el-form-item>
          </el-col>
          <el-col :span="1"></el-col>
        </el-row>
        <el-row v-if="hasImg">
          <el-col :offset="1" :span="22" >
            <el-form-item label="图片："  prop="files">
             <!-- <template v-for="(item1, index) in dialogForm.files" >
              <img v-if="item1.fileType == 1" :src="'../appgetmedia?fn=' + item1.fileName" :key="index">
            </template> -->
            <div class="img-ctn" id="userImg"  @click="addViewer">
               <template v-for="(item1, index) in dialogForm.files">
                 <img
                  alt="图片"
                  v-if="item1.fileType == 1"
                  :key="index"
                  :data-original="ajaxUrlDNN + '/appgetmedia?fn=' + item1.fileName"
                  :src="ajaxUrlDNN + '/appgetmedia?fn=' + item1.fileName"
                >
               </template>
            </div>
            </el-form-item>
          </el-col>
          <el-col :span="1"></el-col>
        </el-row>
        <el-row  v-if="hasVideo">
          <el-col :offset="1" :span="22" >
            <el-form-item label="视频："  prop="files" class="video-ctn">
              <template v-for="(item2, index) in dialogForm.files">
                <video v-if="item2.fileType == 2" :src="ajaxUrlDNN + '/appgetmedia?fn=' + item2.fileName" :key="index" controls/>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="1"></el-col>
        </el-row>
        <el-row class="reason" v-if="parseInt(dialogForm.status) !== 1">
          <el-col :offset="1" :span="22">
            <el-form-item label="驳回原因："  prop="reason">
              <el-input type="text" :rows="3"  v-model="dialogForm.reason" placeholder="驳回请输入驳回理由" v-if="parseInt(dialogForm.status) === 0"></el-input>
              <span v-else style="color:red;">
                  {{dialogForm.reason}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="1"></el-col>
        </el-row>
        <el-row class="info">
          <el-col :span="7" :offset="1" >
            <el-form-item label="提交时间：" prop="insTime" label-width="82px">
              {{dialogForm.insTime}}
            </el-form-item>
          </el-col>

          <el-col :span="7" :offset="1" >
            <el-form-item label="提交人：" prop="userId"  label-width="68px">
              {{dialogForm.userId}}
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1" >
            <el-form-item label="审核人：" prop="leadId"  label-width="82px">
              {{dialogForm.leadId}}

            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div v-if="dialogForm.status == 0" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateWorkLogStatus(1)">通 过</el-button>
        <el-button  @click="reject">驳 回</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import fjBreadNav from "@/components/fjBreadNav";
export default {
  name: "fjWorkManageMis",
  data: function() {
    const reasonValidate = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('如需驳回，驳回理由必填'))
      } else {
        callback()
      }
    }
    return {
      breadData: [
        { name: "当前位置:", path: "" },
        { name: "工作管理", path: "" },
        { name: "工作日志", path: "" }
      ],
      ajaxUrlDNN: fjPublic.ajaxUrlDNN,
      nowUser: $.cookie(fjPublic.loginCookieKey),
      // 派出所
      deptIds: null,
      // 状态
      statuses: [
        {
          value: "0",
          label: "待审核"
        },
        {
          value: "1",
          label: "通过"
        },
        {
          value: "2",
          label: "被驳回"
        }
      ],
      // 列表查询参数
      searchForm: {
        searchTime: "", // 查询时间
        nameOrContentOrAccount: "", // 警号或负责人名称
        deptId: "", // 派出所
        status: "" // 状态
      },
      // 列表数据
      workLogData: [
        // {
        //   content: "",
        //   deptId: "",
        //   insTime: "",
        //   keyNo: "",
        //   leadId: "",
        //   leadResult: "",
        //   userId: "",
        //   weather: "",
        //   work_date: ""
        // }
      ],
      // 分页数据
      currentPage: 1,
      pageSize: 10,
      total: 0,
      // 弹出框数据
      dialogVisible: false,
      dialogVisibleModal: false,
      dialogTitle: "日志详情",
      // 详情表单
      dialogForm: {
        keyNo: "",
        content: "",
        insTime: "",
        leadId: "",
        userId: "",
        weather: "",
        work_date: "",
        files: [],
        status: 0,
        reason: '',
        currentRow: {}
      },
      // 审核弹出框数据
      checkDialogVisible: false,
      checkDialogVisibleModal: false,
      checkDialogTitle: "",
      reasonDisabled: true,
      formLabelWidth: "120px",
      rule: {
        // 驳回理由
        reason: [{
          trigger: 'blur',
          validator: reasonValidate
        }]
      },
    };
  },
  mounted: function() {
    // 初始化派出所下拉列表
    this.initDeptIds();
    // 初始化采集列表
    this.infoWorkLog();
    return;
  },
  filters: {
    // 状态处理
    getLeadResultName: function(value) {
      return value == 0
        ? "待批"
        : value == 1
        ? "通过"
        : value == 2
        ? "被驳回"
        : "";
    },
    getLeadTime: function(value) {
      return value ? fjPublic.dateStrFormat(value) : "";
    }
  },
  methods: {
    currentPageChange: function(pageNum) {
      // 点击某个分页按钮
      this.currentPage = pageNum;
      this.infoWorkLog();
    },
    prevPageChange: function(pageNum) {
      // 点击分页的上一页
      this.currentPage = pageNum;
      this.infoWorkLog();
    },
    nextPageChange: function(pageNum) {
      // 点击分页的下一页
      this.currentPage = pageNum;
      this.infoWorkLog();
    },
    sizePageChange: function(pageSize) {
      // 改变每页条数时
      this.currentPage = 1;
      this.pageSize = pageSize;
      this.infoWorkLog();
    },
    // 初始化派出所
    initDeptIds: function() {
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/searchDeptsByFenju",
        type: "POST",
        data: {
          parentDeptId: ""
        },
        dataType: "json",
        success: function(data) {
          vm.deptIds = data.list;
          defer.resolve();
        },
        error: function(err) {
          defer.reject();
        }
      });
      return defer;
    },
    // 修改单位下拉框查询
    changeDeptId: function(deptId) {
      this.searchForm["deptId"] = deptId;
      this.infoWorkLog();
    },
    // 修改状态下拉框查询
    changeStatus: function(status) {
      this.searchForm["status"] = status;
      this.infoWorkLog();
    },
    // 标题或负责人名称查询
    searchWorkLog: function(missionState) {
      this.infoWorkLog();
    },
    // 修改查询时间
    changeSearchTime: function(searchTime) {
      if (searchTime) {
        this.searchForm["startTime"] = fjPublic.dateFormatYYMMDD(searchTime[0]);
        this.searchForm["endTime"] = fjPublic.dateFormatYYMMDD(searchTime[1]);
      } else {
        this.searchForm["startTime"] = "";
        this.searchForm["endTime"] = "";
      }
      this.infoWorkLog();
    },
    // 导出工作日志
    exportWorkLog: function() {
      document.forms["formExcle"].submit();
    },
    // 获取采集列表
    infoWorkLog: function() {
      var defer = $.Deferred();
      var vm = this;
      // 参数
      this.searchForm["page"] = this.currentPage;
      this.searchForm["rows"] = this.pageSize;
      // 传入当前用户信息
      this.searchForm["nowUser"] = $.cookie(fjPublic.loginCookieKey);
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/infoWorkLog",
        type: "POST",
        data: vm.searchForm,
        dataType: "json",
        success: function(data) {
          vm.workLogData = null;
          vm.workLogData = data.list;
          vm.total = data.total;
          _.each(vm.workLogData, function(item, i) {
            vm.$set(item, "rank", i + 1);
          });
          defer.resolve();
        },
        error: function(err) {
          defer.reject();
        }
      });
      return defer;
    },
    // 打开添加或详情弹出框
    openAddOrDetailDialog: function(workLog) {
      // 详情
      var defer = $.Deferred();
      var vm = this;
      vm.dialogForm.keyNo = workLog.keyNo;
      vm.dialogForm.userId = workLog.userId;
      vm.dialogForm.insTime = fjPublic.dateStrFormat(workLog.insTime)
      vm.dialogForm.content = workLog.content;
      vm.dialogForm.leadId = workLog.leadId;
      vm.dialogForm.weather = workLog.weather;
      vm.dialogForm.work_date = workLog.work_date;
      vm.dialogForm.status = workLog.leadResult
      vm.dialogForm.reason = workLog.leadContent
      // 储存当前行数据
      vm.dialogForm.currentRow = workLog
      vm.dialogForm.files = []
      const loading = this.$loading({
        lock: true,
        text: '正在加载数据',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/getWorkLogFiles",
        type: "POST",
        data: {
          id: workLog.keyNo
        },
        dataType: "json",
        success: function(data) {
          vm.dialogForm.files = data;
          loading.close()
          // 显示弹出框
          vm.dialogVisible = true;
          if (vm.viewer) {
            vm.viewer.showing = false
            vm.viewer.destroy()
          }

          vm.$nextTick(() => {
            vm.viewer = new viewer(document.getElementById('userImg'),{
              url:'data-original'
            })
            vm.viewer.update()
          })

          defer.resolve();
        },
        error: function(err) {
          loading.close()
          defer.reject();
        }
      });

    },
    // 驳回
    reject() {
      this.$refs.dialogForm.validate((validate) => {
        if (validate) {
          this.dialogForm.status = 2
          this.updateWorkLogStatus()
        }
      })
    },
    // 保存日志内容
    updateWorkLogStatus: function(status) {
      var defer = $.Deferred();
      var vm = this;
      // 传入当前用户信息
      if (status) {
        this.dialogForm.status = status
      }
      let json = {
        nowUser: $.cookie(fjPublic.loginCookieKey),
        id: this.dialogForm.keyNo,
        reason: this.dialogForm.reason,
        status: this.dialogForm.status
      }
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/updateWorkLogStatus",
        type: "POST",
        data: json,
        dataType: "json",
        success: function(data) {
          if (data.errorCode == 0) {
            vm.dialogVisible = false;
            vm.infoWorkLog();
          }
          vm.$message({
            type: "success",
            message: data.errorMsg
          });
          defer.resolve();
        },
        error: function(err) {
          defer.reject();
        }
      });
    },
    dateStrFormat (row) {
        let dateStr = row.insTime
        if (!dateStr) {
            return ''
        }
        return dateStr.substr(4, 2) + '/' + dateStr.substr(6, 2)
        + ' ' + dateStr.substr(8, 2) + ':' + dateStr.substr(10, 2)
    },
    // 弹窗关闭事件
    closeDialog() {
      this.$refs.dialogForm.clearValidate()
      this.dialogForm.reason = ''
      if (this.viewer) {
        this.viewer.showing = false
        this.viewer.destroy()
      }

    },
    beforeClose(done) {
      if (!(this.viewer && this.viewer.isShown)) {
        done()
      }
    },
    // 查看大图
    addViewer() {
      if (this.viewer) {
        this.viewer.show()
      }

    }
  },
  computed: {
    // 是否未审批状态
    isDisabled() {
      return (parseInt(this.dialogForm.status) !== 0)
    },
    hasVideo() {
      var val = false
      this.dialogForm.files.forEach((item) => {
        if (parseInt(item.fileType) === 2) {
          val = true
        }
      })
      return val
    },
    hasImg() {
      var val = false
      this.dialogForm.files.forEach((item) => {
        if (parseInt(item.fileType) === 1) {
          val = true
        }
      })
      return val
    }
  },
  beforeDestroy() {
    if (vm.viewer) {
      vm.viewer.showing = false
      vm.viewer.destroy()
    }
  },
  components: {
    fjBreadNav
  }
};
</script>
<style scope lang="less">
.workLog {
  .fj-search-inline {
    // 上下间距
    @media screen and (max-width: 1366px){
      .el-form-item__label {
        line-height: 20px;
      }
    }
    /deep/ .el-row {
      .time-item {
        .el-form-item {
          .el-input {
            width: 350px;
          }
        }
      }
      .el-form-item {
        margin: 0;
        &:first-child {
          margin: 15px 0;
        }
         &:last-child {
          margin-bottom: 15px;
        }
        &.datepicker {
          .el-form-item__content {
            line-height: 43px;
          }
        }
        .search-input {
          width: 260px;
          .el-input-group__append {
            background-color: #1890ff;
            border-color: #1890ff;
            color: #fff;
          }
        }
      }
    }
  }
  .el-tables {
    .circle-status{
      position: relative;
      &.red {
        &::before {
          background: #F5222D;
        }
      }
      &.green {
        &::before {
          background: #52C41A;
        }
      }
      &.grey {
        &::before {
          background: #ABABAB;
        }
      }
      &::before{
        display: block;
        position: absolute;
        content: '';
        width:6px;
        height:6px;
        background:rgba(171,171,171,1);
        border-radius:50%;
        opacity:1;
        top: 5px;
        left: -9px
      }
    }
    /deep/ .textLeft {
      text-align: left;
    }
  }
  .check-dialog {
    /deep/ .el-form-item {
      textarea {
        width: 300px;
      }
    }
  }
  .detail-dialog {
    /deep/ .el-form-item {
      .el-textarea {
        textarea{
          width: 240px;
        }
      }
    }
  }
}
</style>


