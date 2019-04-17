<template>
  <div class="fj-content_view contract">
    <div class="fj-content_view_mask">
      <div class="fj-block title">
        <fj-breadNav :bread-data="breadData"></fj-breadNav>
      </div>
      <div class="fj-block content">
        <div class="fj-block-head kaohe">
          <p class="title">合同</p>
          <!-- <div class="contract-footer-btn" v-if="userInfo.state==0||userInfo.state==2"> -->
          <div class="contract-head-btn">
            <el-button type="primary" @click="review()">签订</el-button>
            <el-button @click="submitForm(2)">导出</el-button>
          </div>
        </div>
        <div class="fj-block-body">
          <iframe
            src="http://storage.xuetangx.com/public_assets/xuetangx/PDF/PlayerAPI_v1.0.6.pdf"
            width="100%"
            height="100%"
          >
            This browser does not support PDFs. Please download the PDF to view it:
            <a
              href="/test2.pdf"
              rel="external nofollow"
            >Download PDF</a>
          </iframe>
        </div>
      </div>
    </div>
    <!-- 审核弹出框 -->
    <el-dialog
      :title="checkDialogTitle"
      :visible.sync="checkDialogVisible"
      :modal-append-to-body="checkDialogVisibleModal"
      style="position: absolute"
      width="450px"
      @close="closeDialog"
      :close-on-click-modal="false"
      top="25vh"
      class="check-dialog"
    >
      <div>请选择需要签订的年数</div>
      <div>
        <el-radio v-model="radio" label="1">1年</el-radio>
        <el-radio v-model="radio" label="2">2年</el-radio>
        <el-radio v-model="radio" label="3">3年</el-radio>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="checkDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateLeaveStatus(false)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import fjBreadNav from "@/components/fjBreadNav";
export default {
  name: "personnel-contract-Details",
  data() {
    return {
      breadData: [
        { name: "当前位置:", path: "" },
        { name: "人事管理", path: "" },
        { name: "合同管理", path: "/personnel-contract" },
        { name: "详情", path: "" }
      ],
      activeList: [],
      userInfo: {},
      ruleForm: {
        name: ""
      },
      // 审核弹出框数据
      checkDialogVisible: false,
      checkDialogVisibleModal: false,
      radio: "1",
      randomCityList: [], //抽查地点
      subofficeList: [], //房屋所属分局
      policeList: [], //房屋所属派出所
      whether: [
        {
          value: "是",
          label: "是"
        },
        {
          value: "否",
          label: "否"
        }
      ], //是否
      rules: []
    };
  },
  // created() {
  //   this.setCreated();
  // },
  mounted() {
    this.setCreated();
  },
  methods: {
    submitForm(state) {
      console.log(state);
      window.history.go(-1);
    },
    //签订
    review() {
      this.$message({
        message: "请保证人员审核进度一致",
        type: "warning"
      });
      this.checkDialogVisible = true;
    },
    // 提交或者编辑数据
    postRuleForm: function() {
      let vm = this;
      let url = vm.userInfo.state == 0 ? "/addInfo" : "/updInfo";
      if (vm.userInfo.id) {
        vm.ruleForm.id = vm.userInfo.id;
      }
      vm.ruleForm.tableName = vm.activeList[vm.userInfo.index].tableName;
      vm.ruleForm.userId = $.parseJSON(
        fjPublic.getLocalData("userInfo")
      ).userId;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + url,
        type: "POST",
        data: vm.ruleForm,
        dataType: "json",
        success: function(data) {},
        error: function(err) {
          if (err.responseText == "success") {
            vm.$router.push({
              path: "/fjWorkManage-YiBiaoSanShi"
            });
          } else {
          }
        }
      });
    },
    setCreated() {
      this.userInfo = this.$route.query;
      // this.userInfo.state != 0 &&
      //   (this.ruleForm = $.parseJSON(fjPublic.getLocalData("contractItem")));
      // this.$refs["ruleForm"].resetFields();
    }
  },
  watch: {
    $route: {
      handler(route) {
        this.setCreated();
      }
    }
  },
  components: {
    fjBreadNav
  }
};
</script>
<style scope lang="less">
.contract {
  .contract-head-btn {
    position: absolute;
    top: 10px;
    right: 0px;
  }
  .fj-block-body {
    height: 800px;
    padding: 20px;
  }
  .el-dialog__body {
    div {
      margin: 20px;
    }
  }
}
@media screen and (min-width: 1920px) {
  /* .fj-content_view.contract .el-form .el-form-item__content .el-select {width:60%;} */
}
</style>

