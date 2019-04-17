<template>
  <div class="fj-content_view rule-detail">
    <div class="fj-content_view_mask">
      <div class="fj-block title">
        <fj-breadNav :bread-data="breadData"></fj-breadNav>
      </div>
      <div class="fj-block content">
        <div class="fj-block-head kaohe">
          <p class="title">合同规则</p>
        </div>
        <div class="fj-block-body">
          <div v-if="url">
            <img src="static/images/fjRule-setting-word.png" alt="导入文件">
          </div>
          <div v-if="!url">
            <div class="rule-block-title">
              <i class="el-icon-edit"></i>
              <el-input
                v-bind:disabled="userInfo.state == 1"
                v-model="ruleForm.people"
                placeholder="请输入合同名称"
              ></el-input>
            </div>
            <iframe
              src="http://storage.xuetangx.com/public_assets/xuetangx/PDF/PlayerAPI_v1.0.6.pdf"
              width="80%"
              height="700px"
            >
              This browser does not support PDFs. Please download the PDF to view it:
              <a
                href="/test2.pdf"
                rel="external nofollow"
              >Download PDF</a>
            </iframe>
          </div>
          <div class="rule-block-btn">
            <el-button type="primary" @click="review()" v-if="url">导入</el-button>
            <el-button  @click="goList()" v-if="url">返回列表</el-button>
            <el-button type="primary" @click="review()" v-if="!url">配置</el-button>
            <el-button type="primary" @click="review()" v-if="!url">替换</el-button>
            <el-button @click="submitForm(2)" v-if="!url">导出</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 审核弹出框 -->
    <el-dialog
      title="配置工资规则"
      :visible.sync="checkDialogVisible"
      :modal-append-to-body="checkDialogVisibleModal"
      style="position: absolute"
      width="600px"
      @close="closeDialog"
      :close-on-click-modal="false"
      top="25vh"
      class="check-dialog"
    >
      <div class="wage-set">
        <el-form :model="ruleForm" :rules="rules">
          <el-form-item label="适用岗位：">
            <el-radio v-model="radio" label="1">城区辅警</el-radio>
            <el-radio v-model="radio" label="2">乡镇辅警</el-radio>
            <el-radio v-model="radio" label="3">所有辅警</el-radio>
          </el-form-item>
          <el-form-item label="合同到期提醒时间：">
            <el-radio v-model="radio" label="1">30天</el-radio>
            <el-radio v-model="radio" label="2">60天</el-radio>
            <el-radio v-model="radio" label="3">90天</el-radio>
          </el-form-item>
          <el-form-item label="试用期天数：">
            <el-radio v-model="radio" label="1">30天</el-radio>
            <el-radio v-model="radio" label="2">60天</el-radio>
            <el-radio v-model="radio" label="3">90天</el-radio>
          </el-form-item>
        </el-form>
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
  name: "personnel-rule-Details",
  data() {
    return {
      breadData: [
        { name: "当前位置:", path: "" },
        { name: "人事管理", path: "" },
        { name: "规则管理", path: "/personnel-rule-setting" },
        { name: "详情", path: "" }
      ],
      activeList: [],
      userInfo: {},
      ruleForm: {
        name: ""
      },
      url:"22",
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
      // this.$message({
      //   message: "请保证人员审核进度一致",
      //   type: "warning"
      // });
      this.checkDialogVisible = true;
    },
    //返回列表
    goList() {
      this.$router.push({
        path: "/personnel-rule-setting"
      });
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
      //   (this.ruleForm = $.parseJSON(fjPublic.getLocalData("ruleItem")));
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
.rule-detail {
  .fj-block-body {
    // height: 800px;
    padding: 20px;
    text-align: center;
  }
  .rule-block-btn {
    margin-top: 20px;
  }
  .rule-block-title {
    margin-bottom: 20px;
    i {
      font-size: 18px;
    }
    input {
      border: none;
      font-size: 18px;
    }
  }
}
.wage-set {
  .el-form-item__label {
    width: 150px;
    text-align: left;
  }
}
@media screen and (min-width: 1920px) {
  /* .fj-content_view.rule .el-form .el-form-item__content .el-select {width:60%;} */
}
</style>

