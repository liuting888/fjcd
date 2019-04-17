<template>
  <div class="fj-content_view work-mis workLog">
    <div class="fj-block title">
      <fj-breadNav :bread-data="breadData"></fj-breadNav>
    </div>
    <div class="fj-block content">
      <div class="fj-block-head kaohe">
        <p class="title fj-fl">招聘详情</p>
      </div>
      <div class="fj-block-body">
        <div class="fj-search-inline">
          <el-row>
            <el-form inline label-position="left">
              <el-col :lg="6" :xl="6" class="time-item">
                <el-form-item>
                  <form style="display:none;" name="exportForm" :action="ajaxUrlDNN + '/exportRecruitDetail?id=' + id"
                        method="post" enctype="multipart/form-data"></form>
                  <el-button type="primary" @click="openMFSpopMultiple"><span>审核</span></el-button>
                  <el-button plain @click="exportRecruitDetail"><!-- <i class="el-icon-upload2"></i> --><span>导出</span></el-button>
                  <!--<el-button plain @click="printRecruitDetail">&lt;!&ndash; <i class="el-icon-upload2"></i> &ndash;&gt;<span>打印</span></el-button>-->
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import fjBreadNav from "@/components/fjBreadNav";
export default {
  data: function() {
    return {
      breadData: [
        { name: "当前位置:", path: "" },
        { name: "人事管理", path: "" },
        { name: "招聘管理", path: "/personnel-recruit" },
        { name: "招聘详情", path: "" }
      ],
      ajaxUrlDNN: fjPublic.ajaxUrlDNN,
      nowUser: $.cookie(fjPublic.loginCookieKey),
      id: "",   // 编号
      step: "",   // 流程
      // 招聘步骤
      items: [
        {label: "资格审查"},{label: "笔试"},{label: "面试"},{label: "公示"},{label: "录用"}
      ],
    };
  },
  mounted: function() {
    return;
  },
  beforeRouteEnter:function(to, from, next){ //
    next(function(vm){
      vm.id = vm.$route.query.recruitId || fjPublic.getLocalData('recruitId');
      vm.step = vm.$route.query.recruitStep || fjPublic.getLocalData('recruitStep');
      fjPublic.setLocalData('recruitId', vm.id);
      fjPublic.setLocalData('recruitStep', vm.step);
    });
  },
  filters: {

  },
  methods: {
    openMFSpopMultiple: function(){ // 审核
      this.$confirm('（' + this.items[parseInt(this.step)].label + '）审核', '提示', {
        confirmButtonText: '通过',
        cancelButtonText: '拒绝',
        type: 'warning',
        center: true
      }).then(() => {
        this.confirmUpdateRecruit(this.id, '1');
      }).catch(() => {
        this.confirmUpdateRecruit(this.id, '2');
      });
    },
    confirmUpdateRecruit: function (id, status) {
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/updRecruitStatus",
        type: "POST",
        data: {
          id: id,
          status: status
        },
        dataType: "json",
        success: function(data) {
          if(data.errorCode == 0) {
            vm.$message({
              type: 'success',
              message: data.errorMsg
            });
          }else {
            vm.$message({
              type: 'error',
              message: data.errorMsg
            });
          }
          defer.resolve();
        },
        error: function(err) {
          defer.reject();
        }
      });
      return defer;
    },
    exportRecruitDetail: function(){ // 导出
      document.forms['exportForm'].submit();
    },
    printRecruitDetail: function () { // 打印

    }
  },
  computed: {

  },
  beforeDestroy() {

  },
  components: {
    fjBreadNav
  }
};
</script>
<style scope lang="less">

</style>


