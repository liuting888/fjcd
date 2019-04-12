<template>
    <div class="fj-content_view grkh-list">
        <div class="fj-block title">
            <fj-breadNav :bread-data="breadData"></fj-breadNav>
        </div>
        <div class="fj-block content">
            <div class="fj-block-head kaohe">
				<p class="title fj-fl">条件筛选</p>
			</div>
            <div class="fj-block-body">
                <ul class="filterOpe-area">
                    <li class="area-line fj-clear">
                        <div class="item fj-fl">
                            <span class="fj-fl title">类型：</span>
                            <el-select class="fj-fl" v-model="DLtype" @change="getListDataByDLtype" clearable  placeholder="请选择加减分类型">
                                <el-option v-for="item in typesData" :key="item.type" :label="item.typeName" :value="item.type"></el-option>
                            </el-select>
                        </div>
                        <div class="item fj-fl">
                            <span class="fj-fl title">审核状态：</span>
                            <el-select class="fj-fl" v-model="DLstatus" @change="getListDataByDLstatus" clearable  placeholder="请选择审核状态">
                                <el-option v-for="item in statusData" :key="item.status" :label="item.statusName" :value="item.status"></el-option>
                            </el-select>
                        </div>
                        <div class="item no-mr fj-fl">
                            <span class="fj-fl title">起止日期：</span>
                            <el-date-picker class="fj-fl"
                                v-model="DLSEtime"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                @change="getListDataBySEtime">
                            </el-date-picker>
                        </div>
                    </li>
                    <li class="area-line fj-clear">
                        <div class="item fj-fl">
                            <span class="fj-fl title">单位筛选：</span>
                            <el-select class="fj-fl" :disabled="isFJrole" v-model="DLFenjvId" @change="getPCSdataById" clearable  placeholder="请选择区县分局">
                                <el-option v-for="item in FLdeptsData" :key="item.deptId" :label="item.deptName" :value="item.deptId"></el-option>
                            </el-select>
                            <el-select class="fj-fl" :disabled="isPCSrole" v-model="DLPcsId" @change="getListDataByDLPcsId" clearable  placeholder="请选择派出所">
                                <el-option v-for="item in SLdeptsData" :key="item.deptId" :label="item.deptName" :value="item.deptId"></el-option>
                            </el-select>
                        </div>
                        <div class="item fj-fl">
                          <span class="fj-fl title">输入查询：</span>
                          <el-input v-model="DLuserName" class="fj-fl search" suffix-icon="el-icon-search" @input="getListDataByDLuserName" @clear="getListDataByDLuserName" clearable placeholder="请输入员工姓名"></el-input>
                        </div>
                        <div class="item fj-fl">
                            <el-button class="fj-fl" type="success" @click="openMultipleKHpass"><!-- <i class="el-icon-edit"></i> --><span>批量通过</span></el-button>
                            <el-button class="fj-fl" type="danger" @click="openMultipleKHRefuse"><!-- <i class="el-icon-edit"></i> --><span>批量拒绝</span></el-button>
                        </div>
                    </li>
                </ul>
                <el-table :data="dListData" ref="multipleTable" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="35"></el-table-column>
                    <el-table-column prop="userName" label="姓名"></el-table-column>
                    <el-table-column prop="deptName" class-name="align-left" label="单位" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="regulation" class-name="align-left" label="规则描述" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="typeName" label="类型"></el-table-column>
                    <el-table-column prop="score" label="分值"></el-table-column>
                    <el-table-column prop="statusName" label="审核状态"></el-table-column>
                    <el-table-column prop="insertTime" label="添加时间"></el-table-column>
                    <el-table-column prop="checkUserName" label="审核人"></el-table-column>
                    <!-- <el-table-column prop="deptName" label="审核单位" show-overflow-tooltip></el-table-column> -->
                    <el-table-column prop="checkTime" label="审核时间"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="slot">
                            <span class="ope-txt" v-show="slot.row.status==0" @click="operateKH(slot.row,1)">通过</span>
                            <span class="ope-txt" v-show="slot.row.status==0" @click="operateKH(slot.row,2)">拒绝</span>
                            <span class="ope-txt" v-show="slot.row.status!=0" @click="showKHDetailPop(slot.row)">详情</span>
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
                    >
                    </el-pagination>
                </div>
            </div>
        </div>
        <!-- 查看明细 -->
        <el-dialog
            id="KHDetailPop"
            :visible.sync="KHDetailPop"
            title="查看审核详情"
            :modal-append-to-body = "KHDetailPopModal"
            :close-on-click-modal="KHDetailPopModal"
        >
            <div class="fj-block">
                <el-form class="KHDetailForm" :model="KHDetailFormData">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="人员姓名">
                                <el-input v-model="KHDetailFormData.userName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="人员编号">
                                <el-input v-model="KHDetailFormData.userId" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="单位名称">
                                <el-input v-model="KHDetailFormData.deptName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="单位编号">
                                <el-input v-model="KHDetailFormData.deptId" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="审核类型">
                                <el-input v-model="KHDetailFormData.typeName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="审核分值">
                                <el-input v-model="KHDetailFormData.score" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="审核状态">
                                <el-input v-model="KHDetailFormData.statusName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="审核人姓名">
                                <el-input v-model="KHDetailFormData.checkUserName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="审核时间">
                                <el-input v-model="KHDetailFormData.checkTime" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="审核规则">
                                <el-input type="textarea" v-model="KHDetailFormData.regulation" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="审核备注">
                                <el-input type="textarea" v-model="KHDetailFormData.remark" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div slot="footer" style="text-align:center;" >
                <el-button type="primary" @click="closeKHDetailPop">关 闭</el-button>
            </div>
        </el-dialog>
        <!-- 通过或拒绝，填写审核意见 -->
        <el-dialog
            id="KHPRPop"
            :visible.sync="KHPRPop"
            title="填写审核意见"
            :modal-append-to-body = "KHPRPopModal"
            :close-on-click-modal="KHPRPopModal"
        >
            <div class="fj-block">
                <el-form>
                    <el-form-item label="审核意见">
                        <el-input type="textarea" v-model="KHPRreason" placeholder="请填写审核意见"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" style="text-align:center;" >
                <el-button @click="cancelKH">取 消</el-button>
                <el-button type="primary" @click="confirmKH">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import fjBreadNav from '@/components/fjBreadNav';
