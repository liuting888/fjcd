<template>
  <div class="fj-content_view dwkh">
    <div class="fj-block show-all">
      <fj-breadNav :bread-data="breadData"></fj-breadNav>
      <p class="fj-component_title fj-clear">
        <span class="fj-fl">单位考核平均分数总览</span>
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
            <el-date-picker class="fj-fr" v-model="selectedRadarMonth" value-format='yyyy-MM' type="month" @change="changeRadarMonthVal"
              placeholder="请选择月份">
            </el-date-picker>
          </div>
          <div class="echart-radar" id="echart-radar"></div>
        </div>
      </div>
    </div>
    <div class="fj-block rank">
      <div class="fj-block-head kaohe">
        <p class="title fj-fl">单位考核排名</p>
        <div class="details fj-fr">
          <el-date-picker class="fj-fl" v-model="selectedDeptsMonth" value-format='yyyy-MM' @change="selectMonthForListData" type="month"
            placeholder="请选择月份">
          </el-date-picker>
          <form name="formExcle" class="fj-fu" :action="ajaxUrlDNN+'/exportDeptAppraiseList?month='+selectedDeptsMonth" method="post"
            enctype="multipart/form-data"></form>
          <el-button plain @click="exportData">导出</el-button>
        </div>
      </div>
      <div class="fj-block-body">
        <el-table :data="assessmentData" ref="deptsRankTable" @row-click="getPjun">
          <el-table-column width="40" type="index" label=""></el-table-column>
          <el-table-column prop="deptname" width="120" class-name="left" label="单位" show-overflow-tooltip></el-table-column>
          <el-table-column prop="zerenren" label="责任人">
          </el-table-column>
          <el-table-column prop="jigoushezi">
            <template slot="header" slot-scope="scope">
              <p>机构设置</p>
              <p>（15分）</p>
            </template>
</el-table-column>
<el-table-column prop="jinglipeizhi">
    <template slot="header" slot-scope="scope">
              <p>警力配备</p>
              <p>（20分）</p>
            </template>
</el-table-column>
<el-table-column width="100" prop="gongzuozhanjianshe">
    <template slot="header" slot-scope="scope">
              <p>工作站建设</p>
              <p>（20分）</p>
            </template>
</el-table-column>
<el-table-column prop="jingwubaozhang">
    <template slot="header" slot-scope="scope">
              <p>警务保障</p>
              <p>（15分）</p>
            </template>
</el-table-column>
<el-table-column prop="duchaanfang">
    <template slot="header" slot-scope="scope">
              <p>督查暗访</p>
              <p>（10分）</p>
            </template>
</el-table-column>
<el-table-column label="队伍管理(20分)">
    <el-table-column prop="gangqianpeixun" width="150">
        <template slot="header" slot-scope="scope">
                <p>岗前培训（5分）</p>
              </template>
    </el-table-column>
    <el-table-column prop="renyuanguanli" width="130">
        <template slot="header" slot-scope="scope">
                <p>人员管理（5分）</p>
              </template>
    </el-table-column>
    <el-table-column prop="kaohejiangfa" width="130">
        <template slot="header" slot-scope="scope">
                <p>考核奖惩（5分）</p>
              </template>
    </el-table-column>
    <el-table-column prop="qita" width="100">
        <template slot="header" slot-scope="scope">
                <p>其它（5分）</p>
              </template>
    </el-table-column>
</el-table-column>
<el-table-column width="100" prop="jiafen">
    <template slot="header" slot-scope="scope">
              <p>加分</p>
              <p>（10分）</p>
            </template>
</el-table-column>
<el-table-column prop="sum" label="合计"></el-table-column>
<el-table-column label="操作" width='160'>
    <template slot-scope="scope">
              <span class="ope-txt" @click.stop="addZRR(scope.row)">编辑</span>
              <span class="ope-txt" :class="{'disabled':!isCurMonthForDL}" @click.stop="editE(scope.row)">考核</span>
              <span class="ope-txt" @click.stop="openLog(scope.row)">查询记录</span>
            </template>
</el-table-column>
</el-table>
</div>
<div class="mj-page_wrap" v-if="Number(total) > Number(pageSize)">
    <el-pagination :current-page="currentPage" :total="total" :page-size="pageSize" layout="total,prev, pager, next" @current-change="currentPageChange">
    </el-pagination>
