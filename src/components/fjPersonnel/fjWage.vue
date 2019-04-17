<template>
  <div class="fj-content_view work-mis wage">
    <div class="fj-block title">
      <fj-breadNav :bread-data="breadData"></fj-breadNav>
    </div>
    <div class="fj-block content">
      <div class="fj-block-head kaohe">
        <el-tabs v-model="activeIndex" @tab-click="handleClick">
          <el-tab-pane label="工资列表" name="0"></el-tab-pane>
          <el-tab-pane label="工资申诉" name="1"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="fj-block-body">
        <div class="fj-search-inline">
          <el-row>
            <el-form inline label-width="85px" label-position="left">
              <el-col :lg="8" :xl="7" class="time-item">
                <el-form-item label="区县分局：">
                  <el-select
                    @change="changeSupDeptId"
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

                <el-form-item label="起始日期：" class="datepicker">
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
                  <div class="search-btn">
                    <el-button type="primary" @click="searchAttendLeave">导入</el-button>
                    <el-button @click="searchAttendLeave">导出</el-button>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :lg="6" :xl="6" v-if="activeIndex==1">
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
            </el-form>
          </el-row>
        </div>
        <el-table :data="tableDataList" v-if="activeIndex==0">
          <el-table-column prop="userAccount" label="发放日期" :key="Math.random()"></el-table-column>
          <el-table-column prop="userAccount" label="单位" :key="Math.random()"></el-table-column>
          <el-table-column prop="userAccount" label="辅警站" :key="Math.random()"></el-table-column>
          <el-table-column prop="userId" label="姓名" width="80px" :key="Math.random()"></el-table-column>
          <el-table-column
            label="入职时间"
            show-overflow-tooltip
            :formatter="timeFormatter"
            prop="apply_time"
            :key="Math.random()"
          ></el-table-column>
          <el-table-column prop="userAccount" label="基本工资" :key="Math.random()"></el-table-column>
          <el-table-column prop="userAccount" label="绩效工资" :key="Math.random()"></el-table-column>
          <el-table-column prop="userAccount" label="层级工资" :key="Math.random()"></el-table-column>
          <el-table-column prop="userAccount" label="岗位工资" :key="Math.random()"></el-table-column>
          <el-table-column prop="userAccount" label="生活补贴" :key="Math.random()"></el-table-column>
          <el-table-column prop="userAccount" label="信息采集费" :key="Math.random()"></el-table-column>
          <el-table-column prop="userAccount" label="流量补助费" :key="Math.random()"></el-table-column>
          <el-table-column prop="userAccount" label="其他" :key="Math.random()"></el-table-column>
          <el-table-column prop="userAccount" label="应发合计" :key="Math.random()"></el-table-column>
          <el-table-column prop="userAccount" label="养老保险" :key="Math.random()"></el-table-column>
          <el-table-column prop="userAccount" label="医疗保险" :key="Math.random()"></el-table-column>
          <el-table-column prop="userAccount" label="失业保险" :key="Math.random()"></el-table-column>
          <el-table-column prop="userAccount" label="工商保险" :key="Math.random()"></el-table-column>
          <el-table-column prop="userAccount" label="生育保险" :key="Math.random()"></el-table-column>
          <el-table-column prop="userAccount" label="大病互助保险" :key="Math.random()"></el-table-column>
          <el-table-column prop="userAccount" label="扣发合计" :key="Math.random()"></el-table-column>
          <el-table-column prop="userAccount" label="实发合计" :key="Math.random()"></el-table-column>
          <el-table-column prop="userAccount" label="银行卡号" :key="Math.random()"></el-table-column>
          <el-table-column label="操作" :key="Math.random()">
            <template slot-scope="scope">
              <span class="ope-txt" v-if="scope.row.leave_state != 0">--</span>
              <span
                class="ope-txt"
                v-if="scope.row.leave_state == 0"
                @click="openDetail(scope.row.leaveId,1)"
              >详情</span>
              <span
                class="ope-txt"
                v-if="scope.row.leave_state == 0"
                @click="editDialog(scope.row.leaveId, 2)"
              >编辑</span>
            </template>
          </el-table-column>
        </el-table>
        <el-table :data="tableDataList" v-if="activeIndex==1">
          <el-table-column prop="userId" label="姓名" :key="Math.random()"></el-table-column>
          <el-table-column prop="userAccount" label="警号" :key="Math.random()"></el-table-column>
          <el-table-column
            label="申诉时间"
            show-overflow-tooltip
            :formatter="timeFormatter"
            prop="apply_time"
            :key="Math.random()"
          ></el-table-column>
          <el-table-column prop="userAccount" label="情况说明" :key="Math.random()"></el-table-column>
          <el-table-column label="状态" prop="leave_state" width="120px" :key="Math.random()">
            <template slot-scope="scope">
              <span
                class="circle-status"
                :class="scope.row.leave_state == 0 ? 'grey' : scope.row.leave_state == 1 ? 'green' : 'red'"
              >
                {{parseInt( scope.row.leave_state) === 0 ? '待审核' : parseInt( scope.row.leave_state) === 1 ?'已通过'
                : '被驳回'}}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="处理意见"
            show-overflow-tooltip
            width="200px"
            prop="leader_content"
            class-name="textLeft"
            :key="Math.random()"
          ></el-table-column>
          <el-table-column label="操作" :key="Math.random()">
            <template slot-scope="scope">
              <span class="ope-txt" v-if="scope.row.leave_state != 0">--</span>
              <!-- <span
                class="ope-txt"
                v-if="scope.row.leave_state == 0"
                @click="checkUpdate(scope.row.leaveId,1)"
              >同意</span>-->
              <span
                class="ope-txt"
                v-if="scope.row.leave_state == 0"
                @click="openCheckDialog(scope.row.leaveId,1)"
              >同意</span>
              <span
                class="ope-txt"
                v-if="scope.row.leave_state == 0"
                @click="openCheckDialog(scope.row.leaveId, 2)"
              >不同意</span>
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
    <!-- 审核弹出框 -->
    <el-dialog
      :title="checkDialogTitle"
      :visible.sync="checkDialogVisible"
      :modal-append-to-body="checkDialogVisibleModal"
      style="position: absolute"
      width="450px"
      @close="closeDialog"
      :close-on-click-modal="false"
      top="25vh"
      class="check-dialog"
    >
      <el-form :model="checkDialogForm" ref="checkDialogForm" inline :rules="checkRule">
        <el-form-item
          label="不通过理由"
          label-width="100px"
          prop="reason"
          v-if="checkDialogForm.status==2"
        >
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入不通过理由"
            v-model="checkDialogForm.reason"
            :disabled="reasonDisabled"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="通过理由"
          label-width="100px"
          prop="reasons"
          v-if="checkDialogForm.status==1"
        >
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入通过理由"
            v-model="checkDialogForm.reason"
            :disabled="!reasonDisabled"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="checkDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateLeaveStatus(false)">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑弹出框 -->
    <el-dialog
      :title="checkDialogTitle"
      :visible.sync="editDialogVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      style="position: absolute"
      width="600px"
      class="check-dialogs"
    >
      <div>
        <h3>谁-什么时间 工资明细</h3>
        <p>工资申诉：什么理由</p>
        <div class="form-info">
          <el-form :model="ruleForm" :rules="rules">
            <el-form-item label="入职时间">
              <el-input
                v-model="ruleForm.road"
                :disabled="userInfo.state == 1"
                :placeholder="userInfo.state == 1?'':'请输入'"
              ></el-input>
            </el-form-item>
            <el-form-item label="基本工资">
              <el-input
                v-model="ruleForm.road"
                :disabled="userInfo.state == 1"
                :placeholder="userInfo.state == 1?'':'请输入'"
              ></el-input>
            </el-form-item>
            <el-form-item label="绩效工资">
              <el-input
                v-model="ruleForm.road"
                :disabled="userInfo.state == 1"
                :placeholder="userInfo.state == 1?'':'请输入'"
              ></el-input>
            </el-form-item>
            <el-form-item label="层级工资">
              <el-input
                v-model="ruleForm.road"
                :disabled="userInfo.state == 1"
                :placeholder="userInfo.state == 1?'':'请输入'"
              ></el-input>
            </el-form-item>
            <el-form-item label="岗位工资">
              <el-input
                v-model="ruleForm.road"
                :disabled="userInfo.state == 1"
                :placeholder="userInfo.state == 1?'':'请输入'"
              ></el-input>
            </el-form-item>
            <el-form-item label="生活补贴">
              <el-input
                v-model="ruleForm.road"
                :disabled="userInfo.state == 1"
                :placeholder="userInfo.state == 1?'':'请输入'"
              ></el-input>
            </el-form-item>
            <el-form-item label="信息采集费">
              <el-input
                v-model="ruleForm.road"
                :disabled="userInfo.state == 1"
                :placeholder="userInfo.state == 1?'':'请输入'"
              ></el-input>
            </el-form-item>
            <el-form-item label="流量补助费">
              <el-input
                v-model="ruleForm.road"
                :disabled="userInfo.state == 1"
                :placeholder="userInfo.state == 1?'':'请输入'"
              ></el-input>
            </el-form-item>
            <el-form-item label="其他">
              <el-input
                v-model="ruleForm.road"
                :disabled="userInfo.state == 1"
                :placeholder="userInfo.state == 1?'':'请输入'"
              ></el-input>
            </el-form-item>
            <el-form-item label="应发合计">
              <el-input
                v-model="ruleForm.road"
                :disabled="userInfo.state == 1"
                :placeholder="userInfo.state == 1?'':'请输入'"
              ></el-input>
            </el-form-item>
            <el-form-item label="养老保险">
              <el-input
                v-model="ruleForm.road"
                :disabled="userInfo.state == 1"
                :placeholder="userInfo.state == 1?'':'请输入'"
              ></el-input>
            </el-form-item>
            <el-form-item label="医疗保险">
              <el-input
                v-model="ruleForm.road"
                :disabled="userInfo.state == 1"
                :placeholder="userInfo.state == 1?'':'请输入'"
              ></el-input>
            </el-form-item>
            <el-form-item label="失业保险">
              <el-input
                v-model="ruleForm.road"
                :disabled="userInfo.state == 1"
                :placeholder="userInfo.state == 1?'':'请输入'"
              ></el-input>
            </el-form-item>
            <el-form-item label="工商保险">
              <el-input
                v-model="ruleForm.road"
                :disabled="userInfo.state == 1"
                :placeholder="userInfo.state == 1?'':'请输入'"
              ></el-input>
            </el-form-item>
            <el-form-item label="生育保险">
              <el-input
                v-model="ruleForm.road"
                :disabled="userInfo.state == 1"
                :placeholder="userInfo.state == 1?'':'请输入'"
              ></el-input>
            </el-form-item>
            <el-form-item label="大病互助保险">
              <el-input
                v-model="ruleForm.road"
                :disabled="userInfo.state == 1"
                :placeholder="userInfo.state == 1?'':'请输入'"
              ></el-input>
            </el-form-item>
            <el-form-item label="扣发合计">
              <el-input
                v-model="ruleForm.road"
                :disabled="userInfo.state == 1"
                :placeholder="userInfo.state == 1?'':'请输入'"
              ></el-input>
            </el-form-item>
            <el-form-item label="实发合计">
              <el-input
                v-model="ruleForm.road"
                :disabled="userInfo.state == 1"
                :placeholder="userInfo.state == 1?'':'请输入'"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="footer-info">
        <span>审批人: {{checkInfoForm.checkName}}</span>
        <span>审批时间: {{checkInfoForm.insTime}}</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAudit(1)">确认修改</el-button>
        <el-button @click="submitAudit(2)">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import fjBreadNav from "@/components/fjBreadNav";
