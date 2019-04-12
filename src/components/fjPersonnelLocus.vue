<template>
    <div class="fj-content_view PL">
        <div class="fj-block title">
            <fj-breadNav :bread-data="breadData[breadFrom]"></fj-breadNav>
        </div>
        <div class="fj-block content">
            <div class="fj-block-head fj-clear">
				<p class="title fj-fl">个人轨迹（<span>{{userName}}</span>）</p>
                <div class="details fj-fr">
                    <el-date-picker
                        v-model="timeVal"
                        type="date"
                        @change="selectTimeVal"
                        placeholder="选择日期">
                    </el-date-picker>
                    <el-button class="fj-fr" type="primary"><i class="el-icon-search"></i><span>查询</span></el-button>
                </div>
			</div>
            <div id="plMap" class="fj-block-body"></div>
        </div>
    </div>
</template>
<script>
import fjBreadNav from '@/components/fjBreadNav';
export default {
    name:'fjPersonnelLocus',
    data:function(){
        return {
            breadData:{
                'fromIndex':[
                    {name:'当前位置:',path:''},
                    {name:'首页',path:'/index'},
                    {name:'个人轨迹',path:''}
                ],
                'fromOS':[
                    {name:'当前位置:',path:''},
                    {name:'系统管理',path:''},
                    {name:'组织架构',path:'/organizational-structure'},
                    {name:'个人信息',path:'/organizational-structure-pInfo'},
                    {name:'个人轨迹',path:''}
                ]
            },
            userId:'',
            userName:'',
            breadFrom:'fromOS',
            timeVal:fjPublic.dateFormatYYMMDD(new Date()),
            final_time:fjPublic.dateFormatYYMMDD(new Date()),
            qqMap:null,
            polylineData:[],
            polyline:null,
            path:[],
            sMarker:null,
            eMarker:null
        };
    },
    beforeRouteEnter:function(to,from,next){
        next(function(vm){
            vm.breadFrom = vm.$route.query.isFrom||fjPublic.getLocalData('PL-isFrom');
            vm.userId = vm.$route.query.userId||fjPublic.getLocalData('PL-userId');
            vm.userName = vm.$route.query.userName;
            fjPublic.setLocalData('PL-userId',vm.userId);
            fjPublic.setLocalData('PL-isFrom',vm.breadFrom);
            vm.timeVal = fjPublic.dateFormatYYMMDD(new Date());
            vm.final_time=fjPublic.dateFormatYYMMDD(new Date());
            vm.setUserPolyline();
        });
    },
    beforeRouteLeave:function(to,from,next){
        //内容区滚动条回到跳转之前的位置
        fjPublic.setContentScrollTop();
        next();
    },
    methods:{
        selectTimeVal:function(date){
            if(!date){
                 this.final_time=fjPublic.dateFormatYYMMDD(new Date());
            }else{
                this.final_time=fjPublic.dateFormatYYMMDD(date);
            }
            var isNowTime = new Date().getTime();
            var selectedTime = date.getTime();
            if(isNowTime<selectedTime){ 
                this.$message({type:'warning',message:'请选择当前或者之前的日期！'});
                this.timeVal = fjPublic.dateFormatYYMMDD(new Date());
                this.final_time=fjPublic.dateFormatYYMMDD(new Date());
                return;
            }
            this.setUserPolyline();
        },
        setUserPolyline:function(){
            var vm = this;
            $.when(vm.requestDatas()).then(function(){
                _.delay(function(){
                    if(!$.isArray(vm.polylineData)||!vm.polylineData.length){
                        vm.hideMarkerLine();
                        vm.$alert(vm.final_time+'暂无该人员的轨迹信息！','提示').then(()=>{
                            fjPublic.removeModalMask();
                        });
                        return;
                    }
                    var myLatlng;
                    if(vm.qqMap){
                        vm.path.splice(0,vm.path.length);
                        myLatlng = new qq.maps.LatLng(vm.polylineData[0].lat,vm.polylineData[0].lng);
                        vm.qqMap.setCenter(myLatlng);
                        vm.setPolyline();
                        vm.setSEMarker();
                    }else{
                        myLatlng = new qq.maps.LatLng(vm.polylineData[0].lat,vm.polylineData[0].lng);
                        vm.qqMap = new qq.maps.Map(document.getElementById('plMap'),{
                            center:myLatlng,		// 地图的中心地理坐标。
                            scaleControl: true,	//比例尺
                            disableDoubleClickZoom : true,
                            zoom:18,			//缩放控件1-18
                            mapTypeId: qq.maps.MapTypeId.ROADMAP, //该地图类型显示普通的街道地图。
                            mapTypeControl:false, //不显示地图类型控件
                            panControl:false,   //不显示平移控件
                            zoomControl:false,  //不显示缩放控件
                            scaleControl:true,  //不显示比例尺控件
                        });
                        vm.setPolyline();
                        vm.setSEMarker();
                    }
                },200);
                fjPublic.contentScrollTop();
            });
        },
        hideMarkerLine:function(){
            if(this.sMarker&&this.eMarker&&this.polyline){
                this.sMarker.setVisible(false);
                this.eMarker.setVisible(false);
                this.polyline.setVisible(false);
            }
        },
        setPolyline:function(){
            var vm = this;
            _.each(vm.polylineData,function(pos){
                vm.path.push(new qq.maps.LatLng(pos.lat,pos.lng));
            });
            if(vm.polyline){
                vm.polyline.setMap(null);
                vm.polyline = null;
            }
            vm.polyline = new qq.maps.Polyline({
                clickable: true,
                cursor: 'crosshair',
                map: vm.qqMap,
                path: vm.path,
                cursor: 'crosshair',
                strokeColor:new qq.maps.Color(255,100,97,.8),
                strokeDashStyle: 'solid'
            });
        },
        setSEMarker:function(){
            var vm =this;
            var myLatlng = new qq.maps.LatLng(vm.polylineData[0].lat,vm.polylineData[0].lng);
            if(vm.sMarker){
                vm.sMarker.setMap(null);
                vm.sMarker = null;
            }
            vm.sMarker = new qq.maps.Marker({
                //设置Marker的位置坐标
                position: myLatlng,
                //设置显示Marker的地图
                map: vm.qqMap
            });
            vm.sMarker.setAnimation(qq.maps.MarkerAnimation.DOWN);
            var anchor = new qq.maps.Point(0, 39),
            size = new qq.maps.Size(72, 68),
            origin = new qq.maps.Point(0, 0),
            icon = new qq.maps.MarkerImage(
                "static/images/mapStart.png",
                size,
                origin,
                anchor
            );
            vm.sMarker.setIcon(icon);
            var endLatlng = new qq.maps.LatLng(vm.polylineData[vm.polylineData.length-1].lat,vm.polylineData[vm.polylineData.length-1].lng);
            if(vm.eMarker){
                vm.eMarker.setMap(null);
                vm.eMarker = null;
            }
            vm.eMarker = new qq.maps.Marker({
                //设置Marker的位置坐标
                position: endLatlng,
                dragable:true,
                //设置显示Marker的地图
                map: vm.qqMap
            });
            vm.eMarker.setAnimation(qq.maps.MarkerAnimation.DOWN);
            var anchor = new qq.maps.Point(0, 39),
            size = new qq.maps.Size(72, 68),
            origin = new qq.maps.Point(0, 0),
            icon = new qq.maps.MarkerImage(
                "static/images/mapEnd.png",
                size,
                origin,
                anchor
            );
            vm.eMarker.setIcon(icon);
        },
        getPLpolyLineData:function(){
            var defer = $.Deferred();
            var vm = this; 
			$.ajax({
				url:fjPublic.ajaxUrlDNN+'/getPolyLines',
				type:'POST',
				data:{
                    userid:vm.userId,
                    date:vm.final_time
				},
				dataType:'json',
				success:function(data){
                    //console.log(data);
                    vm.polylineData = null;
                    vm.polylineData = data;
					defer.resolve();
				},
				error:function(err){
					defer.reject();
				}
			});
			return defer;
        },
        requestDatas:function(){  //向后台请求数据
			var tmpReqFns = [this.getPLpolyLineData];
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
					vm.$message({
						type:'warning',
						message:'请求数据失败！！！'
					});
					_.delay(function(){
						fjPublic.closeLoad();
						vm.$router.push('/500');
					},4000);
				});
			}
			sendRequestFn();  //请求数据
			return defer;
		},
    },
    components:{
        fjBreadNav
    }
}
</script>
<style>
.fj-content_view.PL .fj-block.content {padding:0px;}
.fj-content_view.PL #plMap {height:573px;}
@media screen and (min-width:1920px) {
    .fj-content_view.PL #plMap {height:790px;}
}
</style>


