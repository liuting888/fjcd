<template>
    <div class="fj-content_view pInfo">
        <div class="fj-block title">
            <fj-breadNav :bread-data="breadData[breadFrom]"></fj-breadNav>
        </div>
        <div class="fj-block content">
            <div class="fj-block-head kaohe">
				<p class="title fj-fl">基本信息</p>
                <div class="details fj-fr">
                    <el-button class="fj-fr" type="primary" @click="openPersonelLocus"><i class="el-icon-location-outline"></i><span>个人轨迹</span></el-button>
                </div>
			</div>
      <div class="fj-block-body basicInfo">
          <div id="userImg" class="userPopHeadImg"><img :data-original="headImgUrl+userId" :src="headImgUrl+userId" alt="" @click="UserInfoAddViewer"></div>
          <el-form :model="basicInfo">
              <el-row>
                  <el-col :span="8">
                      <el-form-item label="警号：">
                          <p class="info-line" v-text="basicInfo.userAccount"></p>
                      </el-form-item>
                      <el-form-item label="姓名：">
                          <p class="info-line" v-text="basicInfo.userName"></p>
                      </el-form-item>
                      <el-form-item label="角色：">
                          <p class="info-line" v-text="basicInfo.userRole"></p>
                      </el-form-item>
                      <el-form-item label="身份证号：">
                          <p class="info-line" v-text="basicInfo.idcard"></p>
                      </el-form-item>
                      <el-form-item label="出生日期：">
                          <p class="info-line" v-text="basicInfo.birth"></p>
                      </el-form-item>
                  </el-col>
                  <el-col :span="8">
                      <el-form-item label="政治面貌：">
                          <p class="info-line" v-text="basicInfo.political"></p>
                      </el-form-item>
                      <el-form-item label="性别：">
                          <p class="info-line" v-text="basicInfo.sex"></p>
                      </el-form-item>
                      <el-form-item label="工作单位：">
                          <p class="info-line" v-text="basicInfo.deptname"></p>
                      </el-form-item>
                      <el-form-item label="婚姻状况：">
                          <p class="info-line" v-text="basicInfo.marriage"></p>
                      </el-form-item>
                      <el-form-item label="电话号码：">
                          <p class="info-line" v-text="basicInfo.mobile"></p>
                      </el-form-item>
                  </el-col>
                  <el-col :span="8">
                      <el-form-item label="紧急联系人：">
                          <p class="info-line" v-text="basicInfo.contactName"></p>
                      </el-form-item>
                      <el-form-item label="紧急联系电话：">
                          <p class="info-line" v-text="basicInfo.contactTele"></p>
                      </el-form-item>
                      <el-form-item label="家庭住址：">
                          <p class="info-line" v-text="basicInfo.address"></p>
                      </el-form-item>
                  </el-col>
              </el-row>
          </el-form>
      </div>
      <div class="fj-block-head kaohe">
				<p class="title">工作日志</p>
			</div>
            <div class="fj-block-body work-log">
                <el-table :data="workLogData">
                    <el-table-column prop="content" label="日志内容">
                      <template slot-scope="slot">
                        <span class="ope-txt" @click="openWLDialog(slot.row)">{{slot.row.content}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="leadId" width="120" label="审核人"></el-table-column>
                    <el-table-column prop="leadResult1" width="120" label="状态"></el-table-column>
                    <el-table-column prop="userId" width="120" label="提交人"></el-table-column>
                    <el-table-column width="240" label="提交时间">
                        <template slot-scope="slot">
                            <span>{{slot.row.insTime | WLdate}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="fj-block-head kaohe">
				      <p class="title">辅警台账</p>
			      </div>
            <div class="fj-block-body info-type">
                <el-table :data="TZData">
                    <el-table-column label="台账名称">
                        <template slot-scope="slot">
                            <span class="ope-txt" @click="showInfoType(slot.row)" v-text="slot.row.infodesc"></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="leadid" width="120" label="审核人"></el-table-column>
                    <el-table-column prop="leadresult1" width="120" label="状态"></el-table-column>
                    <el-table-column prop="userid" width="120" label="提交人"></el-table-column>
                    <el-table-column prop="instime" width="240" label="提交时间">
                        <template slot-scope="slot">
                            <span>{{slot.row.instime | tzDate}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!-- 台账弹层 -->
        <el-dialog
          :title="dialogTitle"
          :visible.sync="dialogVisible"
          :modal-append-to-body="dialogVisibleModal"
          :close-on-click-modal="dialogVisibleModal"
          width="883px"
          @close="closeTZDialog"
        >
          <el-row slot="title" class="dialog-title">
              <el-col :offset="1" :span="23">
                <span >{{dialogTitle}}</span>
                <div
                  class="title-status"
                  :class="setTZTitleState"
                  v-text="setTZTitlesText"></div>
              </el-col>
          </el-row>
      <!-- 巡逻情况登记表 -->
      <template v-if="infoType == '1002'">
        <el-form :rules="TZformRule"  :model="dialogForm1002" ref="dialogForm1">
          <el-row>
            <el-col :offset="1" :span="22" >
              <el-form-item label="巡逻时段："  prop="patrol_time">
                {{dialogForm1002.patrol_time | XLQKdate}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="带班民警和辅警："  prop="lead_person">
                {{dialogForm1002.lead_person}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="巡逻人员："  prop="patrol_person">
                {{dialogForm1002.patrol_person}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col> 
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="其他防范力量："  prop="other">
                {{dialogForm1002.other}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="巡逻地段："  prop="patrol_area">
                {{dialogForm1002.patrol_area}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="工作任务："  prop="work_content">
                {{dialogForm1002.work_content}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="执勤记录："  prop="work_log">
                {{dialogForm1002.work_log}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row class="reason" v-if="parseInt(infoStatus) !== 1">
            <el-col :offset="1" :span="22">
              <el-form-item label="驳回原因："  prop="reason">
                <el-input type="textarea" :rows="3"  v-model="dialogForm1002.reason" placeholder="驳回请输入驳回理由" v-if="parseInt(infoStatus) === 0"></el-input>
                <span v-else style="color:red;">
                   {{dialogForm1002.reason}}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row class="info">
            <el-col :span="7" :offset="1" >
              <el-form-item label="提交时间：" prop="insTime">
                {{dialogForm1002.insTime}}
              </el-form-item>
            </el-col>
              
            <el-col :span="7" :offset="1" >
              <el-form-item label="提交人：" prop="userId">
                {{dialogForm1002.userId}}
              </el-form-item>
            </el-col>
            <el-col :span="7" :offset="1" >
              <el-form-item label="审核人：" prop="leadId">
                {{dialogForm1002.leadId}}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <!-- 安全检查情况登记表 -->
      <template v-if="infoType == '1005'">
        <el-form :rules="TZformRule"  :model="dialogForm1005" ref="dialogForm1005" class="dialog-form dialogForm1005">
          <el-row>
            <el-col :offset="1" :span="11">
              <el-form-item label="检查日期："  prop="check_date">
                {{dialogForm1005.check_date}}
              </el-form-item>
            </el-col>
            <el-col  :span="11">
              <el-form-item label="被检查单位："  prop="check_department">
                {{dialogForm1005.check_department}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="11">
              <el-form-item label="被检查单位责任人："  prop="leader_name">
                {{dialogForm1005.leader_name}}
              </el-form-item>
            </el-col>
            <el-col  :span="11">
              <el-form-item label="被检查单位电话："  prop="leader_phone">
                {{dialogForm1005.leader_phone}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="检查单位："  prop="deptId">
                {{dialogForm1005.deptId}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="参检民警和辅警："  prop="attend_policeman">
                {{dialogForm1005.attend_policeman}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="发现问题："  prop="find_problem">
                {{dialogForm1005.find_problem}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="整改要求："  prop="change_require">
                {{dialogForm1005.change_require}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="被检查单位意见："  prop="department_opinion">
                {{dialogForm1005.department_opinion}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row class="reason" v-if="parseInt(infoStatus) !== 1">
            <el-col :offset="1" :span="22">
              <el-form-item label="驳回原因："  prop="reason">
                <el-input type="textarea" :rows="3"  v-model="dialogForm1005.reason" placeholder="驳回请输入驳回理由" v-if="parseInt(infoStatus) === 0"></el-input>
                <span v-else style="color:red;">
                   {{dialogForm1005.reason}}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row class="info">
            <el-col :span="7" :offset="1"  >
              <el-form-item label="提交时间：" prop="insTime">
                {{dialogForm1005.insTime}}
              </el-form-item>
            </el-col>
            <el-col :span="7" :offset="1"  >
              <el-form-item label="提交人：" prop="userId">
                {{dialogForm1005.userId}}
              </el-form-item>
            </el-col>
            <el-col :span="7" :offset="1"  >
              <el-form-item label="审核人：" prop="leadId">
                {{dialogForm1005.leadId}}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <!-- 服务群众登记表 -->
      <template v-if="infoType == '1007'">
        <el-form :rules="TZformRule"  :model="dialogForm1007" ref="dialogForm1007">
          <el-row>
            <el-col :offset="1" :span="11">
              <el-form-item label="姓名："  prop="name">
                {{dialogForm1007.name}}
              </el-form-item>
            </el-col>
            <el-col  :span="11">
              <el-form-item label="性别："  prop="sex">
                {{dialogForm1007.sex}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="11">
              <el-form-item label="民族："  prop="nation">
                {{dialogForm1007.nation}}
              </el-form-item>
            </el-col>
            <el-col  :span="11">
              <el-form-item label="出生年月："  prop="birth">
                {{dialogForm1007.birth}}
              </el-form-item>
            </el-col>
           <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="11">
              <el-form-item label="电话："  prop="phone">
                {{dialogForm1007.phone}}
              </el-form-item>
            </el-col >
            <el-col :span="11">
              <el-form-item label="身份证号："  prop="idcard">
                {{dialogForm1007.idcard}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
         
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="户口所在地："  prop="domicile">
                {{dialogForm1007.domicile}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="现居住地址："  prop="address">
                {{dialogForm1007.address}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="违法情况："  prop="break_law">
                {{dialogForm1007.break_law}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="帮扶情况："  prop="help_content">
                {{dialogForm1007.help_content}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="备注："  prop="remarks">
                {{dialogForm1007.remarks}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row class="reason" v-if="parseInt(infoStatus) !== 1">
            <el-col :offset="1" :span="22">
              <el-form-item label="驳回原因："  prop="reason">
                <el-input type="textarea" :rows="3"  v-model="dialogForm1007.reason" placeholder="驳回请输入驳回理由" v-if="parseInt(infoStatus) === 0"></el-input>
                <span v-else style="color:red;">
                   {{dialogForm1007.reason}}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row class="info">
             <el-col :offset="1" :span="7">
              <el-form-item label="提交时间：" prop="insTime">
                {{dialogForm1007.insTime}}
              </el-form-item>
            </el-col>
            <el-col :offset="1" :span="7">
              <el-form-item label="提交人：" prop="userId">
                {{dialogForm1007.userId}}
              </el-form-item>
            </el-col>
            <el-col :offset="1" :span="7">
              <el-form-item label="审核人：" prop="leadId">
                {{dialogForm1007.leadId}}
              </el-form-item>
            </el-col>
           
          </el-row>
        </el-form>
      </template>
      <!-- 治安秩序维护登记表 -->
      <template v-if="infoType == '1008'">
        <el-form :rules="TZformRule"  :model="dialogForm1008" ref="dialogForm1008">
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="时间："  prop="collect_date">
                {{dialogForm1008.collect_date}}
              </el-form-item>
            </el-col>
            <el-col :offset="1" :span="22">
              <el-form-item label="地点："  prop="collect_address">
                {{dialogForm1008.collect_address}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item  prop="collect_leader">
                <div slot="label">带队(责任)民警</div>
                {{dialogForm1008.collect_leader}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="事由："  prop="collect_cause">
                {{dialogForm1008.collect_cause}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="reason" v-if="parseInt(infoStatus) !== 1">
            <el-col :offset="1" :span="22">
              <el-form-item label="驳回原因："  prop="reason">
                <el-input type="textarea" :rows="3"  v-model="dialogForm1008.reason" placeholder="驳回请输入驳回理由" v-if="parseInt(infoStatus) === 0"></el-input>
                <span v-else style="color:red;">
                   {{dialogForm1008.reason}}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row class="info">
            <el-col :offset="1" :span="7">
              <el-form-item label="提交时间：" prop="insTime">
                {{dialogForm1008.insTime}}
              </el-form-item>
            </el-col>
            <el-col :offset="1" :span="7">
              <el-form-item label="提交人：" prop="userId">
                {{dialogForm1008.userId}}
              </el-form-item>
            </el-col>
            <el-col :offset="1" :span="7">
              <el-form-item label="审核人：" prop="leadId">
                {{dialogForm1008.leadId}}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <!-- 治安纠纷调解登记表 -->
      <template v-if="infoType == '1010'">
        <el-form :rules="TZformRule"  :model="dialogForm1010" ref="dialogForm1010">
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="事件名称："  prop="case_name">
                {{dialogForm1010.case_name}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col> 
          </el-row>
          <el-row>
            <el-col :offset="1" :span="11">
              <el-form-item label="调解日期："  prop="case_date">
                {{dialogForm1010.case_date}}
              </el-form-item>
            </el-col>
            <el-col  :span="11">
              <el-form-item label="调解人员："  prop="case_mediator">
                {{dialogForm1010.case_mediator}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="11">
              <el-form-item label="当事人A基本信息" style="font-weight:500;"></el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="当事人B基本信息" style="font-weight:500;"></el-form-item>
            </el-col>
             <el-col :span="1"></el-col> 
          </el-row>
          <el-row>
            <el-col :offset="1" :span="11">
              <el-form-item label="姓名："  prop="client1_name">
                {{dialogForm1010.client1_name}}
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="姓名："  prop="client2_name">
                {{dialogForm1010.client2_name}}
              </el-form-item>
            </el-col>
             <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="11">
              <el-form-item label="性别："  prop="client1_sex">
                {{dialogForm1010.client1_sex}}
              </el-form-item>
            </el-col>
            <el-col  :span="11">
              <el-form-item label="性别："  prop="client2_sex">
                {{dialogForm1010.client2_sex}}
              </el-form-item>
            </el-col>
             <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="11">
              <el-form-item label="出生日期："  prop="client1_birth">
                {{dialogForm1010.client1_birth}}
              </el-form-item>
            </el-col>
            <el-col  :span="11">
              <el-form-item label="出生日期："  prop="client2_birth">
                {{dialogForm1010.client2_birth}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="11">
              <el-form-item label="身份证号码："  prop="client1_idcard">
                {{dialogForm1010.client1_idcard}}
              </el-form-item>
            </el-col>
            <el-col  :span="11">
              <el-form-item label="身份证号码："  prop="client2_idcard">
                {{dialogForm1010.client1_idcard}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="11">
              <el-form-item label="家庭住址："  prop="client1_address">
                {{dialogForm1010.client1_address}}
              </el-form-item>
            </el-col>
            <el-col  :span="11">
              <el-form-item label="家庭住址："  prop="client2_address">
                {{dialogForm1010.client2_address}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="简要情况："  prop="case_content">
                {{dialogForm1010.case_content}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="调查结果："  prop="inquire_result">
                {{dialogForm1010.inquire_result}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="备注："  prop="remarks">
                {{dialogForm1010.remarks}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="reason" v-if="parseInt(infoStatus) !== 1">
            <el-col :offset="1" :span="22">
              <el-form-item label="驳回原因："  prop="reason">
                <el-input type="textarea" :rows="3"  v-model="dialogForm1010.reason" placeholder="驳回请输入驳回理由" v-if="parseInt(infoStatus) === 0"></el-input>
                <span v-else style="color:red;">
                   {{dialogForm1010.reason}}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row class="info">
            <el-col :offset="1" :span="7">
              <el-form-item label="提交时间：" prop="insTime">
                {{dialogForm1010.insTime}}
              </el-form-item>
            </el-col>
            <el-col :offset="1" :span="7">
              <el-form-item label="提交人：" prop="userId">
                {{dialogForm1010.userId}}
              </el-form-item>
            </el-col>
            <el-col  :offset="1" :span="7">
              <el-form-item label="审核人：" prop="leadId">
                {{dialogForm1010.leadId}}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <!-- 走访群众登记表 -->
      <template v-if="infoType == '1014'">
        <el-form :rules="TZformRule"  :model="dialogForm1014" ref="dialogForm1014">
          <el-row>
            <el-col :offset="1" :span="11">
              <el-form-item label="姓名："  prop="name">
                {{dialogForm1014.name}}
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="性别："  prop="sex">
                {{dialogForm1014.sex}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="11">
              <el-form-item label="联系方式："  prop="mobile">
                {{dialogForm1014.mobile}}
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="出生年月："  prop="birthDay">
                {{dialogForm1014.birthDay}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="地址："  prop="address">
                {{dialogForm1014.address}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="走访目的："  prop="visitAim">
                {{dialogForm1014.visitAim}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="走访情况："  prop="visitSituation">
                {{dialogForm1014.visitSituation}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="收集的意见和建议："  prop="visitIdea">
                {{dialogForm1014.visitIdea}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="备注："  prop="remark">
                {{dialogForm1014.remark}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
           <el-row class="reason" v-if="parseInt(infoStatus) !== 1">
            <el-col :offset="1" :span="22">
              <el-form-item label="驳回原因："  prop="reason">
                <el-input type="textarea" :rows="3"  v-model="dialogForm1014.reason" placeholder="驳回请输入驳回理由" v-if="parseInt(infoStatus) === 0"></el-input>
                <span v-else style="color:red;">
                   {{dialogForm1014.reason}}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row class="info">
             <el-col :offset="1" :span="7">
              <el-form-item label="提交时间：" prop="insTime">
                {{dialogForm1014.insTime}}
              </el-form-item>
            </el-col>
            <el-col :offset="1" :span="7">
              <el-form-item label="提交人：" prop="userId">
                {{dialogForm1014.userId}}
              </el-form-item>
            </el-col>
            <el-col :offset="1" :span="7">
              <el-form-item label="审核人：" prop="leadId">
                {{dialogForm1014.leadId}}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <!-- 交通安全协管登记表 -->
      <template v-if="infoType == '1015'">
        <el-form :rules="TZformRule"  :model="dialogForm1015" ref="dialogForm1015"> 
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="时间："  prop="time">
                {{dialogForm1015.time}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
            <el-col :offset="1" :span="22">
              <el-form-item label="地点："  prop="address">
                {{dialogForm1015.address}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="事由："  prop="cause">
                {{dialogForm1015.cause}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-form-item label="协管情况："  prop="situation">
                {{dialogForm1015.situation}}
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row class="reason" v-if="parseInt(infoStatus) !== 1">
            <el-col :offset="1" :span="22">
              <el-form-item label="驳回原因："  prop="reason">
                <el-input type="textarea" :rows="3"  v-model="dialogForm1015.reason" placeholder="驳回请输入驳回理由" v-if="parseInt(infoStatus) === 0"></el-input>
                <span v-else style="color:red;">
                   {{dialogForm1015.reason}}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
          </el-row>
          <el-row class="info">
            <el-col :span="7" :offset="1"  >
              <el-form-item label="提交时间：" prop="insTime">
                {{dialogForm1015.insTime}}
              </el-form-item>
            </el-col>
            <el-col :span="7" :offset="1"  >
              <el-form-item label="提交人：" prop="userId">
                {{dialogForm1015.userId}}
              </el-form-item>
            </el-col>
            <el-col :span="7" :offset="1"  >
              <el-form-item label="审核人：" prop="leadId">
                {{dialogForm1015.leadId}}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
        <div v-if="infoStatus == 0" slot="footer" class="dialog-footer">
            <el-button type="primary" @click="passTZinfo(1)">通 过</el-button>
            <el-button @click="rejectTZinfo">不通过</el-button>
        </div>
        </el-dialog>
      <!-- 工作日志弹出框 -->
    <el-dialog
      :visible.sync="WLdialogVisible"
      :modal-append-to-body= "WLdialogVisibleModal"
      :close-on-click-modal="WLdialogVisibleModal"
      width="883px"
      @close="closeWLDialog"
    >
       <el-row slot="title" class="dialog-title">
        <el-col :offset="1" :span="23">
            <span >{{WLdialogTitle}}</span>
            <div
              class="title-status"
              :class="setWLTitleState"
              v-text="setWLTitlesText"
              ></div>
        </el-col>
      </el-row>
      <el-form
        :model="WLdialogForm"
          ref="WLdialogForm"
          :rules="WLformRule">
        <el-row>
          <el-col :offset="1" :span="22" >
            <el-form-item class="txt" label="工作日期："  prop="work_date">
             {{WLdialogForm.work_date}}
            </el-form-item>
          </el-col>
          <el-col :span="1"></el-col>
        </el-row>
        <!-- <el-row>
          <el-col :offset="1" :span="22" >
            <el-form-item class="txt" label="天气："  prop="weather">
             {{WLdialogForm.weather}}
            </el-form-item>
          </el-col>
          <el-col :span="1"></el-col>
        </el-row> -->
        <el-row>
          <el-col :offset="1" :span="22" >
            <el-form-item class="txt" label="工作内容："  prop="content">
             {{WLdialogForm.content}}
            </el-form-item>
          </el-col>
          <el-col :span="1"></el-col>
        </el-row>
        <el-row>
          <el-col :offset="1" :span="22" >
            <el-form-item label="图片："  prop="files">
            <div class="img-box" id="WLPopImgs"  @click="addWLPopViewer">
                 <div class="imgWrap" v-for="(item1, index) in WLdialogForm.files" :key="index">
                    <img 
                    alt="图片"
                    v-if="item1.fileType == 1"
                    :key="index"
                    :data-original="ajaxUrlDNN+'/appgetmedia?fn=' + item1.fileName"
                    :src="ajaxUrlDNN+'/appgetmedia?fn=' + item1.fileName"
                  >
                </div>
            </div>
            </el-form-item>
          </el-col>
          <el-col :span="1"></el-col>
        </el-row>
        <el-row>
          <el-col :offset="1" :span="22" >
            <el-form-item label="视频："  prop="files" class="hasVideo">
              <div class="video-box">
                <template v-for="(item2, index) in WLdialogForm.files">
                  <video v-if="item2.fileType == 2" :src="ajaxUrlDNN+'/appgetmedia?fn=' + item2.fileName" :key="index" controls/>
                </template>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="1"></el-col>
        </el-row>
        <el-row class="reason" v-if="parseInt(WLdialogForm.status) !== 1">
          <el-col :offset="1" :span="22">
            <el-form-item label="驳回原因：" prop="reason">
              <el-input type="textarea" v-model="WLdialogForm.reason" placeholder="驳回请输入驳回理由" v-if="parseInt(WLdialogForm.status) === 0"></el-input>
              <span v-else-if="parseInt(WLdialogForm.status) === 2" style="color:red;">
                  {{WLdialogForm.reason}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="1"></el-col>
        </el-row>
        <el-row class="info">
          <el-col :span="7" :offset="1" >
            <el-form-item label="提交时间：" prop="insTime">
              {{WLdialogForm.insTime}}
            </el-form-item>
          </el-col>
            
          <el-col :span="7" :offset="1" >
            <el-form-item label="提交人：" prop="userId">
              {{WLdialogForm.userId}}
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1" >
            <el-form-item label="审核人：" prop="leadId">
              {{WLdialogForm.leadId}}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div v-if="WLdialogForm.status == 0" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateWorkLogStatus(1)">通 过</el-button>
        <el-button  @click="rejectWorkLog">驳 回</el-button>
      </div>
    </el-dialog> 
    </div>
</template>
<script>
import fjBreadNav from '@/components/fjBreadNav'; 
export default {
    name:'fjZzjgPinfo',
    data:function(){
        const reasonValidate = (rule, value, callback) => {
        if (value === '') {
                callback(new Error('如需驳回，驳回理由必填'))
            } else {
                callback()
            }
        }
        return {
            breadData:{
                'fromIndexMap':[  //从首页跳转来
                  {name:'当前位置:',path:''},
                  {name:'首页',path:'/index'},
                  {name:'工作信息',path:''}
                ],
                'fromOS':[ //从组织架构跳转来
                  {name:'当前位置:',path:''},
                  {name:'系统配置:',path:''},
                  {name:'组织架构',path:'/organizational-structure'},
                  {name:'工作信息',path:''}
                ],
            },
            userId:'',
            breadFrom:'fromOS',
            basicInfo:{
                userAccount:'', //警号
                userName:'',  //姓名
                userRole:'',  //角色
                idcard:'',   //身份证号
                birth:'',   //出生日期
                political:'', //政治面貌
                sex:'', //性别
                deptname:'', //工作单位
                marriage:'', //婚姻状况
                mobile:'',  //电话号码
                contactName:'', //紧急联系人
                contactTele:'', //紧急联系号码
                address:''   //住址
            },
            rolesData:null, //角色
            WHCDData:null, //学历数据
            XBData:null,  //性别数据
            MZData:null,  //民族数据
            HYZKData:null, //婚姻状况数据
            ZZMMData:null, //政治面貌数据
            headImgUrl:fjPublic.ajaxUrlDNN+'/getAvatarByUserId?userid=',
            UserViewer:null, //头像大图查看
            workLogData:[], //工作日志
            TZData:[],  //台账
            /* 0（待批），1（通过），2（不通过） */
            TZStates:[
                {name:'待批',state:0},
                {name:'通过',state:1},
                {name:'不通过',state:2}
            ],
            dialogTitle:'',
            dialogVisible:false,
            dialogVisibleModal:false,
            // 弹窗数据
      dialogMap: {
        // top单位vh width单位px
        1002: {
          top: 10,
          width: 883,
          name: 'dialogForm1'
        },
        1005: {
          top: 10,
          width: 883,
          name: 'dialogForm1005'
        },
        1007: {
          top: 10,
          width: 883,
          name: 'dialogForm1007'
        },
        1008: {
          top: 10,
          width: 883,
          name: 'dialogForm1008'
        },
        1010: {
          top: 2,
          width: 883,
          name: 'dialogForm1010'
        },
        1011: {
          top: 3,
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
          top: 10,
          width: 883,
          name: 'dialogForm1014'
        },
        1015: {
          top: 10,
          width: 883,
          name: 'dialogForm10'
        },
      },
      // 巡逻情况登记表表单，1002
      dialogForm1002: {
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
      dialogForm1005: {
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
      dialogForm1007: {
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
      dialogForm1008: {
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
      dialogForm1010: {
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
      // 走访群众登记表，1014
      dialogForm1014: {
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
      dialogForm1015: {
        userId: "",
        insTime: "",
        leadId: "",
        time: "",
        address: "",
        cause: "",
        situation: "",
        reason: ''
      },
            TZformRule: {
              // 驳回理由
              reason: [{
                trigger: 'blur',
                validator: reasonValidate
              }]
            },
            infoId:'',     //台账id
            infoStatus:'', //台账审核状态
            infoType:'',   //台账类型
            //
      //工作日志弹出层
      WLdialogVisible: false,
      WLdialogVisibleModal: false,
      WLdialogTitle: "日志详情",
      // 工作日志表单
      WLdialogForm: {
        keyNo: "",
        content: "",
        insTime: "",
        leadId: "",
        userId: "",
        weather: "",
        work_date: "",
        files: null,
        status: 0,
        reason: '',
        currentRow: {}
      },
            WLformRule: {
              // 驳回理由
              reason: [{
                trigger: 'blur',
                validator: reasonValidate
              }]
            },
            tmpWLinfo:null,
            WLviewer:null,
            ajaxUrlDNN:fjPublic.ajaxUrlDNN,
            cstVal:0, //内容区滚动距离
      };
    },
    computed:{
      setWLTitlesText:function(){ //设置工作日志弹窗标题状态
        return parseInt(this.WLdialogForm.status) === 2?'被驳回':parseInt(this.WLdialogForm.status) === 1?'已通过':'待批';
      },
      setWLTitleState:function(){ //设置工作日志弹窗标题状态文字
        return parseInt(this.WLdialogForm.status) === 2?'reject':parseInt(this.WLdialogForm.status) === 1?'resolve':'';
      },
      setTZTitleState:function(){ //设置台账弹窗标题状态
        return parseInt(this.infoStatus) === 2?'reject':parseInt(this.infoStatus) === 1?'resolve':'';
      },
      setTZTitlesText:function(){ //设置台账弹窗标题状态文字
        return parseInt(this.infoStatus) === 2?'被驳回':parseInt(this.infoStatus) === 1?'已通过':'待批';
      }
    },
    beforeRouteEnter:function(to,from,next){
        next(function(vm){
            vm.rolesData = $.parseJSON(fjPublic.getLocalData('rolesData'))||[]; //角色数据
            vm.WHCDData = $.parseJSON(fjPublic.getLocalData('WHCDData'))||[]; //学历数据
            vm.XBData = $.parseJSON(fjPublic.getLocalData('XBData'))||[];  //性别数据
            vm.MZData = $.parseJSON(fjPublic.getLocalData('MZData'))||[];  //民族数据
            vm.HYZKData = $.parseJSON(fjPublic.getLocalData('HYZKData'))||[]; //婚姻状况数据
            vm.ZZMMData = $.parseJSON(fjPublic.getLocalData('ZZMMData'))||[]; //政治面貌数据
            vm.breadFrom = vm.$route.query.isFrom||fjPublic.getLocalData('pInfo-isFrom');
            vm.userId = vm.$route.query.userId||fjPublic.getLocalData('pInfo-userId');
            fjPublic.setLocalData('pInfo-userId',vm.userId);
            fjPublic.setLocalData('pInfo-isFrom',vm.breadFrom);
            $.when(vm.requestDatas()).then(function(){},function(){});
        });
    },
    beforeRouteLeave:function(to,from,next){
        fjPublic.wrapperRemoveScroll();
        if(this.UserViewer){
            this.UserViewer.destroy();
            this.UserViewer = null;
        }
        if(this.WLviewer){
          this.WLviewer.destroy();
          this.WLviewer = null;
        }
        //内容区滚动条回到跳转之前的位置
        fjPublic.setContentScrollTop();
        next();
    },
    methods:{
        getCstVal:function(){ //获取滚动距离
          return $('.fj-content').scrollTop();
        },
        setCstScroll:function(){ //移动滚动条
          $('.fj-content').animate({'scrollTop':this.cstVal});
        },
        openPersonelLocus:function(){ //打开个人轨迹
            fjPublic.setLocalData('PL-userId',this.userId);
            fjPublic.setLocalData('PL-isFrom','fromOS');
            this.$router.push({path:'/personnel-locus',query:{userId:this.userId,userName:this.basicInfo.userName,isFrom:'fromOS'}});
        },
        showInfoType:function(info){ //显示台账详情
            //console.log(info);
            $.when(this.showInfoDetailDialog(info.keyno,info.infotype,info.leadresult)).then(_.bind(function(){
                //获取内容区滚动条的滚动距离
                this.cstVal = this.getCstVal();
                fjPublic.contentScrollTop();
                // 显示弹出框
                this.dialogVisible = true;
            },this),_.bind(function(){

            },this));
        },
        showInfoDetailDialog: function(keyno,infoType,leadresult) { //台账
            this.infoId = keyno;
            this.infoStatus = leadresult;
            // 采集类型
            this.infoType = infoType;
            // 详情
            var defer = $.Deferred();
            var vm = this;
            fjPublic.openLoad('获取台账信息...');
            $.ajax({
                url: fjPublic.ajaxUrlDNN + "/infoDetail",
                type: "POST",
                data: {
                    keyno: keyno,
                    type: vm.infoType
                },
                dataType: "json",
                success: function(data) {
                    //console.log(data);
                    fjPublic.closeLoad();
                    if (data.info.errorCode) {
                        vm.$message({
                            type: "error",
                            message: data.info.errorMsg
                        });
                    } else {
                        // 巡逻情况登记表
                        if (vm.infoType == "1002") {
                            vm.dialogForm1002["userId"] = data.info.userId;
                            vm.dialogForm1002["insTime"] = data.info.insTime;
                            vm.dialogForm1002["leadId"] = data.info.leadName;
                            vm.dialogForm1002["patrol_time"] = data.info.patrol_time;
                            vm.dialogForm1002["lead_person"] = data.info.lead_person;
                            vm.dialogForm1002["patrol_person"] = data.info.patrol_person;
                            vm.dialogForm1002["other"] = data.info.other;
                            vm.dialogForm1002["patrol_area"] = data.info.patrol_area;
                            vm.dialogForm1002["work_content"] = data.info.work_content;
                            vm.dialogForm1002["work_log"] = data.info.work_log;
                            vm.dialogForm1002["reason"] = data.info.leadContent;
                            vm.dialogTitle = "巡逻情况登记表";
                        // 安全检查情况登记表
                        } else if (vm.infoType == "1005") {
                            vm.dialogForm1005["userId"] = data.info.userId;
                            vm.dialogForm1005["insTime"] = data.info.insTime;
                            vm.dialogForm1005["leadId"] = data.info.leadName;
                            vm.dialogForm1005["check_date"] = data.info.check_date;
                            vm.dialogForm1005["check_department"] = data.info.check_department;
                            vm.dialogForm1005["find_problem"] = data.info.find_problem;
                            vm.dialogForm1005["change_require"] = data.info.change_require;
                            vm.dialogForm1005["department_opinion"] =
                                data.info.department_opinion;
                            vm.dialogForm1005["leader_name"] = data.info.leader_name;
                            vm.dialogForm1005["leader_phone"] = data.info.leader_phone;
                            vm.dialogForm1005["attend_policeman"] = data.info.attend_policeman;
                            vm.dialogForm1005["deptId"] = data.info.deptId;
                            vm.dialogForm1005["reason"] = data.info.leadContent;
                            vm.dialogTitle = "安全检查情况登记表";
                        // 服务群众登记表
                        } else if (vm.infoType == "1007") {
                            vm.dialogForm1007["userId"] = data.info.userId;
                            vm.dialogForm1007["insTime"] = data.info.insTime;
                            vm.dialogForm1007["leadId"] = data.info.leadName;
                            vm.dialogForm1007["name"] = data.info.name;
                            vm.dialogForm1007["sex"] = data.info.sex;
                            vm.dialogForm1007["nation"] = data.info.nation;
                            vm.dialogForm1007["birth"] = data.info.birth;
                            vm.dialogForm1007["phone"] = data.info.phone;
                            vm.dialogForm1007["idcard"] = data.info.idcard;
                            vm.dialogForm1007["domicile"] = data.info.domicile;
                            vm.dialogForm1007["address"] = data.info.address;
                            vm.dialogForm1007["break_law"] = data.info.break_law;
                            vm.dialogForm1007["help_content"] = data.info.help_content;
                            vm.dialogForm1007["remarks"] = data.info.remarks;
                            vm.dialogForm1007["reason"] = data.info.leadContent;
                            vm.dialogTitle = "服务群众登记表";
                        // 治安秩序维护登记表
                        } else if (vm.infoType == "1008") {
                            vm.dialogForm1008["userId"] = data.info.userId;
                            vm.dialogForm1008["insTime"] = data.info.insTime;
                            vm.dialogForm1008["leadId"] = data.info.leadName;
                            vm.dialogForm1008["collect_date"] = data.info.collect_date;
                            vm.dialogForm1008["collect_address"] = data.info.collect_address;
                            vm.dialogForm1008["collect_cause"] = data.info.collect_cause;
                            vm.dialogForm1008["collect_leader"] = data.info.collect_leader;
                            vm.dialogForm1008["reason"] = data.info.leadContent;
                            vm.dialogTitle = "治安秩序维护登记表";
                        // 治安纠纷调解登记表
                        } else if (vm.infoType == "1010") {
                            vm.dialogForm1010["userId"] = data.info.userId;
                            vm.dialogForm1010["insTime"] = data.info.insTime;
                            vm.dialogForm1010["leadId"] = data.info.leadName;
                            vm.dialogForm1010["case_name"] = data.info.case_name;
                            vm.dialogForm1010["case_date"] = data.info.case_date;
                            vm.dialogForm1010["case_mediator"] = data.info.case_mediator;
                            vm.dialogForm1010["client1_name"] = data.info.client1_name;
                            vm.dialogForm1010["client1_sex"] = data.info.client1_sex;
                            vm.dialogForm1010["client1_address"] = data.info.client1_address;
                            vm.dialogForm1010["client2_name"] = data.info.client2_name;
                            vm.dialogForm1010["client2_sex"] = data.info.client2_sex;
                            vm.dialogForm1010["client2_address"] = data.info.client2_address;
                            vm.dialogForm1010["case_content"] = data.info.case_content;
                            vm.dialogForm1010["inquire_result"] = data.info.inquire_result;
                            vm.dialogForm1010["remarks"] = data.info.remarks;
                            vm.dialogForm1010["reason"] = data.info.leadContent;
                            vm.dialogTitle = "治安纠纷调解登记表";
                        //走访群众登记表
                        }else if (vm.infoType == "1014") {
                            vm.dialogForm1014["userId"] = data.info.userId;
                            vm.dialogForm1014["insTime"] = data.info.insTime;
                            vm.dialogForm1014["leadId"] = data.info.leadName;
                            vm.dialogForm1014["name"] = data.info.name;
                            vm.dialogForm1014["sex"] = data.info.sex;
                            vm.dialogForm1014["birthDay"] = data.info.birthDay;
                            vm.dialogForm1014["mobile"] = data.info.mobile;
                            vm.dialogForm1014["address"] = data.info.address;
                            vm.dialogForm1014["visitAim"] = data.info.visitAim;
                            vm.dialogForm1014["visitSituation"] = data.info.visitSituation;
                            vm.dialogForm1014["visitIdea"] = data.info.visitIdea;
                            vm.dialogForm1014["remark"] = data.info.remark;
                            vm.dialogForm1014["reason"] = data.info.leadContent;
                            vm.dialogTitle = "走访群众登记表";
                        // 交通安全协管登记表
                        } else if (vm.infoType == "1015") {
                            vm.dialogForm1015["userId"] = data.info.userId;
                            vm.dialogForm1015["insTime"] = data.info.insTime;
                            vm.dialogForm1015["leadId"] = data.info.leadName;
                            vm.dialogForm1015["time"] = data.info.time;
                            vm.dialogForm1015["address"] = data.info.address;
                            vm.dialogForm1015["cause"] = data.info.cause;
                            vm.dialogForm1015["situation"] = data.info.situation;
                            vm.dialogForm1015["reason"] = data.info.leadContent;
                            vm.dialogTitle = "交通安全协管登记表";
                        }
                        fjPublic.wrapperAddScroll();
                        defer.resolve();
                    }    
                },
                error: function(err) {
                    fjPublic.closeLoad();
                    defer.reject();
                }
            });
            return defer;
        },
        updateInfoStatus:function(status,reason){ //更新台账审核状态
          if(!status){
            this.$message({type:'warning',message:'缺少提交审核所需的参数！'});
            return;
          }
          var defer = $.Deferred();
          var vm = this;
          var infoData = {
            nowUser: $.cookie(fjPublic.loginCookieKey),
            id: this.infoId,
            reason: reason,
            status: status
          }
          fjPublic.openLoad('正在提交...');
          $.ajax({
            url: fjPublic.ajaxUrlDNN + "/updateInfoStatus",
            type: "POST",
            data: infoData,
            dataType: "json",
            success: function(data) {
              fjPublic.closeLoad();
              fjPublic.wrapperRemoveScroll();
              if (data.errorCode == 0) {
                vm.dialogVisible = false;
                vm.getInfoOrderByUserId();
                vm.$message({
                  type: "success",
                  message: data.errorMsg
                });
              }else{
                vm.$message({
                  type: "warning",
                  message: data.errorMsg
                });
              }
              defer.resolve();
            },
            error: function(err) {
              fjPublic.closeLoad();
              fjPublic.wrapperRemoveScroll();
              vm.$message({
                type: "warning",
                message: '审核提交失败！'
              });
              defer.reject();
            }
          });
          return defer;
        },
        passTZinfo:function(){ //通过台账信息
          this.updateInfoStatus(1);
        },
        rejectTZinfo:function(){ //不通过台账信息
          this.$refs['dialogForm'+this.infoType].validate((value)=>{
            if(value){
              this.updateInfoStatus(2,this['dialogForm'+this.infoType].reason);
            }
          });
        },
        closeTZDialog:function(){ //关闭台账弹层
          if(this.$refs['dialogForm'+this.infoType]){
            this.$refs['dialogForm'+this.infoType].resetFields();
          }
          fjPublic.wrapperRemoveScroll();
          this.setCstScroll();
          this.removeVmodal();
        },
        // 打开工作日志弹出框
        openWLDialog: function(workLog) {
          //console.log(workLog);
          // 详情
          var defer = $.Deferred();
          var vm = this;
          vm.WLdialogForm.keyNo = workLog.keyNo;
          vm.WLdialogForm.userId = workLog.userId;
          vm.WLdialogForm.insTime = fjPublic.dateStrFormat(workLog.insTime);
          vm.WLdialogForm.content = workLog.content;
          vm.WLdialogForm.leadId = workLog.leadId;
          vm.WLdialogForm.weather = workLog.weather;
          vm.WLdialogForm.work_date = workLog.work_date;
          vm.WLdialogForm.status = workLog.leadResult;
          vm.WLdialogForm.reason = workLog.leadContent;
          // 储存当前行数据
          vm.WLdialogForm.currentRow = workLog;
          fjPublic.openLoad('获取日志信息...');
          $.ajax({
            url: fjPublic.ajaxUrlDNN + "/getWorkLogFiles",
            type: "POST",
            data: {
              id: workLog.keyNo
            },
            dataType: "json",
            success: function(data) {
              fjPublic.closeLoad();
              vm.WLdialogForm.files = data;
              fjPublic.wrapperAddScroll();
              // 显示弹出框
              vm.WLdialogVisible = true;
              defer.resolve();
            },
            error: function(err) {
              fjPublic.closeLoad();
              defer.reject();
            }
          });
          return defer;
        },
        // 驳回工作日志
        rejectWorkLog:function(){
          this.$refs.WLdialogForm.validate((validate) => {
            if (validate) {
              this.updateWorkLogStatus(2);
            }
          });
        },
        // 保存日志内容
        updateWorkLogStatus: function(status) {
          var defer = $.Deferred();
          var vm = this;
          // 传入当前用户信息
          if (status) {
            this.WLdialogForm.status = status
          }
          var infoData = {
            nowUser: $.cookie(fjPublic.loginCookieKey),
            id: this.WLdialogForm.keyNo,
            reason: this.WLdialogForm.reason,
            status: this.WLdialogForm.status
          }
          fjPublic.openLoad('正在提交...');
          $.ajax({
            url: fjPublic.ajaxUrlDNN + "/updateWorkLogStatus",
            type: "POST",
            data: infoData,
            dataType: "json",
            success: function(data) {
              fjPublic.closeLoad();
              fjPublic.wrapperRemoveScroll();
              if (data.errorCode == 0) {
                vm.WLdialogVisible = false;
                vm.getWorkLogByUserId();
                vm.$message({
                  type: "success",
                  message: data.errorMsg
                });
              }else{
                vm.$message({
                  type: "warning",
                  message: data.errorMsg
                });
              }
              defer.resolve();
            },
            error: function(err) {
              fjPublic.closeLoad();
              fjPublic.wrapperRemoveScroll();
              vm.$message({
                type: "warning",
                message: '审核提交失败！'
              });
              defer.reject();
            }
          });
          return defer;
        },
        // 工作日志弹窗关闭
        closeWLDialog:function(){
          this.$refs.WLdialogForm.resetFields();
          fjPublic.wrapperRemoveScroll();
          this.removeVmodal();
        },
        removeVmodal:function(){ //删除遮罩层
          $('.v-modal','body').remove();
        },
        // 工作日志弹窗查看图片
        addWLPopViewer() {
          if (this.WLviewer) return;
          this.WLviewer = new viewer(document.getElementById('WLPopImgs'),{
              url:'data-original',navbar:false,title:''
          });
        },
        //
        UserInfoAddViewer:function(){ //人员信息头像大图查看
            if(this.UserViewer)return;
            this.UserViewer = new viewer(document.getElementById('userImg'),{
                url:'data-original',title:''
            });
        },
        searchUserByUserId:function(){ //获取用户信息
            var defer = $.Deferred();
          var vm = this;
          $.ajax({  
            url:fjPublic.ajaxUrlDNN + '/searchUserByUserId',
            type:'POST',
            data:{
                        userId:this.userId
                    },
            dataType:'json',
            success:function(data){
                        //console.log(data);
                        _.each(data,function(v,k){
                            vm.$set(vm.basicInfo,k,v);
                        });
                        var tmpRole = _.find(vm.rolesData,function(item){
                            return item.id == vm.basicInfo.userRole;
                        });
                        if(tmpRole){
                            vm.$set(vm.basicInfo,'userRole',tmpRole.value);
                        }
                        var tmpZZMM = _.find(vm.ZZMMData,function(item){
                            return item.id == vm.basicInfo.political;
                        });
                        if(tmpZZMM){
                            vm.$set(vm.basicInfo,'political',tmpZZMM.value);
                        }
                        var tmpSex = _.find(vm.XBData,function(item){
                            return item.id == vm.basicInfo.sex;
                        });
                        if(tmpSex){
                            vm.$set(vm.basicInfo,'sex',tmpSex.value);
                        }
                        var tmpHYZK = _.find(vm.HYZKData,function(item){
                            return item.id == vm.basicInfo.marriage;
                        });
                        if(tmpHYZK){
                            vm.$set(vm.basicInfo,'marriage',tmpHYZK.value);
                        }
              defer.resolve();
            },
            error:function(err){
              defer.reject();
            }
          });
			    return defer;
        },
        getWorkLogByUserId:function(){ //获取人员工作日志
            var defer = $.Deferred();
			    var vm = this;
          $.ajax({  
            url:fjPublic.ajaxUrlDNN + '/getWorkLogByUserId',
            type:'POST',
            data:{
              userId:this.userId
            },
            dataType:'json',
            success:function(data){
              //console.log(data);
            _.each(data,function(item){
                var tmpObj = _.find(vm.TZStates,function(item2){
                    return item.leadResult == item2.state;
                });
                if(tmpObj){
                    vm.$set(item,'leadResult1',tmpObj.name);
                }
            });
            vm.workLogData = null;
            vm.workLogData = data;
              defer.resolve();
            },
            error:function(err){
              defer.reject();
            }
          });
			    return defer;
        },
        getInfoOrderByUserId:function(){  //获取人员台账
            var defer = $.Deferred();
            var vm = this;
            $.ajax({  
              url:fjPublic.ajaxUrlDNN + '/getInfoOrderByUserId',
              type:'POST',
              data:{
                  userId:this.userId
              },
              dataType:'json',
              success:function(data){
                //console.log(data);
                _.each(data,function(item){
                    var tmpObj = _.find(vm.TZStates,function(item2){
                        return item.leadresult == item2.state;
                    });
                    if(tmpObj){
                        vm.$set(item,'leadresult1',tmpObj.name);
                    }
                });
                vm.TZData = null;
                vm.TZData = data;
                defer.resolve();
              },
              error:function(err){
                defer.reject();
              }
            });
            return defer;
        },
        requestDatas:function(){ //向后台请求数据
            var tmpReqFns = [this.searchUserByUserId,this.getWorkLogByUserId,this.getInfoOrderByUserId];
            var vm = this,count = 0,defer = $.Deferred();
            fjPublic.openLoad('数据加载中...');
            function sendRequestFn(){
              $.when(tmpReqFns[count]()).then(function(){
                count++;
                if(count>=tmpReqFns.length){
                  fjPublic.closeLoad();
                  defer.resolve();
                  return;
                }
                sendRequestFn();
              },function(){
                          fjPublic.closeLoad();
                vm.$message({
                  type:'warning',
                  message:'请求数据失败！！！'
                });
              });
            }
            sendRequestFn();  //请求数据
            return defer;
        }
    },
    filters:{
      WLdate:function(value){ //工作日志-时间转换
          return value?fjPublic.dateStrFormat(value):'';
      },
      tzDate:function(value){ //台账-时间转换
          return value?fjPublic.dateStrFormat(value):'';
      },
      //巡逻情况登记表
      XLQKdate:function(value){
        if(value&&value.indexOf(',')!=-1){
          var tmpArr = value.split(',');
          return tmpArr[0]+'\t~\t'+tmpArr[1];
        }else{
          return value;
        }
      }
    },
    components:{
        fjBreadNav
    }
}
</script>
<style lang="less">
.fj-content_view.pInfo {
    .fj-block-body.basicInfo {
        position:relative;padding:20px 20px 10px 160px;
        .userPopHeadImg {
            position:absolute;top:0;left:0;width:160px;height:220px;
            &:after {
                content:'';display:inline-block;width:0;height:100%;vertical-align:middle;
            }
            & > img {max-height:100%;max-width:100%;vertical-align:middle;}
        }
        .el-form-item {margin-bottom:10px;}
        .el-form-item__label {width:120px;color:rgba(0,0,0,.85);}
    }
    .fj-block-body.work-log,
    .fj-block-body.info-type {height:594px;max-height:594px;overflow-y:scroll;}
}
/* 0130 */
.fj-content_view.pInfo {
    .el-dialog {
      border-radius: 12px;
      .el-dialog__body {padding-bottom: 25px;}
      .dialog-title {
        font-size: 20px;
        font-weight: 550;
        line-height: 28px;
        color: rgba(0, 0, 0, 0.85);
        & > .el-col {
          display:flex;align-items:center;
        }
        .title-status {
          width: 86px;
          height: 28px;
          background: #ffffff;
          border: 1px solid rgba(0,0,0,.85);
          opacity: 1;
          border-radius: 3px;
          margin-left: 15px;
          font-size: 16px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: 500;
          &.reject {
            color: #f5222d;border-color:#f5222d;
          }
          &.resolve {
            color: #52C41A;border-color: #52C41A;
          }
        }
      }
      .dialog-footer {
        text-align: center;
      }
      .el-form-item {
        margin-bottom: 16px;
        display:flex;flex-flow:row nowrap;
        & > .el-form-item__label {
          float:none;flex:0 0 auto;min-width:82px;text-align:right;
          color: rgba(0, 0, 0, 0.65);
        }
        & > .el-form-item__content {
          flex:1 0 auto;max-width:690px;
          color: rgba(0, 0, 0, 0.85);
        }
        .img-box {
          display:inline-flex;flex-flow:row wrap;
          & > .imgWrap {
            width: 160px;margin:0px 10px 10px 0px;
            height: 220px;font-size:0px;text-align:center;
            &:after {content:'';display:inline-block;width:0;height:100%;vertical-align:middle;}
            & > img {max-width:100%;max-height:100%;vertical-align:middle;}
          }
        }
      }
      .el-form-item.txt {
        & > .el-form-item__content {
          text-align:justify;
        }
      }
      .el-form-item.hasVideo {
        .el-form-item__content {
          line-height:normal;
        }
        .video-box {
          font-size:0px;
          & > video {
            width:300px;height:200px;
            border:1px solid #000;margin:0px 10px 10px 0px;
          }
        }
      }
      .el-form-item.singleLine {

      }
      .el-form-item.multipleLine {

      }
    }

}
</style>


