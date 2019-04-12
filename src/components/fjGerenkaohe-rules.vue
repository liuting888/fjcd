<template>
    <div class="fj-content_view grkh-rules">
        <div class="fj-block title">
            <fj-breadNav :bread-data="breadData"></fj-breadNav>
        </div>
        <div class="fj-block content">
            <div class="fj-block-head kaohe">
				<p class="title fj-fl">规则列表</p>
			</div>
            <div class="fj-block-body">
                <!-- <p class="add-rule">
                    <i class="el-icon-circle-plus"></i><span>添加规则</span>
                </p> -->
                <ul class="filterOpe-area">
                    <li class="area-line fj-clear">
                        <div class="item fj-fl">
                            <span class="fj-fl title">单位筛选：</span>
                            <el-select class="fj-fl" :disabled="isFJrole" v-model="RFenjvId" @change="getPCSdataById" clearable  placeholder="请选择区县分局">
                                <el-option v-for="item in FLdeptsData" :key="item.deptId" :label="item.deptName" :value="item.deptId"></el-option>
                            </el-select>
                            <el-select class="fj-fl" :disabled="isPCSrole" v-model="RPcsId" @change="getRulesDataByPcsId" clearable  placeholder="请选择派出所">
                                <el-option v-for="item in SLdeptsData" :key="item.deptId" :label="item.deptName" :value="item.deptId"></el-option>
                            </el-select>
                        </div>
                        <div class="item fj-fl">
                            <span class="fj-fl title">关键字：</span>
                            <el-input class="fj-fl search" v-model="userNameOrDes" suffix-icon="el-icon-search" placeholder="请输入添加人姓名" clearable @clear="getRulesDataByNR"></el-input>
                        </div>
                        <div class="item fj-fl">
                            <el-button class="fj-fl" type="primary" @click="getRulesDataByNR"><i class="el-icon-search"></i><span>查询</span></el-button>
                            <el-button class="fj-fl" type="primary" @click="addRules"><i class="el-icon-circle-plus"></i><span>添加规则</span></el-button>
                        </div>
                    </li>
                </ul>
                <el-table :data="rulesData">
                    <el-table-column prop="id" label="编号"></el-table-column>
                    <el-table-column prop="scoreDes" class-name="align-left" label="规则描述"></el-table-column>
                    <!-- <el-table-column prop="pfwd" label="评分维度"></el-table-column> -->
                    <el-table-column prop="typeName" label="类型"></el-table-column>
                    <el-table-column prop="scoreVal" label="分值"></el-table-column>
                    <el-table-column prop="deptName" class-name="align-left" label="添加单位" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="addUserName" label="添加人"></el-table-column>
                    <el-table-column prop="insertTime" label="添加时间">
                        <template slot-scope="slot">
                           {{dateStrFormat(slot.row.insertTime) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="slot">
                            <span class="ope-txt" @click="modifyRules(slot.row)">编辑</span>
                            <span class="ope-txt" @click="deleteRules(slot.row)">删除</span>
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
                    >
                    </el-pagination>
                </div>
            </div>
        </div>
        <!-- 添加、编辑规则 -->
        <el-dialog
            id="rulesPop"
            :title="rulesPopTitle"
            :visible.sync="rulesPop"
            :modal-append-to-body = "rulesPopModal"
            width="500px"
            :close-on-click-modal="rulesPopModal">
            <div class="fj-block">
                <div class="fj-block-body">
                    <el-form :model="rulesPopData" :rules="popDataRules" ref="rulesPopForm">
                        <el-row>
                            <el-col :span="24">
                                <el-form-item prop="score" label="加分分值"> 
                                    <el-input-number v-model="rulesPopData.score" :precision="1" :step="0.5" :min="0" :max="10"></el-input-number>
                                    <el-tooltip class="item" effect="dark" content="每次加分操作最少0.5分，不能大于10分！" placement="right">
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item prop="scoreDes" label="规则描述">
                                    <el-input type="textarea" v-model="rulesPopData.scoreDes" placeholder="请输入规则描述"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
			</div>
            <div slot="footer" style="text-align:center;" >
                <el-button @click="cancelRulesPop">取 消</el-button>
                <el-button type="primary" @click="confirmOpeRules">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
//
import fjBreadNav from '@/components/fjBreadNav'; 
export default {
    name:'fjGerenkaoheRules',
    data:function(){
        return {
            breadData:[
                {name:'当前位置:',path:''},
                {name:'考核管理',path:''},
                {name:'个人考核',path:'/personal-assessment'},
                {name:'考核规则',path:''}
            ],
            typesData:[
                {type:1,typeName:'加分'},
                {type:2,typeName:'减分'}
            ],
            rulesData:[],
            total:0,
            currentPage:1,
            pageSize:10,
            userNameOrDes:'',
            RFenjvId:'',
            RPcsId:'',
            FLdeptsData:[],
            SLdeptsData:[],
            rulesPopTitle:'', //弹窗标题
            rulesPop:false,
            rulesPopModal:false,
            rulesPopData:{  //弹窗的数据
                score:'', //分值
                scoreDes:'' //分值描述
            },
            popDataRules:{
                score:[{validator:function(rule,value,callback){
                    if(value==0){
                        callback(new Error('加分值不能为0'));
                    }else{
                        callback();
                    }
                },required:true,trigger:'change'}],
                scoreDes:[{required:true,message:'请输入分值描述',trigger:'change'}]
            },
            opeRulesType:'', //添加或编辑
            isFJrole:false,
            isPCSrole:false,
            getDataByUserRole:{ //获取数据的时候
                [fjPublic.userRoles.pcs]:function(){
                    this.RPcsId = this.userInfo.deptId; //设置当前派出所id
                },
                [fjPublic.userRoles.qj]:function(){
                    this.RPcsId = this.userInfo.deptId.substr(0,6)+'010000'; //设置当前派出所id
                },
                [fjPublic.userRoles.sj]:function(){},
                [fjPublic.userRoles.cg]:function(){}
            },
            isEmptyPCSid:{  //清空派出所id的时候
                [fjPublic.userRoles.pcs]:function(){},
                [fjPublic.userRoles.qj]:function(){
                    if(!this.RPcsId){
                        this.RPcsId = this.userInfo.deptId.substr(0,6)+'010000'; //设置当前派出所id
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
                    this.RFenjvId = tmpObj.deptId;
                    //获取对应派出所信息
                    $.when(this.getPCSdataById(this.RFenjvId)).then(_.bind(function(){
                        this.RPcsId = this.userInfo.deptId;
                    },this),_.bind(function(){
                        this.$message({type:'warning',message:'获取派出所数据失败'});
                    },this));
                },
                [fjPublic.userRoles.qj]:function(){ //区级
                    this.isFJrole = true; //下拉框禁用
                    //设置分局id
                    this.RFenjvId = this.userInfo.deptId;
                    //获取对应派出所信息
                    $.when(this.getPCSdataById(this.RFenjvId)).then(_.bind(function(){
                        this.RPcsId = this.SLdeptsData[0].deptId; //默认显示第一个派出所的数据
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
        //console.log(this.userInfo);
        /* this.$set(this.userInfo,'userRole',[fjPublic.userRoles.qj]);
        this.$set(this.userInfo,'deptName','板桥派出所');
        this.$set(this.userInfo,'deptId','430501000000'); */
        this.getDataByUserRole[this.userInfo.userRole].call(this);
    },
    mounted:function(){
        $.when(this.requestDatas()).then(_.bind(function(){
            this.userRoleControl[this.userInfo.userRole].call(this);
            //调整表格样式
        },this));
    },
    beforeRouteEnter:function(to,from,next){
        next(function(vm){});
    },
    methods:{
        deleteRules:function(info){
            var vm = this;
            this.$confirm('此操作将删除该条考核规则, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {   
                fjPublic.openLoad('提交中...');
                $.Deferred(function(defer){
                    $.ajax({
                        url:fjPublic.ajaxUrlDNN + '/deleteCustomScore',
                        type:'POST',
                        data:{
                            nowUser:$.cookie(fjPublic.loginCookieKey),
                            id:info.id
                        },
                        dataType:'json',
                        success:function(data){
                            //console.log(data);
                            if(data.errorCode==0){
                                defer.resolve();
                            }else{
                                fjPublic.closeLoad();
                                vm.$message({type:'warning',message:'删除规则失败！！！'});
                            }
                        },
                        error:function(err){
                            defer.reject();
                        }
                    });
                }).promise().then(function(){
                    fjPublic.closeLoad();
                    vm.$message({type:'warning',message:'删除规则成功！！！'});
                    //
                    vm.cancelRulesPop();
                    vm.getRulesDataByArgs() //刷新列表
                },function(){
                    fjPublic.closeLoad();
                    vm.$message({type:'warning',message:'删除规则失败！！！'});
                });
            }).catch(()=>{});
        },
        modifyRules:function(info){ //编辑规则
            _.each(info,function(v,k){
                this.$set(this.rulesPopData,k,v);
            },this);
            this.rulesPopTitle = '编辑规则';
            this.opeRulesType = 'modify';
            this.rulesPop = true;
        },
        confirmOpeRules:function(){ //添加或编辑规则
            var validateBool;
            this.$refs['rulesPopForm'].validate(function(value){
                if(value){
                    validateBool = true;
                }
            });
            if(!validateBool)return;
            fjPublic.openLoad('提交中...');
            var vm = this;
            switch(this.opeRulesType){
                case 'add':
                    $.Deferred(function(defer){
                        $.ajax({
                            url:fjPublic.ajaxUrlDNN + '/saveCustomScore',
                            type:'POST',
                            data:{
                                nowUser:$.cookie(fjPublic.loginCookieKey),
                                score:vm.rulesPopData.score,
                                scoreDes:vm.rulesPopData.scoreDes
                            },
                            dataType:'json',
                            success:function(data){
                                //console.log(data);
                                if(data.errorCode==0){
                                    defer.resolve();
                                }else{
                                    fjPublic.closeLoad();
                                    vm.$message({type:'warning',message:'添加规则失败！！！'});
                                }
                            },
                            error:function(err){
                                defer.reject();
                            }
                        });
                    }).promise().then(function(){
                        fjPublic.closeLoad();
                        vm.$message({type:'warning',message:'添加规则成功！！！'});
                        //
                        vm.cancelRulesPop();
                        vm.getRulesDataByArgs() //刷新列表
                    },function(){
                        fjPublic.closeLoad();
                        vm.$message({type:'warning',message:'添加规则失败！！！'});
                    });
                    break;
                case 'modify':
                    $.Deferred(function(defer){
                        $.ajax({
                            url:fjPublic.ajaxUrlDNN + '/updateCustomScore',
                            type:'POST',
                            data:{
                                nowUser:$.cookie(fjPublic.loginCookieKey),
                                score:vm.rulesPopData.score,
                                scoreDes:vm.rulesPopData.scoreDes,
                                id:vm.rulesPopData.id
                            },
                            dataType:'json',
                            success:function(data){
                                //console.log(data);
                                if(data.errorCode==0){
                                    defer.resolve();
                                }else{
                                    fjPublic.closeLoad();
                                    vm.$message({type:'warning',message:'编辑规则失败！！！'});
                                }
                            },
                            error:function(err){
                                defer.reject();
                            }
                        });
                    }).promise().then(function(){
                        fjPublic.closeLoad();
                        vm.$message({type:'warning',message:'编辑规则成功！！！'});
                        //
                        vm.cancelRulesPop();
                        vm.getRulesDataByArgs() //刷新列表
                    },function(){
                        fjPublic.closeLoad();
                        vm.$message({type:'warning',message:'编辑规则失败！！！'});
                    });
                    break;
            }
        },
        cancelRulesPop:function(){
            this.$refs['rulesPopForm'].resetFields();
            _.each(this.rulesPopData,function(v,k){
                this.$set(this.rulesPopData,k,'');
            },this);
            this.opeRulesType = '';
            this.rulesPop = false;
        },
        addRules:function(){ //添加规则
            this.rulesPopTitle = '添加规则';
            this.opeRulesType = 'add';
            this.rulesPop = true;
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
                    vm.FLdeptsData = null;
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
                this.RPcsId = '';
                this.SLdeptsData.splice(0,this.SLdeptsData.length);
                this.getRulesDataByArgs();
                return;
            }
            fjPublic.openLoad('部门切换中...');
            this.RPcsId = '';
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
        getRulesDataByPcsId:function(){
            this.isEmptyPCSid[this.userInfo.userRole].call(this);
            this.getRulesDataByArgs();
        },
        getRulesDataByNR:function(){
            this.getRulesDataByArgs();
        },
        getRulesDataByArgs:function(){
            fjPublic.openLoad('数据加载中...');
            $.when(this.getRulesData()).then(_.bind(function(){
                fjPublic.closeLoad();
            },this),_.bind(function(){
                fjPublic.closeLoad();
                this.$message({type:'warning',message:'请求数据失败！！！'});
            },this));
        },
        getRulesData:function(){ //获取规则列表数据
            var defer = $.Deferred();
			var vm = this;
			$.ajax({  
				url:fjPublic.ajaxUrlDNN + '/getCustomScores',
				type:'POST',
				data:{
                    nowUser:$.cookie(fjPublic.loginCookieKey), 
                    page:this.currentPage,
                    rows:this.pageSize,
                    deptId:this.RPcsId,
                    userNameOrDes:this.userNameOrDes
                },
				dataType:'json',
				success:function(data){
                    //console.log(data);
                    vm.total = data.total;
                    vm.rulesData = null;
                    vm.rulesData = data.list;
                    _.each(vm.rulesData,function(item){
                        var tmpObj = _.find(vm.typesData,function(item2){
                            return item2.type = item.type;
                        });
                        vm.$set(item,'typeName',tmpObj.typeName);
                        vm.$set(item,'scoreVal',item.type==1?'+'+item.score:'-'+item.score);
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
            var tmpReqFns = [this.getDepListBySearch,this.getRulesData];
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
            this.getRulesDataByArgs();
        },
        prevPageChange:function(pageNum){  //点击分页的上一页
        // pageNum  当前页--后的值
            this.currentPage = pageNum;
            this.getRulesDataByArgs();
        },
        nextPageChange:function(pageNum){  //点击分页的下一页
        // pageNum  当前页++后的值
            this.currentPage = pageNum;
            this.getRulesDataByArgs();
        },
        sizePageChange:function(pageSize){  //改变每页条数时
        // pageSize 每页条数
        },
        dateStrFormat(val) {
            return fjPublic.dateStrFormat.call(this,val)
        }
    },
    watch:{
        score:function(val){
            console.log($.type(val));
            console.log(val);
        }
    },
    components:{
        fjBreadNav
    }
}
</script>
<style>
.fj-content_view.grkh-rules .add-rule {height:32px;margin:16px 0px;line-height:30px;border:1px dashed rgba(217,217,217,1);text-align:center;cursor:pointer;}
.fj-content_view.grkh-rules .add-rule > .el-icon-circle-plus {margin-right:10px;}
/*  */
.fj-content_view.grkh-rules .fj-block-body > .filterOpe-area .item {margin-right:10px;}
.fj-content_view.grkh-rules .fj-block-body > .filterOpe-area .item .el-select,
.fj-content_view.grkh-rules .fj-block-body > .filterOpe-area .item .el-select > .el-input,
.fj-content_view.grkh-rules .fj-block-body > .filterOpe-area .item .el-input {width:200px;}
.fj-content_view.grkh-rules .fj-block-body > .filterOpe-area .item .el-select + .el-select {margin-left:10px;}
/* 弹窗 */
.fj-content_view.grkh-rules #rulesPop .el-form .el-icon-question {font-size:18px;margin-left:12px;cursor:pointer;}
.fj-content_view.grkh-rules #rulesPop .el-form .el-form-item__content .el-textarea {width:300px;}
.fj-content_view.grkh-rules #rulesPop .el-form .el-form-item__content .el-textarea > .el-textarea__inner {height:76px;}
/*  */
@media screen and (min-width:1367px) {
    /*  */
    .fj-content_view.grkh-rules .fj-block-body > .filterOpe-area .item {margin-right:20px;}
    .fj-content_view.grkh-rules .fj-block-body > .filterOpe-area .item .el-select,
    .fj-content_view.grkh-rules .fj-block-body > .filterOpe-area .item .el-select > .el-input,
    .fj-content_view.grkh-rules .fj-block-body > .filterOpe-area .item .el-input {width:220px;}
    .fj-content_view.grkh-rules .fj-block-body > .filterOpe-area .item .el-select + .el-select {margin-left:20px;}
}
</style>


