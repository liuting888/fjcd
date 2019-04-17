<template>
  <div class="fj-content_view archives">
    <div class="fj-content_view_mask">
      <div class="fj-block title">
        <fj-breadNav :bread-data="breadData"></fj-breadNav>
      </div>
      <div class="fj-block content">
        <div class="fj-block-head kaohe">
          <el-tabs v-model="activeIndex" @tab-click="handleClick">
            <el-tab-pane label="档案信息" name="0"></el-tab-pane>
            <el-tab-pane label="工资信息" name="1"></el-tab-pane>
            <el-tab-pane label="合同信息" name="2"></el-tab-pane>
          </el-tabs>
          <!-- <div class="archives-footer-btn" v-if="userInfo.state==0||userInfo.state==2"> -->
          <div class="archives-footer-btn">
            <el-button
              type="primary"
              @click="submitForm(1)"
              v-if="userInfo.state==0&&activeIndex==0"
            >保存</el-button>
            <el-button @click="submitForm(2)">导出</el-button>
          </div>
        </div>
        <div class="fj-block-body">
          <!-- 档案信息 -->
          <div class="archives-form-area" v-if="activeIndex==0">
            <!-- 岗位信息 -->
            <p class="form-title">岗位信息</p>
            <el-form :model="ruleForm">
              <div class="form-info">
                <div class="info-img">
                  <img src="static/images/recruit-people.svg" alt="个人照片">
                </div>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="姓名">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" label="岗位级别">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="警号">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" label="入职日期">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="直接上级">
                      <el-input
                        v-model="ruleForm.houseNumber"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" label="转正日期">
                      <el-input
                        v-model="ruleForm.plots"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item class="noBB" label="所属派出所">
                      <el-input
                        v-model="ruleForm.houseNumber"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-form>
            <!-- 基本信息 -->
            <p class="form-title">基本信息</p>
            <el-form :model="ruleForm">
              <div class="form-info">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="出生年月">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" label="性别">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="籍贯">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" label="民族">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="本人电话">
                      <el-input
                        v-model="ruleForm.houseNumber"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" label="婚否">
                      <el-input
                        v-model="ruleForm.plots"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="是否退役士兵/见义勇为人员">
                      <el-input
                        v-model="ruleForm.houseNumber"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" label="政治面貌">
                      <el-input
                        v-model="ruleForm.plots"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="紧急联系人">
                      <el-input
                        v-model="ruleForm.entityName"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" label="身高">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="紧急联系人电话">
                      <el-input
                        v-model="ruleForm.houseName"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" label="最高学历">
                      <el-input
                        v-model="ruleForm.legalName"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item class="noBB" label="现居地址">
                      <el-input
                        v-model="ruleForm.idCard"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR noBB" label="身份证号码">
                      <el-input
                        v-model="ruleForm.phone"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-form>
            <!-- 教育经历 -->
            <div class="form-table">
              <p class="form-title">教育经历</p>
              <el-row>
                <el-col :span="12" class="noBR form-table-col">
                  <div class="left">
                    <div class="title title-left titles">起止年月</div>
                    <div class="title title-left">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title title-left">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title title-left title-bottom">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                  </div>
                  <div class="right">
                    <div class="title titles">学校名称</div>
                    <div class="title">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title title-bottom">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12" class="form-table-col">
                  <div class="left">
                    <div class="title titles">专业</div>
                    <div class="title">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title title-bottom">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                  </div>
                  <div class="right">
                    <div class="title titles">所获学历、学位证书</div>
                    <div class="title">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title title-bottom">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
            <!-- 工作经历 -->
            <div class="form-table">
              <p class="form-title">工作经历</p>
              <el-row>
                <el-col :span="12" class="noBR form-table-col">
                  <div class="left">
                    <div class="title title-left titles">起止年月</div>
                    <div class="title title-left">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title title-left">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title title-left title-bottom">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                  </div>
                  <div class="right">
                    <div class="title titles">单位名称</div>
                    <div class="title">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title title-bottom">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12" class="form-table-col">
                  <div class="left-over">
                    <div class="title titles">职位</div>
                    <div class="title">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title title-bottom">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
            <!-- 家庭成员 -->
            <div class="form-table">
              <p class="form-title">家庭成员</p>
              <el-row>
                <el-col :span="12" class="noBR form-table-col">
                  <div class="left">
                    <div class="title title-left titles">家庭成员</div>
                    <div class="title title-left">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title title-left">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title title-left title-bottom">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                  </div>
                  <div class="right">
                    <div class="title titles">姓名</div>
                    <div class="title">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title title-bottom">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12" class="form-table-col">
                  <div class="left-over">
                    <div class="title titles">工作单位（职业）</div>
                    <div class="title">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title title-bottom">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
          <!-- 合同信息 -->
          <div class="archives-contract" v-if="activeIndex==1">
            <iframe
              src="http://storage.xuetangx.com/public_assets/xuetangx/PDF/PlayerAPI_v1.0.6.pdf"
              width="100%"
              height="100%"
            >
              This browser does not support PDFs. Please download the PDF to view it:
              <a
                href="/test2.pdf"
                rel="external nofollow"
              >Download PDF</a>
            </iframe>
          </div>
          <!-- 工资信息 -->
          <div class="archives-wage" v-if="activeIndex==2">
            <div class="fj-search-inline">
              <el-row>
                <el-form inline label-width="85px" label-position="left">
                  <el-col :lg="8" :xl="7" class="time-item">
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
                    <el-form-item label="输入查询：">
                      <el-input
                        v-model="searchForm.nameOrAccount"
                        clearable
                        placeholder="请输入姓名或电话"
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
              <el-table-column prop="userId" label="发放日期" width="100px" show-overflow-tooltip></el-table-column>
              <el-table-column prop="userId" label="基本工资" width="80px"></el-table-column>
              <el-table-column prop="userAccount" label="绩效工资"></el-table-column>
              <el-table-column prop="userAccount" label="层级工资"></el-table-column>
              <el-table-column prop="userAccount" label="岗位工资"></el-table-column>
              <el-table-column prop="userAccount" label="生活补贴"></el-table-column>
              <el-table-column prop="userAccount" label="信息采集费"></el-table-column>
              <el-table-column prop="userAccount" label="流量补助费"></el-table-column>
              <el-table-column prop="userAccount" label="其他"></el-table-column>
              <el-table-column prop="userAccount" label="应发合计"></el-table-column>
              <el-table-column prop="userAccount" label="养老保险"></el-table-column>
              <el-table-column prop="userAccount" label="医疗保险"></el-table-column>
              <el-table-column prop="userAccount" label="失业保险"></el-table-column>
              <el-table-column prop="userAccount" label="工商保险"></el-table-column>
              <el-table-column prop="userAccount" label="生育保险"></el-table-column>
              <el-table-column prop="userAccount" label="大病互助险"></el-table-column>
              <el-table-column prop="userAccount" label="扣发合计"></el-table-column>
              <el-table-column prop="userAccount" label="实发合计"></el-table-column>
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
    </div>
  </div>
