<template>
  <div class="fj-content_view work-mis fj-leave">
    <div class="fj-block title">
      <fj-breadNav :bread-data="breadData"></fj-breadNav>
    </div>
    <div class="fj-block content">
      <div class="fj-block-head kaohe">
        <p class="title fj-fl">请假休假列表</p>
      </div>
      <div class="fj-block-body">
        <div class="fj-search-inline">
          <el-row>
            <el-form inline label-width="85px" label-position="left">
              <el-col :lg="8" :xl="7" class="time-item">
                <el-form-item label="公安局：">
                  <el-select
                    @change="changeSupDeptId"
                    clearable filterable
                    v-model="searchForm.supDeptId"
                    size="small"
                  >
                    <el-option
                      v-for="item in supDeptIds"
                      :key="item.deptId"
                      :label="item.deptName"
                      :value="item.deptId"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="申请时间：" class="datepicker">
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
              <el-col :lg="6" :xl="5">
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
                <el-form-item label="批准结果：">
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
              </el-col>
              <el-col :lg="6" :xl="6">
                <el-form-item label="输入查询：">
                  <el-input
                    v-model="searchForm.nameOrAccount"
                    clearable
                    placeholder="请输入名称或警号"
                    size="small"
                    class="search-input"
                  >
                    <el-button slot="append" @click="searchAttendLeave">搜索</el-button>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </div>
        <el-table :data="attendLeaveData">
          <el-table-column prop="userId" show-overflow-tooltip label="姓名" width="80px"></el-table-column>
          <el-table-column prop="userAccount" show-overflow-tooltip label="警号"></el-table-column>
          <el-table-column prop="leave_reason" label="请假理由" show-overflow-tooltip class-name="textLeft" width="400px"></el-table-column>
          <el-table-column label="申请时间" show-overflow-tooltip :formatter="timeFormatter" prop="apply_time">
            <!-- <template slot-scope="scope">
              <p>{{scope.row.apply_time | getFormatTime}}</p>
            </template> -->
          </el-table-column>
          <el-table-column label="请假起始时间" show-overflow-tooltip :formatter="timeFormatter" prop="start_time">

          </el-table-column>

          <el-table-column label="请假结束时间" show-overflow-tooltip :formatter="timeFormatter" prop="end_time">

          </el-table-column>

          <el-table-column label="审核状态" prop="leave_state" width="120px" >
            <template slot-scope="scope">
              <span class="circle-status" :class="scope.row.leave_state == 0 ? 'grey' : scope.row.leave_state == 1 ? 'green' : 'red'">
                  {{parseInt( scope.row.leave_state) === 0 ? '待审核' : parseInt( scope.row.leave_state) === 1 ?'已通过'
                  : '被驳回'}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="处理说明" show-overflow-tooltip width="200px" prop="leader_content" class-name="textLeft">

          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span class="ope-txt" v-if="scope.row.leave_state != 0">--</span>
              <span class="ope-txt" v-if="scope.row.leave_state == 0" @click="checkUpdate(scope.row.leaveId,1)">同意</span>
              <span class="ope-txt" v-if="scope.row.leave_state == 0" @click="openCheckDialog(scope.row.leaveId, 2)">不同意</span>
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
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 审核弹出框 -->
    <el-dialog
      :title="checkDialogTitle"
      :visible.sync="checkDialogVisible"
      :modal-append-to-body="checkDialogVisibleModal"
      style="position: absolute" width="450px"
      @close="closeDialog"
      :close-on-click-modal="false"
      top="25vh"
      class="check-dialog">
      <el-form :model="checkDialogForm" ref="checkDialogForm" inline :rules="checkRule">
        <el-form-item label="不通过理由" label-width="100px" prop="reason" >
          <el-input type="textarea"  :rows="3" placeholder="请输入不通过理由" v-model="checkDialogForm.reason" :disabled="reasonDisabled"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="checkDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateLeaveStatus(false)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import fjBreadNav from '@/components/fjBreadNav';

  export default {
    name: 'fjAttendHistory',
    data: function () {
      return {
        breadData: [
          {name: '当前位置:', path: ''},
          {name: '考勤管理', path: ''},
          {name: '请假休假', path: ''}
        ],
        nowUser: $.cookie(fjPublic.loginCookieKey),
        // 分局
        supDeptIds: null,
        // 派出所
        deptIds: null,
        // 状态
        statuses: [{
          value: '0',
          label: '待审核'
        },{
          value: '1',
          label: '已通过'
        },{
          value: '2',
          label: '被驳回'
        }],
        // 列表查询参数
        searchForm: {
          searchTime: '',         // 查询时间
          nameOrAccount: '',         // 警号或负责人名称
          deptId: '',     // 派出所
          supDeptId: '',     // 公安局
          status: ''      // 状态
        },
        // 列表数据
        attendLeaveData: [
          // {
          //   apply_time: "",
          //   end_time: "",
          //   leader_content: "",
          //   leader_name: "",
          //   leader_time: "",
          //   leaveId: "",
          //   leave_reason: "",
          //   leave_state: "",
          //   start_time: "",
          //   userId: "",
          //   userAccount: ""
          // }
        ],
        // 分页数据
        currentPage: 1,
        pageSize: 10,
        total: 0,
        // 审核弹出框数据
        checkDialogVisible: false,
        checkDialogVisibleModal:false,
        checkDialogTitle: '',
        checkDialogForm: {
          id: "",
          status: "",
          reason: ""
        },
        reasonDisabled: true,
        formLabelWidth: '120px',
        // 不批准弹出框校验
        checkRule: {
          reason: {
            required: true,
            message: '请输入不通过理由',
            trigger: 'blur'
          }
        }
      };
    },
    mounted: function () {
      // 初始化派出所下拉列表
      this.initDeptIds();
      // 初始化派出所下拉列表
      this.initSupDeptIds();
      // 初始化请假休假列表
      this.searchUserLeave();

      return;
    },
    filters: {
      // 状态处理
      getLeaveStatus: function (value) {
        return value == '0' ? '待批' : value == 1 ? '已批准' : value == 2 ? '未批准' : '';
      },
      getFormatTime: function (value) {
        // return value ? fjPublic.dateStrFormat(value) : '';
        return value ? value.substring(0, value.length - 2) : '';
      }
    },
    methods: {
      currentPageChange: function (pageNum) {  // 点击某个分页按钮
        this.currentPage = pageNum;
        this.searchUserLeave();
      },
      prevPageChange: function (pageNum) {  // 点击分页的上一页
        this.currentPage = pageNum;
        this.searchUserLeave();
      },
      nextPageChange: function (pageNum) {  // 点击分页的下一页
        this.currentPage = pageNum;
        this.searchUserLeave();
      },
      sizePageChange: function (pageSize) {  // 改变每页条数时
        this.currentPage = 1;
        this.pageSize = pageSize;
        this.searchUserLeave();
      },
      // 初始化分局
      initSupDeptIds: function () {
        var defer = $.Deferred();
        var vm = this;
        $.ajax({
          url: fjPublic.ajaxUrlDNN + '/searchDepListBySearch',
          type: 'POST',
          data: {},
          dataType: 'json',
          success: function (data) {
            vm.supDeptIds = data.list;
            defer.resolve();
          },
          error: function (err) {
            defer.reject();
          }
        });
        return defer;
      },
      // 初始化派出所
      initDeptIds: function () {
        var defer = $.Deferred();
        var vm = this;
        $.ajax({
          url: fjPublic.ajaxUrlDNN + '/searchDeptsByFenju',
          type: 'POST',
          data: {
            parentDeptId: ''
          },
          dataType: 'json',
          success: function (data) {
            vm.deptIds = data.list;
            defer.resolve();
          },
          error: function (err) {
            defer.reject();
          }
        });
        return defer;
      },
      // 修改单位下拉框查询
      changeSupDeptId: function (supDeptId) {
        this.searchForm['supDeptId'] = supDeptId;
        this.searchUserLeave();
      },
      // 修改单位下拉框查询
      changeDeptId: function (deptId) {
        this.searchForm['deptId'] = deptId;
        this.searchUserLeave();
      },
      // 修改状态下拉框查询
      changeStatus: function(status) {
        this.searchForm['status'] = status;
        this.searchUserLeave();
      },
      // 标题或负责人名称查询
      searchAttendLeave: function () {
        this.searchUserLeave();
      },
      // 修改查询时间
      changeSearchTime: function (searchTime) {
        if (searchTime) {
          this.searchForm['startTime'] = fjPublic.dateFormatYYMMDD(searchTime[0]);
          this.searchForm['endTime'] = fjPublic.dateFormatYYMMDD(searchTime[1]);
        } else {
          this.searchForm['startTime'] = '';
          this.searchForm['endTime'] = '';
        }
        this.searchUserLeave();
      },
      // 获取采集列表
      searchUserLeave: function () {
        var defer = $.Deferred();
        var vm = this;
        // 参数
        this.searchForm['page'] = this.currentPage;
        this.searchForm['rows'] = this.pageSize;
        // 传入当前用户信息
        this.searchForm['nowUser'] = this.nowUser;
        $.ajax({
          url: fjPublic.ajaxUrlDNN + '/searchUserLeave',
          type: 'POST',
          data: vm.searchForm,
          dataType: 'json',
          success: function (data) {
            vm.attendLeaveData = null;
            vm.attendLeaveData = data.list;
            vm.total = data.total;
            _.each(vm.attendLeaveData, function (item, i) {
              vm.$set(item, 'rank', i + 1);
            });
            defer.resolve();
          },
          error: function (err) {
            defer.reject();
          }
        });
        return defer;
      },
      // 打开审核弹出框
      openCheckDialog: function (id, status) {
        this.checkDialogForm["id"] = id;
        this.checkDialogForm["status"] = status;
        this.checkDialogTitle = (status == 1 ? "批准？" : "不批准？");
        this.reasonDisabled = (status == 1 ? true : false);
        this.checkDialogVisible = true;
      },
      // 确认批准直接询问并发请求
      checkUpdate(id, status) {
        this.$confirm('确认批准该条请假(休假)?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.checkDialogForm["id"] = id;
          this.checkDialogForm["status"] = status;
          this.updateLeaveStatus(true)
        })
      },
      // 保存请假批准
      updateLeaveStatus: function(isConfirm) {
        var defer = $.Deferred();
        var vm = this;
        let ajax = () => {
          $.ajax({
            url: fjPublic.ajaxUrlDNN + '/dealLeave',
            type: 'POST',
            data: vm.checkDialogForm,
            dataType: 'json',
            success: function(data){
              if(data.errorCode == 0) {
                vm.checkDialogVisible = false;
                vm.searchUserLeave();
              }
              vm.$message({
                type: 'success',
                message: data.errorMsg
              });
              defer.resolve();
            },
            error: function(err){
              defer.reject();
            }
          });
        }
        // 传入当前用户信息
        vm.checkDialogForm['nowUser'] = $.cookie(fjPublic.loginCookieKey);
        // 直接批准

        if (isConfirm) {
           ajax()
        } else {
          this.$refs.checkDialogForm.validate((validate) => {
            if (validate) {
              ajax()
            }
          })
        }
      },
      // 时间格式化
      timeFormatter (row, type) {
        let dateStr = row[type.property]
        if (!dateStr) {
            return ''
        }
        return dateStr.substr(5, 2) + '/' + dateStr.substr(8, 2)
        + ' ' + dateStr.substr(11, 2) + ':' + dateStr.substr(14, 2)
      },
      // 弹窗关闭事件
      closeDialog() {
        this.$refs.checkDialogForm.resetFields()
      }
    },
    components: {
      fjBreadNav
    }
  }
</script>
<style scope lang="less">
.fj-leave {
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
        margin:0;
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
  .textLeft {
    text-align: left;
  }
  .check-dialog {
    /deep/ .el-form-item {
      textarea {
        width: 300px;
      }
    }
  }
  /deep/ .el-table {
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
  }
}
</style>
