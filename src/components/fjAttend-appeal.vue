<template>
  <div class="fj-content_view work-mis fj-appeal">
    <div class="fj-block title">
      <fj-breadNav :bread-data="breadData"></fj-breadNav>
    </div>
    <div class="fj-block content">
      <div class="fj-block-head kaohe">
        <p class="title fj-fl">考勤申诉列表</p>
      </div>
      <div class="fj-block-body">
        <div class="fj-search-inline">
          <el-row>
            <el-form inline label-width="85px" label-position="left">
              <el-col :lg="8" :xl="7" class="time-item">
                <el-form-item label="区县分局："> <!--changeSupDeptId -->
                  <el-select
                    @change="getPCSdataById"
                    clearable
                    filterable
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

                <el-form-item label="申诉时间：" class="datepicker">
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
                <el-form-item label="处理结果：">
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
              <el-col :xs="8" :sm="12" :md="16" :lg="6" :xl="6">
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
        <el-table :data="attendAppealData">
          <el-table-column prop="userName" label="姓名"></el-table-column>
          <el-table-column prop="userAccount" label="警号"></el-table-column>
          <el-table-column label="异常日期" prop="signTime">
            <!-- <template slot-scope="scope">
              <p>{{scope.row.signTime | getExceptionTime}}</p>
            </template>-->
          </el-table-column>
          <el-table-column label="申诉类型">
            <template slot-scope="scope">
              <p>{{scope.row.signType | getSignType}}</p>
            </template>
          </el-table-column>
          <el-table-column label="申诉时间" :formatter="timeFormatter" prop="exception_time">
            <!-- <template slot-scope="scope" prop="exception_time">
              <p>{{scope.row.exception_time | getFormatTime}}</p>
            </template>-->
          </el-table-column>
          <el-table-column
            prop="remark"
            label="情况说明"
            width="350px"
            show-overflow-tooltip
            class-name="textLeft"
          ></el-table-column>
          <el-table-column label="处理结果" width="80px">
            <template slot-scope="scope">
              <span
                class="circle-status"
                :class="scope.row.result == 0 ? 'grey' : scope.row.result == 1 ? 'green' : 'red'"
              >
                {{parseInt( scope.row.result) === 0 ? '待审批' : parseInt( scope.row.result) === 1 ?'已通过'
                : '被驳回'}}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="content"
            label="处理说明"
            width="300px"
            show-overflow-tooltip
            class-name="textLeft"
          ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span class="ope-txt" v-if="scope.row.result != 0">--</span>
              <span
                class="ope-txt"
                v-if="scope.row.result == 0"
                @click="checkUpdate(scope.row.exceptionid, 1)"
              >同意</span>
              <span
                class="ope-txt"
                v-if="scope.row.result == 0"
                @click="openCheckDialog(scope.row.exceptionid, 2)"
              >不同意</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="mj-page_wrap">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10,20,30]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @current-change="currentPageChange"
            @prev-click="prevPageChange"
            @next-click="nextPageChange"
            @size-change="sizePageChange"
            v-if="total > 0"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- 审核弹出框 -->
    <el-dialog
      :title="checkDialogTitle"
      :visible.sync="checkDialogVisible"
      :modal-append-to-body="checkDialogVisibleModal"
      :closeOnClickModal="false"
      style="position: absolute"
      width="450px"
      class="check-dialog"
      :close-on-click-modal="false"
    >
      <el-form :model="checkDialogForm" ref="checkDialogForm" :rules="checkRule">
        <el-form-item label="不同意理由" label-width="100px" prop="reason">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入不同意理由"
            v-model="checkDialogForm.reason"
            :disabled="reasonDisabled"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="checkDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateAppealStatus">确 定</el-button>
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
          {name: '考勤申诉', path: ''}
        ],
        nowUser: $.cookie(fjPublic.loginCookieKey),
        // 分局
        supDeptIds: null,
        // 派出所
        deptIds: null,
        // 状态
        statuses: [{
          value: '0',
          label: '待审批'
        },{
          value: '1',
          label: '申诉成功'
        },{
          value: '2',
          label: '申诉失败'
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
        attendAppealData: [{
          content: "",
          exception_time: "",
          exceptionid: "",
          remark: "",
          result: "",
          signTime: "",
          signType: "",
          userId: "",
          userName: "",
          userAccount: ""
        }],
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
      //this.initDeptIds();
      // 初始化派出所下拉列表
      this.initSupDeptIds();
      // 初始化请假休假列表
      this.searchSign();
      // 初始化时间
      // this.initTime()
      return;
    },
    filters: {
      // 状态处理
      getLeaveStatus: function (value) {
        return value == '0' ? '待处理' : value == 1 ? '申诉成功' : value == 2 ? '申诉失败' : '';
      },
      getFormatTime: function (value) {
        // return value ? fjPublic.dateStrFormat(value) : '';
        return value ? value.substring(0, value.length - 2) : '';
      },
      getExceptionTime: function (value) {
        // return value ? fjPublic.dateStrFormat(value) : '';
        return value ? value.substring(0, value.length - 11) : '';
      },
      getSignType: function (value) {
        return value == '1' ? '上班未签到' : value == 2 ? '下班未签退' : '';
      }
    },
    methods: {
      /* 0314修改 */
      getPCSdataById:function(id){ //根据分局id获取派出所数据
        if(!id){ //清空的时候，清除对应派出所数据
            this.searchForm.deptId = '';
            this.deptIds.splice(0,this.deptIds.length);
            this.currentPage = 1;
            this.searchSign();
            return;
        }
        fjPublic.openLoad('部门切换中...');
        var defer = $.Deferred();
        var vm = this;
        $.ajax({  
          url:fjPublic.ajaxUrlDNN + '/searchDeptsByFenju',
          type:'POST',
          data:{
            parentDeptId:this.searchForm.supDeptId  //根据分局id
          },
          dataType:'json',
          success:function(data){
            fjPublic.closeLoad();
            //console.log(data);
            vm.deptIds = null;
            vm.deptIds = data.list;
            defer.resolve();
          },
          error:function(err){
            fjPublic.closeLoad();
            vm.$message({type:'warning',message:'获取对应分局的派出所数据失败'});
            defer.reject();
          }
        });
			  return defer;
      },
      // 初始化时间为今天
      initTime () {
        let date = new Date()
        let y = date.getFullYear()
        let m = date.getMonth() + 1
        let d = date.getDate()
        let time = y + '-' + m + '-' + d
        this.searchForm.searchTime = [time, time]
      },
      currentPageChange: function (pageNum) {  // 点击某个分页按钮
        this.currentPage = pageNum;
        this.searchSign();
      },
      prevPageChange: function (pageNum) {  // 点击分页的上一页
        this.currentPage = pageNum;
        this.searchSign();
      },
      nextPageChange: function (pageNum) {  // 点击分页的下一页
        this.currentPage = pageNum;
        this.searchSign();
      },
      sizePageChange: function (pageSize) {  // 改变每页条数时
        this.currentPage = 1;
        this.pageSize = pageSize;
        this.searchSign();
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
            //console.log(data.list);
            vm.supDeptIds = _.filter(data.list,function(item){
              return item.deptId != fjPublic.cityInfos.deptId;
            });
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
        this.searchSign();
      },
      // 修改单位下拉框查询
      changeDeptId: function (deptId) {
        this.searchForm['deptId'] = deptId;
        this.searchSign();
      },
      // 修改状态下拉框查询
      changeStatus: function(status) {
        this.searchForm['status'] = status;
        this.searchSign();
      },
      // 标题或负责人名称查询
      searchAttendLeave: function () {
        this.searchSign();
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
        this.searchSign();
      },
      // 获取采集列表
      searchSign: function () {
        var defer = $.Deferred();
        var vm = this;
        // 参数
        this.searchForm['page'] = this.currentPage;
        this.searchForm['rows'] = this.pageSize;
        // 传入当前用户信息
        this.searchForm['nowUser'] = this.nowUser;
        $.ajax({
          url: fjPublic.ajaxUrlDNN + '/searchSign',
          type: 'POST',
          data: vm.searchForm,
          dataType: 'json',
          success: function (data) {
            vm.attendAppealData = null;
            vm.attendAppealData = data.list;
            vm.total = data.total;
            _.each(vm.attendAppealData, function (item, i) {
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
      // 确认批准直接询问并发请求
      checkUpdate(id, status) {
        this.$confirm('确认同意该次申诉?', '提示', {
          confirmButtonText: '同意',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.checkDialogForm["id"] = id;
          this.checkDialogForm["status"] = status;
          this.updateAppealStatus(true)
        })
      },
      // 打开审核弹出框
      openCheckDialog: function (id, status) {
        this.checkDialogForm["id"] = id;
        this.checkDialogForm["status"] = status;
        this.checkDialogTitle = (status == 1 ? "同意？" : "不同意？");
        this.reasonDisabled = (status == 1 ? true : false);
        this.checkDialogVisible = true;
      },
      // 保存请假批准
      updateAppealStatus: function(isConfirm) {
        var defer = $.Deferred();
        var vm = this;
        let ajax = () => {
          $.ajax({
            url: fjPublic.ajaxUrlDNN + '/dealSign',
            type: 'POST',
            data: vm.checkDialogForm,
            dataType: 'json',
            success: function(data){
              if(data.errorCode == 0) {
                vm.checkDialogVisible = false;
                vm.searchSign();
              }
              vm.$message({
                type: 'info',
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
    },
    components: {
      fjBreadNav
    }
  }
</script>
<style scope lang="less">
.fj-appeal {
  .fj-search-inline {
    // 上下间距
    @media screen and (max-width: 1366px) {
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
  // 状态
  /deep/ .el-table {
    .textLeft {
      text-align: left;
    }
    .circle-status {
      position: relative;
      &.red {
        &::before {
          background: #f5222d;
        }
      }
      &.green {
        &::before {
          background: #52c41a;
        }
      }
      &.grey {
        &::before {
          background: #ababab;
        }
      }
      &::before {
        display: block;
        position: absolute;
        content: "";
        width: 6px;
        height: 6px;
        background: rgba(171, 171, 171, 1);
        border-radius: 50%;
        opacity: 1;
        top: 5px;
        left: -9px;
      }
    }
  }
  // 不通过理由弹窗
  .check-dialog {
    /deep/ .el-form-item {
      textarea {
        width: 300px;
      }
    }
  }
}
</style>