</template>
<script>
import fjBreadNav from "@/components/fjBreadNav";
export default {
  name: "personnel-archives-detail",
  data() {
    return {
      breadData: [
        { name: "当前位置:", path: "" },
        { name: "人事管理", path: "" },
        { name: "档案管理", path: "/personnel-archives" },
        { name: "详情", path: "" }
      ],
      activeIndex: "0",
      activeList: [],
      userInfo: {},
      ruleForm: {
        name: ""
      },
      randomCityList: [], //抽查地点
      subofficeList: [], //房屋所属分局
      policeList: [], //房屋所属派出所
      nowUser: $.cookie(fjPublic.loginCookieKey),
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
      whether: [
        {
          value: "是",
          label: "是"
        },
        {
          value: "否",
          label: "否"
        }
      ],
      // 分页数据
      currentPage: 1,
      pageSize: 10,
      total: 0, //是否
      // 列表查询参数
      searchForm: {
        searchTime: "", // 查询时间
        nameOrAccount: "", // 警号或负责人名称
        deptId: "", // 派出所
        supDeptId: "", // 公安局
        status: "" // 状态
      },
      rules: []
    };
  },
  // created() {
  //   this.setCreated();
  // },
  mounted() {
    // this.getTeamList();
    // this.getDownDepts();
    this.setCreated();
    this.searchUserLeave();
  },
  methods: {
    currentPageChange: function(pageNum) {
      // 点击某个分页按钮
      this.currentPage = pageNum;
      this.searchUserLeave();
    },
    prevPageChange: function(pageNum) {
      // 点击分页的上一页
      this.currentPage = pageNum;
      this.searchUserLeave();
    },
    nextPageChange: function(pageNum) {
      // 点击分页的下一页
      this.currentPage = pageNum;
      this.searchUserLeave();
    },
    sizePageChange: function(pageSize) {
      // 改变每页条数时
      this.currentPage = 1;
      this.pageSize = pageSize;
      this.searchUserLeave();
    },
    submitForm(state) {
      console.log(state);
      window.history.go(-1);
    },
    // 获取采集列表
    searchUserLeave: function() {
      var defer = $.Deferred();
      var vm = this;
      // 参数
      this.searchForm["page"] = this.currentPage;
      this.searchForm["rows"] = this.pageSize;
      // 传入当前用户信息
      this.searchForm["nowUser"] = this.nowUser;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/searchUserLeave",
        type: "POST",
        data: vm.searchForm,
        dataType: "json",
        success: function(data) {
          vm.attendLeaveData = null;
          vm.attendLeaveData = data.list;
          vm.total = data.total;
          _.each(vm.attendLeaveData, function(item, i) {
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
    // 修改查询时间
    changeSearchTime: function(searchTime) {
      if (searchTime) {
        this.searchForm["startTime"] = fjPublic.dateFormatYYMMDD(searchTime[0]);
        this.searchForm["endTime"] = fjPublic.dateFormatYYMMDD(searchTime[1]);
      } else {
        this.searchForm["startTime"] = "";
        this.searchForm["endTime"] = "";
      }
      this.searchUserLeave();
    },
    // 标题或负责人名称查询
    searchAttendLeave: function() {
      this.searchUserLeave();
    },
    // 获取抽查地点数据
    getTeamList: function(state) {
      var vm = this;
      // 参数
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/searchDeptsByFenju",
        type: "POST",
        data: {},
        dataType: "json",
        success: function(data) {
          console.log(data);
          vm.policeList = data.list;
        },
        error: function(err) {}
      });
    },
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
    // 获取所属地分局
    getDownDepts: function(state) {
      var vm = this;
      // 参数
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/getDownDepts",
        type: "POST",
        data: {
          deptid: $.parseJSON(fjPublic.getLocalData("userInfo")).deptId
        },
        dataType: "json",
        success: function(data) {
          console.log(data);
          vm.subofficeList = data;
        },
        error: function(err) {}
      });
    },
    // 提交或者编辑数据
    postRuleForm: function() {
      let vm = this;
      let url = vm.userInfo.state == 0 ? "/addInfo" : "/updInfo";
      if (vm.userInfo.id) {
        vm.ruleForm.id = vm.userInfo.id;
      }
      vm.ruleForm.tableName = vm.activeList[vm.userInfo.index].tableName;
      vm.ruleForm.userId = $.parseJSON(
        fjPublic.getLocalData("userInfo")
      ).userId;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + url,
        type: "POST",
        data: vm.ruleForm,
        dataType: "json",
        success: function(data) {},
        error: function(err) {
          if (err.responseText == "success") {
            vm.$router.push({
              path: "/fjWorkManage-YiBiaoSanShi"
            });
          } else {
          }
        }
      });
    },
    setCreated() {
      this.userInfo = this.$route.query;
      // this.userInfo.state != 0 &&
      //   (this.ruleForm = $.parseJSON(fjPublic.getLocalData("archivesItem")));
      // this.$refs["ruleForm"].resetFields();
    }
  },
  watch: {
    $route: {
      handler(route) {
        this.setCreated();
      }
    }
  },
  components: {
    fjBreadNav
  }
};
</script>
<style scope lang="less">
.archives {
  .fj-block-head {
    height: 50px;
    border-bottom: 0px;
    .el-tabs__header {
      padding-top: 10px;
    }
    .archives-footer-btn {
      position: absolute;
      top: 10px;
      right: 0;
    }
  }

  .archives-form-area {
    .form-title {
      padding: 20px 0 5px 20px;
      font-size: 14px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.9);
      opacity: 1;
    }
    .form-info {
      position: relative;
      .info-img {
        position: absolute;
        top: 0;
        right: 0;
        width: 150px;
        height: 179px;
        z-index: 1;
        background-color: #fff;
        border-left: 1px solid #e8e8e8;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .form-table {
      height: 222px;
      .form-table-col {
        // border: 1px solid #e8e8e8;
        div {
          display: inline-block;
          height: 44px;
          line-height: 44px;
        }
        .left {
          width: 200px;
          position: absolute;
        }
        .right {
          width: 100%;
          padding-left: 200px;
        }
        .left-over {
          width: 100%;
          position: relative;
        }
        .title {
          display: block;
          border-top: 1px solid #e8e8e8;
          border-right: 1px solid #e8e8e8;
          .el-input {
            width: 100%;
            .el-input__inner {
              border: none;
            }
          }
        }
        .titles {
          padding-left: 20px;
          line-height: 44px;
          background-color: #fafafa;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: left;
          font-weight: 400;
        }
        .title-bottom {
          border-bottom: 1px solid #e8e8e8;
        }
        .title-left {
          border-left: 1px solid #e8e8e8;
        }
      }
      .noBR {
        border-right: none;
      }
      .noBB {
        border-bottom: none;
      }
    }
  }
  .archives-contract {
    height: 800px;
    padding: 20px;
  }
  .archives-wage {
    .el-input-group__append {
      background-color: #1890ff;
      border-color: #1890ff;
      color: #fff;
    }
    .fj-search-inline{
      margin:20px 0 0 20px;
    }
  }
}
.fj-block-body {
  padding-bottom: 30px;
}

