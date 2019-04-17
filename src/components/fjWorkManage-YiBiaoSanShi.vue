<template>
  <div class="fj-content_view yiBiao">
    <div class="fj-block title">
      <fj-breadNav :bread-data="breadData"></fj-breadNav>
    </div>
    <div class="fj-block content">
      <div class="fj-block-head kaohe" style="border-bottom:0px;">
        <el-tabs v-model="activeIndex" @tab-click="handleClick">
          <el-tab-pane label="实有房屋" name="0"></el-tab-pane>
          <el-tab-pane label="居住人员" name="1"></el-tab-pane>
          <el-tab-pane label="实有单位" name="2"></el-tab-pane>
          <el-tab-pane label="从业人员" name="3"></el-tab-pane>
          <el-tab-pane label="实体信息" name="4"></el-tab-pane>
          <el-tab-pane label="就学信息" name="5"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="fj-block-body">
        <div class="fj-search-inline">
          <el-row>
            <el-form inline label-width="85px" label-position="left">
              <el-col :lg="6" :xl="5">
                <el-form-item label="部门单位：">
                  <el-select
                    @change="changeDeptId"
                    clearable
                    filterable
                    v-model="searchForm.deptId"
                    size="small"
                  >
                    <el-option
                      v-for="item in missionStates"
                      :key="item.deptId"
                      :label="item.deptName"
                      :value="item.deptId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="8" :xl="7" class="time-item">
                <el-form-item label="起始时间：" class="datepicker">
                  <el-date-picker
                    v-model="searchTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="changeSearchTime"
                    size="small"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :xs="8" :sm="12" :md="16" :lg="6" :xl="6">
                <el-form-item label="输入查询：">
                  <el-input
                    v-model="searchForm.user"
                    clearable
                    placeholder="请输入负责人或警号"
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
        <div
          class="add-list-btn"
          v-if="userInfo.userRole>1000"
          @click="goDetails(0)"
        >+ 添加{{activeList[activeIndex].name}}</div>
        <!-- table -->
        <el-table :data="tableDataList" style="width: 100%" class="el-tables">
          <el-table-column label="信息类型">
            <template slot-scope="scope">
              <span>{{activeList[activeIndex].name}}信息采集表</span>
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="提交人"></el-table-column>
          <el-table-column prop="deptName" label="所属单位"></el-table-column>
          <el-table-column prop="insTime" :formatter="dateStrFormat" label="提交时间"></el-table-column>
          <el-table-column prop="checkName" label="审核人"></el-table-column>
          <el-table-column prop="checkTime" :formatter="dateStrFormat" label="审核时间"></el-table-column>
          <el-table-column label="审核状态" show-overflow-tooltip prop="state" width="100px">
            <template slot-scope="scope">
              <span
                class="circle-status"
                :class="parseInt( scope.row.state)== 0 ? 'grey' : parseInt( scope.row.state)== 1 ? 'green' : 'red'"
              >
                {{parseInt( scope.row.state) == 0 ? '待审核' : parseInt( scope.row.state) == 1 ?'已通过'
                : '已废弃'}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span class="ope-txt" v-if="!scope.row.state">--</span>
              <span class="ope-txt" v-if="scope.row.state != 0" @click="goDetails(1,scope.row)">查看</span>
              <span
                class="ope-txt"
                v-if="parseInt( scope.row.state) == 0&&userInfo.userRole>1000"
                @click="goReview(scope.row)"
              >审核</span>
              <span
                class="ope-txt"
                v-if="parseInt( scope.row.state) == 0&&userInfo.userRole>1000"
                @click="goDetails(2,scope.row)"
              >编辑</span>
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
      :title="activeList[activeIndex].name+'信息采集表'"
      :visible.sync="checkDialogVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      style="position: absolute"
      width="1041px"
      class="check-dialogs"
    >
      <p
        class="similar"
        v-if="activeIndex==0||activeIndex==2||activeIndex==4"
      >社区警务平台已匹配到{{checkForm.hideData.length}}条相似数据</p>
      <el-table border :data="gridData[activeIndex]" :row-class-name="tableRowClassName">
        <el-table-column property="subAudit" label="基本信息" width="200"></el-table-column>
        <el-table-column property="sq" width="400">
          <template slot="header" slot-scope="scope">
            <img class="icon" src="static/images/ybss-sq.png" alt>
            <span>社区警务平台</span>
            <el-select
              v-if="(activeIndex==0||activeIndex==2||activeIndex==4)&&checkForm.hideData.length>0"
              @change="changeContrast"
              clearable
              filterable
              v-model="contrastIndex"
              size="small"
            >
              <el-option
                v-for="item in contrastStates"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column property="fj" label="辅警采集" width="400">
          <template slot="header" slot-scope="scope">
            <img class="icon" src="static/images/ybss-fj.png" alt>
            <span>辅警采集</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="footer-info">
        <span>提交人: {{checkForm.newData.userName}}</span>
        <span>提交时间: {{checkForm.newData.insTime |dateStrFormat}}</span>
        <span>审批人: {{checkForm.newData.checkName}}</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="footer-checkbox" v-if="activeIndex==0||activeIndex==2||activeIndex==4">
          <el-checkbox v-model="checked">覆盖原有信息</el-checkbox>
        </div>
        <el-button type="primary" @click="submitAudit(3)">通 过</el-button>
        <el-button @click="submitAudit(2)">做 废</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import fjBreadNav from "@/components/fjBreadNav";
import ybssData from "@/scripts/fjYiBiaoSanShiData";
export default {
  name: "fjWorkManage-YiBiaoSanShi",
  data() {
    return {
      breadData: [
        { name: "当前位置:", path: "" },
        { name: "工作管理", path: "" },
        { name: "一标三实", path: "" }
      ],
      userInfo: "",
      activeIndex: "0",
      activeList: ybssData.activeList,
      checked: false,
      //审核弹框表格信息
      gridData: ybssData.list,
      checkDialogVisible: false,
      // 部门下拉框
      missionStates: [],
      contrastStates: [], //审核弹窗下拉框
      contrastIndex: 0, //审核弹窗下拉框索引
      searchTime: "", // 查询时间
      // 列表查询参数
      searchForm: {
        tableName: "", //表格类型
        user: "", // 警号或负责人名称
        deptId: "", // 派出所
        status: "" // 状态
      },
      // 审核列表参数
      checkForm: {
        newData: {}, //辅警填写的信息表
        oldData: [], //警务平台对比信息表
        hideData: [] //修改返回时信息表，隐藏
      },
      // 列表数据
      tableDataList: [],
      // 分页数据
      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  },
  created: function() {
    //获取当前登录的用户信息,分为辅警和其他角色
    this.userInfo = $.parseJSON(fjPublic.getLocalData("userInfo"));
  },
  mounted() {
    fjPublic.closeLoad();
    // 初始化任务列表
    this.searchSign();
    this.getTeamList();
    return;
  },
  beforeRouteEnter(to, from, next) {
    next(function(vm) {
      fjPublic.closeLoad();
      setTimeout(() => {
        vm.searchSign();
      }, 1000);
    });
  },
  methods: {
    currentPageChange(pageNum) {
      // 点击某个分页按钮
      this.currentPage = pageNum;
      this.searchSign();
    },
    prevPageChange(pageNum) {
      // 点击分页的上一页
      this.currentPage = pageNum;
      this.searchSign();
    },
    nextPageChange(pageNum) {
      // 点击分页的下一页
      this.currentPage = pageNum;
      this.searchSign();
    },
    sizePageChange(pageSize) {
      // 改变每页条数时
      this.currentPage = 1;
      this.pageSize = pageSize;
      this.searchSign();
    },
    //修改弹出框表格双列样式
    tableRowClassName({ row, rowIndex }) {
      let className = "";
      if (rowIndex % 2 != 0) {
        className = "tables-td-db";
      }
      if (row.sq != row.fj) {
        className += " tables-td-err";
      }
      return className;
    },
    /**
     * 查看，编辑，新建
     * @param {*} state 状态0=新增，1=查看，2=编辑
     */
    goDetails(state, items) {
      let item = items;
      !item && (item = { id: "" });
      this.$router.push({
        path: "/fjWorkManage-YiBiaoSanShi-Details",
        query: { index: this.activeIndex, state: state, id: item.id }
      });
      //设置缓存，到编辑回显
      state != 0 && fjPublic.setLocalData("ybssItem", JSON.stringify(item));
    },
    //获取被选中的标签 tab 实例
    handleClick(tab) {
      this.activeIndex = tab.index;
      for (var i in this.searchForm) {
        this.searchForm[i] = "";
      }
      this.currentPage = 1;
      this.searchSign();
    },
    // 修改单位下拉框查询
    changeDeptId: function(deptId) {
      this.searchForm["deptId"] = deptId;
      this.searchSign();
    },
    // 修改审核弹框实体下拉框查询
    changeContrast: function() {
      this.processContrast(this.contrastIndex);
    },
    // 标题或负责人名称查询
    searchAttendLeave: function() {
      this.searchSign();
    },
    // 修改查询时间
    changeSearchTime: function(searchTime) {
      if (searchTime) {
        this.searchForm["startTime"] = fjPublic
          .dateFormatYYMMDD(searchTime[0])
          .split("-")
          .join("");
        this.searchForm["endTime"] = fjPublic
          .dateFormatYYMMDD(searchTime[1])
          .split("-")
          .join("");
      } else {
        this.searchForm["startTime"] = "";
        this.searchForm["endTime"] = "";
      }
      this.searchSign();
    },
    // 获取列表
    searchSign: function() {
      fjPublic.openLoad("数据加载中...");
      var vm = this;
      // 参数
      this.searchForm["pageNumber"] = this.currentPage;
      this.searchForm["pageSize"] = this.pageSize;
      this.searchForm["tableName"] = this.activeList[
        this.activeIndex
      ].tableName;
      //标题或负责人名称
      this.searchForm["user"] = this.searchForm.user;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/getInfoList",
        type: "POST",
        data: vm.searchForm,
        dataType: "json",
        success: function(data) {
          vm.tableDataList = null;
          vm.tableDataList = data.list;
          vm.total = data.total;
          fjPublic.closeLoad();
        },
        error: function(err) {
          fjPublic.closeLoad();
          vm.$message({ type: "warning", message: "请求数据失败！！！" });
        }
      });
    },
    //打开审核弹窗
    goReview(item) {
      let vm = this;
      fjPublic.openLoad("数据加载中...");
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/contrast",
        type: "POST",
        data: {
          tableName: vm.activeList[vm.activeIndex].tableName,
          id: item.id
        },
        dataType: "json",
        success: function(data) {
          vm.checkForm = data;
          vm.processContrast(0); //默认列表展示第一条数据
          vm.contrastStates = [];
          for (let i = 0; i < vm.checkForm.oldData.length; i++) {
            !vm.checkForm.oldData[i].address &&
              (vm.checkForm.oldData[i].address = "选择");
            let list = {
              id: i,
              name: vm.checkForm.oldData[i].address
            };
            vm.contrastStates.push(list);
          }
          vm.checkDialogVisible = true;
          fjPublic.closeLoad();
        },
        error: function(err) {
          fjPublic.closeLoad();
          vm.$message({ type: "warning", message: "请求数据失败！！！" });
        }
      });
      // vm.checkDialogVisible = true;
    },
    // 处理选取不同实体获取不同信息数据
    processContrast: function(index) {
      let vm = this;
      let list = vm.gridData[vm.activeIndex];
      for (var i in list) {
        for (var j in list[i]) {
          if (j != "fj" && j != "sq" && j != "subAudit") {
            for (var k in vm.checkForm.newData) {
              //辅警采集
              if (k == j) {
                list[i]["fj"] = vm.checkForm.newData[k];
              }
            }
            for (var k in vm.checkForm.oldData[index]) {
              //社区采集
              if (k == j) {
                list[i]["sq"] = vm.checkForm.oldData[index][k];
              }
            }
          }
        }
      }
    },
    /**
     * @description: 是否覆盖审核信息
     * @param {type} state 状态1：审核通过并覆盖，2：作废，3：审核通过新建
     * @return:
     */
    submitAudit: function(state) {
      var vm = this;
      if (vm.checked && state == 3) {
        vm.$confirm("此操作将覆盖原有信息, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
          .then(() => {
            vm.postSubmit(1);
          })
          .catch(() => {
            vm.$message({
              type: "info",
              message: "已取消覆盖"
            });
          });
      } else {
        vm.postSubmit(state);
      }
    },
    // 请求审核接口
    postSubmit: function(state) {
      var vm = this;
      // 参数
      return new Promise((resolve, reject) => {
        $.ajax({
          url: fjPublic.ajaxUrlDNN + "/checkInfo",
          type: "POST",
          data: {
            id: vm.checkForm.newData.id,
            state: state,
            checkId: vm.userInfo.userId,
            tableName: vm.activeList[this.activeIndex].tableName,
            hideData: JSON.stringify(vm.checkForm.hideData[vm.contrastIndex])
          },
          dataType: "json",
          success: function(data) {
            resolve(data);
          },
          error: function(err) {
            reject(err);
          }
        });
      })
        .then(res => {
          vm.checkDialogVisible = false;
        })
        .catch(function(reason) {
          // vm.$message({
          //   type: "success",
          //   message: "审核成功!"
          // });
          vm.searchSign();
          vm.checkDialogVisible = false;
        });
    },
    // 获取部门单位数据
    getTeamList: function(state) {
      var vm = this;
      // 参数
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/searchDeptsByFenju",
        type: "POST",
        data: {},
        dataType: "json",
        success: function(data) {
          vm.missionStates = data.list;
        },
        error: function(err) {}
      });
    },
    // 时间过滤器
    dateStrFormat(row, column, cellValue, index) {
      if (!cellValue) {
        return "";
      }
      return (
        cellValue.substr(4, 2) +
        "/" +
        cellValue.substr(6, 2) +
        " " +
        cellValue.substr(8, 2) +
        ":" +
        cellValue.substr(10, 2)
      );
    }
  },
  filters: {
    dateStrFormat: function(value) {
      if (!value) {
        return "";
      }
      let time = value;
      return time.slice(0, 4) + "-" + time.slice(4, 6) + "-" + time.slice(6, 8);
    }
  },
  components: {
    fjBreadNav
  }
};
</script>
<style scope lang="less">
.yiBiao {
  .add-list-btn {
    height: 32px;
    text-align: center;
    line-height: 32px;
    color: #1890ff;
    border: 1px dashed #3aa0ff;
    cursor: pointer;
  }
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
  .el-tables {
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
    /deep/ .textLeft {
      text-align: left;
    }
  }
}
.check-dialogs {
  .similar {
    position: absolute;
    top: 22px;
    left: 218px;
    color: rgba(0, 95, 183, 1);
  }
  .el-dialog__title {
    width: 180px;
    height: 28px;
    font-size: 20px;
    font-weight: 500;
    line-height: 22px;
    color: rgba(0, 0, 0, 0.85);
    opacity: 1;
  }

  .el-table td,
  .el-table th {
    text-align: left;
    padding: 10px 0;
  }

  .tables-td-db {
    background: rgba(240, 250, 255, 1);
  }
  .tables-td-err td:first-child {
    color: #f5222d;
  }

  tbody tr {
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    opacity: 1;
    td:first-child {
      color: rgba(0, 0, 0, 0.85);
      .cell {
        padding-left: 20px;
      }
    }
  }
  thead tr {
    font-size: 16px;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    opacity: 1;
    th:nth-child(1) {
      background: rgba(17, 75, 129, 1);
      .cell {
        padding-left: 20px;
      }
    }
    th:nth-child(2) {
      background: rgba(0, 95, 183, 1);
      .cell {
        height: 32px;
        padding-top: 4px;
      }
      .el-select {
        width: 180px;
        position: absolute;
        top: -4px;
        right: 0;
        input {
          height: 30px;
          color: rgba(255, 255, 255, 0.85);
          background: rgba(0, 95, 183, 1);
          border: 1px solid rgba(255, 255, 255, 0.65);
          border-radius: 2px;
        }
        .el-input__suffix {
          right: 10px;
          font-weight: 400;
        }
      }
    }
    th:nth-child(3) {
      background: rgba(24, 144, 255, 1);
    }
    th .icon {
      flex: 0 0 auto;
      width: 24px;
      height: 24px;
      margin: 0px 10px 0px 10px;
      vertical-align: middle;
    }
    th:not(:last-child) {
      border-right: 1px solid #e8e8e8;
    }
  }
}
.dialog-footer {
  text-align: center;
  margin-top: 20px;
  .footer-checkbox {
    margin-bottom: 12px;
  }
}
.footer-info {
  margin: 20px 0;
  span {
    float: left;
    // width: 98px;
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: rgba(0, 0, 0, 0.5);
  }
  span:first-child {
    width: 210px;
  }
  span:nth-child(2) {
    width: 400px;
  }
}
</style>