import mixin from "@/scripts/mixin.js";
export default {
  name: "fjAttendHistory",
  mixins: [mixin], // 使用mixins
  data: function() {
    return {
      breadData: [
        { name: "当前位置:", path: "" },
        { name: "人事管理", path: "" },
        { name: "工资管理", path: "" }
      ],
      nowUser: $.cookie(fjPublic.loginCookieKey),
      // 分局
      supDeptIds: null,
      // 派出所
      deptIds: null,
      // 状态
      activeIndex: "0",
      statuses: [
        {
          value: "0",
          label: "待审核"
        },
        {
          value: "1",
          label: "已通过"
        },
        {
          value: "2",
          label: "被驳回"
        }
      ],
      // 列表查询参数
      searchForm: {
        searchTime: "", // 查询时间
        nameOrAccount: "", // 警号或负责人名称
        deptId: "", // 派出所
        supDeptId: "", // 公安局
        status: "" // 状态
      },
      searchListUrl: "/searchUserLeave", //获取列表数据URL
      // 审核弹出框数据
      checkDialogVisible: false,
      checkDialogVisibleModal: false,
      editDialogVisible: false,
      checkDialogTitle: "",
      //审核人参数
      checkInfoForm: {
        userName: "", //提交辅警姓名
        checkName: "", // 审核民警姓名
        insTime: "" // 提交时间
      },
      //审核人参数
      userInfo: {
        status: ""
      },
      //审核人参数
      ruleForm: {
        status: ""
      },
      // 审核参数
      // checkForm: {
      //   tableName: "", //表格类型
      //   checkId: "", // 审核民警id
      //   ids: "", // 信息采集表id
      //   state: "" // 状态（1：审核通过，2：作废）
      // },
      checkDialogForm: {
        id: "",
        status: "",
        reason: ""
      },
      reasonDisabled: true,
      formLabelWidth: "120px",
      // 不批准弹出框校验
      checkRule: {
        reason: {
          required: true,
          message: "请输入不通过理由",
          trigger: "blur"
        },
        reasons: {
          required: true,
          message: "请输入通过理由",
          trigger: "blur"
        }
      }
    };
  },
  mounted: function() {
    // 初始化派出所下拉列表
    this.initDeptIds();
    // 初始化派出所下拉列表
    this.initSupDeptIds();
    // 初始化请假休假列表
    this.searchList();

    return;
  },
  filters: {
    // 状态处理
    getLeaveStatus: function(value) {
      return value == "0"
        ? "待批"
        : value == 1
        ? "已批准"
        : value == 2
        ? "未批准"
        : "";
    },
    getFormatTime: function(value) {
      // return value ? fjPublic.dateStrFormat(value) : '';
      return value ? value.substring(0, value.length - 2) : "";
    }
  },
  methods: {
    //获取被选中的标签 tab 实例
    handleClick(tab) {
      console.log(tab);
      this.activeIndex = tab.index;
      // for (var i in this.searchForm) {
      //   this.searchForm[i] = "";
      // }
      // this.currentPage = 1;
      // this.searchSign();
    },
    // 初始化分局
    initSupDeptIds: function() {
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/searchDepListBySearch",
        type: "POST",
        data: {},
        dataType: "json",
        success: function(data) {
          vm.supDeptIds = data.list;
          defer.resolve();
        },
        error: function(err) {
          defer.reject();
        }
      });
      return defer;
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
    changeSupDeptId: function(supDeptId) {
      this.searchForm["supDeptId"] = supDeptId;
      this.searchList();
    },
    // 修改单位下拉框查询
    changeDeptId: function(deptId) {
      this.searchForm["deptId"] = deptId;
      this.searchList();
    },
    // 修改状态下拉框查询
    changeStatus: function(status) {
      this.searchForm["status"] = status;
      this.searchList();
    },
    // 标题或负责人名称查询
    searchAttendLeave: function() {
      this.searchList();
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
      this.searchList();
    },
    // 设置获取列表参数
    setSearchList: function() {
      this.searchForm["page"] = this.currentPage;
      this.searchForm["rows"] = this.pageSize;
      // 传入当前用户信息
      this.searchForm["nowUser"] = this.nowUser;
    },
    // 打开工资列表详情页
    openDetail: function(id, status) {
      console.log(123);
      this.$router.push({
        path: "/personnel-wage-detail",
        query: { state: status, id: id }
      });
    },
    // 打开工资编辑弹框
    editDialog: function(id, status) {
      this.editDialogVisible = true;
      // this.checkDialogForm["id"] = id;
      // this.checkDialogForm["status"] = status;
      // this.checkDialogTitle = status == 1 ? "同意？" : "不同意？";
      // this.reasonDisabled = status == 1 ? true : false;
      // this.checkDialogVisible = true;
    },
    // 工资编辑弹框操作
    submitAudit: function(status) {
      this.editDialogVisible = false;
      // this.checkDialogForm["id"] = id;
      // this.checkDialogForm["status"] = status;
      // this.checkDialogTitle = status == 1 ? "同意？" : "不同意？";
      // this.reasonDisabled = status == 1 ? true : false;
      // this.checkDialogVisible = true;
    },
    // 打开审核弹出框
    openCheckDialog: function(id, status) {
      this.checkDialogForm["id"] = id;
      this.checkDialogForm["status"] = status;
      this.checkDialogTitle = status == 1 ? "同意？" : "不同意？";
      this.reasonDisabled = status == 1 ? true : false;
      this.checkDialogVisible = true;
    },
    // 确认批准直接询问并发请求
    checkUpdate(id, status) {
      this.$confirm("确认批准该条工资申诉?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.checkDialogForm["id"] = id;
        this.checkDialogForm["status"] = status;
        this.updateLeaveStatus(true);
      });
    },
    // 保存请假批准
    updateLeaveStatus: function(isConfirm) {
      var defer = $.Deferred();
      var vm = this;
      let ajax = () => {
        $.ajax({
          url: fjPublic.ajaxUrlDNN + "/dealLeave",
          type: "POST",
          data: vm.checkDialogForm,
          dataType: "json",
          success: function(data) {
            if (data.errorCode == 0) {
              vm.checkDialogVisible = false;
              vm.searchList();
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
      };
      // 传入当前用户信息
      vm.checkDialogForm["nowUser"] = $.cookie(fjPublic.loginCookieKey);
      // 直接批准

      if (isConfirm) {
        ajax();
      } else {
        this.$refs.checkDialogForm.validate(validate => {
          if (validate) {
            ajax();
          }
        });
      }
    },
    // 时间格式化
    timeFormatter(row, type) {
      let dateStr = row[type.property];
      if (!dateStr) {
        return "";
      }
      return (
        dateStr.substr(5, 2) +
        "/" +
        dateStr.substr(8, 2) +
        " " +
        dateStr.substr(11, 2) +
        ":" +
        dateStr.substr(14, 2)
      );
    },
    // 弹窗关闭事件
    closeDialog() {
      this.$refs.checkDialogForm.resetFields();
    }
  },
  components: {
    fjBreadNav
  }
};
</script>
<style scope lang="less">
.wage {
  .fj-block-head {
    height: 50px;
    border-bottom: 0px;
    .el-tabs__header {
      padding-top: 10px;
    }
  }
  .fj-search-inline {
    // 上下间距
    @media screen and (max-width: 1366px) {
      .el-form-item__label {
        line-height: 20px;
      }
    }
    .search-btn {
      position: absolute;
      top: 0;
      right: -200px;
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
}
.check-dialogs {
  .form-info {
    margin: 10px 0;
    .el-form {
      .el-form-item {
        border: 1px solid #e8e8e8;
        border-bottom: none;
        margin-bottom: 0;

        .el-form-item__label {
          width: 250px;
          text-align: left;
          padding-left: 20px;
          border-right: 1px solid #e8e8e8;
        }
        .el-input {
          width: 300px;
          input {
            border: none;
          }
        }
      }
      .el-form-item:nth-of-type(even) {
        background: #f0faff;
        input {
          background: #f0faff;
        }
      }
      .el-form-item:last-child {
        border-bottom: 1px solid #e8e8e8;
      }
    }
  }
  .footer-info {
    span {
      display: inline-block;
      width: 240px;
      padding-left: 20px;
    }
  }
}
</style>
