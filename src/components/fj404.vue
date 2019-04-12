<template>
    <div class="fj-content_view page-404">
        <img src="static/images/fj-404.png" alt="">
        <div class="notice-box">
            <p class="code">404</p>
            <p class="txt">抱歉，你访问的页面不存在</p>
            <el-button type="primary" @click="backIndex">返回首页</el-button>
        </div>
    </div>
</template>
<script>
export default {
    name:'fj404',
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
</style>


