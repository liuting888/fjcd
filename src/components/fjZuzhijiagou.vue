<template>
    <div class="fj-content_view zzjg">
        <div class="fj-block">
            <fj-breadNav :bread-data="breadData"></fj-breadNav>
            <p class="fj-component_title">条件查询</p>
            <div class="search-area fj-txt_m">
                <div class="search-item">
                    <span class="span-title">角色：</span>
                    <el-select v-model="selectedRole" clearable @change="searchDeptUsers">
                        <el-option v-for="item in rolesData" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </div>
                <div class="search-item hidden-lg-and-down">
                    <span class="span-title">状态：</span>
                    <el-select v-model="selectedStatus" clearable @change="searchDeptUsers">
                        <el-option :value="1" label="未启用"></el-option>
                        <el-option :value="0" label="已启用"></el-option>
                    </el-select>
                </div>
                <div class="search-item fj-clear">
                    <el-input class="search" v-model="nameOrAccount" @input="searchDeptUsersByInput" clearable placeholder="请输入姓名或警号" @clear="getAllUsers">
                        <el-button slot="append" @click="getUsersByDept">搜索</el-button>
                    </el-input>
                </div>
            </div>
        </div>
        <div class="fj-block content">
            <div class="fj-block-head">
                <p class="title fj-fl">组织架构</p>
            </div>
            <div class="fj-block-body dept-user fj-clear">
                <div class="fj-depts-tree" id="fj-depts-tree">
                    <div class="depts-tree-main fj-clear">
                    <div class="tree-item-info">
                        <span class="all" v-text="SJdept" @click="getAllUsers()"></span>
                        <!-- <div class="icon-box" v-show="userInfo.userRole==userRoleCg||userInfo.userRole==userRoleSj">
                            <i class="el-icon-circle-plus" @click.stop="addDept(SJdeptInfo)"></i>
                            <i class="el-icon-edit" @click.stop="modifyDept(SJdeptInfo)"></i>
                            <i class="el-icon-delete" @click.stop="$alert('不能删除！！！','提示',{type:'warning'})"></i>
                        </div> -->
                    </div>
                    </div>
                    <el-tree
                        :data="deptsData"
                        node-key="id"
                        ref="tree"
                        :props="defaultProps"
                        accordion
                        :default-expanded-keys = "treeInitOpened"
                        @node-click="getDataByFenjv">
                        <div class="tree-item-info" slot-scope="{node,data}">
                            <span v-text="data.label" v-if="data.label.length<=10"></span>
                            <el-tooltip v-else class="item" effect="dark" :content="data.label" placement="top">
                                <span v-text="data.label"></span> 
                            </el-tooltip>
                            <div class="icon-box" v-if="userInfo.userRole==userRoleCg||userInfo.userRole==userRoleSj">
                                <i class="el-icon-circle-plus" v-if="data.id.substr(6,6)=='000000'" @click.stop="addDept(data)"></i>
                                <i class="el-icon-edit" @click.stop="modifyDept(data)"></i>
                                <i class="el-icon-delete" @click.stop="deleteDept(data)"></i>
                            </div>
                        </div>
                    </el-tree>
                    <!--遮罩层-->
                    <div class="fj-depts-tree-mask" v-show="userInfo.userRole==userRolePcs"></div>
                </div>
                <div class="fj-depts-info">
                    <div class="depts-basic-info">
                        <span class="dept">所选单位：<span v-text="selectedDeptData.deptName"></span></span>
                        <span class="count">人员数量：<span v-text="dataTotal"></span>人</span>
                        <span class="leader">单位负责人：<span v-text="selectedDeptData.userName"></span></span>
                    </div>
                    <div class="depts-btn-area" :style="[userInfo.userRole==userRolePcs?{'margin-bottom':'20px'}:'']">
                        <el-button type="primary" @click.stop="addUser">添加人员</el-button>
                        <el-button type="default" plain @click="setBatchTransfer" v-show="userInfo.userRole!=userRolePcs"><!-- <i class="el-icon-edit"></i> --><span>批量调动</span></el-button>
                        <!-- <el-button type="default" plain icon="el-icon-refresh">刷新</el-button> -->
                    </div>
                    <div class="depts-select-info" v-show="userInfo.userRole!=userRolePcs">
                        <i class="el-icon-info"></i>
                        <span class="selected">已选择<span v-text="selectedLines"></span>项</span>
                        <span class="dept-name"><span v-text="selectedDeptData.deptName"></span>:</span><span class="count"><span v-text="selectedLines"></span>人</span>
                        <span class="clear" @click="clearSelectedLines">清空</span>
                    </div>
                    <el-table :data="deptsTableData" type="selection" ref="multipleTable" tooltip-effect="dark" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="35"></el-table-column>
                        <el-table-column prop="userName" label="姓名"></el-table-column>
                        <el-table-column prop="userAccount" label="警号"></el-table-column>
                        <el-table-column prop="userRoleName" label="角色"></el-table-column>
                        <el-table-column prop="userStateName" label="状态"></el-table-column>
                        <el-table-column prop="deptname" label="办案单位" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="superiorUserName" label="上级"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="slot">
                                <!-- <span class="ope-txt" @click="showUserInfo(slot.row)">查看</span> -->
                                <span class="ope-txt" @click="showWorkInfo(slot.row)">工作信息</span>
                                <span class="ope-txt" @click="modifyUserInfo(slot.row)">编辑</span>
                                <span class="ope-txt" @click="deleteUserInfo(slot.row)">删除</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="mj-page_wrap">
                        <el-pagination
                            :current-page="currentPage"
                            :page-sizes="[10,20,30]"
                            :page-size="pageSize"
                            layout="total,prev, pager, next, jumper"
                            :total="dataTotal"
                            @current-change="currentPageChange"
                            @prev-click="prevPageChange"
                            @next-click="nextPageChange"
                        >
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <!-- 人员管理 弹窗 -->
        <el-dialog
            id="userPop"
            :title="userPopTitle"
            :visible.sync="toggleUserPop"
            :modal-append-to-body = "toggleUserPopModal"
            :close-on-click-modal="toggleUserPopModal"
            @open="userPopOpenEvent"
            @close="userPopCloseEvent">
            <div class="fj-block">
                <div class="fj-block-body">
                    <el-form :model="basicInfo" :rules="basicInfoRules" ref="bacicForm">
                        <div class="fj-block-head">
                            <p class="title fj-fl">基本信息</p>
                            <div class="details fj-fr">
                                <el-button class="fj-fr" v-show="userPopType=='modify'" :disabled="basicInfo.appUid==''" type="primary" @click="untyingTel(basicInfo)"><i class="el-icon-phone"></i><span>{{basicInfo.appUid==''?'已解绑手机':'解绑手机'}}</span></el-button>
                                <el-button class="fj-fr" v-show="userPopType=='modify'" type="primary" @click="resetPassWord(basicInfo)"><i class="el-icon-edit"></i><span>重置密码</span></el-button>
                            </div>
                        </div>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item prop="userAccount" label="警号">
                                    <el-input v-model="basicInfo.userAccount" placeholder="请输入警号" clearable :disabled="isShowMode||isModifyMode"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item prop="password" label="密码">
                                    <el-input type="password" v-model="basicInfo.password" :placeholder="[userPopType=='add'?'请输入密码':'']" clearable :disabled="isShowMode||userPopType!='add'"></el-input>
                                    <el-tooltip v-show="userPopType=='modify'" effect="dark" content="如需重置密码，请通过重置密码按钮进行操作！重置后的密码为:123456" placement="top">
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item prop="userName" label="姓名">
                                    <el-input v-model="basicInfo.userName" placeholder="请输入姓名" clearable :disabled="isShowMode"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item prop="sex" label="性别">
                                    <el-select v-model="basicInfo.sex" clearable :disabled="isShowMode">
                                        <el-option v-for="item in XBData" :key="item.value" :label="item.value" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item prop="userRole" label="角色">
                                    <el-select v-model="basicInfo.userRole" clearable @change="filterOwnDepts" :disabled="isShowMode">
                                        <el-option v-for="item in rolesData" :key="item.value" :label="item.value" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item prop="userState" label="状态">
                                    <el-select v-model="basicInfo.userState" clearable :disabled="isShowMode">
                                        <el-option v-for="item in userStateData" :key="item.value" :label="item.value" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <!-- <el-col :span="8">
                                <el-form-item prop="superiorUserId" label="上级"> 
                                    <el-select v-model="basicInfo.superiorUserId" :disabled="isHasSuperiors" clearable>
                                        <el-option v-for="item in superiorUserData" :key="item.id" :label="item.label" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col> -->
                            <el-col :span="8">
                                <el-form-item prop="idcard" label="身份证号">
                                    <el-input v-model="basicInfo.idcard" placeholder="请输入身份证号码" clearable :disabled="isShowMode" @input="setBornDate"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="16">
                                <el-form-item label="所属单位">
                                    <el-input v-model="SJdept" disabled></el-input>
                                    <el-select class="ownDept1" v-model="basicInfo.ownDept1" :disabled="userInfo.userRole==userRolePcs||userInfo.userRole==userRoleQj||isShowMode" clearable @change="getPCSdataById">
                                        <el-option v-for="item in FLdeptsData" :key="item.deptId" :label="item.deptName" :value="item.deptId"></el-option>
                                    </el-select>
                                    <el-select class="ownDept2" v-model="basicInfo.ownDept2" :disabled="userInfo.userRole==userRolePcs||isShowMode"  clearable> <!-- @change="getSuperiorList" -->
                                        <el-option v-for="item in SLdeptsData" :key="item.deptId" :label="item.deptName" :value="item.deptId"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <!-- <el-form-item prop="idcard" label="身份证号">
                                    <el-input v-model="basicInfo.idcard" placeholder="请输入身份证号码" clearable :disabled="isShowMode" @input="setBornDate"></el-input>
                                </el-form-item> -->
                                <span style="opacity:0;filter:opacity(0);">1</span>
                            </el-col>
                            <el-col :span="16">
                                <el-form-item class="village" label="所管辖村">
                                    <el-input v-model="basicInfo.village" placeholder="如有，请输入村名" clearable :disabled="isShowMode"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <div class="fj-block-head"><p class="title fj-fl">个人信息</p></div>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="出生日期">
                                    <el-input v-model="basicInfo.birth" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="民族">
                                    <el-select v-model="basicInfo.nation" :disabled="isShowMode">
                                        <el-option v-for="item in MZData" :key="item.value" :label="item.value" :value="item.id" ></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="家庭住址">
                                    <el-input v-model="basicInfo.address"  placeholder="请输入" clearable :disabled="isShowMode"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="婚姻状况">
                                    <el-select v-model="basicInfo.marriage" :disabled="isShowMode">
                                        <el-option v-for="item in HYZKData" :key="item.value" :label="item.value" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="政治面貌">
                                    <el-select v-model="basicInfo.political" :disabled="isShowMode">
                                        <el-option v-for="item in ZZMMData" :key="item.value" :label="item.value" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="文化程度">
                                    <el-select v-model="basicInfo.education" :disabled="isShowMode">
                                        <el-option v-for="item in WHCDData" :key="item.value" :label="item.value" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="履历">
                                    <el-input v-model="basicInfo.expirences" type="textarea"  placeholder="请输入" :disabled="isShowMode"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <div class="fj-block-head"><p class="title fj-fl">联系信息</p></div>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item prop="mobile" label="手机号码">
                                    <el-input v-model="basicInfo.mobile" placeholder="请输入电话号码" clearable :disabled="isShowMode"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="微信号码">
                                    <el-input v-model="basicInfo.wechatNum" placeholder="请输入微信号码" clearable :disabled="isShowMode"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="QQ号">
                                    <el-input v-model="basicInfo.qqNum" placeholder="请输入QQ号码" clearable :disabled="isShowMode"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="家庭成员">
                                    <el-input v-model="basicInfo.family" placeholder="" clearable :disabled="isShowMode"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="紧急联系人">
                                    <el-input v-model="basicInfo.contactName" placeholder="" clearable :disabled="isShowMode"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="紧急联系方式">
                                    <el-input v-model="basicInfo.contactTele" placeholder="" clearable :disabled="isShowMode"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <div class="fj-block-head"><p class="title fj-fl">合同信息</p></div>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="合同编号">
                                    <el-input v-model="basicInfo.agreementId" placeholder="" clearable :disabled="isShowMode"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="合同开始日期">
                                    <el-date-picker
                                        :disabled="isShowMode"
                                        v-model="basicInfo.agreementStartDate"
                                        type="date"
                                        placeholder="请选择"
                                        format="yyyy 年 MM 月 dd 日"
                                        value-format="yyyy-MM-dd">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="合同结束日期">
                                    <el-date-picker
                                        :disabled="isShowMode"
                                        v-model="basicInfo.agreementEndDate"
                                        type="date"
                                        placeholder="请选择"
                                        format="yyyy 年 MM 月 dd 日"
                                        value-format="yyyy-MM-dd">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
			</div>
            <div slot="footer" style="text-align:center;" >
                <el-button @click="cancelUserPop">取 消</el-button>
                <el-button type="primary" @click="confirmUserPopOpe" :disabled="isShowMode">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 批量调动 -->
        <el-dialog
            :visible.sync="toggleBatchTransferPop"
            title="批量调动"
            :modal-append-to-body = "toggleUserPopModal"
            :close-on-click-modal="toggleUserPopModal"
            @close="cancelBatchTransfer"
        >
            <div class="fj-block">
                <el-input v-model="SJdept" disabled></el-input>
                <el-select v-model="BTfenjvId" clearable @change="getBTPOPpcsData" :disabled="userInfo.userRole==userRoleQj||userInfo.userRole==userRolePcs">
                    <el-option v-for="item in FLdeptsData" :key="item.deptId" :label="item.deptName" :value="item.deptId"></el-option>
                </el-select>
                <el-select v-model="BTpcsId" clearable :disabled="userInfo.userRole==userRolePcs">
                    <el-option v-for="item in BTpcsDeptData" :key="item.deptId" :label="item.deptName" :value="item.deptId"></el-option>
                </el-select>
                <el-checkbox v-model="isFJ" v-show="BTpcsId">是否设置为辅警</el-checkbox>
            </div>
            <div slot="footer" style="text-align:center;" >
                <el-button @click="cancelBatchTransfer">取 消</el-button>
                <el-button type="primary" @click="confirmBatchTransfer">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 部门操作 -->
        <el-dialog
        id="DeptPop"
        :visible="toggleDeptPop"
        :title="deptPopTitle"
        :modal-append-to-body = "toggleDeptPopModal"
        :close-on-click-modal="toggleDeptPopModal"
        @close="cancelDeptOpe">
            <el-form :model="deptPopInfo" :rules="deptPopInfoRules" ref="deptPop">
                <el-row>
                    <el-col :span="11">
                        <el-form-item prop="deptname" label="单位名称">
                            <el-input v-model="deptPopInfo.deptname" clearable placeholder="请输入部门名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="tmpDeptId" label="单位编号">
                            <el-tooltip class="item" effect="dark" content="部门编号提交之后将不能修改，请确认无误后再提交！" placement="top">
                                <el-input class="SJdept" v-model="deptPopInfo.initid" disabled></el-input>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="区县分局编号（暂限2位）" placement="top">
                                <el-input id="FLid" class="is-FL" v-model="deptPopInfo.FLid" clearable placeholder="区县分局编号" :disabled="deptPopHideFL||isModifyDept" @input="filterFLid"></el-input>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="派出所编号（暂限6位）" placement="top">
                                <el-input id="SLid" class="is-SL" v-model="deptPopInfo.tmpDeptId" clearable placeholder="派出所编号" @input="filterSLid" :disabled="isModifyDept"></el-input>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="上级单位">
                            <!-- <el-select v-model="deptPopInfo.deptbelongname" clearable :disabled="deptPopHide">
                                <el-option v-for="item in FLdeptsData" :key="item.deptId" :label="item.deptName" :value="item.deptId"></el-option>
                            </el-select> -->
                            <el-input v-model="deptPopInfo.deptbelongname" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="deptleader" label="单位负责人">
                            <!-- <el-select v-model="deptPopInfo.deptleaderid" @change="getDeptbelongname" clearable>
                                <el-option v-for="item in deptPersons" :key="item.id" :label="item.value" :value="item.id"></el-option>
                            </el-select> -->
                            <el-autocomplete
                                v-model="deptPopInfo.deptleader"
                                :fetch-suggestions="querySearchLeader"
                                placeholder="可以输入关键字过滤"
                                clearable
                                @clear="clearLeaderId"
                                @select="getLeaderId"
                            ></el-autocomplete>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item prop="dept_areas" label="单位辖区">
                            <el-autocomplete
                                v-model="deptPopInfo.dept_areas"
                                :fetch-suggestions="querySearchArea"
                                placeholder="可以输入关键字过滤"
                                clearable
                                @clear="clearAreaId"
                                @select="getAreaId"
                            ></el-autocomplete>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="单位坐标">
                            <el-input disabled v-model="deptPopInfo.latlng" clearable placeholder="单位坐标(经纬度)"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item prop="totalpersonnel" label="部门人数">
                            <el-input v-model="deptPopInfo.totalpersonnel" clearable placeholder="部门人数"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="liabler" label="部门考核责任人">
                            <el-input v-model="deptPopInfo.liabler" clearable placeholder="部门考核责任人"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div id="deptMap"></div>
            <div slot="footer" style="text-align:center;" >
                <el-button @click="cancelDeptOpe">取 消</el-button>
                <el-button type="primary" @click="confirmDeptOpe">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import fjBreadNav from '@/components/fjBreadNav';