.archives-form-area {
  .el-input.is-disabled .el-input__inner {
    cursor: auto;
    background-color: #fff;
  }
  .el-form-item__error {
    display: none;
  }
  .is-required {
    .el-form-item__label:before {
      display: none;
    }
    .el-form-item__label:after {
      content: "*";
      color: #f56c6c;
      margin-left: 4px;
    }
  }
}
.archives .archives-form-area {
  background: #fff;
}
.fj-content_view_mask {
  background: #f0f2f5;
}
.archives .archives-form-area .archives-form-area.x-scroll {
  overflow-x: scroll;
}
.archives .archives-form-area .el-form {
  border: 1px solid #e8e8e8;
}
.archives .archives-form-area .el-form.has-table {
  border: none;
}
.archives .archives-form-area .el-form .el-form-item {
  margin-bottom: 0px;
  border-right: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
}
.archives .archives-form-area .el-form .el-form-item.noBR {
  border-right: none;
}
.archives .archives-form-area .el-form .el-form-item.noBB {
  border-bottom: none;
}
/* 表单->表格调整 */
.archives-form-area .el-table th {
  text-align: left;
  color: rgba(0, 0, 0, 0.65);
}
.archives-form-area .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: transparent;
}
.archives-form-area .el-table td {
  padding: 6px 0px;
}
.archives-form-area .el-table td .el-input {
  width: 100%;
}
.archives-form-area .el-table td .el-input .el-input__inner {
  padding: 0px 4px;
  border: none;
  color: rgba(0, 0, 0, 0.65);
}
.archives-form-area .el-table td .el-textarea .el-textarea__inner {
  border: none;
  padding: 0px;
}
/*  */
.archives .archives-form-area .el-form .el-form-item__label {
  min-width: 200px;
  padding: 0px 0px 0px 20px;
  line-height: 44px;
  background-color: #fafafa;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-right: 1px solid #e8e8e8;
  text-align: left;
}
.archives .archives-form-area .el-form .el-form-item__content {
  padding-left: 200px;
  line-height: 44px;
}
.archives
  .archives-form-area
  .el-form
  .el-form-item.NPL
  .el-form-item__content {
  padding-left: 0px;
}
/* el-form样式修改 */
.archives .archives-form-area .el-form.no-title .el-form-item__label,
.archives .archives-form-area .el-form.no-content .el-form-item__content {
  display: none;
}
.archives .archives-form-area .el-form.no-title .el-form-item__label,
.archives .archives-form-area .el-form.no-content .el-form-item__label {
  border-right: none;
}
.archives .archives-form-area .el-form.no-content .el-form-item__label {
  float: none;
  display: block;
}
.archives .archives-form-area .el-form.no-content + .el-form.no-title {
  border-left: none;
}
.archives .archives-form-area .el-form[class*="no"] {
  float: left;
}
.archives .archives-form-area .el-form.no-title .el-form-item__content {
  padding-left: 0px;
}
.archives .archives-form-area .el-form.no-content .el-form-item__label,
.archives .archives-form-area .el-form.no-title .el-form-item__content {
  position: relative;
  min-width: 160px;
}
.archives
  .archives-form-area
  .el-form.no-title
  .el-form-item__content
  .el-input.is-disabled
  .el-input__inner {
  background-color: #fafafa;
  color: rgba(0, 0, 0, 0.65);
}
/*  */
/* 表单调整 */
.archives .archives-form-area .el-form .el-form-item__content .el-select,
.archives .archives-form-area .el-form .el-form-item__content .el-input {
  display: block;
  width: 100%;
}
.archives
  .archives-form-area
  .el-form
  .el-form-item__content
  .el-input
  > .el-input__inner {
  height: 44px;
  line-height: 44px;
  border-color: #fff;
  border-radius: 0;
  color: rgba(0, 0, 0, 0.65);
}
.el-form-item.is-error .el-input__inner,
.el-form-item.is-error .el-input__inner:focus {
  border-color: #f56c6c !important;
}
/* 弹层操作 */
.archives .archives-form-area .el-dialog .el-dialog__header {
  padding: 40px 56px;
  font-size: 20px;
  color: rgba(0, 0, 0, 0.85);
}
.archives .archives-form-area .el-dialog .el-dialog__body {
  padding: 0px 56px 20px;
}
.archives .archives-form-area .el-dialog .el-dialog__body .columns {
  display: flex;
}
.archives .archives-form-area .el-dialog .el-dialog__body .fj-column,
.archives .archives-form-area .el-dialog .el-dialog__body .fj-column {
  flex: 1 0 auto;
}
.archives .archives-form-area .el-dialog .el-dialog__body .title-column {
  flex: 0 0 auto;
  width: 200px;
}
.archives
  .archives-form-area
  .el-dialog
  .el-dialog__body
  .title-column
  > .el-form {
  border-right: none;
}
.archives
  .archives-form-area
  .el-dialog
  .el-dialog__body
  .fj-column
  > .el-form {
  border-right: none;
}
.archives
  .archives-form-area
  .el-dialog
  .el-dialog__body
  .el-form[class*="no"] {
  float: none;
}
.archives
  .archives-form-area
  .el-dialog
  .el-dialog__body
  .title-column
  .el-form
  .el-form-item__label {
  background-color: transparent;
}
/*  */
.archives
  .archives-form-area
  .el-dialog
  .el-dialog__body
  [class*="-column"]
  .el-form:first-child {
  border-bottom: none;
}
/*  */
.archives
  .archives-form-area
  .el-dialog
  .el-dialog__body
  .title-column
  > .el-form
  .el-form-item:nth-of-type(2n),
.archives
  .archives-form-area
  .el-dialog
  .el-dialog__body
  .fj-column
  > .el-form
  .el-form-item:nth-of-type(2n)
  .el-input__inner,
.archives
  .archives-form-area
  .el-dialog
  .el-dialog__body
  .mj-column
  > .el-form
  .el-form-item:nth-of-type(2n)
  .el-input__inner {
  background-color: #f0faff;
}
@media screen and (min-width: 1920px) {
  /* .archives .archives-form-area .el-form .el-form-item__content .el-select {width:60%;} */
}
</style>

