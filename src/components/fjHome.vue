<template>
<div class="fj-content_view home fj-clear" >
	<!-- <fj-bread :bread-data="breadData"></fj-bread> -->
	<div class="fj-left-col fj-fl">
		<!--辅警位置展示 -->
		<div class="fj-block">
			<div class="fj-block-head">
				<p class="title fj-fl">
					<span>辅警位置展示</span>
					<!-- <span class="online-count">当前在线人数:<span>168</span>人</span> -->
				</p>
				<div class="details fj-fr">
					<a class="ope-txt full-screen" href="javascript:;" @click="openFullScreen">
						<img src="static/images/full-screen-icon.png" alt="">
						<span>全屏显示</span>
					</a>
				</div>
			</div>
			<div class="fj-block-body map" id="fcv-home-map">
				<!-- <el-tabs class="tabs-pos" @tab-click="tabMapArea">
					<el-tab-pane v-for="item in areaNavs" :label="item.label" :data-value="item.value" :key="item.label" :data-ap="item.area_parent"></el-tab-pane>
  				</el-tabs> -->
				<div class="map-nav">
					<p class="nav-item" v-for="(item,i) in areaNavs" v-text="item.label" :key="item.label" :data-ap="item.area_parent" @click="tabMapArea(item,i)" :class="{'is-active':item.isActive}"></p>
				</div>
			</div>
		</div>
		<!-- 人员状态 单位情况 -->
		<div class="fj-block">
			<div class="fj-block-head tab">
				<p class="title tab fj-fl is-select" @click="tabStateDept($event,'showStateTable')">人员状态</p>
				<p class="title tab fj-fl" @click="tabStateDept($event)" v-if="!notSjDept">单位情况</p>
				<p class="title tab fj-fl" @click="tabStateDept($event)">五日内未上传工作记录人员</p>
				<div class="details fj-fr use1366" v-show="isShowStateTable">
					<el-input class="fj-fl" suffix-icon="el-icon-search" placeholder="请输入姓名或警号" v-model="auxDeptsSearch" clearable @clear="searchAuxDepts"  v-on:keydown.native.enter="searchAuxDepts"></el-input>
					<el-button class="fj-fr" type="primary" @click="searchAuxDepts">随机抽查</el-button>
				</div>
			</div>
			<div class="fj-block-body state-dept">
				<div class="fj-table_wrap is-select">
					<el-table :data="stateTableData">
						<el-table-column prop="username" label="姓名">
							<template slot-scope="slot">
								<span class="normal-txt" @click="gotoPI(slot.row)">{{slot.row.username}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="deptname" label="单位名称" show-overflow-tooltip></el-table-column>
						<el-table-column prop="useraccount" label="警号" show-overflow-tooltip></el-table-column>
						<el-table-column prop="appstate" label="APP状态">
							<template slot-scope="slot">
								<span class="normal-txt" :class="[slot.row.appstate=='离线'?'off-line':'on-line']" @click="gotoPL(slot.row)">{{slot.row.appstate}}</span>
							</template>
						</el-table-column>
						<el-table-column label="考核记录数">
              <el-table-column v-for="(item, index) in itemNames" :key="item" :label="item">
                <template slot-scope="scope">
                  <p v-if="itemTypes[index] != '0'">{{scope.row.itemNums | getFormatScore(index)}}</p>
                  <p v-else>--</p>
                </template>
              </el-table-column>
            </el-table-column>
					</el-table>
				</div>
				<div class="fj-table_wrap depts" v-if="!notSjDept">
					<el-table :data="deptsTableData">
						<el-table-column prop="deptname" label="单名名称" show-overflow-tooltip></el-table-column>
						<el-table-column prop="rs" label="人数"></el-table-column>
						<el-table-column prop="zxrs" label="在线人数"></el-table-column>
						<el-table-column prop="rwfbs" label="任务发布数"></el-table-column>
						<el-table-column prop="rwwcs" label="任务完成数"></el-table-column>
						<el-table-column prop="zcjs" label="总采集数"></el-table-column>
					</el-table>
				</div>
				<div class="fj-table_wrap depts">
					<el-table :data="noRecordUserData">
						<el-table-column prop="userName" label="姓名">
							<template slot-scope="slot">
								<span class="normal-txt" @click="gotoPI2(slot.row)">{{slot.row.userName}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="deptname" label="单位名称" show-overflow-tooltip></el-table-column>
						<el-table-column prop="userAccount" label="警号"></el-table-column>
						<el-table-column prop="village" label="工作站"></el-table-column>
					</el-table>
				</div>
			</div>
		</div>
		<!-- 信息采集数 -->
		<div class="fj-block">
			<div class="fj-block-head">
				<p class="title fj-fl">信息采集数</p>
				<div class="details fj-fr">
					<a class="ope-txt is-active" href="javascript:;" @click="tabInfoCollectChartData($event,1)">本周</a>
					<a class="ope-txt" href="javascript:;" @click="tabInfoCollectChartData($event,2)">本月</a>
					<a class="ope-txt" href="javascript:;" @click="tabInfoCollectChartData($event,3)">本年</a>
				</div>
			</div>
			<div class="fj-block-body info-get">
				<!-- 信息采集数图表 -->
				<div class="info-get-chart" id="info-get-chart"></div>
			</div>
		</div>
		<!-- 近七日工作日志 -->
		<div class="fj-block">
			<div class="fj-block-head">
				<p class="title fj-fl">近七日工作日志</p>
				<div class="details fj-fr">
					<p>总日志数：<span>{{logToal}}</span></p>
				</div>
			</div>
			<div class="fj-block-body work-note">
				<!-- 近七日工作日志图表 -->
				<div class="work-note-chart" id="work-note-chart"></div>
			</div>
		</div>
	</div>
	<div class="fj-right-col fj-fr">
		<!-- 快速开始/便捷导航 -->
		<div class="fj-block">
			<div class="fj-block-head">
				<p class="title">快速开始/便捷导航</p>
			</div>
			<div class="fj-block-body">
				<div class="fj-block-notes fj-clear">
					<span class="note" v-for="item in commonLinks" :key="item.routeName" v-text="item.name" @click="tabRouterPath(item)"></span>
					<!-- <el-button class="note" type="text" v-for="item in commonLinks" :key="item.routeName" v-text="item.name" @click="tabRouterPath(item)"></el-button> -->
				</div>
			</div>
		</div>
		<!-- 今日在线情况 -->
		<div class="fj-block">
			<div class="fj-block-head">
				<p class="title">今日在线情况</p>
			</div>
			<div class="fj-block-body online">
				<ul class="count-list fj-clear">
					<li class="count-list_item">
						<p class="title">今日访问量</p>
						<el-tooltip effect="dark" :content="dayVisitCount+''" placement="top">
      						<p class="count fj-ellipsis" v-text="dayVisitCount"></p>
    					</el-tooltip>
					</li>
					<li class="count-list_item">
						<p class="title">总访问量</p>
						<el-tooltip effect="dark" :content="totalVisitCount+''" placement="top">
							<p class="count fj-ellipsis" v-text="totalVisitCount"></p>
    					</el-tooltip>
					</li>
					<li class="count-list_item">
						<p class="title">总辅警数</p>
						<el-tooltip effect="dark" :content="totalAuxNum+''" placement="top">
							<p class="count fj-ellipsis" v-text="totalAuxNum"></p>
    					</el-tooltip>
					</li>
				</ul>
				<!-- 在线情况的图表 -->
				<div class="online-chart" id="online-chart"></div>
			</div>
		</div>
		<!-- 近七日工作任务 -->
		<div class="fj-block">
			<div class="fj-block-head">
				<p class="title fj-fl">近七日工作任务</p>
			</div>
			<div class="fj-block-body work-mis">
				<!-- 近七日工作任务图表 -->
				<div class="work-mis-chart" id="mork-mis-chart"></div>
				<ul class="type-list">
					<li class="type-list_item">
						<i class="type1"></i>
						<span v-text="wmOption.series[0].data[0].name"></span>
						<span>
							<el-tooltip effect="dark" :content="wmOption.series[0].data[0].percent+''" placement="top">
      							<span v-text="wmOption.series[0].data[0].percent"></span>
    						</el-tooltip>
						</span>
						<span>
							<el-tooltip effect="dark" :content="wmOption.series[0].data[0].value+''" placement="top">
      							<span v-text="wmOption.series[0].data[0].value"></span>
    						</el-tooltip>
						</span>
					</li>
					<li class="type-list_item">
						<i class="type2"></i>
						<span v-text="wmOption.series[0].data[1].name"></span>
						<span>
							<el-tooltip effect="dark" :content="wmOption.series[0].data[1].percent+''" placement="top">
      							<span v-text="wmOption.series[0].data[1].percent"></span>
    						</el-tooltip>
						</span>
						<span>
							<el-tooltip effect="dark" :content="wmOption.series[0].data[1].value+''" placement="top">
      							<span v-text="wmOption.series[0].data[1].value"></span>
    						</el-tooltip>
						</span>
					</li>
					<li class="type-list_item">
						<i class="type3"></i>
						<span v-text="wmOption.series[0].data[2].name"></span>
						<span>
							<el-tooltip effect="dark" :content="wmOption.series[0].data[2].percent" placement="top">
      							<span v-text="wmOption.series[0].data[2].percent"></span>
    						</el-tooltip>
						</span>
						<span>
							<el-tooltip effect="dark" :content="wmOption.series[0].data[2].value+''" placement="top">
      							<span v-text="wmOption.series[0].data[2].value"></span>
    						</el-tooltip>
						</span>
					</li>
					<li class="type-list_item">
						<i class="type4"></i>
						<span v-text="wmOption.series[0].data[3].name"></span>
						<span>
							<el-tooltip effect="dark" :content="wmOption.series[0].data[3].percent" placement="top">
      							<span v-text="wmOption.series[0].data[3].percent"></span>
    						</el-tooltip>
						</span>
						<span>
							<el-tooltip effect="dark" :content="wmOption.series[0].data[3].value+''" placement="top">
      							<span v-text="wmOption.series[0].data[3].value"></span>
    						</el-tooltip>
						</span>
					</li>
				</ul>
			</div>
		</div>
		<!-- 通知通报 先进事迹 -->
		<div class="fj-block">
			<div class="fj-block-head tab">
				<p class="title tab fj-fl is-select" @click="tabNoticeThings($event)">通知通报</p>
				<p class="title tab fj-fl" @click="tabNoticeThings($event)">先进事迹</p>
				<div class="details fj-fr">
						<a class="ope-txt is-active" href="javascript:;" @click="gotoMA">更多</a>
				</div>
			</div>
			<div class="fj-block-body notice-things">
				<div class="notice-list is-select">
					<ul class="">
						<li class="notice-list_item" v-for="(item,index) in noticeListData" :key="index" :title="item.title" @click="openArtical(item)">
							<!-- <el-tooltip effect="dark" :content="item.title" placement="top"> -->
								<p class="txt fj-ellipsis" v-text="item.title"></p>
							<!-- </el-tooltip> -->
							<p class="time" v-text="item.inserttime">2018-12-09</p>
							<a class="download-link" href="" v-if="item.contype!='clob'" :download="item.title+'.'+item.contype"></a>
						</li>
					</ul>
				</div>
				<div class="notice-list">
					<ul class="">
						<li class="notice-list_item" v-for="(item,index) in ArticalListData" :key="index" :title="item.title" @click="openArtical(item)">
							<!-- <el-tooltip effect="dark" :content="item.title" placement="top"> -->
								<p class="txt fj-ellipsis" v-text="item.title"></p>
							<!-- </el-tooltip> -->
							<p class="time" v-text="item.inserttime">2018-12-09</p>
							<a class="download-link" href="" v-if="item.contype!='clob'" :download="item.title+'.'+item.contype"></a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</div>
</template>
<script>
function homeActivityCircle(opt){
	this.opt = opt ||{};
	this.opt.count = this.opt.count||3;
	this.opt.state = this.opt.state==undefined?0:this.opt.state;
    this.template='<div class="la-ball-scale-ripple-multiple">'+this.setDoms()+'</div>';
}
homeActivityCircle.prototype = {
	constructor:homeActivityCircle,
	stateArr:[
		{state:0,stateClass:'off-line'},
		{state:1,stateClass:''}
	],
	getState:function(state){
		var tmpStateClass;
		for(var i = 0;i<this.stateArr.length;i++){
			if(state==this.stateArr[i].state){
				tmpStateClass = this.stateArr[i].stateClass
				break;
			}
		}
		return tmpStateClass;
	},
	setDoms:function(){
		var arr = [];
		for(var i=0;i<this.opt.count;i++){
			var stateClass = this.getState(this.opt.state);
			arr.push('<div class="'+stateClass+'"></div>');
		}
		return arr.join('');
	}
};
export default {
    name:'fj-home',
    data:function(){
        return {
			commonLinks:[], //常用标签
			breadData:['当前位置:','首页'],
			totalAuxNum:0, //总辅警人数
			monthMisCount:0, //当月任务数
			monthCollectCount:0, //当月采集数
			totalLeaveCount:0, //当前请假人数
			PConlineNum:0,  //PC端在线人数
			APPonlineNum:0, //APP端在线人数
			dayVisitCount:0, //今日访问量
			totalVisitCount:0, //总访问量
			PCloginedNum:0,  //PC登录人数
			APPloginNum:0,   //APP登录人数
			testValue:'189988',
			onlineChart:null,//在线人数图表
			onlineChartDom:null, //图表容器
			onlineOption:{  //在线人数图表数据
				xAxis: {
					type: 'category',
					boundaryGap:true,
					axisLabel:{
						color:'rgba(0,0,0,.65)',
						fontFamily:'PingFangSC',
						interval:0   //设置标签间隔：强制显示所有标签
					},
					axisLine:{
						lineStyle:{
							color:'#D6D6D6'
						}
					},
					data: [
						{
							value:'PC登录数'
						},
						{
							value:'APP登录数'
						},
						{
							value:'PC在线数'
						},
						{
							value:'APP在线数'
						}
					]
				},
				yAxis: {
					type: 'value',
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
						fontFamily:'PingFangSC'
					}
				},
				tooltip:{
					trigger:'item',
					formatter:'{b}:\t\t{c}\t\t',
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
						data: [
							{
								name:'',
								value:0,
								label:{
									align:'right'
								},
								itemStyle:{
									color:'#1890FF',
								}
							},
							{
								name:'',
								value:0,
								itemStyle:{
									color:'#52C41A'
								}
							},
							{
								name:'',
								value:0,
								itemStyle:{
									color:'#1890FF',
								}
							},
							{
								name:'',
								value:0,
								itemStyle:{
									color:'#52C41A'
								}
							}
						],
						type: 'bar',
						barWidth:'24px',
						barMaxWidth:'24px'
					}
				]
			},
			workMisChart:null, //近七日工作任务图表
			workMisChartDom:null, //图表容器
			wmOption:{  //近七日工作任务图表数据
				title:{
					text:'',
					subtext:'',
					itemGap:5,
					top:'5%',
					left:'5%',
					textStyle:{
						color:'rgba(0,0,0,.65)',
						fontFamily:'PingFangSC',
						fontSize:'14'
					},
					subtextStyle:{
						color:'rgba(0,0,0,.85)',
						fontFamily:'PingFangSC',
						fontSize:'16'
					}
				},
				tooltip: {
					/* trigger: 'item',
					formatter: "{a} <br/>{b}: {c} ({d}%)" */
					textStyle:{
						fontFamily:'PingFangSC'
					}
				},graphic:[
					{
					type:'text',
					left:'center',
					top:'43%',
					style:{
						text:'总任务数', //使用“+”可以使每行文字居中
						textAlign:'center',
						font:'normal bolder 14px PingFangSC,HiraginoSansGB,Microsoft YaHei',
						fill:'rgba(0,0,0,.45)'
					}
				},{
					type:'text',
					left:'center',
					top:'center',
					style:{
						text:'\n', //使用“+”可以使每行文字居中
						textAlign:'center',
						font:'normal bolder 24px PingFangSC,Microsoft YaHei',
						fill:'rgba(0,0,0,.85)'
					}
				}
				],//此例饼状图为圆环中心文字显示属性，这是一个原生图形元素组件，功能很多
				series: [
					{
						type:'pie',
						radius: ['50%','70%'],
						avoidLabelOverlap: false,
						itemStyle:{
							borderColor:'#fff',
							borderWidth:'2'
						},
						data:[
							{
								value:0,
								name:'待处理',
								label:{
									normal:{
										show:false,
										position:'center'
									}
								},
								itemStyle:{
									color:'#F2637B'
								}
							},
							{
								value:0,
								name:'进行中',
								label:{
									normal:{
										show:false,
										position:'center'
									}
								},
								itemStyle:{
									color:'#3AA1FF'
								}
							},
							{
								value:0,
								name:'待审核',
								label:{
									normal:{
										show:false,
										position:'center'
									}
								},
								itemStyle:{
									color:'#FBD437'
								}
							},
							{
								value:0,
								name:'审核完成',
								label:{
									normal:{
										show:false,
										position:'center'
									}
								},
								itemStyle:{
									color:'#4ECB73'
								}
							}
						]
					}
				]
			},
			workNoteChart:null, //近七日工作日志图表
			workNoteChartDom:null, //图表容器
			wNoteOption:{  //近七日工作日志图表
				xAxis: {
					type: 'category',
					axisLine:{
						lineStyle:{
							color:'#D6D6D6'
						}
					},
					axisLabel:{
						color:'rgba(0,0,0,.65)',
						fontFamily:'PingFangSC'
					},
					data: []
				},
				yAxis: {
					type: 'value',
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
						fontFamily:'PingFangSC'
					}
				},
				tooltip:{
					trigger:'item',
					formatter:'时间:\t\t{b}\t\t<br/>日志数:\t\t{c}',
					textStyle:{
						fontSize:'12',
						fontFamily:'PingFangSC',
						color:'rgba(0,0,0,.65)',
					},
					padding:[15,10],
					backgroundColor:'#fff',
					extraCssText:'box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);'
				},
				series: [{
					data: [],
					type: 'line',
					lineStyle:{
						color:'#1890FF'
					},
					itemStyle:{
						borderColor:'#1890FF'
					}
				}]
			},
			logToal:0, //日志总数
			getInfoChart:null, //信息采集数图表
			getInfoChartDom:null, //图表容器
			gInfoOption:{
				title:{
					show:true,
					text:'八大台账',
					textStyle:{
						color:'#000',
						fontFamily:'PingFangSC',
						fontSize:14
					},
					left:'38',
					top:'20'
				},
				xAxis: {
					type: 'category',
					boundaryGap:true,
					axisLine:{
						lineStyle:{
							color:'#D6D6D6'
						}
					},
					axisLabel:{
						color:'rgba(0,0,0,.65)',
						fontFamily:'PingFangSC'
					},
					data: []
				},
				yAxis: {
					type: 'value',
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
						fontFamily:'PingFangSC'
					}
				},
				tooltip:{
					trigger:'item',
					formatter:'{b}:\t\t{c}\t\t',
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
						data: [],
						type: 'bar',
						barWidth:'24px',
						barMaxWidth:'24px'
					}
				]
			},
			stateTableData:null, //人员状态-表格数据
			isShowStateTable:true, //
			deptsTableData:null, //单位情况-表格数据
			noticeListData:null, //通知通报-列表数据
			ArticalListData:null, //先进事迹-列表数据
			noRecordUserData:null, //五日内未上传工作记录人员
			auxDeptsSearch:'',  //人员-单位情况 搜索字段
          itemNames: [],
          itemTypes: [],
			qqMap:null,  //腾讯地图
			labelInfos:{
				'绥宁县':'<div class="infoWindow"><p class="title">绥宁县</p><p class="title">215个工作站</p></div>',
				'邵阳县':'<div class="infoWindow"><p class="title">邵阳县</p><p class="title">410个工作站</p></div>',
				'隆回县':'<div class="infoWindow"><p class="title">隆回县</p><p class="title">514个工作站</p></div>',
				'洞口县':'<div class="infoWindow"><p class="title">洞口县</p><p class="title">334个工作站</p></div>',
				'新宁县':'<div class="infoWindow"><p class="title">新宁县</p><p class="title">299个工作站</p></div>',
				'大祥区':'<div class="infoWindow"><p class="title">大祥区</p><p class="title">38个工作站</p></div>',
				'双清区':'<div class="infoWindow"><p class="title">双清区</p><p class="title">34个工作站</p></div>',
				'北塔区':'<div class="infoWindow"><p class="title">北塔区</p><p class="title">16个工作站</p></div>',
				'邵东县':'<div class="infoWindow"><p class="title">邵东县</p><p class="title">521个工作站</p></div>',
				'新邵县':'<div class="infoWindow"><p class="title">新邵县</p><p class="title">402个工作站</p></div>',
				'武冈市':'<div class="infoWindow"><p class="title">武冈市</p><p class="title">299个工作站</p></div>',
				'城步苗族自治县':'<div class="infoWindow"><p class="title">城步苗族自治县</p><p class="title">184个工作站</p></div>'
			},
			hideLabels:['大祥区','双清区','北塔区'],
			initMapCenter:'', //地图初始中心点
			initMapScale:'',   //地图初始比例
			area_parent:'00001',  //获取区域经纬度用-初始id
			qqMapZoomEvents:{
				fs:16,
				lh:16,
				iz:8,
				getFs:function(zoom){
					return Math.round((this.fs*zoom)/this.iz);
				},
				getLh:function(zoom){
					return Math.round((this.lh*zoom)/this.iz);
				},
				getStyle:function(fs,lh){
					return {'color':'#000',background:'transparent','border':'none','font-size':fs+'px','line-height':lh+'px'}
				},
				'8':function(zoom){
					_.each(this.BasicInfoWindows,function(item){
						_.each(item,function(item2){
							item2.setOptions({
								style:this.qqMapZoomEvents.getStyle(16,16)
							});
							var tmpVal = _.find(this.hideLabels,function(v){
								return item.area_name == v;
							},this);
							tmpVal?item2.setVisible(false):item2.setVisible(true);
						},this);
					},this);
				},
				'9':function(zoom){
					var nfs = this.qqMapZoomEvents.getFs(zoom);
					var nlh = this.qqMapZoomEvents.getLh(zoom);
					_.each(this.BasicInfoWindows,function(item){
						_.each(item,function(item2){
							item2.setOptions({
								style:this.qqMapZoomEvents.getStyle(nfs,nlh)
							});
							var tmpVal = _.find(this.hideLabels,function(v){
								return item.area_name == v;
							},this);
							(tmpVal)&&(item2.setVisible(false));
						},this);
					},this);
				},
				'10':function(zoom){
					var nfs = this.qqMapZoomEvents.getFs(zoom);
					var nlh = this.qqMapZoomEvents.getLh(zoom);
					_.each(this.BasicInfoWindows,function(item){
						_.each(item,function(item2){
							item2.setOptions({
								style:this.qqMapZoomEvents.getStyle(nfs,nlh),
								visible:true
							});
						},this);
					},this);
				},
			},
			//
			areaInfos:[],   //区域地图数据
			BasicPolygons:[],    // 一级区域
			BasicInfoWindows:[], //一级区域信息提示
			nextPolygons:[], //下级区域
			nextInfoWindows:[], //下级区域信息提示
			nextEventsOfmi:[], //下级区域的事件处理-mouseover
			nextEventsOfmo:[], //下级区域的事件处理-mouseout
			nextEventsOfclick:[], //下级区域的事件处理-click
			level:1,  //区域level-默认1
			//areaColors:['#DDA0DD','#7B68EE','#48D1CC','#EEE8AA','#FFDEAD','#8B475D'],
			areaColors:['#3DAEF4','#78C6F7','#B2DFFC','#0C95E6','#0A6AA6'],
			areaNavs:[
				{label:fjPublic.cityInfos.citiName,value:'1',area_parent:'00001',isActive:true}
			],
			setLabelsOffset:{
				'3':function(){
					return new qq.maps.Size(-18, 10);
				},
				'4':function(){
                    return new qq.maps.Size(-18, 10);
				},
				'5':function(){
                    return new qq.maps.Size(-18, 10);
				},
				'6':function(){
                    return new qq.maps.Size(-18, 10);
				},
                '7':function(){
                    return new qq.maps.Size(-58, 10);
                },
                '8':function(){
                    return new qq.maps.Size(-58, 10);
                },
			},
			bili:'',
			posiArray:[], //计算缩放比例和中心点
			FLzc:null, //一级区域缩放比例和中心点
			SLzc:null, //二级区域缩放比例和中心点
			userList:[], //人员分布
			circles:[],  //人员状态标记
			personMarkers:[], //人员
			personInfoWins:[], //人员基本信息弹窗
			personMVCArr:null,   //点聚合markers数组
			personMarkerCluster:null,  //点聚合对象数组
			headImgUrl:fjPublic.ajaxUrlDNN+'/getAvatarByUserId?userid=',  //头像链接
			//权限设置
			userInfo:null, //用户信息
			FLdeptsData:[], //分局数据
			SLdeptsData:[], //派出所数据
			UserControl:{
				[fjPublic.userRoles.pcs]:function(deptName){
					if(this.userInfo.deptname!=deptName){
						this.$message({type:'warning',message:'不是'+this.userInfo.deptname+'的人员，暂无法查看！'});
						return false;
					}else{
						return true;
					}
				},
				[fjPublic.userRoles.pcs+'-rolesData']:function(){},
				[fjPublic.userRoles.qj]:function(deptName){
					var tmpObj = _.find(this.SLdeptsData,function(item){
						return item.deptName==deptName;
					},this);
					if(tmpObj){
						return true;
					}else{
						this.$message({type:'warning',message:'不是'+this.userInfo.deptname+'下派出所的人员，暂无法查看！'});
						return false;
					}
				},
				[fjPublic.userRoles.qj+'-rolesData']:function(){
					$.when(this.getPCSdataById(this.userInfo.deptId)).then(_.bind(function(){},this),_.bind(function(){
						this.$message({type:'warning',message:'获取派出所数据失败！'});
					},this));
				},
				[fjPublic.userRoles.sj]:function(){return true;},
				[fjPublic.userRoles.sj+'-rolesData']:function(){},
				[fjPublic.userRoles.cg]:function(){return true;},
				[fjPublic.userRoles.cg+'-rolesData']:function(){},
			},
			homeIsOpened:false //刷新文章列表用
		};
	},
	created:function(){
		this.userInfo = $.parseJSON(fjPublic.getLocalData('userInfo'))||{};
		//console.log(this.userInfo);
		this.UserControl[this.userInfo.userRole+'-rolesData'].call(this);
		//常用标签
		this.comminLinks = null;
		this.commonLinks = _.uniq($.parseJSON(fjPublic.getLocalData('commonLinks')),'name');
	},
    mounted:function(){
		fjPublic.wrapperRemoveScroll();
		$.when(this.requestDatas()).then(_.bind(function(){//地图
			this.homeIsOpened = true;
			_.delay(_.bind(function(){
				this.mapOption={
					center:'',		// 地图的中心地理坐标。
					scaleControl: true,	//比例尺
					disableDoubleClickZoom : true,
					zoom:parseInt(fjPublic.cityInfos.initZoomIndex),			//缩放控件1-18
					mapTypeId: qq.maps.MapTypeId.ROADMAP, //该地图类型显示普通的街道地图。
					mapTypeControl:false, //不显示地图类型控件
					panControl:false,   //不显示平移控件
					zoomControl:false,  //不显示缩放控件
					scaleControl:true,  //不显示比例尺控件
				};
				this.initMapCenter = new qq.maps.LatLng(fjPublic.cityInfos.lat,fjPublic.cityInfos.lng);
				this.$set(this.mapOption,'center',this.initMapCenter);
				var oMapDom = document.getElementById('fcv-home-map');
	 			var height = oMapDom.offsetHeight;
	 			var weight = oMapDom.offsetWidth;
				this.bili = weight/height;
				this.qqMap = new qq.maps.Map(oMapDom,this.mapOption);
				this.initMapScale = this.qqMap.getZoom();
				//设置区域轮廓
				this.setFirstLevelArea();
				this.FLzc = {
					zoomTo:parseInt(fjPublic.cityInfos.initZoomIndex),
					mapCenter:this.initMapCenter
				};
				//地图缩放事件
				var vm = this;
				qq.maps.event.addListener(this.qqMap,'zoom_changed',_.debounce(function(a){
					if(a.target.zoom<8||vm.level!=1){
						_.each(vm.BasicInfoWindows,function(item){
							_.each(item,function(item2){
								item2.setVisible(false);
							});
						});
						return;
					}
					//地图缩放时的操作
					var zoomVal = a.target.zoom+'';
					if(vm.qqMapZoomEvents.hasOwnProperty(zoomVal)){
						vm.qqMapZoomEvents[zoomVal].call(vm,a.target.zoom);
					}
				},200));
				//
				$(this.$el).find('#fcv-home-map > .map-nav').show();
			},this),200);
			//设置首页的图表
			this.setIndexCharts();
			//页面resize的时候，重新渲染图表
			$(window).off('resize').on('resize',_.debounce(_.bind(function(){
				//设置首页的图表
				this.setIndexCharts();
			},this),200));
			//导航栏收起展开的时候
		},this));
	},
	beforeRouteEnter:function(to,from,next){ //路由守卫
		next(function(vm){ //vm ->当前组件对象
			fjPublic.wrapperRemoveScroll();
			vm.comminLinks = null;
			vm.commonLinks = _.uniq($.parseJSON(fjPublic.getLocalData('commonLinks')),'name');
			//页面resize的时候，重新渲染图表
			$(window).off('resize').on('resize',_.debounce(_.bind(function(){
				//设置首页的图表
				vm.setIndexCharts();
			},this),200));
			//刷新文章列表
			if(vm.homeIsOpened){
				$.when(vm.getMainArticle(),vm.getShowArticle()).then(function(){
				},function(){
					vm.$message({type:'warning',message:'通知通报、先进事迹数据刷新失败!'});
				});
			}
		});
	},
	beforeRouteLeave:function(to,from,next){
		$(window).off('resize');
		next();
	},
	computed:{
		notSjDept:function(){ //不是市局的时候
			var ur = this.userInfo.userRole;
			return ur==fjPublic.userRoles.pcs||ur==fjPublic.userRoles.qj;
		}
	},
  filters: {
    getFormatScore: function (value, index) {
      if(value) {
        var arr = value.split(',');
        return arr[index];
      }else {
        return '待刷新';
      }
    }
  },
	methods:{
		getDepListBySearch:function(){ //获取分部门局数据
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
			return defer;
        },
		gotoPI:function(info){ //跳转至个人信息
			var testBool = this.UserControl[this.userInfo.userRole].call(this,info.deptname);
			if(!testBool)return;
			//获取内容区滚动条的滚动距离
			fjPublic.getContentScrollTop();
			fjPublic.contentScrollTop();
			this.$router.push({path:'/organizational-structure-pInfo',query:{userId:info.userid,isFrom:'fromIndexMap'}});
		},
		gotoPI2:function(info){ //跳转至个人信息
			var testBool = this.UserControl[this.userInfo.userRole].call(this,info.deptname);
			if(!testBool)return;
			//获取内容区滚动条的滚动距离
			fjPublic.getContentScrollTop();
			fjPublic.contentScrollTop();
			this.$router.push({path:'/organizational-structure-pInfo',query:{userId:info.userId,isFrom:'fromIndexMap'}});
		},
		gotoPL:function(info){ //跳转至个人轨迹
			var testBool = this.UserControl[this.userInfo.userRole].call(this,info.deptname);
			if(!testBool)return;
			//获取内容区滚动条的滚动距离
			fjPublic.getContentScrollTop();
			fjPublic.contentScrollTop();
			this.$router.push({path:'/personnel-locus',query:{userId:info.userid,userName:info.username,isFrom:'fromIndex'}});
		},
		gotoMA:function(){  //跳转至新闻中心文章管理
			fjPublic.contentScrollTop();
			fjSideNav.setInitState('/fjNewsCenter-articleManage');
			this.$router.push('/fjNewsCenter-articleManage');
		},
        openArtical:function(item){ //打开通知通报或先进事迹文章
            if(item.contype!='clob')return;
            window.open(fjPublic.ajaxUrlDNN+'/articleclob/'+item.id,'_blank');
		},
		clearMarkerCluster:function(){  //清除人员标记点聚合标记
			if(this.personMarkerCluster){
				this.personMarkerCluster.clearMarkers();
				this.personMarkerCluster = null;
			}
		},
		setMarkerCluster:function(){ //设置人员标记点聚合
			if(this.personMVCArr.getLength()>0){
				this.personMarkerCluster = new qq.maps.MarkerCluster({
					map:this.qqMap,
					minimumClusterSize:2,
					markers:this.personMVCArr,
					zoomOnClick:true,
					gridSize:30,
					averageCenter:true,
					maxZoom:18
				});
			}
		},
		clearPersonMarkers:function(){ //清除人员分布标记
			_.each(this.personMarkers,function(item,i){
				item.setMap(null);
				item = null;
				this.personInfoWins[i].setMap(null);
				this.personInfoWins[i] = null;
			},this);
			this.personMarkers.splice(0,this.personMarkers.length);
			this.personInfoWins.splice(0,this.personInfoWins.length);
		},
		setPersonMarkers:function(){ //设置人员分布标记
			var vm = this;
			var Label = function(opts) {
                qq.maps.Overlay.call(this, opts);
                this.options = opts;
            }
            //继承Overlay基类
            Label.prototype = new qq.maps.Overlay();
            //定义construct,实现这个接口来初始化自定义的Dom元素
            Label.prototype.construct = function() {
                this.dom = document.createElement('div');
                this.dom.setAttribute('class','a');
                this.dom.style.cssText='position:absolute;';
                this.dom.innerHTML = new homeActivityCircle({
					count:this.options.count,
					state:this.options.state
                }).template;
                //将dom添加到覆盖物层，overlayLayer的顺序为容器 1，此容器中包含Polyline、Polygon、GroundOverlay等
                //this.getPanes().overlayLayer.appendChild(this.dom);
                //将dom添加到覆盖物层，overlayMouseTarget的顺序容器 5，此容器包含透明的鼠标相应元素，用于接收Marker的鼠标事件
                this.getPanes().overlayMouseTarget.appendChild(this.dom);
            }
            //绘制和更新自定义的dom元素
            Label.prototype.draw = function() {
                //获取地理经纬度坐标
                var position = this.get('position');
                if (position) {
                    var pixel = this.getProjection().fromLatLngToDivPixel(position);
                    this.dom.style.left = pixel.getX()-12+'px';
                    this.dom.style.top = pixel.getY()+20+ 'px';
                }
            }
            Label.prototype.destroy = function() {
                //移除dom
                this.dom.parentNode.removeChild(this.dom);
			}
			//点聚合markers数组
			if(this.personMVCArr&&this.personMVCArr.elems.length){
				this.personMVCArr.forEach(function(element,index){
					element = null;
				});
				this.personMVCArr = null;
			}
			this.personMVCArr = new qq.maps.MVCArray();
			var k=0;
			_.each(this.userList,function(item,i){
				var tmplat = parseFloat(item.lat);
				var tmplat2 = item.lat;
				var tmplng = parseFloat(item.lng);
				var tmplng2 = item.lng;
				if(tmplat > tmplng){
					item.lat = tmplng2;
					item.lng = tmplat2;
				}
				$.Deferred(function(defer){
					var geocoder = new qq.maps.Geocoder();
					geocoder.setComplete(function(result){
						defer.resolve(result);
					});
					geocoder.setError(function(){

					});
					geocoder.getAddress(new qq.maps.LatLng(item.lat,item.lng));
				}).promise().then(function(result){
					var marker = new qq.maps.Marker({
						position: new qq.maps.LatLng(item.lat,item.lng),
						map:vm.qqMap,
						icon:new qq.maps.MarkerImage(
							'static/images/online_home.png',
							new qq.maps.Size(48,48),
							new qq.maps.Point(12, 0),
							new qq.maps.Point(12, 6),
							new qq.maps.Size(48,48)
						),
						animation:qq.maps.MarkerAnimation.DOWN,
						draggable: true,
						visible: true,
					});
					marker.index = i;
					marker.userid = item.userid;
					marker.deptname = item.deptid;
					var iwDom = '<div class="fj-home-infoWindow fj-clear">\
						<div class="img-box fj-fl"><img src="'+vm.headImgUrl+item.userid+'"  alt=""/></div>\
						<div class="txt-box fj-fl">\
							<p class="line"><span class="title">姓名:</span><span class="content">'+item.username+'</span></p>\
							<p class="line"><span class="title">部门:</span><span class="content">'+item.deptid+'</span></p>\
							<p class="line"><span class="title">地理位置:</span><span class="content">'+result.detail.address+'</span></p>\
						</div>\
					</div>';
					//设置人员活动标记
					vm.circles.push(
						new Label({
							map: vm.qqMap,
							position: new qq.maps.LatLng(item.lat,item.lng),
							count:3,
							state:item.userstate
						})
					);
					var infoWin = new qq.maps.InfoWindow({
						map:vm.qqMap,
						content: iwDom,
						position: new qq.maps.LatLng(item.lat,item.lng),
						zIndex:10
					});
					qq.maps.event.addListener(marker,'mouseover',function(a){
						vm.personInfoWins[a.target.index].open();
					});
					qq.maps.event.addListener(marker,'mouseout',function(a){
						vm.personInfoWins[a.target.index].close();
					});
					qq.maps.event.addListener(marker,'click',function(a){
						//点击跳转至个人信息界面
						//fjSideNav.clearItemsState();
						var testBool = vm.UserControl[vm.userInfo.userRole].call(vm,a.target.deptname);
						if(!testBool)return;
						vm.$router.push({path:'/organizational-structure-pInfo',query:{userId:item.userid,isFrom:'fromIndexMap'}});
					});
					vm.personMarkers.push(marker);
					vm.personInfoWins.push(infoWin);
					vm.personMVCArr.push(marker);
					k++;
					if(k>=vm.userList.length){
						//设置点聚合
						vm.setMarkerCluster();
					}
				});
			},this);
		},
		setMapCenterAndZoom:function(){
			if(this.posiArray.length == 0){
				return;
			}
			//算法只局限于东经北纬
			//zoom 18 最小级数  纬度差为0.004   每提高一级 纬度差翻倍
			//根据屏幕比例   w/h = 经度/纬度 lng/lat
			//根据显示的内容 找出最大、最小的经度和纬度  显示比例在50%以上 80%以下   根据经纬度取得合适的级别  zoom
			var maxLng = '0';
			var minLng = '0';
			var maxLat = '0';
			var minLat = '0';
			//取当前地图所有标志物  最大的经度、纬度 最小的经度、纬度
			for (i in this.posiArray) {
				var lat = this.posiArray[i].getLat();
				var lng = this.posiArray[i].getLng();
				if(lat > maxLat){
					maxLat = lat;
				}
				if(lat < minLat ||  minLat =='0'){
					minLat = lat;
				}
				if(lng > maxLng){
					maxLng = lng;
				}
				if(lng < minLng ||  minLng =='0'){
					minLng = lng;
				}
			}
			var perLng = (maxLng+minLng)/2;
			var perLat = (maxLat+minLat)/2;
			var LngVal = maxLng-minLng;
			var LatVal = maxLat-minLat;
			//用纬度差做比例还是用经度差做比例  w/h/bili =1.124  纬度/经度
			if(LngVal/(LatVal*this.bili) < 1){
				LngVal = 1.1*LatVal*this.bili
			}
			//调整地图比例 0.0064 18级 往上一级增加一倍
			var zoomTo;
			for(var i=0;i<=17;i++){
				if(LngVal <0.0064){
					zoomTo = 18-i;
					break;
				}else{
					LngVal = LngVal/2;
				}
			}
			this.qqMap.zoomTo(zoomTo);
			//移动地图中心
			var mapCenter=new qq.maps.LatLng(perLat,perLng);
			this.qqMap.setCenter(mapCenter);
			//map.panTo(mapCenter);
			return {
				zoomTo:zoomTo,
				mapCenter:mapCenter
			};
		},
		clearNavClass:function(){ //清除地图市区县导航栏样式
			_.each(this.areaNavs,function(item){
				item.isActive = false;
			},this);
		},
		tabMapArea:function(info,index){  //切换地图区域 市<->区县<->镇村
			//console.log(info);
			if(info.isActive)return;
		    this.clearNavClass();
			switch(info.value){
				case '1':
					this.areaNavs[index].isActive = true;
					this.level = parseInt(info.value);  //层级修改
					this.clearMarkerCluster();
					//清空人员分布
					this.clearPersonMarkers();
					//清空人员标记
					this.clearCircles();
					//清空下级区域的polygons和infoWins
					this.clearNextLevelArea();
					//nav修改
					this.deleteAreaNavItem();
					this.qqMap.zoomTo(this.FLzc.zoomTo);
					this.qqMap.setCenter(this.FLzc.mapCenter);
					//
					this.showFirstLevelArea();
					break;
				case '2':
					this.level = parseInt(info.value); //层级修改
					$.when(this.setNextLevelArea(info.areaInfo,true)).done(_.bind(function(){
						this.clearMarkerCluster();
						//清空人员分布
						this.clearPersonMarkers();
						//清空人员标记
						this.clearCircles();
						//nav修改
						this.deleteAreaNavItem(this.level);
						this.areaNavs[index].isActive = true;
					},this));
					break;
				default:
					break;
			}
		},
		deleteAreaNavItem:function(index){  //删除导航item
			if(index){
				this.areaNavs.areaInfo = null;
				this.areaNavs.splice(index,1);
			}else{
				_.each(this.areaNavs,function(item,i){
					if(i>0){
						item.areaInfo = null;
					}
				},this);
				this.areaNavs.splice(1,2);
			}
		},
		setPolygonsAndInfoWins:function(pgs,iws,isNext){ //设置polygons和infoWins
			var index=0,vm = this;
			//console.log(this.areaInfos);
			_.each(this.areaInfos,function(item,i){
				(index>=this.areaColors.length)&&(index=0);
				var path_count = parseInt(item.path_count);
				var pathArrs = [];
				for(var k=0;k<path_count;k++){
					var path = [];
					_.each(item.positions[k].positions,function(pos){
						path.push(new qq.maps.LatLng(pos.lat,pos.lng));
						if(isNext){
							vm.posiArray.push(new qq.maps.LatLng(pos.lat,pos.lng));
						}
					});
					pathArrs.push(path);
				}
				pgs.push(new qq.maps.Polygon({
					clickable: true,
					cursor: 'crosshair',
					map: this.qqMap,
					path: pathArrs,
					cursor: 'crosshair',
					strokeColor:new qq.maps.Color(255,255,255,.8),
					fillColor:this.areaColors[index],
					strokeDashStyle: 'solid'
				}));
				var labelInfoArr = [];
				_.each(item.areaCenter,function(centerObj){
					var iwContent = this.labelInfos[item.area_name]?this.labelInfos[item.area_name]:'<div class="infoWindow"><p class="title">'+item.area_name+'</p></div>';
					var tmplat = parseFloat(centerObj.area_center_lat);
					var tmplat2 = centerObj.area_center_lat;
					var tmplng = parseFloat(centerObj.area_center_lng);
					var tmplng2 = centerObj.area_center_lng;
					if(tmplat > tmplng){
						centerObj.area_center_lat = tmplng2;
						centerObj.area_center_lng = tmplat2;
					}
					labelInfoArr.push(new qq.maps.Label({
						map:this.qqMap,
						content: iwContent,
						position: new qq.maps.LatLng(centerObj.area_center_lat,centerObj.area_center_lng),
						offset:new qq.maps.Size(-20, -20), //相对于position位置偏移值，x方向向右偏移为正值，y方向向下偏移为正值，反之为负。
						style:{
							'color':'#000',background:'transparent','border':'none','font-size':'16px','line-height':'16px'
						},
						zIndex:10
					}));
					iws.push(labelInfoArr);
				},this);
				iws[i].area_name = item.area_name;
				pgs[i].initFillColor = this.areaColors[index];
				pgs[i].infoIndex = i;
				pgs[i].area_id = item.area_id;
				pgs[i].area_name = item.area_name;
				pgs[i].childAreaCenter = new qq.maps.LatLng(item.areaCenter[0].area_center_lat,item.areaCenter[0].area_center_lng);
				index++;
				//把第一级区域的区label隐藏
				if(vm.level==1){
					_.each(this.hideLabels,function(v){
						if(iws[i].area_name==v){
							_.each(iws[i],function(item2){
								item2.setVisible(false);
							});
						}
					});
				}
			},this);
		},
		setFirstLevelArea:function(){ //绘制第一级区域,设置一次
			//console.log(this.areaInfos);
			//设置polygon和infoWin
			this.setPolygonsAndInfoWins(this.BasicPolygons,this.BasicInfoWindows);
			var vm = this;
			$.Deferred(function(defer){
				defer.resolve();
			}).promise().then(function(){
				_.each(vm.BasicPolygons,function(item,i){
					qq.maps.event.addListener(item,'mouseover',function(a){
						item.setOptions({
							fillColor:new qq.maps.Color(255,100,97,1)
						});
						//vm.BasicInfoWindows[a.target.infoIndex].open();
					});
					qq.maps.event.addListener(item,'mouseout',function(a){
						item.setOptions({
							fillColor:item.initFillColor
						});
						//vm.BasicInfoWindows[a.target.infoIndex].close();
					});
					qq.maps.event.addListener(item,'click',function(a){
						//隐藏一级区域
						vm.hideFirstLevelArea();
						vm.level++;
						//绘制下级区域
						vm.setNextLevelArea(a);
					});
				});
			});
		},
		hideFirstLevelArea:function(){ //隐藏第一级绘制区域
			_.each(this.BasicPolygons,function(item,i){
				item.setOptions({
					fillColor:item.initFillColor,
					visible:false
				});
				_.each(this.BasicInfoWindows[i],function(item2){
					item2.setVisible(false);
				},this);
			},this);
		},
		showFirstLevelArea:function(){ //显示第一级绘制区域
			_.each(this.BasicPolygons,function(item,i){
				item.setOptions({
					visible:true
				});
				var tmpVal = _.find(this.hideLabels,function(v){
					return this.BasicInfoWindows[i].area_name == v;
				},this);
				if(!tmpVal){
					_.each(this.BasicInfoWindows[i],function(item2){
						item2.setVisible(true);
					},this);
				}
			},this);
		},
		removePolygonsEvents:function(){ //移除polygon绑定的事件
			if(this.nextEventsOfmi.length&&this.nextEventsOfmo.length&&this.nextEventsOfclick){
				_.each(this.nextEventsOfmi,function(item,i){
					qq.maps.event.removeListener(item);
					item = null;
					qq.maps.event.removeListener(this.nextEventsOfmo[i]);
					this.nextEventsOfmo[i] = null;
					qq.maps.event.removeListener(this.nextEventsOfclick[i]);
					this.nextEventsOfclick[i] = null;
				},this);
				this.nextEventsOfmi.splice(0,this.nextEventsOfmi.length);
				this.nextEventsOfmo.splice(0,this.nextEventsOfmo.length);
				this.nextEventsOfclick.splice(0,this.nextEventsOfclick.length);
			}
		},
		setNextLevelArea:function(areaInfo,isBack){  //设置下级区域
			fjPublic.openLoad('区域切换中...');
			this.area_parent = areaInfo.target.area_id;
			this.qqMap.setCenter(areaInfo.target.childAreaCenter);
			var qcDefer = $.Deferred();
			$.when(this.getHomePageArea()).then(_.bind(function(){
				//清空下级区域的polygons和infoWins
				this.clearNextLevelArea();
				//添加导航标签
				this.clearNavClass();
				if(!isBack){ //不是返回上一层级的时候添加导航
					this.areaNavs.push({
						label:areaInfo.target.area_name,
						value:this.level+'',
						area_parent:areaInfo.target.area_id,
						areaInfo:areaInfo,  //保存当前层级的信息
						isActive:true
					});
				}
				//设置polygon和infoWin
				this.setPolygonsAndInfoWins(this.nextPolygons,this.nextInfoWindows,true);
				var vm = this;
				//暂时第3级
				this.SLzc = this.setMapCenterAndZoom();
				fjPublic.closeLoad();
				if(vm.level>=3){
					//设置人员分布
					this.getHomePagePostion(areaInfo.target.area_id,areaInfo.target.area_name);
					return;
				}
				$.Deferred(function(defer){
					defer.resolve();
				}).promise().then(function(){
					_.each(vm.nextPolygons,function(item,i){
						var miEvt = qq.maps.event.addListener(item,'mouseover',function(a){
							item.setOptions({
								fillColor:new qq.maps.Color(255,100,97,1)
							});
							//vm.nextInfoWindows[a.target.infoIndex].open();
						});
						if(vm.level>1){ //mouseover事件处理
							vm.nextEventsOfmi.push(miEvt);
						}
						var moEvt = qq.maps.event.addListener(item,'mouseout',function(a){
							item.setOptions({
								fillColor:item.initFillColor
							});
							//vm.nextInfoWindows[a.target.infoIndex].close();
						});
						if(vm.level>1){ //mouseout事件处理
							vm.nextEventsOfmo.push(moEvt);
						}
						var clickEvt = qq.maps.event.addListener(item,'click',function(a){
							//
							vm.clearNextLevelArea();
							vm.level++;
							//
							vm.setNextLevelArea(a);
						});
						if(vm.level>1){ //click事件处理
							vm.nextEventsOfclick.push(clickEvt);
						}
					});
					qcDefer.resolve();
				});
			},this),_.bind(function(){
				fjPublic.closeLoad();
				this.$message({type:'warning',message:'区域切换失败！'});
				this.showFirstLevelArea();
			},this));
			return qcDefer;
		},
		clearNextLevelArea:function(){  //清空下级区域的polygons和infoWins
			if(this.nextPolygons.length&&this.nextInfoWindows.length){
				this.removePolygonsEvents();
				_.each(this.nextPolygons,function(item,i){
					item.setMap(null);
					_.each(this.nextInfoWindows[i],function(item2){
						item2.setMap(null);
						item2 = null;
					});
				},this);
				this.nextPolygons.splice(0,this.nextPolygons.length);
				this.nextInfoWindows.splice(0,this.nextInfoWindows.length);
			}
		},
		clearCircles:function(){  //清除人员标记
			_.each(this.circles,function(item){
				item.destroy();
				item = null;
			},this);
			this.circles.splice(0,this.circles.length);
		},
		getHomePagePostion:function(area_id,area_name){ //获取人员分布
			var defer = $.Deferred();
			var vm = this;
			$.ajax({
				url:fjPublic.ajaxUrlDNN+'/getHomePagePostion',
				type:'POST',
				data:{
					'area_id' :area_id,
					'area_name':area_name
				},
				dataType:'json',
				success:function(data){
					//console.log(data);
					//绘制人员分布markers
					vm.userList.splice(0,vm.userList.length);
					vm.userList = null;
					vm.userList = data.userlist;
					//vm.userList = data.userlist.slice(0,1);
					//设置人员分布
					vm.setPersonMarkers();
					defer.resolve();
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
		},
		tabRouterPath:function(item){ //常用标签切换
			this.$router.push(item.routeName);
			_.delay(function(){
				fjSideNav.setInitState();
			},100);
		},
		showFiveDayNoWorkUsers:function(){ //五日内未上传工作日志的人员
			var defer = $.Deferred();
			var vm = this;
			$.ajax({
				url:fjPublic.ajaxUrlDNN+'/showFiveDayNoWorkUsers',
				type:'POST',
				data:{
					nowUser:$.cookie(fjPublic.loginCookieKey)
				},
				dataType:'json',
				success:function(data){
					//console.log(data);
					vm.noRecordUserData = null;
					vm.noRecordUserData = data;
					defer.resolve();
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
		},
		getShowRandomUser:function(condition){ //首页获取总辅警人数、当月任务数、当月采集数、当前请假人数、人员状态列表
		    var defer = $.Deferred();
			var vm = this;
			var searchTxt = condition || '';
			$.ajax({
				url:fjPublic.ajaxUrlDNN+'/showRandomUser',
				type:'POST',
				data:{
					nowUser:$.cookie(fjPublic.loginCookieKey),
					condition:searchTxt
				},
				dataType:'json',
				success:function(data){
					//console.log(data);
					vm.totalAuxNum = data.allUsersCount;  //总辅警人数
					vm.monthMisCount = data.allMissionCount; //当月任务数
					vm.monthCollectCount = data.allOrderCount //当月采集数
					vm.totalLeaveCount = data.allLeaveCount;  //当前请假人数
					vm.stateTableData = data.users;  //人员状态列表
          vm.itemNames = data.itemNames.split(',');
          vm.itemTypes = data.itemTypes.split(',');
					defer.resolve();
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
		},
		getShowRandomDepts:function(){//首页单位情况列表
			var defer = $.Deferred();
			var vm = this;
			$.ajax({
				url:fjPublic.ajaxUrlDNN+'/showRandomDepts',
				type:'POST',
				data:{
					nowUser:$.cookie(fjPublic.loginCookieKey),
				},
				dataType:'json',
				success:function(data){
					//console.log(data);
					vm.deptsTableData = data;
					defer.resolve();
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
		},
		getTopRevealData:function(){ //首页在线数、访问量、登录人数统计
			var defer = $.Deferred();
			var vm = this;
			$.ajax({
				url:fjPublic.ajaxUrlDNN+'/topRevealData',
				type:'POST',
				data:{
					nowUser:$.cookie(fjPublic.loginCookieKey),
				},
				dataType:'json',
				success:function(data){
					//console.log(data);
					vm.PConlineNum = data[0];  //PC端在线人数
					vm.APPonlineNum = data[1]; //APP端在线人数
					vm.dayVisitCount = data[2]; //今日访问量
					vm.totalVisitCount = data[3]; //总访问量
					vm.PCloginedNum = data[4];  //PC登录人数
					vm.APPloginNum = data[5];   //APP登录人数
					//设置在线人数图表的数据
					vm.$set(vm.onlineOption.series[0].data[0],'value',data[4]);
					vm.$set(vm.onlineOption.series[0].data[1],'value',data[5]);
					vm.$set(vm.onlineOption.series[0].data[2],'value',data[0]);
					vm.$set(vm.onlineOption.series[0].data[3],'value',data[1]);
					defer.resolve();
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
		},
		getMainArticle:function(){ //首页通知通报列表
			var defer = $.Deferred();
			var vm = this;
			$.ajax({
				url:fjPublic.ajaxUrlDNN+'/getMainArticle',
				type:'POST',
				data:{nowUser:$.cookie(fjPublic.loginCookieKey)},
				dataType:'json',
				success:function(data){
					//console.log(data);
					vm.noticeListData = null;
					vm.noticeListData = data; //通知通报列表数据
					defer.resolve();
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
		},
		getShowArticle:function(){ //首页先进事迹列表
			var defer = $.Deferred();
			var vm = this;
			$.ajax({
				url:fjPublic.ajaxUrlDNN+'/showArticle',
				type:'POST',
				data:{nowUser:$.cookie(fjPublic.loginCookieKey)},
				dataType:'json',
				success:function(data){
					//console.log(data);
					vm.ArticalListData = null;
					vm.ArticalListData = data; //先进事迹-列表数据
					defer.resolve();
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
		},
		getWorkLogChartData:function(){ //获取工作日志折线图数据
			var defer = $.Deferred();
			var vm = this;
			$.ajax({
				url:fjPublic.ajaxUrlDNN+'/workLogChartData',
				type:'POST',
				data:{nowUser:$.cookie(fjPublic.loginCookieKey)},
				dataType:'json',
				success:function(data){
					//console.log(data);
					//折线数据
					vm.wNoteOption.series[0].data.splice(0,vm.wNoteOption.series[0].data.length);
					_.each(data.chaj,function(v,i){
						vm.wNoteOption.series[0].data.push({value:40,emphasis:{itemStyle:{color:'#1890FF'}}});
						vm.$set(vm.wNoteOption.series[0].data[i],'value',v);
						vm.logToal+=v;
					});
					//x轴日期
					vm.wNoteOption.xAxis.data.splice(0,vm.wNoteOption.xAxis.data.length);
					_.each(data.labare,function(v,i){
						vm.wNoteOption.xAxis.data.push({value:'12/01'});
						vm.$set(vm.wNoteOption.xAxis.data[i],'value',v);
					});
					defer.resolve();
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
		},
		getWorkMissionChartData:function(){ //获取工作任务饼图数据
			var defer = $.Deferred();
			var vm = this;
			$.ajax({
				url:fjPublic.ajaxUrlDNN+'/workMissionChartData',
				type:'POST',
				data:{nowUser:$.cookie(fjPublic.loginCookieKey)},
				dataType:'json',
				success:function(data){
					//console.log(data);
					//饼图数据
					var sum = 0;
					_.each(data.chaj,function(v,i){
						sum += v;
						vm.$set(vm.wmOption.series[0].data[i],'value',v);
						vm.$set(vm.wmOption.series[0].data[i],'name',data.labare[i]);
						vm.$set(vm.wmOption.series[0].data[i],'percent',data.rate[i]);
					});
					vm.$set(vm.wmOption.graphic[1].style,'text','\n'+sum);
					defer.resolve();
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
		},
		getInfoCollectChartData:function(ev,flag){ //获取信息采集柱状图数据 - 默认本周
			if(ev){
				var $this = $(ev.currentTarget);
				if($this.hasClass('is-active'))return;
				$this.siblings().removeClass('is-active').end().addClass('is-active');
			}
			var flag = flag||1;
			var defer = $.Deferred();
			var vm = this;
			$.ajax({
				url:fjPublic.ajaxUrlDNN+'/infoCollectChartData',
				type:'POST',
				data:{
					nowUser:$.cookie(fjPublic.loginCookieKey),
					flag:flag
				},
				dataType:'json',
				success:function(data){
					//console.log(data);
					//数据
					vm.gInfoOption.series[0].data.splice(0,vm.gInfoOption.series[0].data.length);
					vm.gInfoOption.xAxis.data.splice(0,vm.gInfoOption.xAxis.data.length);
					_.each(data.chaj,function(v,i){
						vm.gInfoOption.series[0].data.push({name:'',value:'',label:{align:'right'},itemStyle:{color:'#1890FF',}});
						vm.gInfoOption.xAxis.data.push({value:''});
						vm.$set(vm.gInfoOption.series[0].data[i],'value',v);
						vm.$set(vm.gInfoOption.xAxis.data[i],'value',data.labare[i]);
					});
					defer.resolve();
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
		},
		tabInfoCollectChartData:function(event,flag){ //切换信息采集柱状图数据 周月年
			$.when(this.getInfoCollectChartData(event,flag)).then(_.bind(function(){
				this.setCollectInfoChart();
			},this),_.bind(function(){
				this.$message({type:'warning',message:'获取信息采集数据失败！！！'});
			},this));
		}, //
		getHomePageArea:function(){ //获取区域轮廓数据
			var defer = $.Deferred();
			var vm = this;
			$.ajax({
				url:fjPublic.ajaxUrlDNN+'/getHomePageArea',
				type:'POST',
				data:{
					area_parent:this.area_parent
				},
				dataType:'json',
				success:function(data){
					//console.log(data);
					vm.posiArray.splice(0,vm.posiArray.length);
					vm.posiArray = null;
					vm.posiArray = [];
					vm.areaInfos = null;
					vm.areaInfos = data.datas;
					defer.resolve();
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
		},
		requestDatas:function(){  //向后台请求数据
			var vm = this,defer = $.Deferred();
			fjPublic.openLoad('数据加载中...');
			$.when(
				this.getDepListBySearch(),
				this.getHomePageArea(),
				this.getShowRandomUser(),
				this.showFiveDayNoWorkUsers(),
				this.getShowRandomDepts(),
				this.getTopRevealData(),
				this.getMainArticle(),
				this.getShowArticle(),
				this.getWorkLogChartData(),
				this.getWorkMissionChartData(),
				this.getInfoCollectChartData(),
				this.getWHCDData(),
				this.getXBData(),
				this.getMZData(),
				this.getHYZKData(),
				this.getZZMMData()
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
		tabStateDept:function(ev,isUserState){  // 人员状态-单位情况切换
			var $this = $(ev.currentTarget);
			if($this.hasClass('is-select'))return false;
			this.isShowStateTable = isUserState?true:false;
			var index = $this.index();
			var tableWraps = $this.parent().nextAll('.fj-block-body.state-dept').children('.fj-table_wrap');
			$this.siblings('.title.tab').removeClass('is-select').end().addClass('is-select');
			tableWraps.removeClass('is-select').eq(index).addClass('is-select');
		},
		tabNoticeThings:function(ev){ //通知通报-先进事迹切换
			var $this = $(ev.currentTarget);
			if($this.hasClass('is-select'))return false;
			var index = $this.index();
			var lists = $this.parent().nextAll('.fj-block-body.notice-things').children('.notice-list');
			$this.siblings('.title.tab').removeClass('is-select').end().addClass('is-select');
			lists.removeClass('is-select').eq(index).addClass('is-select');
		},
		setOnlineChart:function(){ //设置在线人数图表
			if(!this.onlineChartDom&&!this.onlineChart){
				this.onlineChartDom = '<div class="online-chart" id="online-chart"></div>';
				this.onlineChart = this.$echarts.init(document.getElementById('online-chart'));
				this.onlineChart.setOption(this.onlineOption);
			}else{
				this.onlineChart = null;
				var $onlineChart = $('#online-chart');
				$onlineChart.parent().append(this.onlineChartDom);
				$onlineChart.remove();
				this.onlineChart = this.$echarts.init(document.getElementById('online-chart'));
				this.onlineChart.setOption(this.onlineOption);
			}
		},
		setWorkMisChart:function(){ //设置近七日工作任务图表
			if(!this.workMisChartDom&&!this.workMisChart){
				this.workMisChartDom = '<div class="work-mis-chart" id="mork-mis-chart"></div>';
				this.workMisChart = this.$echarts.init(document.getElementById('mork-mis-chart'));
				this.workMisChart.setOption(this.wmOption);
			}else{
				this.workMisChart = null;
				var $workMisChart = $('#mork-mis-chart');
				$workMisChart.parent().prepend(this.workMisChartDom);
				$workMisChart.remove();
				this.workMisChart = this.$echarts.init(document.getElementById('mork-mis-chart'));
				this.workMisChart.setOption(this.wmOption);
			}
		},
		setWorkNoteChart:function(){ //设置近七日工作日志图表
			if(!this.workNoteChartDom&&!this.workNoteChart){
				this.workNoteChartDom = '<div class="work-note-chart" id="work-note-chart"></div>';
				this.workNoteChart = this.$echarts.init(document.getElementById('work-note-chart'));
				this.workNoteChart.setOption(this.wNoteOption);
			}else{
				this.workNoteChart = null;
				var $workNoteChart = $('#work-note-chart');
				$workNoteChart.parent().append(this.workNoteChartDom);
				$workNoteChart.remove();
				this.workNoteChart = this.$echarts.init(document.getElementById('work-note-chart'));
				this.workNoteChart.setOption(this.wNoteOption);
			}
		},
		setCollectInfoChart:function(){ //设置信息采集数图表
			if(!this.getInfoChartDom&&!this.getInfoChart){
				this.getInfoChartDom = '<div class="info-get-chart" id="info-get-chart"></div>';
				this.getInfoChart = this.$echarts.init(document.getElementById('info-get-chart'));
				this.getInfoChart.setOption(this.gInfoOption);
			}else{
				this.getInfoChart = null;
				var $getInfoChart = $('#info-get-chart');
				$getInfoChart.parent().append(this.getInfoChartDom);
				$getInfoChart.remove();
				this.getInfoChart = this.$echarts.init(document.getElementById('info-get-chart'));
				this.getInfoChart.setOption(this.gInfoOption);
			}
		},
		setIndexCharts:function(){ //设置首页的图表
			//设置在线人数图表
			this.setOnlineChart();
			//设置近七日工作任务图表
			this.setWorkMisChart();
			//设置近七日工作日志图表
			this.setWorkNoteChart();
			//设置信息采集数图表
			this.setCollectInfoChart();
		},
		openFullScreen:function(){ //地图全屏显示
			fjPublic.requestFullScreen(document.getElementById('fcv-home-map'));
		},
		searchAuxDepts:function(){ //随机抽查
			fjPublic.openLoad('正在请求数据...');
			//
			$.when(this.getShowRandomUser(this.auxDeptsSearch)).then(function(){
				fjPublic.closeLoad();
			});
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
                    fjPublic.setLocalData('ZZMMData',JSON.stringify(data.dict));
					defer.resolve();
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
        },
	},
	watch:{

	}
}
</script>
<style>
/* 首页 */
.fj-content_view.home .fj-home-infoWindow {min-width:400px;height:200px;max-height:240px;}
.fj-content_view.home .fj-home-infoWindow .img-box {width:175px;height:100%;margin-right:20px;font-size:0;}
.fj-content_view.home .fj-home-infoWindow .img-box:after {content:'';display:inline-block;width:0;height:100%;vertical-align:middle;}
.fj-content_view.home .fj-home-infoWindow .img-box > img {max-width:100%;max-height:100%;vertical-align:middle;}
.fj-content_view.home .fj-home-infoWindow .txt-box {width:220px;padding-top:20px;}
.fj-content_view.home .fj-home-infoWindow .txt-box .line {word-break: break-all;word-wrap:break-word;font-size:0px;line-height:24px;}
.fj-content_view.home .fj-home-infoWindow .txt-box .title {display:inline-block;width:68px;margin-right:10px;font-size:14px;color:rgba(0,0,0,.85);text-align:right;}
.fj-content_view.home .fj-home-infoWindow .txt-box .content {font-size:14px;}
.fj-content_view.home > .fj-left-col {width:69.646017%;padding-right:18px;}
.fj-content_view.home > .fj-right-col {width:30.2654867%;}
/* 辅警在线人数 */
.fj-block-head > .title > .online-count {color:rgba(0,0,0,.25);font-size:12px;}
/* 全屏图标 */
.ope-txt.full-screen > *  {display:inline-block;vertical-align:middle;}
.ope-txt.full-screen:after {content:'';display:inline-block;vertical-align:middle;width:0;height:100%;}
.ope-txt.full-screen > img {width:14px;}
/* 地图 */
.fj-block-body.map {height:550px;border:1px solid #fff;border-top:none;}
.fj-block-body.map .map-nav {display:none;position:absolute;top:6%;left:5%;height:44px;background:#fff;padding:0 20px;border-radius:4px;font-size:0px;z-index:1;border:1px solid #E3E3E3;}
.fj-block-body.map .map-nav > .nav-item {position:relative;display:inline-block;margin-right:32px;line-height:40px;font-size:20px;height:100%;color:rgba(0,0,0,.65);cursor:pointer;}
.fj-block-body.map .map-nav > .nav-item:last-child {margin-right:0px;}
.fj-block-body.map .map-nav > .nav-item:after {content:'\E613';position:absolute;top:50%;transform:translateY(-50%);right:-24px;font-family: element-icons!important;font-size:16px;color:rgba(0,0,0,.65);
    speak: none;
    font-style: normal;
    font-weight: 400;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    -webkit-font-smoothing: antialiased;}
.fj-block-body.map .map-nav > .nav-item:last-child:after {display:none;}
.fj-block-body.map .map-nav > .nav-item:hover,
.fj-block-body.map .map-nav > .nav-item.is-active {color:#1890FF;}
.fj-block-body.map .map-nav > .nav-item.is-active:before {content:'';position:absolute;top:-2px;left:-8px;right:-8px;bottom:-2px;border:1px solid #1890FF;}
.fj-block-body.map .map-nav > .nav-item:first-child.is-active:before {display:none;}
.fj-block-body.map .infoWindow {text-align:center;}
/* 快速开始 导航 */
.fj-block-body > .fj-block-notes {
	height:104px;max-height:104px;overflow:hidden;line-height:22px;padding:29px 12px 19px 24px;
}
.fj-block-body > .fj-block-notes > .note {width:25%;float:left;margin-bottom:6px;letter-spacing:1px;cursor:pointer;}
.fj-block-body > .fj-block-notes > .note:hover {color:#1890FF;}
.fj-block-body > .fj-block-notes > .el-button {padding:0px;}
.fj-block-body > .fj-block-notes > .el-button + .el-button {margin-left:0px;}
/* 今日在线情况 */
.fj-block-body.online {height:378px;}
.fj-block-body.online > .count-list {padding:16px 30px 0px;text-align:center;}
.fj-block-body.online  .count-list_item {position:relative;float:left;width:33.333333%;}
.fj-block-body.online  .count-list_item:after {content:'';position:absolute;top:8px;right:0;width:1px;height:48px;background:#E8E8E8;}
.fj-block-body.online > .count-list > .count-list_item:last-child:after {display:none;}
.fj-block-body.online  .count-list_item > .title {margin-bottom:5px;line-height:22px;}
.fj-block-body.online  .count-list_item > .count {font-size:24px;color:#000;line-height:32px;}
.fj-block-body.online > .online-chart {padding-left:10px;height:302px;}
/* 近7日工作任务 */
.fj-block-body.work-mis {height:460px;}
.fj-block-body.work-mis > .work-mis-chart {height:64%;}
.fj-block-body.work-mis > .type-list {}
.fj-block-body.work-mis .type-list_item {margin-bottom:14px;padding-left:44px;text-align:center;font-size:0;}
.fj-block-body.work-mis .type-list_item:after {content:'';display:inline-block;width:0;height:90%;vertical-align:middle;}
.fj-block-body.work-mis > .type-lis > .type-list_item:last-child {margin-bottom:0px;}
.fj-block-body.work-mis .type-list_item > * {display:inline-block;vertical-align:middle;}
.fj-block-body.work-mis .type-list_item > span {width:78px;max-width:78px;font-size:14px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;}
.fj-block-body.work-mis .type-list_item > i[class^=type] {width:8px;height:8px;border-radius:50%;margin-right:10px;}
.fj-block-body.work-mis .type-list_item > i[class=type1] {background:#F2637B;}
.fj-block-body.work-mis .type-list_item > i[class=type2] {background:#3AA1FF;}
.fj-block-body.work-mis .type-list_item > i[class=type3] {background:#FBD437;}
.fj-block-body.work-mis .type-list_item > i[class=type4] {background:#4ECB73;}
.fj-block-body.work-mis .type-list_item > span:first-of-type {text-align:left;}
.fj-block-body.work-mis .type-list_item > span:nth-of-type(2) {position:relative;color:rgba(0,0,0,0.45);}
.fj-block-body.work-mis .type-list_item > span:nth-of-type(2):before {content:'';position:absolute;top:0;left:0;width:1px;height:20px;background:#E0E0E0;}
.fj-block-body.work-mis .type-list_item > span:last-of-type {color:#000;}
.fj-block-body.work-mis .type-list_item > span:nth-of-type(2),.fj-block-body.work-mis .type-list_item > span:last-of-type {padding:0px 6px;}
/* 通知通报 先进事迹 */
.fj-block-body.notice-things {}
.fj-block-body.notice-things > .notice-list {display:none;padding-bottom:40px;}
.fj-block-body.notice-things > .notice-list > ul {height:736px;max-height:736px;padding:8px 24px 0px;overflow-y:scroll;}
.fj-block-body.notice-things > .notice-list.is-select {display:block;}
.fj-block-body.notice-things > .notice-list > ul::-webkit-scrollbar {width:0;height:0;}
.fj-block-body.notice-things .notice-list_item {position:relative;height:73px;padding-top:10px;border-bottom:1px solid #E8E8E8;cursor:pointer;}
.fj-block-body.notice-things > .notice-list > .notice-list_item:last-child {border-bottom:none;}
.fj-block-body.notice-things .notice-list_item > .txt {margin-bottom:8px;line-height:22px;text-align:justify;}
.fj-block-body.notice-things .notice-list_item > .time {font-size:12px;line-height:20px;color:rgba(0,0,0,0.45);}
.fj-block-body.notice-things .notice-list_item:hover > .txt {color:#1890FF;text-decoration:underline;}
.fj-block-body.notice-things .notice-list_item:hover > .time {color:rgba(0,0,0,0.65);;text-decoration:underline;}
.fj-block-body.notice-things .notice-list_item > .download-link {position:absolute;top:0;bottom:0;left:0;right:0;}
/* 近7日工作日志 */
.fj-block-body.work-note {overflow:hidden;}
.fj-block-body.work-note > .work-note-chart {height:358px;}
/* 信息采集数 */
.fj-block-body.info-get {height:350px;overflow:hidden;}
.fj-block-body.info-get > .info-get-chart {height:350px;}
/* 人员状态 单位情况 */
/* .fj-block-head > .details > .el-input {width:240px;margin-top:2px;margin-right:10px;}
.fj-block-head > .details > .el-input > .el-input__inner {height:32px;line-height:32px;}
.fj-block-head > .details > .el-button {margin-top:9px;padding: 8px 20px;} */
.fj-block-body.state-dept {height:460px;max-height:460px;overflow-y:scroll;}
.fj-block-body.state-dept .fj-table_wrap {padding:0px 15px;display:none;}
.fj-block-body.state-dept .fj-table_wrap.is-select {display:block;}
.fj-block-body.state-dept .fj-table_wrap .el-table th {padding:13px 0px;}
.fj-block-body.state-dept .fj-table_wrap .el-table td {padding:12px 0px;}
/* app在线状态 */
.fj-block-body.state-dept .el-table td .normal-txt {position:relative;padding-left:4px;}
.fj-block-body.state-dept .el-table td .normal-txt:after {content:'';position:absolute;top:50%;left:-8px;width:6px;height:6px;margin-top:-3px;border-radius:50%;}
.fj-block-body.state-dept .el-table td .normal-txt.off-line:after {background:rgba(0,0,0,.25);}
.fj-block-body.state-dept .el-table td .normal-txt.on-line:after {background:#52C41A;}
/* 隐藏滚动条 */
.fj-block-body::-webkit-scrollbar {width:0;height:0;}
/*  */
.fj-content_view.home .fj-block-head > .details.use1366 {position:absolute;top:-48px;right:0px;padding-left:20px;background:#fff;}
/* 0228添加 */
.la-ball-scale-ripple-multiple,
.la-ball-scale-ripple-multiple > div {
	position: relative;
	-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
			box-sizing: border-box;
}

.la-ball-scale-ripple-multiple {
	display: block;
	font-size: 0;
	color: #fff;
}

.la-ball-scale-ripple-multiple.la-dark {
	color: #333;
}

.la-ball-scale-ripple-multiple > div {
	display: inline-block;
	float: none;
	background-color: currentColor;
	border: 0 solid currentColor;
}

.la-ball-scale-ripple-multiple {
	width: 16px;
	height: 16px;
}

.la-ball-scale-ripple-multiple > div {
	position: absolute;
	top: 0;
	left: 0;
	width: 24px;
	height: 24px;
	background: #f00;
	border-width: 1px;
	border-radius: 100%;
	opacity: 0;
	-webkit-animation: ball-scale-ripple-multiple 1.25s 0s infinite cubic-bezier(.21, .53, .56, .8);
		-moz-animation: ball-scale-ripple-multiple 1.25s 0s infinite cubic-bezier(.21, .53, .56, .8);
			-o-animation: ball-scale-ripple-multiple 1.25s 0s infinite cubic-bezier(.21, .53, .56, .8);
			animation: ball-scale-ripple-multiple 1.25s 0s infinite cubic-bezier(.21, .53, .56, .8);
}
.la-ball-scale-ripple-multiple > div.off-line {
	background:rgba(0,0,0,.25);
}
.la-ball-scale-ripple-multiple > div:nth-child(1) {
	-webkit-animation-delay: 0s;
		-moz-animation-delay: 0s;
			-o-animation-delay: 0s;
			animation-delay: 0s;
}

.la-ball-scale-ripple-multiple > div:nth-child(2) {
	-webkit-animation-delay: .25s;
		-moz-animation-delay: .25s;
			-o-animation-delay: .25s;
			animation-delay: .25s;
}

.la-ball-scale-ripple-multiple > div:nth-child(3) {
	-webkit-animation-delay: .5s;
		-moz-animation-delay: .5s;
			-o-animation-delay: .5s;
			animation-delay: .5s;
}

/*
	* Animation
	*/
@-webkit-keyframes ball-scale-ripple-multiple {
	0% {
		opacity: 1;
		-webkit-transform: scale(.1);
				transform: scale(.1);
	}
	70% {
		opacity: .5;
		-webkit-transform: scale(1);
				transform: scale(1);
	}
	95% {
		opacity: 0;
	}
}
@-moz-keyframes ball-scale-ripple-multiple {
	0% {
		opacity: 1;
		-moz-transform: scale(.1);
				transform: scale(.1);
	}
	70% {
		opacity: .5;
		-moz-transform: scale(1);
				transform: scale(1);
	}
	95% {
		opacity: 0;
	}
}
@-o-keyframes ball-scale-ripple-multiple {
	0% {
		opacity: 1;
		-o-transform: scale(.1);
			transform: scale(.1);
	}
	70% {
		opacity: .5;
		-o-transform: scale(1);
			transform: scale(1);
	}
	95% {
		opacity: 0;
	}
}
@keyframes ball-scale-ripple-multiple {
	0% {
		opacity: 1;
		-webkit-transform: scale(.1);
			-moz-transform: scale(.1);
				-o-transform: scale(.1);
				transform: scale(.1);
	}
	70% {
		opacity: .5;
		-webkit-transform: scale(1);
			-moz-transform: scale(1);
				-o-transform: scale(1);
				transform: scale(1);
	}
	95% {
		opacity: 0;
	}
}
/* @media */
@media screen and (min-width:1492px) {
	.fj-content_view.home .fj-block-head > .details.use1366 {position:relative;top:0px;right:0px;padding-left:0px;background:transparent;}
}
@media screen and (min-width:1920px) {
	/* 首页 --> 近7日工作任务 */
	.fj-block-body.work-mis {height:318px;}
	.fj-block-body.work-mis > .work-mis-chart,.fj-block-body.work-mis > .type-list {float:left;width:50%;height:100%;}
	.fj-block-body.work-mis > .type-list {display:flex;justify-content:center;flex-flow:column nowrap;}
	.fj-block-body.work-mis .type-list_item {padding-left:0px;}
	/* 首页 --> 通知通报，先进事迹  */
	.fj-block-body.notice-things {height:918px;max-height:918px;}
}
</style>


