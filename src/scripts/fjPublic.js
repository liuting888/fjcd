(function() {
    var commonData = {
        // ajaxUrlDNN: 'http://172.16.10.27:8082/Auxpolice1.0', //本地
        ajaxUrlDNN: 'http://172.16.10.59:8280/Auxpolice1.0', //本地
        // ajaxUrlDNN:getRealPath(),//请求地址 -> DNN
        loginCookieKey: '', //登录成功后的cookie名 'AUXPOLICE20' 
        userRoles: { //用户角色字段
            fj: '1000', //辅警
            pcs: '1001', //派出所
            qj: '1002', //区级
            sj: '8888', //市局
            cg: '9999' //超级管理员
        },
        cityInfos: { //地区基本信息
            deptName: '', //区域部门名
            deptId: '', //区域Id
            citiName: '', //城市名
            coordinates: {}, //地区中心经纬度
            initZoomIndex: '', //首页初始比例   
            initZoomDc: '' //数据中心初始比例
        },
        waitLoadObj: null,
        openLoad: function(txt) {
            if (!$.cookie(this.loginCookieKey)) return;
            this.closeLoad();
            var loadingTxt = txt || 'loading...';
            this.waitLoadObj = Vue.prototype.$loading({
                lock: true,
                text: loadingTxt,
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: '.fj-body'
            });
        },
        closeLoad: function() {
            if (!this.waitLoadObj || !$.cookie(this.loginCookieKey)) return;
            this.waitLoadObj.close();
            this.waitLoadObj = null;
        },
        wrapperAddScroll: function() { //内容区隐藏滚动条
            var oContent = $('.fj-content', '#app');
            if (oContent.length > 0) {
                oContent.addClass('hide-scroll');
            }
        },
        wrapperRemoveScroll: function() { //内容区显示滚动条
            var oContent = $('.fj-content', '#app');
            if (oContent.length > 0) {
                oContent.removeClass('hide-scroll');
            }
        },
        contentScrollTop: function() { //fj-content滚动条回到顶部
            return $('.fj-content', '#app').animate({ scrollTop: '0' }).promise();
        },
        loadMapScript: function() {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://map.qq.com/api/js?v=2.exp&key=7JPBZ-A7XWP-5OCDJ-V7ZMA-TU4SF-3TFNZ&callback=init';
            // 添加标签到dom
            document.body.appendChild(script);
        },
        requestFullScreen: function(element) { //  requestFullScreen 全屏切换
            var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
            if (requestMethod) {
                requestMethod.call(element);
            } else if (typeof window.ActiveXObject !== "undefined") {
                var wscript = new ActiveXObject("WScript.Shell");
                if (wscript !== null) {
                    wscript.SendKeys("{F11}");
                }
            }
        },
        date2Month: function(date) { //月份日期插件值转换
            var val = date.getMonth() + 1;
            var monthVal = val < 10 ? '0' + val : '' + val;
            var yearVal = date.getFullYear();
            return yearVal + '-' + monthVal;
        },
        dateFormatYYMMDD: function(date) { // 年月日插件值转换
            var val = date.getMonth() + 1;
            var monthVal = val < 10 ? '0' + val : '' + val;
            var yearVal = date.getFullYear();
            var val1 = date.getDate();
            var dayVal = val1 < 10 ? '0' + val1 : '' + val1;
            console.log(dayVal);
            return yearVal + '-' + monthVal + '-' + dayVal;
        },
        dateFormatYYMMDDHMS: function(date) { // 年月日时分秒插件值转换
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const hour = date.getHours();
            const minute = date.getMinutes();
            const second = date.getSeconds();
            return [year, month, day].map((n) => {
                n = n.toString();
                return n[1] ? n : '0' + n;
            }).join('/') + ' ' + [hour, minute, second].map((n) => {
                n = n.toString();
                return n[1] ? n : '0' + n;
            }).join(':');
        },
        // 时间字符串格式转化yyyymmddhhmmss => yyyy-mm-dd hh:mm:ss
        dateStrFormat(dateStr) {
            return dateStr.substr(0, 4) + '-' + dateStr.substr(4, 2) + '-' + dateStr.substr(6, 2) +
                ' ' + dateStr.substr(8, 2) + ':' + dateStr.substr(10, 2) + ':' + dateStr.substr(12, 2);
        },
        setLocalData: function(name, data) { //设置-本地存储
            localStorage.setItem(name, data);
        },
        getLocalData: function(name) { //获取-本地存储
            return localStorage.getItem(name);
        },
        removeLocalData: function(name) { //删除-本地存储
            localStorage.removeItem(name);
        },
        clearLocalData: function() { //清空-本地存储
            localStorage.clear();
        },
        removeModalMask: function() { //删除弹窗的v-modal
            var aModal = $('.v-modal', 'body');
            if (aModal.length) {
                aModal.remove();
            }
        },
        getContentScrollTop: function() { //获取内容区滚动距离
            window.stVal = $('.fj-content', '#app').scrollTop();
        },
        setContentScrollTop: function() { //设置内容区滚动距离
            $('.fj-content', '#app').animate({ 'scrollTop': window.stVal });
        }
    };
    module.exports = commonData;

    function getRealPath() { //获取项目路径
        var localObj = window.location;
        var contextPath = localObj.pathname.split("/")[1];
        var basePath = localObj.protocol + "//" + localObj.host + "/" + contextPath + "/";
        return basePath;
    }
})();