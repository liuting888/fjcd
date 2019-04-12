<template>
  <div id="app">
	<!-- 登录 -->
	<div class="fj-login-box" v-show="toggleLoginArea">
		<!-- 背景图片 -->
		<img class="login-bg" src="@/assets/images/fj-login-bg2.png" alt="">
		<!-- 登录区域 -->
		<div class="fj-login-area">
			<!-- <img class="area-bg" src="static/images/fj-login-innerBg.png" alt=""> -->
			<div class="fj-login-inner">
				<div class="title-area">
					<img src="@/assets/images/fj-logo.png" alt="" class="logo">
					<p class="title">{{cityName}}辅警工作管理系统</p>
					<ul class="kh-list">
						<li class="kh-list-item">满足辅警人员日常管理需要</li>
						<li class="kh-list-item">为辅警履职提供信息化能力</li>
					</ul>
					<ul class="kh-list">
						<li class="kh-list-item">警务辅助力量服务公安工作</li>
						<li class="kh-list-item">构建互联网群防群治新生态</li>
					</ul>
				</div>
				<div class="login-info">
					<img class="bg" src="@/assets/images/fj-info-bg.png" alt="">
					<div class="login-info-wrap fj-clear">
						<div class="fj-fl left">
							<p class="title">用户登录</p>
							<div class="insert-line">
								<el-input clearable placeholder="请输入登录账号" v-model="userName"></el-input>
							</div>
							<div class="insert-line">
								<el-input type="password" clearable placeholder="请输入登录密码" v-model="userPass"></el-input>
							</div>
							<p class="login-btn" @click.stop="login">登录</p>
						</div>
						<div class="fj-fr right">
							<img class="qr-code" :src="qrCodeUrl" alt="">
							<div class="link-area">
								<a href="javascript:;" @click="appDownload">APP下载</a>
								<a href="javascript:;" @click="useHelp">使用帮助</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 页脚信息 -->
		<div class="fj-login-foot">
			<p class="authourize">{{cityName}}公安局 Copyright © 2014-2020 All Rights 本系统由长沙公信诚丰信息技术服务有限公司提供技术支持</p>
    		<p class="advice">本系统使用建议：1280 X 800 以上分辨率显示器，支持 HTML5/CSS3的浏览器（谷歌-Chrome，火狐-FireFox）</p>
		</div>
	</div>
    <div class="fj-header fj-clear">
	<div class="logo-area fj-fl">
		<a class="logo-link fj-fl" href=""><img src="static/images/fj-logo.png" alt=""></a>
		<p class="logo-txt fj-fl">{{cityName}}辅警工作管理系统</p>
	</div>
	<div class="user-info fj-fr">
		<div class="ope-area fj-fl">
			<div class="ope-area-item userInfo fj-fl">
				<span class="fj-fl">{{userInfo.userName}}</span><span class="fj-fl separator">|</span><span class="fj-fl">{{userInfo.deptname}}</span>
			</div>
			<div class="ope-area-item user-headImg fj-fl">
				<img class="headImg" :src="headImgUrl+userId" alt="">
			</div>
			<el-popover
			popper-class="fjHeader"
			placement="bottom-start"
			width="336"
			trigger="hover">
				<div class="fj-block">
					<div class="fj-block-head fj-clear"><p class="title fl">待办（<span>{{waitInfoData.length}}</span>）</p></div>
					<div class="fj-block-body waitInfo">
						<ul v-show="waitInfoData.length">
							<li class="wait-item" v-for="(item,i) in waitInfoData" :key="i" @click="tabRouteView(item)">
								<p class="title fj-clear">
									<span class="fj-fl" v-text="item.typeName"></span>
									<el-button class="fj-fr" :type="item.status==0?'info':item.status==1?'primary':item.status==2?'danger':''" plain>{{item.status==0?'待处理':item.status==1?'待审核':item.status==2?'进行中':''}}</el-button>
								</p>
								<p class="info-line fj-ellipsis">
									<span class="title" v-text="item.oneLineTitle"></span>
									<span class="txt" v-text="item.oneLine"></span>
								</p>
								<p class="info-line fj-ellipsis">
									<span class="title" v-text="item.twoLineTitle"></span>
									<span class="txt" v-text="item.twoLine"></span>
								</p>
								<p class="info-line fj-ellipsis">
									<span class="title" v-text="item.threeLineTitle"></span>
									<span class="txt" v-text="item.threeLine"></span>
								</p>
							</li>
						</ul>
						<div class="el-table__empty-block" v-show="!waitInfoData.length"><span class="el-table__empty-text">暂无数据</span></div>
					</div>
					<div class="clear-btn-box" style="text-align:center;" v-show="waitInfoData.length">	
						<el-button type="text" class="clear-wait-info" @click="emptyBacklog">清空待办</el-button>
					</div>
				</div>
				<div class="ope-area-item fj-fl" slot="reference">
					<el-badge :value="waitInfoData.length" type="primary"></el-badge>
					<img class="fj-XY-center" src="static/images/fj-header-icon_tz.png" alt="">
				</div>
			</el-popover>
			<div class="ope-area-item fj-fl last" @click="exitSystem">
				<img class="fj-XY-center" src="static/images/fj-header-icon_exit.png" alt="">
			</div>
		</div>
		<!-- <el-popover
			popper-class="fjHeader"
			placement="bottom"
			width="200"
			trigger="hover">
			<div class="fj-block">
				<div class="fj-block-head fj-clear"><p class="title fl">用户信息</p></div>
				<div class="fj-block-body user">
					<p class="info-line"><span>姓名：</span><span class="txt" v-text="userInfo.userName"></span></p>
					<p class="info-line"><span>角色：</span><span class="txt" v-text="userInfo.roleName"></span></p>
				</div>
			</div>
			<div class="user-headImg fj-fl" slot="reference"><img class="headImg" :src="headImgUrl+userId" alt=""></div>
		</el-popover> -->
	</div>
