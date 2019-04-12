<template>
  <div class="fj-content_view work-mis mission">
    <div class="fj-block title">
      <fj-breadNav :bread-data="breadData"></fj-breadNav>
    </div>
    <div class="fj-block content">
      <div class="fj-block-head kaohe">
        <el-tabs v-model="searchForm.tabState" @tab-click="changeMissState">
          <el-tab-pane :label="'待处理' + '(' + tabData.dealNum + ')'" name="0">待处理111</el-tab-pane>
          <el-tab-pane :label="'进行中' + '(' + tabData.conductNum + ')'" name="1">进行中</el-tab-pane>
          <el-tab-pane :label="'待审核' + '('  + tabData.checkNum + ')'" name="2">待审核</el-tab-pane>
          <el-tab-pane :label="'已完成' + '(' + tabData.checkedNum + ')'" name="3">已完成</el-tab-pane>
          <el-tab-pane label="全部" name="4">全部</el-tab-pane>
        </el-tabs>
      </div>
      <div class="fj-block-body">
        <div class="fj-search-inline">
          <el-row>
            <el-form inline>
              <el-col :xs="8" :sm="12" :md="16" :lg="24" :xl="18">
                
                <el-form-item label="任务类型：">
                  <el-select
                    @change="changeMissionType"
                    clearable
                    v-model="searchForm.missionType"
                    size="small"
                  >
                    <el-option
                      v-for="item in missionTypes"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="起止日期："
                    class="datepicker">
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
                  <el-input
                    v-model="searchForm.titleOrName"
                    clearable
                    placeholder="请输入标题"
                    size="small"
                    class="search-input"
                  >
                    <el-button slot="append" @click="searchMission">搜索</el-button>
                  </el-input>
                </el-form-item>
                
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="openAddOrDetailDialog()" size="small">
                    <i class="el-icon-plus"></i>
                    <span>派发任务</span>
                  </el-button>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </div>
        <el-table :data="misData">
          <el-table-column prop="title" label="任务标题" show-overflow-tooltip class-name="textLeft" width="300px"></el-table-column>
          <el-table-column label="任务类型">
            <template slot-scope="scope">
              <p>{{scope.row.missionType | getMissionType}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="负责人"></el-table-column>
          <el-table-column prop="acceptUserName" label="执行人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip :formatter="timeFormatter"></el-table-column>
          <el-table-column prop="planStartTime" label="计划时间" show-overflow-tooltip :formatter="timeFormatter"></el-table-column>

          <el-table-column prop="startTime" label="执行时间" show-overflow-tooltip :formatter="timeFormatter"></el-table-column>
          <el-table-column label="任务状态" width="120px" class-name="textLeft">
            <template slot-scope="scope">
              <div class="circle-status" :class="
                parseInt( scope.row.status) === 0 ? 'grey' : parseInt( scope.row.status) === 1 ?'blue'
                  : parseInt( scope.row.status) === 2 ?'orange':'green'
              ">
                <p>{{parseInt( scope.row.status) === 0 ? '待处理' : parseInt( scope.row.status) === 1 ?'进行中'
                  : parseInt( scope.row.status) === 2 ?'待审核':'已完成'}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span class="ope-txt" @click="openAddOrDetailDialog(scope.row)">详情</span>
              <span class="ope-txt" @click="isDeleteMission(scope.row.id)">删除</span>
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
    <!-- 添加、详情弹出框，这里的样式在reset.css改 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :append-to-body = true
      :close-on-click-modal="false"
      style="position: absolute"
      @close="closeDialog"
      width="580px"
      top="8vh"
      class="mission-dialogs"
    >
      <el-form :model="dialogForm" :rules="rules" ref="dialogForm">
        <el-row>
          <el-col>
            <el-form-item label="任务类型" :label-width="formLabelWidth" prop="missionType">
              <template>
                <el-radio
                  v-model="dialogForm.missionType"
                  :disabled="chooseButtonDisabled"
                  label="0"
                >普通任务</el-radio>
                <el-radio
                  v-model="dialogForm.missionType"
                  :disabled="chooseButtonDisabled"
                  label="1"
                >紧急任务</el-radio>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="任务标题" :label-width="formLabelWidth" prop="missionTitle">
              <el-input
                autocomplete="off"
                placeholder="请输入任务标题"

                :disabled="chooseButtonDisabled"
                v-model="dialogForm.missionTitle"

              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="任务负责人" :label-width="formLabelWidth" prop="leadPerson_name">

              <!--<el-button
                type="primary"
                @click="openChooseDialog"
                :disabled="chooseButtonDisabled"
              >选择</el-button>-->
              <treeselect
                placeholder="请选择任务负责人"
                :disabled="chooseButtonDisabled"
                v-model="dialogForm.leadPerson_name"
                :options="fromData"
                :disable-branch-nodes="true"
                value-consists-of="LEAF_PRIORITY"
                size="small"
                v-if="dialogForm.missionState == 0">
                <div slot="value-label" slot-scope="{ node,labelClassName }"  :class="labelClassName">{{ node.raw.label || '无数据' }}</div>
              </treeselect>
              <el-input
                autocomplete="off"
                placeholder="请选择任务负责人"
                :disabled="chooseButtonDisabled"
                v-model="dialogForm.leadPerson_name"
                 v-if=" dialogForm.missionState == 1 || dialogForm.missionState == 2 || dialogForm.missionState == 3">
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="任务执行人" :label-width="formLabelWidth" prop="createPerson_name">

              <!-- <el-button
                type="primary"
                @click="openChooseDialog1"
                :disabled="chooseButtonDisabled"
              >选择</el-button> -->
              <el-tooltip class="item" effect="dark" :content="dialogForm.createPerson_name" placement="right-start"
              v-if=" dialogForm.missionState == 1 || dialogForm.missionState == 2 || dialogForm.missionState == 3">
                <el-input

                  autocomplete="off"
                  placeholder="请选择任务执行人"
                  :disabled="chooseButtonDisabled"
                  v-model="dialogForm.createPerson_name"
                ></el-input>
              </el-tooltip>
              <treeselect
                placeholder="请选择任务执行人"
                :defaultOptions="defaultOptions"
                v-model="dialogForm.createPerson_name"
                value-consists-of="LEAF_PRIORITY"
                :multiple="true"
                :options="fromData1"
                sortValueBy="ORDER_SELECTED"
                size="small"
                v-if="dialogForm.missionState == 0 || !dialogForm.missionState"
                >
                <div slot="value-label" slot-scope="{ node,labelClassName }"  :class="labelClassName">{{ node.raw.label  || '无数据' }}</div>
              </treeselect>


            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="计划开始时间" :label-width="formLabelWidth" prop="planStart">
              <el-date-picker
                v-model="dialogForm.planStart"
                type="date"
                :disabled="chooseButtonDisabled"
                :picker-options="{
                  disabledDate(time) {
                      return time.getTime() < Date.now() - 8.64e7;//如果没有后面的-8.64e7就是不可以选择今天的
                  }
                }"
                placeholder="选择开始日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="计划完成时间" :label-width="formLabelWidth" prop="planEnd">
              <el-date-picker
                v-model="dialogForm.planEnd"
                :disabled="chooseButtonDisabled"
                type="date"
                placeholder="选择完成日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="21">
            <el-form-item label="任务描述" :label-width="formLabelWidth" prop="description">
              <el-input
                type="textarea"
                :rows="3"
                :disabled="chooseButtonDisabled"
                placeholder="请输入任务描述"
                v-model="dialogForm.description"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col >
            <el-form-item
              :hidden="auditInputHidden"
              label="执行开始时间"
              :label-width="formLabelWidth"
              prop="startTime"
            >
              <el-date-picker
                v-model="dialogForm.startTime"
                type="date"
                :disabled="chooseButtonDisabled"
                placeholder="选择开始日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col >
            <el-form-item
              :hidden="auditInputHidden"
              label="执行完成时间"
              :label-width="formLabelWidth"
              prop="finishTime"
            >
              <el-date-picker
                v-model="dialogForm.finishTime"
                :disabled="chooseButtonDisabled"
                type="date"
                placeholder="选择完成日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="21">
            <el-form-item
              :hidden="auditInputHidden"
              label="执行情况"
              :label-width="formLabelWidth"
              prop="execResult"
            >
              <el-input
                type="textarea"
                :rows="3"
                :disabled="chooseButtonDisabled"
                placeholder
                v-model="dialogForm.execResult"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="21">
            <el-form-item
              :hidden="auditInputHidden"
              label="审核意见"
              :label-width="formLabelWidth"
              prop="auditor_opinion"
            >
              <el-input
                type="textarea"
                :rows="3"
                :disabled="auditInputDisabled"
                placeholder
                v-model="dialogForm.auditor_opinion"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" v-show="hiddenButton">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="saveMission('dialogForm')"
          :value="submitButtonValue"
        >{{ submitButtonValue }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import "element-ui/lib/theme-chalk/display.css";
import fjBreadNav from "@/components/fjBreadNav";
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: "fjWorkManageMis",
  data: function() {
    const timeValidate = (rule,value,callback) => {
      if (!this.dialogForm.planStart) {
        this.dialogForm.planEnd = ''
        callback(new Error('请先选择计划开始时间'))
      } else {
        let timeStart = new Date(this.dialogForm.planStart)
        let yearStart = timeStart.getFullYear()
        let monthStart = timeStart.getMonth() + 1
        let dayStart = timeStart.getDate()
        let timeEnd = new Date(value)
        let yearEnd = timeEnd.getFullYear()
        let monthEnd = timeEnd.getMonth() + 1
        let dayEnd = timeEnd.getDate()
        let fullStart = yearStart + '-' + monthStart + '-' + dayStart
        let fullEnd = yearEnd + '-' + monthEnd + '-' + dayEnd
        if ( new Date(fullStart)- new Date(fullEnd) > 0) {
          callback(new Error('计划开始时间必须小于计划完成时间'))
        } else {
          callback()
        }
      }
    }
    return {
      breadData: [
        { name: "当前位置:", path: "" },
        { name: "工作管理", path: "" },
        { name: "工作任务", path: "" }
      ],
      // 状态下拉框
      missionStates: [
        {
          value: "0",
          label: "待处理"
        },
        {
          value: "1",
          label: "进行中"
        },
        {
          value: "2",
          label: "待审核"
        },
        {
          value: "3",
          label: "已完成"
        }
      ],
      // 类型下拉框
      missionTypes: [
        {
          value: "0",
          label: "普通任务"
        },
        {
          value: "1",
          label: "紧急任务"
        }
      ],
      // 列表查询参数
      searchForm: {
        missionState: "0", // 状态 默认0
        searchTime: "", // 查询时间
        titleOrName: "", // 标题或负责人名称
        missionType: "", // 类型
        tabState: 0
      },
      // 列表数据
      misData: [
        // {
        //   acceptUserName: "",
        //   createTime: "",
        //   description: "",
        //   id: "",
        //   planEndTime: "",
        //   planStartTime: "",
        //   startTime: "",
        //   status: "",
        //   title: "",
        //   userName: ""
        // }
      ],
      // 分页数据
      currentPage: 1,
      pageSize: 10,
      total: 0,
      // 顶部标签栏数据
      tabData: {
        dealNum: 0, // 待处理
        conductNum: 0,   //进行中
        checkNum: 0,  //待审核
        checkedNum: 0  //已完成
      },
      // 弹出框数据
      dialogVisible: false,
      dialogVisibleModal: false,
      dialogTitle: "",
      dialogForm: {
        id: "",
        missionTitle: "",
        leadPerson_id: "",
        leadPerson_name: null,
        createPerson_id: "",
        createPerson_name: null,
        planStart: "",
        planEnd: "",
        description: "",
        missionType: "0",
        finishTime: "",
        startTime: "",
        auditor_opinion: "",
        execResult: "",
        value: null
      },
      formLabelWidth: "120px",
      hiddenButton: true, // 提交保存按钮div隐藏
      chooseButtonDisabled: false, // 选择按钮禁用
      auditInputHidden: true, // 审核隐藏
      auditInputDisabled: false, // 审核禁用
      submitButtonValue: "派发",
      // 树形选择框数据
      chooseDialogVisible: false,
      chooseDialogVisibleModal: false,
      chooseDialogVisible1: false,
      chooseDialogVisibleModal1: false,
      filterText: "",
      filterText1: "",
      chooseForm: {
        data: null
      },
      chooseForm1: {
        data: null
      },
      isExpandAll: false,
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 表单校验规则
      // 校验规则
      rules: {
        missionTitle: [
          {
            required: true, // 是否必填
            message: "标题不能为空！", //规则
            trigger: "blur" //何事件触发
          }
        ],
        leadPerson_name: [
          {
            required: true, // 是否必填
            message: "负责人员不能为空！", //规则
            trigger: "blur" //何事件触发
          }
        ],
        createPerson_name: [
          {
            required: true, // 是否必填
            message: "执行人员不能为空！", //规则
            trigger: "blur" //何事件触发
          }
        ],
        planStart: [
          {
            required: true, // 是否必填
            message: "开始时间不能为空！", //规则
            trigger: "blur" //何事件触发
          }
        ],
        planEnd: [
          {
            required: true, // 是否必填
            message: "计划完成时间不能为空！", //规则
            trigger: "blur" //何事件触发
          },
          {
            validator: timeValidate,
             trigger: "blur" //何事件触发
          }
        ],
        description: [
          {
            required: true, // 是否必填
            message: "描述不能为空！", //规则
            trigger: "blur" //何事件触发
          }
        ],
        missionType: [
          {
            required: true, // 是否必填
            message: "类型不能为空！", //规则
            trigger: "blur" //何事件触发
          }
        ]
      },
      // 穿梭框
      fromData: [],
      fromData1: [],
      toData:[],
      defaultOptions: []
    };
  },
  watch: {
    // 监听过滤
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    // 监听过滤1
    filterText1(val) {
      this.$refs.tree1.filter(val);
    }
  },
  mounted: function() {
    // 初始化任务列表
    this.searchMissionListByCnd();
    return;
  },
  filters: {
    // 状态处理
    getMissionStateName: function(value) {
      return value == 0
        ? "待处理"
        : value == 1
        ? "进行中"
        : value == 2
        ? "待审核"
        : value == 3
        ? "已完成"
        : "";
    },
    getMissionType: function (value) {
      return value == '0' ? '普通任务' : value == 1 ? '紧急任务' : '';
    }
  },
  methods: {
    currentPageChange: function(pageNum) {
      // 点击某个分页按钮
      this.currentPage = pageNum;
      this.searchMissionListByCnd();
    },
    prevPageChange: function(pageNum) {
      // 点击分页的上一页
      this.currentPage = pageNum;
      this.searchMissionListByCnd();
    },
    nextPageChange: function(pageNum) {
      // 点击分页的下一页
      this.currentPage = pageNum;
      this.searchMissionListByCnd();
    },
    sizePageChange: function(pageSize) {
      // 改变每页条数时
      this.currentPage = 1;
      this.pageSize = pageSize;
      this.searchMissionListByCnd();
    },
    // 修改状态下拉框查询
    changeMissState: function(tab) {
      let state = parseInt(tab.name) === 4 ? '' : parseInt(tab.name)
      this.currentPage = 1
      this.searchForm["missionState"] = state
      this.searchMissionListByCnd();
    },
    // 修改类型下拉框查询
    changeMissionType: function(missionType) {
      this.searchForm["missionType"] = missionType;
      this.searchMissionListByCnd();
    },
    // 标题或负责人名称查询
    searchMission: function(missionState) {
      this.searchMissionListByCnd();
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
      this.searchMissionListByCnd();
    },
    // 获取任务列表
    searchMissionListByCnd: function() {
      var defer = $.Deferred();
      var vm = this;
      // 参数
      this.searchForm["page"] = this.currentPage;
      this.searchForm["rows"] = this.pageSize;
      // 传入当前用户信息
      this.searchForm["nowUser"] = $.cookie(fjPublic.loginCookieKey);
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/searchMissionListByCnd",
        type: "POST",
        data: vm.searchForm,
        dataType: "json",
        success: function(data) {
          vm.misData = null;
          vm.misData = data.list;
          vm.total = data.total;
          vm.tabData = {
            dealNum: data.dealNum,
            conductNum: data.conductNum,
            checkNum: data.checkNum,
            checkedNum: data.checkedNum
          }
          _.each(vm.misData, function(item, i) {
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
    // 是否删除
    isDeleteMission: function(id) {
      this.$confirm("此操作将删除该纪录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.deleteMission(id);
        })
    },
    // 删除任务
    deleteMission: function(id) {
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/deleteMission",
        type: "POST",
        data: {
          missionId: id
        },
        dataType: "json",
        success: function(data) {
          if (data.errorCode == 0) {
            vm.$message({
                message: '删除成功',
                type: 'success'
            })
            vm.searchMissionListByCnd();
          } else {
            vm.$message.error(data.errorMsg)
          }
          defer.resolve();
        },
        error: function(err) {
          defer.reject();
        }
      });
    },
    // 打开添加或详情弹出框
    openAddOrDetailDialog: function(mission) {
      // 请求下拉框数据
      if (!(this.fromData && this.fromData.length) || !(this.fromData1 && this.fromData1.length)) {
        this.openChooseDialog()
        this.openChooseDialog1()
      } else {
        this.dialogVisible = true
      }
      if (mission) {
        this.dialogForm["missionType"] = mission.missionType;
        this.dialogForm["missionTitle"] = mission.title;
        mission.userId  && (this.dialogForm["leadPerson_name"] = mission.userId.split(','))
        mission.acceptUserId && (this.dialogForm["createPerson_name"] = mission.acceptUserId.split(','))
        this.dialogForm["planStart"] = mission.planStartTime;
        this.dialogForm["planEnd"] = mission.planEndTime;
        this.dialogForm["description"] = mission.description;
        this.dialogForm["missionState"] = mission.status;
        // 待处理，可修改
        if (mission.status == 0) {
          this.dialogForm["missionId"] = mission.id;
          this.dialogForm["missionState"] = mission.status;

          this.dialogTitle = "详情（任务待处理）";
          this.hiddenButton = true;
          this.chooseButtonDisabled = false;
          this.auditInputHidden = true;
          this.submitButtonValue = "修 改";
          // 进行中，不可修改
        } else if (mission.status == 1) {
          this.dialogForm["leadPerson_name"] = mission.userName
          this.dialogForm["createPerson_name"] = mission.acceptUserName
          this.dialogTitle = "详情（任务进行中）";
          this.dialogForm["missionState"] = mission.status;
          this.hiddenButton = false;
          this.chooseButtonDisabled = true;
          this.auditInputHidden = true;
          // 待审核，审核
        } else if (mission.status == 2) {
          this.dialogForm["missionId"] = mission.id;
          this.dialogForm["startTime"] = mission.startTime;
          this.dialogForm["finishTime"] = mission.finishTime;
          this.dialogForm["leadPerson_name"] = mission.userName
          this.dialogForm["createPerson_name"] = mission.acceptUserName
          this.dialogForm["execResult"] = mission.execResult;
          this.dialogTitle = "详情（任务待审核）";
          this.hiddenButton = true;
          this.chooseButtonDisabled = true;
          this.auditInputHidden = false;
          this.auditInputDisabled = false;
          this.submitButtonValue = "已完成";
        } else {
          this.dialogForm["leadPerson_name"] = mission.userName
          this.dialogForm["createPerson_name"] = mission.acceptUserName
          this.dialogForm["startTime"] = mission.startTime;
          this.dialogForm["finishTime"] = mission.finishTime;
          this.dialogForm["execResult"] = mission.execResult;
          this.dialogForm["auditor_opinion"] = mission.auditor_opinion;
          this.dialogTitle = "详情（任务审核完成）";
          this.hiddenButton = false;
          this.chooseButtonDisabled = true;
          this.auditInputHidden = false;
          this.auditInputDisabled = true;
        }
      } else {
        this.dialogForm["missionType"] = "0";
        this.dialogForm["missionTitle"] = "";
        this.dialogForm["leadPerson_name"] = null;
        this.dialogForm["createPerson_name"] = null;
        this.dialogForm["planStart"] = "";
        this.dialogForm["planEnd"] = "";
        this.dialogForm["description"] = "";
        this.dialogForm.missionState = ''
        this.dialogTitle = "派发任务";
        this.dialogForm.missionId = ''
        this.submitButtonValue = '派发'
        this.hiddenButton = true;
        this.auditInputHidden = true
        this.chooseButtonDisabled = false;
      }
    },
    openChooseDialog: function() {
      var defer = $.Deferred();
      var vm = this;
      vm.filterText = "";
      const loading = this.$loading({
        lock: true,
        text: '正在加载数据请稍后',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      // 初始化下拉列表
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/getTreeDeptPersonData",
        type: "POST",
        data: {
          type: 0,
          nowUser: $.cookie(fjPublic.loginCookieKey)
        },
        dataType: "json",
        success: function(data) {
          vm.chooseForm.data = data;
          vm.fromData = data
           vm.dialogVisible = true
          loading.close()
          defer.resolve();
        },
        error: function(err) {
          loading.close()
          defer.reject();
        }
      });

      // this.chooseDialogVisible = true;
    },
    // 打开选择人员弹出框
    openChooseDialog1: function() {
      var defer = $.Deferred();
      var vm = this;
      vm.filterText1 = "";
      const loading = this.$loading({
        lock: true,
        text: '正在加载数据请稍后',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      // 初始化下拉列表
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/getTreeDeptPersonData",
        type: "POST",
        data: {
          type: 1,
          nowUser: $.cookie(fjPublic.loginCookieKey)
        },
        dataType: "json",
        success: function(data) {
          vm.chooseForm1.data = data;
          vm.fromData1 = data
          vm.dialogVisible = true
          loading.close()
          defer.resolve();
        },
        error: function(err) {
          loading.close()
          defer.reject();
        }
      })
    },
    // 保存工作任务
    saveMission: function(formName) {
      // 传入当前用户信息
      this.dialogForm['nowUser'] = $.cookie(fjPublic.loginCookieKey);
      this.$refs[formName].validate(valid => {
        if (valid) {
          var defer = $.Deferred();
          var vm = this;
          // 如果是时间对象，则格式化
          if (typeof vm.dialogForm.planStart == "object") {
            vm.dialogForm["planStart"] = fjPublic.dateFormatYYMMDDHMS(
              vm.dialogForm.planStart
            );
          }
          if (typeof vm.dialogForm.planEnd == "object") {
            vm.dialogForm["planEnd"] = fjPublic.dateFormatYYMMDDHMS(
              vm.dialogForm.planEnd
            );
          }
          vm.dialogForm.leadPerson_id = vm.dialogForm.leadPerson_name
         
          if (Object.prototype.toString.call(vm.dialogForm.createPerson_name) === '[object Array]') {
            vm.dialogForm.createPerson_id = vm.dialogForm.createPerson_name.join(',')
          }
          if (vm.dialogForm.missionId) {
            $.ajax({
              url: fjPublic.ajaxUrlDNN + "/updateMission",
              type: "POST",
              data: vm.dialogForm,
              dataType: "json",
              success: function(data) {
                if (data.errorCode == 0) {
                  vm.dialogVisible = false;
                  vm.$message({
                    message: '操作成功',
                    type: 'success'
                  })
                  vm.searchMissionListByCnd();
                } else {
                  vm.$message.error(data.errorMsg)
                }
                defer.resolve();
              },
              error: function(err) {
                defer.reject();
              }
            });
          } else {
            $.ajax({
              url: fjPublic.ajaxUrlDNN + "/saveMission",
              type: "POST",
              data: vm.dialogForm,
              dataType: "json",
              success: function(data) {
                if (data.errorCode == 0) {
                  vm.dialogVisible = false;
                  vm.$message({
                    message: '操作成功',
                    type: 'success'
                  })
                  vm.searchMissionListByCnd();
                } else {
                   vm.$message.error(data.errorMsg)
                }
                defer.resolve();
              },
              error: function(err) {
                vm.$message.error('网络错误')
                defer.reject();
              }
            });
          }
        } else {
          this.$message({
            message: "请完善输入框！",
            type: "error"
          });
          return false;
        }
      });
    },
    // 下拉过滤
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 下拉过滤1
    filterNode1(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
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
      this.$refs.dialogForm.resetFields()
    }
  },
  components: {
    fjBreadNav,
    Treeselect
  }
};
</script>
<style scope lang="less">
.mission {
  .fj-block-head {
    /deep/ .el-tabs__item {
      height: 51px;
      line-height: 51px;
    }
    /deep/ .el-tabs__active-bar{
      height: 3px;
    }
    border-bottom: none;
  }
  .el-table {
    .ope-txt{
      &:first-child {
        border-right: 1px solid #E9E9E9;
        padding-right: 12px;
      }
    }
    .textLeft {
      text-align: left;
    }
    .circle-status{
      display: flex;
      position: relative;
      align-items: center;
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
      &.orange {
        &::before {
          background:#FACC14;
        }
      }
      &.blue {
        &::before {
          background:#1890FF;
        }
      }
      &::before{
        display: block;
        margin-right: 5px;
        content: '';
        width:6px;
        height:6px;
        background:rgba(171,171,171,1);
        border-radius:50%;
        opacity:1;
        top: 8px;
        left: -10px;
      }
    }
  }
  .fj-search-inline{
    /deep/ .el-row {
      .el-form-item {
        margin:15px 10px;
        &.datepicker {
          .el-form-item__content {
            line-height: 43px;
          }
        }

        .search-input {
          width: 260px;
          .el-input-group__append {
            background-color: #1890FF;
            border-color: #1890FF;
            color:#fff;
          }
        }
      }
      .time-item {
          .el-input {
            width: 350px;
          }
        }
    }
  }
  /* 分页器位置*/
.fj-content_view {
  .mj-page_wrap {
    /deep/ .el-pagination {
      text-align: right;
    }
  }
  // 任务标题居中
  .el-table td:first-child,
  .el-table th:first-child {
    text-align: left;
  }


  .el-input.is-disabled .el-input__inner, .el-textarea.is-disabled .el-textarea__inner {
   color: rgba(0,0,0,.15);
  }
  .el-radio__input.is-disabled {
    color:#000;
  }
}
}

</style>


