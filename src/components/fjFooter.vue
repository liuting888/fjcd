<template>
   <div class="fj-footer">
    <div class="links-area">
        <p>相关链接</p>
        <a href="javascript:;" v-for="(item,i) in links" :key="i" v-text="item.name" @click="gotoMatchLink(item)"></a>
    </div>
    <p class="authourize">© 2014 - 2017 Csgxcf.com Inc. All Rights Reserved</p>
    <p class="advice">本系统使用建议：1280 X 800 以上分辨率显示器，支持 HTML5/CSS3的浏览器（谷歌Chrome，火狐FireFox）</p>
</div> 
</template>
<script>
export default {
    name:'fj-footer',
    data:function(){
        return {
            links:[
                {name:'中华人民共和国公安部',link:'http://www.mps.gov.cn/'},
                {name:'中华人民共和国最高人民检察院',link:'http://www.spp.gov.cn/'},
                {name:'湖南省人民政府',link:'http://www.hunan.gov.cn/'},
                {name:'湘潭市公安局',link:'http://xtga.xiangtan.gov.cn/'},
                {name:'湘警网',link:'http://www.hnga.gov.cn/'}
            ]
        };
    },
    methods:{
        gotoMatchLink:function(info){
            window.open(info.link,'_blank');
        }
    }
}
</script>
<style>
/* 页脚  footer */
.fj-footer {height:158px;padding-top:18px;/* background-color:#F5F5F5; *//* font-family:"Microsoft YaHei UI","Microsoft YaHei",sans-serif; */text-align:center;}
.fj-footer > .links-area {padding-top:8px;padding-bottom:14px;font-size:0;}
.fj-footer > .links-area > * {display:inline-block;}
.fj-footer > .links-area > p {font-size:16px;line-height:28px;color:#2B2B2B;}
.fj-footer > .links-area > a {margin:0px 30px;font-size:14px;line-height:28px;color:#6A6A6A;}
.fj-footer > .links-area > a:hover {color:#1890FF;}
.fj-footer > .authourize {padding-bottom:8px;color:#777;line-height:18px;font-family:sans-serif;}
.fj-footer > .advice {color:#454545;line-height:18px;}
</style>