export default {
    name:'fjGerenkaoheList',
    data:function(){
        return {
            breadData:[ //面包屑导航
                {name:'当前位置:',path:''},
                {name:'考核管理',path:''},
                {name:'个人考核',path:'/personal-assessment'},
                {name:'加分审核列表',path:''}
            ],
            statusData:[ //状态数据
                {status:0,statusName:'未审核'},
                {status:1,statusName:'已通过'},
                {status:2,statusName:'已拒绝'}
            ],
            typesData:[ //类型数据
                {type:1,typeName:'加分'},
                {type:2,typeName:'减分'}
            ],
            FLdeptsData:[], //区县分局数据
            DLFenjvId:'',   //区县分局部门id
            SLdeptsData:[], //派出所数据
            DLPcsId:'',     //派出所部门id
            dListData:[], //列表数据
            total:0, //分页总数
            currentPage:1, //页码
            pageSize:10,    //每页条数
            DLSEtime:'',  //起止时间
            DLstartTime:'', //开始时间
            DLendTime:'',   //结束时间，格式：2018-12-21
            DLdeptId:'',    //单位编号
            DLuserName:'',    //人员名称
            DLtype:'',      //加减分，1（加分），2（减分）
            DLstatus:'',     //状态，1（通过），2（拒绝）
            KHDetailPop:false, //查看明细弹层
            KHDetailPopModal:false, //
            KHDetailFormData:{},  //考核明细弹层数据
            KHPRPop:false,  //通过或拒绝的弹层
            KHPRPopModal:false,
            opeType:'',  //通过或拒绝
            KHPRreason:'',  //审核意见
            KHid:'',  //考核id
            KHPRtype:'', //单个或者批量
            selectedUsers:[],  //批量操作的人员
            isFJrole:false,
            isPCSrole:false,
            getDataByUserRole:{ //获取数据的时候
                [fjPublic.userRoles.pcs]:function(){
                    this.DLPcsId = this.userInfo.deptId; //设置当前派出所id
                },
                [fjPublic.userRoles.qj]:function(){
                    this.DLPcsId = this.userInfo.deptId.substr(0,6)+'010000'; //设置当前派出所id
                },
                [fjPublic.userRoles.sj]:function(){},
                [fjPublic.userRoles.cg]:function(){}
            },
            isEmptyPCSid:{  //清空派出所id的时候
                [fjPublic.userRoles.pcs]:function(){},
                [fjPublic.userRoles.qj]:function(){
                    if(!this.DLPcsId){
                        this.DLPcsId = this.userInfo.deptId.substr(0,6)+'010000'; //设置当前派出所id
                    }
                },
                [fjPublic.userRoles.sj]:function(){},
                [fjPublic.userRoles.cg]:function(){}
            },
            userRoleControl:{ //权限控制
                [fjPublic.userRoles.pcs]:function(){ //派出所
                    this.isFJrole = true; //下拉框禁用
                    this.isPCSrole = true;
                    //设置分局id
                    var tmpObj = _.find(this.FLdeptsData,function(item){
                        return this.userInfo.deptId.slice(0,6)==item.deptId.slice(0,6);
                    },this);
                    this.DLFenjvId = tmpObj.deptId;
                    //获取对应派出所信息
                    $.when(this.getPCSdataById(this.DLFenjvId)).then(_.bind(function(){
                        this.DLPcsId = this.userInfo.deptId;
                    },this),_.bind(function(){
                        this.$message({type:'warning',message:'获取派出所数据失败'});
                    },this));
                },
                [fjPublic.userRoles.qj]:function(){ //区级
                    this.isFJrole = true; //下拉框禁用
                    //设置分局id
                    this.DLFenjvId = this.userInfo.deptId;
                    //获取对应派出所信息
                    $.when(this.getPCSdataById(this.DLFenjvId)).then(_.bind(function(){
                        this.DLPcsId = this.SLdeptsData[0].deptId; //默认显示第一个派出所的数据
                    },this),_.bind(function(){
                        this.$message({type:'warning',message:'获取'+this.userInfo.deptName+'下的派出所数据失败'});
                    },this));
                },
                [fjPublic.userRoles.sj]:function(){},
                [fjPublic.userRoles.cg]:function(){}
            }
        };
    },
    created:function(){
        //获取当前登录的用户信息
        this.userInfo = $.parseJSON(fjPublic.getLocalData('userInfo'));
        this.getDataByUserRole[this.userInfo.userRole].call(this);
    },
    mounted:function(){
        $.when(this.requestDatas()).then(_.bind(function(){
            //
            this.userRoleControl[this.userInfo.userRole].call(this);
        },this));
    },
    beforeRouteEnter:function(to,from,next){
        next(function(vm){

        });
    },
    methods:{
        openMultipleKHpass:function(){ //批量通过
            if(!this.selectedUsers||!this.selectedUsers.length){
                this.$message({type:'warning',message:'请选择要进行批量通过的人员！'});
                return;
            }
            this.KHPRtype = 'multiple';
            this.opeType = 1;
            this.KHPRPop = true;
        },
        openMultipleKHRefuse:function(){ //批量拒绝
            if(!this.selectedUsers||!this.selectedUsers.length){
                this.$message({type:'warning',message:'请选择要进行批量拒绝的人员！'});
                return;
            }
            this.KHPRtype = 'multiple';
            this.opeType = 2;
            this.KHPRPop = true;
        },
        clearUsersSelection:function(){ //取消选择批量编辑的人员
            this.$refs['multipleTable'].clearSelection();
        },
        handleSelectionChange:function(arr){ //批量操作
            console.log(arr);
            this.selectedUsers = null;
            this.selectedUsers = arr;
        },
        operateKH:function(info,oType){
            var vm = this;
            this.opeType = oType;
            this.KHid = info.id;
            this.KHPRPop = true;
        },
        confirmKH:function(){
            if(!this.KHPRreason){
                this.$message({type:'warning',message:'请填写审核意见！'});
                return;
            }
            var notice = this.opeType==1?'通过':'拒绝';
            var isMultiple = '';
            var vm = this;
            switch(this.KHPRtype){
                case 'single':
                    break;
                case 'multiple':
                    this.KHid = _.pluck(this.selectedUsers,'id').join(',');
                    isMultiple = '批量';
                    break;
            }
            fjPublic.openLoad('正在提交...');
            $.ajax({
                url:fjPublic.ajaxUrlDNN + '/updateCustomScoreApply',
                type:'POST',
                data:{
                    nowUser:$.cookie(fjPublic.loginCookieKey),
                    type:vm.opeType, //1（通过），2（拒绝）
                    auditOpinion:vm.KHPRreason, //审核意见
                    id:vm.KHid  //考核记录编号
                },
                dataType:'json',
                success:function(data){
                    //console.log(data);
                    fjPublic.closeLoad();
                    if(data.errorCode==0){
                        vm.$message({type:'success',message:isMultiple+'审核'+notice+'提交成功！'});
                        //
                        vm.cancelKH();
                        //刷新列表
                        vm.getListDataByArgs();
                    }else{
                        vm.$message({type:'warning',message:isMultiple+'审核'+notice+'提交失败！'});
                    }
                },
                error:function(err){
                    vm.$message({type:'warning',message:isMultiple+'审核'+notice+'提交失败！'});
                }
            });
        },
        cancelKH:function(){
            this.KHid = '';
            this.KHPRreason = '';
            this.KHPRtype = '';
            this.opeType = '';
            this.KHPRPop = false;
        },
        showKHDetailPop:function(info){ //显示查看明细的弹层
            _.each(info,function(v,k){
                this.$set(this.KHDetailFormData,k,v);
            },this);
            //
            this.KHDetailPop = true;
        },
        closeKHDetailPop:function(){ //关闭查看明细的弹层
            _.each(this.KHDetailFormData,function(v,k){
                this.$set(this.KHDetailFormData,k,'');
            },this);
            this.KHDetailPop = false;
        },
        getDepListBySearch:function(){ //获取区县分局数据--联动选择用
            var defer = $.Deferred();
			var vm = this;
			$.ajax({
				url:fjPublic.ajaxUrlDNN + '/searchDepListBySearch',
				type:'POST',
				data:{},
				dataType:'json',
				success:function(data){
                    //console.log(data);
					vm.FLdeptsData =  _.filter(data.list,function(item){
                        return item.deptId!='411342000000'&&item.deptId!='430500000000';
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
            if(!id){ //清空的时候，清除对应派出所数据
                this.DLPcsId = '';
                this.SLdeptsData.splice(0,this.SLdeptsData.length);
                this.getListDataByArgs();
                return;
            }
            fjPublic.openLoad('部门切换中...');
            this.DLPcsId = '';
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
                    fjPublic.closeLoad();
                    //console.log(data);
                    vm.SLdeptsData = null;
					vm.SLdeptsData = data.list;
					defer.resolve();
				},
				error:function(err){
                    fjPublic.closeLoad();
					defer.reject();
				}
			});
			return defer;
        },
        getListDataByDLtype:function(){ //根据加减分类型获取列表数据
            this.getListDataByArgs();
        },
        getListDataByDLstatus:function(){ //根据审核状态获取列表数据
            this.getListDataByArgs();
        },
        getListDataBySEtime:function(dateArr){ //根据开始结束时间获取列表数据
            if(dateArr){
                this.DLstartTime = fjPublic.dateFormatYYMMDD(dateArr[0]);  //获取开始时间
                this.DLendTime = fjPublic.dateFormatYYMMDD(dateArr[1]);    //获取结束时间
            }else{
                this.DLstartTime = '';
                this.DLendTime = '';
            }
            fjPublic.openLoad('数据加载中...');
            $.when(this.getPersonAppraiseScoreList()).then(_.bind(function(){
                fjPublic.closeLoad();
            },this),_.bind(function(){
                fjPublic.closeLoad();
                this.$message({type:'warning',message:'请求数据失败！！！'});
            },this));
        },
        getListDataByDLuserName:_.debounce(function(){  //根据人员姓名获取列表数据
            this.getListDataByArgs();
        },200),
        getListDataByDLPcsId:function(){ //根据派出所id获取列表数据
            //角色为区级时，清空派出所id时，默认设置成分局下第一个派出所id
            this.isEmptyPCSid[this.userInfo.userRole].call(this);
            this.getListDataByArgs();
        },
        getListDataByArgs:function(){
            fjPublic.openLoad('数据加载中...');
            $.when(this.getPersonAppraiseScoreList()).then(_.bind(function(){
                fjPublic.closeLoad();
            },this),_.bind(function(){
                fjPublic.closeLoad();
                this.$message({type:'warning',message:'请求数据失败！！！'});
            },this));
        },
        getPersonAppraiseScoreList:function(){  //获取明细列表数据
            var defer = $.Deferred();
			var vm = this;
			$.ajax({
				url:fjPublic.ajaxUrlDNN + '/getPersonAppraiseScoreList',
				type:'POST',
				data:{
                    page:this.currentPage,
                    rows:this.pageSize,
                    startTime:this.DLstartTime,
                    endTime:this.DLendTime,
                    deptId:this.DLPcsId,
                    userName:this.DLuserName,
                    type:this.DLtype,
                    status:this.DLstatus
                },
				dataType:'json',
				success:function(data){
                    //console.log(data);
                    //
                    vm.total = data.total;
                    vm.dListData = null;
                    vm.dListData = data.list;
                    //修改状态和类型字段
                    _.each(vm.dListData,function(item){
                        var tmpObj = _.find(vm.statusData,function(item2){
                            return item2.status == item.status;
                        });
                        var tmpObj2 = _.find(vm.typesData,function(item3){
                            return item3.type == item.type;
                        });
                        vm.$set(item,'statusName',tmpObj.statusName);
                        vm.$set(item,'typeName',tmpObj2.typeName);
                    });
					defer.resolve();
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
        },
        requestDatas:function(){ //向后台请求数据
            var tmpReqFns = [this.getDepListBySearch,this.getPersonAppraiseScoreList];
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
        },
        currentPageChange:function(pageNum){  //点击某个分页按钮
        // pageNum  当前的页码值
            this.currentPage = pageNum;
            this.getListDataByArgs();
        },
        prevPageChange:function(pageNum){  //点击分页的上一页
        // pageNum  当前页--后的值
            this.currentPage = pageNum;
            this.getListDataByArgs();
        },
        nextPageChange:function(pageNum){  //点击分页的下一页
        // pageNum  当前页++后的值
            this.currentPage = pageNum;
            this.getListDataByArgs();
        },
        sizePageChange:function(pageSize){  //改变每页条数时
        // pageSize 每页条数
        }
    },
    watch:{

    },
    components:{
        fjBreadNav
    }
}
</script>
<style>
.fj-content_view.grkh-list .fj-block-body > .filterOpe-area .item {margin-right:10px;}
.fj-content_view.grkh-list .fj-block-body > .filterOpe-area .item .el-select,
.fj-content_view.grkh-list .fj-block-body > .filterOpe-area .item .el-select > .el-input,
.fj-content_view.grkh-list .fj-block-body > .filterOpe-area .item .el-input {width:200px;}
.fj-content_view.grkh-list .fj-block-body > .filterOpe-area .item .el-select + .el-select {margin-left:10px;}
/* 弹层 */
.fj-content_view.grkh-list .el-dialog {width:76%;}
.fj-content_view.grkh-list #KHPRPop .el-dialog {width:50%;}
.fj-content_view.grkh-list .el-dialog .el-form-item__label {width:82px;}
.fj-content_view.grkh-list #KHPRPop .el-dialog .el-form-item__label {width:auto;}
.fj-content_view.grkh-list .el-dialog .el-row:last-of-type .el-form-item {margin-bottom:10px;}
.fj-content_view.grkh-list .el-dialog .el-textarea {width:405px;}
.fj-content_view.grkh-list #KHPRPop .el-dialog .el-textarea {width:505px;}
.fj-content_view.grkh-list .el-dialog .el-textarea .el-textarea__inner {height:76px;}
.fj-content_view.grkh-list #KHPRPop .el-dialog .el-textarea .el-textarea__inner {height:98px;}
/*  */
@media screen and (min-width:1367px) {
    /*  */
    .fj-content_view.grkh-list .el-dialog {width:1040px;}
    .fj-content_view.grkh-list #KHPRPop .el-dialog {width:683px;}
    /*  */
    .fj-content_view.grkh-list .fj-block-body > .filterOpe-area .item {margin-right:20px;}
    .fj-content_view.grkh-list .fj-block-body > .filterOpe-area .item .el-select,
    .fj-content_view.grkh-list .fj-block-body > .filterOpe-area .item .el-select > .el-input,
    .fj-content_view.grkh-list .fj-block-body > .filterOpe-area .item .el-input {width:220px;}
    .fj-content_view.grkh-list .fj-block-body > .filterOpe-area .item .el-select + .el-select {margin-left:20px;}
}
</style>


