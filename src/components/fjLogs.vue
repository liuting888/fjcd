<template>
    <div class="fj-content_view logs">
        <div class="fj-block title">
            <fj-breadNav :bread-data="breadData"></fj-breadNav>
        </div>
        <div class="fj-block content">
            <div class="fj-block-head kaohe">
				<p class="title fj-fl">日志列表</p>
			</div>
            <div class="fj-block-body">
                <!-- <p class="add-rule">
                    <i class="el-icon-circle-plus"></i><span>添加规则</span>
                </p> -->
                <ul class="filterOpe-area">
                    <li class="area-line fj-clear">
                        <div class="item fj-fl">
                            <span class="fj-fl title">起止日期：</span>
                            <el-date-picker class="fj-fl"
                                v-model="logSEtime"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                @change="getLogDataByLogSEtime">
                            </el-date-picker>
                        </div>
                        <div class="item fj-fl">
                            <span class="fj-fl title">关键字：</span>
                            <el-input class="fj-fl search" v-model="logKey" suffix-icon="el-icon-search" placeholder="请输入日志信息关键字" clearable></el-input>
                        </div>
                        <div class="item fj-fl">
                            <el-button class="fj-fl" type="primary" @click="getLogDataByLogKey"><!-- <i class="el-icon-search"></i> --><span>搜索</span></el-button>
                        </div>
                    </li>
                </ul>
                <el-table class="align-left" :data="logsData">
                    <el-table-column prop="insTime" label="插入时间"></el-table-column>
                    <el-table-column prop="logType" label="操作日志类型"></el-table-column>
                    <el-table-column prop="message" label="日志信息" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="userName" label="操作人" show-overflow-tooltip></el-table-column>
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
    </div>
</template>
<script>
import fjBreadNav from '@/components/fjBreadNav';
export default {
    name:'fjLogs',
    data:function(){
        return {
            breadData:[
                {name:'当前位置:',path:''},
                {name:'系统管理',path:''},
                {name:'操作日志',path:''}
            ],
            logKey:'',
            logsData:[],
            currentPage:1,
            pageSize:10,
            total:0,
            logSEtime:'',
            logStartTime:'',
            logEndTime:''
        };
    },
    mounted:function(){
        var vm = this;
        $.when(this.requestDatas()).then(_.bind(function(){
            //调整样式
            $('.el-table th:nth-of-type(3),.el-table td:nth-of-type(3)','.fj-content_view.logs').addClass('align-left');
            //
            $(document).on('keyup',function(ev){
                if(ev.which==13){
                    if(!vm.logKey){
                        vm.$message({type:'warning',message:'请输入日志信息关键字！'});
                        return;
                    }
                    vm.getLogDataByLogKey();
                }
            });
        },this));
    },
    beforeRouteEnter:function(to,from,next){
        next(function(vm){
            $(document).on('keyup',function(ev){
                if(ev.which==13){
                    if(!vm.logKey){
                        vm.$message({type:'warning',message:'请输入日志信息关键字！'});
                        return;
                    }
                    vm.getLogDataByLogKey();
                }
            });
        });
    },
    beforeRouteLeave:function(to,from,next){
        $(document).off('keyup');
        next();
    },
    methods:{
        getLogDataByLogSEtime:function(dateArr){
            if(!dateArr){
                this.logStartTime = '';
                this.logEndTime = '';
            }else{
                this.logStartTime = fjPublic.dateFormatYYMMDD(dateArr[0]);
                this.logEndTime = fjPublic.dateFormatYYMMDD(dateArr[1]);
            }
            this.currentPage = 1;
            this.getLogDataByArgs();
        },
        getLogDataByLogKey:function(){
            this.currentPage = 1;
            this.getLogDataByArgs();
        },
        getLogDataByArgs:function(){
            fjPublic.openLoad('数据加载中...');
            $.when(this.getLogData()).then(_.bind(function(){
                fjPublic.closeLoad();
            },this),_.bind(function(){
                fjPublic.closeLoad();
                this.$message({type:'warning',message:'请求数据失败！！！'});
            },this));
        },
        getLogData:function(){
            var defer = $.Deferred();
			var vm = this;
			$.ajax({  
				url:fjPublic.ajaxUrlDNN + '/getLogList',
				type:'POST',
				data:{
                    nowUser:$.cookie(fjPublic.loginCookieKey),
                    logType:'',
                    keyword:this.logKey,
                    startTime:this.logStartTime,
                    endTime:this.logEndTime,
                    page:this.currentPage,
                    rows:this.pageSize
                },
				dataType:'json',
				success:function(data){
                    //console.log(data);
                    vm.total = data.total;
                    vm.logsData = null;
					vm.logsData = data.rows;
					defer.resolve();
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
        },
        requestDatas:function(){ //向后台请求数据
            var tmpReqFns = [this.getLogData];
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
            this.getLogDataByArgs();
        },
        prevPageChange:function(pageNum){  //点击分页的上一页
            // pageNum  当前页--后的值
            this.currentPage = pageNum;
            this.getLogDataByArgs();
        },
        nextPageChange:function(pageNum){  //点击分页的下一页
            // pageNum  当前页++后的值
            this.currentPage = pageNum;
            this.getLogDataByArgs();
        },
        sizePageChange:function(pageSize){  //改变每页条数时
        // pageSize 每页条数
        }
    },
    components:{
        fjBreadNav
    }
}
</script>
<style lang="less">

</style>
