/*
 * @Description: 人事管理和专题考试table列表公共数据
 * @Author: liuting
 * @LastEditors: Please set LastEditors
 * @Date: 2019-04-15 15:18:47
 * @LastEditTime: 2019-04-15 16:56:22
 */
const list = {
    data() {
        return {
            // 分页数据
            currentPage: 1,
            pageSize: 10,
            total: 0,
            // 列表数据
            tableDataList: [],
            // 复选框
            multipleSelection: [],
        }
    },
    methods: {
        currentPageChange: function(pageNum) {
            // 点击某个分页按钮
            this.currentPage = pageNum;
            this.searchList();
        },
        prevPageChange: function(pageNum) {
            // 点击分页的上一页
            this.currentPage = pageNum;
            this.searchList();
        },
        nextPageChange: function(pageNum) {
            // 点击分页的下一页
            this.currentPage = pageNum;
            this.searchList();
        },
        sizePageChange: function(pageSize) {
            // 改变每页条数时
            this.currentPage = 1;
            this.pageSize = pageSize;
            this.searchList();
        },
        handleSelectionChange: function(arr) {
            //选择列
            this.multipleSelection = arr;
        },
        // 获取列表
        searchList: function() {
            let defer = $.Deferred();
            fjPublic.openLoad("数据加载中...");
            let vm = this;
            // 参数
            vm.setSearchList();
            $.ajax({
                url: fjPublic.ajaxUrlDNN + vm.searchListUrl,
                type: "POST",
                data: vm.searchForm,
                dataType: "json",
                success: function(data) {
                    vm.tableDataList = null;
                    vm.tableDataList = data.list;
                    vm.total = data.total;
                    _.each(vm.tableDataList, function(item, i) {
                        vm.$set(item, "rank", i + 1);
                    });
                    fjPublic.closeLoad();
                    defer.resolve();
                },
                error: function(err) {
                    fjPublic.closeLoad();
                    vm.$message({ type: "warning", message: "请求数据失败！！！" });
                    defer.reject();
                }
            });
            return defer;
        },
    },
    created() {
        // 这个生命周期是在使用组件的生命周期之前
        this.$nextTick().then(() => {
            // todo
        })
    }
}
export default list