</div>
<!-- 导航 -->
<div class="fj-sider">
  <img class="sider-bg" src="static/images/fj-sider-bg.png" alt="">
	<div class="fj-sider-toggle" @click="toggleNav($event)">
		<p></p>收起/展开
		<img src="static/images/fj-sider-toggle.png" alt="">
	</div>
  <!-- 导航 -->
  <fj-nav></fj-nav>
</div>
<div class="fj-body">
	<div class="fj-content" v-if="!toggleLoginArea">
		<!--切换-->
		<dsTransition enter-time="200" leave-time="200">
			<keep-alive>
			<router-view/>
			</keep-alive>
		</dsTransition>
		<fj-footer></fj-footer>
	</div>
</div>
  </div>
</template>
<script>
import dsTransition from '@/components/dsTransition';
import fjNav from '@/components/fjNav';   //导航
import fjFooter from '@/components/fjFooter';   //页脚
export default {
  	name: 'App',
  	data:function(){
		return {
				cityName:'',
				fjSider:null,  //侧边栏
				toggleLoginArea:true, //切换显示登录框
				userInfo:{},
				userName:'',   //用户名
				userPass:'',  //用户密码
				headImgUrl:fjPublic.ajaxUrlDNN+'/getAvatarByUserId?userid=',
				qrCodeUrl:fjPublic.ajaxUrlDNN+'/getApkQrCode',
				userId:'',
				waitInfoData:[],  //待办
				waitTypes:{
					'leave':{
						'typeName':'请休假',
						'oneLineTitle':'人员名称：',
						'twoLineTitle':'请假理由：',
						'threeLineTitle':'请假时间：',
						'routeName':'/fjAttend-leave'
					},
					'sign':{
						'typeName':'考勤申诉',
						'oneLineTitle':'人员名称：',
						'twoLineTitle':'考核日期：',
						'threeLineTitle':'备注：',
						'routeName':'/fjAttend-appeal'
					},
					'mission':{
						'typeName':'工作任务',
						'oneLineTitle':'任务标题：',
						'twoLineTitle':'负责人：',
						'threeLineTitle':'执行人：',
						'routeName':'/work-manage-mission'
					},
					'info':{
						'typeName':'信息采集',
						'oneLineTitle':'采集类型：',
						'twoLineTitle':'采集人员：',
						'threeLineTitle':'部门单位：',
						'routeName':'/fjWorkManage-info'
					},
					'log':{
						'typeName':'工作日志',
						'oneLineTitle':'工作日期：',
						'twoLineTitle':'人员名称：',
						'threeLineTitle':'工作内容：',
						'routeName':'/fjWorkManage-workLog'
					},
					'score':{
						'typeName':'个人考核-加分',
						'oneLineTitle':'人员名称：',
						'twoLineTitle':'加分分值：',
						'threeLineTitle':'申请理由：',
						'routeName':'/personal-assessment',
						'realRouteName':'/personal-assessment-list'
					},
					'train':{
						'typeName':'培训中心',
						'oneLineTitle':'培训日期：',
						'twoLineTitle':'培训内容：',
						'threeLineTitle':'参与人员：',
						'routeName':'/training'
					}
				},
				timer:null
		};
	},
	beforeCreate:function(){
		//常用标签
		if(!fjPublic.getLocalData('commonLinks')){
			fjPublic.setLocalData('commonLinks',JSON.stringify([
				{name:'首页',routeName:'/index'},
				{name:'数据中心',routeName:'/data-center'},
				{name:'工作任务',routeName:'/work-manage-mission'},
				{name:'考勤历史',routeName:'/fjAttend-history'},
				{name:'请假休假',routeName:'/fjAttend-leave'},
				{name:'单位考核',routeName:'/unit-assessment'},
				{name:'个人考核',routeName:'/personal-assessment'},
				{name:'组织架构',routeName:'/organizational-structure'}
			]));
		}
		//加入腾讯地图的js
		fjPublic.loadMapScript();
	},
	created:function(){
	},
	mounted:function(){
		var vm = this;
		//禁用右键点击
		//$('.fj-login-box','#app').on('contextmenu',function(e){return false;});
		//侧边栏
		this.fjSider = $('.fj-sider');
		if(fjPublic.getLocalData('cityInfos')){
			//
			fjPublic.cityInfos = $.parseJSON(fjPublic.getLocalData('cityInfos'));
			//
			this.pageOpendSetting();
		}else{
			//获取区域基本信息
			$.when(this.getCityInfo()).then((data)=>{
				var tmpArr;
				$.each(data,function(k,v){
					if(k=='coordinates'){
						v = v.replace(/[\{\}]/g,'');
						tmpArr = v.split(',');
					}
					fjPublic.cityInfos[k] = v;
				});
				fjPublic.cityInfos.lat = Number(tmpArr[0].split(':')[1]);
				fjPublic.cityInfos.lng = Number(tmpArr[1].split(':')[1]);
				//
				fjPublic.setLocalData('cityInfos',JSON.stringify(fjPublic.cityInfos));
				//
				vm.pageOpendSetting();
			},()=>{
				this.$alert('获取地区基本信息失败！请检查网络相关配置！','提示').then(()=>{
					fjPublic.removeModalMask();
					window.location.reload();
				});
			});
		}
		//路由切换时获取待办事项数据
		if(this.$router){
			this.$router.beforeEach(function(to,from,next){
				$.when(vm.getNewBacklog()).then(function(){},function(){
					vm.$message({type:'warning',message:'获取待办事项数据失败！'});
				});
				next();
			});
		}
	},
	methods:{
		pageOpendSetting:function(){ //登录页设置
			fjPublic.loginCookieKey = fjPublic.cityInfos.userInfo+'qd';
			document.title= fjPublic.cityInfos.citiName+'辅警工作管理系统';
			this.cityName = fjPublic.cityInfos.deptName;
			this.$el.style.visibility = 'visible';
			$(document).off('keyup').on('keyup',_.bind(function(ev){
				if(ev.which==13){
					this.login();
				}
			},this));
			//
			this.userInfo = $.parseJSON(fjPublic.getLocalData('userInfo'))||{};
			if(!$.isEmptyObject(this.userInfo)){
				this.userId = this.userInfo.userId;
			}
			if($.cookie(fjPublic.loginCookieKey)){
				this.toggleLoginArea = false;
				$(document).off('keyup');
				var routerName=this.setRouteName();
				this.$router.push('/'+routerName);
				_.delay(function(){
					fjSideNav.setInitState();
				},100);
				//cookie是否失效
				this.refreshLoginCookie();
			}else{
				clearInterval(this.timer);
				//重定向
				this.$router.push('/');
			}
		},
		refreshLoginCookie:function(){
			var vm = this;
			clearInterval(this.timer);
			this.timer = setInterval(function(){
				if(!$.cookie(fjPublic.loginCookieKey)){
					clearInterval(vm.timer);
					fjPublic.removeLocalData('cityInfos');
					fjPublic.removeLocalData('userInfo');
					vm.$alert('登录已失效，请重新登录！','提示').then(()=>{
						fjPublic.removeModalMask();
						window.location.reload();
					});
				}
			},60000);
		},
		getCityInfo:function(){  //获取地区基本信息
			var defer = $.Deferred(); 
			$.ajax({  // 
				url:fjPublic.ajaxUrlDNN + '/getBasicSysConfig',
				type:'POST',
				data:{},
				dataType:'json',
				success:function(data){
					if(data&&!$.isEmptyObject(data)){
						defer.resolve(data);
					}else{
						defer.reject();
					}
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
		},
		tabRouteView:function(info){ //点击待办项切换页面
			if(info.realRouteName){
				this.$router.push(info.realRouteName);
				_.delay(function(){
					fjSideNav.setInitState(info.routeName);
				},100);
			}else{
				this.$router.push(info.routeName);
				_.delay(function(){
					fjSideNav.setInitState();
				},100);
			}
		},
		emptyBacklog:function(){ //清空待办事项
			var defer = $.Deferred();
			var vm = this;
			$.ajax({  // 
				url:fjPublic.ajaxUrlDNN + '/emptyBacklog',
				type:'POST',
				data:{
                    nowUser:$.cookie(fjPublic.loginCookieKey),
					userId:this.userInfo.userId
                },
				dataType:'json',
				success:function(data){
					//console.log(data);
					if(data.errorCode==0){
						vm.waitInfoData.splice(0,vm.waitInfoData.length);
						vm.$message({type:'success',message:'清空待办事项成功！'});
					}
					defer.resolve();
				},
				error:function(err){
					vm.$message({type:'warning',message:'清空待办事项失败！'});
					defer.reject();
				}
			});
			return defer;
		},
		getNewBacklog:function(){ //获取待办事项
			var defer = $.Deferred();
			var vm = this;
			$.ajax({  // 
				url:fjPublic.ajaxUrlDNN + '/getNewBacklog',
				type:'POST',
				data:{
					nowUser:$.cookie(fjPublic.loginCookieKey)
                },
				dataType:'json',
				success:function(data){
					//console.log(data);
					if(data.list&&data.list.length>0){
						vm.waitInfoData = null;
						_.each(data.list,function(item){
							var tmpObj = vm.waitTypes[item.type];
							if(tmpObj){
								_.each(tmpObj,function(v,k){
									vm.$set(item,k,v);
								});
							}
						});
						vm.waitInfoData = data.list;
					}
					defer.resolve();
				},
				error:function(err){
					vm.$message({type:'warning',message:'获取待办事项失败！'});
					defer.reject();
				}
			});
			return defer;
		},
		toggleNav:function(ev){  //收起-展开
			var $this = $(ev.currentTarget);
			//
			this.fjSider.toggleClass('sider-toggle');
			$('.fj-body').toggleClass('sider-toggle');
			if(this.fjSider.hasClass('sider-toggle')){
				//解绑导航一级菜单点击事件
				fjSideNav.unbindFirstItemsClickFn().siderOpen2Close();
			}else{
				//导航一级菜单绑定点击事件
				fjSideNav.bindFirstItemsClickFn().siderClose2Open();
			}	
			//导航栏收起或展开的时候，触发页面resize事件
			$(window).triggerHandler('resize');
		},
		login:function(){
			if(!this.userName&&!this.userPass){
				this.$message({
					type:'warning',
					message:'请输入用户名和密码！'
				});
				return;
			}
			if(!this.userName){
				this.$message({
					type:'warning',
					message: '请输入用户名！'
				});
				return;
			}
			if(!this.userPass){
				this.$message({
					type:'warning',
					message: '请输入密码！'
				});
				return;
			}
			var vm = this;
			$.ajax({
				url: fjPublic.ajaxUrlDNN + '/onelogin',
				type: 'POST',
				data: {
					account: this.userName,	// 用户名
  					password: this.userPass	// 密码
				},
				dataType:'json',
				success: function(data){
					console.log(data);
					if(data.result.errorCode == 0) {
						$(document).off('keyup');
						// 保存当前用户信息（编码后）
						vm.userId = data.nowUser.userId;
						fjPublic.setLocalData('userInfo',JSON.stringify(data.nowUser));
						vm.userInfo = $.parseJSON(fjPublic.getLocalData('userInfo'));
						$.cookie(fjPublic.loginCookieKey, data.value, { expires:1});
						var routerName=vm.setRouteName();
						vm.$router.push('/'+routerName);
						window.location.reload();
					}else {
						vm.$message({
							type: 'warning',
							message: data.result.errorMsg
						});
					}
				},
				error: function(){
					vm.$message({
						type:'warning',
						message:'登录失败'
					});
				}
			});
		},
		setRouteName:function(){
			var routerName;
			var hashNames = window.location.hash.split('/');
			if(hashNames[1]==''||hashNames[1]=='noLogin'){
				routerName = 'index';
			}else{
				routerName = hashNames[1];
			}
			if(routerName=='500'||routerName=='404'||routerName=='403'){
				routerName = 'index';
			}
			return routerName;
		},
		exitSystem:function(){
			var vm = this;
			this.$confirm('确定要退出系统吗？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				clearInterval(this.timer);
				$.removeCookie(fjPublic.loginCookieKey);
				fjPublic.removeLocalData('cityInfos');
				fjPublic.removeLocalData('userInfo');
				this.toggleLoginArea = true;
				this.$router.push('/');
				$(document).on('keyup',_.bind(function(ev){
					if(ev.which==13){
						this.login();
					}
				},this));
			}).catch(() => {});
		},
		appDownload:function(){
			//this.$alert('测试中...','提示');
		},
		useHelp:function(){
			//this.$alert('测试中...','提示');
		}
	},
  components:{
    dsTransition,
    fjNav,
    fjFooter
  }
}
</script>

<style>
#app {
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif; */visibility: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.fj-header,.fj-sider,.fj-body,.fj-login-box,.fj-login-area {position:fixed;}
/* 登录 */
.fj-login-box {top:0;bottom:0;left:0;right:0;z-index:5;}
.fj-login-box > .login-bg {position:absolute;top:0;left:0;width:100%;height:100%;}
.fj-login-area {top:0;left:0;right:0;bottom:0;text-align:center;padding-bottom:88px;}
.fj-login-area:after {content:'';display:inline-block;vertical-align:middle;width:0;height:100%;}
.fj-login-area > .fj-login-inner {display:inline-block;vertical-align:middle;}
.fj-login-area > .fj-login-inner > .title-area {}
.fj-login-area > .fj-login-inner > .title-area > .logo {display:block;width:91px;margin:0 auto 17px;}
.fj-login-area > .fj-login-inner > .title-area > .title {font-size:48px;font-weight:bold;color:rgba(255,255,255,1);line-height:48px;text-shadow:0px 0px 5px rgba(11,54,94,0.9);margin-bottom:10px;}
.fj-login-area > .fj-login-inner > .title-area > .kh-list {display:flex;justify-content:center;}
.fj-login-area > .fj-login-inner > .title-area .kh-list-item {position:relative;margin:0px 20px;line-height:30px;font-size:18px;color:rgba(0,0,0,0.8);}
.fj-login-area > .fj-login-inner > .title-area .kh-list-item:after {content:'';position:absolute;top:50%;left:-14px;width:8px;height:8px;margin-top:-4px;background:rgba(0,0,0,.3);border-radius:50%;}
.fj-login-area > .fj-login-inner > .login-info {position:relative;width:670px;height:370px;margin:0 auto;padding:58px 72px 0px 77px;overflow:hidden;text-align:left;}
.fj-login-area > .fj-login-inner > .login-info > .login-info-wrap {position:relative;z-index:2;}
.fj-login-area > .fj-login-inner > .login-info > .login-info-wrap > .left {width:320px;}
.fj-login-area > .fj-login-inner > .login-info > .login-info-wrap > .right {margin-top:54px;}
.fj-login-area > .fj-login-inner > .login-info > .bg {position:absolute;top:0;left:0;max-width:100%;max-height:100%;}
.fj-login-area > .fj-login-inner > .login-info .title {margin-bottom:10px;font-size:24px;line-height:44px;color:#001C33;}
.fj-login-area > .fj-login-inner > .login-info .insert-line {position:relative;height:44px;margin-bottom:16px;}
.fj-login-area > .fj-login-inner > .login-info .insert-line > .el-input {width:100%;}
.fj-login-area > .fj-login-inner > .login-info .insert-line > .el-input > .el-input__inner {height: 42px;line-height: 42px;}
.fj-login-area > .fj-login-inner > .login-info .login-btn {position:relative;height:50px;line-height:50px;background:linear-gradient(0deg,rgba(40,123,255,1),rgba(67,138,252,1));border-radius:4px;font-size:20px;color:#fff;letter-spacing:10px;text-align:center;cursor:pointer;}
.fj-login-area > .fj-login-inner > .login-info .login-btn:active {top:2px;}
.fj-login-area > .fj-login-inner > .login-info .qr-code {display:block;margin:0 auto;max-width:120px;max-height:120px;}
.fj-login-area > .fj-login-inner > .login-info .link-area {padding-top:18px;text-align:center;}
.fj-login-area > .fj-login-inner > .login-info .link-area > a {position:relative;padding:0px 8px;font-size:14px;color:rgba(0,0,0,.85);line-height:24px;}
.fj-login-area > .fj-login-inner > .login-info .link-area > a:first-child:after {content:'';position:absolute;top:0;right:-3px;width:1px;height:100%;background:rgba(0,0,0,.65);}
.fj-login-area > .fj-login-inner > .login-info .link-area > a:hover {text-decoration:underline;}
.fj-login-foot {position:absolute;left:0;right:0;bottom:0;text-align:center;}
.fj-login-foot > p {color:#fff;line-height:22px;}
/*  */
.fj-header {left:0;right:0;top:0;height:50px;background-color:#fff;z-index:1;}
.fj-sider {left:0;top:50px;bottom:0;width:200px;overflow:hidden;overflow-y:auto;z-index:4;box-shadow:0px 0px 4px rgba(40,120,213,0.2);}
.fj-sider > .sider-bg {position:absolute;top:0;left:0;height:100%;width:100%;}
.fj-sider > .fj-sider-toggle {position:absolute;top:7px;left:10px;width:180px;height:36px;line-height:34px;font-size:16px;color:#E8E8E8;letter-spacing:1px;text-align:center;cursor:pointer;}
.fj-sider > .fj-sider-toggle > img {position:absolute;top:5px;right:8px;width:22px;height:22px;}
.fj-sider.sider-toggle {left:-200px;overflow:visible;}
.fj-sider.sider-toggle > .fj-sider-toggle {top:0px;left:60px;background:rgba(0,0,0,.85);}
/*  */
.fj-body {left:200px;right:0;top:50px;bottom:0;z-index:3;box-shadow:0px 0px 4px rgba(40,120,213,0.2);}
.fj-body.sider-toggle {left:40px;}
.fj-content {position:absolute;left:0;right:0;top:0px;bottom:0;overflow:hidden;overflow-y:auto;}
.fj-content.hide-scroll {overflow-y:hidden;}
/*  */
.fj-header > .logo-area {padding-left:20px;}
.fj-header > .logo-area > .logo-link {margin:7px 10px 0px 0px;width:35px;height:36px;}
.fj-header > .logo-area > .logo-link > img {width:100%;max-width:100%;}
.fj-header > .logo-area > .logo-txt {margin-top:7px;line-height:34px;font-size:20px;color:rgba(0,0,0,0.85);}
/*  */
.fj-header > .user-info {padding-right:60px;}
.fj-header .ope-area {margin-top:9px;}
.fj-header .ope-area-item {position:relative;width:32px;height:32px;margin-right:28px;background-color: #E3E3E3;border-radius:50%;text-align:center;line-height:32px;cursor:pointer;}
.fj-header .ope-area-item.userInfo {width:auto;margin-right:10px;background-color:transparent;}
.fj-header .ope-area-item.userInfo > .separator {margin:0px 6px;margin-top:-2px;color:rgba(0,0,0,.15);}
.fj-header .ope-area-item.last {margin-right:0px;}
.fj-header .ope-area-item > .el-badge {position:absolute;top:-10px;right:-8px;}
.fj-header .ope-area-item .el-badge__content {line-height:16px;}
.fj-header .ope-area-item > img {width:40%;max-width:40%;}
/* .fj-header > .user-info .user-headImg {width:36px;height:36px;margin-top:7px;}
.fj-header > .user-info .user-headImg > img.headImg {width:100%;height:100%;border-radius:50%;cursor:pointer;} */
.fj-header .ope-area-item.user-headImg > img {width:100%;max-width:100%;height:100%;border-radius:50%;}
/* 内容区域 */
.fj-content_view {min-height:100%;}
.fj-content_view.home {padding:18px;}
/*  */
.fj-block {color:rgba(0,0,0,0.65);background:#fff;}
.fj-block.title {padding-left:28px;}
.fj-block.content {padding:0px 18px;}
.fj-block + .fj-block {margin-top:18px;}
.fj-block-head {position:relative;height:50px;padding-left:30px;background:#fff;border-bottom:1px solid rgba(0,0,0,.2);}
.fj-block-head.tab {padding-left:20px;}   /* tab切换用 */
.fj-block-head.kaohe {padding-left:10px;} /* 考核用 */
.fj-block-head > .title {line-height:46px;font-size:16px;font-weight:bold;color:rgba(0,0,0,0.85);letter-spacing:1px;}
.fj-block-head > .title.tab {position:relative;padding-left:0px;text-align:center;cursor:pointer;}
.fj-block-head > .title.tab + .title.tab {margin-left:40px;}
.fj-block-head > .title.tab:before {
	content:'';position:absolute;left:50%;bottom:-4px;width:0%;height:2px;background:#3AA0FF;
	-webkit-transform:translateX(-50%);transform:translateX(-50%);
}
.fj-block-head > .title.tab:hover,.fj-block-head > .title.is-select {color:#1890FF;}
.fj-block-head > .title.tab:hover:before,.fj-block-head > .title.is-select:before {width:118%;}
.fj-block-head > .details {padding-right:20px;font-size:12px;line-height:46px;}
.fj-block-head > .details > .ope-txt {margin-right:20px;color:rgba(0,0,0,0.45);}
.fj-block-head > .details > .ope-txt:last-child {margin-right:0px;}
.fj-block-head > .details > .ope-txt:hover {color:#1890FF;}
.fj-block-head > .details > .ope-txt.is-active {color:#1890FF;}
/* el-input调整 */ 
.fj-block-head > .details > .el-input {margin-top:2px;margin-right:10px;}
.fj-block-head > .details > .el-button {margin-top:9px;}
.fj-block-head.infoWindow {width:180px;height:68px;padding-left:0px;border-radius:6px;border-bottom:none;background:#F0F2F5;}
.fj-block-head.infoWindow > .title {line-height:34px;text-align:center;}
.fj-block-head.infoWindow > .title:first-child {font-size:20px;}
.el-popper.fjHeader {padding:0px;text-align:left;}
.el-popper.fjHeader .fj-block + .fj-block {margin-top:0px;}
.el-popper.fjHeader .fj-block-head {padding-left:24px;border-color:#E8E8E8;}
.el-popper.fjHeader .fj-block-head > .title {line-height:52px;font-weight:normal;color:rgba(0,0,0,0.65);}
.el-popper.fjHeader .fj-block-body {padding:0px 24px;}
.el-popper.fjHeader .fj-block-body.user {padding:16px 24px;}
.el-popper.fjHeader .fj-block-body > .info-line > .txt {color:rgba(0,0,0,.45);}
.el-popper.fjHeader .fj-block-body.waitInfo {position:relative;height:500px;max-height:500px;overflow-y:scroll;}
.el-popper.fjHeader .fj-block-body .wait-item {padding:16px 0px 10px;border-bottom:1px solid #E8E8E8;}
.el-popper.fjHeader .fj-block-body .wait-item > .title,
.el-popper.fjHeader .fj-block-body .wait-item > .info-line {font-size:12px;line-height:22px;word-break: break-all;word-wrap: break-word;text-align:justify;cursor:pointer;}
.el-popper.fjHeader .fj-block-body .wait-item > .title {font-size:14px;margin-bottom:10px;}
.el-popper.fjHeader .fj-block-body .wait-item > .title > .el-button {font-size:12px;padding:4px 5px;}
.el-popper.fjHeader .fj-block-body .wait-item > .info-line + .info-line {margin-top:10px;}
.el-popper.fjHeader .fj-block-body .wait-item > .info-line > .title  {color:rgba(0,0,0,.65);}
.el-popper.fjHeader .fj-block-body .wait-item > .info-line > .txt {color:rgba(0,0,0,.45);}
.el-popper.fjHeader .fj-block-body .wait-item > .users {font-size:12px;line-height:22px;color:rgba(0,0,0,.45);text-align:justify;}
.el-popper.fjHeader .clear-btn-box {position:absolute;left:0;right:0;bottom:0;background-color:#fff;}
.el-popper.fjHeader .clear-wait-info {padding:15px 20px;}
.el-popper.fjHeader .fj-block {padding-bottom:46px;}
/*  */
.fj-block-body {/* border:1px solid #E0E0E0;border-top:none; */position:relative;background-color:#fff;}
/* 筛选 查询操作区域 */
.fj-block-body > .filterOpe-area {padding:16px 0px 16px 12px;}
.fj-block-body > .filterOpe-area > .area-line {margin-bottom:18px;}
.fj-block-body > .filterOpe-area > .area-line:last-child {margin-bottom:0px;}
.fj-block-body > .filterOpe-area .title {min-width:70px;text-align:right;}
.fj-block-body > .filterOpe-area .item {margin-right:40px;}
.fj-block-body > .filterOpe-area .item.no-mr {margin-right:0px;}
.fj-block-body > .filterOpe-area .title {line-height:32px;}
.fj-block-body > .filterOpe-area .el-select,.fj-block-body > .filterOpe-area .el-input.search {width:224px;}
.fj-block-body > .filterOpe-area .el-input__icon {line-height:32px;}
.fj-block-body > .filterOpe-area .el-date-editor {height:32px;line-height:32px;}
.fj-block-body > .filterOpe-area .el-date-editor .el-range__icon {line-height:24px;}
.fj-block-body > .filterOpe-area .el-date-editor .el-range-separator {width:auto;line-height:24px;}
/*  */
.fj-component_title {font-size:20px;line-height:28px;color:rgba(0,0,0,.85);}
/* 404 403 500 */
.fj-content_view[class*="page"] {display:flex;flex-flow:row nowrap;justify-content:center;align-items:center;}
.fj-content_view[class*="page"] > img {flex:0 0 444px;max-width:444px;margin-right:122px;}
.fj-content_view[class*="page"] > .notice-box {flex:0 0 auto;height:340px;padding-top:70px;}
.fj-content_view[class*="page"] > .notice-box > .code {margin-bottom:8px;font-size:78px;line-height:78px;font-weight:bold;color:#434E59;}
.fj-content_view[class*="page"] > .notice-box > .txt {margin-bottom:16px;font-size:20px;line-height:28px;color:rgba(0,0,0,.45);}
/*  */
@media screen and (min-width:1367px) {
	.fj-login-foot {padding:1.2%;}
}
</style>
