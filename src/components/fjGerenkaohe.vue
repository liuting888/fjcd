<template>
    <div class="fj-content_view grkh">
        <div class="fj-block show-all">
            <fj-breadNav :bread-data="breadData"></fj-breadNav>
            <p class="fj-component_title fj-clear">
                <span class="fj-fl">个人单位考核平均分数总览</span>
                <!--<el-tooltip class="item" effect="dark" content="点击跳转至“考核规则”界面！" placement="right">-->
                    <!--<el-button class="fj-fr" type="default" plain @click="$router.push('/personal-assessment-rules')">考核规则</el-button>-->
                <!--</el-tooltip>-->
            </p>
            <div class="charts-area fj-clear">
                <div class="charts-left-area fj-fl">
                    <el-radio-group v-model="selectedScoreType" @change="selectScoreType">
                        <el-radio v-for="item in scoreTypeDatas" :key="item.value" :label="item.value">{{item.label}}</el-radio>
                    </el-radio-group>
                    <div class="echart-count" id="echart-count"></div>
                </div>
                <div class="charts-right-area fj-fr">
                    <div class="title-box fj-clear">
                        <p class="fj-fl title">雷达图</p>
                        <el-date-picker class="fj-fr"
                            v-model="selectedRadarMonth"
                            value-format='yyyy-MM'
                            type="month"
                            placeholder="请选择月份"
                            @change="selectRadarMonth">
                        </el-date-picker>
                    </div>
                    <div class="echart-radar" id="echart-radar"></div>
                </div>
            </div>
        </div>
        <div class="fj-block rank">
            <div class="fj-block-head kaohe">
				<p class="title fj-fl">个人考核排名</p>
				<div class="details fj-fr">
                    <el-date-picker class="fj-fl"
                        v-model="selectedRankMonth"
                        type="month"
                        value-format='yyyy-MM'
                        placeholder="请选择月份"
                        @change="getDataByRankMonth">
                    </el-date-picker>
				</div>
			</div>
            <div class="fj-block-body">
                <!-- 筛选操作区域 -->
                <div class="filterOpe-area fj-clear">
                    <div class="select-box">
                        <span class="title fj-fl">单位筛选：</span>
                        <el-select class="fj-fl" :disabled="isFJrole" v-model="rankFenjvId" @change="getPCSdataById" clearable  placeholder="请选择区县分局">
                            <el-option v-for="item in FLdeptsData" :key="item.deptId" :label="item.deptName" :value="item.deptId"></el-option>
                        </el-select>
                        <el-select class="fj-fl" :disabled="isPCSrole" v-model="rankPcsId" @change="changeRnakListData" clearable  placeholder="请选择派出所">
                            <el-option v-for="item in SLdeptsData" :key="item.deptId" :label="item.deptName" :value="item.deptId"></el-option>
                        </el-select>
                        <el-input class="fj-fl search" v-model="userNameOrAccount" suffix-icon="el-icon-search" clearable placeholder="请输入姓名或警号" @input="changeRnakListDataNA" @clear="changeRnakListDataNA"></el-input>
                    </div>
                    <div class="btn-box">
                        <form style="display:none;" name="exportRankForm" :action="exportFileUrl+'/exportUserReportList?deptId='+rankPcsId+'&month='+selectedRankMonth+'&page='+currentPage+'&userNameOrAccount='+userNameOrAccount+'&rows='+pageSize"
                            method="post" enctype="multipart/form-data"></form>
                        <el-button :class="{'is-disabled':notCurMonthTime}" type="primary" @click="openMFSpopMultiple"><!-- <i class="el-icon-edit"></i> --><span>批量考核</span></el-button>
                        <el-button plain @click="exportPoliceAppraiseList"><!-- <i class="el-icon-upload2"></i> --><span>导出</span></el-button>
                        <!--<el-tooltip class="item" effect="dark" content="点击跳转至“考核明细列表”界面！" placement="top">-->
                            <!--<el-button plain @click="gotoDetailsList">&lt;!&ndash; <i class="el-icon-menu"></i> &ndash;&gt;<span>加分审核列表</span></el-button>-->
                        <!--</el-tooltip>-->
                    </div>
                </div>
                <div class="depts-select-info">
                    <i class="el-icon-info"></i>
                    <span class="selected">已选择<span v-text="selectedUsers.length"></span>项</span>
                    <span class="clear" @click="clearUsersSelection">清空</span>
                </div>
                <el-table :data="assessmentData" ref="multipleTable" @selection-change="handleSelectionChange" @row-click="showUserChart">
                    <el-table-column type="selection" width="35"></el-table-column>
                    <el-table-column prop="userName" label="姓名"></el-table-column>
                    <el-table-column prop="deptName" class-name="align-left" label="单位" show-overflow-tooltip></el-table-column>
                  <el-table-column label="考核项" >
                    <el-table-column v-for="(item, index) in itemNames" :key="item" :label="item + '（' + itemScores[index] + '分）'">
                      <template slot-scope="scope">
                        <p>{{scope.row.scores | getFormatScore(index)}}</p>
                      </template>
                    </el-table-column>
                  </el-table-column>
                    <el-table-column prop="allScore" :label="'合计（' + appraiseAllScore + '分）'"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="slot">
                            <!-- <el-button type="text" size="medium">明细</el-button>
                            <el-button type="text" size="medium">编辑</el-button> -->
                            <a href="javascript:;" class="ope-txt" @click.stop="gotoDetail(slot.row)">明细</a>
                            <a href="javascript:;" class="ope-txt" :class="{'disabled':notCurMonthTime}" @click.stop="openMFSpop(slot.row)">考核</a>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="mj-page_wrap">
                    <el-pagination
                        :current-page="currentPage"
                        :page-sizes="[10,20,30]"
                        :page-size="pageSize"
                        layout="total,prev,pager,next,jumper"
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
    <!-- 编辑个人减分的弹层 -->
        <el-dialog
            id="MFUPop"
            :visible.sync="modifyUserScorePop"
            :title="MFUpopTitle"
            :modal-append-to-body = "modifyUserScorePopModal"
            :close-on-click-modal="modifyUserScorePopModal"
            @close="cancelMFUpop"
            width="500px"
        >
            <div class="fj-block">
                <el-form class="MFUform" :model="MFUformData" :rules="addLogRules" ref="MFUform">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item prop="itemId" label="考核项">
                              <el-select v-model="MFUformData.itemId" placeholder="请选择考核项" @change="getAppraiseRules">
                                <el-option
                                  v-for="item in items"
                                  :key="item.id"
                                  :label="item.name"
                                  :value="item.id">
                                </el-option>
                              </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item prop="ruleId" label="考核规则">
                              <el-select filterable v-model="MFUformData.ruleId" placeholder="请选择考核规则">
                                <el-option
                                  v-for="item in rules"
                                  :key="item.id"
                                  :label="item.content"
                                  :value="item.id">
                                </el-option>
                              </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div slot="footer" style="text-align:center;" >
                <el-button @click="cancelMFUpop">取 消</el-button>
                <el-button type="primary" @click="saveMFUData">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import fjBreadNav from '@/components/fjBreadNav';