</div>
<!-- 考核弹层 -->
<el-dialog width="750px" center class="ss-erweima" title="奖惩操作" :close-on-click-modal="false" :visible.sync="diaShow" :modal-append-to-body="diaShowModal" @close="clearF">
    <p class="operate-notice">在需要扣分的项中，直接填写或者点击“+”、“-”进行扣分操作，可精确到小数点后两位，撤销扣分请在扣分记录中清除。</p>
    <el-form label-position="right" label-width="10em" ref="uploadF" :model="formLabelAlign" > <!-- :rules="rules" -->
        <el-row>
            <el-col :span="12">
                <el-form-item label="机构设置扣分值" prop="jgsz">
                    <!-- <el-input v-model="formLabelAlign.jgsz" placeholder="请输入扣分值"></el-input> -->
                    <el-input-number v-model="formLabelAlign.jgsz" :precision="2" :step="0.01" :min="0" :max="keepDlNum(initKHDatas.jigoushezi)"></el-input-number>
                    <el-tooltip class="item" effect="dark" :content="elNumberNotice" placement="right">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="警力配备扣分值" prop="jlpb">
                    <!-- <el-input v-model="formLabelAlign.jlpb" placeholder="请输入扣分值"></el-input> -->
                    <el-input-number v-model="formLabelAlign.jlpb" :precision="2" :step="0.01" :min="0" :max="keepDlNum(initKHDatas.jinglipeizhi)"></el-input-number>
                    <el-tooltip class="item" effect="dark" :content="elNumberNotice" placement="right">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="工作站建设扣分值" prop="gzzjs">
                    <!-- <el-input v-model="formLabelAlign.gzzjs" placeholder="请输入扣分值"></el-input> -->
                    <el-input-number v-model="formLabelAlign.gzzjs" :precision="2" :step="0.01" :min="0" :max="keepDlNum(initKHDatas.gongzuozhanjianshe)"></el-input-number>
                    <el-tooltip class="item" effect="dark" :content="elNumberNotice" placement="right">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="警务保障扣分值" prop="jwbz">
                    <!-- <el-input v-model="formLabelAlign.jwbz" placeholder="请输入扣分值"></el-input> -->
                    <el-input-number v-model="formLabelAlign.jwbz" :precision="2" :step="0.01" :min="0" :max="keepDlNum(initKHDatas.jingwubaozhang)"></el-input-number>
                    <el-tooltip class="item" effect="dark" :content="elNumberNotice" placement="right">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="督察暗访扣分值" prop="dcaf">
                    <!-- <el-input v-model="formLabelAlign.dcaf" placeholder="请输入扣分值"></el-input> -->
                    <el-input-number v-model="formLabelAlign.dcaf" :precision="2" :step="0.01" :min="0" :max="keepDlNum(initKHDatas.duchaanfang)"></el-input-number>
                    <el-tooltip class="item" effect="dark" :content="elNumberNotice" placement="right">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="岗前培训扣分值" prop="gqpx">
                    <!-- <el-input v-model="formLabelAlign.gqpx" placeholder="请输入扣分值"></el-input> -->
                    <el-input-number v-model="formLabelAlign.gqpx" :precision="2" :step="0.01" :min="0" :max="keepDlNum(initKHDatas.gangqianpeixun)"></el-input-number>
                    <el-tooltip class="item" effect="dark" :content="elNumberNotice" placement="right">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="人员管理扣分值" prop="rygl">
                    <!-- <el-input v-model="formLabelAlign.rygl" placeholder="请输入扣分值"></el-input> -->
                    <el-input-number v-model="formLabelAlign.rygl" :precision="2" :step="0.01" :min="0" :max="keepDlNum(initKHDatas.renyuanguanli)"></el-input-number>
                    <el-tooltip class="item" effect="dark" :content="elNumberNotice" placement="right">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="考核奖惩扣分值" prop="khjc">
                    <!-- <el-input v-model="formLabelAlign.khjc" placeholder="请输入扣分值"></el-input> -->
                    <el-input-number v-model="formLabelAlign.khjc" :precision="2" :step="0.01" :min="0" :max="keepDlNum(initKHDatas.kaohejiangfa)"></el-input-number>
                    <el-tooltip class="item" effect="dark" :content="elNumberNotice" placement="right">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="其它扣分值" prop="qita">
                    <!-- <el-input v-model="formLabelAlign.qita" placeholder="请输入扣分值"></el-input> -->
                    <el-input-number v-model="formLabelAlign.qita" :precision="2" :step="0.01" :min="0" :max="keepDlNum(initKHDatas.qita)"></el-input-number>
                    <el-tooltip class="item" effect="dark" :content="elNumberNotice" placement="right">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                </el-form-item>
            </el-col>
        </el-row>
        <p style="border-top:1px solid #ccc" class="operate-notice">加分项填写的分值是加分。直接填写或者点击“+”、“-”进行加分操作，在加分一栏加多少分，并计入总分。</p>
        <el-form-item label="加分" prop="jiafen">
            <!-- <el-input v-model="formLabelAlign.jiafen" placeholder="请输入加分值"></el-input> -->
            <el-input-number v-model="formLabelAlign.jiafen" :precision="2" :step="0.01" :min="0" :max="10 - keepDlNum(initKHDatas.jiafen)"></el-input-number>
            <el-tooltip class="item" effect="dark" content="加分最多加至10分，如超过10分，将不能进行加分操作！" placement="right">
                <i class="el-icon-question"></i>
            </el-tooltip>
        </el-form-item>
        <el-form-item label="备注">
            <el-input type="textarea" placeholder="请输入备注" :autosize="{ minRows: 4, maxRows: 6}" v-model="formLabelAlign.remark"></el-input>
        </el-form-item>
        <div class='e-btns'>
            <el-button type="primary" @click="onSubmit">完成</el-button>
            <el-button @click="clearF">取消</el-button>
        </div>
    </el-form>
