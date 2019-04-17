<template>
  <div class="fj-content_view YBSS">
    <div class="fj-content_view_mask">
      <div class="fj-block title">
        <fj-breadNav :bread-data="breadData"></fj-breadNav>
      </div>
      <div class="fj-block content">
        <div class="fj-block-head kaohe">
          <p class="title fj-fl">{{breadData[3].name}}</p>
        </div>
        <div class="fj-block-body">
          <!-- 筛选区域 -->
          <ul class="filterOpe-area">
            <li class="area-line fj-clear">
              <div class="item fj-fl">
                <span class="fj-fl title">抽查日期：</span>
                <el-date-picker
                  :disabled="userInfo.state == 1"
                  v-model="ruleForm.randomTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  :placeholder="userInfo.state == 1?'':'请选择'"
                ></el-date-picker>
              </div>
              <div class="item fj-fl">
                <span class="fj-fl title">抽查地点：</span>
                <el-cascader
                  :disabled="userInfo.state == 1"
                  :placeholder="userInfo.state == 1?'':'请选择'"
                  :options="randomCityList"
                  :props="optionProps"
                  v-model="randomplace"
                  :show-all-levels="false"
                  @change="handleChange"
                ></el-cascader>
              </div>
            </li>
          </ul>
          <!-- 表单输入区域 -->
          <div class="YBSS-form-area">
            <!-- 实有房屋信息采集表 -->
            <div v-if="userInfo.index==0">
              <el-form :model="ruleForm" ref="ruleForm" :rules="rules">
                <el-row>
                  <el-col :span="12">
                    <el-form-item prop="city" label="市、县/区">
                      <el-select
                        @change="changeCity"
                        v-model="ruleForm.city"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请选择（必选）'"
                      >
                        <el-option
                          v-for="item in cityPlace"
                          :key="item.id"
                          :label="item.label"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" prop="street" label="街道/乡镇">
                      <el-select
                        @change="changeStreet"
                        v-model="ruleForm.street"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请选择（必选）'"
                      >
                        <el-option
                          v-for="item in streetPlace"
                          :key="item.id"
                          :label="item.label"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item prop="plots" label="社区/村">
                      <el-select
                        @change="changePlots"
                        v-model="ruleForm.plots"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请选择（必选）'"
                      >
                        <el-option
                          v-for="item in plotsPlace"
                          :key="item.id"
                          :label="item.label"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" prop="road" label="街路巷">
                      <el-input
                        v-model="ruleForm.road"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入街路巷（必填）'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item prop="houseNumber" label="门牌号">
                      <el-input
                        v-model="ruleForm.houseNumber"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入门牌号（必填）'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" prop="community" label="小区（组）">
                      <el-input
                        v-model="ruleForm.community"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入小区/组（必填）'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item class="noBR" prop="address" label="楼栋详址">
                      <el-input
                        v-model="ruleForm.address"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入楼栋详址（必填）'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item prop="entityName" label="实体名称">
                      <el-input
                        v-model="ruleForm.entityName"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入实体名称（必填）'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" label="产权类型">
                      <el-select
                        :disabled="userInfo.state == 1"
                        v-model="ruleForm.type"
                        :placeholder="userInfo.state == 1?'':'请选择'"
                      >
                        <el-option></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="房主姓名">
                      <el-input
                        v-model="ruleForm.houseName"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入房主姓名'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" label="产权单位、法人姓名">
                      <el-input
                        v-model="ruleForm.legalName"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入产权单位、法人姓名'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="证件号码">
                      <el-input
                        v-model="ruleForm.idCard"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入证件号码'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" label="联系电话">
                      <el-input
                        v-model="ruleForm.phone"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入联系电话'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="是否出租房屋">
                      <el-select
                        :disabled="userInfo.state == 1"
                        v-model="ruleForm.rent"
                        :placeholder="userInfo.state == 1?'':'请选择'"
                      >
                        <el-option
                          v-for="item in rentWhether"
                          :key="item.value"
                          :label="item.lable"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" label="房屋建成时间/出租时间">
                      <el-date-picker
                        :disabled="userInfo.state == 1"
                        v-model="ruleForm.time"
                        type="date"
                        value-format="yyyy-MM-dd"
                        :placeholder="userInfo.state == 1?'':'请选择'"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="房屋所属分局">
                      <el-select
                        v-model="ruleForm.suboffice"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请选择房屋所属分局'"
                      >
                        <el-option
                          v-for="item in subofficeList"
                          :key="item.deptid"
                          :label="item.deptname"
                          :value="item.deptid"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" label="房屋所属派出所">
                      <el-select
                        v-model="ruleForm.police"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请选择房屋所属派出所'"
                      >
                        <el-option
                          v-for="item in policeList"
                          :key="item.deptId"
                          :label="item.deptName"
                          :value="item.deptId"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item class="noBR noBB" label="备注">
                      <el-input :disabled="userInfo.state == 1" v-model="ruleForm.remark"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <ul class="YBSS-notice-list">
                <li class="list-item-title">说明</li>
                <li class="list-item">1、采集居住人员信息时，先采集房屋信息，带*的为必填项；</li>
                <li class="list-item">2、为便于比对，表中“房主姓名与证件号码”应尽量采集；对于在一层有架空层（车库、储藏室）的，在备注中说明；</li>
                <li class="list-item">3、每个县（市、区）抽查点数量房屋不少于10户。</li>
              </ul>
            </div>
            <!-- 居住人员信息采集表 -->
            <div v-if="userInfo.index==1">
              <el-form :model="ruleForm" ref="ruleForm" :rules="rules">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="姓名">
                      <el-input
                        v-model="ruleForm.name"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入姓名'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" label="身份证号码">
                      <el-input
                        v-model="ruleForm.idCard"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入身份证号码'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="联系电话">
                      <el-input
                        v-model="ruleForm.phone"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入联系电话'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" label="实际居住/户籍标注">
                      <el-input
                        v-model="ruleForm.actualLive"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入实际居住/户籍标注'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="居住状态说明">
                      <el-input
                        v-model="ruleForm.liveState"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入居住状态说明'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" label="入住时间">
                      <el-date-picker
                        :disabled="userInfo.state == 1"
                        v-model="ruleForm.liveTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        :placeholder="userInfo.state == 1?'':'请选择入住时间'"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item class="noBB" label="电话备注">
                      <el-input
                        v-model="ruleForm.phoneRemark"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入电话备注'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR noBB" label="人员关系">
                      <el-input
                        v-model="ruleForm.peopleRelation"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入人员关系'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <ul class="YBSS-notice-list">
                <li class="list-item-title">说明</li>
                <li class="list-item">1、请严格按表中项目采集信息；</li>
                <li
                  class="list-item"
                >2、每个县（市、区）最少抽查10户实有房屋，采集居住人口30人的基本信息，其中城区（关）派出所最少6户18人，城郊结合部派出所最少4户12人；</li>
                <li
                  class="list-item"
                >3、入户抽查时所抽人员必须入住1个月以上，应采集该项户所有成员信息（包括户籍人口与实际居住的非户籍人口），并在“居住状态说明”栏目中注明该人应予以明确的居住状态，在“人员关系”栏目中注明本人、配偶、子女、其他等关系。</li>
              </ul>
            </div>
            <!-- 实有单位信息采集表 -->
            <div v-if="userInfo.index==2">
              <el-form :model="ruleForm" ref="ruleForm" :rules="rules">
                <el-row>
                  <el-col :span="12">
                    <el-form-item prop="city" label="市、县/区">
                      <el-select
                        @change="changeCity"
                        :disabled="userInfo.state == 1"
                        v-model="ruleForm.city"
                        :placeholder="userInfo.state == 1?'':'请选择（必选）'"
                      >
                        <el-option
                          v-for="item in cityPlace"
                          :key="item.id"
                          :label="item.label"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" prop="street" label="街道/乡镇">
                      <el-select
                        @change="changeStreet"
                        :disabled="userInfo.state == 1"
                        v-model="ruleForm.street"
                        :placeholder="userInfo.state == 1?'':'请选择（必选）'"
                      >
                        <el-option
                          v-for="item in streetPlace"
                          :key="item.id"
                          :label="item.label"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item prop="plots" label="社区/村">
                      <el-select
                        @change="changePlots"
                        :disabled="userInfo.state == 1"
                        v-model="ruleForm.plots"
                        :placeholder="userInfo.state == 1?'':'请选择（必选）'"
                      >
                        <el-option
                          v-for="item in plotsPlace"
                          :key="item.id"
                          :label="item.label"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" prop="road" label="街路巷">
                      <el-input
                        v-model="ruleForm.road"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入街路巷（必填）'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item prop="houseNumber" label="门牌号">
                      <el-input
                        v-model="ruleForm.houseNumber"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入门牌号（必填）'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" prop="community" label="小区（组）">
                      <el-input
                        v-model="ruleForm.community"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入小区/组（必填）'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item class="noBR" prop="address" label="楼栋详址">
                      <el-input
                        v-model="ruleForm.address"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入楼栋详址（必填）'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="单位类别">
                      <el-input
                        v-model="ruleForm.companyType"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入单位类别（必填）'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" prop="legalName" label="法人（负责人）姓名">
                      <el-input
                        v-model="ruleForm.legalName"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入法人/负责人姓名（必填）'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="单位电话">
                      <el-input
                        v-model="ruleForm.companyPhone"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入单位电话（必填）'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" prop="legalPhone" label="法人（负责人）联系电话">
                      <el-input
                        v-model="ruleForm.legalPhone"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入法人/负责人联系电话（必填）'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item prop="license" label="组织机构代码/营业执照号">
                      <el-input
                        v-model="ruleForm.license"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入组织机构代码/营业执照号（必填）'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" prop="legalIdCard" label="法人（负责人）证件号码">
                      <el-input
                        v-model="ruleForm.legalIdCard"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入法人/负责人证件号码（必填）'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item class="noBR" label="单位登记所属分局、派出所">
                      <el-select
                        :disabled="userInfo.state == 1"
                        v-model="ruleForm.police"
                        :placeholder="userInfo.state == 1?'':'请选择'"
                      >
                        <el-option
                          v-for="item in policeList"
                          :key="item.deptId"
                          :label="item.deptName"
                          :value="item.deptId"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item class="noBR noBB" label="备注">
                      <el-input :disabled="userInfo.state == 1" v-model="ruleForm.remark"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <ul class="YBSS-notice-list">
                <li class="list-item-title">说明</li>
                <li class="list-item">1、采集从业人员信息时，先采集从业单位信息，带*的为必填项；</li>
                <li
                  class="list-item"
                >2、每个县（市、区）最少抽查2个用人单位、抽查从业人员20人，从业人员信息包括实有房屋、实有单位和人口基本信息、从业信息，人口基本信息、从业信息重点评估姓名、身份证号；</li>
                <li class="list-item">3、进入用人单位抽查从业人员信息时，首先采集该单位基本信息，再采集该从业人员的姓名、身份证号等信息；</li>
                <li class="list-item">4、抽查地点以市州为单位统筹平衡到建筑工地、娱乐场所、酒店、商场、市场、临街门面、厂矿企业等。</li>
              </ul>
            </div>
            <!-- 从业人员信息采集表 -->
            <div v-if="userInfo.index==3">
              <el-form :model="ruleForm" ref="ruleForm" :rules="rules">
                <el-row>
                  <el-col :span="12">
                    <el-form-item prop="name" label="姓名">
                      <el-input
                        v-model="ruleForm.name"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入姓名（必填）'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" prop="idCard" label="身份证号码">
                      <el-input
                        v-model="ruleForm.idCard"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入身份证号码（必填）'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item prop="phone" label="联系电话">
                      <el-input
                        v-model="ruleForm.phone"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入联系电话（必填）'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" prop="jobTime" label="入职时间">
                      <el-date-picker
                        :disabled="userInfo.state == 1"
                        v-model="ruleForm.jobTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        :placeholder="userInfo.state == 1?'':'请选择入职时间（必填）'"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item prop="rpr" label="户籍地址">
                      <el-input
                        v-model="ruleForm.rpr"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入户籍地址（必填）'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" prop="presentAddress" label="现住地址">
                      <el-input
                        v-model="ruleForm.presentAddress"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入现住地址（必填）'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item class="noBR noBB" prop="jobAndLive" label="是否从业且居住">
                      <el-select
                        :disabled="userInfo.state == 1"
                        v-model="ruleForm.jobAndLive"
                        :placeholder="userInfo.state == 1?'':'请选择是否从业且居住（必填）'"
                      >
                        <el-option
                          v-for="item in whether"
                          :key="item.value"
                          :label="item.lable"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <ul class="YBSS-notice-list">
                <li class="list-item-title">说明</li>
                <li class="list-item">1、请严格按表中项目采集信息；</li>
                <li
                  class="list-item"
                >2、每个县（市、区）最少抽查10户实有房屋，采集居住人口30人的基本信息，其中城区（关）派出所最少6户18人，城郊结合部派出所最少4户12人；</li>
                <li
                  class="list-item"
                >3、入户抽查时所抽人员必须入住1个月以上，应采集该项户所有成员信息（包括户籍人口与实际居住的非户籍人口），并在“居住状态说明”栏目中注明该人应予以明确的居住状态，在“人员关系”栏目中注明本人、配偶、子女、其他等关系。</li>
              </ul>
            </div>
            <!-- 实体信息采集表 -->
            <div v-if="userInfo.index==4">
              <el-form :model="ruleForm" ref="ruleForm" :rules="rules">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="实体名称">
                      <el-input
                        v-model="ruleForm.entityName"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入实体名称'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" label="实体分类">
                      <el-input
                        v-model="ruleForm.entityType"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入实体分类'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="市">
                      <el-input
                        v-model="ruleForm.county"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入市'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="县/区">
                      <el-select
                        @change="changeCity"
                        :disabled="userInfo.state == 1"
                        v-model="ruleForm.city"
                        :placeholder="userInfo.state == 1?'':'请选择县/区'"
                      >
                        <el-option
                          v-for="item in cityPlace"
                          :key="item.id"
                          :label="item.label"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="街道/乡镇">
                      <el-select
                        @change="changeStreet"
                        :disabled="userInfo.state == 1"
                        v-model="ruleForm.street"
                        :placeholder="userInfo.state == 1?'':'请选择街道/乡镇'"
                      >
                        <el-option
                          v-for="item in streetPlace"
                          :key="item.id"
                          :label="item.label"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" label="社区/村">
                      <el-select
                        @change="changePlots"
                        :disabled="userInfo.state == 1"
                        v-model="ruleForm.plots"
                        :placeholder="userInfo.state == 1?'':'请选择社区/村'"
                      >
                        <el-option
                          v-for="item in plotsPlace"
                          :key="item.id"
                          :label="item.label"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="街路巷">
                      <el-input
                        v-model="ruleForm.road"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入街路巷'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" label="门牌号">
                      <el-input
                        v-model="ruleForm.houseNumber"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入门牌号'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="小区">
                      <el-input
                        v-model="ruleForm.community"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入小区'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" label="楼栋详址">
                      <el-input
                        v-model="ruleForm.address"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入楼栋详址'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="地上层数">
                      <el-input
                        v-model="ruleForm.upperNumber"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入地上层数'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" label="地下层数">
                      <el-input
                        v-model="ruleForm.underNumber"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入地下层数'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item class="noBB" label="合并地址">
                      <el-input
                        v-model="ruleForm.mergeAddress"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入合并地址'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR noBB" label="经纬度">
                      <el-input
                        v-model="ruleForm.lngAndlat"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入经纬度'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <!-- 就学信息采集表 -->
            <div v-if="userInfo.index==5">
              <el-form :model="ruleForm" ref="ruleForm" :rules="rules">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="姓名" prop="name">
                      <el-input
                        v-model="ruleForm.name"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入姓名（必填）'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" prop="idCard" label="身份证号码">
                      <el-input
                        v-model="ruleForm.idCard"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入身份证号码（必填）'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item prop="phone" label="电话号码">
                      <el-input
                        v-model="ruleForm.phone"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入电话号码（必填）'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" prop="studyTime" label="入学时间">
                      <el-date-picker
                        :disabled="userInfo.state == 1"
                        v-model="ruleForm.studyTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        :placeholder="userInfo.state == 1?'':'请选择入学时间（必填）'"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="就读时限">
                      <el-input
                        v-model="ruleForm.time"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入就读时限'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" label="年级">
                      <el-input
                        v-model="ruleForm.grade"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入年级'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="班级">
                      <el-input
                        v-model="ruleForm.bclass"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入班级'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" label="学号">
                      <el-input
                        v-model="ruleForm.student"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入学号'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item prop="police" label="居住地派出所">
                      <el-select
                        v-model="ruleForm.police"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请选择居住地派出所（必填）'"
                      >
                        <el-option
                          v-for="item in policeList"
                          :key="item.deptId"
                          :label="item.deptName"
                          :value="item.deptId"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" prop="address" label="居住地址">
                      <el-input
                        v-model="ruleForm.address"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入居住地址（必填）'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item class="noBB" label="备注">
                      <el-input
                        v-model="ruleForm.remarks"
                        :disabled="userInfo.state == 1"
                        :placeholder="userInfo.state == 1?'':'请输入备注'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR noBB" label="是否就学且居住">
                      <el-select
                        :disabled="userInfo.state == 1"
                        v-model="ruleForm.isLive"
                        :placeholder="userInfo.state == 1?'':'请选择'"
                      >
                        <el-option
                          v-for="item in whether"
                          :key="item.value"
                          :label="item.lable"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <ul class="YBSS-notice-list">
                <li class="list-item-title">说明</li>
                <li class="list-item">1、请严格按表中项目采集信息；</li>
                <li
                  class="list-item"
                >2、每个县（市、区）最少抽查10户实有房屋，采集居住人口30人的基本信息，其中城区（关）派出所最少6户18人，城郊结合部派出所最少4户12人；</li>
                <li
                  class="list-item"
                >3、入户抽查时所抽人员必须入住1个月以上，应采集该项户所有成员信息（包括户籍人口与实际居住的非户籍人口），并在“居住状态说明”栏目中注明该人应予以明确的居住状态，在“人员关系”栏目中注明本人、配偶、子女、其他等关系。</li>
              </ul>
            </div>
          </div>
          <div class="ybss-footer-btn" v-if="userInfo.state==0||userInfo.state==2">
            <el-button type="primary" @click="submitForm('ruleForm')">提 交</el-button>
            <el-button @click="routerGo">取 消</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import fjBreadNav from "@/components/fjBreadNav";
