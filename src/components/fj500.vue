<template>
    <div class="fj-content_view page-500">
        <img src="static/images/fj-500.png" alt="">
        <div class="notice-box">
            <p class="code">500</p>
            <p class="txt">抱歉，服务器出错了</p>
            <el-button type="primary" @click="backIndex">返回首页</el-button>
        </div>
    </div>
</template>
<script>
export default {
    name:'fj500',
    mounted:function(){
        fjPublic.closeLoad();
    },
    beforeRouteEnter:function(to,from,next){
        next(function(vm){
            fjPublic.closeLoad();
        });
    },
    methods:{
        backIndex:function(){
            this.$router.push('/index');
        }
    }
}
</script>
<style>
.fj-content_view[class="page-500"] > img {flex:0 0 420px;max-width:420px;margin-right:130px;}
</style>