export default {
    name:'fjDanweikaohe',
    data:function(){
        return {
            radio2:'',
            value4:'',
            value5:'',
            value6:'',
            breadData:[  //面包屑导航
                {name:'当前位置:',path:''},
                {name:'考核管理',path:''},
                {name:'个人考核',path:''}
            ],
            /*
                统计类型，all（总平均分），gztz（工作台账），gzrz（工作日志），rygj（人员轨迹），zfqz（走访群众），qt（其他），cjtc（成绩突出
            */
            scoreTypeDatas:[  //筛选平均分类型的数据
                {label:'总平均分',value:'all'},
                // {label:'工作台账',value:'gztz'},
                // {label:'工作日志',value:'gzrz'},
                // {label:'人员轨迹',value:'rygj'},
                // {label:'走访群众',value:'zfqz'},
                // {label:'成绩突出',value:'cjtc'},
                // {label:'其他',value:'qt'}
            ],
          items: [],  // 考核操作考核项列表
          rules: [],  // 考核操作考核规则列表
            selectedScoreType:'all', //选择的平均分类型
            selectedUserId:'',  //点击列表查看某人员图表信息的userId
            userInfo:null, //当前登录的用户信息
			countChart:null, //平均分数 折线-图表
            countChartOption:{  //平均分数 折线-图表
                color:['#1890FF','#2FC25B'],
                legend: {
                    textStyle:{
                        fontFamily:'PingFangSC',
                        color:'rgba(0,0,0,.65)'
                    },
                    padding:20,
                    data:[
                        {
                            name:'平均分值',
                            icon:'circle'
                        },
                        {
                            name:'个人分值',
                            icon:'circle'
                        }
                    ]
                },
				xAxis: {
                    type: 'category',
                    axisLine:{
                        lineStyle:{
                            color:'#D6D6D6'
                        }
                    },
                    axisLabel:{
                        color:'rgba(0,0,0,.65)',
                        textStyle:{
                            fontFamily:'PingFangSC'
                        }
                    },
					data: []
				},
				yAxis: {
                    type: 'value',
                    textStyle:{
                        fontFamily:'PingFangSC'
                    },
                    axisLine:{
						lineStyle:{
							color:'#fff'
						}
					},
					splitLine:{
						lineStyle:{
							type:'dashed'
						}
					},
                    axisLabel:{
                        color:'rgba(0,0,0,.65)',
                        textStyle:{
                            fontFamily:'PingFangSC'
                        }
                    }
				},
				tooltip:{
					trigger:'item',
					formatter:'月份：{b}<br>分值：{c}\t\t',
					textStyle:{
                        fontSize:'12',
                        fontFamily:'PingFangSC',
						color:'rgba(0,0,0,.65)',
					},
					padding:[10,6],
					backgroundColor:'#fff',
					extraCssText:'box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);'
				},
				series: [
                    {
                        name:'平均分值',
                        data: [],
                        type: 'line',
                        lineStyle:{
                            color:'#1890FF'
                        },
                        itemStyle:{
                            borderColor:'#1890FF'
                        }
                    },
                    {
                        name:'个人分值',
                        data: [],
                        type: 'line',
                        lineStyle:{
                            color:'#2FC25B'
                        },
                        itemStyle:{
                            borderColor:'#2FC25B'
                        }
				    }
                ]
            },
            countChartDom:'', //图表DOM
            selectedRadarMonth:fjPublic.date2Month(new Date()),  //雷达图表的月份
            radarChart:null, //平均分数 雷达-图表
            radarChartOption:{ //平均分数 雷达-图表数据
                color:['#1890FF','#2FC25B'],
                legend: {
                    left:'left',
                    textStyle:{
                        fontFamily:'PingFangSC',
                        color:'rgba(0,0,0,.65)'
                    },
                    padding:20,
                    data:[
                        {
                            name:'平均分值',
                            icon:'circle'
                        },
                        {
                            name:'个人分值',
                            icon:'circle'
                        }
                    ]
                },
                tooltip:{
                    textStyle:{
                        fontSize:'12',
                        fontFamily:'PingFangSC',
						color:'rgba(0,0,0,.65)',
					},
                    padding:[12,6,16,6],
					backgroundColor:'#fff',
					extraCssText:'box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);'
                },
                axisLine:{
                    show:false,
                    lineStyle:{
                        opacity:'0'
                    }
                },
                radar: {
                    center:['50%','50%'],
                    radius:'70%',
                    nameGap:6,
                    name: {
                        textStyle: {
                            color: 'rgba(0,0,0,.65)',
                            fontFamily:'PingFangSC',
                            backgroundColor: 'transparent',
                        }
                    },
                    indicator: []
                },
                series: [
                    {
                        name: '',
                        type: 'radar',
                        // areaStyle: {normal: {}},
                        data : [
                            {
                                value : [],
                                name : '平均分值',
                                itemStyle:{
                                    color:'#1890FF',
                                    borderColor:'#1890FF'
                                },
                                lineStyle:{
                                    color:'#1890FF'
                                }
                            },
                            {
                                value : [],
                                name : '个人分值',
                                itemStyle:{
                                    color:'#2FC25B',
                                    borderColor:'#2FC25B'
                                },
                                lineStyle:{
                                    color:'#2FC25B'
                                }
                            }
                        ]
                    }
                ]
            },
            radarChartDom:'', //雷达图表dom
            assessmentData:null, //个人考核排名列表数据
          // 个人考核平均数据
          avgReport: {
            userId: '', month: '', itemNames: '', itemScores: '', scores: '', allScore: ''
          },
          itemNames: [],
          itemScores: [],
          scores: [],
          appraiseAllScore: '',
            selectedRankMonth:fjPublic.date2Month(new Date()), //个人考核排名的月份值
            currentPage:1, //页码
            pageSize:10,   //每页条数
            total:0, //分页总数
            rankDeptId:'', //个人考核排名的部门id
            userNameOrAccount:'', //个人考核排名输入的的姓名或者警号
            rankFenjvId:'', //考核排名分局id
            FLdeptsData:null, //区县分局部门数据
            rankPcsId:'',    //考核排名派出所id
            SLdeptsData:null, //派出所部门数据
            modifyUserScorePop:false, //编辑人员加减分的弹层
            modifyUserScorePopModal:false,
            MFUpopTitle:'', //弹层标题
            MFUtype:'', //单个编辑或批量编辑
            MFUformData:{
                itemId:'',     //加减分值
                ruleId:'', //编辑理由
                MFuserId:'',  //被编辑人员的userid
              MFdeptId:''  //被编辑人员的userid
            },
          addLogRules: {
            itemId: [
              { required: true, message: '请选择考核项', trigger: 'change' }
            ],
            ruleId: [
              { required: true, message: '请选择考核规则', trigger: 'change' }
            ]
          },  // 表单验证
            selectedUsers:[], //选中的人员
            exportFileUrl:fjPublic.ajaxUrlDNN,  //导出用的url
            isFJrole:false,
            isPCSrole:false,
            getDataByUserRole:{ //获取数据的时候
                [fjPublic.userRoles.pcs]:function(){
                    this.rankPcsId = this.userInfo.deptId; //设置当前派出所id
                },
                [fjPublic.userRoles.qj]:function(){
                    this.rankPcsId = this.userInfo.deptId.substr(0,6)+'010000'; //设置当前派出所id
                },
                [fjPublic.userRoles.sj]:function(){},
                [fjPublic.userRoles.cg]:function(){}
            },
            isEmptyPCSid:{  //清空派出所id的时候
                [fjPublic.userRoles.pcs]:function(){},
                [fjPublic.userRoles.qj]:function(){
                    if(!this.rankPcsId){
                        this.rankPcsId = this.userInfo.deptId.substr(0,6)+'010000'; //设置当前派出所id
                    }
                },
                [fjPublic.userRoles.sj]:function(){},
                [fjPublic.userRoles.cg]:function(){}
            },
            userRoleControl:{ //权限控制
                [fjPublic.userRoles.pcs]:function(){ //派出所
                    this.isFJrole = true; //分局下拉框禁用
                    this.isPCSrole = true;//派出所下拉框禁用
                    //设置分局id
                    var tmpObj = _.find(this.FLdeptsData,function(item){
                        return this.userInfo.deptId.slice(0,6)==item.deptId.slice(0,6);
                    },this);
                    this.rankFenjvId = tmpObj.deptId;
                    //获取对应派出所信息
                    $.when(this.getPCSdataById(this.rankFenjvId)).then(_.bind(function(){
                        this.rankPcsId = this.userInfo.deptId;
                    },this),_.bind(function(){
                        this.$message({type:'warning',message:'获取派出所数据失败'});
                    },this));
                },
                [fjPublic.userRoles.qj]:function(){ //区级
                    this.isFJrole = true; //下拉框禁用
                    //设置分局id
                    this.rankFenjvId = this.userInfo.deptId;
                    //获取对应派出所信息
                    $.when(this.getPCSdataById(this.rankFenjvId)).then(_.bind(function(){
                        this.rankPcsId = this.SLdeptsData[0].deptId; //默认显示第一个派出所的数据
                    },this),_.bind(function(){
                        this.$message({type:'warning',message:'获取'+this.userInfo.deptName+'下的派出所数据失败'});
                    },this));
                },
                [fjPublic.userRoles.sj]:function(){},
                [fjPublic.userRoles.cg]:function(){}
            },
            isCurMonth:fjPublic.date2Month(new Date())
        };
    },
    created:function(){
        this.userInfo = $.parseJSON(fjPublic.getLocalData('userInfo'));
        //
        this.getDataByUserRole[this.userInfo.userRole].call(this);
    },
    mounted:function(){
      this.getAppraiseItems();  // 考核项
        $.when(this.requestDatas()).then(_.bind(function(){
            this.userRoleControl[this.userInfo.userRole].call(this);
            //设置图表
            this.setThisPageCharts();
            //页面resize时，重新设置图表
            $(window).off('resize').on('resize',_.debounce(_.bind(function(){
                this.setThisPageCharts();
            },this),200));
        },this));
    },
    beforeRouteEnter:function(to,from,next){ //路由
        next(function(vm){
            //页面resize时，重新设置图表
            $(window).off('resize').on('resize',_.debounce(_.bind(function(){
                this.setThisPageCharts();
            },vm),200));
        });
    },
    beforeRouteLeave:function(to,from,next){
        $(window).off('resize');
        next();
    },
    computed:{
        notCurMonthTime:function(){ //日期筛选人员列表不是当前月份时
            var curTime = new Date(this.isCurMonth).getTime();
            var selectedTime = new Date(this.selectedRankMonth).getTime();
            return selectedTime!=curTime;
        }
    },
  filters: {
    getFormatScore: function (value, index) {
      if(value){
        var arr = value.split(',');
        return arr[index];
      }else {
        return '--'
      }
    }
  },
    methods:{
      getAppraiseRules: function() {
        var defer = $.Deferred();
        var vm = this;
        $.ajax({
          url: fjPublic.ajaxUrlDNN + "/getRuleByItemIdAndDeptId",
          type: "POST",
          data: {
            itemId: vm.MFUformData.itemId,
            deptId: vm.MFUformData.MFdeptId
          },
          dataType: "json",
          success: function(data) {
            vm.rules = data;
            defer.resolve();
          },
          error: function(err) {
            defer.reject();
          }
        });
        return defer;
      },
      getAppraiseItems: function() {
        var defer = $.Deferred();
        var vm = this;
        $.ajax({
          url: fjPublic.ajaxUrlDNN + "/getAppraiseItemsByType",
          type: "POST",
          data: {
            type: '0',
            itemType: '0'
          },
          dataType: "json",
          success: function(data) {
            vm.items = data;
            defer.resolve();
          },
          error: function(err) {
            defer.reject();
          }
        });
        return defer;
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
                    vm.FLdeptsData = _.filter(data.list,function(item){
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
                this.rankPcsId = '';
                this.SLdeptsData.splice(0,this.SLdeptsData.length);
                this.currentPage = 1;
                fjPublic.openLoad('获取数据中...');
                $.when(this.getPoliceAppraiseRankPageData()).then(_.bind(function(){
                    fjPublic.closeLoad('');
                },this),_.bind(function(){
                    fjPublic.closeLoad('');
                    this.$message({tyep:'warning',message:'获取数据失败'});
                },this));
                return;
            }
            fjPublic.openLoad('部门切换中...');
            this.rankPcsId = '';
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
        changeRnakListData:function(id){ //选择派出所的时候，切换列表数据
            this.isEmptyPCSid[this.userInfo.userRole].call(this);
            this.currentPage = 1;
            fjPublic.openLoad('获取数据中...');
            $.when(this.getPoliceAppraiseRankPageData()).then(_.bind(function(){
                fjPublic.closeLoad('');
            },this),_.bind(function(){
                fjPublic.closeLoad('');
                this.$message({tyep:'warning',message:'获取数据失败'});
            },this));
        },
        changeRnakListDataNA:_.debounce(function(){ //根据姓名或警号查询列表数据
            this.isEmptyPCSid[this.userInfo.userRole].call(this);
            this.currentPage = 1;
            this.clearTableRowClass();
            fjPublic.openLoad('查询数据中...');
            $.when(this.getPoliceAppraiseRankPageData()).then(_.bind(function(){
                fjPublic.closeLoad('');
            },this),_.bind(function(){
                fjPublic.closeLoad('');
                this.$message({tyep:'warning',message:'查询数据失败'});
            },this));
        },200),
        getDataByRankMonth:function(date){ //切换月份时获取个人考核人员列表数据
            //月份不能大于当前
            var curTime = new Date(this.isCurMonth).getTime();
            var selectedTime = new Date(this.selectedRankMonth).getTime();
            if(selectedTime>curTime){
                this.$message({type:'warning',message:'请选择当前或者之前的月份！'});
                this.selectedRankMonth = fjPublic.date2Month(new Date());
                return;
            }
            this.currentPage = 1;
            fjPublic.openLoad('获取数据中...');
            $.when(this.getPoliceAppraiseRankPageData()).then(_.bind(function(){
                fjPublic.closeLoad('');
            },this),_.bind(function(){
                fjPublic.closeLoad('');
                this.$message({type:'warning',message:'获取数据失败'});
            },this));
        },
        getAvgScoreData:function(){ //获取平均分折线图数据
            var defer = $.Deferred();
            var vm = this;
			$.ajax({
				url:fjPublic.ajaxUrlDNN + '/getUserReportLineChart',
				type:'POST',
				data:{
                    userId:this.selectedUserId    //人员userid
                },
				dataType:'json',
				success:function(data){
                    // console.log(data);
                    data.blueLineList.reverse();
                    vm.countChartOption.xAxis.data.splice(0,vm.countChartOption.xAxis.data.length);
                    vm.countChartOption.series[0].data.splice(0,vm.countChartOption.series[0].data.length);
                    _.each(data.blueLineList,function(item,i){
                        vm.countChartOption.xAxis.data.push(item.condition);
                        vm.countChartOption.series[0].data.push(
                            {
                                value:0,
                                emphasis:{itemStyle:{color:'#1890FF'}
                            }
                        });
                        vm.$set(vm.countChartOption.series[0].data[i],'value',item.score);
                    });
                    if(data.greenLineList&&data.greenLineList.length){ //设置个人数据的图表
                        data.greenLineList.reverse();
                        vm.countChartOption.series[1].data.splice(0,vm.countChartOption.series[1].data.length);
                        _.each(data.greenLineList,function(item,i){
                            vm.countChartOption.series[1].data.push(
                                {
                                    value:0,
                                    emphasis:{itemStyle:{color:'#2FC25B'}
                                }
                            });
                            vm.$set(vm.countChartOption.series[1].data[i],'value',item.score);
                        });
                    }
					defer.resolve();
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
        },
        getRadarAvgScoreData:function(){  //获取平均分雷达图数据
            var defer = $.Deferred();
            var vm = this;
			$.ajax({
				url:fjPublic.ajaxUrlDNN + '/getUserReportRadarChart',
				type:'POST',
				data:{
                    month:this.selectedRadarMonth,
                    userId:this.selectedUserId,
                },
				dataType:'json',
				success:function(data){
                    // console.log(data);
          var itemNames = (data.blueLineList && data.blueLineList.itemNames) ? data.blueLineList.itemNames.split(',') : ['该月无考核数据'];
          var itemScores = (data.blueLineList && data.blueLineList.itemScores) ?  data.blueLineList.itemScores.split(',') : ['--'];
          var scores = (data.blueLineList && data.blueLineList.scores) ?  data.blueLineList.scores.split(',') : ['--'];
          var indicatorNames = {};
          var maxValues = {};
          var score = {};
                    for(var i=0; i<itemNames.length; i++) {
                      indicatorNames[i] = itemNames[i];
                    }
          for(var i=0; i<itemScores.length; i++) {
            maxValues[i] = parseFloat(itemScores[i]);
          }
          for(var i=0; i<scores.length; i++) {
            score[i] = parseFloat(scores[i]);
          }
          // console.log(score);
                    // var indicatorNames ={
                    //     'bonusMark':'成绩突出',
                    //     'deductMark':'其他',
                    //     'ledgers':'工作台账',
                    //     'logs':'工作日志',
                    //     'tracks':'人员轨迹',
                    //     'visits':'走访群众',
                    // };
                    // var maxValues = {
                    //     'bonusMark':20,
                    //     'deductMark':10,
                    //     'ledgers':20,
                    //     'logs':20,
                    //     'tracks':10,
                    //     'visits':20
                    // };
                    vm.radarChartOption.radar.indicator.splice(0,vm.radarChartOption.radar.indicator.length);
                    vm.radarChartOption.series[0].data[0].value.splice(0,vm.radarChartOption.series[0].data[0].value.length);
                    _.each(score,function(v,k){
                        if(v>=maxValues[k])v=maxValues[k];
                        var tmpObj = {name:indicatorNames[k],max:maxValues[k]};
                        vm.radarChartOption.radar.indicator.push(tmpObj);
                        vm.radarChartOption.series[0].data[0].value.push(v);
                        vm.radarChartOption.series[0].data[0].emphasis={itemStyle:{color:'#1890FF'}};
                    });
                    if(data.greenLineList){ //设置个人数据的图表
                      var scores1 = data.greenLineList.scores.split(',');
                      var score1 = {};
                      for(var i=0; i<scores1.length; i++) {
                        score1[i] = parseFloat(scores1[i]);
                      }
                      // console.log(score1);
                        vm.radarChartOption.series[0].data[1].value.splice(0,vm.radarChartOption.series[0].data[1].value.length);
                        _.each(score1,function(v,k){
                            if(v>=maxValues[k])v=maxValues[k];
                            vm.radarChartOption.series[0].data[1].value.push(v);
                        });
                    }
					defer.resolve();
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
        },
        getPoliceAppraiseRankPageData:function(){ //获取个人考核排名数据
            var defer = $.Deferred();
            var vm = this;
			$.ajax({
				url:fjPublic.ajaxUrlDNN + '/getUserAppraiseReports',
				type:'POST',
				data:{
                    page:this.currentPage, //页码
                    rows:this.pageSize,   //每页条数
                    month:this.selectedRankMonth,  //查询月份，默认当月
                    deptId:this.rankPcsId,  //部门id
                    userNameOrAccount:this.userNameOrAccount  //人员名称或警号
                },
				dataType:'json',
				success:function(data){
                    // console.log(data);
                    vm.total = data.total;  //总数
                    vm.assessmentData = null;
                    vm.assessmentData = data.list;  //列表数据
          vm.avgReport = data.avgReport;  // 当月考核平均数据
          vm.itemNames = (vm.avgReport && vm.avgReport.itemNames) ? vm.avgReport.itemNames.split(',') : ['该月无考核数据'];
          vm.itemScores = (vm.avgReport && vm.avgReport.itemScores) ? vm.avgReport.itemScores.split(',') : ['--'];
          vm.scores = (vm.avgReport && vm.avgReport.scores) ? vm.avgReport.scores.split(',') : ['--'];
          vm.appraiseAllScore = data.appraiseAllScore;
					defer.resolve();
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
        },
        requestDatas:function(){ //向后台请求数据
			var vm = this,defer = $.Deferred();
			fjPublic.openLoad('数据加载中...');
            $.when(
                this.getDepListBySearch(),
                this.getAvgScoreData(),
                this.getRadarAvgScoreData(),
                this.getPoliceAppraiseRankPageData()
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
        selectScoreType:function(){ //选择平均分类型
            fjPublic.openLoad('获取数据中...');
            $.when(this.getAvgScoreData()).then(_.bind(function(){
                fjPublic.closeLoad('');
                //重新设置图表
                this.setCountChart();
            },this),_.bind(function(){
                fjPublic.closeLoad('');
                this.$message({tyep:'warning',message:'获取平均分折线图数据失败'});
            },this));
        },
        selectRadarMonth:function(date){  //选择月份切换雷达图表
            var curTime = new Date().getTime();
            var selectedTime = new Date(this.selectedRadarMonth).getTime();
            if(selectedTime > curTime){
                this.selectedRadarMonth = fjPublic.date2Month(new Date());
                this.$message({type:'warning',message:'请选择当前或之前的月份'});
                return;
            }
            if(!this.selectedRadarMonth)return;
            fjPublic.openLoad('获取数据中...');
            $.when(this.getRadarAvgScoreData()).then(_.bind(function(){
                fjPublic.closeLoad('');
                //重新设置图表
                this.setRadarChart();
            },this),_.bind(function(){
                fjPublic.closeLoad('');
                this.$message({tyep:'warning',message:'获取平均分雷达图数据失败'});
            },this));
        },
        setCountChart:function(){ //设置平均分-折线-图表
            if(!this.countChartDom&&!this.countChart){
				this.countChartDom = '<div class="echart-count" id="echart-count"></div>';
				this.countChart = this.$echarts.init(document.getElementById('echart-count'));
                this.countChart.setOption(this.countChartOption);
			}else{
				this.countChart = null;
				var $countChart = $('#echart-count');
				$countChart.parent().append(this.countChartDom);
				$countChart.remove();
				this.countChart = this.$echarts.init(document.getElementById('echart-count'));
				this.countChart.setOption(this.countChartOption);
			}
        },
        setRadarChart:function(){ //设置雷达图表
            if(!this.radarChartDom&&!this.radarChart){
				this.radarChartDom = '<div class="echart-radar" id="echart-radar"></div>';
				this.radarChart = this.$echarts.init(document.getElementById('echart-radar'));
                this.radarChart.setOption(this.radarChartOption);
			}else{
				this.radarChart = null;
				var $radarChart = $('#echart-radar');
				$radarChart.parent().append(this.radarChartDom);
				$radarChart.remove();
				this.radarChart = this.$echarts.init(document.getElementById('echart-radar'));
				this.radarChart.setOption(this.radarChartOption);
			}
        },
        setThisPageCharts:function(){ //设置本页面的图标
            this.setCountChart();
            this.setRadarChart();
        },
        openMFSpop:function(info){ //打开加减分编辑弹层
            //console.log(info);
            if(this.notCurMonthTime){
                this.$message({type:'warning',message:'不是当月，不能进行考核操作！'});
                return;
            }
            this.MFUpopTitle = '辅警考核';
            this.MFUtype = 'single';
            this.$set(this.MFUformData,'MFuserId',info.userId); //设置userid
          this.$set(this.MFUformData,'MFdeptId',info.deptId); //设置userid
            this.modifyUserScorePop = true;
        },
        openMFSpopMultiple:function(){ //批量编辑扣减分
            if(this.notCurMonthTime){
                this.$message({type:'warning',message:'不是当月，不能进行扣减分操作！'});
                return;
            }
            if(!this.selectedUsers||!this.selectedUsers.length){
                this.$message({type:'warning',message:'请选择要进行批量编辑减分的人员！'});
                return;
            }
            this.MFUpopTitle = '批量编辑人员扣减分';
            this.MFUtype = 'multiple';
            //
            this.modifyUserScorePop = true;
        },
        cancelMFUpop:function(){  //关闭减分编辑弹层
            if(this.MFUtype=='multiple'){ //批量操作弹窗的时候
                this.clearUsersSelection();
                this.selectedUsers.splice(0,this.selectedUsers.length);
            }
            this.MFUpopTitle = '';
            this.MFUtype = '';
            this.clearMFUformData();
            //
            this.modifyUserScorePop = false;
            //删除v-modal遮罩层
            fjPublic.removeModalMask();
        },
        saveMFUData:function(){ //提交编辑的加减分信息
          var validateBool;
          this.$refs['MFUform'].validate(function(value){
            if(value){
              validateBool = true;
            }
          });
          if(!validateBool)return;
            // if(!this.MFUformData.MFscoreReason){
            //     this.$message({type:'warning',message:'请填写编辑减分的理由！'});
            //     return;
            // }
            var userIds;
            switch(this.MFUtype){
                case 'single':
                    userIds = this.MFUformData.MFuserId;
                    break;
                case 'multiple':
                    userIds = _.pluck(this.selectedUsers,'userId').join(',');
                    break;
            }
            // console.log(userIds);
            //return;
            fjPublic.openLoad('编辑中...');
            var vm = this;
            $.ajax({
                url:fjPublic.ajaxUrlDNN + '/addUserAppraiseLog',
                type:'POST',
                data:{
                    nowUser: $.cookie(fjPublic.loginCookieKey),
                    userId: userIds, //人员编号
                    ruleId: vm.MFUformData.ruleId   // 规则编号
                },
                dataType:'json',
                success:function(data){
                    //console.log(data);
                    fjPublic.closeLoad();
                    if(data.errorCode==0){
                        vm.$message({type:'success',message:data.errorMsg});
                        vm.cancelMFUpop();
                        //更新列表数据
                        vm.getPoliceAppraiseRankPageData();
                    }else{
                        vm.$message({type:'error',message:data.errorMsg});
                    }
                },
                error:function(err){
                    fjPublic.closeLoad();
                    vm.$message({type:'success',message:'编辑减分失败！'});
                    //defer.reject();
                }
            });
        },
        clearMFUformData:function(){ //清空加减分的数据
            _.each(this.MFUformData,function(v,k){
                if(k=='MFscoreVal'){
                    this.$set(this.MFUformData,k,2);
                }else{
                    this.$set(this.MFUformData,k,'');
                }
            },this);
        },
        handleSelectionChange:function(arr){   //选择要编辑的人员
            //console.log(arr);
            this.selectedUsers = null;
            this.selectedUsers = arr;
        },
        showUserChart:function(row, event, column){
            //alert(row.userId);
            var $this = $(event.currentTarget);
            if($this.hasClass('show'))return;
            $this.siblings().removeClass('show').end().addClass('show');
            this.selectedUserId = row.userId;
            //设置图表的姓名标识
            this.countChartOption.legend.data[1].name='个人分值--'+row.userName;
            this.countChartOption.series[1].name='个人分值--'+row.userName;
            this.radarChartOption.legend.data[1].name='个人分值--'+row.userName;
            this.radarChartOption.series[0].data[1].name='个人分值--'+row.userName;
            fjPublic.openLoad('获取数据中...');
            $.when(this.getAvgScoreData(),this.getRadarAvgScoreData()).then(_.bind(function(){
                fjPublic.closeLoad('');
                fjPublic.contentScrollTop();
                //重新设置图表
                this.setCountChart();
                this.setRadarChart();
            },this),_.bind(function(){
                fjPublic.closeLoad('');
                this.$message({tyep:'warning',message:'获取'+row.userName+'的图表数据失败！'});
            },this));
        },
        clearUsersSelection:function(){ //取消选择批量编辑的人员
            this.$refs['multipleTable'].clearSelection();
        },
        exportPoliceAppraiseList:function(){ //导出
            document.forms['exportRankForm'].submit();
        },
        gotoDetailsList:function(data){   //显示个人考核-明细列表
            //console.log(data);
            fjPublic.contentScrollTop();
            this.$router.push('/personal-assessment-list');
        },
        gotoDetail:function(data){  //显示个人考核-考核明细
            //
            fjPublic.getContentScrollTop();
            fjPublic.contentScrollTop();
            fjPublic.setLocalData('userId-detail',data.userId);
            this.$router.push({path:'personal-assessment-detail',query:{userName:data.userName,monthVal:this.selectedRankMonth,userId:data.userId}});
        },
        clearTableRowClass:function(){  //清除表格行的类名
            $(this.$refs['multipleTable'].$el).find('.el-table__body-wrapper .el-table__row').removeClass('show');
        },
        currentPageChange:function(pageNum){  //点击某个分页按钮
            // pageNum  当前的页码值
            this.currentPage = pageNum;
            this.clearTableRowClass();
            fjPublic.openLoad('获取数据中...');
            $.when(this.getPoliceAppraiseRankPageData()).then(_.bind(function(){
                fjPublic.closeLoad('');
            },this),_.bind(function(){
                fjPublic.closeLoad('');
                this.$message({tyep:'warning',message:'获取数据失败'});
            },this));
        },
        prevPageChange:function(pageNum){  //点击分页的上一页
            // pageNum  当前页--后的值
            this.currentPage = pageNum;
            this.clearTableRowClass();
            fjPublic.openLoad('获取数据中...');
            $.when(this.getPoliceAppraiseRankPageData()).then(_.bind(function(){
                fjPublic.closeLoad('');
            },this),_.bind(function(){
                fjPublic.closeLoad('');
                this.$message({tyep:'warning',message:'获取数据失败'});
            },this));
        },
        nextPageChange:function(pageNum){  //点击分页的下一页
            // pageNum  当前页++后的值
            this.currentPage = pageNum;
            this.clearTableRowClass();
            fjPublic.openLoad('获取数据中...');
            $.when(this.getPoliceAppraiseRankPageData()).then(_.bind(function(){
                fjPublic.closeLoad('');
            },this),_.bind(function(){
                fjPublic.closeLoad('');
                this.$message({tyep:'warning',message:'获取数据失败'});
            },this));
        },
        sizePageChange:function(pageSize){  //改变每页条数时
        // pageSize 每页条数
        }
    },
    wacth:{

    },
    components:{
        fjBreadNav
    }
}
</script>
<style>
.fj-content_view.grkh > .fj-block {background:#fff;}
.fj-content_view.grkh > .fj-block.show-all {padding:0px 40px 0px 28px;}
.fj-content_view.grkh .fj-component_title > .el-button {padding:8px 20px;}
/*  */
.fj-content_view.grkh .charts-left-area,.fj-content_view.grkh .charts-right-area {padding-top:28px;}
.fj-content_view.grkh .charts-left-area {width:66.879562%;padding-right:33px;}
.fj-content_view.grkh .charts-right-area {width:33.120438%;}
/*  */
.fj-content_view.grkh .charts-left-area > .el-radio-group {height:50px;}
.fj-content_view.grkh .charts-left-area .el-radio {line-height:50px;color:rgba(0,0,0,.65);}
.fj-content_view.grkh .charts-left-area .el-radio + .el-radio {margin-left:20px;}
.fj-content_view.grkh .charts-left-area .el-radio__label {padding-left:7px;}
/*  */
.fj-content_view.grkh .charts-right-area > .title-box {padding-left:24px;height:50px;line-height:50px;}
.fj-content_view.grkh .charts-right-area > .title-box > .title {font-size:16px;color:rgba(0,0,0,.85);}
/*  */
.fj-content_view.grkh .charts-left-area > .echart-count,
.fj-content_view.grkh .charts-right-area > .echart-radar {height:380px;}
/*  */
.fj-content_view.grkh > .fj-block.rank {padding:0px 18px 18px;}
.fj-content_view.grkh > .fj-block.rank .details > .el-date-editor {margin-top:1px;margin-right:10px;}
.fj-content_view.grkh .fj-block-head > .details > .el-button {margin-top:8px;}
/*  */
.fj-content_view.grkh .fj-block-body > .filterOpe-area > .select-box {margin-bottom:16px;}
.fj-content_view.grkh .fj-block-body > .filterOpe-area > .select-box > .el-select {margin-right:30px;}
.fj-content_view.grkh .fj-block-body > .filterOpe-area > .select-box > .el-button {margin-left:30px;}
.fj-content_view.grkh .fj-block-body > .filterOpe-area > .btn-box {font-size:0px;}
/*  */
.fj-content_view.grkh .depts-select-info {height:40px;line-height:40px;padding-left:16px;margin-bottom:16px;background:#E6F7FF;border:1px solid #BAE7FF;}
.fj-content_view.grkh .depts-select-info > .el-icon-info {margin-right:3px;color:#1890FF;}
.fj-content_view.grkh .depts-select-info > span {margin-right:10px;}
.fj-content_view.grkh .depts-select-info > .selected > span {padding:0px 4px;}
.fj-content_view.grkh .depts-select-info > .selected > span,.fj-content_view.grkh .depts-select-info > .clear {color:#1890FF;}
.fj-content_view.grkh .depts-select-info > .clear {cursor:pointer;}
/*  */
.fj-content_view.grkh > .fj-block.rank .el-table th {padding:4px 0px;}
.fj-content_view.grkh > .fj-block.rank .el-table td {padding:10px 0px;}
.fj-content_view.grkh > .fj-block.rank .el-table--border {border:none;}
.fj-content_view.grkh > .fj-block.rank .el-table--border::after {display:none;}
.fj-content_view.grkh > .fj-block.rank .el-table--border td {border-right:none;}
.fj-content_view.grkh > .fj-block.rank .el-table--border th {border-right:none;border-bottom:none;}
/* 弹窗 */
.fj-content_view.grkh #MFUPop .el-form.MFUform .el-icon-question {font-size:18px;margin-left:12px;cursor:pointer;}
.fj-content_view.grkh #MFUPop .el-form.MFUform .el-form-item__content .el-textarea {width:300px;}
.fj-content_view.grkh #MFUPop .el-form.MFUform .el-form-item__content .el-textarea > .el-textarea__inner {height:76px;}
/* 点击列表行 */
.fj-content_view.grkh .el-table .el-table__row.show {background:#f5f7fa;}
/* @media */
@media screen and (min-width:1592px) {
    .fj-content_view.grkh .fj-block-body > .filterOpe-area > .select-box {float:left;margin-bottom:0px;}
    .fj-content_view.grkh .fj-block-body > .filterOpe-area > .btn-box {float:left;margin-left:10px;}
    /*  */
    .fj-content_view.grkh #MFUPop .el-dialog {width:683px;}
}
</style>


