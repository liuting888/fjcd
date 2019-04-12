<template>
    <div class="fj-bread_wrap">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="(item,i) in breadData" :key="i" :to="{path:item.path}">{{item.name}}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>
<script>
export default {
    name:'fj-breadNav',
    props:['breadData']
}
</script>
<style>
/* 面包屑 */
.fj-bread_wrap {padding:15px 0px 18px;}
.el-breadcrumb__inner a, .el-breadcrumb__inner.is-link {color:rgba(0,0,0,.85);}
.fj-bread_wrap > .el-breadcrumb > .el-breadcrumb__item {line-height:24px;cursor:pointer;} 
.fj-bread_wrap > .el-breadcrumb__inner {color:rgba(0,0,0,.65);}
.fj-bread_wrap > .el-breadcrumb > .el-breadcrumb__item:first-child > .el-breadcrumb__inner {color:rgba(0,0,0,.85);}
.fj-bread_wrap > .el-breadcrumb > .el-breadcrumb__item:last-child > .el-breadcrumb__inner {color:#1890FF;}
</style>


