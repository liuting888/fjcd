<template>
  <div class="fj-content_view transtion">
    <div class="fj-block title">
      <fj-breadNav :bread-data="breadData"></fj-breadNav>
    </div>
    <div class="fj-block content">
      <div class="fj-block-head kaohe">
        <p class="title fj-fl">培训列表</p>
      </div>
      <div class="fj-block-body">
        <ul class="filterOpe-area">
          <li class="area-line fj-clear">
            <div class="item fj-fl">
              <span class="fj-fl title">类型：</span>
              <el-select @change="changeMissState" clearable v-model="searchForm.type" class="fj-fl">
                <el-option v-for="item in missionStates" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="item fj-fl">
              <el-button type="primary" @click="openAddOrDetailDialog()"><i class="el-icon-check"></i><span>培训上报</span></el-button>
            </div>
          </li>
        </ul>
        <el-table :data="misData">
          <el-table-column width="40"></el-table-column>
          <el-table-column prop="reportType" width="200" class-name="left" label="培训类型" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>
                {{scope.row.reportType=='1001'?'岗前培训':'夜校培训'}}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="trainConext" class-name="left" label="培训内容"></el-table-column>
          <el-table-column prop="trainAdreess" class-name="left" label="培训地址" show-overflow-tooltip></el-table-column>
          <el-table-column prop="trainUsersAccount" class-name="left" label="参训人员"></el-table-column>
          <el-table-column prop="trainTime" label="培训日期"></el-table-column>
          <el-table-column prop="uploadUserDeptName" label="培训人"></el-table-column>
          <el-table-column prop="publishDate" label="操作">
            <template slot-scope="scope">
              <span class="ope-txt" v-if="scope.row.reportStatus == 1" @click="openAddOrDetailDialog(scope.row)">详情</span>
              <span v-else-if="scope.row.reportStatus == 2">审批未通过</span>
              <span class="ope-txt" v-else @click="isDeleteMission(scope.row.id)">审批</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="mj-page_wrap" v-if="Number(total) > Number(pageSize)">
          <el-pagination :current-page="currentPage" :page-size="pageSize" layout="total,  prev, pager, next" :total="total"
            @current-change="currentPageChange" @prev-click="prevPageChange" @next-click="nextPageChange" @size-change="sizePageChange">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 添加、详情弹出框 -->
    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      @close='clearF'
      width="500px"
      :modal-append-to-body="dialogVisibleModal"
      style="position: absolute">
      <div class="left">
        <el-form :model="dialogForm" :rules="rules" ref="dialogForm">
          <el-form-item label="上报类型" :label-width="formLabelWidth" prop="reportType">
            <el-select clearable v-model="dialogForm.reportType" :disabled="chooseButtonDisabled" :readonly="chooseButtonDisabled"
              class="fj-fl">
              <el-option v-for="item in missionStates" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="培训时间" :label-width="formLabelWidth" prop="trainTime">
            <el-date-picker value-format='yyyyMMdd' :readonly="chooseButtonDisabled" v-model="dialogForm.trainTime"
              class="fj-fl" type="date" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="培训内容" :label-width="formLabelWidth" prop="trainConext">
            <el-input v-model="dialogForm.trainConext" :readonly="chooseButtonDisabled" class="fj-fl" type="textarea"
              :rows="4"></el-input>
          </el-form-item>
          <el-form-item label="参加训人员" :label-width="formLabelWidth" prop="trainUsersAccount">
            <treeselect @input="upTrainUsersAccount" valueFormat="object" :appendToBody="false" :disabled="chooseButtonDisabled"
              :limit="8" value-consists-of="LEAF_PRIORITY" v-model="trainUsersAccount" :multiple="true" :options="chooseForm1.data" />
            <!-- <el-input autocomplete="off" :readonly="chooseButtonDisabled" placeholder="请选择任务执行人" v-model="dialogForm.trainUsersAccount"></el-input>
            <el-button type="primary" @click="openChooseDialog1" :disabled="chooseButtonDisabled">选择</el-button> -->
          </el-form-item>
          <el-form-item label="培训地点" :label-width="formLabelWidth" prop="trainAdreess">
            <el-input v-model="dialogForm.trainAdreess" :readonly="chooseButtonDisabled" class="fj-fl"></el-input>
          </el-form-item>
          <el-form-item label="培训照片" :label-width="formLabelWidth">
            <el-upload class="upload-demo" :disabled="chooseButtonDisabled" ref="uploadfile" :on-change="handleChange"
              action="1" :on-remove="onRemove" :auto-upload="false">
              <el-button size="small" type="primary" :disabled="chooseButtonDisabled">添加附件</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" v-show="hiddenButton">
          <el-button @click="clearF">取 消</el-button>
          <el-button type="primary" @click="saveMission('dialogForm')">确 定</el-button>
        </div>
      </div>
      <!-- <div class="right">
        <el-form :model="chooseForm1" ref="chooseForm1">
          <el-form-item >
            <el-input placeholder="输入关键字进行过滤" v-model="filterText1">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-tree :data="chooseForm1.data" node-key="id" show-checkbox :default-expand-all="isExpandAll" ref="tree1"
              accordion highlight-current class="filter-tree" :filter-node-method="filterNode1" :props="defaultProps">
            </el-tree>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="chooseDialogVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="closeChooseDialog1">确 定</el-button>
        </div>
      </div> -->
    </el-dialog>
  </div>