import ybssData from "@/scripts/fjYiBiaoSanShiData";
export default {
  name: "fjWorkManage-YiBiaoSanShi-Details",
  data() {
    return {
      breadData: [
        { name: "当前位置:", path: "" },
        { name: "工作管理", path: "" },
        { name: "一标三实", path: "/fjWorkManage-YiBiaoSanShi" },
        { name: "", path: "" }
      ],
      activeList: ybssData.activeList,
      userInfo: {},
      ruleForm: {
        name: "",
        randomplace: []
      },
      randomplace: [], //抽查地址
      cityPlace: [], //城市下拉框
      streetPlace: [], //乡镇下拉框
      plotsPlace: [], //街道下拉框
      optionProps: {
        value: "id",
        label: "label",
        children: "children"
      },
      randomCityList: [], //抽查地点
      subofficeList: [], //房屋所属分局
      policeList: [], //房屋所属派出所
      whether: [
        {
          value: "0",
          lable: "是"
        },
        {
          value: "1",
          lable: "否"
        }
      ], //是否
      rentWhether: [
        //是否出租房屋
        {
          value: "1",
          lable: "是"
        },
        {
          value: "0",
          lable: "否"
        }
      ],
      rules: ybssData.rules
    };
  },
  mounted() {
    this.getTeamList();
    this.getDownDepts();
    this.getReviewPlace();
    this.setCreated();
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.postRuleForm();
        } else {
          this.$message({
            message: "请填写完所有必填信息",
            type: "warning"
          });
          return false;
        }
      });
    },
    handleChange() {
      // console.log(value);
    },
    changePlots() {
      // console.log(this.ruleForm.plots);
    },
    changeCity() {
      // this.ruleForm.street = "";
      // this.ruleForm.plots = "";
      // this.plotsPlace = [];
      // this.streetPlace = [];
      this.ruleForm.city && this.getPlace(this.ruleForm.city, 1);
    },
    changeStreet() {
      // this.ruleForm.plots = "";
      // this.plotsPlace = [];
      this.ruleForm.street && this.getPlace(this.ruleForm.street, 2);
    },
    // 获取地址
    getPlace: function(id, state) {
      var vm = this;
      // 参数
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/getUrbanAndEuralByParentId",
        type: "POST",
        data: {
          id: id
        },
        dataType: "json",
        success: function(data) {
          if (state == 1) {
            vm.streetPlace = data;
          } else if (state == 2) {
            vm.plotsPlace = data;
          } else {
            vm.cityPlace = data;
          }
          // vm.policeList = data.list;
        },
        error: function(err) {}
      });
    },
    // 获取抽查地点
    getReviewPlace: function(state) {
      var vm = this;
      // 参数
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/getReviewPlace",
        type: "POST",
        data: {},
        dataType: "json",
        success: function(data) {
          vm.randomCityList = data;
          // vm.policeList = data.list;
        },
        error: function(err) {}
      });
    },
    // 获取所属派出所
    getTeamList: function(state) {
      var vm = this;
      // 参数
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/searchDeptsByFenju",
        type: "POST",
        data: {},
        dataType: "json",
        success: function(data) {
          vm.policeList = data.list;
        },
        error: function(err) {}
      });
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
      vm.ruleForm.randomplace = vm.randomplace.join(",");
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
      this.breadData[3].name =
        this.activeList[this.userInfo.index].name + "信息采集表";
      this.ruleForm = {};
      this.randomplace = [];
      this.userInfo.state != 0 &&
        (this.ruleForm = $.parseJSON(fjPublic.getLocalData("ybssItem")));
      this.ruleForm.randomplace&&(this.randomplace = this.ruleForm.randomplace.split(","));
      // this.$refs["ruleForm"].resetFields();
      this.getPlace();
      this.changeCity();
      this.changeStreet();
    },
    routerGo() {
      this.$router.push({
        path: "/fjWorkManage-YiBiaoSanShi"
      });
    }
  },
  beforeRouteLeave: function(to, from, next) {
    fjPublic.removeLocalData("ybssItem");
    next();
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
.ybss-footer-btn {
  margin-top: 30px;
  text-align: center;
  button {
    width: 120px;
    height: 36px;
  }
}
.el-cascader-menu {
  min-width: 240px;
}
.YBSS {
  .el-cascader {
    line-height: 32px;
  }
  .el-input.is-disabled .el-input__inner {
    cursor: auto;
    background-color: #fff;
    color: rgba(0, 0, 0, 0.65);
    border: none;
  }
  .el-input.is-disabled .el-input__icon {
    display: none;
  }
  .el-input--prefix .el-input__inner {
    padding-left: 16px;
  }
  .el-input__prefix {
    // right: 5px;
    // left: unset;
    left: -3px;
  }
  .el-cascader.is-disabled .el-cascader__label {
    color: rgba(0, 0, 0, 0.65);
    cursor: auto;
  }
}
.YBSS-form-area {
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

.fj-content_view.YBSS {
  background: #fff;
}
.fj-content_view_mask {
  background: #f0f2f5;
}
.fj-content_view.YBSS .YBSS-form-area.x-scroll {
  overflow-x: scroll;
}
.fj-content_view.YBSS .YBSS-form-area > .el-form {
  margin-bottom: 15px;
}
.fj-content_view.YBSS .el-form {
  border: 1px solid #e8e8e8;
}
.fj-content_view.YBSS .el-form.has-table {
  border: none;
}
.fj-content_view.YBSS .el-form .el-form-item {
  margin-bottom: 0px;
  border-right: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
}
.fj-content_view.YBSS .el-form .el-form-item.noBR {
  border-right: none;
}
.fj-content_view.YBSS .el-form .el-form-item.noBB {
  border-bottom: none;
}
/* 表单->表格调整 */
.YBSS-form-area .el-table th {
  text-align: left;
  color: rgba(0, 0, 0, 0.65);
}
.YBSS-form-area .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: transparent;
}
.YBSS-form-area .el-table td {
  padding: 6px 0px;
}
.YBSS-form-area .el-table td .el-input {
  width: 100%;
}
.YBSS-form-area .el-table td .el-input .el-input__inner {
  padding: 0px 4px;
  border: none;
  color: rgba(0, 0, 0, 0.65);
}
.YBSS-form-area .el-table td .el-textarea .el-textarea__inner {
  border: none;
  padding: 0px;
}
/*  */
.fj-content_view.YBSS .el-form .el-form-item__label {
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
.fj-content_view.YBSS .el-form .el-form-item__content {
  padding-left: 200px;
  line-height: 44px;
}
.fj-content_view.YBSS .el-form .el-form-item.NPL .el-form-item__content {
  padding-left: 0px;
}
/* el-form样式修改 */
.fj-content_view.YBSS .el-form.no-title .el-form-item__label,
.fj-content_view.YBSS .el-form.no-content .el-form-item__content {
  display: none;
}
.fj-content_view.YBSS .el-form.no-title .el-form-item__label,
.fj-content_view.YBSS .el-form.no-content .el-form-item__label {
  border-right: none;
}
.fj-content_view.YBSS .el-form.no-content .el-form-item__label {
  float: none;
  display: block;
}
.fj-content_view.YBSS .el-form.no-content + .el-form.no-title {
  border-left: none;
}
.fj-content_view.YBSS .el-form[class*="no"] {
  float: left;
}
.fj-content_view.YBSS .el-form.no-title .el-form-item__content {
  padding-left: 0px;
}
.fj-content_view.YBSS .el-form.no-content .el-form-item__label,
.fj-content_view.YBSS .el-form.no-title .el-form-item__content {
  position: relative;
  min-width: 160px;
}
.fj-content_view.YBSS
  .el-form.no-title
  .el-form-item__content
  .el-input.is-disabled
  .el-input__inner {
  background-color: #fafafa;
  color: rgba(0, 0, 0, 0.65);
}
/*  */
/* 表单调整 */
.fj-content_view.YBSS .el-form .el-form-item__content .el-select,
.fj-content_view.YBSS .el-form .el-form-item__content .el-input {
  display: block;
  width: 100%;
}
.fj-content_view.YBSS
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
/* 说明文字 */
.fj-content_view.YBSS .YBSS-notice-list {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}
.fj-content_view.YBSS .YBSS-notice-list > .list-item-title {
  line-height: 24px;
  font-size: 14px;
  margin-top: 20px;
  margin-bottom: 10px;
}
.fj-content_view.YBSS .YBSS-notice-list > .list-item {
  line-height: 22px;
}
/* 弹层操作 */
.fj-content_view.YBSS .el-dialog .el-dialog__header {
  padding: 40px 56px;
  font-size: 20px;
  color: rgba(0, 0, 0, 0.85);
}
.fj-content_view.YBSS .el-dialog .el-dialog__body {
  padding: 0px 56px 20px;
}
.fj-content_view.YBSS .el-dialog .el-dialog__body .columns {
  display: flex;
}
.fj-content_view.YBSS .el-dialog .el-dialog__body .fj-column,
.fj-content_view.YBSS .el-dialog .el-dialog__body .fj-column {
  flex: 1 0 auto;
}
.fj-content_view.YBSS .el-dialog .el-dialog__body .title-column {
  flex: 0 0 auto;
  width: 200px;
}
.fj-content_view.YBSS .el-dialog .el-dialog__body .title-column > .el-form {
  border-right: none;
}
.fj-content_view.YBSS .el-dialog .el-dialog__body .fj-column > .el-form {
  border-right: none;
}
.fj-content_view.YBSS .el-dialog .el-dialog__body .el-form[class*="no"] {
  float: none;
}
.fj-content_view.YBSS
  .el-dialog
  .el-dialog__body
  .title-column
  .el-form
  .el-form-item__label {
  background-color: transparent;
}
/*  */
.fj-content_view.YBSS
  .el-dialog
  .el-dialog__body
  [class*="-column"]
  .el-form:first-child {
  border-bottom: none;
}
/*  */
.fj-content_view.YBSS
  .el-dialog
  .el-dialog__body
  .title-column
  > .el-form
  .el-form-item:nth-of-type(2n),
.fj-content_view.YBSS
  .el-dialog
  .el-dialog__body
  .fj-column
  > .el-form
  .el-form-item:nth-of-type(2n)
  .el-input__inner,
.fj-content_view.YBSS
  .el-dialog
  .el-dialog__body
  .mj-column
  > .el-form
  .el-form-item:nth-of-type(2n)
  .el-input__inner {
  background-color: #f0faff;
}
@media screen and (min-width: 1920px) {
  /* .fj-content_view.YBSS .el-form .el-form-item__content .el-select {width:60%;} */
}
</style>

