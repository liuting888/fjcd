<template>
  <div class="fj-content_view dqkh">
    <div class="fj-block show-all">
      <fj-breadNav :bread-data="breadData"></fj-breadNav>
      <p class="fj-component_title fj-clear">
        <span class="fj-fl">地区考核平均分数总览</span>
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
        <p class="title fj-fl">地区考核排名</p>
      </div>
      <div class="fj-block-body">
        <ul class="filterOpe-area fj-clear">
          <li class="area-line fj-clear">
            <div class="item fj-fl">
              <span class="title fj-fl">公安局：</span>
              <el-select class="fj-fl" :disabled="isFJRole" v-model="supDeptId" clearable placeholder="请选择区县分局" @change="changeRTdataByFenjvId">
                <el-option v-for="item in options" :key="item.deptId" :label="item.deptName" :value="item.deptId">
                </el-option>
              </el-select>
              <span class="title fj-fl" style="margin-left:30px;">派出所：</span>
              <el-input class="fj-fl search" suffix-icon="el-icon-search" clearable v-model="deptName" @clear="changeRTdataByPCSname"
              @input="changeRTdataByPCSname"  placeholder="请输入派出所名称"></el-input>
              <span class="title fj-fl">月份：</span>
              <el-date-picker class="fj-fl" v-model="selectedRTmonthVal" value-format='yyyy-MM' @change="changeRTdataByMonth" type="month"
                placeholder="请选择月份">
              </el-date-picker>
            </div>
            <div class="item fj-fl mj-zz">
              <el-button plain @click="allEdit" :class="{'is-disabled':!isCurMonth}">批量操作</el-button>
              <!--<el-button plain @click="getALog">记录查询</el-button>-->
              <el-button plain @click="exportData">导出</el-button>
              <form name="formExcle" class="fj-fu" :action="ajaxUrlDNN+'/exportDeptReportList?supDeptId='+supDeptId+'&month='+selectedRTmonthVal+'&page='+currentPage+'&deptName='+deptName+'&rows='+pageSize+'&type=2'"
                method="post" enctype="multipart/form-data">
              </form>
            </div>
          </li>
        </ul>
        <div class="depts-select-info">
          <i class="el-icon-info"></i>
          <span class="selected">已选择<span>{{multipleSelection.length}}</span>项</span>
          <span class="clear" @click="clearSelection">清空</span>
        </div>
        <el-table :data="assessmentData" @row-click="getPjun" ref="pcsRankTable" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column prop="deptName" class-name="left" label="单位" show-overflow-tooltip></el-table-column>
          <el-table-column prop="supDeptName" class-name="left" label="所属分局" show-overflow-tooltip></el-table-column>
          <el-table-column prop="deptLeader" label="责任人">
          </el-table-column>
          <el-table-column label="考核项" >
            <el-table-column v-for="(item, index) in itemNames" :key="item" :label="item + '（' + itemScores[index] + '分）'">
              <template slot-scope="scope">
                <p>{{scope.row.scores | getFormatScore(index)}}</p>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="allScore" :label="'合计（' + appraiseAllScore + '分）'"></el-table-column>
          <el-table-column label="操作" width='120'>
            <template slot-scope="scope">
              <!--<span class="ope-txt" @click.stop="addZRR(scope.row)">编辑</span>-->
              <span class="ope-txt" @click.stop="gotoDetail(scope.row)">明细</span>
              <span class="ope-txt" :class="{'disabled':!isCurMonth}" @click.stop="editE(scope.row)">考核</span>
              <!-- <el-button
                type="text"
                size="medium"
                @click.stop="editE(scope.row)"
              >编辑</el-button>
              <el-button
                type="text"
                size="medium"
                @click.stop="openLog(scope.row)"
              >查询扣分</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="mj-page_wrap" v-if="Number(total) > Number(pageSize)">
        <el-pagination :current-page="currentPage" :total="total" :page-size="pageSize" layout="total,prev, pager, next"
          @current-change="currentPageChange">
        </el-pagination>
      </div>
      <el-dialog width="500px" :close-on-click-modal="false" center class="ss-erweima" title="地区考核" :visible.sync="diaShow" :modal-append-to-body="diaShowModal" @close="clearF">
        <el-form label-position="right" :rules="addLogRules" label-width="10em" ref="uploadF" :model="formLabelAlign" > <!-- :rules="rules" -->
          <el-row>
            <el-col :span="24">
              <el-form-item prop="itemId" label="考核项">
                <el-select v-model="formLabelAlign.itemId" placeholder="请选择考核项" @change="getAppraiseRules">
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
                <el-select filterable v-model="formLabelAlign.ruleId" placeholder="请选择考核规则">
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
          <div class='e-btns'>
            <el-button @click="clearF">取消</el-button>
            <el-button type="primary" @click="onSubmit">确定</el-button>
          </div>
        </el-form>
      </el-dialog>
      <el-dialog width="800px" center :close-on-click-modal="false" class="ss-erweima" :visible.sync="opShow" :modal-append-to-body="opShowModal"
      @close="clearLogPop">
        <el-table :data="logList">
          <el-table-column width="200px" prop="insertTime" label="考核时间"></el-table-column>
          <el-table-column prop="item" label="考核项"></el-table-column>
          <el-table-column prop="userName" label="操作人"></el-table-column>
          <el-table-column label="分值">
            <template slot-scope="slot">
              <span :class="[slot.row.item=='加分'?'score-plus':'score-minus']">{{slot.row.item=='加分'?'+'+slot.row.score:'-'+slot.row.score}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="medium" :disabled="scope.row.status!=0" @click.stop="canCel(scope.row)">撤销</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="mj-page_wrap" v-if="Number(total1) > Number(pageSize1)">
          <el-pagination :current-page="currentPage1" :total="total1" :page-size="pageSize1" layout="total,prev, pager, next, jumper"
            @current-change="currentPageChange1">
          </el-pagination>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import fjBreadNav from "@/components/fjBreadNav";
  export default {
    name: "fjDiqukaohe",
    data: function () {
      return {
        selectedScoreType: "all",  //折线图类型--
        scoreTypeDatas:[  //筛选平均分类型的数据
            {label:'总平均分',value:'all'},
            // {label:'专职专岗',value:'zzzg'},
            // {label:'培训',value:'px'},
            // {label:'纪律作风',value:'jlzf'},
            // {label:'平台管理',value:'ptgl'},
            // {label:'督察暗访',value:'dcaf'},
            // {label:'违法违纪',value:'wfwj'}
        ],
        items: [],  // 考核操作考核项列表
        rules: [],  // 考核操作考核规则列表
        addLogRules: {
          itemId: [
            { required: true, message: '请选择考核项', trigger: 'change' }
          ],
          ruleId: [
            { required: true, message: '请选择考核规则', trigger: 'change' }
          ]
        },  // 表单验证
        selectedRadarMonth: fjPublic.date2Month(new Date()), //雷达图表--默认当前月份
        selectedRTmonthVal: fjPublic.date2Month(new Date()), //考核排名列表--默认当前月份
        deptName:'', //搜索--派出所名称
        supDeptId: '', //分局id
        deptId: '',  //点击表格行--派出所id
        options: [], //分局单位数据
        ajaxUrlDNN: fjPublic.ajaxUrlDNN,
        diaShow: false,
        diaShowModal: false,
        opShow: false,
        opShowModal: false,
        logList: [],  //考核记录数据
        formLabelAlign: {  //考核提交的扣分信息
          itemId:'',     //加减分值
          ruleId:'', //编辑理由
          deptId: ''
        },
        /* rules: {
          fullTimePost: [{
            validator: function (rule, value, callback) {
              if (value === "" || !/^[0-9]+(.[0-9]{1})?$/.test(value)) {
                callback(new Error("请输入正确分值"));
              } else {
                if (parseFloat(value) > 15) {
                  callback(new Error("扣除分数最多为15"));
                } else {
                  callback();
                }
              }
            },
            required: true,
            trigger: "blur"
          }],
          jiafen: [{
            validator: function (rule, value, callback) {
              if (value === "" || !/^[0-9]+(.[0-9]{1})?$/.test(value)) {
                callback(new Error("请输入正确分值"));
              } else {
                if (parseFloat(value) > 10) {
                  callback(new Error("加分最多10"));
                } else {
                  callback();
                }
              }
            },
            required: true,
            trigger: "blur"
          }],
          train: [{
            validator: function (rule, value, callback) {
              if (value === "" || !/^[0-9]+(.[0-9]{1})?$/.test(value)) {
                callback(new Error("请输入正确分值:如2.1"));
              } else {
                if (parseFloat(value) > 15) {
                  callback(new Error("扣除分数最多为15"));
                } else {
                  callback();
                }
              }
            },
            required: true,
            trigger: "blur"
          }],
          illegal: [{
            validator: function (rule, value, callback) {
              if (value === "" || !/^[0-9]+(.[0-9]{1})?$/.test(value)) {
                callback(new Error("请输入正确分值"));
              } else {
                if (parseFloat(value) > 15) {
                  callback(new Error("扣除分数最多为15"));
                } else {
                  callback();
                }
              }
            },
            required: true,
            trigger: "blur"
          }],
          inspector: [{
            validator: function (rule, value, callback) {
              if (value === "" || !/^[0-9]+(.[0-9]{1})?$/.test(value)) {
                callback(new Error("请输入正确分值"));
              } else {
                if (parseFloat(value) > 20) {
                  callback(new Error("扣除分数最多为20"));
                } else {
                  callback();
                }
              }
            },
            required: true,
            trigger: "blur"
          }],
          platformManage: [{
            validator: function (rule, value, callback) {
              if (value === "" || !/^[0-9]+(.[0-9]{1})?$/.test(value)) {
                callback(new Error("请输入正确分值"));
              } else {
                if (parseFloat(value) > 15) {
                  callback(new Error("扣除分数最多为15"));
                } else {
                  callback();
                }
              }
            },
            required: true,
            trigger: "blur"
          }],
          discipline: [{
            validator: function (rule, value, callback) {
              if (value === "" || !/^[0-9]+(.[0-9]{1})?$/.test(value)) {
                callback(new Error("请输入正确分值"));
              } else {
                if (parseFloat(value) > 20) {
                  callback(new Error("扣除分数最多为20"));
                } else {
                  callback();
                }
              }
            },
            required: true,
            trigger: "blur"
          }]
        }, */
        KPointKeys:[ //扣分项判断用
            {name:'专职专岗分',value:'fullTimePost'},
            {name:'培训',value:'train'},
            {name:'纪律作风',value:'discipline'},
            {name:'平台管理',value:'platformManage'},
            {name:'督察暗访',value:'inspector'},
            {name:'违法违纪',value:'illegal'}
        ],
        KPointKeysClone:null, //临时保存
        initKHDatas:{  //考核的初始分值数据--最大值
            fullTimePost:15,  //专职专岗分
            train:15, //培训
            discipline:20, //纪律作风
            platformManage:15, //平台管理
            inspector:20, //督察暗访
            illegal:15,   //违法违纪
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
            name: "地区考核",
            path: ""
          }
        ],
        countChart: null, //平均分数 折线-图表
        countChartDom:null, //图表dom
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
                  name:'派出所分值',
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
          series: [{
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
              name:'派出所分值',
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
        radarChartDom:null, //图表dom
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
                      name:'派出所分值',
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
            nameGap:8,
            name: {
              textStyle: {
                color: "rgba(0,0,0,.65)",
                fontFamily:'PingFangSC',
                backgroundColor: "transparent"
              }
            },
            indicator: [/* {
                name: "纪律作风",
                max: 20
              },
              {
                name: "专职专岗",
                max: 15
              },
              {
                name: "违法违纪",
                max: 15
              },
              {
                name: "督察暗访",
                max: 20
              },
              {
                name: "平台管理",
                max: 15
              },
              {
                name: "培训",
                max: 15
              } */
            ]
          },
          series: [{
            name: "分值",
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
                name: "派出所分值",
                itemStyle: {
                  color: "#2FC25B"
                }
              }
            ]
          }]
        },
        assessmentData: [],
        // 部门考核平均数据
        avgReport: {
          deptId: '', month: '', itemNames: '', itemScores: '', scores: '', allScore: ''
        },
        itemNames: [],
        itemScores: [],
        scores: [],
        appraiseAllScore: '',
        multipleSelection: [],
        pageSize: 10,
        pageSize1: 10,
        currentPage: 0,
        currentPage1: 0,
        total: 0,
        total1: 0,
        oId: "",
        curMonth:fjPublic.date2Month(new Date()), //当前月份
        //角色控制
        userInfo:null, //角色信息
        isFJRole:false, //是否禁用分局下拉框
        getDataByUserRole:{ //获取数据的时候
          [fjPublic.userRoles.pcs]:function(){},
          [fjPublic.userRoles.qj]:function(){ //分局
            this.isFJRole = true;
            this.supDeptId = this.userInfo.deptId;
          },
          [fjPublic.userRoles.sj]:function(){},
          [fjPublic.userRoles.cg]:function(){}
        }
      };
    },
    computed:{
      isCurMonth:function(){
        var curTime = new Date(this.curMonth).getTime();
        var selectedTime = new Date(this.selectedRTmonthVal).getTime();
        return selectedTime!=curTime?false:true;
      }
    },
    created:function(){
      this.userInfo = $.parseJSON(fjPublic.getLocalData('userInfo'));
      //console.log(this.userInfo);
      //
      this.getDataByUserRole[this.userInfo.userRole].call(this);
    },
    mounted: function () {
      this.getAppraiseItems();
      $.when(this.requestDatas()).then(_.bind(function(){
        //设置图表
        this.setCountChart();
        this.setRadarChart();
        //
        $(window).on('resize',_.debounce(_.bind(function(){
          this.setCountChart();
          this.setRadarChart();
        },this),200));
      },this),_.bind(function(){

      },this));
    },
    beforeRouteEnter: function (to, from, next) {
      next(function (vm) {});
    },
    beforeRouteLeave:function(to,from,next){
      $(window).off('resize');
      next();
    },
    filters: {
      getFormatScore: function (value, index) {
        if(value) {
          var arr = value.split(',');
          return arr[index];
        }else {
          return '--';
        }
      }
    },
    methods: {
      gotoDetail:function(data){  //显示地区考核-考核明细
        //
        fjPublic.getContentScrollTop();
        fjPublic.contentScrollTop();
        fjPublic.setLocalData('sub-deptId-detail',data.deptId);
        this.$router.push({path:'local-assessment-detail',query:{deptName:data.deptName,monthVal:this.selectedRTmonthVal,deptId:data.deptId}});
      },
      getAppraiseRules: function() {
        var defer = $.Deferred();
        var vm = this;
        $.ajax({
          url: fjPublic.ajaxUrlDNN + "/getRuleByItemIdAndDeptId",
          type: "POST",
          data: {
            itemId: vm.formLabelAlign.itemId,
            deptId: vm.formLabelAlign.deptId
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
            type: '1',
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
      getAvgScoreData:function(){ //获取平均分折线图数据
          var defer = $.Deferred();
          var vm = this;
          $.ajax({
              url:fjPublic.ajaxUrlDNN + '/getDeptReportLineChart',
              type:'POST',
              data:{
                type: '2',
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
              this.$message({type:'warning',message:'获取平均分折线图数据失败'});
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
              url:fjPublic.ajaxUrlDNN + '/getDeptReportRadarChart',
              type:'POST',
              data:{
                  month:this.selectedRadarMonth,
                  deptId:this.deptId,
                type: '2'
              },
              dataType:'json',
              success:function(data){
                  //console.log(data);
                  // var indicatorNames ={
                  //     discipline:'纪律作风',
                  //     fullTimePost: '专职专岗',
                  //     illegal: '违法违纪',
                  //     inspector: '督察暗访',
                  //     platformManage: '平台管理',
                  //     train:'培训'
                  // };
                  // var maxValues = {
                  //     discipline:20,
                  //     fullTimePost: 15,
                  //     illegal: 15,
                  //     inspector: 20,
                  //     platformManage: 15,
                  //     train:15
                  // };
                var itemNames = (data.blueLineList && data.blueLineList.itemNames) ? data.blueLineList.itemNames.split(',') : ['该月无考核数据'];
                var itemScores = (data.blueLineList && data.blueLineList.itemScores) ? data.blueLineList.itemScores.split(',') : ['--'];
                var scores = (data.blueLineList && data.blueLineList.scores) ? data.blueLineList.scores.split(',') : ['--'];
                var indicatorNames = {};
                var maxValues = {};
                var score = {};
                for(var i=0; i<itemNames.length; i++) {
                  indicatorNames[i] = itemNames[i];
                }
                for(var i=0; i<itemScores.length; i++) {
                  maxValues[i] = parseFloat(itemScores[i]);
                }
                // console.log(maxValues);
                for(var i=0; i<scores.length; i++) {
                  score[i] = parseFloat(scores[i]);
                }
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
      changeRadarMonthVal:function(date){ //改变雷达图表日期输入框的值
          var curTime = new Date().getTime();
          var selectedTime = new Date(date).getTime();
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
              this.$message({type:'warning',message:'获取雷达图表数据失败'});
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
      getPoliceStationRankPageData() { //获取考核排名列表数据
        var that = this;
        var defer = $.Deferred();
        $.ajax({
          url: fjPublic.ajaxUrlDNN + "/getDeptAppraiseReports",
          type: "POST",
          data: {
            type: '2',
            page: this.currentPage,
            rows: this.pageSize,
            month: this.selectedRTmonthVal,        //月份
            deptName: this.deptName,   //派出所名称
            supDeptId: this.supDeptId  //分局id
          },
          dataType: "json",
          success: function (data) {
            that.total = data.total;
            that.assessmentData = null;
            that.assessmentData = data.list;
            that.avgReport = data.avgReport;  // 当月考核平均数据
            that.itemNames = (that.avgReport && that.avgReport.itemNames) ? that.avgReport.itemNames.split(',') : ['该月无考核数据'];
            that.itemScores = (that.avgReport && that.avgReport.itemScores) ? that.avgReport.itemScores.split(',') : ['--'];
            that.scores = (that.avgReport && that.avgReport.scores) ? that.avgReport.scores.split(',') : ['--'];
            that.appraiseAllScore = data.appraiseAllScore;
            defer.resolve();
          },
          error: function (err) {
            defer.reject();
          }
        });
        return defer;
      },
      requestDatas:function(){ //向后台请求数据
          var vm = this,defer = $.Deferred();
          fjPublic.openLoad('数据加载中...');
          $.when(
              this.getSup(),
              this.getAvgScoreData(),
              this.getRadarAvgScoreData(),
              this.getPoliceStationRankPageData()
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
      getRTListData:function(){
        this.clearTableRowClass();
        fjPublic.openLoad('获取数据中...');
        $.when(this.getPoliceStationRankPageData()).then(_.bind(function(){
            fjPublic.closeLoad();
        },this),_.bind(function(){
            fjPublic.closeLoad();
            this.$message({type:'warning',message:'获取考核排名列表数据失败'});
        },this));
      },
      clearTableRowClass:function(){  //清除表格行的类名
          $(this.$refs['pcsRankTable'].$el).find('.el-table__body-wrapper .el-table__row').removeClass('show');
      },
      changeRTdataByFenjvId:function(){  //根据分局id获取考核排名列表数据
        this.currentPage = 1;
        this.getRTListData();
      },
      changeRTdataByPCSname:_.debounce(function(){ //根据输入的派出所名称搜索列表数据
          this.currentPage = 1;
          this.getRTListData();
      },200),
      changeRTdataByMonth:function(){ //根据月份获取考核排名列表数据
        this.currentPage = 1;
        this.getRTListData();
      },
      getSup() {  //获取区县分局单位数据
        var that = this;
        var defer = $.Deferred();
        $.ajax({
          url: fjPublic.ajaxUrlDNN + "/searchDepListBySearch",
          type: "POST",
          data: {},
          dataType: "json",
          success: function (data) {
            //console.log(data);
            /* that.options = _.filter(data.list,function(item,i){
              return item.deptId!='411342000000'&&item.deptId!='430500000000';
            }); */
            that.options = data.list;
            defer.resolve();
          },
          error: function (err) {
            defer.reject();
          }
        });
        return defer;
      },
      //
      currentPageChange(val) {
        this.currentPage = val;
        this.getRTListData();
      },
      currentPageChange1(val) {
        this.currentPage1 = val;
        //this.getRTListData();
      },
      getPjun(val,event) {
        //console.log(val);
        this.deptId = val.deptId;
        var $this = $(event.currentTarget);
        if($this.hasClass('show'))return;
        $this.siblings().removeClass('show').end().addClass('show');
        //设置图表的姓名标识
        this.countChartOption.legend.data[1].name='派出所分值--'+val.deptName;
        this.countChartOption.series[1].name='派出所分值--'+val.deptName;
        this.radarChartOption.legend.data[1].name='派出所分值--'+val.deptName;
        this.radarChartOption.series[0].data[1].name='派出所分值--'+val.deptName;
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
            this.$message({type:'warning',message:'获取派出所考核图表数据失败'});
        },this));
      },
      keepDlNum:function(val){ //小数点后2位
          return val?Math.ceil(parseFloat(val)*100)/100:0.00;
      },
      editE(val) {  // 不批量操作扣分
        if(!this.isCurMonth){
          this.$message({type:'warning',message:'不是当前月份，不能进行考核操作'});
          return;
        }
        // //赋值
        // _.each(val,function(v,k){
        //   if(k in this.initKHDatas){
        //       this.$set(this.initKHDatas,k,v);
        //   }
        // },this);
        // this.formLabelAlign.policeStationCheckIds = val.id;
        // this.formLabelAlign.nowUser = $.cookie(fjPublic.loginCookieKey);
        this.formLabelAlign.deptId = val.deptId;
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
      onSubmit() {  //提交扣分
        var validateBool;
        this.$refs['uploadF'].validate(function(value){
          if(value){
            validateBool = true;
          }
        });
        if(!validateBool)return;
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
        var defer = $.Deferred();
        that.formLabelAlign['nowUser'] = $.cookie(fjPublic.loginCookieKey);
        fjPublic.openLoad('提交中...');
        $.ajax({
          url: fjPublic.ajaxUrlDNN + "/addDeptAppraiseLog",
          type: "POST",
          data: that.formLabelAlign,
          dataType: "json",
          success: function (data) {
            fjPublic.closeLoad();
            that.diaShow = false;
            if (data.errorCode == 0) {
              that.$message.success({
                message: data.errorMsg
              });
            } else {
              that.$message.error({
                message: data.errorMsg
              });
            }
            //刷新列表
            that.getPoliceStationRankPageData();
            defer.resolve();
          },
          error: function (err) {
            fjPublic.closeLoad();
            defer.reject();
          }
        });
        return defer;
      },
      clearF() { //退出扣分弹层操作
        // _.each(this.KPointKeysClone,function(item,i){
        //     delete item['isZero'];
        //     this.$set(this.KPointKeys,i,null);
        //     this.$set(this.KPointKeys,i,item);
        // },this);
        // this.KPointKeysClone = null;
        _.each(this.formLabelAlign,function(v,k){
          this.$set(this.formLabelAlign,k,'');
        },this);
        this.diaShow = false;
        //删除v-modal遮罩层
        fjPublic.removeModalMask();
      },
      exportData() {
        document.forms["formExcle"].submit();
      },
      getALog() {  //获取考核记录数据
        var that = this;
        var defer = $.Deferred();
        if (this.multipleSelection.length == 0) {
          this.$message({type:'warning',message: "请至少选择一项"});
          return;
        }
        var ids = [];
        this.multipleSelection.forEach(el => {
          ids.push(el.id);
        });
        $.ajax({
          url: fjPublic.ajaxUrlDNN + "/getPoliceStationAppraiseLog",
          type: "POST",
          data: {
            ids: ids.join(","),
            page: that.currentPage1,
            rows: that.pageSize1,
            supDeptId: that.supDeptId,
            deptName: that.deptName
          },
          dataType: "json",
          success: function (data) {
            //console.log(data.list);
            if(data.list.length){
              that.opShow = true;
              fjPublic.wrapperAddScroll();
              that.total1 = data.total;
              data.list.forEach(el => {
                el.insertTime = fjPublic.dateStrFormat(el.insertTime);
              });
              that.logList = null;
              that.logList = data.list;
              defer.resolve();
            }else{
              defer.reject();
              that.$message({
                  message: '暂无操作记录',
                  type: 'info'
              })
            }

          },
          error: function (err) {
            defer.reject();
          }
        });
        return defer;
      },
      clearLogPop:function(){ //退出考核记录弹层操作
        this.opShow = false;
        //删除v-modal遮罩层
        fjPublic.removeModalMask();
        fjPublic.wrapperRemoveScroll();
        //关闭后刷新派出所排名列表
        this.getPoliceStationRankPageData();
      },
      canCel(val) {
        var that = this;
        this.$confirm("此操作将撤销该扣分, 是否继续?", "提示", {
            type:'warning',
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            center: true
          })
          .then(() => {
            fjPublic.removeModalMask();
            fjPublic.openLoad('撤销中...');
            $.ajax({
              url: fjPublic.ajaxUrlDNN + "/resetPoliceStationAppraiseLog",
              type: "POST",
              data: {
                ids: val.id
              },
              dataType: "json",
              success: function (data) {
                fjPublic.closeLoad();
                if (data.errorCode == 0) {
                  that.$message.success({
                    message: data.errorMsg
                  });
                  $.when(that.getALog()).fail(function(){
                      that.clearLogPop();
                  });
                } else {
                  that.$message.error({
                    message: data.errorMsg
                  });
                }
              },
              error: function (err) {
                fjPublic.closeLoad();
              }
            });
          })
          .catch(() => {
            fjPublic.removeModalMask();
            this.$message({
              type: "info",
              message: "已取消撤销"
            });
          });
      },
      handleSelectionChange: function (arr) {
        //选择列
        this.multipleSelection = arr;
      },
      allEdit() {  //批量考核操作
        if(!this.isCurMonth){
          this.$message({type:'warning',message:'不是当前月份，不能进行该操作'});
          return;
        }
        if (this.multipleSelection.length == 0) {
          return this.$message({type:'warning',message: "请至少选择一项"});
        }
        this.formLabelAlign.nowUser = $.cookie(fjPublic.loginCookieKey);
        var ids = [];
        this.multipleSelection.forEach(el => {
          ids.push(el.deptId);
        });
        // //找到批量单位中扣分值和加分值最大值中的最小值
        // _.each(this.initKHDatas,function(v,k){
        //   var tmpArr = _.pluck(this.multipleSelection,k);
        //   var minVal = _.min(tmpArr);
        //   this.$set(this.initKHDatas,k,minVal);
        // },this);
        // //
        this.formLabelAlign.deptId = ids.join(",");
        this.diaShow = true;
      },
      clearSelection() {
        this.multipleSelection = null;
        this.multipleSelection = [];
        this.$refs.pcsRankTable.clearSelection();
      },
      addZRR(val) {   //编辑责任人
        var that = this;
        this.$prompt("", "编辑责任人", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            inputValue: val.liableName,
            customClass: 'editChargeMan'
          })
          .then(({
            value
          }) => {
            $.ajax({
              url: fjPublic.ajaxUrlDNN + "/updateDeptPersonInCharge",
              type: "POST",
              data: {
                deptId: val.deptId,
                userName: value,
                type: "station"
              },
              dataType: "json",
              success: function (data) {
                if (data.errorCode == 0) {
                  that.$message.success({
                    message: data.errorMsg
                  });
                } else {
                  that.$message.error({
                    message: data.errorMsg
                  });
                }
                that.getPoliceStationRankPageData();
              },
              error: function (err) {}
            });
          })
          .catch(() => {

          });
      }
    },
    components: {
      fjBreadNav
    }
  };

</script>
<style scope>
  .fj-content_view.dqkh>.fj-block {
    background: #fff;
  }

  .fj-content_view.dqkh>.fj-block.show-all {
    padding: 0px 40px 0px 28px;
  }

  .fj-content_view.dqkh .fj-component_title>.el-button {
    padding: 8px 20px;
  }

  /*  */
  .fj-content_view.dqkh .charts-left-area,
  .fj-content_view.dqkh .charts-right-area {
    padding-top: 28px;
  }

  .fj-content_view.dqkh .charts-left-area {
    width: 66.879562%;
    padding-right: 33px;
  }

  .fj-content_view.dqkh .charts-right-area {
    width: 33.120438%;
  }

  /*  */
  .fj-content_view.dqkh .charts-left-area>.el-radio-group {
    height: 50px;
  }

  .fj-content_view.dqkh .charts-left-area .el-radio {
    line-height: 50px;
    color: rgba(0, 0, 0, 0.65);
  }

  .fj-content_view.dqkh .charts-left-area .el-radio+.el-radio {
    margin-left: 20px;
  }

  .fj-content_view.dqkh .charts-left-area .el-radio__label {
    padding-left: 7px;
  }

  /*  */
  .fj-content_view.dqkh .charts-right-area>.title-box {
    padding-left: 24px;
    height: 50px;
    line-height: 50px;
  }

  .fj-content_view.dqkh .charts-right-area>.title-box>.title {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
  }

  /*  */
  .fj-content_view.dqkh .charts-left-area>.echart-count,
  .fj-content_view.dqkh .charts-right-area>.echart-radar {
    height: 380px;
  }

  /*  */
  .fj-content_view.dqkh>.fj-block.rank {
    padding: 0px 18px 38px;
  }

  .fj-content_view.dqkh>.fj-block.rank .details>.el-date-editor {
    margin-top: 1px;
    margin-right: 10px;
  }

  .fj-content_view.dqkh .fj-block-head>.details>.el-button {
    margin-top: 8px;
  }

  .fj-content_view.dqkh .mj-page_wrap {
    padding: 20px 0 34px;
  }

  .fj-content_view.dqkh .mj-page_wrap .el-pagination {
    text-align: right !important;
  }

  .fj-content_view.dqkh>.fj-block.rank .el-table th {
    padding: 4px 0px;
  }

  .fj-content_view.dqkh>.fj-block.rank .el-table th.left,
  .fj-content_view.dqkh>.fj-block.rank .el-table td.left {
    text-align: left;
  }

  .fj-content_view.dqkh>.fj-block.rank .el-table td {
    padding: 10px 0px;
  }

  .fj-content_view.dqkh .mj-zz {
    padding-left: 30px;
  }

  @media screen and (max-width: 1576px) {
    .fj-content_view.dqkh .mj-zz {
      margin-top: 20px;
      display: block;
    }
  }

  /* .ss-erweima .el-input,
  .ss-erweima .el-textarea {
    width: 10em !important;
  } */

  .fj-content_view.dqkh .e-btns {
    text-align: center;
  }

  .fj-content_view.dqkh .fj-fu {
    display: none;
  }

  .fj-content_view.dqkh .depts-select-info {
    height: 40px;
    line-height: 40px;
    padding-left: 16px;
    margin-bottom: 16px;
    background: #e6f7ff;
    border: 1px solid #bae7ff;
  }

  .fj-content_view.dqkh .depts-select-info>.el-icon-info {
    margin-right: 3px;
    color: #1890ff;
  }

  .fj-content_view.dqkh .depts-select-info>span {
    margin-right: 10px;
  }

  .fj-content_view.dqkh .depts-select-info>.selected>span {
    padding: 0px 4px;
  }

  .fj-content_view.dqkh .depts-select-info>.selected>span,
  .fj-content_view.dqkh .depts-select-info>.clear {
    color: #1890ff;
  }

  .fj-content_view.dqkh .depts-select-info>.clear {
    cursor: pointer;
  }
 .fj-content_view.dqkh .ss-erweima .el-textarea {
    width: 88% !important;
  }
  /* 0226修改 */
    .fj-content_view.dqkh .el-table .el-table__row.show {background:#f5f7fa;}
    .fj-content_view.dqkh .el-dialog .operate-notice {text-align:justify;text-indent:2em;padding:10px 0;color:rgba(0,0,0,.85);}
    .fj-content_view.dqkh .el-dialog .el-icon-question.el-tooltip {margin-left:10px;}
  /* 0301修改 score-minus */
  .fj-content_view.dqkh .el-table td .score-plus {color:green;}
  .fj-content_view.dqkh .el-table td .score-minus {color:red;}
</style>