</template>
<script>
  import fjBreadNav from "@/components/fjBreadNav";
  // import the component
  import Treeselect from "@riophae/vue-treeselect";
  // import the styles
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  export default {
    name: "fjPeixun",
    data: function () {
      return {
        breadData: [{
            name: "当前位置:",
            path: ""
          },
          {
            name: "教培管理",
            path: ""
          },
          {
            name: "培训中心",
            path: ""
          }
        ],
        // 状态下拉框
        missionStates: [{
            value: "1001",
            label: "岗前培训"
          },
          {
            value: "1002",
            label: "夜校培训"
          }
        ],
        // 列表查询参数
        searchForm: {
          type: "" // 类型
        },
        // 列表数据
        misData: [],
        // 分页数据
        currentPage: 1,
        pageSize: 10,
        total: 0,
        // 弹出框数据
        dialogVisible: false,
        dialogVisibleModal: false,
        dialogTitle: "",
        reportId: "",
        dialogForm: {
          reportType: "",
          trainConext: "",
          trainAdreess: "",
          trainUsersAccount: "",
          trainTime: "",
          trainUsersId: ""
        },
        fileList: "",
        form: new FormData(),
        formLabelWidth: "120px",
        hiddenButton: true, // 提交保存按钮div隐藏
        chooseButtonDisabled: false, // 选择按钮禁用
        // 树形选择框数据
        chooseDialogVisible1: false,
        chooseDialogVisibleModal1: false,
        filterText1: "",
        chooseForm1: {
          data: null
        },
        isExpandAll: false,
        defaultProps: {
          children: "children",
          label: "label"
        },
        userDeptId: JSON.parse(fjPublic.getLocalData("userInfo")).deptId,
        trainUsersAccount: null,
        // 表单校验规则
        // 校验规则
        rules: {
          reportType: [{
            required: true, // 是否必填
            message: "上传类型不能为空！", //规则
            trigger: "blur" //何事件触发
          }],
          trainConext: [{
            required: true, // 是否必填
            message: "培训内容不能为空！", //规则
            trigger: "blur" //何事件触发
          }],
          trainAdreess: [{
            required: true, // 是否必填
            message: "培训地点不能为空", //规则
            trigger: "blur" //何事件触发
          }],
          trainUsersAccount: [{
            required: true, // 是否必填
            message: "参培人员不能为空", //规则
            trigger: "change" //何事件触发
          }],
          trainTime: [{
            required: true, // 是否必填
            message: "培训时间不能为空！", //规则
            trigger: "blur" //何事件触发
          }]
        }
      };
    },
    mounted: function () {
      fjPublic.closeLoad();
      // 初始化任务列表
      this.searchMissionListByCnd();
      this.openChooseDialog1();
      return;
    },
    beforeRouteEnter:function(to,from,next){
        next(function(vm){
            fjPublic.closeLoad();
        });
    },
    methods: {
      currentPageChange: function (pageNum) {
        // 点击某个分页按钮
        this.currentPage = pageNum;
        this.searchMissionListByCnd();
      },
      prevPageChange: function (pageNum) {
        // 点击分页的上一页
        this.currentPage = pageNum;
        this.searchMissionListByCnd();
      },
      nextPageChange: function (pageNum) {
        // 点击分页的下一页
        this.currentPage = pageNum;
        this.searchMissionListByCnd();
      },
      sizePageChange: function (pageSize) {
        // 改变每页条数时
        this.currentPage = 1;
        this.pageSize = pageSize;
        this.searchMissionListByCnd();
      },
      // 修改状态下拉框查询
      changeMissState: function (missionState) {
        this.searchForm["type"] = missionState;
        this.searchMissionListByCnd();
      },

      // 获取培训列表
      searchMissionListByCnd: function () {
        var defer = $.Deferred();
        var vm = this;
        // 参数
        this.searchForm["page"] = this.currentPage;
        this.searchForm["rows"] = this.pageSize;
        // 传入当前用户信息
        this.searchForm["nowUser"] = $.cookie(fjPublic.loginCookieKey);
        $.ajax({
          url: fjPublic.ajaxUrlDNN + "/selectTrainInfo",
          type: "POST",
          data: vm.searchForm,
          dataType: "json",
          success: function (data) {
            vm.misData = null;
            data.list.forEach(element => {
              element.trainTime = fjPublic
                .dateStrFormat(element.trainTime)
                .replace(/:/g, "");
            });

            vm.misData = data.list;
            vm.total = data.total;
            defer.resolve();
          },
          error: function (err) {
            defer.reject();
          }
        });
        return defer;
      },
      // 审批
      isDeleteMission: function (id, type) {
        this.$confirm("是否通过该审批申请", "提示", {
            confirmButtonText: "通过",
            cancelButtonText: "不通过",
            type: "warning",
            distinguishCancelAndClose:true,
            center: true,
            closeOnPressEscape: false
          })
          .then(res => {
            if (res) {
              this.deleteMission(id, "1");
            }
          })
          .catch(res => {
            if (res === "cancel") {
              this.deleteMission(id, "2");
            } else {
               this.$message({
                message: "放弃审批"
              });
            }
          });
      },
      //  审批
      deleteMission: function (id, type) {
        var defer = $.Deferred();
        var vm = this;
        $.ajax({
          url: fjPublic.ajaxUrlDNN + "/updateTrainStatus",
          type: "POST",
          data: {
            id: id,
            status: type
          },
          dataType: "json",
          success: function (data) {
            if (data.errorCode == 0) {
              vm.searchMissionListByCnd();
            }
            if (data.errorCode == 0) {
              vm.$message.success({
                message: data.errorMsg
              });
            } else {
              vm.$message.error({
                message: data.errorMsg
              });
            }
            defer.resolve();
          },
          error: function (err) {
            defer.reject();
          }
        });
      },
      getReportId() {
        var vm = this;
        var defer = $.Deferred();
        $.ajax({
          url: fjPublic.ajaxUrlDNN + "/getTrainId",
          type: "POST",
          data: {},
          dataType: "json",
          success: function (data) {
            vm.reportId = data.id;
            defer.resolve();
          },
          error: function (err) {
            defer.reject();
          }
        });
      },
      // 打开添加或详情弹出框
      openAddOrDetailDialog: function (mission) {
        if (mission) {
          this.hiddenButton = false;
          this.chooseButtonDisabled = true;
          this.dialogTitle = "详情";
          this.dialogForm["reportType"] = mission.reportType;
          this.dialogForm["trainConext"] = mission.trainConext;
          this.dialogForm["trainAdreess"] = mission.trainAdreess;
          this.dialogForm["trainUsersAccount"] = mission.trainUsersAccount;
          this.dialogForm["trainUsersId"] = mission.trainUsersId;
          var arr = [];
          var labelA = mission.trainUsersAccount.split(',');
          var idA = mission.trainUsersId.split(',');
          labelA.forEach((el, index) => {
            var item = {};
            item.label = el;
            item.id = idA[index];
            arr.push(item);
          })
          this.trainUsersAccount = arr;
          this.dialogForm["trainTime"] = mission.trainTime;
        } else {
          this.getReportId();
          this.dialogForm["reportType"] = "";
          this.dialogForm["trainConext"] = "";
          this.dialogForm["trainAdreess"] = "";
          this.dialogForm["trainUsersAccount"] = "";
          this.dialogForm["trainTime"] = "";

          this.dialogTitle = "添加";
          this.hiddenButton = true;
          this.chooseButtonDisabled = false;
        }
        this.dialogVisible = true;
      },
      // 获取人员
      openChooseDialog1: function () {
        var defer = $.Deferred();
        var vm = this;
        // 初始化下拉列表
        $.ajax({
          url: fjPublic.ajaxUrlDNN + "/getTreeDeptPersonData",
          type: "POST",
          data: {
            type: 1,
            nowUser: $.cookie(fjPublic.loginCookieKey)
          },
          dataType: "json",
          success: function (data) {
            vm.chooseForm1.data = data;
            defer.resolve();
          },
          error: function (err) {
            defer.reject();
          }
        });
      },
      handleChange(file, list) {
        var vm = this;
        vm.fileList = list;
      },
      onRemove(file, list) {
        var vm = this;
        this.fileList.forEach((v, i) => {
          if (v == file.response) {
            vm.fileList.splice(i, 1);
          }
        });
      },
      // 保存培训上传
      saveMission: function (formName) {

        this.$refs[formName].validate(valid => {
          if (valid) {
            var defer = $.Deferred();
            var vm = this;
            vm.dialogForm["reportId"] = vm.reportId;
            vm.dialogForm["nowUser"] = $.cookie(fjPublic.loginCookieKey);
            vm.dialogVisible = false;
            $.ajax({
              url: fjPublic.ajaxUrlDNN + "/insertTrain",
              type: "POST",
              data: vm.dialogForm,
              dataType: "json",
              success: function (data) {
                if (data.errorCode == 0) {
                  if (vm.fileList && vm.fileList.length) {
                    vm.fileUpload();
                  } else {
                    vm.searchMissionListByCnd();
                    vm.$message.success({
                      message: data.errorMsg
                    });
                  }
                }
                defer.resolve();
              },
              error: function (err) {
                defer.reject();
              }
            });
          } else {
            this.$message({
              message: "请完善输入框！",
              type: "warning"
            });
            return false;
          }
        });
      },
      //文件上传 //
      fileUpload() {
        var vm = this;
        var fArr = [];

        vm.fileList.forEach((el, index) => {
          fArr.push(el.raw);
        });
        this.form.append("reportType", vm.dialogForm.reportType);
        fArr.forEach((el, index) => {
          this.form.append("selectId" + index, fArr[index]);
        });
        this.form.append("reportId", vm.reportId);
        this.form.append("nowUser", $.cookie(fjPublic.loginCookieKey));
        vm.$http
          .post(fjPublic.ajaxUrlDNN + "/uploadTrain", vm.form, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          .then(res => {
            var res = res.body;
            vm.dialogVisible = false;
            vm.searchMissionListByCnd();
            if (res.errorCode == 0) {
              vm.$message.success({
                message: res.errorMsg
              });
            } else {
              vm.$message.error({
                message: res.errorMsg
              });
            }
          })
          .catch();
      },
      upTrainUsersAccount(value, instanceId) {
        this.dialogForm.trainUsersAccount = "";
        this.dialogForm.trainUsersId = "";
        for (var i = 0; i < this.trainUsersAccount.length; i++) {
          if (i === this.trainUsersAccount.length - 1) {
            this.dialogForm.trainUsersId += this.trainUsersAccount[i].id;
            this.dialogForm.trainUsersAccount += this.trainUsersAccount[i].label;
          } else {
            if (!this.trainUsersAccount[i].children) {
              this.dialogForm.trainUsersId += this.trainUsersAccount[i].id + ",";
              this.dialogForm.trainUsersAccount +=
                this.trainUsersAccount[i].label + ",";
            }
          }
        }
      },

      clearF() {
        this.form = new FormData();
        this.dialogVisible = false;
        this.trainUsersAccount = null;
        this.dialogForm = {
          reportType: "",
          trainConext: "",
          trainAdreess: "",
          trainUsersAccount: "",
          trainTime: "",
          trainUsersId: ""
        };
        this.$refs.uploadfile.clearFiles();
      }
    },
    components: {
      fjBreadNav,
      Treeselect
    }
  };
</script>
<style scope>
  .transtion .el-table .cell {
    box-sizing: border-box !important;
    white-space: nowrap !important;
    line-height: 23px !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }

  .fj-fl.el-textarea {
    width: 100% !important;
  }

  .left .el-input,.left .vue-treeselect,.left .el-textarea {
    width: 300px !important;
  }

  .el-dialog__body::after {
    content: "";
    display: block;
    clear: both;
  }

  .dialog-footer {
    text-align: center;
    padding-bottom: 40px;
  }

  .vue-treeselect {
    line-height: initial;
  }

  .fj-content_view .el-table th.left,
  .fj-content_view .el-table td.left {
    text-align: left;
  }

  /* .v-modal {
    position: relative !important;
  } */
</style>
