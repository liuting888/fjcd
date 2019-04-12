<template>
  <div class="fj-content_view work-mis fj-info">
    <div class="fj-block title">
      <fj-breadNav :bread-data="breadData"></fj-breadNav>
    </div>
    <div class="fj-block content">
      <div class="fj-block-head kaohe">
        <p class="title fj-fl">采集列表</p>
      </div>
      <div class="fj-block-body">
        <div class="fj-search-inline-info">
          <el-row >
            <el-form inline label-width="85px" label-position="left">
              <el-col :lg="8" :xl="7" class="time-item">
                <el-form-item label="信息类型：">
                  <el-select
                    @change="changeInfoType"
                    clearable
                    filterable
                    v-model="searchForm.infoType"
                    size="small"
                  >
                    <el-option
                      v-for="item in infoTypes"
                      :key="item.id"
                      :label="item.value"
                      :value="item.id"
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
              <el-col :lg="5" :xl="5">
                <el-form-item label="派出所：" label-width="85px">
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
                <el-form-item label="审核结果：">
                  <el-select
                    @change="changeStatus"
                    clearable
                    filterable
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
              <el-col :lg="5" :xl="5">
                <el-form-item label="输入查询：">
                  <el-input
                    v-model="searchForm.nameOrAccount"
                    clearable
                    placeholder="请输入负责人名称"
                    size="small"
                    class="search-input"
                  >
                    <el-button slot="append" @click="searchMission">搜索</el-button>

                  </el-input>
                </el-form-item>
                <el-form-item><el-button  @click="resetSearch" size="small" type="primary" class="reset">重置</el-button></el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </div>
        <el-table :data="infoData" class="tables">
          <el-table-column prop="infodesc" label="信息类型" show-overflow-tooltip></el-table-column>
          <el-table-column prop="userName" label="提交人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="deptname" label="所属单位" show-overflow-tooltip></el-table-column>
          <el-table-column prop="areaid" label="网格区域" show-overflow-tooltip v-if="false"></el-table-column>
          <el-table-column prop="instime" label="提交时间" show-overflow-tooltip :formatter="instimeFormat"></el-table-column>

          <el-table-column prop="leadid" label="审核人"></el-table-column>
          <el-table-column label="审核时间" show-overflow-tooltip prop="leadtime" :formatter="dateStrFormat">
          </el-table-column>
          <el-table-column label="审核状态"  width="80px" align="left">
            <template slot-scope="scope">
              <span class="circle-status" :class="scope.row.leadresult == 0 ? 'grey' : scope.row.leadresult == 1 ? 'green' : 'red'">
                  {{parseInt( scope.row.leadresult) === 0 ? '待审批' : parseInt( scope.row.leadresult) === 1 ?'已通过'
                  : '被驳回'}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span
                class="ope-txt"
                @click="openAddOrDetailDialog(scope.row.keyno, scope.row.infotype, scope.row.leadresult)"
              >{{parseInt( scope.row.leadresult) === 0 ? '审批' : '详情'}}</span>

              <!--<span class="ope-txt" v-if="scope.row.leadresult == 0" @click="openCheckDialog(scope.row.keyno, 1)">通过</span>-->
              <!--<span class="ope-txt" v-if="scope.row.leadresult == 0" @click="openCheckDialog(scope.row.keyno, 2)">不通过</span>-->
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
      @close="closeDialog"
      v-if="dialogMap[parseInt(infoType)]"
      :width="dialogMap[1002].width + 'px'"
      :top="dialogMap[parseInt(infoType || 1002) ].top + 'vh'"
      :append-to-body = true
      :close-on-click-modal="false"
      style="position: absolute"
      class="infoDialog"
      :lock-scroll = 'true'
    >
      <el-row slot="title" class="dialog-title">
        <el-col :offset="1" :span="23">
            <span >{{dialogTitle}}</span>
            <div
              class="title-status"
              v-if="parseInt(infoStatus) !== 0"
              :class="parseInt(infoStatus) === 2 ? 'reject' : 'resolve'">
              {{parseInt(infoStatus) === 2 ? '被驳回' : '已通过'}}
            </div>
        </el-col>
      </el-row>
      <!-- 巡逻情况登记表 -->
      <template v-if="infoType == '1002'">
        <el-form :rules="rule"  :model="dialogForm1" ref="dialogForm1"  label-position="left" inline>
          <el-row>
            <el-col :offset="1" :span="22" >
              <el-form-item label="巡逻时段："  prop="patrol_time">
                {{dialogForm1.patrol_time | trans_patrol_time}}
                <!-- <el-input autocomplete="off" disabled v-model="dialogForm1.patrol_time"></el-input> -->
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="带班民警和辅警："  prop="lead_person">
                {{dialogForm1.lead_person}}
                <!-- <el-input autocomplete="off" disabled v-model="dialogForm1.lead_person"></el-input> -->
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="巡逻人员："  prop="patrol_person">
                {{dialogForm1.patrol_person}}
                <!-- <el-input autocomplete="off" disabled v-model="dialogForm1.patrol_person"></el-input> -->
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>

          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="其他防范力量："  prop="other">
                {{dialogForm1.other}}
                <!-- <el-input autocomplete="off" disabled v-model="dialogForm1.other"></el-input> -->
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="巡逻地段："  prop="patrol_area">
                {{dialogForm1.patrol_area}}
                <!-- <el-input type="textarea" :rows="2" disabled v-model="dialogForm1.patrol_area"></el-input> -->
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="工作任务："  prop="work_content">
                {{dialogForm1.work_content}}
                <!-- <el-input type="textarea" :rows="3" disabled v-model="dialogForm1.work_content"></el-input> -->
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>

          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="执勤记录："  prop="work_log">
                {{dialogForm1.work_log}}
                <!-- <el-input type="textarea" :rows="3" disabled v-model="dialogForm1.work_log"></el-input> -->
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row class="reason" v-if="parseInt(infoStatus) !== 1">
            <el-col :offset="1" :span="22">
              <el-form-item label="驳回原因："  prop="reason">
                <el-input type="text" :rows="3"  v-model="dialogForm1.reason" placeholder="驳回请输入驳回理由" v-if="parseInt(infoStatus) === 0"></el-input>
                <span v-else style="color:red;">
                   {{dialogForm1.reason}}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row class="info">
            <el-col :span="7" :offset="1" >
              <el-form-item label="提交时间：" prop="insTime" label-width="82px">
                {{dialogForm1.insTime}}
                <!-- <el-input autocomplete="off"  :rows="3" disabled v-model="dialogForm1.insTime"></el-input> -->
              </el-form-item>
            </el-col>

            <el-col :span="7" :offset="1" >
              <el-form-item label="提交人：" prop="userId"  label-width="68px">
                {{dialogForm1.userId}}
                <!-- <el-input autocomplete="off"  :rows="3" disabled v-model="dialogForm1.userId"></el-input> -->
              </el-form-item>
            </el-col>
            <el-col :span="7" :offset="1" >
              <el-form-item label="审核人：" prop="leadId"  label-width="82px">
                {{dialogForm1.leadId}}
                <!-- <el-input autocomplete="off"  :rows="3" disabled v-model="dialogForm1.leadId"></el-input> -->
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <!-- 安全检查情况登记表 -->
      <template v-if="infoType == '1005'">
        <el-form :rules="rule"  :model="dialogForm2" ref="dialogForm2" class="dialog-form dialogForm2"  label-position="left" inline>
          <el-row>
            <el-col :offset="1" :span="11">
              <el-form-item label="检查日期："  prop="check_date">
                {{dialogForm2.check_date}}
              </el-form-item>
            </el-col>
            <el-col  :span="11">
              <el-form-item label="被检查单位："  prop="check_department">
                {{dialogForm2.check_department}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="11">
              <el-form-item label="被检查单位责任人："  prop="leader_name">
                {{dialogForm2.leader_name}}
              </el-form-item>
            </el-col>
            <el-col  :span="11">
              <el-form-item label="被检查单位电话："  prop="leader_phone">
                {{dialogForm2.leader_phone}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="检查单位："  prop="deptId">
                {{dialogForm2.deptId}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="参检民警和辅警："  prop="attend_policeman">
                {{dialogForm2.attend_policeman}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="发现问题："  prop="find_problem">
                {{dialogForm2.find_problem}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="整改要求："  prop="change_require">
                {{dialogForm2.change_require}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="被检查单位意见："  prop="department_opinion">
                {{dialogForm2.department_opinion}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row class="reason" v-if="parseInt(infoStatus) !== 1">
            <el-col :offset="1" :span="22">
              <el-form-item label="驳回原因："  prop="reason">
                <el-input type="text" :rows="3"  v-model="dialogForm2.reason" placeholder="驳回请输入驳回理由" v-if="parseInt(infoStatus) === 0"></el-input>
                <span v-else style="color:red;">
                   {{dialogForm2.reason}}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row class="info">
            <el-col :span="7" :offset="1"  >
              <el-form-item label="提交时间：" prop="insTime" label-width="82px">
                {{dialogForm2.insTime}}
              </el-form-item>
            </el-col>
            <el-col :span="7" :offset="1"  >
              <el-form-item label="提交人：" prop="userId" label-width="68px">
                {{dialogForm2.userId}}
              </el-form-item>
            </el-col>
            <el-col :span="7" :offset="1"  >
              <el-form-item label="审核人：" prop="leadId" label-width="82px">
                {{dialogForm2.leadId}}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <!-- 服务群众登记表 -->
      <template v-if="infoType == '1007'">
        <el-form :rules="rule"  :model="dialogForm3" ref="dialogForm3" label-position="left" inline>
          <el-row>
            <el-col :offset="1" :span="11">
              <el-form-item label="姓名："  prop="name">
                {{dialogForm3.name}}
              </el-form-item>
            </el-col>
            <el-col  :span="11">
              <el-form-item label="性别："  prop="sex">
                {{dialogForm3.sex}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="11">
              <el-form-item label="民族："  prop="nation">
                {{dialogForm3.nation}}
              </el-form-item>
            </el-col>
            <el-col  :span="11">
              <el-form-item label="出生年月："  prop="birth">
                {{dialogForm3.birth}}
              </el-form-item>
            </el-col>
           <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="11">
              <el-form-item label="电话："  prop="phone">
                {{dialogForm3.phone}}
              </el-form-item>
            </el-col >
            <el-col :span="11">
              <el-form-item label="身份证号："  prop="idcard">
                {{dialogForm3.idcard}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>

          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="户口所在地："  prop="domicile">
                {{dialogForm3.domicile}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="现居住地址："  prop="address">
                {{dialogForm3.address}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="违法情况："  prop="break_law">
                {{dialogForm3.break_law}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="帮扶情况："  prop="help_content">
                {{dialogForm3.help_content}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="备注："  prop="remarks">
                {{dialogForm3.remarks}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row class="reason" v-if="parseInt(infoStatus) !== 1">
            <el-col :offset="1" :span="22">
              <el-form-item label="驳回原因："  prop="reason">
                <el-input type="text" :rows="3"  v-model="dialogForm3.reason" placeholder="驳回请输入驳回理由" v-if="parseInt(infoStatus) === 0"></el-input>
                <span v-else style="color:red;">
                   {{dialogForm3.reason}}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row class="info">
             <el-col :offset="1" :span="7">
              <el-form-item label="提交时间：" prop="insTime" :offset="1" :span="7" label-width="82px">
                {{dialogForm3.insTime}}
              </el-form-item>
            </el-col>
            <el-col :offset="1" :span="7">
              <el-form-item label="提交人：" prop="userId" label-width="68px">
                {{dialogForm3.userId}}
              </el-form-item>
            </el-col>
            <el-col :offset="1" :span="7">
              <el-form-item label="审核人：" prop="leadId" label-width="82px">
                {{dialogForm3.leadId}}
              </el-form-item>
            </el-col>

          </el-row>
        </el-form>
      </template>
      <!-- 治安秩序维护登记表 -->
      <template v-if="infoType == '1008'">
        <el-form :rules="rule"  :model="dialogForm4" ref="dialogForm4" inline label-position="left" >
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="时间："  prop="collect_date">
                {{dialogForm4.collect_date}}
              </el-form-item>
            </el-col>
            <el-col :offset="1" :span="22">
              <el-form-item label="地点："  prop="collect_address">
                {{dialogForm4.collect_address}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item  prop="collect_leader">
                <div slot="label">带队(责任)民警</div>
                {{dialogForm4.collect_leader}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="事由："  prop="collect_cause">
                {{dialogForm4.collect_cause}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="reason" v-if="parseInt(infoStatus) !== 1">
            <el-col :offset="1" :span="22">
              <el-form-item label="驳回原因："  prop="reason">
                <el-input type="text" :rows="3"  v-model="dialogForm4.reason" placeholder="驳回请输入驳回理由" v-if="parseInt(infoStatus) === 0"></el-input>
                <span v-else style="color:red;">
                   {{dialogForm4.reason}}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row class="info">

            <el-col :offset="1" :span="7">
              <el-form-item label="提交时间：" prop="insTime" label-width="82px">
                {{dialogForm4.insTime}}
                <!-- <el-input autocomplete="off" disabled v-model="dialogForm4.insTime"></el-input> -->
              </el-form-item>
            </el-col>
            <el-col :offset="1" :span="7">
              <el-form-item label="提交人：" prop="userId" label-width="68px">
                {{dialogForm4.userId}}
                <!-- <el-input autocomplete="off" disabled v-model="dialogForm4.userId"></el-input> -->
              </el-form-item>
            </el-col>
            <el-col :offset="1" :span="7">
              <el-form-item label="审核人：" prop="leadId" label-width="82px" >
                {{dialogForm4.leadId}}
                <!-- <el-input autocomplete="off" disabled v-model="dialogForm4.leadId"></el-input> -->
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <!-- 治安纠纷调解登记表 -->
      <template v-if="infoType == '1010'">
        <el-form :rules="rule"  :model="dialogForm5" ref="dialogForm5" inline label-position="left">
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="事件名称："  prop="case_name">
                {{dialogForm5.case_name}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="11">
              <el-form-item label="调解日期："  prop="case_date">
                {{dialogForm5.case_date}}
              </el-form-item>
            </el-col>
            <el-col  :span="11">
              <el-form-item label="调解人员："  prop="case_mediator">
                {{dialogForm5.case_mediator}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="11">
              <el-form-item label="当事人A基本信息" style="font-weight:bold;"></el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="当事人B基本信息" style="font-weight:bold;"></el-form-item>
            </el-col>
             <el-col :span="1"></el-col>

          </el-row>
          <el-row>
            <el-col :offset="1" :span="11">
              <el-form-item label="姓名："  prop="client1_name">
                {{dialogForm5.client1_name}}
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="姓名："  prop="client2_name">
                {{dialogForm5.client2_name}}
              </el-form-item>
            </el-col>
             <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="11">
              <el-form-item label="性别："  prop="client1_sex">
                {{dialogForm5.client1_sex}}
              </el-form-item>
            </el-col>
            <el-col  :span="11">
              <el-form-item label="性别："  prop="client2_sex">
                {{dialogForm5.client2_sex}}
              </el-form-item>
            </el-col>
             <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="11">
              <el-form-item label="出生日期："  prop="client1_birth">
                {{dialogForm5.client1_birth}}
              </el-form-item>
            </el-col>
            <el-col  :span="11">
              <el-form-item label="出生日期："  prop="client2_birth">
                {{dialogForm5.client2_birth}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="11">
              <el-form-item label="身份证号码："  prop="client1_idcard">
                {{dialogForm5.client1_idcard}}
              </el-form-item>
            </el-col>
            <el-col  :span="11">
              <el-form-item label="身份证号码："  prop="client2_idcard">
                {{dialogForm5.client1_idcard}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="11">
              <el-form-item label="家庭住址："  prop="client1_address">
                {{dialogForm5.client1_address}}
              </el-form-item>
            </el-col>
            <el-col  :span="11">
              <el-form-item label="家庭住址："  prop="client2_address">
                {{dialogForm5.client2_address}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="简要情况："  prop="case_content">
                {{dialogForm5.case_content}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="调查结果："  prop="inquire_result">
                {{dialogForm5.inquire_result}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="备注："  prop="remarks">
                {{dialogForm5.remarks}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="reason" v-if="parseInt(infoStatus) !== 1">
            <el-col :offset="1" :span="22">
              <el-form-item label="驳回原因："  prop="reason">
                <el-input type="text" :rows="3"  v-model="dialogForm5.reason" placeholder="驳回请输入驳回理由" v-if="parseInt(infoStatus) === 0"></el-input>
                <span v-else style="color:red;">
                   {{dialogForm5.reason}}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row class="info">
            <el-col :offset="1" :span="7">
              <el-form-item label="提交时间：" prop="insTime"  label-width="82px">
                {{dialogForm5.insTime}}
                <!-- <el-input autocomplete="off" disabled v-model="dialogForm5.insTime"></el-input> -->
              </el-form-item>
            </el-col>
            <el-col :offset="1" :span="7">
              <el-form-item label="提交人：" prop="userId"  label-width="72px">
                {{dialogForm5.userId}}
                <!-- <el-input autocomplete="off" disabled v-model="dialogForm5.userId"></el-input> -->
              </el-form-item>
            </el-col>
            <el-col  :offset="1" :span="7">
              <el-form-item label="审核人：" prop="leadId"  label-width="82px">
                {{dialogForm5.leadId}}
                <!-- <el-input autocomplete="off" disabled v-model="dialogForm5.leadId"></el-input> -->
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <!-- 重点人口基本信息登记表 -->
      <template v-if="infoType == '1011'">
        <el-form :rules="rule"  :model="dialogForm6" ref="dialogForm6" class="dialog-form dialogForm6" label-position="left" inline>
          <el-row>
            <el-col  :offset="1" :span="11">
              <el-form-item label="姓名："  prop="name">
                {{dialogForm6.name}}
              </el-form-item>
            </el-col>
            <el-col  :span="11">
              <el-form-item label="照片："  prop="photo">
                <img :src="'/auxmedias/' + dialogForm6.photo.substr(0,6) + '/' + dialogForm6.photo">
              </el-form-item>
            </el-col>
             <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="11">
              <el-form-item label="曾用名："  prop="other_name">
                {{dialogForm6.other_name}}
              </el-form-item>
            </el-col>
            <el-col  :span="11">
              <el-form-item label="性别："  prop="sex">
                {{dialogForm6.sex}}
              </el-form-item>
            </el-col>
             <el-col :span="1"></el-col>
          </el-row>
          <el-row>
          </el-row>
          <el-row>
            <el-col  :offset="1" :span="11">
              <el-form-item label="身份证："  prop="idcard">
                {{dialogForm6.idcard}}
              </el-form-item>
            </el-col>
            <el-col   :span="11">
              <el-form-item label="民族："  prop="nation">
                {{dialogForm6.nation}}
              </el-form-item>
            </el-col>
             <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col  :offset="1" :span="11">
              <el-form-item label="本人手机："  prop="phone">
                {{dialogForm6.phone}}
              </el-form-item>
            </el-col>
            <el-col  :span="11">
              <el-form-item label="其他电话："  prop="other_phone">
                {{dialogForm6.other_phone}}
              </el-form-item>
            </el-col>
             <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="户籍所在地："  prop="domicile">
                {{dialogForm6.domicile}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
             <el-col :offset="1" :span="22">
              <el-form-item label="现住地详址："  prop="address">
                {{dialogForm6.address}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col  :offset="1" :span="11">
              <el-form-item label="重点人员列控类别："  prop="person_type">
                {{dialogForm6.person_type}}
              </el-form-item>
            </el-col>
             <el-col   :span="11">
              <el-form-item label="虚拟身份："  prop="other_identity">
                {{dialogForm6.other_identity}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="人员见面情况："  prop="meet_situation">
                {{dialogForm6.meet_situation}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="侧面调查情况："  prop="other_situation">
                {{dialogForm6.other_situation}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="其他调查情况："  prop="other_situation">
                {{dialogForm6.info_situation}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="附属信息：" prop="additional">
                <el-table :data="dialogForm6.additional" style="width:632px;">
                  <el-table-column prop="atta_name" label="姓名" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="atta_relation" label="关系" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="atta_address" label="具体地址" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="atta_phone" label="联系电话" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="atta_instime" label="登记时间" show-overflow-tooltip></el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row class="reason" v-if="parseInt(infoStatus) !== 1">
            <el-col :offset="1" :span="22">
              <el-form-item label="驳回原因："  prop="reason">
                <el-input type="text" :rows="3"  v-model="dialogForm6.reason" placeholder="驳回请输入驳回理由" v-if="parseInt(infoStatus) === 0"></el-input>
                <span v-else style="color:red;">
                   {{dialogForm6.reason}}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
           <el-row class="info">

            <el-col :offset="1" :span="7">
              <el-form-item label="提交时间：" prop="insTime" label-width="82px">
                {{dialogForm6.insTime}}
                <!-- <el-input autocomplete="off" disabled v-model="dialogForm4.insTime"></el-input> -->
              </el-form-item>
            </el-col>
            <el-col :offset="1" :span="7">
              <el-form-item label="提交人：" prop="userId" label-width="68px">
                {{dialogForm6.userId}}
                <!-- <el-input autocomplete="off" disabled v-model="dialogForm4.userId"></el-input> -->
              </el-form-item>
            </el-col>
            <el-col :offset="1" :span="7">
              <el-form-item label="审核人：" prop="leadId" label-width="82px" >
                {{dialogForm6.leadId}}
                <!-- <el-input autocomplete="off" disabled v-model="dialogForm4.leadId"></el-input> -->
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <!-- 实有房屋、实有人口信息登记表 -->
      <template v-if="infoType == '1012'">
        <el-form :rules="rule"  :model="dialogForm7" ref="dialogForm7" class="dialog-form" label-position="left" inline>
          <el-row>
            <el-col  :offset="1" :span="11">
              <el-form-item label="实体名称"  prop="real_name">
                <el-input autocomplete="off" disabled v-model="dialogForm7.real_name"></el-input>
              </el-form-item>
            </el-col>
            <el-col   :span="11">
              <el-form-item label="物业（单位)名称"  prop="property_name">
                <el-input autocomplete="off" disabled v-model="dialogForm7.property_name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
            <el-col  :offset="1" :span="22">
              <el-form-item label="地上层数"  prop="up_num">
                <el-input autocomplete="off" disabled v-model="dialogForm7.up_num"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>

            <el-col  :offset="1" :span="22">
              <el-form-item label="实体地址"  prop="real_address">
                <el-input autocomplete="off" disabled v-model="dialogForm7.real_address"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col  :offset="1" :span="22">
              <el-form-item label="房屋地址"  prop="house_address">
                <el-input autocomplete="off" disabled v-model="dialogForm7.house_address"></el-input>
              </el-form-item>
            </el-col>
            <el-col  :offset="1" :span="22">
              <el-form-item label="产权单位"  prop="property_unit">
                <el-input autocomplete="off" disabled v-model="dialogForm7.property_unit"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col  :offset="1" :span="22">
              <el-form-item label="房屋类型"  prop="house_type">
                <el-input autocomplete="off" disabled v-model="dialogForm7.house_type"></el-input>
              </el-form-item>
            </el-col>
            <el-col  :offset="1" :span="22">
              <el-form-item label="法人（负责人）/房主姓名"  prop="ownername">
                <el-input autocomplete="off" disabled v-model="dialogForm7.ownername"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col  :offset="1" :span="22">
              <el-form-item label="房主证件号码"  prop="cardid">
                <el-input autocomplete="off" disabled v-model="dialogForm7.cardid"></el-input>
              </el-form-item>
            </el-col>
            <el-col  :offset="1" :span="22">
              <el-form-item label="是否出租房屋"  prop="yesorno">
                <el-input autocomplete="off" disabled v-model="dialogForm7.yesorno"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col  :offset="1" :span="22">
              <el-form-item label="出租时间"  prop="lease_time">
                <el-input autocomplete="off" disabled v-model="dialogForm7.lease_time"></el-input>
              </el-form-item>
            </el-col>
            <el-col  :offset="1" :span="22">
              <el-form-item label="是否签订责任状"  prop="isduty">
                <el-input autocomplete="off" disabled v-model="dialogForm7.isduty"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col  :offset="1" :span="22">
              <el-form-item label="出租屋等级"  prop="lease_level">
                <el-input autocomplete="off" disabled v-model="dialogForm7.lease_level"></el-input>
              </el-form-item>
            </el-col>
            <el-col  :offset="1" :span="22">
              <el-form-item label="实体分类"  prop="real_type">
                <el-input autocomplete="off" disabled v-model="dialogForm7.real_type"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col  :offset="1" :span="22">
              <el-form-item label="地下层数"  prop="down_num">
                <el-input autocomplete="off" disabled v-model="dialogForm7.down_num"></el-input>
              </el-form-item>
            </el-col>
            <el-col  :offset="1" :span="22">
              <el-form-item label="物业（单位）电话"  prop="property_phone">
                <el-input autocomplete="off" disabled v-model="dialogForm7.property_phone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col  :offset="1" :span="22">
              <el-form-item label="产权类型"  prop="property_type">
                <el-input autocomplete="off" disabled v-model="dialogForm7.property_type"></el-input>
              </el-form-item>
            </el-col>
            <el-col  :offset="1" :span="22">
              <el-form-item label="管理类型"  prop="admin">
                <el-input autocomplete="off" disabled v-model="dialogForm7.admin"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col  :offset="1" :span="22">
              <el-form-item label="房主证件类型"  prop="card_type">
                <el-input autocomplete="off" disabled v-model="dialogForm7.card_type"></el-input>
              </el-form-item>
            </el-col>
            <el-col  :offset="1" :span="22">
              <el-form-item label="房主联系电话"  prop="ownerphone">
                <el-input autocomplete="off" disabled v-model="dialogForm7.ownerphone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col  :offset="1" :span="22">
              <el-form-item label="承租用途"  prop="purpose">
                <el-input autocomplete="off" disabled v-model="dialogForm7.purpose"></el-input>
              </el-form-item>
            </el-col>
            <el-col  :offset="1" :span="22">
              <el-form-item label="出租间数"  prop="lease_num">
                <el-input autocomplete="off" disabled v-model="dialogForm7.lease_num"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col  :offset="1" :span="22">
              <el-form-item label="租住类型"  prop="lease_type">
                <el-input autocomplete="off" disabled v-model="dialogForm7.lease_type"></el-input>
              </el-form-item>
            </el-col>
            <el-col  :offset="1" :span="22">
              <el-form-item label="备注"  prop="remarks">
                <el-input autocomplete="off" disabled v-model="dialogForm7.remarks"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="实有人口信息表" prop="additional">
                <el-table :data="dialogForm7.additional">
                  <el-table-column prop="name" label="姓名" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="sex" label="性别"  show-overflow-tooltip></el-table-column>
                  <el-table-column prop="country" label="国家地区"  show-overflow-tooltip></el-table-column>
                  <el-table-column prop="card_type" label="证件类型"  show-overflow-tooltip></el-table-column>
                  <el-table-column prop="cardid" label="证件号码"  show-overflow-tooltip></el-table-column>
                  <el-table-column prop="phone" label="联系电话"  show-overflow-tooltip></el-table-column>
                  <el-table-column prop="relationship" label="与房主关系" min-width="100px"  show-overflow-tooltip></el-table-column>
                  <el-table-column prop="sevice_address" label="服务处所"  show-overflow-tooltip></el-table-column>
                  <el-table-column prop="reason" label="居住事由"  show-overflow-tooltip></el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="提交时间" prop="insTime">
                {{dialogForm7.insTime}}
                <!-- <el-input autocomplete="off" disabled v-model="dialogForm7.insTime"></el-input> -->
              </el-form-item>
            </el-col>
            <el-col  :offset="1" :span="22">
              <el-form-item label="提交人" prop="userId">
                {{dialogForm7.userId}}
                <!-- <el-input autocomplete="off" disabled v-model="dialogForm7.userId"></el-input> -->
              </el-form-item>
            </el-col>
            <el-col  :offset="1" :span="22">
              <el-form-item label="审核人" prop="leadId">
                {{dialogForm7.leadId}}
                <!-- <el-input autocomplete="off" disabled v-model="dialogForm7.leadId"></el-input> -->
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <!-- 实有单位、从业人员信息登记表 -->
      <template v-if="infoType == '1013'">
        <el-form :rules="rule"  :model="dialogForm8" ref="dialogForm8" class="dialog-form" label-width="170px">
          <el-row>
            <el-col  :offset="1" :span="22">
              <el-form-item label="实体名称"  prop="real_name">
                <el-input autocomplete="off" disabled v-model="dialogForm8.real_name"></el-input>
              </el-form-item>
            </el-col>
            <el-col  :offset="1" :span="22">
              <el-form-item label="地上层数"  prop="up_num">
                <el-input autocomplete="off" disabled v-model="dialogForm8.up_num"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col  :offset="1" :span="22">
              <el-form-item label="物业（单位)名称"  prop="property_name">
                <el-input autocomplete="off" disabled v-model="dialogForm8.property_name"></el-input>
              </el-form-item>
            </el-col>
            <el-col  :offset="1" :span="22">
              <el-form-item label="实体地址"  prop="real_address">
                <el-input autocomplete="off" disabled v-model="dialogForm8.real_address"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col  :offset="1" :span="22">
              <el-form-item label="房屋地址"  prop="house_address">
                <el-input autocomplete="off" disabled v-model="dialogForm8.house_address"></el-input>
              </el-form-item>
            </el-col>
            <el-col  :offset="1" :span="22">
              <el-form-item label="产权单位"  prop="property_unit">
                <el-input autocomplete="off" disabled v-model="dialogForm8.property_unit"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col  :offset="1" :span="22">
              <el-form-item label="房屋类型"  prop="house_type">
                <el-input autocomplete="off" disabled v-model="dialogForm8.house_type"></el-input>
              </el-form-item>
            </el-col>
            <el-col  :offset="1" :span="22">
              <el-form-item label="房主证件号码"  prop="cardid">
                <el-input autocomplete="off" disabled v-model="dialogForm8.cardid"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col  :offset="1" :span="22">
              <el-form-item label="是否出租房屋"  prop="yesorno">
                <el-input autocomplete="off" disabled v-model="dialogForm8.yesorno"></el-input>
              </el-form-item>
            </el-col>
            <el-col  :offset="1" :span="22">
              <el-form-item label="出租时间"  prop="lease_time">
                <el-input autocomplete="off" disabled v-model="dialogForm8.lease_time"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col  :offset="1" :span="22">
              <el-form-item label="是否签订责任状"  prop="isduty">
                <el-input autocomplete="off" disabled v-model="dialogForm8.isduty"></el-input>
              </el-form-item>
            </el-col>
            <el-col  :offset="1" :span="22">
              <el-form-item label="出租屋等级"  prop="lease_level">
                <el-input autocomplete="off" disabled v-model="dialogForm8.lease_level"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col  :offset="1" :span="22">
              <el-form-item label="单位名称"  prop="unit_name">
                <el-input autocomplete="off" disabled v-model="dialogForm8.unit_name"></el-input>
              </el-form-item>
            </el-col>
            <el-col  :offset="1" :span="22">
              <el-form-item
                label="法人（负责人）证件号码"

                prop="unit_person_card"
              >
                <el-input autocomplete="off" disabled v-model="dialogForm8.unit_person_card"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col  :offset="1" :span="22">
              <el-form-item label="单位类别"  prop="unit_type">
                <el-input autocomplete="off" disabled v-model="dialogForm8.unit_type"></el-input>
              </el-form-item>
            </el-col>
            <el-col  :offset="1" :span="22">
              <el-form-item label="安保负责人"  prop="safe_person">
                <el-input autocomplete="off" disabled v-model="dialogForm8.safe_person"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col  :offset="1" :span="22">
              <el-form-item label="企业性质"  prop="nature">
                <el-input autocomplete="off" disabled v-model="dialogForm8.nature"></el-input>
              </el-form-item>
            </el-col>
            <el-col  :offset="1" :span="22">
              <el-form-item label="重点单位标识"  prop="unit_imp">
                <el-input autocomplete="off" disabled v-model="dialogForm8.unit_imp"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col  :offset="1" :span="22">
              <el-form-item label="实体分类"  prop="real_type">
                <el-input autocomplete="off" disabled v-model="dialogForm8.real_type"></el-input>
              </el-form-item>
            </el-col>
            <el-col  :offset="1" :span="22">
              <el-form-item label="地下层数"  prop="down_num">
                <el-input autocomplete="off" disabled v-model="dialogForm8.down_num"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col  :offset="1" :span="22">
              <el-form-item label="物业（单位）电话"  prop="property_phone">
                <el-input autocomplete="off" disabled v-model="dialogForm8.property_phone"></el-input>
              </el-form-item>
            </el-col>
            <el-col  :offset="1" :span="22">
              <el-form-item label="产权类型"  prop="property_type">
                <el-input autocomplete="off" disabled v-model="dialogForm8.property_type"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col  :offset="1" :span="22">
              <el-form-item label="管理类型"  prop="admin">
                <el-input autocomplete="off" disabled v-model="dialogForm8.admin"></el-input>
              </el-form-item>
            </el-col>
            <el-col  :offset="1" :span="22">
              <el-form-item label="房主证件类型"  prop="card_type">
                <el-input autocomplete="off" disabled v-model="dialogForm8.card_type"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col  :offset="1" :span="22">
              <el-form-item label="房主联系电话"  prop="ownerphone">
                <el-input autocomplete="off" disabled v-model="dialogForm8.ownerphone"></el-input>
              </el-form-item>
            </el-col>
            <el-col  :offset="1" :span="22">
              <el-form-item label="承租用途"  prop="purpose">
                <el-input autocomplete="off" disabled v-model="dialogForm8.purpose"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col  :offset="1" :span="22">
              <el-form-item label="出租间数"  prop="lease_num">
                <el-input autocomplete="off" disabled v-model="dialogForm8.lease_num"></el-input>
              </el-form-item>
            </el-col>
            <el-col  :offset="1" :span="22">
              <el-form-item label="租住类型"  prop="lease_type">
                <el-input autocomplete="off" disabled v-model="dialogForm8.lease_type"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col  :offset="1" :span="22">
              <el-form-item label="备注"  prop="remarks">
                <el-input autocomplete="off" disabled v-model="dialogForm8.remarks"></el-input>
              </el-form-item>
            </el-col>
            <el-col  :offset="1" :span="22">
              <el-form-item label="法人（负责人）姓名"  prop="unit_person_name">
                <el-input autocomplete="off" disabled v-model="dialogForm8.unit_person_name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col  :offset="1" :span="22">
              <el-form-item
                label="法人（负责人）电话"

                prop="unit_person_phone"
              >
                <el-input autocomplete="off" disabled v-model="dialogForm8.unit_person_phone"></el-input>
              </el-form-item>
            </el-col>
            <el-col  :offset="1" :span="22">
              <el-form-item label="单位电话"  prop="unit_phone">
                <el-input autocomplete="off" disabled v-model="dialogForm8.unit_phone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col  :offset="1" :span="22">
              <el-form-item label="安保负责人电话"  prop="safe_phone">
                <el-input autocomplete="off" disabled v-model="dialogForm8.safe_phone"></el-input>
              </el-form-item>
            </el-col>
            <el-col  :offset="1" :span="22">
              <el-form-item label="单位属性"  prop="unit_property">
                <el-input autocomplete="off" disabled v-model="dialogForm8.unit_property"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col  :offset="1" :span="22">
              <el-form-item
                label="重点单位要害部位分类"

                prop="unit_vitalpart_imp"
              >
                <el-input autocomplete="off" disabled v-model="dialogForm8.unit_vitalpart_imp"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="实有人口信息表" prop="additional">
                <el-table :data="dialogForm8.additional">
                  <el-table-column prop="country" label="国家地区"></el-table-column>
                  <el-table-column prop="name" label="姓名"></el-table-column>
                  <el-table-column prop="sex" label="性别"></el-table-column>
                  <el-table-column prop="card_type" label="证件类型"></el-table-column>
                  <el-table-column prop="cardid" label="证件号码"></el-table-column>
                  <el-table-column prop="phone" label="联系电话"></el-table-column>
                  <el-table-column prop="post" label="职务"></el-table-column>
                  <el-table-column prop="post_time" label="入职时间"></el-table-column>
                  <el-table-column prop="address" label="现住地址"></el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
             <el-col :span="12">
              <el-form-item label="提交时间" prop="insTime">
                {{dialogForm8.insTime}}
                <!-- <el-input autocomplete="off" disabled v-model="dialogForm8.insTime"></el-input> -->
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="提交人" prop="userId" label-width="80px">
                {{dialogForm8.userId}}
                <!-- <el-input autocomplete="off" disabled v-model="dialogForm8.userId"></el-input> -->
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="审核人" prop="leadId" label-width="80px">
                {{dialogForm8.leadId}}
                <!-- <el-input:xs="8" :sm="12" :md="16"  autocomplete="off" disabled v-model="dialogForm8.leadId"></el-input> -->
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <!-- 走访群众登记表 -->
      <template v-if="infoType == '1014'">
        <el-form :rules="rule"  :model="dialogForm9" ref="dialogForm9"  inline label-position="left">
          <el-row>
            <el-col :offset="1" :span="11">
              <el-form-item label="姓名："  prop="name">
                {{dialogForm9.name}}
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="性别："  prop="sex">
                {{dialogForm9.sex}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="11">
              <el-form-item label="联系方式："  prop="mobile">
                {{dialogForm9.mobile}}
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="出生年月："  prop="birthDay">
                {{dialogForm9.birthDay}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="地址："  prop="address">
                {{dialogForm9.address}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="走访目的："  prop="visitAim">
                {{dialogForm9.visitAim}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="走访情况："  prop="visitSituation">
                {{dialogForm9.visitSituation}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="收集的意见和建议："  prop="visitIdea">
                {{dialogForm9.visitIdea}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="备注："  prop="remark">
                {{dialogForm9.remark}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
           <el-row class="reason" v-if="parseInt(infoStatus) !== 1">
            <el-col :offset="1" :span="22">
              <el-form-item label="驳回原因："  prop="reason">
                <el-input type="text" :rows="3"  v-model="dialogForm9.reason" placeholder="驳回请输入驳回理由" v-if="parseInt(infoStatus) === 0"></el-input>
                <span v-else style="color:red;">
                   {{dialogForm9.reason}}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row class="info">
             <el-col :offset="1" :span="7">
              <el-form-item label="提交时间：" prop="insTime" :offset="1" :span="7" label-width="82px">
                {{dialogForm9.insTime}}
              </el-form-item>
            </el-col>
            <el-col :offset="1" :span="7">
              <el-form-item label="提交人：" prop="userId" label-width="68px">
                {{dialogForm9.userId}}
              </el-form-item>
            </el-col>
            <el-col :offset="1" :span="7">
              <el-form-item label="审核人：" prop="leadId" label-width="82px">
                {{dialogForm9.leadId}}
              </el-form-item>
            </el-col>

          </el-row>
        </el-form>
      </template>
      <!-- 交通安全协管登记表 -->
      <template v-if="infoType == '1015'">
        <el-form :rules="rule"  :model="dialogForm10" ref="dialogForm10"  inline label-position="left">
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="时间："  prop="time">
                {{dialogForm10.time}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
            <el-col :offset="1" :span="22">
              <el-form-item label="地点："  prop="address">
                {{dialogForm10.address}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="事由："  prop="cause">
                {{dialogForm10.cause}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="协管情况："  prop="situation">
                {{dialogForm10.situation}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row class="reason" v-if="parseInt(infoStatus) !== 1">
            <el-col :offset="1" :span="22">
              <el-form-item label="驳回原因："  prop="reason">
                <el-input type="text" :rows="3"  v-model="dialogForm10.reason" placeholder="驳回请输入驳回理由" v-if="parseInt(infoStatus) === 0"></el-input>
                <span v-else style="color:red;">
                   {{dialogForm10.reason}}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row class="info">
            <el-col :span="7" :offset="1"  >
              <el-form-item label="提交时间：" prop="insTime" label-width="82px">
                {{dialogForm10.insTime}}
              </el-form-item>
            </el-col>
            <el-col :span="7" :offset="1"  >
              <el-form-item label="提交人：" prop="userId" label-width="68px">
                {{dialogForm10.userId}}
              </el-form-item>
            </el-col>
            <el-col :span="7" :offset="1"  >
              <el-form-item label="审核人：" prop="leadId" label-width="82px">
                {{dialogForm10.leadId}}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <div v-if="infoStatus == 0" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateInfoStatus(1)">通 过</el-button>
        <el-button  @click="reject">驳 回</el-button>
      </div>
    </el-dialog>
    <!-- 审核弹出框 -->
    <el-dialog
      :title="checkDialogTitle"
      :visible.sync="checkDialogVisible"
      :modal-append-to-body="checkDialogVisibleModal"
      :close-on-click-modal="false"
      style="position: absolute"
      width="420px"
    >
      <el-form :model="checkDialogForm" ref="checkDialogForm">
        <el-form-item label="不通过理由"  prop="reason">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入不通过理由（通过请忽略！）"
            v-model="checkDialogForm.reason"
            :disabled="reasonDisabled"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="checkDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateInfoStatus">确 定</el-button>
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
        { name: "信息采集", path: "" }
      ],
      // 详情弹出框，采集类型
      infoType: "",
      // 采集类型
      infoTypes: null,
      // 派出所
      deptIds: null,
      // 状态
      statuses: [
        {
          value: "0",
          label: "待审批"
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
        infoType: "", // 类型
        searchTime: "", // 查询时间
        nameOrAccount: "", // 警号或负责人名称
        deptId: "", // 派出所
        status: "" // 状态
      },
      infoId: "",
      infoStatus: "",
      titleStatusContent: '',
      // 列表数据
      infoData: [
        // {
        //   areaid: "",
        //   deptid: "",
        //   deptname: "",
        //   infodesc: "",
        //   infotype: "",
        //   instime: "",
        //   keyno: "",
        //   leadid: "",
        //   leadresult: "",
        //   leadtime: "",
        //   username: ""
        // }
      ],
      // 分页数据
      currentPage: 1,
      pageSize: 10,
      total: 0,
      // 弹出框数据
      dialogVisible: false,
      dialogVisibleModal: false,
      dialogTitle: "详情",
      // 弹窗数据
      dialogMap: {
        // top单位vh width单位px
        1002: {
          top: 20,
          width: 883,
          name: 'dialogForm1'
        },
        1005: {
          top: 19,
          width: 883,
          name: 'dialogForm2'
        },
        1007: {
          top: 10,
          width: 883,
          name: 'dialogForm3'
        },
        1008: {
          top: 15,
          width: 883,
          name: 'dialogForm4'
        },
        1010: {
          top: 15,
          width: 883,
          name: 'dialogForm5'
        },
        1011: {
          top: 10,
          width: 883,
          name: 'dialogForm6'
        },
        1012: {
          top: 2,
          width: 883,
          name: 'dialogForm7'
        },
        1013: {
          top: 10,
          width: 883,
          name: 'dialogForm8'
        },
        1014: {
          top: 19,
          width: 883,
          name: 'dialogForm9'
        },
        1015: {
          top: 19,
          width: 883,
          name: 'dialogForm10'
        },
      },
      // 巡逻情况登记表表单，1002
      dialogForm1: {
        userId: "",
        insTime: "",
        leadId: "",
        patrol_time: "",
        lead_person: "",
        patrol_person: "",
        other: "",
        patrol_area: "",
        work_content: "",
        work_log: "",
        reason: ""
      },
      // 安全检查情况登记表，1005
      dialogForm2: {
        userId: "",
        insTime: "",
        leadId: "",
        check_date: "",
        check_department: "",
        find_problem: "",
        change_require: "",
        department_opinion: "",
        leader_name: "",
        leader_phone: "",
        attend_policeman: "",
        deptId: "",
        reason: ''
      },
      // 服务群众登记表，1007
      dialogForm3: {
        userId: "",
        insTime: "",
        leadId: "",
        name: "",
        sex: "",
        nation: "",
        birth: "",
        phone: "",
        idcard: "",
        domicile: "",
        address: "",
        break_law: "",
        help_content: "",
        remarks: "",
        reason: ''
      },
      // 治安秩序维护登记表，1008
      dialogForm4: {
        userId: "",
        insTime: "",
        leadId: "",
        collect_date: "",
        collect_address: "",
        collect_cause: "",
        collect_leader: "",
        reason: ''
      },
      // 治安纠纷调解登记表，1010
      dialogForm5: {
        userId: "",
        insTime: "",
        leadId: "",
        case_name: "",
        case_date: "",
        case_mediator: "",
        client1_name: "",
        client1_sex: "",
        client1_address: "",
        client2_name: "",
        client2_sex: "",
        client2_address: "",
        case_content: "",
        inquire_result: "",
        remarks: "",
        reason: ''
      },
      // 重点人口基本信息登记表，1011
      dialogForm6: {
        userId: "",
        insTime: "",
        leadId: "",
        name: "",
        sex: "",
        other_name: "",
        nation: "",
        idcard: "",
        domicile: "",
        address: "",
        person_type: "",
        phone: "",
        other_phone: "",
        other_identity: "",
        meet_situation: "",
        other_situation: "",
        info_situation: "",
        photo: "",
        additional: null,
        reason: ''
      },
      // 实有房屋、实有人口信息登记表，1012
      dialogForm7: {
        userId: "",
        insTime: "",
        leadId: "",
        real_name: "",
        real_type: "",
        up_num: "",
        down_num: "",
        property_name: "",
        property_phone: "",
        real_address: "",
        house_address: "",
        property_unit: "",
        property_type: "",
        house_type: "",
        admin: "",
        ownername: "",
        card_type: "",
        cardid: "",
        ownerphone: "",
        yesorno: "",
        purpose: "",
        lease_time: "",
        lease_num: "",
        isduty: "",
        lease_type: "",
        lease_level: "",
        remarks: "",
        additional: null,
        reason: ''
      },
      // 实有单位、从业人员信息登记表，1013
      dialogForm8: {
        userId: "",
        insTime: "",
        leadId: "",
        real_name: "",
        real_type: "",
        up_num: "",
        down_num: "",
        property_name: "",
        property_phone: "",
        real_address: "",
        house_address: "",
        property_unit: "",
        property_type: "",
        house_type: "",
        admin: "",
        ownername: "",
        card_type: "",
        cardid: "",
        ownerphone: "",
        yesorno: "",
        purpose: "",
        lease_time: "",
        lease_num: "",
        isduty: "",
        lease_type: "",
        lease_level: "",
        remarks: "",
        unit_name: "",
        unit_person_name: "",
        unit_person_card: "",
        unit_person_phone: "",
        unit_type: "",
        unit_phone: "",
        safe_person: "",
        safe_phone: "",
        nature: "",
        unit_property: "",
        unit_imp: "",
        unit_vitalpart_imp: "",
        additional: null,
        reason: ''
      },
      // 走访群众登记表，1014
      dialogForm9: {
        userId: "",
        insTime: "",
        leadId: "",
        name: "",
        real_type: "",
        sex: "",
        birthDay: "",
        mobile: "",
        address: "",
        visitAim: "",
        visitSituation: "",
        visitIdea: "",
        remark: "",
        reason: ''
      },
      // 交通安全协管登记表，1015
      dialogForm10: {
        userId: "",
        insTime: "",
        leadId: "",
        time: "",
        address: "",
        cause: "",
        situation: "",
        reason: ''
      },
      rule: {
        // 驳回理由
        reason: [{
          trigger: 'blur',
          validator: reasonValidate
        }]
      },
      // 审核弹出框数据
      checkDialogVisible: false,
      checkDialogVisibleModal: false,
      checkDialogTitle: "",
      checkDialogForm: {
        id: "",
        status: "",
        reason: ""
      },
      reasonDisabled: true,
      formLabelWidth: "120px"
    };
  },
  mounted: function() {
    // 初始化采集类型下拉列表
    this.initInfoTypes();
    // 初始化派出所下拉列表
    this.initDeptIds();
    // 初始化采集列表
    this.infoCollect();
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
        ? "不通过"
        : "";
    },
    getLeadTime: function(value) {
      return value ? fjPublic.dateStrFormat(value) : "";
    },
    // 巡逻情况登记表
    trans_patrol_time (date) {
      let time = date.split(',')
      let str = ''
      if (time.length) {
        str = time[0] + ' ~ ' + time[1]
      } else {
        str = '暂无数据'
      }
      return str
    }
  },
  methods: {
    currentPageChange: function(pageNum) {
      // 点击某个分页按钮
      this.currentPage = pageNum;
      this.infoCollect();
    },
    prevPageChange: function(pageNum) {
      // 点击分页的上一页
      this.currentPage = pageNum;
      this.infoCollect();
    },
    nextPageChange: function(pageNum) {
      // 点击分页的下一页
      this.currentPage = pageNum;
      this.infoCollect();
    },
    sizePageChange: function(pageSize) {
      // 改变每页条数时
      this.currentPage = 1;
      this.pageSize = pageSize;
      this.infoCollect();
    },
    // 重置按钮
    resetSearch() {
      this.searchForm =  {
        infoType: "", // 类型
        searchTime: "", // 查询时间
        nameOrAccount: "", // 警号或负责人名称
        deptId: "", // 派出所
        status: "" // 状态
      }
      this.infoCollect()
    },
    // 初始化采集类型
    initInfoTypes: function() {
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/getSelectFromDict",
        type: "POST",
        data: {
          dictType: "INFOCOLLECT",
          hasEmpty: "1"
        },
        dataType: "json",
        success: function(data) {
          vm.infoTypes = data.dict;
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
    // 修改类型下拉框查询
    changeInfoType: function(infoType) {
      this.searchForm["infoType"] = infoType;
      this.infoCollect();
    },
    // 修改单位下拉框查询
    changeDeptId: function(deptId) {
      this.searchForm["deptId"] = deptId;
      this.infoCollect();
    },
    // 修改状态下拉框查询
    changeStatus: function(status) {
      this.searchForm["status"] = status;
      this.infoCollect();
    },
    // 标题或负责人名称查询
    searchMission: function(missionState) {
      this.infoCollect();
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
      this.infoCollect();
    },
    // 获取采集列表
    infoCollect: function() {
      var defer = $.Deferred();
      var vm = this;
      // 参数
      this.searchForm["page"] = this.currentPage;
      this.searchForm["rows"] = this.pageSize;
      // 传入当前用户信息
      this.searchForm["nowUser"] = $.cookie(fjPublic.loginCookieKey);
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/infoCollect",
        type: "POST",
        data: vm.searchForm,
        dataType: "json",
        success: function(data) {
          vm.infoData = null;
          vm.infoData = data.list;
          vm.total = data.total;
          _.each(vm.infoData, function(item, i) {
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
    openAddOrDetailDialog: function(keyno, infoType, leadresult) {
      this.infoId = keyno;
      this.infoStatus = leadresult;

      // 采集类型
      this.infoType = infoType;
      // 详情
      var defer = $.Deferred();
      var vm = this
      let form = this.dialogMap[this.infoType]
      let name = ''
      if (form) {
        name = this.dialogMap[this.infoType].name
        $.ajax({
        url: fjPublic.ajaxUrlDNN + "/infoDetail",
        type: "POST",
        data: {
          keyno: keyno,
          type: vm.infoType
        },
        dataType: "json",
        success: function(data) {
          if (data.info.errorCode) {
            vm.$message({
              type: "error",
              message: data.info.errorMsg
            });
          } else {
             vm[name].reason = data.info.leadContent
            // 巡逻情况登记表
            if (vm.infoType == "1002") {
              vm.dialogForm1["userId"] = data.info.userId;
              vm.dialogForm1["insTime"] = data.info.insTime;
              vm.dialogForm1["leadId"] = data.info.leadName;
              vm.dialogForm1["patrol_time"] = data.info.patrol_time;
              vm.dialogForm1["lead_person"] = data.info.lead_person;
              vm.dialogForm1["patrol_person"] = data.info.patrol_person;
              vm.dialogForm1["other"] = data.info.other;
              vm.dialogForm1["patrol_area"] = data.info.patrol_area;
              vm.dialogForm1["work_content"] = data.info.work_content;
              vm.dialogForm1["work_log"] = data.info.work_log;

              vm.dialogTitle = "巡逻情况登记表";
              // 安全检查情况登记表
            } else if (vm.infoType == "1005") {
              vm.dialogForm2["userId"] = data.info.userId;
              vm.dialogForm2["insTime"] = data.info.insTime;
              vm.dialogForm2["leadId"] = data.info.leadName;
              vm.dialogForm2["check_date"] = data.info.check_date;
              vm.dialogForm2["check_department"] = data.info.check_department;
              vm.dialogForm2["find_problem"] = data.info.find_problem;
              vm.dialogForm2["change_require"] = data.info.change_require;
              vm.dialogForm2["department_opinion"] =
                data.info.department_opinion;
              vm.dialogForm2["leader_name"] = data.info.leader_name;
              vm.dialogForm2["leader_phone"] = data.info.leader_phone;
              vm.dialogForm2["attend_policeman"] = data.info.attend_policeman;
              vm.dialogForm2["deptId"] = data.info.deptId;
              vm.dialogTitle = "安全检查情况登记表";
              // 服务群众登记表
            } else if (vm.infoType == "1007") {
              vm.dialogForm3["userId"] = data.info.userId;
              vm.dialogForm3["insTime"] = data.info.insTime;
              vm.dialogForm3["leadId"] = data.info.leadName;
              vm.dialogForm3["name"] = data.info.name;
              vm.dialogForm3["sex"] = data.info.sex;
              vm.dialogForm3["nation"] = data.info.nation;
              vm.dialogForm3["birth"] = data.info.birth;
              vm.dialogForm3["phone"] = data.info.phone;
              vm.dialogForm3["idcard"] = data.info.idcard;
              vm.dialogForm3["domicile"] = data.info.domicile;
              vm.dialogForm3["address"] = data.info.address;
              vm.dialogForm3["break_law"] = data.info.break_law;
              vm.dialogForm3["help_content"] = data.info.help_content;
              vm.dialogForm3["remarks"] = data.info.remarks;
              vm.dialogTitle = "服务群众登记表";
              // 治安秩序维护登记表
            } else if (vm.infoType == "1008") {
              vm.dialogForm4["userId"] = data.info.userId;
              vm.dialogForm4["insTime"] = data.info.insTime;
              vm.dialogForm4["leadId"] = data.info.leadName;
              vm.dialogForm4["collect_date"] = data.info.collect_date;
              vm.dialogForm4["collect_address"] = data.info.collect_address;
              vm.dialogForm4["collect_cause"] = data.info.collect_cause;
              vm.dialogForm4["collect_leader"] = data.info.collect_leader;
              vm.dialogTitle = "治安秩序维护登记表";
              // 治安纠纷调解登记表
            } else if (vm.infoType == "1010") {
              vm.dialogForm5["userId"] = data.info.userId;
              vm.dialogForm5["insTime"] = data.info.insTime;
              vm.dialogForm5["leadId"] = data.info.leadName;
              vm.dialogForm5["case_name"] = data.info.case_name;
              vm.dialogForm5["case_date"] = data.info.case_date;
              vm.dialogForm5["case_mediator"] = data.info.case_mediator;
              vm.dialogForm5["client1_name"] = data.info.client1_name;
              vm.dialogForm5["client1_sex"] = data.info.client1_sex;
              vm.dialogForm5["client1_address"] = data.info.client1_address;
              vm.dialogForm5["client2_name"] = data.info.client2_name;
              vm.dialogForm5["client2_sex"] = data.info.client2_sex;
              vm.dialogForm5["client2_address"] = data.info.client2_address;
              vm.dialogForm5["case_content"] = data.info.case_content;
              vm.dialogForm5["inquire_result"] = data.info.inquire_result;
              vm.dialogForm5["remarks"] = data.info.remarks;
              vm.dialogForm5.client1_idcard = data.info.client1_idcard;
              vm.dialogForm5.client2_idcard = data.info.client2_idcard;
              vm.dialogForm5.client1_birth = data.info.client1_birth;
              vm.dialogForm5.client2_birth = data.info.client2_birth;
              vm.dialogTitle = "治安纠纷调解登记表";
              // 重点人口基本信息登记表
            } else if (vm.infoType == "1011") {
              vm.dialogForm6["userId"] = data.info.userId;
              vm.dialogForm6["insTime"] = data.info.insTime;
              vm.dialogForm6["leadId"] = data.info.leadName;
              vm.dialogForm6["name"] = data.info.name;
              vm.dialogForm6["sex"] = data.info.sex;
              vm.dialogForm6["other_name"] = data.info.other_name;
              vm.dialogForm6["nation"] = data.info.nation;
              vm.dialogForm6["idcard"] = data.info.idcard;
              vm.dialogForm6["domicile"] = data.info.domicile;
              vm.dialogForm6["address"] = data.info.address;
              vm.dialogForm6["person_type"] = data.info.person_type;
              vm.dialogForm6["phone"] = data.info.phone;
              vm.dialogForm6["other_phone"] = data.info.other_phone;
              vm.dialogForm6["other_identity"] = data.info.other_identity;
              vm.dialogForm6["meet_situation"] = data.info.meet_situation;
              vm.dialogForm6["other_situation"] = data.info.other_situation;
              vm.dialogForm6["info_situation"] = data.info.info_situation;
              vm.dialogForm6["photo"] = data.info.photo;
              vm.dialogForm6["additional"] = null;
              vm.dialogForm6["additional"] = data.info.additional;
              vm.dialogTitle = "重点人口基本信息登记表";
              // 实有房屋、实有人口信息登记表
            } else if (vm.infoType == "1012") {
              vm.dialogForm7["userId"] = data.info.userId;
              vm.dialogForm7["insTime"] = data.info.insTime;
              vm.dialogForm7["leadId"] = data.info.leadName;
              vm.dialogForm7["real_name"] = data.info.real_name;
              vm.dialogForm7["real_type"] = data.info.real_type;
              vm.dialogForm7["up_num"] = data.info.up_num;
              vm.dialogForm7["down_num"] = data.info.down_num;
              vm.dialogForm7["property_name"] = data.info.property_name;
              vm.dialogForm7["property_phone"] = data.info.property_phone;
              vm.dialogForm7["real_address"] = data.info.real_address;
              vm.dialogForm7["house_address"] = data.info.house_address;
              vm.dialogForm7["property_unit"] = data.info.property_unit;
              vm.dialogForm7["property_type"] = data.info.property_type;
              vm.dialogForm7["house_type"] = data.info.house_type;
              vm.dialogForm7["admin"] = data.info.admin;
              vm.dialogForm7["ownername"] = data.info.ownername;
              vm.dialogForm7["card_type"] = data.info.card_type;
              vm.dialogForm7["cardid"] = data.info.cardid;
              vm.dialogForm7["ownerphone"] = data.info.ownerphone;
              vm.dialogForm7["yesorno"] = data.info.yesorno;
              vm.dialogForm7["purpose"] = data.info.purpose;
              vm.dialogForm7["lease_time"] = data.info.lease_time;
              vm.dialogForm7["lease_num"] = data.info.lease_num;
              vm.dialogForm7["isduty"] = data.info.isduty;
              vm.dialogForm7["lease_type"] = data.info.lease_type;
              vm.dialogForm7["lease_level"] = data.info.lease_level;
              vm.dialogForm7["remarks"] = data.info.remarks;
              vm.dialogForm7["additional"] = null;
              vm.dialogForm7["additional"] = data.info.additional;
              vm.dialogTitle = "实有房屋、实有人口信息登记表";
              // 实有单位、从业人员信息登记表
            } else if (vm.infoType == "1013") {
              vm.dialogForm8["userId"] = data.info.userId;
              vm.dialogForm8["insTime"] = data.info.insTime;
              vm.dialogForm8["leadId"] = data.info.leadName;
              vm.dialogForm8["real_name"] = data.info.real_name;
              vm.dialogForm8["real_type"] = data.info.real_type;
              vm.dialogForm8["up_num"] = data.info.up_num;
              vm.dialogForm8["down_num"] = data.info.down_num;
              vm.dialogForm8["property_name"] = data.info.property_name;
              vm.dialogForm8["property_phone"] = data.info.property_phone;
              vm.dialogForm8["real_address"] = data.info.real_address;
              vm.dialogForm8["house_address"] = data.info.house_address;
              vm.dialogForm8["property_unit"] = data.info.property_unit;
              vm.dialogForm8["property_type"] = data.info.property_type;
              vm.dialogForm8["house_type"] = data.info.house_type;
              vm.dialogForm8["admin"] = data.info.admin;
              vm.dialogForm8["ownername"] = data.info.ownername;
              vm.dialogForm8["card_type"] = data.info.card_type;
              vm.dialogForm8["cardid"] = data.info.cardid;
              vm.dialogForm8["ownerphone"] = data.info.ownerphone;
              vm.dialogForm8["yesorno"] = data.info.yesorno;
              vm.dialogForm8["purpose"] = data.info.purpose;
              vm.dialogForm8["lease_time"] = data.info.lease_time;
              vm.dialogForm8["lease_num"] = data.info.lease_num;
              vm.dialogForm8["isduty"] = data.info.isduty;
              vm.dialogForm8["lease_type"] = data.info.lease_type;
              vm.dialogForm8["lease_level"] = data.info.lease_level;
              vm.dialogForm8["remarks"] = data.info.remarks;
              vm.dialogForm8["unit_name"] = data.info.unit_name;
              vm.dialogForm8["unit_person_name"] = data.info.unit_person_name;
              vm.dialogForm8["unit_person_card"] = data.info.unit_person_card;
              vm.dialogForm8["unit_person_phone"] = data.info.unit_person_phone;
              vm.dialogForm8["unit_type"] = data.info.unit_type;
              vm.dialogForm8["unit_phone"] = data.info.unit_phone;
              vm.dialogForm8["safe_person"] = data.info.safe_person;
              vm.dialogForm8["safe_phone"] = data.info.safe_phone;
              vm.dialogForm8["nature"] = data.info.nature;
              vm.dialogForm8["unit_property"] = data.info.unit_property;
              vm.dialogForm8["unit_imp"] = data.info.unit_imp;
              vm.dialogForm8["unit_vitalpart_imp"] =
                data.info.unit_vitalpart_imp;
              vm.dialogForm8["additional"] = null;
              vm.dialogForm8["additional"] = data.info.additional;
              vm.dialogTitle = "实有单位、从业人员信息登记表";
              // 走访群众登记表
            } else if (vm.infoType == "1014") {
              vm.dialogForm9["userId"] = data.info.userId;
              vm.dialogForm9["insTime"] = data.info.insTime;
              vm.dialogForm9["leadId"] = data.info.leadName;
              vm.dialogForm9["name"] = data.info.name;
              vm.dialogForm9["sex"] = data.info.sex;
              vm.dialogForm9["birthDay"] = data.info.birthDay;
              vm.dialogForm9["mobile"] = data.info.mobile;
              vm.dialogForm9["address"] = data.info.address;
              vm.dialogForm9["visitAim"] = data.info.visitAim;
              vm.dialogForm9["visitSituation"] = data.info.visitSituation;
              vm.dialogForm9["visitIdea"] = data.info.visitIdea;
              vm.dialogForm9["remark"] = data.info.remark;
              vm.dialogTitle = "走访群众登记表";
              // 交通安全协管登记表
            } else if (vm.infoType == "1015") {
              vm.dialogForm10["userId"] = data.info.userId;
              vm.dialogForm10["insTime"] = data.info.insTime;
              vm.dialogForm10["leadId"] = data.info.leadName;
              vm.dialogForm10["time"] = data.info.time;
              vm.dialogForm10["address"] = data.info.address;
              vm.dialogForm10["cause"] = data.info.cause;
              vm.dialogForm10["situation"] = data.info.situation;
              vm.dialogTitle = "交通安全协管登记表";
            }
            // 显示弹出框
            vm.dialogVisible = true;
          }
          defer.resolve();
        },
        error: function(err) {
          defer.reject();
        }
      });
      } else {
        this.$message.error('数据不存在')
      }

    },
    // 驳回
    reject: function() {
      let name = this.dialogMap[this.infoType].name
      this.checkDialogForm["id"] = this.infoId;
      this.checkDialogForm["status"] = 2;
      this.checkDialogForm.reason = this[name].reason
      this.$refs[name].validate((validate) => {
        if (validate) {
          this.updateInfoStatus(2)
        }
      })
    },
    // 保存工作任务
    updateInfoStatus: function(status) {
      var defer = $.Deferred();
      var vm = this;
      // 传入当前用户信息
      vm.checkDialogForm["nowUser"] = $.cookie(fjPublic.loginCookieKey);
      if (status == 1) {
        this.checkDialogForm["id"] = this.infoId;
        this.checkDialogForm["status"] = status;
      }
      let ajax = () => {
        $.ajax({
          url: fjPublic.ajaxUrlDNN + "/updateInfoStatus",
          type: "POST",
          data: vm.checkDialogForm,
          dataType: "json",
          success: function(data) {
            if (data.errorCode == 0) {
              vm.checkDialogVisible = false;
              vm.dialogVisible = false;
              vm.$message({
                type: 'success',
                message: '操作成功'
              })
              vm.infoCollect();
            } else {
              vm.$message.error(data.errorMsg)
            }
            defer.resolve();
          },
          error: function(err) {
            defer.reject();
          }
        });
      }
      ajax()
    },
    dateStrFormat (row, type) {
      let dateStr = row[type.property]
      if (!dateStr) {
          return ''
      }
      return dateStr.substr(4, 2) + '/' + dateStr.substr(6, 2)
      + ' ' + dateStr.substr(8, 2) + ':' + dateStr.substr(10, 2)
    },
    instimeFormat(row) {
      let dateStr = row.instime
      if (!dateStr) {
          return ''
      }
      return dateStr.substr(5, 2) + '/' + dateStr.substr(8, 2)
      + ' ' + dateStr.substr(11, 2) + ':' + dateStr.substr(14, 2)
    },
    // 弹窗关闭事件
    closeDialog() {
      if (this.infoType) {
        let name = this.dialogMap[this.infoType].name
        if (name) {
          if (this.$refs[name]) {
            this.$refs[name].clearValidate()
          }
        }
      }
    }
  },
  components: {
    fjBreadNav
  }
};
</script>
<style scope lang="less">
.fj-info {
  .fj-search-inline-info {
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
      .el-col-lg-5:last-child {
        .el-form-item {
          .el-button {
            @media only screen and (min-width: 1200px) {
              &.reset {
                margin-top: 46px;
              }
            }
            @media only screen and (min-width: 1367px) {
              &.reset {
                margin-top: 0;
              }
            }
          }
        }
      }
    }
  }
  .tables {
    .mj-page_wrap  {
      /deep/  .el-pagination {
        text-align: right;
      }
    }
    // 状态
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

  /deep/ .el-input.is-disabled{
      .el-input__inner  {
        color: rgba(0,0,0,.15)
      }
  }
  /deep/ .el-textarea.is-disabled {
      .el-textarea__inner  {
        color: rgba(0,0,0,.15)
      }
  }
}
</style>


