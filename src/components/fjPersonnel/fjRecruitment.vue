<template>
  <div class="fj-content_view work-mis workLog">
    <div class="fj-block title">
      <fj-breadNav :bread-data="breadData"></fj-breadNav>
    </div>
    <div class="fj-block content">
      <div class="fj-block-head kaohe">
        <p class="title fj-fl">招聘信息列表</p>
      </div>
      <div class="fj-block-body">
        <div class="fj-search-inline">
          <el-row>
            <el-form inline label-position="left">
              <el-col :lg="6" :xl="6">
                <el-form-item label="分局：">
                  <el-select
                    @change="changeDeptId"
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
                <el-form-item label="状态：">
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
                <el-form-item label="派出所：">
                  <el-select
                    @change="changeRecruitsByDeptId"
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
                <el-form-item>
                  <el-input
                    v-model="searchForm.nameOrPhone"
                    clearable
                    placeholder="请输入名称或手机号"
                    size="small"
                    class="search-input"
                  >
                    <el-button slot="append" @click="searchList">搜索</el-button>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :lg="8" :xl="8" class="time-item">
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
                <el-form-item>
                  <form
                    style="display:none;"
                    name="exportForm"
                    :action="ajaxUrlDNN + '/exportRecruits?nowUser=' + nowUser + '&endTime=' + searchForm.endTime + '&deptId=' + searchForm.deptId + '&startTime=' + searchForm.startTime + '&page=' + currentPage + '&nameOrPhone=' + searchForm.nameOrPhone + '&rows=' + pageSize"
                    method="post"
                    enctype="multipart/form-data"
                  ></form>
                  <el-button type="primary" @click="openMFSpopMultiple">
                    <span>{{multipleSelection.length>1?'批量审核':'审核'}}</span>
                  </el-button>
                  <el-button plain @click="exportRecruits">
                    <!-- <i class="el-icon-upload2"></i> -->
                    <span>导出</span>
                  </el-button>
                  <el-button plain @click="addRecruit">
                    <span>添加</span>
                  </el-button>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </div>
        <el-table :data="tableDataList" class="el-tables" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column prop="deptName" label="地区"></el-table-column>
          <el-table-column prop="name" label="姓名"></el-table-column>
          <el-table-column prop="phone" label="手机号码"></el-table-column>
          <el-table-column label="提交时间">
            <template slot-scope="scope">
              <p>{{scope.row.insTime | getFormatInsTime}}</p>
            </template>
          </el-table-column>
          <el-table-column label="招聘流程">
            <el-table-column v-for="(item, index) in items" :key="item.label" :label="item.label">
              <template slot-scope="scope">
                <p v-if="scope.row.status == 0">--</p>
                <p v-if="scope.row.status == 1">
                  <template v-if="index < scope.row.step">
                    <i class="el-icon-check"></i>
                  </template>
                  <template v-else>--</template>
                </p>
                <p v-if="scope.row.status == 2">
                  <template v-if="index < scope.row.step - 1 ">
                    <i class="el-icon-check"></i>
                  </template>
                  <template v-else-if="index == scope.row.step - 1">
                    <i class="el-icon-close"></i>
                  </template>
                  <template v-else>--</template>
                </p>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="审核结果" show-overflow-tooltip prop="status" width="80px">
            <template slot-scope="scope">
              <span
                class="circle-status"
                :class="((scope.row.status == 0) || (scope.row.status == 1 && scope.row.step != 5)) ? 'grey' : (scope.row.status == 1 && scope.row.step == 5) ? 'green' : 'red'"
              >
                {{((scope.row.status == 0) || (scope.row.status == 1 && scope.row.step != 5)) ? '待审核' : (scope.row.status == 1 && scope.row.step == 5) ? '已通过'
                : '未通过'}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <a href="javascript:;" class="ope-txt" @click.stop="goDetails(scope.row,1)">详情</a>
              <!-- <a href="javascript:;" class="ope-txt" @click.stop="goDetails(scope.row,2)">编辑</a> -->
              <a
                v-if="(scope.row.status == 2) || (scope.row.status == 1 && scope.row.step == 5)"
                href="javascript:;"
                class="ope-txt"
                @click.stop="deleteRecruit(scope.row)"
              >删除</a>
              <a
                v-else
                href="javascript:;"
                class="ope-txt"
                @click.stop="updateRecruit(scope.row)"
              >审核</a>
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
  </div>
</template>
<script>
import fjBreadNav from "@/components/fjBreadNav";
import mixin from "@/scripts/mixin.js";
export default {
  mixins: [mixin], // 使用mixins
  data: function() {
    return {
      breadData: [
        { name: "当前位置:", path: "" },
        { name: "人事管理", path: "" },
        { name: "招聘管理", path: "" }
      ],
      ajaxUrlDNN: fjPublic.ajaxUrlDNN,
      nowUser: $.cookie(fjPublic.loginCookieKey),
      // 分局
      supDeptIds: [],
      // 派出所
      deptIds: null,
      // 招聘步骤
      items: [
        { label: "资格审查" },
        { label: "笔试" },
        { label: "面试" },
        { label: "公示" },
        { label: "录用" }
      ],
      // switch开关
      switchDisabled: true,
      // 状态
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
          label: "未通过"
        }
      ],
      // 列表查询参数
      searchForm: {
        searchTime: "", // 查询时或手机号
        deptId: "", // 派出所
        status: "", // 状态
        supDeptId: "", // 分局
        startTime: "",
        endTime: "",
        nameOrPhone: ""
      },
      searchListUrl: "/getRecruits", //获取列表数据URL
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
        reason: "",
        currentRow: {}
      }
    };
  },
  mounted: function() {
    // 初始化派出所下拉列表
    this.initSupDeptIds();
    // 初始化采集列表
    this.searchList();
    return;
  },
  filters: {
    // 状态处理
    getLeadResultName: function(value) {
      return value == 0
        ? "待审批"
        : value == 1
        ? "已通过"
        : value == 2
        ? "未通过"
        : "";
    },
    getFormatInsTime: function(value) {
      return value ? value.substr(0, 10) : "";
    }
  },
  methods: {
    exportRecruits: function() {
      // 导出
      document.forms["exportForm"].submit();
    },
    openMFSpopMultiple: function() {
      // 批量审核
      if (!this.multipleSelection || !this.multipleSelection.length) {
        this.$message({
          type: "warning",
          message: "请选择要进行批量审核的人员招聘信息！"
        });
        return;
      }
      var tmpObj = _.find(
        this.multipleSelection,
        function(item) {
          return item.status == 2 || (item.status == 1 && item.step == 5);
        },
        this
      );
      if (tmpObj) {
        this.$message({
          type: "warning",
          message: "所选的人员招聘信息包含已审核完成的，请重新选择！"
        });
        return;
      }
      var step = this.multipleSelection[0].step;
      var tmpObj1 = _.find(
        this.multipleSelection,
        function(item) {
          return item.step != step;
        },
        this
      );
      if (tmpObj1) {
        this.$message({
          type: "warning",
          message: "所选的人员招聘信息流程不一致，请重新选择！"
        });
        return;
      }
      var ids = [];
      this.multipleSelection.forEach(el => {
        ids.push(el.id);
      });
      this.$confirm("（" + this.items[step].label + "）审核", "提示", {
        confirmButtonText: "通过",
        cancelButtonText: "拒绝",
        type: "warning",
        center: true
      })
        .then(() => {
          this.confirmUpdateRecruit(ids.join(","), "1");
        })
        .catch(() => {
          this.confirmUpdateRecruit(ids.join(","), "2");
        });
    },
    // 设置获取列表参数
    setSearchList: function() {
      this.searchForm["page"] = this.currentPage;
      this.searchForm["rows"] = this.pageSize;
      // 传入当前用户信息
      this.searchForm["nowUser"] = this.nowUser;
    },
    // 初始化分局
    initSupDeptIds: function() {
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/searchDeptByRole",
        type: "POST",
        data: {
          nowUser: vm.nowUser
        },
        dataType: "json",
        success: function(data) {
          vm.supDeptIds = data;
          defer.resolve();
        },
        error: function(err) {
          defer.reject();
        }
      });
      return defer;
    },
    // 初始化派出所
    changeRecruitsByDeptId: function() {
      // 刷新列表
      this.searchList();
    },
    // 分局级联查询派出所
    changeDeptId: function() {
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/searchDeptsByFenju",
        type: "POST",
        data: {
          parentDeptId: vm.searchForm.supDeptId
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
    // 修改状态下拉框查询
    changeStatus: function() {
      this.searchList();
    },
    // 修改查询时间
    changeSearchTime: function() {
      if (this.searchForm.searchTime) {
        this.searchForm["startTime"] = fjPublic.dateFormatYYMMDD(
          this.searchForm.searchTime[0]
        );
        this.searchForm["endTime"] = fjPublic.dateFormatYYMMDD(
          this.searchForm.searchTime[1]
        );
      } else {
        this.searchForm["startTime"] = "";
        this.searchForm["endTime"] = "";
      }
      this.searchList();
    },
    // 导出
    exportWorkLog: function() {
      document.forms["formExcle"].submit();
    },
    // 删除
    deleteRecruit: function(item) {
      this.$confirm("确定删除该招聘信息吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.confirmDeleteRecruit(item.id);
        })
        .catch(() => {});
    },
    // 审核
    updateRecruit(item) {
      this.$confirm("（" + this.items[item.step].label + "）审核", "提示", {
        confirmButtonText: "通过",
        cancelButtonText: "拒绝",
        type: "warning",
        center: true
      })
        .then(() => {
          this.confirmUpdateRecruit(item.id, "1");
        })
        .catch(() => {
          this.confirmUpdateRecruit(item.id, "2");
        });
    },
    confirmUpdateRecruit: function(id, status) {
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/updRecruitStatus",
        type: "POST",
        data: {
          id: id,
          status: status
        },
        dataType: "json",
        success: function(data) {
          if (data.errorCode == 0) {
            vm.$message({
              type: "success",
              message: data.errorMsg
            });
            vm.searchList();
          } else {
            vm.$message({
              type: "error",
              message: data.errorMsg
            });
          }
          defer.resolve();
        },
        error: function(err) {
          defer.reject();
        }
      });
      return defer;
    },
    confirmDeleteRecruit: function(id) {
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/delRecruit",
        type: "POST",
        data: {
          id: id
        },
        dataType: "json",
        success: function(data) {
          if (data.errorCode == 0) {
            vm.$message({
              type: "success",
              message: data.errorMsg
            });
            vm.searchList();
          } else {
            vm.$message({
              type: "error",
              message: data.errorMsg
            });
          }
          defer.resolve();
        },
        error: function(err) {
          defer.reject();
        }
      });
      return defer;
    },
    /**
     * 查看，编辑，新建
     * @param {*} state 状态0=新增，1=查看，2=编辑
     */
    goDetails: function(data, state) {
      // 招聘详情
      fjPublic.getContentScrollTop();
      fjPublic.contentScrollTop();
      fjPublic.setLocalData("recruitId", data.id);
      fjPublic.setLocalData("recruitStep", data.step);
      this.$router.push({
        path: "/personnel-recruitment-detail",
        query: { id: data.id, step: data.step, state: state }
      });
    },
    addRecruit: function() {
      var defer = $.Deferred();
      var vm = this;
      var educations = [
        {
          eduDate: "2011/09-2014/06",
          schoolName: "四川大学锦城学院",
          majorName: "艺术系表演专业",
          degrees: "全国微电影金锚奖、年度新锐剧星"
        }
      ];
      var works = [
        {
          worDate: "2015/09-2019/03",
          companyName: "唐嫣工作室",
          positionName: "演员"
        }
      ];
      var families = [
        {
          name: "邓辉",
          relation: "丈夫",
          positionName: "导演"
        }
      ];
      console.log(JSON.stringify(families));
      console.log(JSON.stringify(works));
      console.log(JSON.stringify(educations));
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/addRecruit",
        type: "POST",
        data: {
          name: "陈钰琪",
          sex: "2",
          birth: "1992-07",
          nation: "01",
          birthPlace: "四川省成都市",
          marriage: "10",
          phone: "17673055002",
          politics: "01",
          soldier: "0",
          hw: "170/45",
          education: "20",
          idNum: "501104199207297869",
          ePerson: "邓辉",
          ePersonPhone: "17673055042",
          address: "四川省成都市锦城区",
          deptId: "430501010000",
          edus: JSON.stringify(educations),
          fams: JSON.stringify(families),
          wors: JSON.stringify(works)
        },
        dataType: "json",
        success: function(data) {
          if (data.errorCode == 0) {
            vm.$message({
              type: "success",
              message: data.errorMsg
            });
            vm.searchList();
          } else {
            vm.$message({
              type: "error",
              message: data.errorMsg
            });
          }
          defer.resolve();
        },
        error: function(err) {
          defer.reject();
        }
      });
      return defer;
    }
  },
  computed: {},
  beforeDestroy() {},
  components: {
    fjBreadNav
  }
};
</script>
<style scope lang="less">
.workLog {
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
        textarea {
          width: 240px;
        }
      }
    }
  }
}
</style>