import 'element-ui/lib/theme-chalk/display.css';
export default {
    name:'fjZuzhijiagou',
    data:function(){
        //验证身份证号码
        var checkIdCard=(function(){
            // 加权因子
            var wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];
            // 身份证验证位值.10代表X
            var valideCodeArr = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];
            // 区域ID
            var areaMap = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
            //错误信息
            var status = new Array("true", "身份证号码位数不对!", "身份证号码出生日期超出范围或含有非法字符!", "身份证号码校验错误!", "身份证地区非法!");
            var idCardArr;
            /* 验证身份证的地区码*/
            function checkArea(idCard){
                if(areaMap[parseInt(idCard.substr(0, 2))] == null){
                    return false;
                } else {
                    return true;
                }
            }
            /* 验证身份证号码中的生日是否是有效生日*/
            function checkBrith(idCard){
                var result = true;
                if(18 == idCard.length) {
                    var year = idCard.substring(6, 10);
                    var month = idCard.substring(10, 12);
                    var day = idCard.substring(12, 14);
                    var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));

                    // 这里用getFullYear()获取年份，避免千年虫问题
                    if (temp_date.getFullYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
                        result = false;
                    }
                }else {
                    result = false;
                }
                return result;
            }
            /*判断身份证号码为18位时最后的验证位是否正确*/
            function check18Code(idCardArr){
                var sum = 0; // 声明加权求和变量
                if (idCardArr[17].toLowerCase() == 'x') {
                    idCardArr[17] = 10;// 将最后位为x的验证码替换为10方便后续操作
                }
                for (var i = 0; i < 17; i++) {
                    sum += wi[i] * idCardArr[i];// 加权求和
                }
                var valCodePosition = sum % 11;// 得到验证码所位置
                if (idCardArr[17] == valideCodeArr[valCodePosition]) {
                    return true;
                } else {
                    return false;
                }
            }
            return function(idCard){
                //去掉首尾空格
                idCardArr=idCard.split('');
                if(idCard.length===15||idCard.length===18) {
                    if(!checkArea(idCard)) {
                        return [false,status[4]];
                    }else if(!checkBrith(idCard)){
                        return [false,status[2]];
                    }else if(idCard.length == 18&&!check18Code(idCardArr)){
                        return [false,status[3]];
                    }else{
                        return [true,null];
                    }
                }else{
                    //位数不对
                    return [false,status[1]];
                }
            };
        })();
        var validateIdCard = function(rule,value,callback){
            var result = checkIdCard(value);
            if(!result[0]){
                callback(new Error(result[1]));
            }else{
                callback();
            }
        };
        //电话号码
        //var telRegExp=/^((1[3|5|7|8][0-9])\d{8})|((0[1-9][0-9])\d{8})|((0[1-9][0-9])\d{7})|((0[1-9][0-9][0-9])\d{7})$/;
        var telRegExp = /^1(3|4|5|6|7|8|9)\d{9}$/;
        var validateTel = function(rule,value,callback){
            var telBool = telRegExp.test(value);
            if(!telBool){
                callback('请输入正确的联系电话');
            }else{
                callback();
            }
        };
        return {
            headImgUrl:fjPublic.ajaxUrlDNN+'/getAvatarByUserId?userId=',
            breadData:[  //面包屑导航
                {name:'当前位置:',path:''},
                {name:'系统管理',path:''},
                {name:'组织架构',path:''}
            ],
            userInfo:null, //当前登录的用户信息
            deptsData:null, //分局的数据
            defaultProps: { //
                children:'children',
                label:'label'
            },
            expandOrCollapse:false, //菜单收起或展开
            deptId:'',  //部门id
            deptName:'', //部门名称
            selectedStatus: 0, // 启用状态
            rolesData:null, //角色列表数据
            rolesDataClone:null, //人员列表修改角色名称用
            userStateData:null, //用户状态数据
            selectedRole:'', //所选的角色
            showTableTooltip:true,
            deptsTableData:null,//部门信息表格
            selectedDeptData:{
                deptName:'',userName:''
            }, //所选部门的信息
            dataTotal:0,   //列表数据总数
            currentPage: 1, //当前页码
            pageSize:10,   //默认每页10条
            toggleUserPop:false, //人员管理弹窗
            toggleUserPopModal:false, //不添加至body
            userPopTitle:'', //人员管理弹窗-标题
            userPopType:'', //弹窗的操作类型 --查看，编辑
            WHCDData:null, //学历数据
            XBData:null, //性别数据
            MZData:null, //民族数据
            HYZKData:null, //婚姻状况数据
            ZZMMData:null, //政治面貌数据
            basicInfo:{  //基本信息
                appUid:'', //是否已解绑手机
                userAccount:'', //警号
                password:'', //密码
                userName:'', //姓名
                sex:'', //性别
                userRole:'', //用户角色
                roleName:'', //角色名
                userState:'', //用户状态
                deptId:'',    //部门id
                deptname:'',  //部门名称
                //superiorUserId:'', //上级id
                //superiorUserName:'', //上级姓名
                idcard:'', //身份证号码
                ownDept1:'', //所属单位-分局
                ownDeptName1:'',
                ownDept2:'', //所属单位-派出所
                ownDeptName2:'',
                village:'',  //村名
                birth:'', //出生日期
                nation:'',  //民族
                address:'', //家庭住址
                marriage:'', //婚姻状况
                political:'', //政治面貌
                education:'', //文化程度
                expirences:'', //履历
                mobile:'', //电话号码
                wechatNum:'', //微信号码
                qqNum:'', //QQ号码
                family:'', //家庭成员
                contactName:'', //紧急联系人
                contactTele:'', //紧急联系方式
                agreementId:'',  //合同编号
                agreementStartDate:'', //合同开始日期
                agreementEndDate:'', //合同结束日期
                recordion:'', //
                areaid:''   //
            },
            SJdept:fjPublic.cityInfos.citiName+'公安局',  //市局名称
            SJdeptId:fjPublic.cityInfos.deptId, //市局部门id  
            SJdeptInfo:{
                deptName:fjPublic.cityInfos.citiName+'公安局',
                deptId:fjPublic.cityInfos.deptId,
                id:fjPublic.cityInfos.deptId
            },
            FLdeptsData:null, //分局数据
            SLdeptsData:null, //根据分局id查出来的对应的派出所数据
            basicInfoRules:{
                userAccount:[{required:true,message:'请输入警号'/* , trigger: 'blur'  */}],
                password:[{required:true,message:'请输入密码'/* , trigger: 'blur'  */}],
                userName:[{required:true,message:'请输入姓名'/* , trigger: 'blur'  */}],
                sex:[{required:true,message:'请选择性别'/* , trigger: 'change'  */}],
                userRole:[{required:true,message:'请选择角色'/* , trigger: 'change'  */}],
                //superiorUserId:[{required:true,message:'请选择上级'/* , trigger: 'change'  */}],
                userState:[{required:true,message:'请选择状态'/* , trigger: 'change'  */}],
                idcard:[
                    {required:true,message:'请输入身份证号码'/* , trigger: 'blur'  */},
                    {validator:validateIdCard/* ,trigger:'change' */}
                ],
                mobile:[
                    {required:true,message:'请输入电话号码'/* , trigger: 'blur' */ },
                    {validator:validateTel/* ,trigger:'change' */}
                ]/*,
                 ownDept2:[{required:true,message:'请选择分局和派出所', trigger: 'change' }] */
            },
            nameOrAccount:'',  //根据姓名或警号查询查询人员数据
            treeInitOpened:[], //部门树默认展开
            isShowMode:false,  //查看人员的时候
            isModifyMode:false,    //编辑人员信息的时候
            userId:'', //编辑或删除时的userId
            //权限控制
            authorizeControl:{
                /*
                    id: "1000" value: "辅警"
                    id: "1001" value: "派出所"
                    id: "1002" value: "区级"
                    id: "8888" value: "市局"
                    id: "9999" value: "超级管理员"
                */
                //派出所
                [fjPublic.userRoles.pcs]:function(data,node){
                    //点击部门菜单栏的时候，不做任何操作
                },
                [fjPublic.userRoles.pcs+'-rolesData']:function(){
                    var deptsNodes = $('.el-tree > .el-tree-node','#fj-depts-tree');
                    deptsNodes.hide();
                    var tmpArr = this.rolesData;
                    this.rolesData= null;
                    this.rolesData = _.filter(tmpArr,function(item){
                        return item.id == fjPublic.userRoles.fj;
                    },this);
                    this.deptId = this.userInfo.deptId;
                    //找出该派出所对应的区级部门
                    var parentDept = _.find(this.FLdeptsData,function(item){
                        return this.userInfo.deptId.slice(0,6)==item.deptId.slice(0,6);
                    },this);
                    //查处对应区的派出所数据
                    $.when(this.getPCSdataById(parentDept.deptId)).then(function(){},_.bind(function(){
                        this.$message({type:'warning',message:'获取派出所数据失败！'});
                    },this));
                    //部门菜单默认展开
                    this.treeInitOpened.push(parentDept.deptId,this.userInfo.deptId);
                    //弹层中，区级单位名称
                    this.$set(this.basicInfo,'ownDept1',parentDept.deptName);
                    //弹层中，派出所名称
                    this.$set(this.basicInfo,'ownDept2',this.userInfo.deptname);
                    //部门菜单的其它部门禁用
                    _.delay(function(){
                        deptsNodes.filter('.is-expanded').show();
                    },600);
                    //根据登录角色的部门id获取人员信息
                    $.when(this.getUsersByDept()).then(function(){},_.bind(function(){
                        this.$message({type:'warning',message:'获取人员信息失败！'});
                    },this));
                },
                //区级
                [fjPublic.userRoles.qj]:function(data,node){
                    if((!$.isArray(data.children)||this.deptId!=data.id)||($.isArray(data.children)&&data.children.length&&this.deptId!=data.id)){
                        //点击区或者派出所的时候
                        this.currentPage = 1;
                        this.deptId = data.id;  //部门id
                        fjPublic.openLoad('请求数据中...');
                        $.when(this.getUsersByDept()).then(function(){
                            fjPublic.closeLoad();
                        },_.bind(function(){
                            fjPublic.closeLoad();
                            this.$message({type:'warning',message:'获取人员信息失败！'});
                        },this));
                    }
                },
                [fjPublic.userRoles.qj+'-rolesData']:function(){
                    var deptsNodes = $('.el-tree > .el-tree-node','#fj-depts-tree');
                    deptsNodes.hide();
                    var tmpArr = this.rolesData;
                    this.rolesData= null;
                    this.rolesData = _.filter(tmpArr,function(item){
                        return item.id == fjPublic.userRoles.fj||item.id==fjPublic.userRoles.pcs;
                    },this);
                    this.deptId = this.userInfo.deptId;
                    //弹层中，区级单位名称
                    this.$set(this.basicInfo,'ownDept1',this.userInfo.deptname);
                    //部门菜单默认展开
                    this.treeInitOpened.push(this.userInfo.deptId);
                    //部门菜单的其它部门隐藏
                    _.delay(function(){
                        deptsNodes.filter('.is-expanded').show();
                    },600);
                    //根据登录角色的部门id获取人员信息
                    $.when(this.getUsersByDept()).then(function(){},_.bind(function(){
                        this.$message({type:'warning',message:'获取人员信息失败！'});
                    },this));
                    //查处对应区的派出所数据
                    $.when(this.getPCSdataById(this.userInfo.deptId)).then(function(){},_.bind(function(){
                        this.$message({type:'warning',message:'查询该区县下的派出所数据失败！'});
                    },this));
                },
                //市局
                [fjPublic.userRoles.sj]:function(data,node){
                    if((!$.isArray(data.children)||this.deptId!=data.id)||($.isArray(data.children)&&data.children.length&&this.deptId!=data.id)){
                        //点击区或者派出所的时候
                        this.currentPage = 1;
                        this.deptId = data.id;  //部门id
                        fjPublic.openLoad('请求数据中...');
                        $.when(this.getUsersByDept()).then(_.bind(function(){
                            fjPublic.closeLoad();
                        },this),_.bind(function(){
                            fjPublic.closeLoad();
                            this.$message({type:'warning',message:'请求数据失败！'});
                        },this));
                    }
                    if($.isArray(data.children)&&data.children.length){
                        //弹层中，区级单位名称
                        this.$set(this.basicInfo,'ownDept1',data.id);
                        //获取派出所数据
                        $.when(this.getPCSdataById(data.id)).then(function(){},_.bind(function(){
                            this.$message({type:'warning',message:'获取派出所数据失败！'});
                        },this));
                    }
                },
                [fjPublic.userRoles.sj+'-rolesData']:function(){
                    var tmpArr = this.rolesData;
                    this.rolesData= null;
                    this.rolesData = _.filter(tmpArr,function(item){
                        return item.id == fjPublic.userRoles.fj||item.id==fjPublic.userRoles.pcs||item.id==fjPublic.userRoles.qj;
                    },this);
                    //获取所有人员数据
                    $.when(this.getUsersByDept()).then(function(){},_.bind(function(){
                        this.$message({type:'warning',message:'获取市局人员数据失败！'});
                    },this));
                },
                //超级管理员
                [fjPublic.userRoles.cg+'-rolesData']:function(){
                    //获取所有人员数据
                    $.when(this.getUsersByDept()).then(function(){},_.bind(function(){
                        this.$message({type:'warning',message:'获取市局人员数据失败！'});
                    },this));
                },
                [fjPublic.userRoles.cg]:function(data,node){ //超级管理员
                    this.authorizeControl[fjPublic.userRoles.sj].apply(this,arguments);
                }
            },
            //关闭添加人员弹窗的时候清空弹窗数据
            closeUserPopControl:{
                [fjPublic.userRoles.pcs]:function(){
                    _.each(this.basicInfo,function(v,k){
                        if(k!='ownDept1'&&k!='ownDept2'){
                            this.$set(this.basicInfo,k,'');
                        }
                    },this);
                },
                [fjPublic.userRoles.qj]:function(){
                    _.each(this.basicInfo,function(v,k){
                        if(k!='ownDept1'){
                            this.$set(this.basicInfo,k,'');
                        }
                    },this);
                },
                [fjPublic.userRoles.sj]:function(){
                    _.each(this.basicInfo,function(v,k){
                        this.$set(this.basicInfo,k,'');
                    },this);
                },
                [fjPublic.userRoles.cg]:function(){
                    this.closeUserPopControl[fjPublic.userRoles.sj].call(this);
                },
            },
            //根据userRole设置部门id,部门名称
            userRoleControl:{
                [fjPublic.userRoles.fj]:function(){ //添加辅警到派出所
                    var vm = this,tmpObj;
                    this.deptId ='';
                    this.deptName = '';
                    if((!this.basicInfo.ownDept1&&!this.basicInfo.ownDept2)||(this.basicInfo.ownDept1&&!this.basicInfo.ownDept2)){
                        this.$message({type:'warning',message:'请选择要添加该角色的单位（派出所）！'});
                        return false;
                    }
                    this.deptId = this.basicInfo.ownDept2; //部门id设置为所选的派出所id
                    if(this.userInfo.userRole==fjPublic.userRoles.pcs){ //登录角色为派出所时
                        this.deptId = this.userInfo.deptId;
                        this.$set(this.basicInfo,'ownDept2',this.userInfo.deptId);
                    }
                    tmpObj = _.find(this.SLdeptsData,function(item){
                        return item.deptId == vm.basicInfo.ownDept2;
                    });
                    if(tmpObj){
                        this.deptName = tmpObj.deptName;  //部门名称设置为所选的派出所名称
                        return true;
                    }else{
                        return false;
                    }
                },
                [fjPublic.userRoles.pcs]:function(){ //添加派出所角色
                    return this.userRoleControl[fjPublic.userRoles.fj].call(this);
                },
                [fjPublic.userRoles.qj]:function(){  //添加区级角色
                    var vm = this,tmpObj;
                    this.deptId ='';
                    this.deptName = '';
                    if(!this.basicInfo.ownDept1){
                        this.$message({type:'warning',message:'请选择要添加该角色的单位（区县分局）！'});
                        return false;
                    }
                    if(this.basicInfo.ownDept2){ //选了派出所没修改角色
                        this.$message({type:'warning',message:'已选择派出所，请修改对应角色！'});
                        return false;
                    }
                    this.deptId = this.basicInfo.ownDept1; //部门id设置为所选的区县分局id
                    this.$set(this.basicInfo,'ownDept2','');
                    tmpObj = _.find(this.FLdeptsData,function(item){
                        return item.deptId == vm.basicInfo.ownDept1;
                    });
                    if(tmpObj){
                        this.deptName = tmpObj.deptName;  //部门名称设置为所选的区县分局名称
                        return true;
                    }else{
                        return false;
                    }
                },
                [fjPublic.userRoles.sj]:function(){ //添加市局角色
                    if(this.basicInfo.ownDept2){
                        this.$message({type:'warning',message:'已选择派出所单位，请修改对应角色！'});
                        return false;
                    }
                    if(this.basicInfo.ownDept1){ //选了分局没修改角色
                        this.$message({type:'warning',message:'已选择分局单位，请修改对应角色！'});
                        return false;
                    }
                    this.deptId = this.SJdeptId; //部门id设置为市局id
                    this.deptName = this.SJdept;  //部门名称设置为市局名称
                    return true;
                },
                [fjPublic.userRoles.cg]:function(){ //添加超级管理员角色
                    return this.userRoleControl[fjPublic.userRoles.sj].call(this);
                }
            },
            //根据userRole设置批量调动的部门
            userRoleBTControl:{
                [fjPublic.userRoles.cg]:function(){
                    var tmpRole;
                    if(!this.BTfenjvId&&!this.BTpcsId){ //未选择分局和派出所
                        this.BTdeptId = this.SJdeptId; //设置为市局id
                        this.deptId = this.SJdeptId;  //刷新列表用
                        this.BTdeptName = this.SJdept; //设置为市局名称
                        tmpRole = _.find(this.rolesData,function(item){
                            return item.id == fjPublic.userRoles.sj;
                        },this);
                    }else if(this.BTfenjvId&&!this.BTpcsId){ //选择了分局未选择派出所
                        var tmpObj = _.find(this.FLdeptsData,function(item){
                            return item.deptId == this.BTfenjvId;
                        },this);
                        this.BTdeptId = this.BTfenjvId; //分局id
                        this.deptId = this.BTfenjvId;  //刷新列表用
                        this.BTdeptName = tmpObj.deptName; //分局名称
                        tmpRole = _.find(this.rolesData,function(item){
                            return item.id == fjPublic.userRoles.qj;
                        },this);
                    }else if(this.BTfenjvId&&this.BTpcsId){ //选择了分局和派出所
                        var tmpObj = _.find(this.BTpcsDeptData,function(item){
                            return item.deptId == this.BTpcsId;
                        },this);
                        this.BTdeptId = this.BTpcsId; //派出所id
                        this.deptId = this.BTpcsId;  //刷新列表用
                        this.BTdeptName = tmpObj.deptName; //派出所名称
                        tmpRole = _.find(this.rolesData,function(item){
                            return item.id == fjPublic.userRoles.pcs;
                        },this);
                    }
                    return tmpRole;
                },
                [fjPublic.userRoles.sj]:function(){
                    var tmpRole;
                    if(!this.BTfenjvId&&!this.BTpcsId){ //未选择分局和派出所
                        this.$message({type:'warning',message:'请选择区县分局'});
                        return;
                    }else if(this.BTfenjvId&&!this.BTpcsId){ //选择了分局未选择派出所
                        var tmpObj = _.find(this.FLdeptsData,function(item){
                            return item.deptId == this.BTfenjvId;
                        },this);
                        this.BTdeptId = this.BTfenjvId; //分局id
                        this.deptId = this.BTfenjvId;  //刷新列表用
                        this.BTdeptName = tmpObj.deptName; //分局名称
                        tmpRole = _.find(this.rolesData,function(item){
                            return item.id == fjPublic.userRoles.qj;
                        },this);
                    }else if(this.BTfenjvId&&this.BTpcsId){ //选择了分局和派出所
                        var tmpObj = _.find(this.BTpcsDeptData,function(item){
                            return item.deptId == this.BTpcsId;
                        },this);
                        this.BTdeptId = this.BTpcsId; //派出所id
                        this.deptId = this.BTpcsId;  //刷新列表用
                        this.BTdeptName = tmpObj.deptName; //派出所名称
                        tmpRole = _.find(this.rolesData,function(item){
                            return item.id == fjPublic.userRoles.pcs;
                        },this);
                    }
                    return tmpRole;
                },
                [fjPublic.userRoles.qj]:function(){
                    var tmpRole;
                    if(!this.BTpcsId){
                        this.$message({type:'warning',message:'请选择要进行调动的派出所！'});
                        return tmpRole;
                    }
                    var tmpObj = _.find(this.BTpcsDeptData,function(item){
                            return item.deptId == this.BTpcsId;
                    },this);
                    this.BTdeptId = this.BTpcsId; //派出所id
                    this.deptId = this.BTpcsId;  //刷新列表用
                    this.BTdeptName = tmpObj.deptName; //派出所名称
                    tmpRole = _.find(this.rolesData,function(item){
                        return item.id == fjPublic.userRoles.pcs;
                    },this);
                    return tmpRole;
                }
            },
            userRoleFj:fjPublic.userRoles.fj, //模板判断角色用
            userRolePcs:fjPublic.userRoles.pcs, 
            userRoleQj:fjPublic.userRoles.qj,
            userRoleSj:fjPublic.userRoles.sj,
            userRoleCg:fjPublic.userRoles.cg,
            //人员表格批量操作
            selectedLines:0,  //选择了多少个
            selectedUsers:null, //选中的人员信息
            //批量调动弹层
            toggleBatchTransferPop:false,
            BTpcsDeptData:null, //批量调动的派出所数据
            BTfenjvId:'', //批量调动分局id
            BTpcsId:'',    //批量调动派出所id
            BTdeptId:'',  //批量调动到的部门id
            BTdeptName:'',  //批量调动到的部门名称
            isFJ:false,    //是否设置为辅警
            toggleDeptPop:false, //部门操作的弹层
            toggleDeptPopModal:false,
            deptPopTitle:'', //部门弹层标题
            deptPopInfo:{
                deptname:'', //部门名称
                initid:fjPublic.cityInfos.deptId.substr(0,4), //部门id前四位
                FLid:'', //区县分局的id
                tmpDeptId:'', //临时的派出所id
                deptid:'',    //部门id
                deptbelongname:'', //上级部门名称
                deptbelong:'', //上级部门编号
                deptleaderid:'', //部门单位负责人编号
                deptleader:'', //部门单位负责人名称
                latlng:'', //区域经纬度，格式：111.48343,27.161385
                dept_areas:'', //区域编号
                deptlevel:'', //级别，市局（0），分局（1），派出所（2）
                totalpersonnel:'', //部门人数
                liabler:'' //部门考核责任人，自行设置名称
            },
            deptPopInfoRules:{
                deptname:[{required:true,message:'请输入单位名称'}],
                tmpDeptId:[{required:true,message:'请输入单位编号'}],
                //deptleader:[{required:true,message:'请选择单位负责人'}],
                dept_areas:[{required:true,message:'请选择单位辖区'}],
                totalpersonnel:[{required:true,message:'请设置部门人数'}],
                liabler:[{validator:function(rule,value,callback){
                    if(value.length>4){
                        callback(new Error('责任人姓名长度太长，限4个字'));
                    }else{
                        callback();
                    }
                },required:true}]
            },
            deptPopHide:false,
            deptPopHideFL:false,
            deptPopControl:{
                [fjPublic.cityInfos.deptId]:function(data){
                    this.deptPopHide = true;
                    this.deptPopHideFL = false;
                    this.$set(this.deptPopInfo,'deptbelong',this.SJdeptId);
                    this.$set(this.deptPopInfo,'deptbelongname',this.SJdept);
                    this.$set(this.deptPopInfo,'deptlevel','1'); //级别分局
                    var vm = this;
                    $.when(this.getPersonList(data.id)).done(function(){}).fail(function(){
                        vm.$message({type:'warning',message:'获取的单位负责人数据失败！'});
                    });
                },
                filterKey:function(id){
                    return id==this.SJdeptId?this.SJdeptId:'FLdept';
                },
                FLdept:function(data){
                    this.deptPopHideFL = true; //
                    this.$set(this.deptPopInfo,'deptlevel','2'); //派出所级别
                    var vm = this;
                    $.Deferred(function(defer){
                        $.when(vm.getPersonList(data.id)).done(defer.resolve).fail(function(){
                            vm.$message({type:'warning',message:'获取的单位负责人数据失败！'});
                        });
                    }).promise().then(function(){
                        $.ajax({
                            url:fjPublic.ajaxUrlDNN + '/searchDeptsByFenju',
                            type:'POST',
                            data:{
                                parentDeptId:data.id  //根据分局id
                            },
                            dataType:'json',
                            success:function(data){
                                //console.log(data);
                                vm.SLdeptsData = null;
                                vm.SLdeptsData = data.list;
                                vm.SLexitNums = null;
                                vm.SLexitNums = _.map(vm.SLdeptsData,function(item){
                                    return item.deptId.substr(6,6);
                                });
                            },
                            error:function(err){
                                vm.$message({type:'warning',message:'获取的'+data.label+'派出所数据失败！'});
                            }
                        });
                    });
                    this.$set(this.deptPopInfo,'deptbelong',data.id);
                    this.$set(this.deptPopInfo,'deptbelongname',data.label);
                    this.$set(this.deptPopInfo,'FLid',data.id.substr(4,2));
                },
            },
            FLexitNums:[], //区县分局已有的编号
            SLexitNums:[], //区县对应的派出所已有的编号
            deptPersons:[], //部门负责人数据
            AreaList:[],   //区域列表数据
            areaTimeout:null,
            deptMap:null, //弹层的地图
            tmpDept_areas:'', //临时存区域编号
            areaColors:['#DDA0DD','#7B68EE','#48D1CC','#EEE8AA','#FFDEAD','#8B475D'],
            deptPolygon:null, //绘制区域
            deptInfoWin:null,  //区域提示框
            deptlabels:[],     //区域label提示
            isModifyDept:false, //是否在编辑部门
            deptOpeType:'', //添加或编辑部门标记
            superiorUserData:[], //人员的上级数据
            deptIdOfSU:'',  //部门id--获取上级数据用
            tmpDeptIdOfSU:'', //部门id--判断用
            isHasSuperiors:true, //是否有上级数据
            setRoleDeptIdOfSU:{  //根据所选的角色设置上级角色和部门id
                [fjPublic.userRoles.fj]:function(){ //选择角色->辅警的时候,其余角色都为上级
                    if(this.basicInfo.ownDept1&&this.basicInfo.ownDept2){
                        this.deptIdOfSU = this.basicInfo.ownDept2;
                    }else if(this.basicInfo.ownDept1&&!this.basicInfo.ownDept2){
                        this.deptIdOfSU = this.basicInfo.ownDept1;
                    }
                    return true;
                },
                [fjPublic.userRoles.pcs]:function(){ //选择角色->派出所的时候,派出所以上都是上级
                    this.deptIdOfSU = this.basicInfo.ownDept1;
                    if(this.tmpDeptIdOfSU==this.deptIdOfSU)return false;
                    this.tmpDeptIdOfSU = this.deptIdOfSU;
                    return true;
                },
                [fjPublic.userRoles.qj]:function(){ //选择角色->区级的时候,区级以上都是上级
                    this.deptIdOfSU = this.SJdeptId;
                    if(this.tmpDeptIdOfSU==this.deptIdOfSU)return false;
                    this.tmpDeptIdOfSU = this.deptIdOfSU;
                    return true;
                },
                [fjPublic.userRoles.sj]:function(){ //选择角色->市局
                    return this.setRoleDeptIdOfSU[fjPublic.userRoles.qj].call(this);
                },
                [fjPublic.userRoles.cg]:function(){ //选择角色->超管
                    return this.setRoleDeptIdOfSU[fjPublic.userRoles.qj].call(this);
                },   
            }
        };
    },
    computed:{

    },
    created:function(){
        //获取当前登录的用户信息
        this.userInfo = $.parseJSON(fjPublic.getLocalData('userInfo'));
        console.log(this.userInfo);
        //
    },
    mounted:function(){
        fjPublic.wrapperRemoveScroll();
        //向 后台请求数据
        var vm = this;
        this.requestDatas().then(_.bind(function(){
            //console.log(this.deptsData);  部门树数据
            this.rolesDataClone = this.rolesData;
            //根据role过滤角色数据
            this.authorizeControl[this.userInfo.userRole+'-rolesData'].call(this);
        },this));
    },
    beforeRouteEnter:function(to,from,next){ //路由
        next(function(vm){
            fjPublic.wrapperRemoveScroll();
        });
    },
    beforeRouteLeave:function(to,from,next){
        next();
    },
    methods:{
        clearSUData:function(){ //清空上级数据
            this.tmpDeptIdOfSU = '';
            this.isHasSuperiors = true;
            this.superiorUserData.splice(0,this.superiorUserData.length);
        },
        getSuperiorList:function(){  //获取上级信息
            if(!this.basicInfo.userRole)return;
            if((!this.basicInfo.ownDept1&&!this.basicInfo.ownDept2)&&(this.basicInfo.userRole!=fjPublic.userRoles.cg)&&(this.basicInfo.userRole!=fjPublic.userRoles.sj)){ //选择市局以下角色的时候
                this.$message({type:'warning',message:'请选择所属单位，获取与角色对应的上级信息！'});
                return;
            }
            var SUbool = this.setRoleDeptIdOfSU[this.basicInfo.userRole].call(this);
            console.log(SUbool);
            console.log(this.deptIdOfSU);
            if(!SUbool)return;
            //return;
            var vm = this;
            fjPublic.openLoad('获取对应上级信息...');
            $.ajax({
                url:fjPublic.ajaxUrlDNN + '/getSuperiorList',
                type:'POST',
                data:{
                    userRole:this.basicInfo.userRole, //所选择的角色编号
                    deptId:this.deptIdOfSU    //部门编号
                },
                dataType:'json',
                success:function(data){
                    fjPublic.closeLoad();
                    console.log(data);
                    if($.isArray(data)&&data.length){
                        vm.isHasSuperiors = false;
                        vm.superiorUserData.splice(0,vm.superiorUserData.length);
                        vm.superiorUserData = null;
                        vm.superiorUserData = data;
                        vm.resizeELinputHeight();
                    }else{
                        vm.clearSUData();
                        vm.resizeELinputHeight();
                        vm.$message({type:'warning',message:'暂无所选部门或角色对应的上级信息！'});
                    }
                    //
                    vm.tmpDeptIdOfSU = vm.deptIdOfSU;
                },
                error:function(err){
                    fjPublic.closeLoad();
                    vm.clearSUData();
                    vm.resizeELinputHeight();
                    vm.$message({type:'warning',message:'暂无所选部门或角色对应的上级信息！'});
                }
            });
        },
        searchDeptUsersByInput:_.debounce(function(){  //输入姓名或警号查询user
            fjPublic.openLoad('搜索中...');
            $.when(this.getUsersByDept()).then(_.bind(function(){
                fjPublic.closeLoad();
            },this),_.bind(function(){
                fjPublic.closeLoad();
            },this));
        },200),
        showWorkInfo:function(data){ //显示工作信息
            //console.log(data);
			//获取内容区滚动条的滚动距离
			fjPublic.getContentScrollTop();
            fjPublic.contentScrollTop(); //滚动条回到顶部
            fjPublic.setLocalData('pInfo-userId',data.userId);
            fjPublic.setLocalData('pInfo-isFrom','fromOS');
            this.$router.push({path:'/organizational-structure-pInfo',query:{userId:data.userId,isFrom:'fromOS'}});
        },
        resetPassWord:function(info){ //重置密码
            console.log(info);
            var vm = this;
            this.$confirm('此操作重置密码, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                fjPublic.openLoad('正在重置密码...');
                $.ajax({
                    url:fjPublic.ajaxUrlDNN + '/resetUsersPwd',
                    type:'POST',
                    data:{
                        userId:info.userId
                    },
                    dataType:'json',
                    success:function(data){
                        fjPublic.closeLoad();
                        if(data.errorCode==0){
                            vm.$message({type:'warning',message:'重置密码成功！'});
                            //刷新人员列表
                            vm.currentPage = 1;
                            $.when(vm.getUsersByDept()).then(function(){
                                vm.toggleUserPop = false;
                            },function(){
                                vm.$message({type:'success',message:'列表更新失败！'});
                            });
                        }else{
                            vm.$message({type:'warning',message:'重置密码失败！'});
                        }
                    },
                    error:function(err){
                        fjPublic.closeLoad();
                        vm.$message({type:'warning',message:'重置密码失败！'});
                    }
                });
            }).catch(() => {

            });
        },
        untyingTel:function(info){ //解绑手机
            if(!info.appUid)return;
            var vm = this;
            fjPublic.openLoad('解绑中...');
            $.ajax({
                url:fjPublic.ajaxUrlDNN + '/cancelTele',
                type:'POST',
                data:{
                    userAccount:info.userAccount  //根据分局id
                },
                dataType:'json',
                success:function(data){
                    fjPublic.closeLoad();
                    if(data.errorCode==0){
                        vm.$message({type:'warning',message:'解绑手机成功！'});
                        //刷新人员列表
                        vm.currentPage = 1;
                        $.when(vm.getUsersByDept()).then(function(){
                            vm.toggleUserPop = false;
                        },function(){
                            vm.$message({type:'success',message:'列表更新失败！'});
                        });
                    }else{
                        vm.$message({type:'warning',message:'解绑手机失败！'});
                    }
                },
                error:function(err){
                    fjPublic.closeLoad();
                    vm.$message({type:'warning',message:'解绑手机失败！'});
                }
            });
        },
        splitDeptId:function(deptId){ //拆分单位编号
            this.$set(this.deptPopInfo,'FLid',deptId.substr(4,2));
            this.$set(this.deptPopInfo,'tmpDeptId',deptId.substr(6,6));
            //vm.$set(vm.deptPopInfo,'deptid',vm.deptPopInfo.initid+vm.deptPopInfo.FLid+vm.deptPopInfo.tmpDeptId);
        },
        filterFLid:function(val){ //限制区县编号
            if(val.length>2){
                this.$set(this.deptPopInfo,'FLid','');
                $('#DeptPop #FLid').val('');
                this.$message({type:'warning',message:'区县分局编号暂限2位！'});
            }
        },
        filterSLid:function(val){ //限制派出所编号
            if(val.length==4){
                this.$set(this.deptPopInfo,'tmpDeptId',val+'00');
            }
            if(val.length>4){
                this.$set(this.deptPopInfo,'tmpDeptId','');
                $('#DeptPop #SLid').val('');
                this.$message({type:'warning',message:'派出所编号暂限6位！'});
            }
        },
        querySearchLeader:function(queryString,cb){ //搜索单位负责人
            var results = _.filter(this.deptPersons,function(item){
                return item.value.indexOf(queryString)!=-1;
            },this);
            clearTimeout(this.areaTimeout);
            this.areaTimeout = setTimeout(()=>{
                cb(results);
            },2000*Math.random());
        },
        getLeaderId:function(item){ //获取单位负责人id
            this.$set(this.deptPopInfo,'deptleaderid',item.id);
        },
        clearLeaderId:function(){
            this.$set(this.deptPopInfo,'deptleaderid','');
        },
        querySearchArea:function(queryString,cb){ //搜索单位负责区域
            var results = _.filter(this.AreaList,function(item){
                return item.value.indexOf(queryString)!=-1;
            },this);
            clearTimeout(this.areaTimeout);
            this.areaTimeout = setTimeout(()=>{
                cb(results);
            },2000*Math.random());
        },
        getAreaId:function(item){ //获取负责区域id和设置地图经纬度
            //console.log(item);
            //this.$set(this.deptPopInfo,'dept_areas',item.id);
            this.tmpDept_areas = item.id;
            item.id = item.id.replace(/\D/g,'');
            var vm = this;
            $.when(
                $.ajax({  //
                    url:fjPublic.ajaxUrlDNN + '/getAreaInfo',
                    type:'POST',
                    data:{
                        nowUser:$.cookie(fjPublic.loginCookieKey),
                        areaids:item.id
                    },
                    dataType:'json',
                    success:function(data){
                        //console.log(data);
                        if(!data.list.length){
                           vm.$message({type:'warning',message:'暂无该区域地理位置信息！'});
                           return;
                        }
                        if(vm.deptPolygon){
                            vm.deptPolygon.setMap(null);
                            vm.deptPolygon = null;
                        }
                        var path_count = parseInt(data.list[0].path_count);
                        var pathArr = [];
                        for(var k = 0;k<path_count;k++){
                            var path = [];
                            _.each(data.list[0].positions[k].positions,function(pos){
                                path.push(new qq.maps.LatLng(pos.lat,pos.lng));
                            });
                            pathArr.push(path);
                        }
                        vm.deptPolygon = new qq.maps.Polygon({
                            clickable: true,
                            cursor: 'crosshair',
                            map: vm.deptMap,
                            path: pathArr,
                            cursor: 'crosshair',
                            strokeColor:new qq.maps.Color(255,100,97,.8),
                            fillColor:_.sample(vm.areaColors),
                            strokeDashStyle: 'solid'
                        });
                        if(vm.deptlabels&&vm.deptlabels.length){
                            _.each(vm.deptlabels,function(item){
                                item.setMap(null);
                                item = null;
                            });
                        }
                        var cssC = {
                            color: '#000',
                            fontSize: '24px',
                            fontWeight: 'bold',
                            border:'none',
                            background:'transparent'
                        };
                        var center;
                        _.each(data.list[0].areaCenter,function(centerObj,i){
                            var tmplat = parseFloat(centerObj.area_center_lat);
                            var tmplat2 = centerObj.area_center_lat;
                            var tmplng = parseFloat(centerObj.area_center_lng);
                            var tmplng2 = centerObj.area_center_lng;
                            if(tmplat > tmplng){
                                centerObj.area_center_lat = tmplng2;
                                centerObj.area_center_lng = tmplat2;
                            }
                            if(i ==0){
                                vm.$set(vm.deptPopInfo,'latlng',centerObj.area_center_lat+','+centerObj.area_center_lng);
                            }
                            center = new qq.maps.LatLng(centerObj.area_center_lat,centerObj.area_center_lng);
                            var content = data.list[0].area_parent+data.list[0].areaname;
                            vm.deptlabels.push(new qq.maps.Label({
                                content: content,
                                map: vm.deptMap,
                                offset: new qq.maps.Size(-10,-20),
                                position: center,
                                style: cssC,
                                visible: true,
                                zIndex: 1000
                            }));
                        });
                        vm.deptMap.setCenter(center);
                        vm.deptMap.zoomTo(10);
                    },
                    error:function(err){
                        vm.$message({type:'warning',message:'获取区域信息失败！'});
                    }
			    })
            ).then();
        },
        clearAreaId:function(){
            this.tmpDept_areas = '';
            this.$set(this.deptPopInfo,'dept_areas','');
            this.$set(this.deptPopInfo,'latlng','');
        },
        addDept:function(data){
            _.each(this.deptPopInfo,function(v,k){
                if(k!='initid'){
                    this.$set(this.deptPopInfo,k,'');
                }
            },this);
            var key = this.deptPopControl.filterKey.call(this,data.deptId);
            this.deptPopControl[key].call(this,data);
            this.deptOpeType = 'add';
            this.deptPopTitle = '添加单位';
            this.toggleDeptPop = true;
            fjPublic.wrapperAddScroll();
            this.setDeptMap();
        },
        modifyDept:function(info){
            var vm = this;
            this.deptOpeType = 'modify';
            this.deptPopTitle = '编辑单位';
            $.when(vm.getPersonList(info.id)).done(function(){
                $.Deferred(function(defer){
                    $.ajax({  //
                        url:fjPublic.ajaxUrlDNN + '/getDeptById',
                        type:'POST',
                        data:{
                            deptId:info.id
                        },
                        dataType:'json',
                        success:function(data){
                            //console.log(data);
                            data.id = data.dept_areas;
                            _.each(data,function(v,k){
                                vm.$set(vm.deptPopInfo,k,v);
                            });
                            vm.isModifyDept = true;
                            vm.splitDeptId(data.deptid);
                            defer.resolve(data);
                        },
                        error:function(err){
                            vm.$message({type:'warning',message:'获取单位信息失败！'});
                        }
                    });

                }).promise().then(function(data){
                    vm.toggleDeptPop = true;
                    fjPublic.wrapperAddScroll();
                    vm.setDeptMap();
                    if(data.deptid==vm.SJdeptId){
                        return;
                    }
                    //设置地图区域块
                    vm.getAreaId(data);
                });
            }).fail(function(){
                vm.$message({type:'warning',message:'获取的单位负责人数据失败！'});
            });
        },
        setDeptMap:function(){ //设置单位弹层上的地图
            this.$nextTick(function(){
                if(!this.deptMap){
                    this.deptMap = new qq.maps.Map(document.getElementById('deptMap'),{
                        center:new qq.maps.LatLng(fjPublic.cityInfos.lat,fjPublic.cityInfos.lng),		// 地图的中心地理坐标
                        zoom:8,
                        mapTypeId: qq.maps.MapTypeId.ROADMAP, //该地图类型显示普通的街道地图。
					    mapTypeControl:false, //不显示地图类型控件
					    panControl:false,   //不显示平移控件
					    zoomControl:false,  //不显示缩放控件
					    scaleControl:true,  //不显示比例尺控件
                    });
                }
            });
        },
        deleteDept:function(data){
            //console.log(data);
            var vm = this;
            this.$confirm('此操作删除该单位?请谨慎操作！！！', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                fjPublic.openLoad('删除中...');
                $.ajax({
                    url:fjPublic.ajaxUrlDNN + '/deleteDept',
                    type:'POST',
                    data:{
                        nowUser:$.cookie(fjPublic.loginCookieKey), //当前用户信息
                        deptId:data.id,
                        deptName:data.label
                    },
                    dataType:'json',
                    success:function(data){
                        //console.log(data);
                        fjPublic.closeLoad();
                        if(data.errorCode=='0'){
                            vm.$message({type:'success',message:'删除单位成功！'});
                            //刷新部门列表
                            $.when(vm.getDepListData()).done(function(){
                                vm.getAllUsers();
                            });
                        }else{
                            vm.$message({type:'warning',message:'删除单位失败！'});
                        }
                    },
                    error:function(err){
                        fjPublic.closeLoad();
                        vm.$message({type:'warning',message:'删除单位失败！'});
                    }
                });
            }).catch(() => {
                fjPublic.removeModalMask();
            });
        },
        cancelDeptOpe:function(){
            this.tmpDept_areas = '';
            _.each(this.deptPopInfo,function(v,k){
                if(k!='initid'){
                    this.$set(this.deptPopInfo,k,'');
                }
            },this);
            if(this.deptPolygon){
                this.deptPolygon.setMap(null);
            }
            if(this.deptlabel){
                this.deptlabel.setMap(null);
            }
            this.$refs['deptPop'].resetFields();
            this.isModifyDept = false;
            this.toggleDeptPop = false;
            fjPublic.removeModalMask();
            fjPublic.wrapperRemoveScroll();
        },
        confirmDeptOpe:function(){
            var vm=this,passBool;
            this.$refs['deptPop'].validate(function(valid){
                if(valid){passBool=true;}
            });
            if(!passBool)return;
            this.$set(this.deptPopInfo,'nowUser',$.cookie(fjPublic.loginCookieKey));
            switch(this.deptOpeType){
                case 'add':
                    var testBool = true;
                    //判断分局编号
                    if(this.deptPopInfo.deptlevel=='1'){
                        var tmpArr = _.filter(this.FLexitNums,function(v){
                            return this.deptPopInfo.FLid==v;
                        },this);
                        if(tmpArr.length){
                            this.$alert('已存在的分局编号为:'+this.FLexitNums.join(',')+',请更换','提示').then(()=>{});
                            testBool = false;
                        }
                    }
                    //判断派出所编号
                    if(this.deptPopInfo.deptlevel=='2'){
                        if(this.deptPopInfo.tmpDeptId.length<6){
                            this.$alert('请输入6位派出所编号','提示').then(()=>{
                                fjPublic.removeModalMask();
                            });
                            testBool = false;
                        }
                        var tmpArr = _.filter(this.SLexitNums,function(v){
                            return this.deptPopInfo.tmpDeptId==v;
                        },this);
                        if(tmpArr.length){
                            this.$alert('该区县分局下已存在的派出所编号为:'+this.SLexitNums.join(',')+',请更换','提示').then(()=>{
                                fjPublic.removeModalMask();
                            });
                            testBool = false;
                        }
                    }
                    if(!testBool)return;
                    this.$set(this.deptPopInfo,'deptid',this.deptPopInfo.initid+this.deptPopInfo.FLid+this.deptPopInfo.tmpDeptId);
                    this.$set(this.deptPopInfo,'dept_areas',this.tmpDept_areas);
                    //console.log(this.deptPopInfo);
                    //return;
                    //fjPublic.openLoad('添加中...');
                    $.ajax({  //
                        url:fjPublic.ajaxUrlDNN + '/addDept',
                        type:'POST',
                        data:this.deptPopInfo,
                        dataType:'json',
                        success:function(data){
                            console.log(data);
                            fjPublic.closeLoad();
                            if(data.errorCode=='0'){
                                vm.$message({type:'success',message:'添加单位成功！'});
                                //刷新部门列表
                                $.when(vm.getDepListData()).done(function(){
                                    vm.cancelDeptOpe();
                                });
                            }else{
                                vm.$message({type:'warning',message:'添加单位失败！'});
                            }
                        },
                        error:function(err){
                            vm.$message({type:'warning',message:'添加单位失败！'});
                        }
                    });
                    break;
                case 'modify':
                    this.$confirm('此操作将修改单位信息，确定要修改吗？','提示',{
                        type:'warning',
                        confirmButtonText:'修改',
                        cancelButtonText:'取消'
                    }).then(()=>{
                        $.ajax({  //
                            url:fjPublic.ajaxUrlDNN + '/updateDept',
                            type:'POST',
                            data:this.deptPopInfo,
                            dataType:'json',
                            success:function(data){
                                console.log(data);
                                if(data.errorCode=='0'){
                                    vm.$message({type:'success',message:'编辑单位成功！'});
                                    //刷新部门列表
                                    $.when(vm.getDepListData()).done(function(){
                                        vm.cancelDeptOpe();
                                    });
                                }else{
                                    vm.$message({type:'warning',message:data.errorMsg});
                                }
                            },
                            error:function(err){
                                vm.$message({type:'warning',message:'编辑单位失败！'});
                            }
                        });
                    }).catch(()=>{});
                    break;
            }

        },
        getAllUsers:function(){ //获取市局所有人员信息
            //角色为区级或以下时,禁用点击
            if(this.userInfo.userRole==fjPublic.userRoles.qj||this.userInfo.userRole==fjPublic.userRoles.pcs){
                return;
            }
            this.selectedRole = ''; //用户角色
            this.nameOrAccount = ''; //姓名或警号
            this.currentPage = 1;
            this.deptId = this.SJdeptId;
            this.getUsersInfoByDept();
        },
        getDepListBySearch:function(){ //获取公安分局数据--联动选择用
            var defer = $.Deferred();
			var vm = this;
			$.ajax({
				url:fjPublic.ajaxUrlDNN + '/searchDepListBySearch',
				type:'POST',
				data:{},
				dataType:'json',
				success:function(data){
                    //console.log(data);
                    //vm.SJdept = data.list[0].deptName;
					vm.FLdeptsData =  _.filter(data.list,function(item){
                        return item.deptId!='411342000000'&&item.deptId!=fjPublic.cityInfos.deptId;
                    });
                    vm.FLexitNums = _.map(vm.FLdeptsData,function(item){
                        return item.deptId.substr(4,2);
                    });
					defer.resolve();
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
        },
        getPCSdataById:function(id){ //根据分局id获取派出所数据
            if(!id){
                this.basicInfo.ownDept2 = ''; //清空分局部门id的时候
                this.SLdeptsData.splice(0,this.SLdeptsData.length);
                this.clearSUData(); //清空上级下拉框数据
                this.resizeELinputHeight(); //调整下拉框高度
                return;
            }
            this.basicInfo.ownDept2 = ''; //切换分局部门的时候
            var defer = $.Deferred();
			var vm = this;
			$.ajax({
				url:fjPublic.ajaxUrlDNN + '/searchDeptsByFenju',
				type:'POST',
				data:{
                    parentDeptId:id  //根据分局id
                },
				dataType:'json',
				success:function(data){
                    //console.log(data);
                    vm.SLdeptsData = null;
                    vm.SLdeptsData = data.list;
					defer.resolve();
				},
				error:function(err){
					defer.reject();
				}
            });
            //
            //this.getSuperiorList();
			return defer;
        },
        getBTPOPpcsData:function(id){ //批量调动---根据分局id获取派出所数据
            //this.BTfenjvId:'', //批量调动分局id
            //BTpcsId:''    //批量调动派出所id
            if(!id)return;
            var defer = $.Deferred();
			var vm = this;
			$.ajax({
				url:fjPublic.ajaxUrlDNN + '/searchDeptsByFenju',
				type:'POST',
				data:{
                    parentDeptId:id  //根据分局id
                },
				dataType:'json',
				success:function(data){
                    //console.log(data);
                    vm.BTpcsDeptData = null, //批量调动的派出所数据
					vm.BTpcsDeptData = data.list;
					defer.resolve();
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
        },
        getDepListData:function(){ //获取公安分局树数据
            var defer = $.Deferred();
			var vm = this;
			$.ajax({  // getTreeDeptData getTreeDeptPersonData
				url:fjPublic.ajaxUrlDNN + '/getTreeDeptData',
				type:'POST',
				data:{},
				dataType:'json',
				success:function(data){
					//console.log(data);
					vm.deptsData = _.filter(data[0].children,function(item){
                        return item.id!='411342000000';
                    });
					defer.resolve();
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
        },
        getSelectFromDict:function(){ //获取角色列表数据
            var defer = $.Deferred();
			var vm = this;
			$.ajax({  //
				url:fjPublic.ajaxUrlDNN + '/getSelectFromDict',
				type:'POST',
				data:{
                    "dictType": "ROLE",
                    "hasEmpty": "1"
                },
				dataType:'json',
				success:function(data){
                    //console.log(data);
                    vm.rolesData = data.dict;  //角色列表数据
                    fjPublic.setLocalData('rolesData',JSON.stringify(data.dict));
					defer.resolve();
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
        },
        getUsersState:function(){ //获取用户状态数据
            var defer = $.Deferred();
			var vm = this;
			$.ajax({  //
				url:fjPublic.ajaxUrlDNN + '/getSelectFromDict',
				type:'POST',
				data:{
                    "dictType": "USERSTSTE",
                    "hasEmpty": "1"
                },
				dataType:'json',
				success:function(data){
                    //console.log(data);
                    vm.userStateData = data.dict;  //用户状态列表数据
					defer.resolve();
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
        },
        getWHCDData:function(){ //获取学历数据
            var defer = $.Deferred();
			var vm = this;
			$.ajax({  //
				url:fjPublic.ajaxUrlDNN + '/getSelectFromDict',
				type:'POST',
				data:{
                    "dictType": "WHCD",
                    "hasEmpty": "1"
                },
				dataType:'json',
				success:function(data){
                    //console.log(data);
                    vm.WHCDData = data.dict;
                    fjPublic.setLocalData('WHCDData',JSON.stringify(data.dict));
					defer.resolve();
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
        },
        getXBData:function(){ //获取性别数据
            var defer = $.Deferred();
			var vm = this;
			$.ajax({  //
				url:fjPublic.ajaxUrlDNN + '/getSelectFromDict',
				type:'POST',
				data:{
                    "dictType": "XB",
                    "hasEmpty": "1"
                },
				dataType:'json',
				success:function(data){
                    //console.log(data);
                    vm.XBData = data.dict;
                    fjPublic.setLocalData('XBData',JSON.stringify(data.dict));
					defer.resolve();
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
        },
        getMZData:function(){  //获取民族数据
            var defer = $.Deferred();
			var vm = this;
			$.ajax({  //
				url:fjPublic.ajaxUrlDNN + '/getSelectFromDict',
				type:'POST',
				data:{
                    "dictType": "MZ",
                    "hasEmpty": "1"
                },
				dataType:'json',
				success:function(data){
                    //console.log(data);
                    vm.MZData = data.dict;
                    fjPublic.setLocalData('MZData',JSON.stringify(data.dict));
					defer.resolve();
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
        },
        getHYZKData:function(){ //获取婚姻状况数据
            var defer = $.Deferred();
			var vm = this;
			$.ajax({  //
				url:fjPublic.ajaxUrlDNN + '/getSelectFromDict',
				type:'POST',
				data:{
                    "dictType": "HYZK",
                    "hasEmpty": "1"
                },
				dataType:'json',
				success:function(data){
                    //console.log(data);
                    vm.HYZKData = data.dict;
                    fjPublic.setLocalData('HYZKData',JSON.stringify(data.dict));
					defer.resolve();
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
        },
        getZZMMData:function(){ //获取政治面貌数据
            var defer = $.Deferred();
			var vm = this;
			$.ajax({  //
				url:fjPublic.ajaxUrlDNN + '/getSelectFromDict',
				type:'POST',
				data:{
                    "dictType": "ZZMM",
                    "hasEmpty": "1"
                },
				dataType:'json',
				success:function(data){
                    //console.log(data);
                    vm.ZZMMData = data.dict;
                    fjPublic.setLocalData('ZZMMData',JSON.stringify(data.dict));
					defer.resolve();
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
        },
        getUsersByDept:function(){  //根据部门id获取人员数据
            var defer = $.Deferred();
            var vm = this;
			$.ajax({  //
				url:fjPublic.ajaxUrlDNN + '/searchUsersByPage',
				type:'POST',
				data:{
                    nowUser:$.cookie(fjPublic.loginCookieKey), //当前用户信息
                    deptId:this.deptId,  //部门id
                    userRole:this.selectedRole, //用户角色
                    nameOrAccount:this.nameOrAccount, //姓名或警号
                    status: this.selectedStatus, // 启用状态
                    page:this.currentPage,
                    rows:10
                },
				dataType:'json',
				success:function(data){
                    //console.log(data);
                    vm.dataTotal = data.total==-1?0:data.total; //分页的数据总数
                    vm.selectedDeptData = null;
                    vm.selectedDeptData = data.deptInfo; //所选部门的信息
                    vm.deptsTableData = null;
                    vm.deptsTableData = data.rows;  //角色列表数据
                    //用户角色字段
                    _.each(vm.deptsTableData,function(item){
                        var tmpObj = _.find(vm.rolesDataClone,function(item2){
                            return item2.id==item.userRole;
                        });
                        if(tmpObj){
                            vm.$set(item,'userRoleName',tmpObj.value);
                        }
                    });
                    //用户状态字段
                    _.each(vm.deptsTableData,function(item){
                        switch(item.userState){
                            case '0':
                                vm.$set(item,'userStateName',vm.userStateData[0].value);
                                break;
                            case '1':
                                vm.$set(item,'userStateName',vm.userStateData[1].value);
                                break;
                        }
                    });
					defer.resolve();
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
        },
        searchDeptUsers:function(){ //根据角色和姓名或警号搜索人员信息
            var vm = this;
            this.currentPage = 1;
            fjPublic.openLoad('查询中...');
            $.when(this.getUsersByDept()).then(function(){
                fjPublic.closeLoad();
            },function(){
                fjPublic.closeLoad();
                vm.$message({type:'warning',message:'查询数据失败！'});
            });
        },
        getPersonList:function(deptId){ //获取部门负责人数据
            var defer = $.Deferred();
            var vm = this;
			$.ajax({  //
				url:fjPublic.ajaxUrlDNN + '/getPersonList',
				type:'POST',
				data:{
                    //nowUser:$.cookie(fjPublic.loginCookieKey),
                    deptid:deptId
                },
				dataType:'json',
				success:function(data){
                    //console.log(data);
                    if(data){
                        vm.deptPersons = null;
                        vm.deptPersons = data;
                    }else{
                        vm.deptPersons = null;
                        vm.deptPersons = [];
                    }
					defer.resolve();
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
        },
        getAreaList:function(){ //获取区域列表数据
            var defer = $.Deferred();
            var vm = this;
			$.ajax({  //
				url:fjPublic.ajaxUrlDNN + '/getAreaList',
				type:'POST',
				data:{
                    nowUser:$.cookie(fjPublic.loginCookieKey)
                },
				dataType:'json',
				success:function(data){
                    //console.log(data);
                    vm.AreaList = null;
                    vm.AreaList = data;
					defer.resolve();
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
        },
        requestDatas:function(){  //向后台请求数据
			var vm = this,count = 0,defer = $.Deferred();
			fjPublic.openLoad('数据加载中...');
            $.when(
                this.getDepListBySearch(),
                this.getDepListData(),
                this.getSelectFromDict(),
                this.getUsersState(),
                this.getWHCDData(),
                this.getXBData(),
                this.getMZData(),
                this.getHYZKData(),
                this.getZZMMData(),
                this.getAreaList()
            ).then(function(){
                fjPublic.closeLoad();
                defer.resolve();
            },function(){
                vm.$message({
                    type:'warning',
                    message:'请求数据失败！！！'
                });
                _.delay(function(){
                    fjPublic.closeLoad();
                    vm.$router.push('/500');
                },2000);
            });
			return defer;
        },
        getDataByFenjv:function(data,node){ //点击分局对应节点，获取派出所人员数据
            //执行权限判断
            this.authorizeControl[this.userInfo.userRole].apply(this,arguments);
            //------------
        },
        addUser:function(){
            if(!this.deptsTableData&&!this.deptId){
                this.$message({
                    type:'warning',
                    message:'请先选择部门'
                });
                return;
            }
            //清空弹层数据
            this.closeUserPopControl[this.userInfo.userRole].call(this);
            this.userPopTitle = '添加人员';
            this.userPopType = 'add';
            this.showAllDepts();
            this.toggleUserPop = true;
            fjPublic.wrapperAddScroll();
            //设置对应的部门
            this.$nextTick(function(){
                $(this.$refs['bacicForm'].$el).find('.el-select.ownDept1,.el-select.ownDept2,.el-input.village').show();
            });
        },
        filterOwnDepts:function(roleId){ //选择角色时，隐藏相应的部门选择框
            var oBasicForm = $(this.$refs['bacicForm'].$el);
            switch(roleId){
                case this.userRoleFj:
                    oBasicForm.find('.el-select.ownDept1,.el-select.ownDept2,.el-form-item.village').show();
                    break;
                case this.userRolePcs:
                    oBasicForm.find('.el-select.ownDept1,.el-select.ownDept2,.el-form-item.village').show();
                    break;
                case this.userRoleQj:
                    oBasicForm.find('.el-select.ownDept1').show();
                    oBasicForm.find('.el-select.ownDept2').hide();
                    oBasicForm.find('.el-form-item.village').hide();
                    this.$set(this.basicInfo,'ownDept2','');
                    break;
                case this.userRoleSj:
                    oBasicForm.find('.el-select.ownDept1,.el-select.ownDept2,.el-form-item.village').hide();
                    this.$set(this.basicInfo,'ownDept1','');
                    this.$set(this.basicInfo,'ownDept2','');
                    break;
                case this.userRoleCg:
                    oBasicForm.find('.el-select.ownDept1,.el-select.ownDept2,.el-form-item.village').hide();
                    this.$set(this.basicInfo,'ownDept1','');
                    this.$set(this.basicInfo,'ownDept2','');
                    break;
                default:
                    oBasicForm.find('.el-select.ownDept1,.el-select.ownDept2,.el-form-item.village').show();
                    break;
            }
            if(!this.basicInfo.userRole){
                this.clearSUData();
                return;
            }
            //获取上级信息
            //this.getSuperiorList();
        },
        showAllDepts:function(){ //显示弹层上的所有部门
            var oBasicForm = $(this.$el).find('#userPop form');
            oBasicForm.find('.el-select.ownDept1,.el-select.ownDept2,.el-form-item.village').show();
        },
        setBornDate:function(val){ //根据输入的身份证号码设置出生日期
            if(val.length==18){
                var bdyear = this.basicInfo.idcard.substr(6,4),
                    bdMonth = this.basicInfo.idcard.substr(10,2),
                    bdDate = this.basicInfo.idcard.substr(12,2);
                this.$set(this.basicInfo,'birth',bdyear+'-'+bdMonth+'-'+bdDate);
            }
        },
        userPopOpenEvent:function(){

        },
        userPopCloseEvent:function(){ //关闭弹窗的时候
            this.cancelUserPop();
        },
        resizeELinputHeight:function(){ //调整下拉框的每行高度
            _.delay(function(){
                $('.el-select > .el-input > .el-input__inner','#userPop').css('height','32px');
            },200);
        },
        cancelUserPop:function(){ //取消弹窗
            //清空弹层数据
            this.closeUserPopControl[this.userInfo.userRole].call(this);
            if(!this.basicInfoRules.password.length){
                this.$set(this.basicInfoRules,'password',[{required:true,message:'请输入密码'/* , trigger: 'blur'  */}]);
            }
            //
            this.isShowMode = false;
            this.isModifyMode = false;
            //
            this.$refs['bacicForm'].resetFields();
            this.clearSUData();
            this.userPopTitle = '';
            this.userPopType = '';
            this.userId = '';
            //调整被禁用的输入框的尺寸
            _.delay(()=>{
                this.resizeELinputHeight();
            },300);
            this.toggleUserPop = false;
            fjPublic.removeModalMask();
            fjPublic.wrapperRemoveScroll();
        },
        confirmUserPopOpe:function(){  //点击弹窗--确定
            //验证
            var vm = this,basicFormBool;
            this.$refs['bacicForm'].validate(function(valid){
                if(valid){
                    basicFormBool = true;
                }
            });
            if(!basicFormBool)return;
            //根据userRole判断部门名称,角色名称,角色id,部门id
            var roleBool = this.userRoleControl[this.basicInfo.userRole].call(this);
            if(!roleBool)return;
            //角色名称
            var roleName = _.find(this.rolesData,function(item){
                return this.basicInfo.userRole == item.id;
            },this).value;
            //上级名称
            /* var superiorUserName = _.find(this.superiorUserData,function(item){
                return this.basicInfo.superiorUserId == item.id;
            },this).label; */
            if(!this.deptId||!this.deptName)return;
            //提交
            this.$set(this.basicInfo,'nowUser',$.cookie(fjPublic.loginCookieKey));
            this.$set(this.basicInfo,'roleName',roleName);
            this.$set(this.basicInfo,'deptId',this.deptId);
            this.$set(this.basicInfo,'deptname',this.deptName);
            //this.$set(this.basicInfo,'superiorUserName',superiorUserName);
            switch(this.userPopType){
                case 'add': //添加人员
                    fjPublic.openLoad('正在添加...'); //
                    //return;
                    $.ajax({
                        url:fjPublic.ajaxUrlDNN + '/addUsersData',
                        type:'POST',
                        data:this.basicInfo,
                        dataType:'json',
                        success:function(data){
                            console.log(data);
                            fjPublic.closeLoad();
                            if(data.errorCode=='0'){
                                vm.$message({type:'success',message:'添加人员成功！'});
                                //刷新人员列表
                                vm.currentPage = 1;
                                $.when(vm.getUsersByDept()).then(function(){
                                    vm.cancelUserPop();
                                },function(){
                                    vm.$message({type:'success',message:'列表更新失败！'});
                                });
                            }else{
                                vm.cancelUserPop();
                                vm.$message({type:'warning',message:data.errorMsg});
                            }
                        },
                        error:function(err){
                            fjPublic.closeLoad();
                            vm.$message({type:'warning',message:'添加人员失败！'});
                        }
			        });
                    break;
                case 'modify':
                this.$confirm('此操作将修改人员信息，是否修改？','提示',{
                    type:'warning',
                    confirmButtonText:'修改',
                    cancelButtonText:'取消'
                }).then(()=>{
                    fjPublic.openLoad('正在编辑...'); //
                    //
                    $.ajax({
                        url:fjPublic.ajaxUrlDNN + '/editUsersData',
                        type:'POST',
                        data:this.basicInfo,
                        dataType:'json',
                        success:function(data){
                            console.log(data);
                            fjPublic.closeLoad();
                            if(data.errorCode==0){
                                vm.$message({type:'success',message:'编辑人员信息成功！'});
                                //刷新人员列表
                                $.when(vm.getUsersByDept()).then(function(){
                                    vm.cancelUserPop();
                                },function(){
                                    vm.$message({type:'warning',message:'列表更新失败！'});
                                });
                            }else{
                                vm.cancelUserPop();
                                vm.$message({type:'warning',message:data.errorMsg});
                            }
                        },
                        error:function(err){
                            fjPublic.closeLoad();
                            vm.$message({type:'warning',message:'编辑人员信息失败！'});
                        }
                    });
                }).catch(()=>{});
                    break;
            }
        },
        showUserInfo:function(data){ //查看人员信息
            //console.log(data);
            this.userPopTitle = '查看人员信息';
            this.userPopType = 'showUserInfo';
            //
            _.each(data,function(v,k){
                this.$set(this.basicInfo,k,v);
                if(k=='password'){
                    this.$set(this.basicInfo,k,'******');
                }
            },this);
            //根据data.deptId设置分局名称和派出所名称
            var tmpObj = _.find(this.FLdeptsData,function(item){
                return item.deptId.slice(0,6)==data.deptId.slice(0,6);
            },this);
            if(tmpObj){
                this.$set(this.basicInfo,'ownDept1',tmpObj.deptId);
            }
            if(data.deptname.indexOf('派出所')!=-1){
                this.$set(this.basicInfo,'ownDept2',data.deptname);
            }
            //
            this.setBornDate(data.idcard);
            //
            this.isShowMode = true;
            this.showAllDepts();
            this.toggleUserPop = true;
            //
            this.$nextTick(function(){
                //调整被禁用的输入框的尺寸
                _.delay(function(){
                    $('.el-select > .el-input.is-disabled > .el-input__inner','#userPop').css('height','32px');
                },300);
            });
        },
        modifyUserInfo:function(data){ //编辑人员信息
            console.log(data);
            if(this.userInfo.userRole == data.userRole&&this.userInfo.userId!=data.userId){
                this.$message({type:'warning',message:'相同权限等级，不能进行编辑操作！'});
                return;
            }
            this.userPopTitle = '编辑人员信息';
            this.userPopType = 'modify';
            this.userId = data.userId;
            this.isModifyMode = true;
            //
            this.$set(this.basicInfoRules,'password',[]);
            _.each(data,function(v,k){
                this.$set(this.basicInfo,k,v);
                if(k=='password'){
                    this.$set(this.basicInfo,k,'******');
                }
            },this);
            this.showAllDepts();
            //根据data.deptId设置分局名称和派出所名称
            var tmpObj = _.find(this.FLdeptsData,function(item){
                return item.deptId.slice(0,6)==data.deptId.slice(0,6);
            },this);
            if(tmpObj){
                this.$set(this.basicInfo,'ownDept1',tmpObj.deptId);
                //根据分局id查询派出所数据
                $.when(this.getPCSdataById(tmpObj.deptId)).then(_.bind(function(){},this),_.bind(function(){
                    this.$message({type:'warning',message:'获取派出所数据失败！'});
                },this));
            }
            if(data.deptId.substr(6,6)!='000000'){
                this.$set(this.basicInfo,'ownDept2',data.deptId);
            }
            if(data.userRole==fjPublic.userRoles.sj||data.userRole==fjPublic.userRoles.cg){
                this.$set(this.basicInfo,'ownDept1','');
                this.$set(this.basicInfo,'ownDept2','');
            }
            this.toggleUserPop = true;
            fjPublic.wrapperAddScroll();
            //
            this.setBornDate(data.idcard);
            //
            this.$nextTick(function(){
                //调整被禁用的输入框的尺寸
                _.delay(function(){
                    $('.el-select > .el-input > .el-input__inner','#userPop').css('height','32px');
                },300);
            });
        },
        deleteUserInfo:function(data){ //删除人员信息
            if(this.userInfo.userRole == data.userRole&&this.userInfo.userId!=data.userId){
                this.$message({type:'warning',message:'相同权限等级，不能进行删除操作！'});
                return;
            }
            this.userId = data.userId;
            var vm = this;
            //
            this.$confirm('是否要删除该人员信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                fjPublic.openLoad('删除中...');
                $.ajax({
                    url:fjPublic.ajaxUrlDNN + '/deleteUsersData',
                    type:'POST',
                    data:{
                        nowUser:$.cookie(fjPublic.loginCookieKey), //当前用户信息
                        userId:vm.userId
                    },
                    dataType:'json',
                    success:function(data){
                        console.log(data);
                        fjPublic.closeLoad();
                        if(data.errorCode=='0'){
                            fjPublic.removeModalMask();
                            vm.$message({type:'success',message:'删除人员成功！'});
                            //刷新人员列表
                            vm.getUsersInfoByDept();
                        }
                    },
                    error:function(err){
                    }
                });
            }).catch(() => {});
        },
        handleSelectionChange:function(arr){
            //arr  选择的数据项
            this.selectedUsers = null;
            this.selectedUsers = arr;
            this.selectedLines = arr.length;
        },
        clearSelectedLines:function(){
            //
            this.selectedUsers = null;
            //
            this.$refs.multipleTable.clearSelection();
        },
        getUsersInfoByDept:function(){ //获取对应部门的人员信息
            fjPublic.openLoad('数据加载中...');
            $.when(this.getUsersByDept()).then(_.bind(function(){
                fjPublic.closeLoad();
            },this),_.bind(function(){
                fjPublic.closeLoad();
                this.$message({type:'warning',message:'数据请求失败！'});
            },this));
        },
        currentPageChange:function(pageNum){  //点击某个分页按钮
            // pageNum  当前的页码值
            this.currentPage = pageNum;
            this.getUsersInfoByDept();
        },
        prevPageChange:function(pageNum){  //点击分页的上一页
            // pageNum  当前页--后的值
            this.currentPage = pageNum;
            this.getUsersInfoByDept();
        },
        nextPageChange:function(pageNum){  //点击分页的下一页
        // pageNum  当前页++后的值
            this.currentPage = pageNum;
            this.getUsersInfoByDept();
        },
        sizePageChange:function(pageSize){  //改变每页条数时
        // pageSize 每页条数
        },
        setBatchTransfer:function(){ //批量调动部门
            if(!this.selectedUsers||!this.selectedUsers.length){
                this.$message({type:'warning',message:'请选择要调动的人员！'});
                return;
            }
            var tmpObj = _.find(this.selectedUsers,function(item){
                return item.userRole==this.userInfo.userRole&&item.userId!=this.userInfo.userId;
            },this);
            if(tmpObj){
                this.$message({type:'warning',message:'所选的人员中，存在与您权限相同的，不能对其进行调动操作！'});
                return;
            }
            switch(this.userInfo.userRole){
                case this.userRoleQj: //设置调动时默认的分局部门
                    this.BTfenjvId = _.find(this.FLdeptsData,function(item){
                        return item.deptId = this.userInfo.deptId;
                    },this).deptId;
                    //查出对应的派出所数据
                    $.when(this.getBTPOPpcsData(this.userInfo.deptId)).then(_.bind(function(){},this),_.bind(function(){
                        this.$message({type:'warning',message:'获取用于批量调动的派出所数据失败！'});
                    },this));
                    break;
            }
            this.toggleBatchTransferPop = true;
            fjPublic.wrapperAddScroll();
        },
        cancelBatchTransfer:function(){ //退出批量调动部门
            this.BTdeptId = '';  //清空要调动的部门id
            this.BTdeptName = ''; //清空要调动的部门名称
            this.toggleBatchTransferPop = false;
            fjPublic.wrapperRemoveScroll();
        },
        confirmBatchTransfer:function(){ //确认批量调动
            var tmpDeptId = this.deptId;
            var tmpRole = this.userRoleBTControl[this.userInfo.userRole].call(this);
            if(!tmpRole)return;
            //
            if(this.isFJ){
                tmpRole = _.find(this.rolesData,function(item){
                    return item.id == fjPublic.userRoles.fj;
                },this);
            }
            //
            var vm=this;
            var count = 0,errorCount=0;
            this.$confirm('此操作将进行人员调动，是否提交？','提示',{
                type:'warning',
                confirmButtonText:'提交',
                cancelButtonText:'取消'
            }).then(()=>{
                fjPublic.removeModalMask();
                fjPublic.openLoad('批量调动中...');
                $.Deferred(function(defer){
                    _.each(vm.selectedUsers,function(item,i){
                        vm.$set(item,'userRole',tmpRole.id);  //设置人员角色
                        vm.$set(item,'roleName',tmpRole.value); //设置人员角色名
                        vm.$set(item,'deptId',vm.BTdeptId); //设置人员部门id
                        vm.$set(item,'deptname',vm.BTdeptName); //设置人员部门名称
                        //修改人员信息
                        $.when(
                            $.ajax({
                                url:fjPublic.ajaxUrlDNN + '/editUsersData',
                                type:'POST',
                                data:{
                                    "nowUser":$.cookie(fjPublic.loginCookieKey), //当前用户信息
                                    "userAccount":item.userAccount, //警号
                                    "userName":item.userName, //姓名
                                    "userState":item.userState, //用户状态
                                    "userRole": item.userRole, //角色
                                    "roleName": item.roleName, //角色名
                                    "deptId": vm.BTdeptId, //部门id
                                    "deptname": vm.BTdeptName, //部门名称
                                    "sex":item.sex,
                                    "idcard":item.idcard,  //身份证号
                                    "nation":item.nation,
                                    "marriage":item.marriage
                                },
                                dataType:'json',
                                success:function(data){
                                    //console.log(data);
                                    count++;
                                    if(!data.errorCode==0){
                                        errorCount++;
                                    }
                                },
                                error:function(err){
                                    count++;
                                    errorCount++;
                                }
                            })
                        ).then(function(){
                            if(count==vm.selectedUsers.length){
                                defer.resolve();
                            }
                        });
                    });
                }).promise().then(function(){
                    var defer = $.Deferred();
                    defer.resolve();
                    return function(){return defer;};
                }).then(function(fn){
                    $.when(fn()).then(function(){
                        //调动成功后，清空选择的部门状态
                        vm.isFJ = false;
                        vm.BTfenjvId = '';
                        vm.BTpcsId = '';
                        if(errorCount>0){
                            vm.$message({type:'success',message:'批量调动成员中，有'+errorCount+'人调动失败！'});
                        }else{
                            vm.$message({type:'success',message:'批量调动成功！'});
                        }
                        fjPublic.closeLoad();
                        //
                        vm.cancelBatchTransfer();
                        //刷新列表
                        $.when(vm.getUsersByDept()).done(function(){}).fail(function(){
                            vm.$message({type:'success',message:'列表信息更新失败！'});
                        });
                    });
                });
            }).catch(()=>{
                vm.deptId = tmpDeptId;
                fjPublic.removeModalMask();
            });
        }
    },
    filter:{
    },
    watch:{
        BTfenjvId:function(val){
            //切换分局部门id的时候
            this.BTpcsId = '';
            this.isFJ = false;
            if(!val){ //未选择分局部门id的时候，清空派出所部门数据
                this.BTpcsDeptData.splice(0,this.BTpcsDeptData.length);
            }
        },
        BTpcsId:function(val){
            if(!val){  //清空派出所部门id的时候
                this.isFJ = false;
            }
        }
    },
    components:{
        fjBreadNav
    }
}
</script>
<style scope>
/* 系统配置 -> 组织架构 */
.fj-content_view.zzjg {}
.fj-content_view.zzjg > .fj-block {padding-left:30px;background-color:#fff;}
.fj-content_view.zzjg .search-area {padding:26px 0px 30px;font-size:0;}
.fj-content_view.zzjg .search-area > .search-item {position:relative;display:inline-block;}
.fj-content_view.zzjg .search-item > .span-title {font-size:14px;color:rgba(0,0,0,.85);}
.fj-content_view.zzjg .search-item > .el-select {width:240px;margin-right:80px;}
.fj-content_view.zzjg .search-item > .el-input.search .el-input-group__append {background:#1890FF;border-color:#1890FF;color:#fff;}
/*  */
.fj-content_view.zzjg > .fj-block.content {padding:0px 18px}
.fj-content_view.zzjg > .fj-block.content > .fj-block-head {padding-left:10px;}
.fj-content_view.zzjg > .fj-block.content > .fj-block-body {min-height:860px;}
/*  */
.fj-content_view.zzjg .fj-block-body.dept-user {display:flex;flex-flow:row nowrap;}
.fj-content_view.zzjg .fj-depts-tree {position:relative;flex:0 0 250px;width:250px;height:776px;max-height:776px;margin-top:20px;overflow:auto;border:1px solid #E8E8E8;}
.fj-depts-tree-mask {position:absolute;left:0px;right:0;top:0px;bottom:0px;}
/*  */
.fj-content_view.zzjg .fj-depts-tree .el-tree-node__expand-icon {font-size:18px;color:rgba(0,0,0,.65);}
.fj-content_view.zzjg .fj-depts-tree .el-tree-node__expand-icon.is-leaf {color:transparent;}
.fj-content_view.zzjg .fj-depts-tree .el-tree-node__content {height:54px;border-bottom:1px solid #E8E8E8;}
.fj-content_view.zzjg .fj-depts-tree .el-tree-node__children .el-tree-node__content {height:40px;border-bottom:none;}
/* .fj-content_view.zzjg .fj-depts-tree .el-tree-node__children .el-tree-node__content:hover {background-color:#1890FF;color:#fff;} */
.fj-content_view.zzjg .fj-depts-tree  .tree-item-info {flex:1 0 auto;display:inline-flex;flex-flow:row nowrap;justify-content:space-between;align-items:center;padding-right:12px;}
.fj-content_view.zzjg .fj-depts-tree  .tree-item-info > span {flex:1 0 auto;max-width:128px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.fj-content_view.zzjg .fj-depts-tree  .tree-item-info > span.all {cursor:pointer}
.fj-content_view.zzjg .fj-depts-tree  .tree-item-info i[class^="el-icon"] {margin:0 2px;cursor:pointer;}
.fj-content_view.zzjg .fj-depts-tree  .tree-item-info i[class^="el-icon"]:hover {color:#1890FF;}
/*  */
.fj-content_view.zzjg .el-tree,.fj-content_view.zzjg .el-tree__empty-text {color:rgba(0,0,0,.65);}
.fj-content_view.zzjg .fj-depts-tree > .depts-tree-main {display:flex;flex-flow:row nowrap;height:60px;line-height:58px;padding-left:24px;border-bottom:1px solid #E8E8E8;}
.fj-content_view.zzjg .fj-depts-tree > .depts-tree-main > .title {margin-right:12px;color:rgba(0,0,0,1);cursor:pointer;}
/*  */
.fj-content_view.zzjg .fj-depts-info {flex:1 0 auto;max-width:calc(100% - 250px);padding:20px 0px 0px 20px;}
.fj-content_view.zzjg .depts-basic-info {padding:20px 0px 23px;font-size:16px;}
.fj-content_view.zzjg .depts-basic-info > .dept {margin-right:30px;color:rgba(0,0,0,1);}
.fj-content_view.zzjg .depts-basic-info > .count {margin-right:30px;}
/*  */
.fj-content_view.zzjg .depts-btn-area > .el-button {padding:8px 20px;}
/*  */
.fj-content_view.zzjg .depts-select-info {height:40px;line-height:40px;margin-top:16px;padding-left:16px;background:#E6F7FF;border:1px solid #BAE7FF;}
.fj-content_view.zzjg .depts-select-info > .el-icon-info {margin-right:3px;color:#1890FF;}
.fj-content_view.zzjg .depts-select-info > span {margin-right:10px;}
.fj-content_view.zzjg .depts-select-info > .selected > span {padding:0px 4px;}
.fj-content_view.zzjg .depts-select-info > .count > span {padding-right:2px;}
.fj-content_view.zzjg .depts-select-info > .selected > span,.fj-content_view.zzjg .depts-select-info > .clear {color:#1890FF;}
.fj-content_view.zzjg .depts-select-info > .clear {cursor:pointer;}
/*  */
.fj-content_view.zzjg .el-dialog {width:80%;max-width:80%;}
.fj-content_view.zzjg .el-dialog__body {padding:0px 20px;color:rgba(0,0,0,.65);}
.fj-content_view.zzjg .el-dialog__body .fj-block-head {height:38px;padding-left:0px;margin-bottom:14px;}
.fj-content_view.zzjg .el-dialog__body .fj-block-head > .title {line-height:36px;font-size:14px;}
.fj-content_view.zzjg #userPop .el-dialog__body .fj-block-head > .details > .el-button {margin-top:0px;margin-left:10px;}
.fj-content_view.zzjg .el-dialog__body .fj-block-body {padding-top:16px;}
.fj-content_view.zzjg .el-dialog__body .el-form-item {margin-bottom:10px;}
.fj-content_view.zzjg .el-dialog__body .el-form-item__label {width:100px;color:rgba(0,0,0,.65);}
.fj-content_view.zzjg .el-dialog__body  .el-form-item__error {padding-top:0px;left:119px;}
.fj-content_view.zzjg .el-dialog__body .el-input {width:190px;}
.fj-content_view.zzjg .el-dialog__body .el-textarea {width:536px;}
.fj-content_view.zzjg .el-dialog__body .el-textarea .el-textarea__inner {resize:none;}
.fj-content_view.zzjg .el-dialog__body .el-form .userPopHeadImg {position:absolute;top:72px;right:142px;width:134px;height:134px;text-align:center;z-index:8;}
.fj-content_view.zzjg .el-dialog__body .el-form .userPopHeadImg:after {content:'';display:inline-block;width:0;height:100%;vertical-align:middle;}
.fj-content_view.zzjg .el-dialog__body .el-form .userPopHeadImg > img {max-width:90%;max-height:90%;vertical-align:middle;}
/*  */
.fj-content_view.zzjg #DeptPop .el-input.is-disabled.SJdept {width:66px;}
.fj-content_view.zzjg #DeptPop .el-input.is-FL,.fj-content_view.zzjg #DeptPop .el-input.is-SL {width:120px;}
.fj-content_view.zzjg #DeptPop .el-input.is-FL .el-input__inner,.fj-content_view.zzjg #DeptPop .el-input.is-SL .el-input__inner {padding-right:0px;}
.fj-content_view.zzjg #DeptPop .el-form-item__label {width:120px;}
.fj-content_view.zzjg #DeptPop #deptMap {height:380px;margin-top:4px;}
.fj-content_view.zzjg #DeptPop .el-dialog__footer {padding:20px 20px;}
.fj-content_view.zzjg .el-table td .ope-txt:last-of-type {display:block;margin-left:0px;}
/*  */
@media screen and (min-width:1367px) {
    .fj-content_view.zzjg .el-dialog {width:1080px;max-width:1080px;}
    .fj-content_view.zzjg .el-table td .ope-txt:last-of-type {display:inline;margin-left:6px;}
}
</style>