</el-dialog>
<!-- 考核记录弹层 -->
<el-dialog width="800px" :close-on-click-modal="false" center title="考核记录" class="ss-erweima"  :visible.sync="opShow" :modal-append-to-body="opShowModal" @close="cancelLogPop">
    <el-table :data="logList"> 
        <el-table-column width="200px" prop="inserttime" label="考核时间"></el-table-column>
        <el-table-column prop="item" label="考核项"></el-table-column>
        <el-table-column prop="opusername" label="操作人"></el-table-column>
        <el-table-column prop="score" label="分值">
            <template slot-scope="scope">
                <span :class="scope.row.item === '加分' ? 'addScore' : 'minusScore'">
                  {{scope.row.item === '加分' ? '+' : '-'}}
                  {{scope.row.score}}
                </span>
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="medium" @click.stop="canCel(scope.row)">撤销</el-button>
            </template>
        </el-table-column>
    </el-table>
</el-dialog>
</div>
</div>
</template>
<script>
    import fjBreadNav from "@/components/fjBreadNav";
    export default {
        name: "fjDanweikaohe",
        data: function() {
            return {
                opShowModal: false,
                diaShowModal: false,
                scoreTypeDatas:[  //筛选平均分类型的数据
                    {label:'总平均分',value:'all'},
                    {label:'机构设置',value:'jgsz'},
                    {label:'警力配备',value:'jlpb'},
                    {label:'警务保障',value:'jwbz'},
                    {label:'督察暗访',value:'dcaf'},
                    {label:'队伍管理',value:'dwgl'},
                    {label:'工作站建设',value:'gzzjs'}
                ],
                selectedScoreType: "all", // 折线图表数据类型
                selectedRadarMonth: fjPublic.date2Month(new Date()), //雷达图表-月份值
                selectedDeptsMonth: fjPublic.date2Month(new Date()), //单位考核列表-月份值
                deptId: '',  //  点击表格行-显示部门考核数据图表所选择的deptId
                ajaxUrlDNN: fjPublic.ajaxUrlDNN,
                diaShow: false,
                opShow: false,
                logList: [],
                formLabelAlign: {  //考核提交的扣分信息
                    id: '',  //考核编号
                    jgsz: '', //机构设置扣分值
                    jlpb: '', //警力配备扣分值
                    gzzjs: '', //工作站建设扣分值
                    jwbz: '', //警务保障扣分值
                    dcaf: '', //督察暗访扣分值
                    gqpx: '', //岗前培训扣分值
                    rygl: '', //人员管理扣分值
                    khjc: '', //考核奖惩扣分值
                    qita: '', //其它扣分值
                    remark: '', //备注
                    jiafen: '', //加分
                    nowUser: $.cookie(fjPublic.loginCookieKey) //登录时前端保存的用户信息
                },
                KPointKeys:[ //扣分项判断用
                    {name:'机构设置',value:'jgsz'},
                    {name:'警力配备',value:'jlpb'},
                    {name:'工作站建设',value:'gzzjs'},
                    {name:'警务保障',value:'jwbz'},
                    {name:'督察暗访',value:'dcaf'},
                    {name:'岗前培训',value:'gqpx'},
                    {name:'人员管理',value:'rygl'},
                    {name:'考核奖惩',value:'khjc'},
                    {name:'其它',value:'qita'},
                ],
                KPointKeysClone:null, //临时保存
                initKHDatas:{  //考核的初始分值数据--最大值
                    duchaanfang:10,  //督察暗访分
                    gangqianpeixun:5, //岗前培训
                    gongzuozhanjianshe:20, //工作站建设
                    jigoushezi:15, //机构设置
                    jinglipeizhi:20, //警力配备
                    jingwubaozhang:15, //警务保障
                    kaohejiangfa:5,   //考核奖惩
                    qita:5, //其它
                    renyuanguanli:5, //人员管理
                    jiafen:10  //加分
                },
                elNumberNotice:'当点击“+”、“-”无法加减分时，表示已经到达设置的最大或最小值！', //扣分输入框提示
                breadData: [
                    //面包屑导航
                    {
                        name: "当前位置:",
                        path: ""
                    },
                    {
                        name: "考核管理",
                        path: ""
                    },
                    {
                        name: "单位考核",
                        path: ""
                    }
                ],
                countChart: null, //平均分数 折线-图表
                countChartDom:null, //折线图dom
                countChartOption: { //平均分数 折线-图表
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
                                name:'单位分值',
                                icon:'circle'
                            }
                        ]
                    },
                    xAxis: {
                        type: "category",
                        axisLine: {
                            lineStyle: {
                                color: "#D6D6D6"
                            }
                        },
                        axisLabel: {
                            color: "rgba(0,0,0,.65)",
                            textStyle:{
                                fontFamily:'PingFangSC'
                            }
                        },
                        data: []
                    },
                    yAxis: {
                        type: "value",
                        axisLine: {
                            lineStyle: {
                                color: '#fff'
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                type: 'dashed'
                            }
                        },
                        axisLabel: {
                            color: "rgba(0,0,0,.65)",
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
                            data: [],
                            name:'平均分值',
                            type: "line",
                            lineStyle: {
                                color: "#1890FF"
                            },
                            itemStyle: {
                                borderColor: "#1890FF"
                            }
                        },
                        {
                            data: [],
                            name:'单位分值',
                            type: "line",
                            lineStyle: {
                                color: "#2FC25B"
                            },
                            itemStyle: {
                                borderColor: "#2FC25B"
                            }
                        }
                    ]
                },
                radarChart: null, //平均分数 雷达-图表
                radarChartDom:null, //雷达图dom
                radarChartOption: { //平均分数 雷达-图表数据
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
                                name:'单位分值',
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
                    axisLine: {
                        show: false,
                        lineStyle: {
                            opacity: "0"
                        }
                    },
                    radar: {
                        center: ["50%", "50%"],
                        radius: "70%",
                        nameGap:6,
                        name: {
                            textStyle: {
                                color: "rgba(0,0,0,.65)",
                                fontFamily:'PingFangSC',
                                backgroundColor: "transparent"
                            }
                        },
                        indicator: []
                    },
                    series: [{
                        name: "",
                        type: "radar",
                        // areaStyle: {normal: {}},
                        data: [{
                                value: [],
                                name: "平均分值",
                                itemStyle: {
                                    color: "#1890FF"
                                }
                            },
                            {
                                value: [],
                                name: "单位分值",
                                itemStyle: {
                                    color: "#2FC25B"
                                }
                            }
                        ]
                    }]
                },
                assessmentData: [], //部门考核列表数据
                pageSize: 10,
                currentPage: 0,
                total: 0,
                oId: '',  //单位考核编号
                isCurMonth:fjPublic.date2Month(new Date()),  //当前月份
                //角色控制

            };
        },
        mounted: function() {
            $.when(this.requestDatas()).then(_.bind(function(){
                //设置折线图
                this.setCountChart();
                //设置雷达图
                this.setRadarChart();
                //
                $(window).on('resize',_.debounce(_.bind(function(){
                    //设置折线图
                    this.setCountChart();
                    //设置雷达图
                    this.setRadarChart();
                },this),200));
            },this),_.bind(function(){

            },this));
        },
        beforeRouteEnter: function(to, from, next) {
            next(function(vm){});
        },
        beforeRouteLeave:function(to,from,next){
            $(window).off('resize');
            next();
        },
        computed:{
            isCurMonthForDL:function(){  //单位考核列表月份不是当前月份
                var selectedTime = new Date(this.selectedDeptsMonth).getTime();
                var curTime = new Date(this.isCurMonth).getTime();
                return selectedTime!=curTime?false:true;
            }
        },
        methods: {
            getAvgScoreData:function(){ //获取平均分折线图数据
                var defer = $.Deferred();
                var vm = this;
                $.ajax({  
                    url:fjPublic.ajaxUrlDNN + '/deptAppraiseAvgScore',
                    type:'POST',
                    data:{
                        type:this.selectedScoreType,  //类型
                        deptId:this.deptId    //部门deptId
                    },
                    dataType:'json',
                    success:function(data){
                        //console.log(data);
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
            getRadarAvgScoreData:function(){  //获取平均分雷达图数据
                var defer = $.Deferred();
                var vm = this;
                $.ajax({  
                    url:fjPublic.ajaxUrlDNN + '/deptTypeAppraiseAvgScore',
                    type:'POST',
                    data:{
                        month:this.selectedRadarMonth,
                        deptId:this.deptId,
                    },
                    dataType:'json',
                    success:function(data){
                        //console.log(data);
                        var indicatorNames ={
                            organizationSetting:'机构设置',
                            policeEquipment: '警力配备',
                            policeSafeguards: '警务保障',
                            supervision: '督察暗访',
                            teamConstruction: '队伍管理',
                            workstationConstruction:'工作站建设'
                        };
                        var maxValues = {
                            organizationSetting:15,
                            policeEquipment: 20,
                            policeSafeguards: 15,
                            supervision: 10,
                            teamConstruction: 20,
                            workstationConstruction:20
                        };
                        vm.radarChartOption.radar.indicator.splice(0,vm.radarChartOption.radar.indicator.length);
                        vm.radarChartOption.series[0].data[0].value.splice(0,vm.radarChartOption.series[0].data[0].value.length);
                        _.each(data.blueLineList[0],function(v,k){
                            if(v>=maxValues[k])v=maxValues[k];
                            var tmpObj = {name:indicatorNames[k],max:maxValues[k]};
                            vm.radarChartOption.radar.indicator.push(tmpObj);
                            vm.radarChartOption.series[0].data[0].value.push(v);
                            vm.radarChartOption.series[0].data[0].emphasis={itemStyle:{color:'#1890FF'}};
                        });
                        if(data.greenLineList&&data.greenLineList.length){ //设置个人数据的图表
                            vm.radarChartOption.series[0].data[1].value.splice(0,vm.radarChartOption.series[0].data[1].value.length);
                            _.each(data.greenLineList[0],function(v,k){
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
            changeRadarMonthVal:function(date){ //改变雷达图表日期输入框的值
                var curTime = new Date().getTime();
                var selectedTime = new Date(this.selectedRadarMonth).getTime();
                if(selectedTime>curTime){
                    this.$message({type:'warning',message:'暂无'+date+'月份的雷达图表数据'});
                    this.selectedRadarMonth = fjPublic.date2Month(new Date());
                    return;
                }
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
            getDeptsAppraiseRankPageData:function(){ //获取单位考核排名数据
                var defer = $.Deferred();
                var vm = this;
                $.ajax({  
                    url:fjPublic.ajaxUrlDNN + '/saveOrSearchDeptAppraise',
                    type:'POST',
                    data:{
                        page:this.currentPage, //页码
                        rows:this.pageSize,   //每页条数
                        month: this.selectedDeptsMonth
                    },
                    dataType:'json',
                    success:function(data){
                        //console.log(data);
                        vm.total = data.total;  //总数
                        _.each(data.rows,function(el) {
                            el.sum = 
                                parseFloat(el.duchaanfang) +
                                parseFloat(el.gangqianpeixun) +
                                parseFloat(el.gongzuozhanjianshe) +
                                parseFloat(el.jigoushezi) +
                                parseFloat(el.jiafen) +
                                parseFloat(el.jinglipeizhi) +
                                parseFloat(el.jingwubaozhang) +
                                parseFloat(el.kaohejiangfa) +
                                parseFloat(el.renyuanguanli) +
                                parseFloat(el.qita);
                            //小数位数调整
                            el.sum = Math.ceil(parseFloat(el.sum)*100)/100;
                        });
                        vm.assessmentData = null; 
                        vm.assessmentData = data.rows; //列表数据
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
                    this.getAvgScoreData(),
                    this.getRadarAvgScoreData(),
                    this.getDeptsAppraiseRankPageData()
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
            selectMonthForListData:function(date){  //切换月份-获取单位列表数据
                var curTime = new Date().getTime();
                var selectedTime = new Date(this.selectedDeptsMonth).getTime();
                if(selectedTime>curTime){
                    this.$message({type:'warning',message:'暂无'+date+'月份的单位考核列表数据'});
                    this.selectedDeptsMonth = fjPublic.date2Month(new Date());
                    return;
                }
                this.currentPage = 1;
                fjPublic.openLoad('获取数据中...');
                $.when(this.getDeptsAppraiseRankPageData()).then(_.bind(function(){
                    fjPublic.closeLoad();
                },this),_.bind(function(){
                    fjPublic.closeLoad();
                    this.$message({tyep:'warning',message:'获取单位考核列表数据失败'});
                },this));
            },
            currentPageChange(val) {
                this.currentPage = val;
                this.clearTableRowClass();
                fjPublic.openLoad('数据获取中...');
                $.when(this.getDeptsAppraiseRankPageData()).then(_.bind(function(){
                    fjPublic.closeLoad();
                },this),_.bind(function(){
                    fjPublic.closeLoad();
                    this.$message({type:'warning',message:'获取单位考核排名数据失败'});
                },this));
            },
            clearTableRowClass:function(){  //清除表格行的类名
                $(this.$refs['deptsRankTable'].$el).find('.el-table__body-wrapper .el-table__row').removeClass('show');
            },
            getPjun(row,event) {  // 点击表格行--获取单位图表信息
                this.deptId = row.deptid;
                var $this = $(event.currentTarget);
                if($this.hasClass('show'))return;
                $this.siblings().removeClass('show').end().addClass('show');
                //设置图表的姓名标识
                this.countChartOption.legend.data[1].name='单位分值--'+row.deptname;
                this.countChartOption.series[1].name='单位分值--'+row.deptname;
                this.radarChartOption.legend.data[1].name='单位分值--'+row.deptname;
                this.radarChartOption.series[0].data[1].name='单位分值--'+row.deptname;
                fjPublic.openLoad('获取数据中...');  
                $.when(
                    this.getAvgScoreData(),
                    this.getRadarAvgScoreData()
                ).then(_.bind(function(){
                    fjPublic.closeLoad();
                    fjPublic.contentScrollTop();
                    //设置折线图
                    this.setCountChart();
                    //设置雷达图
                    this.setRadarChart();
                },this),_.bind(function(){
                    fjPublic.closeLoad();
                    this.$message({type:'warning',message:'获取单位考核图表数据失败'});
                },this));
            },
            keepDlNum:function(val){ //小数点后2位
                return val?Math.ceil(parseFloat(val)*100)/100:0.00;
            },
            editE(val) { //点击表格行的--考核
                if(!this.isCurMonthForDL){
                    this.$message({type:'warning',message:'不是当前月份，不能进行考核操作！'});
                    return;
                }
                //设置扣分最大值
                _.each(val,function(v,k){
                    if(k in this.initKHDatas){
                        this.$set(this.initKHDatas,k,v);
                    }
                },this);
                this.formLabelAlign.id = val.id;
                this.formLabelAlign.nowUser = $.cookie(fjPublic.loginCookieKey);
                this.diaShow = true;
            },
            testKFempty:function(){ //不加分的时候，检查扣分项是否都为空
                return _.every(this.KPointKeys,function(item,i){
                    return this.formLabelAlign[item.value]==0;
                },this);
            },
            testKFisZero:function(){ //过滤掉扣分项中为0分的项
                this.KPointKeysClone = this.KPointKeys;  //复制
                _.each(this.KPointKeys,function(item){
                if(this.initKHDatas[item.value]==0&&this.formLabelAlign[item.value]==0){
                    this.$set(item,'isZero',true);
                }
                },this);
                this.KPointKeys = _.reject(this.KPointKeys,function(item){
                return item.isZero;
                });
            },
            onSubmit() {  //提交扣分操作
                //console.log(this.formLabelAlign);
                //判断当前扣分项已经为0分
                this.testKFisZero();
                //判断扣分项是否为空
                var isEmptyBool;
                if(this.formLabelAlign.jiafen==0){ //没设置加分的时候
                    isEmptyBool = this.testKFempty();
                }
                if(isEmptyBool){
                    this.$message({type:'warning',message:'未加分时，请至少设置一个扣分项！'});
                    return;
                }
                var that = this;
                fjPublic.openLoad('提交中...');
                $.ajax({
                    url: fjPublic.ajaxUrlDNN + "/editDeptAppraise",
                    type: "POST",
                    data: that.formLabelAlign,
                    dataType: "json",
                    success: function(data) {
                        fjPublic.closeLoad();
                        if (data.errorCode == 0) {
                            that.$message.success({
                                type:'success',
                                message: data.errorMsg
                            });
                        } else {
                            that.$message.error({
                                type:'warning',
                                message: data.errorMsg
                            });
                        }
                        that.diaShow = false;
                        that.getDeptsAppraiseRankPageData();
                    },
                    error: function(err) {
                        fjPublic.closeLoad();
                        that.$message({type:'warning',message:'考核分值请求失败！'});
                    }
                });
            },
            clearF() {  //退出扣分弹层操作
                _.each(this.KPointKeysClone,function(item,i){
                    delete item['isZero'];
                    this.$set(this.KPointKeys,i,null);
                    this.$set(this.KPointKeys,i,item);
                },this);
                this.KPointKeysClone = null;
                _.each(this.formLabelAlign,function(v,k){
                    if($.isNumeric(v)){
                        this.$set(this.formLabelAlign,k,0);
                    }else{
                        this.$set(this.formLabelAlign,k,'');
                    }
                },this);
                this.diaShow = false;
                //删除v-modal遮罩层
                fjPublic.removeModalMask();
            },
            exportData() {
                document.forms["formExcle"].submit();
            },
            openLog(val) {
                this.oId = val.id;
                this.getLog();
            },
            getLog() { //查看扣分日志
                var that = this;
                var defer = $.Deferred();
                fjPublic.openLoad('获取数据中...');
                $.ajax({
                    url: fjPublic.ajaxUrlDNN + "/getDeptAppraiseLog",
                    type: "POST",
                    data: {
                        id: that.oId  //单位考核编号
                    },
                    dataType: "json",
                    success: function(data) {
                        fjPublic.closeLoad();
                        if (data.list && data.list.length) {
                            fjPublic.wrapperAddScroll();
                            that.opShow = true;
                            data.list.forEach(el => {
                                el.inserttime = fjPublic.dateStrFormat(el.inserttime);
                            });
                            that.logList = null;
                            that.logList = data.list;
                            defer.resolve();
                        } else {
                            defer.reject();
                            that.$message({
                                message: '暂无操作记录',
                                type: 'info'
                            })
                        }
                    },
                    error: function(err) {
                        fjPublic.closeLoad();
                    }
                });
                return defer;
            },
            cancelLogPop:function(){ //关闭日志弹层
                this.opShow = false;
                fjPublic.removeModalMask();
                fjPublic.wrapperRemoveScroll();
                //刷新列表
                this.getDeptsAppraiseRankPageData();
            },
            canCel(val) {  //撤销扣分操作
                var that = this;
                this.$confirm("此操作将撤销该扣分, 是否继续?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                        center: true
                    })
                    .then(() => {
                        fjPublic.removeModalMask();
                        fjPublic.openLoad('撤销中...');
                        $.ajax({
                            url: fjPublic.ajaxUrlDNN + "/resetDeptAppraiseLog",
                            type: "POST",
                            data: {
                                id: val.id
                            },
                            dataType: "json",
                            success: function(data) {
                                fjPublic.closeLoad();
                                if (data.errorCode == 0) {
                                    that.$message.success({
                                        message: data.errorMsg
                                    });
                                    $.when(that.getLog()).fail(function(){
                                        that.cancelLogPop();
                                    });
                                } else {
                                    that.$message.error({
                                        message: data.errorMsg
                                    });
                                }
                            },
                            error: function(err) {
                                fjPublic.closeLoad();}
                        });
                    })
                    .catch(() => { 
                        fjPublic.removeModalMask();
                    });
            },
            addZRR(val) {
                var that = this;
                this.$prompt("", "编辑任务责任人", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        inputValue: val.zerenren,
                        customClass: 'editChargeMan'
                    })
                    .then(({
                        value
                    }) => {
                        $.ajax({
                            url: fjPublic.ajaxUrlDNN + "/updateDeptPersonInCharge",
                            type: "POST",
                            data: {
                                deptId: val.deptid,
                                userName: value,
                                type: "dept"
                            },
                            dataType: "json",
                            success: function(data) {
                                if (data.errorCode == 0) {
                                    that.$message.success({
                                        message: data.errorMsg
                                    });
                                } else {
                                    that.$message.error({
                                        message: data.errorMsg
                                    });
                                }
                                that.getDeptsAppraiseRankPageData();
                            },
                            error: function(err) {}
                        });
                    })
                    .catch(() => {
                        //删除v-modal遮罩层
                        fjPublic.removeModalMask();
                    });
            }
        },
        components: {
            fjBreadNav
        }
    };
</script>
<style scope>
    .fj-content_view.dwkh>.fj-block {
        background: #fff;
    }

    .fj-content_view.dwkh>.fj-block.show-all {
        padding: 0px 40px 0px 28px;
    }

    .fj-content_view.dwkh .fj-component_title>.el-button {
        padding: 8px 20px;
    }

    /*  */

    .fj-content_view.dwkh .charts-left-area,
    .fj-content_view.dwkh .charts-right-area {
        padding-top: 28px;
    }

    .fj-content_view.dwkh .charts-left-area {
        width: 66.879562%;
        padding-right: 33px;
    }

    .fj-content_view.dwkh .charts-right-area {
        width: 33.120438%;
    }

    /*  */

    .fj-content_view.dwkh .charts-left-area>.el-radio-group {
        height: 50px;
    }

    .fj-content_view.dwkh .charts-left-area .el-radio {
        line-height: 50px;
        color: rgba(0, 0, 0, 0.65);
    }

    .fj-content_view.dwkh .charts-left-area .el-radio+.el-radio {
        margin-left: 20px;
    }

    .fj-content_view.dwkh .charts-left-area .el-radio__label {
        padding-left: 7px;
    }

    /*  */

    .fj-content_view.dwkh .charts-right-area>.title-box {
        padding-left: 24px;
        height: 50px;
        line-height: 50px;
    }

    .fj-content_view.dwkh .charts-right-area>.title-box>.title {
        font-size: 16px;
        color: rgba(0, 0, 0, 0.85);
    }

    /*  */

    .fj-content_view.dwkh .charts-left-area>.echart-count,
    .fj-content_view.dwkh .charts-right-area>.echart-radar {
        height: 380px;
    }

    /*  */

    .fj-content_view.dwkh>.fj-block.rank {
        padding: 0px 18px 38px;
    }

    .fj-content_view.dwkh>.fj-block.rank .details>.el-date-editor {
        margin-top: 1px;
        margin-right: 10px;
    }

    .fj-content_view.dwkh .fj-block-head>.details>.el-button {
        margin-top: 8px;
        padding: 8px 30px;
    }

    .fj-content_view.dwkh>.fj-block.rank .el-table th {
        padding: 4px 0px;
    }

    .fj-content_view.dwkh>.fj-block.rank .el-table td {
        padding: 10px 0px;
    }

    .fj-content_view.dwkh .mj-page_wrap {
        padding: 20px 0 34px;
    }

    .fj-content_view.dwkh .mj-page_wrap .el-pagination {
        text-align: right !important;
    }

    /* .ss-erweima .el-input {
        width: 10em !important;
    } */

    .fj-content_view.dwkh .ss-erweima .el-textarea {
        width: 88% !important;
    }
    .fj-content_view.dwkh .ss-erweima /deep/ .minusScore{
        color: #FF0000;
    }
    .fj-content_view.dwkh .ss-erweima /deep/ .addScore{
        color: #67C23A;
    }
    .fj-content_view.dwkh .e-btns {
        text-align: center;
    }
    .fj-content_view.dwkh .fj-fu {
        display: none;
    }
    .fj-content_view.dwkh .editChargeMan .el-input{
        width: 100%;
    }
    .fj-content_view.dwkh>.fj-block.rank .el-table th.left,
    .fj-content_view.dwkh>.fj-block.rank .el-table td.left {
        text-align: left;
    }
    /* 0220修改--表格去边框 */
    .fj-content_view.dwkh > .fj-block.rank .fj-block-head.kaohe {margin-bottom:16px;}
    .fj-content_view.dwkh > .fj-block.rank .el-table th {padding:4px 0px;}
    .fj-content_view.dwkh > .fj-block.rank .el-table td {padding:10px 0px;}
    .fj-content_view.dwkh > .fj-block.rank .el-table--border {border:none;}
    .fj-content_view.dwkh > .fj-block.rank .el-table--border::after {display:none;}
    .fj-content_view.dwkh > .fj-block.rank .el-table--border td {border-right:none;}
    .fj-content_view.dwkh > .fj-block.rank .el-table--border th {border-right:none;border-bottom:none;}
    /* 0225修改 */
    .fj-content_view.dwkh .el-table .el-table__row.show {background:#f5f7fa;}
    .fj-content_view.dwkh .el-dialog .operate-notice {text-align:justify;text-indent:2em;padding:10px 0;color:rgba(0,0,0,.85);}
    .fj-content_view.dwkh .el-dialog .el-icon-question.el-tooltip {margin-left:10px;}
</style>
