<template>
    <div class="fj-content_view page-403">
        <img src="static/images/fj-403.png" alt="">
        <div class="notice-box">
            <p class="code">403</p>
            <p class="txt">抱歉，你无权访问该页面</p>
            <el-button type="primary" @click="backIndex">返回首页</el-button>
        </div>
    </div>
</template>
<script>
export default {
    name:'fj403',
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
.fj-content_view[class="page-403"] > img {flex:0 0 226px;max-width:226px;margin-right:210px;}
</style>


