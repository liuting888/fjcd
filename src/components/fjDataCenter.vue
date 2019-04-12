<template>
    <div class="fj-content_view data-center">
        <div class="fj-block title">
            <fj-breadNav :bread-data="breadData"></fj-breadNav>
        </div>
        <div class="fj-block">
            <div class="fj-block-head">
				<p class="title fj-fl">活跃度排名</p>
                <div class="details fj-fr">
                    <!-- <a href="javascript:;" class="ope-txt">今日</a>
                    <a href="javascript:;" class="ope-txt">本周</a>
                    <a href="javascript:;" class="ope-txt">本月</a> -->
                    <a href="javascript:;" class="ope-txt" v-for="(item,index) in activityBtns" :key="index" :class="{'is-active':item.selected}" v-text="item.txt" @click="filterActiveData(item)"></a>
                </div>
			</div>
            <div class="fj-block-body activity-rank" id="activity-rank">
                <!-- 全市活跃总数 -->
                <div class="rank-sum">
                    <p class="title">全市活跃总数</p>
                    <p class="count fj-clear">
                        <!-- <span class="fj-fl" v-text="activitySum"></span> -->
                        <template v-for="(v,index) in activitySumArr" >
                            <fj-animate-num v-if="v!=','" class="fj-fl" :key="index" :value="v"></fj-animate-num>
                            <span v-else class="fj-fl" :key="index" v-text="v"></span>
                        </template>
                        <span class="fj-fl count-last">次</span></p>
                </div>
                <!-- 活跃度排名表格 -->
                <div class="rank-pop">
                    <p class="title fj-clear">
                        <span class="fj-fl">地区活跃度排名</span>
                        <el-tooltip class="item" effect="dark" content="点击收起排名列表" placement="top">
                            <i class="fj-fr el-icon-d-arrow-right" @click="toggleUpRankPop($event)"></i>
                        </el-tooltip>
                    </p>
                    <div class="rank-table-wrap">
                        <el-table :data="activeRankData">
                            <el-table-column prop="index" width="42">
                                <template slot-scope="slot">
                                    <span class="rank-index" :class="{wisdom:slot.row.index<=3}">{{slot.row.index}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="deptName" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="nums" show-overflow-tooltip width="80"></el-table-column>
                        </el-table>
                    </div>
                </div>
                <el-tooltip class="item" effect="dark" content="点击展开排名列表" placement="top">
                    <i class="el-icon-d-arrow-left" @click="toggleDownRankPop($event)"></i>
                </el-tooltip>
                <!-- 活跃度排名百分比 -->
                <!-- 地图 -->
                <div id="fj-dc-map"></div>
                <!-- mask -->
                <div id="fj-dc-map_mask"></div>
            </div>
        </div>
        <!-- 信息采集数统计 -->
        <div class="fj-block">
            <div class="fj-block-head">
				<p class="title fj-fl">信息采集数统计</p>
                <div class="details fj-fr">
                    <el-date-picker
                        class="fj-fl"
                        v-model="IAmonthVal"
                        type="month"
                        clearable
                        placeholder="请选择月份"
                        @change="filterIADatas">
                    </el-date-picker>
                </div>
			</div>
            <div class="fj-block-body info-acq">
                <!-- 信息采集数 + 采集台账类型 -->
                <div class="line-bar-area fj-clear">
                    <div class="line-bar-chart" id="info-acq-chart"></div>
                    <div class="line-bar-chart" id="acq-type-chart"></div>
                </div>
                <!-- 信息采集地区分布 -->
                <div class="pie-area fj-clear">
                    <!-- 图表 -->
                    <div class="pie-chart" id="info-acq-area-chart"></div>
                    <!-- 地区分布排名 -->
                    <div class="area-rank-box">
                        <div class="rank-table-box fj-clear">
                            <div class="rank-column1">
                                <ul>
                                    <li class="rank-line title fj-clear">
                                        <span class="fj-fl name">地区分布排名</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="rank-table-box fj-clear">
                            <div class="rank-column1">
                                <ul>
                                    <li class="rank-line title fj-clear">
                                        <span class="fj-fl name">地区名称</span><span class="fj-fl count">采集数</span><span class="fj-fl rank">排名</span>
                                    </li>
                                </ul>
                                <ul>
                                    <li class="rank-line fj-clear" v-for="item in fSixRankData" :key="item.deptId" >
                                        <p class="fj-fl name"><el-tooltip class="item" effect="dark" :content="item.deptName" placement="top"><span v-text="item.deptName"></span></el-tooltip></p><span class="fj-fl count" v-text="item.nums"></span><span class="fj-fl rank" v-text="item.rank"></span>
                                    </li>
                                </ul>
                            </div>
                            <div class="rank-column2">
                                <ul>
                                    <li class="rank-line title fj-clear">
                                        <span class="fj-fl name">地区名称</span><span class="fj-fl count">采集数</span><span class="fj-fl rank">排名</span>
                                    </li>
                                </ul>
                                <ul>
                                    <li class="rank-line fj-clear" v-for="item in bSixRankData" :key="item.deptId" >
                                        <p class="fj-fl name"><el-tooltip class="item" effect="dark" :content="item.deptName" placement="top"><span v-text="item.deptName"></span></el-tooltip></p><span class="fj-fl count" v-text="item.nums"></span><span class="fj-fl rank" v-text="item.rank"></span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 工作任务统计 -->
        <div class="fj-block">
            <div class="fj-block-head">
				<p class="title fj-fl">工作任务统计</p>
                <div class="details fj-fr">
                    <el-date-picker class="fj-fl"
                        v-model="workMisVal"
                        type="month"
                        clearable
                        @change="filterWorkMisData"
                        placeholder="请选择月份">
                    </el-date-picker>
                </div>
			</div>
            <div class="fj-block-body">
                <div class="fj-block-body dc-work-mis" id="work-mis-types">
                    <div class="type-count-box fj-clear" id="work-mis-box">
                        <div class="type-count" v-for="item in workMisChartsData" :key="item.missionState">
                            <p class="title" v-text="item.series[0].data[0].name"></p>
                            <p class="complete-txt">占比</p>
                            <p class="percent" v-text="item.series[0].data[0].percent"></p>
                            <!-- 环形 -->
                            <div class="circle-chart"></div>
                        </div>
                    </div>
                    <!-- 工作任务总数图表 -->
                    <div class="mis-sum-chart" id="mis-sum-chart"></div>
                    <!-- 工作任务地区分布 -->
                    <div class="mis-area-chart" id="mis-area-chart"></div>
                </div>
            </div>
        </div>
        <!-- 单位考核排名 + 人员考核排名 -->
        <div class="fj-block dept-person fj-clear">
            <div class="left-rank-box fj-fl">
                <div class="fj-block">
                    <div class="fj-block-head">
                        <p class="title fj-fl">单位考核排名</p>
                        <div class="details fj-fr">
                            <el-date-picker class="fj-fl"
                                v-model="deptRankVal"
                                type="month"
                                clearable
                                @change="filterRankPoliceData"
                                placeholder="请选择月份">
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="fj-block-body">
                        <el-table :data="unitAssesData">
                            <el-table-column prop="rank" label="排名"></el-table-column>
                            <el-table-column prop="deptName" label="单位名称" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="userName" label="责任人"></el-table-column>
                            <el-table-column prop="nums" label="考核人数"></el-table-column>
                            <el-table-column prop="score" label="得分"></el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
            <div class="right-rank-box fj-fr">
                <div class="fj-block">
                    <div class="fj-block-head">
                        <p class="title fj-fl">人员考核排名</p>
                        <div class="details fj-fr">
                            <el-date-picker class="fj-fl"
                                v-model="reportRankVal"
                                type="month"
                                clerable
                                @change="filterRankReportData"
                                placeholder="请选择月份">
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="fj-block-body">
                        <el-table :data="personAssesData">
                            <el-table-column prop="rank" label="排名"></el-table-column>
                            <el-table-column prop="userName" label="姓名"></el-table-column>
                            <el-table-column prop="deptName" label="单位名称" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="userAccount" label="警号"></el-table-column>
                            <el-table-column prop="score" label="得分"></el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
function ActivityCircle(opt){
    this.item = '<div style="background-color:'+opt.bgColor+';width:'+opt.size+'px;height:'+opt.size+'px;"></div>';
    var tmpHtml = [this.item,this.item,this.item].join('');
    this.template='<div class="la-ball-scale-multiple">'+tmpHtml+'</div>';
}
var ActivityData = {
    'xy100':0,
    '100-500':0,
    '500-1000':0,
    'dy1000':0,
    typeColors:{
        'xy100':'#0050B3',
        '100-500':'#1890FF',
        '500-1000':'#69C0FF',
        'dy1000':'#BAE7FF'
    },
    typeSizes:{
        'xy100':58,
        '100-500':78,
        '500-1000':98,
        'dy1000':118
    },
    typeOffsets:{
        'xy100':{left:8,top:6},
        '100-500':{left:16,top:16},
        '500-1000':{left:22,top:30},
        'dy1000':{left:30,top:40}
    },
    typeWidths:[
        {txt:'小于100人'},
        {txt:'101~500人'},
        {txt:'501~1000人'},
        {txt:'大于1000人'}
    ],
    progressBox:null,
    progressItems:null,
    progressBoxHtml:'<div class="rank-progress-box"><span class="title">活跃度</span><div>',
    getMatchColor:function(aNums){
        if(aNums<=100){
            this['xy100']++;
            return 'xy100';
        }else if(aNums>100&&aNums<=500){
            this['100-500']++;
            return '100-500';
        }else if(aNums>500&&aNums<=1000){
            this['500-1000']++;
            return '500-1000';
        }else if(aNums>1000){
            this['dy1000']++;
            return 'dy1000';
        }
    },
    calcWidPercent:function(){
        var tmpArr = [],sum =0;
        _.each(this.typeColors,function(v,k){
            tmpArr.push(this[k]);
            sum+=this[k];
        },this);
        _.each(tmpArr,function(v,i){
            var percent=v==0?0:((v/sum)*100).toFixed(1);
            this.typeWidths[i].wid = percent;
            this.typeWidths[i].widTxt = percent+'%';
        },this);
    },
    setProgresses:function(){
        this.progressBox = $(this.progressBoxHtml);
        this.progressBox.appendTo('#activity-rank');
        this.progressBox.children('div:not(.progress)').remove();
        _.each(this.typeWidths,function(item){
            this.progressBox.append('<div class="progress"><p class="notice"><span class="level">'+item.txt+'</span><span class="percent">'+item.widTxt+'</span></p></div>');
        },this);
        this.progressBox.appendTo('#activity-rank');
        this.progressItems = this.progressBox.children('.progress');
        this.notices = this.progressBox.find('.notice');
        _.each(this.typeWidths,function(item,i){
            if(this.typeWidths[i].wid=='0.0'){
                this.notices.eq(i).hide();
            }
            if(i%2!=0){
                this.notices.eq(i).css('bottom','11px');
            }
            if(i>0&&i<this.typeWidths.length){
                var tmpArr = this.typeWidths.slice(0,i+1),tmpSum = 0;
                _.each(tmpArr,function(item2){
                    tmpSum+=parseFloat(item2.wid);
                    if(tmpSum>100){
                        tmpSum=100.0;
                    }
                });
                this.progressItems.eq(i).css('width',tmpSum+'%');
                this.notices.eq(i).css({
                    'left':'100%',
                    'transform':'translateX(-75%)'
                });
            }else{
                this.progressItems.eq(i).css('width',item.wid+'%');
            }
        },this);
    },
    resetData:function(){
        this.notices.remove();
        this.notices = null;
        this.progressItems.remove();
        this.progressItems = null;
        _.each(this.typeWidths,function(item,i){
            item.wid = 0;
            item.widTxt = '';
        },this);
        this['xy100'] = 0;
        this['100-500'] = 0;
        this['500-1000'] = 0;
        this['dy1000'] = 0;
        this.progressBox.remove();
        this.progressBox = null;
    }
}
window.TWEEN = require('@/scripts/TWEEN').TWEEN;
import Vue from 'vue';
//------数值变化
Vue.component('fj-animate-num',{
    render:function(createElement){
        return createElement('span',{
            domProps:{
                innerText:this.tweenMovingVal
            }
        }
    );
    },
    props:{
        value:{
            type:Number,
            required:true
        },
        duration:{
            type:Number,
            default:500
        },
        zero:{
            type:Number,
            default:0
        }
    },
    data:function(){
        return {tweenMovingVal:0};
    },
    mounted:function(){
        this.tween(0,this.value);
    },
    methods:{
        tween:function(startValue,endValue){
            var vm=this;
            function animate(){
                if(TWEEN.update()){
                    if(window.requestAnimationFrame){
                            requestAnimationFrame(animate);
                    }else{
                        clearTimeout(timer);
                        var timer=setTimeout(animate,16);
                    }
                }
            }
            startValue=0;
            new TWEEN.Tween({tweenMovingVal:startValue})
            .to({tweenMovingVal:endValue},this.duration)
            .onUpdate(function(val){
                vm.tweenMovingVal=(startValue+(endValue - startValue)*val).toFixed(vm.zero);
            }).start();
            //
            animate();
        }
    },
    watch:{
        value:function(newVal,oldVal){
            this.tween(parseInt(oldVal),parseInt(newVal));
        }
    }
});
import fjBreadNav from '@/components/fjBreadNav';
export default {
    name:'fjDataCenter',
    data:function(){
        return {
            activityBtns:[ //活跃度三个筛选按钮
                {txt:'今日',type:'dd',selected:true},
                {txt:'本周',type:'iw',selected:false},
                {txt:'本月',type:'mm',selected:false}
            ],
            IAmonthVal:'', //信息采集月份
            workMisVal:'', //工作任务月份
            deptRankVal:'',//单位排名月份
            reportRankVal:'', //人员排名月份
            value4:'',
            breadData:[ //面包屑导航
                {name:'当前位置:',path:''},
                {name:'数据中心',path:''}
            ],
            activitySum:0, //活跃度总数
            activitySumArr:[], //活跃度位数
            activeRankData:null, //地区活跃度排名数据
            infoAcqChart:null,  //信息采集数图表
            infoAcqChartDom:'', //图表dom
            IACoptions:{   //信息采集数图表数据
                tooltip:{
					trigger:'item',
					formatter:'日期：{b}\t\t<br>采集数：{c}\t\t',
					textStyle:{
                        fontSize:'12',
                        fontFamily:'PingFangSC',
						color:'rgba(0,0,0,.65)',
					},
					padding:[10,6],
					backgroundColor:'#fff',
					extraCssText:'box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);'
				},
                title:{
					show:true,
					text:'信息采集数',
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
                    axisLine:{
                        lineStyle:{
                            color:'#D9D9D9'
                        }
                    },
                    axisLabel:{
                        color:'rgba(0,0,0,.65)',
                        fontFamily:'PingFangSC',
                    },
					data: []
				},
				yAxis: {
                    type: 'value',
                    axisLabel:{
                        color:'rgba(0,0,0,.65)',
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
				},
				series: [{
					data: [],
					type: 'line',
					lineStyle:{
						color:'#2FC25B'
					},
					itemStyle:{
						borderColor:'#2FC25B'
					}
				}]
            },
            acqTypeChart:null,  //采集台账类型图表
            acqTypeChartDom:'', //图表dom
            ATCoption:{   //采集台账类型图表数据
                tooltip:{
					trigger:'item',
					formatter:'类型：{b}\t\t<br>采集数：{c}\t\t',
					textStyle:{
                        fontSize:'12',
                        fontFamily:'PingFangSC',
						color:'rgba(0,0,0,.65)',
					},
					padding:[10,6],
					backgroundColor:'#fff',
					extraCssText:'box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);'
				},
                title:{
					show:true,
					text:'采集台账类型',
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
                            color:'#D9D9D9'
                        }
                    },
					axisLabel:{
                        color:'rgba(0,0,0,.65)',
                        fontFamily:'PingFangSC',
						interval:0   //设置标签间隔：强制显示所有标签
					},
					itemStyle:{
						color:'#000'
					},
					data: [
						/* {
							value:'巡逻情况'
						},
						{
							value:'安全检查'
						},
						{
							value:'服务群众'
						},
						{
							value:'秩序维护'
						},
						{
							value:'纠纷调解'
						},
						{
							value:'基本信息'
						},
						{
							value:'走访群众'
						} */
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
				series: [
					{
						data: [
							/* {
								name:'',
								value:'300',
								itemStyle:{
									color:'#1890FF',
								}
							},
							{
								name:'',
								value:'600',
								itemStyle:{
									color:'#1890FF'
								}
							},
							{
								name:'',
								value:'800',
								itemStyle:{
									color:'#1890FF',
								}
							},
							{
								name:'',
								value:'200',
								itemStyle:{
									color:'#1890FF'
								}
							},
							{
								name:'',
								value:'600',
								itemStyle:{
									color:'#1890FF'
								}
							},
							{
								name:'',
								value:'600',
								itemStyle:{
									color:'#1890FF'
								}
							},
							{
								name:'',
								value:'600',
								itemStyle:{
									color:'#1890FF'
								}
							} */
						],
						type: 'bar',
						barWidth:'24px',
						barMaxWidth:'24px'
					}
				]
            },
            infoAcqAreaChart:null, //信息采集地区分布图表
            infoAcqAreaChartDom:'',//图表dom
            infoAcqAreaColors:['#4ecccb','#759feb','#b48ced','#9661e5','#8c7cd4','#869ce8','#455287','#73b88b','#eca577','#fdd34d','#aceb79','#87e1a1'],  //颜色
            IAACoption:{   //信息采集地区分布图表数据
                tooltip:{
					trigger:'item',
					formatter:'{b}:\t\t{c}\t\t(\t\t{d}%\t\t)',
					textStyle:{
                        fontSize:'12',
                        fontFamily:'PingFangSC',
						color:'rgba(0,0,0,.65)',
					},
					padding:[10,6],
					backgroundColor:'#fff',
					extraCssText:'box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);'
				},
                title : {
                    text: '信息采集地区分布',
                    subtext: '',
                    //x:'left'
                    left:'30',
                    textStyle:{
                        fontSize:'12',
                        fontFamily:'PingFangSC',
						color:'rgba(0,0,0,.65)',
					}
                },
                calculable : true,
                series : [
                    {
                        name:'半径模式',
                        type:'pie',
                        center : ['50%', '50%'],
                        radius:[0,'90%'],
                        roseType:'radius',
                        label: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        lableLine: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        itemStyle:{
                            borderColor:'rgba(0,0,0,.25)'
                        },
                        /* markLine:{
                            show:true,
                            data:{
                                0:{},
                                1:{}
                            }
                        }, */
                        data:[]
                    }
                ]
            },
            fSixRankData:null, //排名前六地区
            bSixRankData:null, //排名后六地区
            //工作任务统计四个环形
            workMisChartsObjs:null,
            workMisCharts:[null,null,null,null],
            workMisChartsDom:['','','',''],
            workMisChartsData:[
                {
                    tooltip:{
                        trigger:'item',
                        formatter:'任务类型：{b}\t\t<br>数量：{c}\t\t',
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
                            name:'',
                            type:'pie',
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            itemStyle:{
							    borderColor:'#fff',
							    borderWidth:'2'
						    },
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data:[
                                {
                                    value:0,
                                    name:'',
                                    itemStyle:{
                                        color:'#F2637B'
                                    }
                                },
                                {
                                    value:0,
                                    name:'',
                                    itemStyle:{
                                        color:'#f0f2f5'
                                    },
                                    emphasis:{
                                        itemStyle:{color:'rgba(0,0,0,.25)'}
                                    }
                                }
                            ]
                        }
                    ]
                },{
                    tooltip:{
                        trigger:'item',
                        formatter:'任务类型：{b}\t\t<br>数量：{c}\t\t',
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
                            name:'',
                            type:'pie',
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            itemStyle:{
							    borderColor:'#fff',
							    borderWidth:'2'
						    },
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data:[
                                {
                                    value:60,
                                    name:'已完成',
                                    itemStyle:{
                                        color:'#1890FF'
                                    }
                                },
                                {
                                    value:40,
                                    name:'待处理',
                                    itemStyle:{
                                        color:'#f0f2f5'
                                    },
                                    emphasis:{
                                        itemStyle:{color:'rgba(0,0,0,.25)'}
                                    }
                                }
                            ]
                        }
                    ]
                },{
                    tooltip:{
                        trigger:'item',
                        formatter:'任务类型：{b}\t\t<br>数量：{c}\t\t',
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
                            name:'',
                            type:'pie',
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            itemStyle:{
							    borderColor:'#fff',
							    borderWidth:'2'
						    },
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data:[
                                {
                                    value:60,
                                    name:'已完成',
                                    itemStyle:{
                                        color:'#FAD337'
                                    }
                                },
                                {
                                    value:40,
                                    name:'待处理',
                                    itemStyle:{
                                        color:'#f0f2f5'
                                    },
                                    emphasis:{
                                        itemStyle:{color:'rgba(0,0,0,.25)'}
                                    }
                                }
                            ]
                        }
                    ]
                },{
                    tooltip:{
                        trigger:'item',
                        formatter:'任务类型：{b}\t\t<br>数量：{c}\t\t',
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
                            name:'',
                            type:'pie',
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            itemStyle:{
							    borderColor:'#fff',
							    borderWidth:'2'
						    },
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data:[
                                {
                                    value:60,
                                    name:'已完成',
                                    itemStyle:{
                                        color:'#36CBCB'
                                    }
                                },
                                {
                                    value:40,
                                    name:'待处理',
                                    itemStyle:{
                                        color:'#f0f2f5',
                                    },
                                    emphasis:{
                                        itemStyle:{color:'rgba(0,0,0,.25)'}
                                    }
                                }
                            ]
                        }
                    ]
                }
            ],
            //工作任务总数
            misSumChart:null,  //工作任务总数图表
            misSumChartDom:'', //图表dom
            MSCoption:{   //工作任务总数图表数据
                tooltip:{
					trigger:'item',
					formatter:'日期：{b}\t\t<br>任务数：{c}\t\t',
					textStyle:{
                        fontSize:'12',
                        fontFamily:'PingFangSC',
						color:'rgba(0,0,0,.65)',
					},
					padding:[10,6],
					backgroundColor:'#fff',
					extraCssText:'box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);'
				},
                title:{
                    text: '工作任务总数',
                    subtext: '',
					textStyle:{
                        color:'#000',
                        fontFamily:'PingFangSC',
						fontSize:14
					},
                    //x:'left'
                    left:'30'
                },
                xAxis: {
                    type: 'category',
                    axisLine:{
                        lineStyle:{
                            color:'#D9D9D9'
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
                    axisLabel:{
                        color:'rgba(0,0,0,.65)',
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
            //工作任务地区分布
            misAreaChart:null, //工作任务地区分布图表
            misAreaChartDom:'', //图表dom
            MACopotion:{     //工作任务地区分布图表数据
                tooltip:{
					trigger:'item',
					formatter:'日期：{b}\t\t<br>任务数：{c}\t\t',
					textStyle:{
                        fontSize:'12',
                        fontFamily:'PingFangSC',
						color:'rgba(0,0,0,.65)',
					},
					padding:[10,6],
					backgroundColor:'#fff',
					extraCssText:'box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);'
				},
                title:{
					show:true,
					text:'工作任务地区分布',
					textStyle:{
                        color:'#000',
                        fontFamily:'PingFangSC',
						fontSize:14
					},
					left:'30'
				},
				xAxis: {
					type: 'category',
                    boundaryGap:true,
                    axisLine:{
                        lineStyle:{
                            color:'#D9D9D9'
                        }
                    },
					axisLabel:{
                        color:'rgba(0,0,0,.65)',
                        fontFamily:'PingFangSC',
						interval:0   //设置标签间隔：强制显示所有标签
					},
					itemStyle:{
						color:'#000'
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
				series: [
					{
						data: [],
						type: 'bar',
						barWidth:'24px',
						barMaxWidth:'24px'
					}
				]
            },
            //单位考核排名数据
            unitAssesData:null,
            //
            personAssesData:null,
            qqMap:null,  //腾讯地图
            count:0,
            lineH:0,
            tlLine:'',
            area_parent:'00001',  //获取区域经纬度用-初始id
            areaInfos:[],   //区域地图数据
            areaCenters:[], //区域中心点
            areaColors:['#DDA0DD','#7B68EE','#48D1CC','#EEE8AA','#FFDEAD','#8B475D'],
            circleColors:['#BAE7FF','#69C0FF','#1890FF','#0050B3'],
            setLabelsOffset:{
                '3':function(){
                    return new qq.maps.Size(-18, 10);
                },
                '7':function(){
                    return new qq.maps.Size(-58, 10);
                },
            },
            polygons:[],
            labels:[],
            circles:[],
        };
    },
    beforeRouteEnter:function(to,from,next){ //路由守卫
        next(function(vm){
            //重新绑定resize事件
            $(window).off('resize').on('resize',_.debounce(_.bind(function(){
                //设置图表
                vm.setDataCenterCharts();
            },this),200));
        });
    },
    beforeRouteLeave:function(to,from,next){
        $(window).off('resize');
        next();
    },
    mounted:function(){
        //设置默认时间
        var initMonth = fjPublic.date2Month(new Date());
        this.IAmonthVal=initMonth; //信息采集月份
        this.workMisVal=initMonth; //工作任务月份
        this.deptRankVal=initMonth;//单位排名月份
        this.reportRankVal=initMonth; //人员排名月份
        this.requestDatas().then(_.bind(function(){
            //活跃度排名---地图
			_.delay(_.bind(function(){
				this.mapOption={
					center:'',		// 地图的中心地理坐标。
					scaleControl: true,	//比例尺
					disableDoubleClickZoom : true,
					zoom:parseInt(fjPublic.cityInfos.initZoomDc),
					mapTypeId: qq.maps.MapTypeId.ROADMAP, //该地图类型显示普通的街道地图。
					mapTypeControl:false, //不显示地图类型控件
					panControl:false,   //不显示平移控件
					zoomControl:false,  //不显示缩放控件
					scaleControl:true,  //不显示比例尺控件
				};
                this.initMapCenter = new qq.maps.LatLng(fjPublic.cityInfos.lat,fjPublic.cityInfos.lng);
				this.$set(this.mapOption,'center',this.initMapCenter);
                this.qqMap = new qq.maps.Map(document.getElementById('fj-dc-map'),this.mapOption);
                this.setCircleColorSize();
                this.setAreaPolyLine();
                this.setAreaCircle();
			},this),200);
            //设置图表
            this.setDataCenterCharts();
            //活跃度排名表格滑动
            this.rankTableSlide();
            //页面resize时候，重新设置图表
            $(window).off('resize').on('resize',_.debounce(_.bind(function(){
                //设置图表
                this.setDataCenterCharts();
            },this),200));
        },this));
        return;
    },
    methods:{
        setActivitySumValue:function(){ //活跃度总数排名分位数
            if(this.activitySumArr.length){
                this.activitySumArr.splice(0,this.activitySumArr.length);
            }
            function format_number(nStr){
                nStr += '';  
                var x = nStr.split('.');  
                var x1 = x[0];  
                var x2 = x.length>1?'.'+x[1]:'';  
                var rgx = /(\d+)(\d{3})/;  
                while (rgx.test(x1)) {
                    x1=x1.replace(rgx,'$1'+','+'$2');  
                }  
                return x1+x2;  
            }
            var tmpArr = format_number(this.activitySum).split('');
            _.each(tmpArr,function(v,i){
                if(v!=','){v=parseInt(v);}
                this.activitySumArr.push(v);
            },this);
        },
        toggleUpRankPop:function(ev){ //收起排名列表
            var $this = $(ev.currentTarget);
            $this.closest('.rank-pop').css({'right':'-150%'}).end().closest('.rank-pop').siblings('.el-icon-d-arrow-left').show();
        },
        toggleDownRankPop:function(ev){ //展开排名列表
            var $this = $(ev.currentTarget);
            $this.siblings('.rank-pop').css({'right':'20px'}).end().hide();
        },
        setAreaCircle:function(){ //设置圆环
            var Label = function(opts) {
                qq.maps.Overlay.call(this, opts);
                this.options = opts;
            }
            var mask = this.mask =document.body.querySelector('#fj-dc-map_mask')
            //继承Overlay基类
            Label.prototype = new qq.maps.Overlay();
            //定义construct,实现这个接口来初始化自定义的Dom元素
            Label.prototype.construct = function() {
                this.dom = document.createElement('div');
                this.dom.setAttribute('class','a')
                this.dom.style.cssText='position:absolute;';
                this.dom.innerHTML = new ActivityCircle({
                    bgColor:this.options.bgColor,
                    size:this.options.size
                }).template;
                //将dom添加到覆盖物层，overlayLayer的顺序为容器 1，此容器中包含Polyline、Polygon、GroundOverlay等
                //this.getPanes().overlayLayer.appendChild(this.dom);
                //将dom添加到覆盖物层，overlayMouseTarget的顺序容器 5，此容器包含透明的鼠标相应元素，用于接收Marker的鼠标事件
                this.getPanes().overlayMouseTarget.appendChild(this.dom);
                //mask.appendChild(this.dom);
            }
            //绘制和更新自定义的dom元素
            Label.prototype.draw = function() {
                //获取地理经纬度坐标
                var position = this.get('position');
                if (position) {
                    var pixel = this.getProjection().fromLatLngToDivPixel(position);
                    if(this.options.offset){
                        this.dom.style.left = pixel.getX()-this.options.offset.left + 'px';
                        this.dom.style.top = pixel.getY()-this.options.offset.top + 'px';
                    }
                }
            }
            Label.prototype.destroy = function() {
                //移除dom
                this.dom.parentNode.removeChild(this.dom);
            }
            _.each(this.areaCenters,function(item,i){
                var tmplat = parseFloat(item.lat);
				var tmplat2 = item.lat;
				var tmplng = parseFloat(item.lng);
				var tmplng2 = item.lng;
				if(tmplat > tmplng){
					item.lat = tmplng2;
					item.lng = tmplat2;
				}
                var center = new qq.maps.LatLng(item.lat, item.lng);
                this.circles.push(
                    new Label({
                        map: this.qqMap,
                        position: center,
                        bgColor:this.areaInfos[i].bgColor,
                        size:this.areaInfos[i].size,
                        offset:this.areaInfos[i].offset
                    })
                );
            },this);
        },
        setCircleColorSize:function(){  //根据活跃人数设置circle的背景色
            _.each(this.activeRankData,function(item){
                var colorKey = ActivityData.getMatchColor(item.nums);
                this.$set(item,'bgColor',ActivityData.typeColors[colorKey]);
                this.$set(item,'size',ActivityData.typeSizes[colorKey]);
                this.$set(item,'offset',ActivityData.typeOffsets[colorKey]);
            },this);
            //console.log(this.areaInfos);
            _.each(this.areaInfos,function(item,i){
                var tmpObj = _.find(this.activeRankData,function(item2){
                    return item2.deptName.indexOf(item.area_name.substr(0,2))!=-1;
                });
                //console.log(tmpObj);
                if(tmpObj){
                    this.$set(item,'bgColor',tmpObj.bgColor);
                    this.$set(item,'size',tmpObj.size);
                    this.$set(item,'offset',tmpObj.offset);
                }
            },this);
            ActivityData.calcWidPercent();
            ActivityData.setProgresses();
        },
        setAreaPolyLine:function(){ //绘制区域轮廓线
            var vm = this;
            if(this.polygons.length>0){
                _.each(this.polygons,function(item){
                    item.setMap(null);
                    item = null;
                },this);
                this.polygons.splice(0,this.polygons.length);
            }
            if(this.labels.length>0){
                _.each(this.labels,function(item){
                    _.each(item,function(item2){
                        item2.setMap(null);
                        item2 = null;
                    });
                    item = null;
                },this);
                this.labels.splice(0,this.labels.length);
            }
            if(this.circles.length>0){
                _.each(this.circles,function(item){
                    item.setMap(null);
                    item = null;
                },this);
                this.circles.splice(0,this.circles.length);
            }
            this.areaCenters.splice(0,this.areaCenters.length);
			_.each(this.areaInfos,function(item,i){
                var path_count = parseInt(item.path_count);
                var pathArr = [];
                for(var k = 0;k<path_count;k++){
                    var path = [];
                    _.each(item.positions[k].positions,function(pos){
					    path.push(new qq.maps.LatLng(pos.lat,pos.lng));
                    });
                    pathArr.push(path);
                }
                this.polygons.push(
                    new qq.maps.Polygon({
                        cursor: 'crosshair',
                        map: this.qqMap,
                        path: pathArr,
                        cursor: 'crosshair',
                        strokeColor:new qq.maps.Color(0,0,0,.8),
                        fillColor:'#F0F2F5',
                        strokeDashStyle: 'solid'
                    })
                );
                var offsetVal;
                if(item.area_name.length+'' in this.setLabelsOffset){
                    offsetVal = this.setLabelsOffset[item.area_name.length].call(this);
                }else{
                    offsetVal = new qq.maps.Size(0, 0);
                }
                //item.areaCenter
                var labelInfoArr = [];
                _.each(item.areaCenter,function(item2,k){
                    var tmplat = parseFloat(item2.area_center_lat);
                    var tmplat2 = item2.area_center_lat;
                    var tmplng = parseFloat(item2.area_center_lng);
                    var tmplng2 = item2.area_center_lng;
                    if(tmplat > tmplng){
                        item2.area_center_lat = tmplng2;
                        item2.area_center_lng = tmplat2;
                    }
                    if(k ==0){
                        this.areaCenters.push({
                            lat:item2.area_center_lat,
                            lng:item2.area_center_lng
                        });
                    }
                    labelInfoArr.push(
                        new qq.maps.Label({
                            content:item.area_name,
                            map: this.qqMap,
                            //相对于position位置偏移值，x方向向右偏移为正值，y方向向下偏移为正值，反之为负。
                            offset:offsetVal,
                            //标签位置坐标，若offset不设置，默认标签左上角对准该位置。
                            position: new qq.maps.LatLng(item2.area_center_lat,item2.area_center_lng),
                            style:{
                                border:'none',background:'transparent',fontSize:'18px',color:'rgba(0,0,0,1)'
                            }
                        })
                    );
                },this);
                this.labels.push(labelInfoArr);
            },this);
		},
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
        getCountActivenessRank:function(type){ //获取活跃度排名数据
            var typeVal = type||'dd';
            var defer = $.Deferred();
			var vm = this;
			$.ajax({
				url:fjPublic.ajaxUrlDNN+'/countActivenessRank',
				type:'POST',
				data:{type:typeVal},
				dataType:'json',
				success:function(data){
                    //console.log(data);
                    vm.activeRankData = data.list;
                    //加个序号字段
                    _.each(vm.activeRankData,function(item,i){
                        vm.activitySum += item.nums;
                        vm.$set(item,'index',i+1);
                    });
                    //设置活跃度总数的位数
                    vm.setActivitySumValue();
					defer.resolve();
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
        },
        getCountInfoOrders:function(dateValue){ //获取采集数据统计的数据
            var dateVal = dateValue||'';
            var defer = $.Deferred();
			var vm = this;
			$.ajax({
				url:fjPublic.ajaxUrlDNN+'/countInfoOrders',
				type:'POST',
				data:{month:dateVal}, //默认当前月份
				dataType:'json',
				success:function(data){
                    //console.log(data);
                    //信息采集数据图表
                    vm.IACoptions.series[0].data.splice(0,vm.IACoptions.series[0].data.length);
                    vm.IACoptions.xAxis.data.splice(0,vm.IACoptions.xAxis.data.length);
                    _.each(data.numCountList,function(item,i){
                        vm.IACoptions.series[0].data.push({
						    value:0,
						    emphasis:{
							    itemStyle:{
								    color:'#2FC25B'
                                }
                            }
                        });
                        vm.$set(vm.IACoptions.series[0].data[i],'value',item.nums);
                        //
                        vm.IACoptions.xAxis.data.push({value:'12/01'});
                        vm.$set(vm.IACoptions.xAxis.data[i],'value',item.insTime.substr(5,5));
                    });
                    //采集台账类型图表的数据
                    vm.ATCoption.series[0].data.splice(0,vm.ATCoption.series[0].data.length);
                    vm.ATCoption.xAxis.data.splice(0,vm.ATCoption.xAxis.data.length);
                    _.each(data.typeCountList,function(item,i){
                        vm.ATCoption.series[0].data.push({
							name:'',
							value:0,
                            itemStyle:{
                                color:'#1890FF',
                            }
                        });
                        vm.$set(vm.ATCoption.series[0].data[i],'value',item.nums);
                        //
                        vm.ATCoption.xAxis.data.push({value:''});
                        vm.$set(vm.ATCoption.xAxis.data[i],'value',item.infoDesc.slice(0,4));
                    });
                    //地区分布图表的数据
                    vm.IAACoption.series[0].data.splice(0,vm.IAACoption.series[0].data.length);
                    var deptCountList = _.filter(data.deptCountList,function(item){
                        return item.deptId!='411342000000';
                    });
                    _.each(deptCountList,function(item,i){
                        vm.IAACoption.series[0].data.push({
                            value:0,
                            name:'',
                            itemStyle:{
                                color:vm.infoAcqAreaColors[i],
                                borderColor:'#fff'
                            }
                        });
                        vm.$set(vm.IAACoption.series[0].data[i],'value',item.nums);
                        vm.$set(vm.IAACoption.series[0].data[i],'name',item.deptName);
                    });
                    //地区排名数据
                    var tmpSplitArr = _.partition(deptCountList,function(item,i){
                        return i<=5;
                    });
                    vm.fSixRankData = null;
                    vm.fSixRankData = tmpSplitArr[0]; //前6
                    _.each(vm.fSixRankData,function(item,i){
                        vm.$set(item,'rank',i+1);
                    });
                    vm.bSixRankData = null;
                    vm.bSixRankData = tmpSplitArr[1]; //后6
                    _.each(vm.bSixRankData,function(item,i){
                        vm.$set(item,'rank',vm.fSixRankData.length+i+1);
                    });
					defer.resolve();
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
        },
        getcountMissions:function(dateValue){ //获取工作任务统计数据
            var dateVal = dateValue||'';
            var defer = $.Deferred();
			var vm = this;
			$.ajax({
				url:fjPublic.ajaxUrlDNN+'/countMissions',
				type:'POST',
				data:{month:dateVal},  //默认当月
				dataType:'json',
				success:function(data){
                    //console.log(data);
                    //工作任务统计---四个环形图表
                    var tmpStatesArr = [
                        {state:0,name:'待处理'},
                        {state:1,name:'进行中'},
                        {state:2,name:'待审核'},
                        {state:3,name:'审核完成'}
                    ];
                    var misSum =0;
                    _.each(data.typeCountList,function(item){
                        //item.nums+=1.5;
                        misSum+=item.nums
                    }); //任务总数
                    _.each(data.typeCountList,function(item,i){
                        //
                        var tmpObj = _.find(tmpStatesArr,function(item3){
                            return item3.state == item.missionState
                        });
                        tmpObj.nums = item.nums*1;
                        if(item.nums==0&&misSum==0){
                            tmpObj.percent = '0.0%';
                        }else{
                            tmpObj.percent = ((item.nums/misSum)*100).toFixed(1)+'%';
                        }
                        var tmpArr = [tmpObj,{
                            name:'其它类型',
                            nums:misSum - item.nums
                        }];
                        _.each(vm.workMisChartsData[i].series[0].data,function(item2,j){
                            vm.$set(item2,'name',tmpArr[j].name);
                            vm.$set(item2,'value',tmpArr[j].nums);
                            vm.$set(item2,'percent',tmpArr[j].percent||'');
                        });
                    });
                    //工作任务总数图表数据
                    vm.MSCoption.series[0].data.splice(0,vm.MSCoption.series[0].data.length);
                    vm.MSCoption.xAxis.data.splice(0,vm.MSCoption.xAxis.data.length);
                    _.each(data.numCountList,function(item,i){
                        vm.MSCoption.series[0].data.push({
                            value:40,
                            emphasis:{
                                itemStyle:{
                                    color:'#1890FF'
                                }
                            }
                        });
                        //
                        vm.$set(vm.MSCoption.series[0].data[i],'value',item.nums);
                        //
                        vm.MSCoption.xAxis.data.push({value:''});
                        //
                        vm.$set(vm.MSCoption.xAxis.data[i],'value',item.insTime.substr(5,5));
                    });
                    //
                    vm.MACopotion.series[0].data.splice(0,vm.MACopotion.series[0].data.length);
                    vm.MACopotion.xAxis.data.splice(0,vm.MACopotion.xAxis.data.length);
                    _.each(data.deptCountList,function(item,i){
                        //item.nums+=10;
                        vm.MACopotion.series[0].data.push({
                            name:'',
                            value:'',
                            label:{align:'right'},
                            itemStyle:{color:'#1890FF',}
                        });
                        //
                        vm.$set(vm.MACopotion.series[0].data[i],'value',item.nums);
                        //
                        vm.MACopotion.xAxis.data.push({value:''});
                        //
                        vm.$set(vm.MACopotion.xAxis.data[i],'value',item.deptName.substr(0,3));
                    });
					defer.resolve();
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
        },
        getRankPoliceStationAppraise:function(dateValue){ //获取派出所考核排序数据
            var dateVal = dateValue||'';
            var defer = $.Deferred();
			var vm = this;
			$.ajax({
				url:fjPublic.ajaxUrlDNN+'/rankPoliceStationAppraise',
				type:'POST',
				data:{
                    month:dateVal
                }, //默认当月
				dataType:'json',
				success:function(data){
                    //console.log(data);
                    vm.unitAssesData = null;
                    vm.unitAssesData = data.list;
                    _.each(vm.unitAssesData,function(item,i){
                        vm.$set(item,'rank',i+1);
                    });
					defer.resolve();
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
        },
        getRankReportAppraise:function(dateValue){ //获取人员考核排序
            var dateVal = dateValue||'';
            var defer = $.Deferred();
			var vm = this;
			$.ajax({
				url:fjPublic.ajaxUrlDNN+'/rankReportAppraise',
				type:'POST',
				data:{month:dateVal}, //默认当月
				dataType:'json',
				success:function(data){
                    //console.log(data);
                    vm.personAssesData = data.list;
                    _.each(vm.personAssesData,function(item,i){
                        vm.$set(item,'rank',i+1);
                    });
					defer.resolve();
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
        },
        setAcqTypeChart:function(){ //设置采集台账类型图表
            if(!this.acqTypeChartDom&&!this.acqTypeChart){
				this.acqTypeChartDom = '<div class="line-bar-chart" id="acq-type-chart"></div>';
				this.acqTypeChart = this.$echarts.init(document.getElementById('acq-type-chart'));
                this.acqTypeChart.setOption(this.ATCoption);
			}else{
				this.acqTypeChart = null;
				var $acqTypeChart = $('#acq-type-chart');
				$acqTypeChart.parent().append(this.acqTypeChartDom);
				$acqTypeChart.remove();
				this.acqTypeChart = this.$echarts.init(document.getElementById('acq-type-chart'));
				this.acqTypeChart.setOption(this.ATCoption);
			}
        },
        setInfoAcqChart:function(){ //设置采集图表
            if(!this.infoAcqChartDom&&!this.infoAcqChart){
				this.infoAcqChartDom = '<div class="line-bar-chart" id="info-acq-chart"></div>';
				this.infoAcqChart = this.$echarts.init(document.getElementById('info-acq-chart'));
                this.infoAcqChart.setOption(this.IACoptions);
			}else{
				this.infoAcqChart = null;
				var $infoAcqChart = $('#info-acq-chart');
				$infoAcqChart.parent().prepend(this.infoAcqChartDom);
				$infoAcqChart.remove();
				this.infoAcqChart = this.$echarts.init(document.getElementById('info-acq-chart'));
				this.infoAcqChart.setOption(this.IACoptions);
			}
        },
        setInfoAcqAreaChart:function(){ //设置信息采集地区分布图表
            if(!this.infoAcqAreaChartDom&&!this.infoAcqAreaChart){
				this.infoAcqAreaChartDom = '<div class="pie-chart" id="info-acq-area-chart"></div>';
				this.infoAcqAreaChart = this.$echarts.init(document.getElementById('info-acq-area-chart'));
                this.infoAcqAreaChart.setOption(this.IAACoption);
			}else{
				this.infoAcqAreaChart = null;
				var $infoAcqAreaChart = $('#info-acq-area-chart');
				$infoAcqAreaChart.parent().prepend(this.infoAcqAreaChartDom);
				$infoAcqAreaChart.remove();
				this.infoAcqAreaChart = this.$echarts.init(document.getElementById('info-acq-area-chart'));
				this.infoAcqAreaChart.setOption(this.IAACoption);
			}
        },
        setWorkMisCharts:function(){ //工作任务统计---四个环形图表
            //
            var hasCharts = _.every(this.workMisCharts,function(item){return item==null;});
            if(hasCharts){
                this.workMisChartsObjs = $('#work-mis-types .circle-chart').get();
                _.each(this.workMisChartsData,function(item,i){
                    this.$set(this.workMisCharts,i,this.$echarts.init(this.workMisChartsObjs[i]));
                    this.$set(this.workMisChartsDom,i,'<div class="circle-chart"></div>');
                    //
                    this.workMisCharts[i].setOption(item);
                },this);
            }else{
                this.workMisChartsObjs = null;
                var chartsDomBox = $('#work-mis-types .type-count');
                chartsDomBox.children('.circle-chart').remove();
                //
                _.each(this.workMisCharts,function(item,i){
                    item = null;
                    chartsDomBox.eq(i).append(this.workMisChartsDom[i]);
                    var oCircle = chartsDomBox.eq(i).children('.circle-chart').get();
                    this.$set(this.workMisCharts,i,this.$echarts.init(oCircle[0]));
                    this.workMisCharts[i].setOption(this.workMisChartsData[i]);
                },this);
            }
        },
        setMisSumChart:function(){ //工作任务总数图表
            if(!this.misSumChartDom&&!this.misSumChart){
				this.misSumChartDom = '<div class="mis-sum-chart" id="mis-sum-chart"></div>';
                this.misSumChart = this.$echarts.init(document.getElementById('mis-sum-chart'));
                this.misSumChart.setOption(this.MSCoption);
			}else{
				this.misSumChart = null;
				var $misSumChart = $('#mis-sum-chart');
				$misSumChart.siblings('#work-mis-box').after(this.misSumChartDom);
				$misSumChart.remove();
                this.misSumChart = this.$echarts.init(document.getElementById('mis-sum-chart'));
                this.misSumChart.setOption(this.MSCoption);
			}
        },
        setMisAreaChart:function(){ //工作任务地区分布图表
            if(!this.misAreaChartDom&&!this.misAreaChart){
				this.misAreaChartDom = '<div class="mis-area-chart" id="mis-area-chart"></div>';
                this.misAreaChart = this.$echarts.init(document.getElementById('mis-area-chart'));
                this.misAreaChart.setOption(this.MACopotion);
			}else{
				this.misAreaChart = null;
				var $misAreaChart = $('#mis-area-chart');
				$misAreaChart.parent().append(this.misAreaChartDom);
				$misAreaChart.remove();
                this.misAreaChart = this.$echarts.init(document.getElementById('mis-area-chart'));
                this.misAreaChart.setOption(this.MACopotion);
			}
        },
        setDataCenterCharts:function(){ //设置该页面的图表
            //信息采集数图表
            this.setInfoAcqChart();
            //采集台账类型图表
            this.setAcqTypeChart();
            //信息采集地区分布图表
            this.setInfoAcqAreaChart();
            //工作任务统计---四个环形图表
            this.setWorkMisCharts();
            //工作任务总数图表
            this.setMisSumChart();
            //工作任务地区分布图表
            this.setMisAreaChart();
        },
		requestDatas:function(){  //向后台请求数据
			var vm = this,defer = $.Deferred();
			fjPublic.openLoad('数据加载中...');
            $.when(
                this.getHomePageArea(),
                this.getCountActivenessRank(),
                this.getCountInfoOrders(),
                this.getcountMissions(),
                this.getRankPoliceStationAppraise(),
                this.getRankReportAppraise()
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
        filterActiveData:function(info){ //筛选活跃度排名数据 （本日、本周、本月）
            if(info.selected)return;
            _.each(this.activityBtns,function(item,i){
                item.selected = false;
                if(info.type==item.type){
                    item.selected = true;
                }
            },this);
            //
            this.activitySum = 0;
            ActivityData.resetData();
            //
            fjPublic.openLoad('请求数据中...');
            //
            $.when(this.getCountActivenessRank(info.type)).done(_.bind(function(){
                fjPublic.closeLoad();
                this.rankTableSlide();
                //
                this.setCircleColorSize();
                this.setAreaPolyLine();
                this.setAreaCircle();
            },this));
        },
        filterIADatas:function(date){ //信息采集月份数据切换
            var monthVal = fjPublic.date2Month(date);
            //
            fjPublic.openLoad('请求数据中...');
            $.when(this.getCountInfoOrders(monthVal)).done(_.bind(function(){
                //信息采集数图表
            this.setInfoAcqChart();
            //采集台账类型图表
            this.setAcqTypeChart();
            //信息采集地区分布图表
            this.setInfoAcqAreaChart();
                fjPublic.closeLoad();
            },this));
        },
        filterWorkMisData:function(date){ //工作任务月份数据切换
            var monthVal = fjPublic.date2Month(date);
            //
            fjPublic.openLoad('请求数据中...');
            $.when(this.getcountMissions(monthVal)).done(_.bind(function(){
                //工作任务统计---四个环形图表
                this.setWorkMisCharts();
                //工作任务总数图表
                this.setMisSumChart();
                //工作任务地区分布图表
                this.setMisAreaChart();
                fjPublic.closeLoad();
            },this));
        },
        filterRankPoliceData:function(date){ //单位排名月份数据切换
            var monthVal = fjPublic.date2Month(date);
            //
            fjPublic.openLoad('请求数据中...');
            $.when(this.getRankPoliceStationAppraise(monthVal)).done(function(){
                fjPublic.closeLoad();
            });
        },
        filterRankReportData:function(date){ //人员考核排名月份数据切换
            var monthVal = fjPublic.date2Month(date);
            //
            fjPublic.openLoad('请求数据中...');
            $.when(this.getRankReportAppraise(monthVal)).done(function(){
                fjPublic.closeLoad();
            });
        },
        rankTableSlide:function(){  //活跃度排名表格滑动
            var oRankTable = $(this.$el).find('.fj-block:eq(1) .rank-pop .el-table');
            var aRows = oRankTable.find('tr.el-table__row');
            var aLen = aRows.length;
            if(!this.tlLine){
                this.tlLine = aLen;
            }
            var vm = this;
            if(aRows.length>this.tlLine){
                aRows.slice(this.tlLine).remove();
                aRows.parent().append(aRows.clone());
                this.lineH = aRows.first().height();
                this.count = 0;
                oRankTable.css({
                    '-webkit-transform':'translateY(0px)',
                    'transform':'translateY(0px)'
                });
                return;
            }
            this.lineH = aRows.first().height();
            this.count = 0;
            aRows.parent().append(aRows.clone());
            function tableSlide(){
                oRankTable.css({
                    '-webkit-transform':'translateY('+vm.lineH*-vm.count+'px)',
                    'transform':'translateY('+vm.lineH*-vm.count+'px)'
                });
                if(vm.count>aRows.length){
                    oRankTable.css({
                        '-webkit-transition':'none',
                        'transition':'none',
                        '-webkit-transform':'translateY(0px)',
                        'transform':'translateY(0px)'
                    });
                    vm.count = 1;
                    _.delay(function(){
                        oRankTable.css({
                            '-webkit-transition':'all .2s ease-in',
                            'transition':'all .2s ease-in',
                        });
                        tableSlide();
                    },200);
                    return;
                }
                vm.count++;
                _.delay(tableSlide,3000);
            }
            tableSlide();
        },
    },
    components:{
        fjBreadNav
    }
}
</script>
<style>
/*  */
.la-ball-scale-multiple {position: absolute;
	top: 50%;
	left: 50%;display: block;
	font-size: 0;
	color: #fff;
	margin: 0 auto;
	-webkit-transform: translate(-50%,-50%);
	-moz-transform: translate(-50%,-50%);
	-ms-transform: translate(-50%,-50%);
	transform: translate(-50%,-50%)}
.la-ball-scale-multiple>div {position: relative;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing:border-box;}

.la-ball-scale-multiple.la-dark {
	color: #333
}
.la-ball-scale-multiple>div {
	display: inline-block;
	float: none;
	border: 0 solid currentColor
}
.la-ball-scale-multiple {
	width: 38px;
	height: 38px;
}
.la-ball-scale-multiple>div {
	position: absolute;
	top: 0;
	left: 0;
	width: 38px;
    height: 38px;
    transform: scale(.5);
	border-radius: 100%;
	opacity: .2;
	-webkit-animation: ball-scale-multiple 1s 0s linear infinite;
	-moz-animation: ball-scale-multiple 1s 0s linear infinite;
	-o-animation: ball-scale-multiple 1s 0s linear infinite;
	animation: ball-scale-multiple 1s 0s linear infinite
}
.la-ball-scale-multiple>div:nth-child(2) {
	-webkit-animation-delay: .2s;
	-moz-animation-delay: .2s;
	-o-animation-delay: .2s;
	animation-delay: .2s;
}
.la-ball-scale-multiple>div:nth-child(3) {
	-webkit-animation-delay: .4s;
	-moz-animation-delay: .4s;
	-o-animation-delay: .4s;
	animation-delay: .4s;
}
@-webkit-keyframes ball-scale-multiple {
	0% {
		opacity: 0;
		-webkit-transform: scale(0);
		transform: scale(0)
	}
	5% {
		opacity: .85
	}
	100% {
		opacity: 0;
		-webkit-transform: scale(1);
		transform: scale(1)
	}
}
@-moz-keyframes ball-scale-multiple {
	0% {
		opacity: 0;
		-moz-transform: scale(0);
		transform: scale(0)
	}
	5% {
		opacity: .85
	}
	100% {
		opacity: 0;
		-moz-transform: scale(1);
		transform: scale(1)
	}
}
@-o-keyframes ball-scale-multiple {
	0% {
		opacity: 0;
		-o-transform: scale(0);
		transform: scale(0)
	}

	5% {
		opacity: .85
	}

	100% {
		opacity: 0;
		-o-transform: scale(1);
		transform: scale(1)
	}
}
@keyframes ball-scale-multiple {
	0% {
		opacity: 0;
		-webkit-transform: scale(0);
		-moz-transform: scale(0);
		-o-transform: scale(0);
		transform: scale(0)
	}

	5% {
		opacity: .85
	}

	100% {
		opacity: 0;
		-webkit-transform: scale(1);
		-moz-transform: scale(1);
		-o-transform: scale(1);
		transform: scale(1)
	}
}
.fj-content_view.data-center {padding:0px 18px;}
.fj-content_view.data-center > .fj-block.title {background:transparent;}
.fj-content_view.data-center > .fj-block.title + .fj-block {margin-top:0px;}
/* 活跃度排行 */
.fj-content_view.data-center .fj-block-body.activity-rank {position:relative;height:740px;}
.fj-content_view.data-center .fj-block-body.activity-rank > #fj-dc-map {position:relative;height:inherit;border:1px solid #fff;border-top:none;filter: blur(1px)}
/*  */
.fj-content_view.data-center .fj-block-body.activity-rank .rank-sum {position:absolute;top:8px;left:72px;z-index:2;}
.fj-content_view.data-center .fj-block-body.activity-rank .rank-sum > .title {line-height:22px;color:rgba(0,0,0,.45);}
.fj-content_view.data-center .fj-block-body.activity-rank .rank-sum > .count {font-size:24px;line-height:32px;color:rgba(0,0,0,.85);}
.fj-content_view.data-center .fj-block-body.activity-rank .rank-sum .count-last {margin-left:2px;font-size:14px;color:rgba(0,0,0,.45);}
/*  */
.fj-content_view.data-center .fj-block-body.activity-rank .rank-pop {position:absolute;right:20px;top:80px;width:310px;height:331px;padding:0px 20px;background:#fff;border:1px solid rgba(0,0,0,.2);border-radius:4px;z-index:2;overflow:hidden;}
.fj-content_view.data-center .fj-block-body.activity-rank .rank-pop > .title {padding:14px 0px;line-height:22px;color:rgba(0,0,0,0.85);}
.fj-content_view.data-center .fj-block-body.activity-rank .rank-pop > .title .el-icon-d-arrow-right {margin-top:3px;font-size:16px;}
.fj-content_view.data-center .fj-block-body.activity-rank .rank-pop > .rank-table-wrap {height:259px;max-height:259px;overflow:hidden;}
.fj-content_view.data-center .fj-block-body.activity-rank .rank-pop .el-table:before {display:none;}
.fj-content_view.data-center .fj-block-body.activity-rank .rank-pop .el-table td {padding:7px 0px;border-bottom:none;}
.fj-content_view.data-center .fj-block-body.activity-rank .rank-pop .rank-index {display:inline-block;width:22px;height:22px;border-radius:50%;background:rgba(0,0,0,.25);}
.fj-content_view.data-center .fj-block-body.activity-rank .rank-pop .el-table td {text-align:center;}
.fj-content_view.data-center .fj-block-body.activity-rank .rank-pop td .rank-index.wisdom {background:#1890FF;color:#fff;}
.fj-content_view.data-center .fj-block-body.activity-rank .rank-pop .el-table__header-wrapper {display:none;}
.fj-content_view.data-center .fj-block-body.activity-rank .el-icon-d-arrow-left {display:none;position:absolute;top:80px;right:20px;font-size:16px;z-index:1;}
/*  */
.fj-content_view.data-center .fj-block-body.activity-rank .rank-progress-box {position:absolute;left:76px;right:76px;bottom:60px;height:8px;z-index:2;}
.fj-content_view.data-center .fj-block-body.activity-rank .rank-progress-box > .title {position:absolute;top:-5px;left:-76px;width:76px;font-size:14px;text-align:center;}
.fj-content_view.data-center .fj-block-body.activity-rank .rank-progress-box > .progress {position:absolute;width:0%;height:100%;top:0;left:0;}
.fj-content_view.data-center .fj-block-body.activity-rank .rank-progress-box > .progress:first-of-type {background:#0050B3;z-index:4;}
.fj-content_view.data-center .fj-block-body.activity-rank .rank-progress-box > .progress:nth-of-type(2) {background:#1890FF;z-index:3;}
.fj-content_view.data-center .fj-block-body.activity-rank .rank-progress-box > .progress:nth-of-type(3) {background:#69C0FF;z-index:2;}
.fj-content_view.data-center .fj-block-body.activity-rank .rank-progress-box > .progress:last-of-type {background:#BAE7FF;z-index:1;}
.fj-content_view.data-center .fj-block-body.activity-rank .rank-progress-box .notice {position:absolute;bottom:-34px;left:0;padding-left:25px;line-height:32px;font-size:12px;width:168px;background:rgba(0,0,0,.6);border-radius:6px;color:#fff;} /* 修改 */
.fj-content_view.data-center .fj-block-body.activity-rank .rank-progress-box .notice:after {content:'';position:absolute;top:50%;left:10px;width:8px;height:8px;margin-top:-5px;}
.fj-content_view.data-center .fj-block-body.activity-rank .rank-progress-box .notice > .level {margin-right:20px;}
/*  */
.fj-content_view.data-center .fj-block-body.activity-rank .rank-progress-box > .progress:nth-of-type(2) > .notice:after {background:#1890FF;}
.fj-content_view.data-center .fj-block-body.activity-rank .rank-progress-box > .progress:nth-of-type(3) > .notice:after {background:#69C0FF;}
.fj-content_view.data-center .fj-block-body.activity-rank .rank-progress-box > .progress:last-of-type > .notice:after {background:#BAE7FF;}
.fj-content_view.data-center .fj-block-body.activity-rank .rank-progress-box > .progress:first-of-type > .notice:after {background:#0050B3;}
.fj-content_view.data-center .fj-block-body.activity-rank #fj-dc-map_mask {position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(255,255,255,.2);}
/* 信息采集数统计 */
.fj-content_view.data-center .fj-block-body.info-acq {padding:10px 0px;}
.fj-content_view.data-center .fj-block-body.info-acq .line-bar-area {height:380px;}
.fj-content_view.data-center .fj-block-body.info-acq .line-bar-area > .line-bar-chart {float:left;width:50%;height:100%;}
/*  */
.fj-content_view.data-center .fj-block-body.info-acq .pie-area {height:380px;}
.fj-content_view.data-center .fj-block-body.info-acq .pie-area > * {float:left;width:50%;height:100%;}
/*  */
.fj-content_view.data-center .fj-block-body.info-acq .area-rank-box {text-align:center;padding-top:28px;}
.fj-content_view.data-center .fj-block-body.info-acq .area-rank-box > .title {line-height:22px;color:rgba(0,0,0,.85);}
.fj-content_view.data-center .fj-block-body.info-acq .rank-table-box > * {float:left;width:50%;padding-right:18px;}
.fj-content_view.data-center .fj-block-body.info-acq .rank-table-box .rank-line {line-height:22px;margin-bottom:18px;}
.fj-content_view.data-center .fj-block-body.info-acq .rank-table-box .rank-line.title {color:rgba(0,0,0,.85);}
.fj-content_view.data-center .fj-block-body.info-acq .rank-table-box .rank-line > .name {width:52%;}
.fj-content_view.data-center .fj-block-body.info-acq .rank-table-box .rank-line > .name > span {position:relative;display:block;width:120px;max-width:120px;margin:0 auto;}
.fj-content_view.data-center .fj-block-body.info-acq .rank-table-box .rank-line > .name > span:before {content:'';position:absolute;left:-6px;top:50%;width:8px;height:8px;margin-top:-4px;border-radius:50%;}
.fj-content_view.data-center .fj-block-body.info-acq .rank-table-box .rank-line:first-of-type > .name > span:before {background:#3BA0FF;}
.fj-content_view.data-center .fj-block-body.info-acq .rank-table-box .rank-line:nth-of-type(2) > .name > span:before {background:#36CBCB;}
.fj-content_view.data-center .fj-block-body.info-acq .rank-table-box .rank-line:nth-of-type(3) > .name > span:before {background:#4DCB73;}
.fj-content_view.data-center .fj-block-body.info-acq .rank-table-box .rank-line:nth-of-type(4) > .name > span:before {background:#FAD337;}
.fj-content_view.data-center .fj-block-body.info-acq .rank-table-box .rank-line:nth-of-type(5) > .name > span:before {background:#F2637B;}
.fj-content_view.data-center .fj-block-body.info-acq .rank-table-box .rank-line:last-of-type > .name > span:before {background:#975FE4;}
.fj-content_view.data-center .fj-block-body.info-acq .rank-table-box .rank-line.title > .name:before {display:none;}
.fj-content_view.data-center .fj-block-body.info-acq .rank-table-box .rank-line > .count {width:33%;}
.fj-content_view.data-center .fj-block-body.info-acq .rank-table-box .rank-line > .rank {width:15%;}
/* 工作任务统计 */
.fj-content_view.data-center .fj-block-body.dc-work-mis {padding-top:10px;}
.fj-content_view.data-center .fj-block-body.dc-work-mis .type-count {position:relative;float:left;width:25%;min-height:124px;padding-left:60px;}
.fj-content_view.data-center .fj-block-body.dc-work-mis .type-count > .title {padding:12px 0px;font-size:16px;line-height:24px;color:rgba(0,0,0,1);}
.fj-content_view.data-center .fj-block-body.dc-work-mis .type-count > .complete-txt {padding:2px 0px;line-height:22px;color:rgba(0,0,0,.45);}
.fj-content_view.data-center .fj-block-body.dc-work-mis .type-count > .percent {font-size:24px;line-height:32px;color:rgba(0,0,0,.85);}
/* 四个环形图表 */
.fj-content_view.data-center .fj-block-body.dc-work-mis .type-count > .circle-chart {position:absolute;top:0;right:0;bottom:0;width:60%;}
/* 工作任务总数图表 */
.fj-content_view.data-center .fj-block-body.dc-work-mis .mis-sum-chart {height:410px;}
/* 工作任务地区分布 */
.fj-content_view.data-center .fj-block-body.dc-work-mis .mis-area-chart {height:410px;}
/* 单位考核排名 + 人员考核排名 */
.fj-content_view.data-center .fj-block.dept-person {background:transparent;}
.fj-content_view.data-center .fj-block.dept-person .fj-block {padding-bottom:18px;}
.fj-content_view.data-center .left-rank-box {width:50.796460%;padding-right:18px;}
.fj-content_view.data-center .right-rank-box {width:49.203540%;}
.fj-content_view.data-center .fj-block.dept-person .el-table td {padding:12px 0px;}
</style>


