<template>
    <div class="fj-content_view grkh-detail">
        <div class="fj-block title">
            <fj-breadNav :bread-data="breadData"></fj-breadNav>
        </div>
        <div class="fj-block content">
            <div class="fj-block-head kaohe">
				<p class="title fj-fl">个人考核分数记录表（{{userName}}）</p>
                <el-date-picker class="fj-fr"
                    v-model="selectedKHMonth"
                    type="month"
                    placeholder="请选择月份"
                    @change="getDetailByKHMonth">
                </el-date-picker>
			</div>
            <div class="fj-block-body"></div>
        </div>
    </div>
</template>
<script>
//考核明细 --- 信息区域
window.FjGrkhDetail = function(){
    this.detailBox = null;  //容器
    this.toggleBall = null; //点击展开-收起?
    this.detailContent = null; //内容区
    this.leftContent = null;  //左侧内容区
    this.rightContent = null; //右侧内容区
    this.detailFooter = null;  //汇总信息区域
    this.blockList = [];       //存生成的信息块
};
window.FjGrkhDetail.prototype = {
    //切换按钮html
    toggleBallHtml:'<div class="date-ball is-opened">\
        <p class="title">2018</p>\
        <img src="static/images/fj-sider-arrow.png" alt="" class="arrow">\
    </div>',
    //内容容器html
    detailContentHtml:'<div class="details-content">\
        <div class="left-area"></div>\
        <div class="right-area"></div>\
    </div>',
    //汇总信息html
    detailFooterHtml:'<div class="foot-info">\
        <p class="time"></p>\
        <p class="result"></p>\
    </div>',
    //左边的信息块 wait done
    leftinfoHtml:'<div class="fj-grkh-infoBlock right">\
        <div class="block-content">\
            <i class="border-arrow1"></i><i class="border-arrow2"></i>\
            <p class="time-title fj-clear"><i class="fj-fl el-icon-date"></i><span class="fj-fl"></span></p>\
            <p class="kh-item-desc"><span>考核项：</span><span></span></p>\
            <p class="desc"><span>考核规则：</span><span></span></p>\
        </div>\
    </div>',
    //右边的信息块 wait done
    rightinfoHtml:'<div class="fj-grkh-infoBlock left">\
        <div class="block-content">\
            <i class="border-arrow1"></i><i class="border-arrow2"></i>\
            <p class="time-title fj-clear"><i class="fj-fl el-icon-date"></i><span class="fj-fl"></span></p>\
            <p class="kh-item-desc"><span>考核项：</span><span></span></p>\
            <p class="desc"><span>考核规则：</span><span></span></p>\
        </div>\
    </div>',
    //输入通过或者拒绝理由
    PRreasonHtml:'<div class="el-textarea"><textarea class="el-textarea__inner" placeholder="请输入审核理由"></textarea></div>',
    //按钮区域
    btnAreaHtml:'<div class="btn-area"><span class="btn btn-primary">撤销</span>',
    /* <div class="btn-area"><span class="btn btn-primary">通过</span><span class="btn btn-default">拒绝</span></div> */
    //加减分，审批人信息区域
    resultInfoHtml:'<div class="count-state fj-clear">\
        <p class="fj-fl count"><span class="count-name">分值：</span><span class="count-val"></span></p>\
        <p class="fj-fl state"><span class="state-name fj-fl"></span><img class="fj-fl state-icon" src="" alt=""></p>\
    </div>',
    /* <div class="result-info">
        <p class="add-user"><span>添加人：</span><span class="name"></span></p>
    </div>
    <p><span>审批人：</span><span class="name"></span></p>\
        <p><span>审批时间：</span><span class="time"></span></p>\
        <p><span>备注：</span><span class="remark"></span></p>\ */
    init:function(listData,vueComp){
        if(!listData.length)return;
        this.listData = listData || [];
        this.userName = this.listData[0].userName;
        this.$vueComp = vueComp;  //当前组件的vue对象
        if(!this.listData)return;
        var tmpArr = this.$vueComp.monthVal.split('-');
        this.year = tmpArr[0];
        this.month = tmpArr[1]<10?tmpArr[1].substr(1,1):tmpArr[1];
        //
        this.detailBox = $('<div class="fj-grkh-details"></div>');
        this.toggleBall = $(this.toggleBallHtml);
        this.detailContent = $(this.detailContentHtml);
        //
        this.leftContent = this.detailContent.children('.left-area');    //左侧
        this.rightContent = this.detailContent.children('.right-area');  //右侧
        this.detailFooter = $(this.detailFooterHtml);  //汇总的信息
        //设置toggleBall的日期信息
        this.setToggleBallTime();
        //创建信息块
        this.createBlocks();
        //设置汇总信息
        this.setDetailFooterInfo();
        //组装
        this.detailBox.append(this.toggleBall).append(this.detailContent).append(this.detailFooter);
        return this;
    },
    setToggleBallTime:function(){
        this.toggleBall.children('.title').text(this.year);
        //
        this.toggleBall.on('click',$.proxy(function(ev){
            var $this = $(ev.currentTarget);
            $this.toggleClass('is-opened');
            this.detailContent.stop(true,true).fadeToggle();
            this.detailFooter.stop(true,true).fadeToggle();
        },this));
    },
    createBlocks:function(){  //创建信息块
        $.each(this.listData,$.proxy(function(i,item){
            var blockWrap = new FjGrkhDetailBlock({
                data:item,
                type:i,
                vueComp:this.$vueComp
            });
            //左右添加
            i%2==0?this.leftContent.append(blockWrap.block):this.rightContent.append(blockWrap.block);
            //存信息块
            this.blockList.push(blockWrap);
        },this));
    },
    setDetailFooterInfo:function(){ //设置汇总信息
        this.footerTime = this.detailFooter.children('.time');
        this.footerResult = this.detailFooter.children('.result');
        //
        this.footerTime.text(this.year+'年'+this.month+'月份');
        var str = this.userName + '：';
      $.each(this.$vueComp.details, $.proxy(function(i, item){
        str += item.itemName + item.num + '条，共计' + item.score + '分；';
      },this));
        this.footerResult.text(str);
    },
    clearContent:function(){ //清空信息内容
        this.$vueComp = null;
        //清空信息块
        _.each(this.blockList,function(item){
            item.clearBlock();
            item = null;
        },this);
        this.blockList.splice(0,this.blockList.length);
        this.blockList = null;
        //
        this.detailBox.remove();
        this.detailBox = null;
    }
};
//信息块
window.FjGrkhDetailBlock = function(options){
    this.infoData = options.data;
    this.$vueComp = options.vueComp;
    this.type= options.type;  //放左边还是右边
    //
    this.block = this.type%2===0?$(FjGrkhDetail.prototype.leftinfoHtml):$(FjGrkhDetail.prototype.rightinfoHtml);
    //block的状态
    this[this.infoData.state]();
};
window.FjGrkhDetailBlock.prototype={
    constructor:FjGrkhDetailBlock,
    resultType:[
        {type:'pass',name:'通过',src:'static/images/fj-grkh-correct.png'},
        {type:'refuse1',name:'拒绝',src:'static/images/fj-grkh-wrong.png'},
        {type:'refuse',name:'已撤销',src:'static/images/fj-grkh-wrong.png'}
    ],
    wait:function(){
        //this.block.addClass('wait').children('.block-content').append(FjGrkhDetail.prototype.PRreasonHtml).append(FjGrkhDetail.prototype.btnAreaHtml);
        this.block.addClass('wait').children('.block-content').append(FjGrkhDetail.prototype.resultInfoHtml).append(FjGrkhDetail.prototype.btnAreaHtml);
        //获取元素
        this.titleTime = this.block.find('.time-title > span');   //日期
        //this.PRtextarea = this.block.find('.el-textarea__inner');  //通过或拒绝理由
        this.khItem = this.block.find('.kh-item-desc > span:eq(1)'); //考核标题
        this.desc = this.block.find('.desc > span:eq(1)');   //考核规则
        this.countVal = this.block.find('.count-state .count-val');  //考核分值
        this.stateName = this.block.find('.count-state .state-name'); //状态名
        this.stateIcon = this.block.find('.count-state .state-icon'); //状态图标
        this.addUser = this.block.find('.add-user span.name'); //添加人
        //隐藏按钮
        if(this.infoData.status==1){
            this.block.find('.btn-area').remove();
        }
        //加数据
        this.titleTime.text(this.infoData.insertTime);
        this.khItem.text(this.infoData.itemName);
        this.desc.text(this.infoData.regulation);
        $.each(this.resultType,$.proxy(function(i,item){
            if(this.infoData.resultState ==item.type){
                this.stateName.text(item.name).addClass(item.type);
                this.stateIcon.attr('src',item.src);
                return false;
            }
        },this));
        //
        switch(this.infoData.type){
            case '1': //加分
                this.infoData.score='+'+this.infoData.score;
                break;
            case '2': //减分
                //this.infoData.score='-'+this.infoData.score;
                break;
        }
        this.countVal.text(this.infoData.score);
        this.addUser.text(this.infoData.supUserName);
        //按钮绑事件
        var _this = this;
        this.block.on('click','.btn.btn-primary',$.proxy(function(){  //通过
            this.$vueComp.$confirm('此操作将撤销该条考核信息, 是否继续?', '提示', {
                confirmButtonText: '撤销',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                fjPublic.openLoad('正在撤销...');
                $.when(_this.updateWaitState()).then(function(data){
                    fjPublic.closeLoad();
                    _this.$vueComp.$message({type:'success',message:data.errorMsg});
                    //刷新个人信息
                    _this.$vueComp.getUserKhinfo();
                },function(data){
                    fjPublic.closeLoad();
                    _this.$vueComp.$message({type:'warning',message:data.errorMsg});
                });
            }).catch(()=>{

            });
            /*
            if(!this.PRtextarea.val()){
                this.$vueComp.$message({type:'warning',message:'请输入审核理由！'});
                return false;
            }
            this.$vueComp.$confirm('此操作将审核通过该条考核信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                fjPublic.openLoad('正在提交...');
                $.when(_this.updateWaitState(1)).then(function(){
                    fjPublic.closeLoad();
                    //刷新个人信息
                    _this.$vueComp.getUserKhinfo();
                },function(){
                    fjPublic.closeLoad();
                    _this.$vueComp.$message({type:'warning',message:'审核通过提交失败！'});
                });
            }).catch(()=>{

            }); */

        },this));
        /* this.block.on('click','.btn.btn-default',$.proxy(function(){  //拒绝
            if(!this.PRtextarea.val()){
                _this.$vueComp.$message({type:'warning',message:'请输入审核理由！'});
                return false;
            }
            this.$vueComp.$confirm('此操作将审核拒绝该条考核信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                fjPublic.openLoad('正在提交...');
                $.when(_this.updateWaitState(2)).then(function(){
                    fjPublic.closeLoad();
                    //刷新个人信息
                    _this.$vueComp.getUserKhinfo();
                },function(){
                    fjPublic.closeLoad();
                    _this.$vueComp.$vueComp.$message({type:'warning',message:'审核拒绝提交失败！'});
                });
            }).catch(()=>{

            });
        },this)); */
    },
    done:function(){
        this.block.addClass('done').children('.block-content').append(FjGrkhDetail.prototype.resultInfoHtml);
            //获取元素
        this.titleTime = this.block.find('.time-title > span');   //日期
        this.desc = this.block.find('.desc > span:eq(1)');   //描述
        this.khItem = this.block.find('.kh-item-desc > span:eq(1)'); //考核标题
        this.countVal = this.block.find('.count-state .count-val');   //加减分的值
        this.stateName = this.block.find('.count-state .state-name'); //状态名
        this.stateIcon = this.block.find('.count-state .state-icon'); //状态图标
        this.spMan = this.block.find('.result-info .name'); //审批人
        this.spTIme = this.block.find('.result-info .time'); //审批事件
        this.remark = this.block.find('.result-info .remark'); //备注信息
        $.each(this.resultType,$.proxy(function(i,item){
            if(this.infoData.resultState ==item.type){
                this.stateName.text(item.name).addClass(item.type);
                this.stateIcon.attr('src',item.src);
                return false;
            }
        },this));
        //加数据
        this.titleTime.text(this.infoData.insertTime);
        this.desc.text(this.infoData.regulation);
        this.khItem.text(this.infoData.itemName);
        this.countVal.text(this.infoData.type==1?'+'+this.infoData.score:'-'+this.infoData.score);
        this.spMan.text(this.infoData.checkUserName);
        this.spTIme.text(this.infoData.checkTime);
        this.remark.text(this.infoData.remark);
    },
    updateWaitState:function(type){  //发送审核通过或拒绝的请求
        var defer = $.Deferred();
        /* $.ajax({
            url:fjPublic.ajaxUrlDNN + '/updateCustomScoreApply',
            type:'POST',
            data:{
                nowUser:$.cookie(fjPublic.loginCookieKey),
                type:type, //1（通过），2（拒绝）
                auditOpinion:this.PRtextarea.val(), //审核意见
                id:this.infoData.id  //考核记录编号
            },
            dataType:'json',
            success:function(data){
                console.log(data);
                if(data.errorCode==0){
                    defer.resolve();
                }
            },
            error:function(err){
                defer.reject();
            }
        }); */
        $.ajax({
            url:fjPublic.ajaxUrlDNN + '/updUserAppraiseLog',
            type:'POST',
            data:{
                id:this.infoData.id, //id
                status:'1',  //撤销
            },
            dataType:'json',
            success:function(data){
                if(data.errorCode==0){
                    defer.resolve(data);
                }else{
                    defer.reject(data);
                }
            },
            error:function(err){
                defer.reject();
            }
        });
        return defer;
    },
    clearBlock:function(){
        this.$vueComp = null;
        this.infoData = null;
        this.block.off('click','.btn.btn-primary');
        this.block.off('click','.btn.btn-default');
        this.block = null;
    }
};
//
import fjBreadNav from '@/components/fjBreadNav';
export default {
    name:'fjGerenkaoheDetail',
    data:function(){
        return {
            breadData:[
                {name:'当前位置:',path:''},
                {name:'考核管理',path:''},
                {name:'个人考核',path:'/personal-assessment'},
                {name:'考核明细',path:''}
            ],
            monthVal:fjPublic.date2Month(new Date()), //月份
            userName:'', //当前的userName
            userId:'',  //当前的userId
            /*
                状态，0（未审核），1（通过），2（拒绝）
            */
            statusData:[ //状态数据
                /* {status:0,statusName:'未审核',state:'wait',resultState:''},
                {status:1,statusName:'通过',state:'done',resultState:'pass'},
                {status:2,statusName:'拒绝',state:'done',resultState:'refuse'} */
                {status:0,statusName:'',state:'wait',resultState:''},
                {status:1,statusName:'已撤销',state:'wait',resultState:'refuse'},
              {status:2,statusName:'通过',state:'done',resultState:'pass'}
            ],
            oFjGrkhDetail:null,  //个人考核明细栏
            infoListData:null,  //获取的个人考核明细数据
            details: [],
            selectedKHMonth:fjPublic.date2Month(new Date())  //默认当月
        };
    },
    mounted:function(){
        /* this.userId = fjPublic.getLocalData('userId-detail');
        if(this.userId){
            this.getUserKhinfo();
        } */
    },
    beforeRouteEnter:function(to,from,next){ //
        next(function(vm){
            vm.userId = vm.$route.query.userId||fjPublic.getLocalData('userId-detail');
            vm.userName = vm.$route.query.userName||fjPublic.getLocalData('userName-detail');
            //月份根据个人考核列表月份设置
            vm.monthVal = vm.$route.query.monthVal||fjPublic.date2Month(new Date());
            vm.selectedKHMonth = vm.$route.query.monthVal||fjPublic.date2Month(new Date());
            fjPublic.setLocalData('userId-detail',vm.userId);
            fjPublic.setLocalData('userName-detail',vm.userName);
            vm.getUserKhinfo();
        });
    },
    beforeRouteLeave:function(to,from,next){ //
        if(this.oFjGrkhDetail){
            fjPublic.removeLocalData('userId-detail');
            fjPublic.removeLocalData('userName-detail');
            this.oFjGrkhDetail.clearContent();
            this.oFjGrkhDetail = null;
            fjPublic.setContentScrollTop();
        }
        next();
    },
    methods:{
        getDetailByKHMonth:function(date){ //切换月份
            this.monthVal = !date?fjPublic.date2Month(new Date()):fjPublic.date2Month(date);
            //判断是否大于当前月份
            var curTime = new Date(new Date()).getTime();
            var selectedTime = new Date(this.monthVal).getTime();
            if(selectedTime>curTime){
                this.$message({type:'warning',message:this.monthVal+'月暂无'+this.userName+'的考核明细数据'});
                return;
            }
            this.getUserKhinfo();
        },
        getUserKhinfo:function(){ //获取个人考核明细数据并添加至页面
            $.when(this.requestDatas()).then(_.bind(function(){
                _.each(this.infoListData,function(item){
                    var tmpObj = _.find(this.statusData,function(item2){
                        return item2.status == item.status;
                    },this);
                    this.$set(item,'state',tmpObj.state);
                    this.$set(item,'resultState',tmpObj.resultState);
                },this);
                if(this.oFjGrkhDetail){
                    this.oFjGrkhDetail.clearContent();
                }
                if(this.infoListData.length){ //有数据的时候
                    this.oFjGrkhDetail = null;
                    this.oFjGrkhDetail = new FjGrkhDetail().init(this.infoListData,this);
                    //添加到页面
                    $(this.$el).find('.fj-block.content > .fj-block-body').append(this.oFjGrkhDetail.detailBox);
                }else{ //没数据的时候
                    this.oFjGrkhDetail = null;
                    this.$message({type:'warning',message:this.monthVal+'月份暂无该人员考核明细信息！'});
                }
            },this),_.bind(function(){},this));
        },
        getPersonAppraiseScore:function(){ //获取个人考核明细数据
            var defer = $.Deferred();
			var vm = this;
			$.ajax({
				url:fjPublic.ajaxUrlDNN + '/getUserAppraiseLogNoPage',
				type:'POST',
				data:{
                    month:this.monthVal, //月份，默认当月
                    userId:this.userId   //userId
                },
				dataType:'json',
				success:function(data){
                    //console.log(data);
                    if($.isArray(data.list)&&data.list.length){
                      vm.details = null;
                        vm.details = data.details;
                        vm.infoListData = null;
                        vm.infoListData = data.list;
                        defer.resolve();
                    }else{
                        vm.infoListData = null;
                        vm.infoListData = [];
                      vm.details = null;
                      vm.details = [];
                      defer.resolve();
                    }
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
        },
        requestDatas:function(){ //向后台请求数据
            var tmpReqFns = [this.getPersonAppraiseScore];
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
    components:{
        fjBreadNav
    }
}
</script>
<style>
/*  */
.fj-content_view.grkh-detail .fj-block-head.kaohe .el-date-editor {margin-top:9px;}
.fj-content_view.grkh-detail .fj-block-body {padding:20px 0px 34px;}
.fj-content_view.grkh-detail .fj-block-body:after {content:'';position:absolute;left:50%;top:20px;bottom:34px;width:2px;margin-left:-1px;background:rgba(228,229,230,1);}
/* 个人考核明细 详情列表 */
.fj-grkh-details {width:800px;margin:0 auto;text-align:center;}
.fj-grkh-details + .fj-grkh-details {margin-top:40px;}
/*  */
.fj-grkh-details > * {position:relative;z-index:2;}
.fj-grkh-details > .date-ball {width:72px;height:72px;margin:0 auto;color:#fff;border:2px solid #fff;background:rgba(185,195,204,1);cursor:pointer;border-radius:50%;}
.fj-grkh-details > .date-ball > .title {font-size:18px;line-height:72px;}
.fj-grkh-details > .date-ball > .arrow {position:absolute;bottom:10px;left:50%;width:8px;height:12px;margin-left:-4px;transform:rotate(-90deg);}
.fj-grkh-details > .date-ball.is-opened > .arrow {transform:rotate(90deg);}
/*  */
.fj-grkh-details > .details-content {display:flex;flex-flow:row nowrap;overflow:hidden;}
.fj-grkh-details > .details-content > .left-area,.fj-grkh-details > .details-content > .right-area {flex:0 0 50%;}
.fj-grkh-details > .details-content > .left-area > *,.fj-grkh-details > .details-content > .right-area > * {display:inline-block;}
.fj-grkh-details > .details-content > .left-area {text-align:right;}
.fj-grkh-details > .details-content > .right-area {text-align:left;padding-top:180px;}
/*  */
.fj-grkh-details > .foot-info {min-height:80px;padding-top:10px;background:rgba(244,244,245,1);overflow:hidden;}
.fj-grkh-details > .foot-info > .time {font-size:16px;line-height:28px;color:rgba(0,0,0,.85);}
.fj-grkh-details > .foot-info > .result {line-height:28px;}
/*  */
.fj-grkh-infoBlock {position:relative;width:100%;}
.fj-grkh-infoBlock:after {content:'';position:absolute;top:20px;width:16px;height:16px;border-radius:50%;}
.fj-grkh-infoBlock.wait:after{background:#1890FF;}
.fj-grkh-infoBlock.done:after{background:#D9D9D9;}
.fj-grkh-infoBlock.left {padding-left:52px;}
.fj-grkh-infoBlock.left:after {left:-8px;}
.fj-grkh-infoBlock.right {padding-right:52px;}
.fj-grkh-infoBlock.right:after {right:-8px;}
.fj-grkh-infoBlock > .block-content {position:relative;min-height:180px;padding:16px 20px;border:1px solid rgba(217,217,217,1);border-radius:6px;text-align:left;}
.fj-grkh-infoBlock.right > .block-content > .border-arrow1,
.fj-grkh-infoBlock.right > .block-content > .border-arrow2,
.fj-grkh-infoBlock.left > .block-content > .border-arrow1,
.fj-grkh-infoBlock.left > .block-content > .border-arrow2 {position:absolute;width:0;height:0;}
.fj-grkh-infoBlock.right > .block-content > .border-arrow1 {top:15px;right:-24px;border:12px solid transparent;border-left-color:rgba(217,217,217,1);}
.fj-grkh-infoBlock.right > .block-content > .border-arrow2 {top:17px;right:-20px;border:10px solid transparent;border-left-color:rgba(255,255,255,1);}
.fj-grkh-infoBlock.left > .block-content > .border-arrow1 {top:15px;left:-24px;border:12px solid transparent;border-right-color:rgba(217,217,217,1);}
.fj-grkh-infoBlock.left > .block-content > .border-arrow2 {top:17px;left:-20px;border:10px solid transparent;border-right-color:rgba(255,255,255,1);}
/*  */
.fj-grkh-infoBlock > .block-content > .time-title {line-height:24px;margin-bottom:12px;}
.fj-grkh-infoBlock > .block-content > .time-title > .el-icon-date {font-size:24px;margin-right:10px;}
.fj-grkh-infoBlock > .block-content > .time-title > span {font-size:18px;line-height:24px;color:rgba(0,0,0,1);}
/*  */
.fj-grkh-infoBlock > .block-content > .desc,
.fj-grkh-infoBlock > .block-content > .result-info {line-height:22px;text-align:justify;word-wrap:break-word;word-break:break-all;}
/*  */
.fj-grkh-infoBlock > .block-content .el-textarea {padding-top:8px;}
.fj-grkh-infoBlock > .block-content .el-textarea__inner {height:76px;color:rgba(0,0,0.65);}
.fj-grkh-infoBlock > .block-content > .btn-area {font-size:0px;padding-top:10px;}
.fj-grkh-infoBlock > .block-content .btn {display:inline-block;min-width:60px;padding:0px 18px;height:26px;font-size:12px;line-height:26px;border-radius:15px;cursor:pointer;}
.fj-grkh-infoBlock > .block-content .btn + .btn {margin-left:16px;}
.fj-grkh-infoBlock > .block-content .btn:active {transform:translateY(3px);}
.fj-grkh-infoBlock > .block-content .btn-primary {background:rgba(24,144,255,1);color:#fff;}
.fj-grkh-infoBlock > .block-content .btn-default {background:rgba(255,255,255,1);border:1px solid rgba(217,217,217,1);}
/*  */
.fj-grkh-infoBlock > .block-content > .count-state {height:42px;line-height:42px;}
.fj-grkh-infoBlock > .block-content > .count-state > .state {margin-left:50px;}
.fj-grkh-infoBlock > .block-content > .count-state span[class^="count"] {color:rgba(0,0,0,0.85);}
.fj-grkh-infoBlock > .block-content > .count-state span[class^="state"] {margin-right:6px;}
.fj-grkh-infoBlock > .block-content > .count-state span[class^="state"].pass {color:rgba(37,195,43,1);}
.fj-grkh-infoBlock > .block-content > .count-state span[class^="state"].refuse {color:rgba(245,34,45,1);}
.fj-grkh-infoBlock > .block-content > .count-state .state-icon {margin-top:9px;}
/*  */
.fj-grkh-infoBlock > .block-content > .result-info {color:rgba(0,0,0,.5);}
/*  */
.fj-grkh-infoBlock.left,.fj-grkh-infoBlock.right {margin-bottom:180px;}
.fj-grkh-infoBlock.left:last-child,.fj-grkh-infoBlock.right:last-child {margin-bottom:20px;}
.fj-grkh-infoBlock + .fj-grkh-infoBlock {}


</style>


