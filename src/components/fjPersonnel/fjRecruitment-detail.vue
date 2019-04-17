<template>
  <div class="fj-content_view recruit">
    <div class="fj-content_view_mask">
      <div class="fj-block title">
        <fj-breadNav :bread-data="breadData"></fj-breadNav>
      </div>
      <div class="fj-block content">
        <div class="fj-block-head kaohe">
          <p class="title fj-fl">招聘详情</p>
          <div class="title-btn">
              <form
                style="display:none;"
                name="exportForm"
                :action="ajaxUrlDNN + '/exportRecruitDetail?id=' + userInfo.id"
                method="post"
                enctype="multipart/form-data"
              ></form>
              <el-button type="primary" @click="openMFSpopMultiple">
                <span>审核</span>
              </el-button>
              <el-button plain @click="exportRecruitDetail">
                <!-- <i class="el-icon-upload2"></i> -->
                <span>导出</span>
              </el-button>
              <!--<el-button plain @click="printRecruitDetail">&lt;!&ndash; <i class="el-icon-upload2"></i> &ndash;&gt;<span>打印</span></el-button>-->
          </div>
        </div>
        <div class="fj-block-body">
          <!-- 表单输入区域 -->
          <div class="recruit-form-area">
            <el-form :model="ruleForm" :rules="rules">
              <!-- 基本信息 -->
              <div class="form-info">
                <div class="info-img">
                  <img src="static/images/recruit-people.svg" alt="个人照片">
                </div>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="姓名">
                      <el-input
                        v-model="ruleForm.name"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" label="性别">
                      <el-input
                        v-model="ruleForm.sex"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="出生年月">
                      <el-input
                        v-model="ruleForm.birth"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" label="民族">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="籍贯">
                      <el-input
                        v-model="ruleForm.birthPlace"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" label="婚否">
                      <el-input
                        v-model="ruleForm.plots"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="本人电话">
                      <el-input
                        v-model="ruleForm.phone"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" label="政治面貌">
                      <el-input
                        v-model="ruleForm.plots"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="是否退役士兵/见义勇为人员">
                      <el-input
                        v-model="ruleForm.entityName"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" label="身高">
                      <el-input
                        v-model="ruleForm.hw"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="紧急联系人">
                      <el-input
                        v-model="ruleForm.ePerson"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" label="最高学位">
                      <el-input
                        v-model="ruleForm.legalName"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="紧急联系人电话">
                      <el-input
                        v-model="ruleForm.ePersonPhone"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" label="身份证号码">
                      <el-input
                        v-model="ruleForm.idNum"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item class="noBR noBB" label="现居地址">
                      <el-input v-bind:disabled="userInfo.state == 1" v-model="ruleForm.address"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-form>
            <!-- 教育经历 -->
            <div class="form-table">
              <p class="form-title">教育经历</p>
              <el-row>
                <el-col :span="12" class="noBR form-table-col">
                  <div class="left">
                    <div class="title title-left titles">起止年月</div>
                    <div class="title title-left">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title title-left">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title title-left title-bottom">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                  </div>
                  <div class="right">
                    <div class="title titles">学校名称</div>
                    <div class="title">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title title-bottom">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12" class="form-table-col">
                  <div class="left">
                    <div class="title titles">专业</div>
                    <div class="title">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title title-bottom">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                  </div>
                  <div class="right">
                    <div class="title titles">所获学历、学位证书</div>
                    <div class="title">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title title-bottom">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
            <!-- 工作经历 -->
            <div class="form-table">
              <p class="form-title">工作经历</p>
              <el-row>
                <el-col :span="12" class="noBR form-table-col">
                  <div class="left">
                    <div class="title title-left titles">起止年月</div>
                    <div class="title title-left">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title title-left">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title title-left title-bottom">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                  </div>
                  <div class="right">
                    <div class="title titles">单位名称</div>
                    <div class="title">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title title-bottom">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12" class="form-table-col">
                  <div class="left-over">
                    <div class="title titles">职位</div>
                    <div class="title">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title title-bottom">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
            <!-- 家庭成员 -->
            <div class="form-table">
              <p class="form-title">家庭成员</p>
              <el-row>
                <el-col :span="12" class="noBR form-table-col">
                  <div class="left">
                    <div class="title title-left titles">关系</div>
                    <div class="title title-left">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title title-left">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title title-left title-bottom">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                  </div>
                  <div class="right">
                    <div class="title titles">姓名</div>
                    <div class="title">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title title-bottom">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12" class="form-table-col">
                  <div class="left-over">
                    <div class="title titles">工作单位（职业）</div>
                    <div class="title">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                    <div class="title title-bottom">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        v-bind:placeholder="userInfo.state == 1?'':'请输入'"
                      ></el-input>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
          <!-- <div class="recruit-footer-btn" v-if="userInfo.state==0||userInfo.state==2">
            <el-button type="primary" @click="submitForm(1)">通过</el-button>
            <el-button @click="submitForm(2)">不通过</el-button>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import fjBreadNav from "@/components/fjBreadNav";
export default {
  name: "personnel-recruitment-Details",
  data() {
    return {
      breadData: [
        { name: "当前位置:", path: "" },
        { name: "人事管理", path: "" },
        { name: "招聘管理", path: "/personnel-recruitment" },
        { name: "详情", path: "" }
      ],
      ajaxUrlDNN: fjPublic.ajaxUrlDNN,
      nowUser: $.cookie(fjPublic.loginCookieKey),
      id: "", // 编号
      step: "", // 流程
      // 招聘步骤
      items: [
        { label: "资格审查" },
        { label: "笔试" },
        { label: "面试" },
        { label: "公示" },
        { label: "录用" }
      ],
      activeList: [],
      userInfo: {},
      ruleForm: {
        name: ""
      },
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
    this.getRecruitDetail();
  },
  methods: {
    openMFSpopMultiple: function() {
      // 审核
      this.$confirm(
        "（" + this.items[parseInt(this.userInfo.step)].label + "）审核",
        "提示",
        {
          confirmButtonText: "通过",
          cancelButtonText: "拒绝",
          type: "warning",
          center: true
        }
      )
        .then(() => {
          this.confirmUpdateRecruit(this.userInfo.id, "1");
        })
        .catch(() => {
          this.confirmUpdateRecruit(this.userInfo.id, "2");
        });
    },
    confirmUpdateRecruit: function(id, status) {
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
          if (data.errorCode == 0) {
            vm.$message({
              type: "success",
              message: data.errorMsg
            });
          } else {
            vm.$message({
              type: "error",
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
    getRecruitDetail: function() {
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/getRecruitDetail",
        type: "POST",
        data: {
          id: vm.userInfo.id,
        },
        dataType: "json",
        success: function(data) {
          // console.log(data);
          vm.ruleForm=data;
          defer.resolve();
        },
        error: function(err) {
          defer.reject();
        }
      });
      return defer;
    },
    exportRecruitDetail: function() {
      // 导出
      document.forms["exportForm"].submit();
    },
    printRecruitDetail: function() {
      // 打印
    },
    submitForm(state) {
      console.log(state);
      window.history.go(-1);
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
.recruit {
  .recruit-form-area {
    .form-info {
      position: relative;
      .info-img {
        position: absolute;
        top: 0;
        right: 0;
        width: 150px;
        height: 179px;
        z-index: 1;
        background-color: #fff;
        border-left: 1px solid #e8e8e8;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .form-table {
      height: 222px;
      .form-title {
        padding: 20px 0 5px 20px;
        font-size: 14px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.9);
        opacity: 1;
      }
      .form-table-col {
        // border: 1px solid #e8e8e8;
        div {
          display: inline-block;
          height: 44px;
          line-height: 44px;
        }
        .left {
          width: 200px;
          position: absolute;
        }
        .right {
          width: 100%;
          padding-left: 200px;
        }
        .left-over {
          width: 100%;
          position: relative;
        }
        .title {
          display: block;
          border-top: 1px solid #e8e8e8;
          border-right: 1px solid #e8e8e8;
          .el-input {
            width: 100%;
            .el-input__inner {
              border: none;
            }
          }
        }
        .titles {
          padding-left: 20px;
          line-height: 44px;
          background-color: #fafafa;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: left;
          font-weight: 400;
        }
        .title-bottom {
          border-bottom: 1px solid #e8e8e8;
        }
        .title-left {
          border-left: 1px solid #e8e8e8;
        }
      }
      .noBR {
        border-right: none;
      }
      .noBB {
        border-bottom: none;
      }
    }
  }
}
.fj-block-body {
  padding-bottom: 30px;
}
.recruit-footer-btn {
  margin-top: 30px;
  text-align: center;
  button {
    width: 120px;
    height: 36px;
  }
}
.recruit-form-area {
  .el-input.is-disabled .el-input__inner {
    cursor: auto;
    background-color: #fff;
  }
  .el-form-item__error {
    display: none;
  }
  .is-required {
    .el-form-item__label:before {
      display: none;
    }
    .el-form-item__label:after {
      content: "*";
      color: #f56c6c;
      margin-left: 4px;
    }
  }
}
.fj-content_view.recruit {
  background: #fff;
}
.fj-content_view_mask {
  background: #f0f2f5;
  .fj-block-head {
    // border-bottom: 0px;
    margin-bottom: 20px;
    .title-btn{
      float: right;
      margin-top: 10px;
    }
  }
  .title {
  }
}
.fj-content_view.recruit .recruit-form-area.x-scroll {
  overflow-x: scroll;
}
.fj-content_view.recruit .el-form {
  border: 1px solid #e8e8e8;
}
.fj-content_view.recruit .el-form.has-table {
  border: none;
}
.fj-content_view.recruit .el-form .el-form-item {
  margin-bottom: 0px;
  border-right: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
}
.fj-content_view.recruit .el-form .el-form-item.noBR {
  border-right: none;
}
.fj-content_view.recruit .el-form .el-form-item.noBB {
  border-bottom: none;
}
/* 表单->表格调整 */
.recruit-form-area .el-table th {
  text-align: left;
  color: rgba(0, 0, 0, 0.65);
}
.recruit-form-area .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: transparent;
}
.recruit-form-area .el-table td {
  padding: 6px 0px;
}
.recruit-form-area .el-table td .el-input {
  width: 100%;
}
.recruit-form-area .el-table td .el-input .el-input__inner {
  padding: 0px 4px;
  border: none;
  color: rgba(0, 0, 0, 0.65);
}
.recruit-form-area .el-table td .el-textarea .el-textarea__inner {
  border: none;
  padding: 0px;
}
/*  */
.fj-content_view.recruit .el-form .el-form-item__label {
  min-width: 200px;
  padding: 0px 0px 0px 20px;
  line-height: 44px;
  background-color: #fafafa;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-right: 1px solid #e8e8e8;
  text-align: left;
}
.fj-content_view.recruit .el-form .el-form-item__content {
  padding-left: 200px;
  line-height: 44px;
}
.fj-content_view.recruit .el-form .el-form-item.NPL .el-form-item__content {
  padding-left: 0px;
}
/* el-form样式修改 */
.fj-content_view.recruit .el-form.no-title .el-form-item__label,
.fj-content_view.recruit .el-form.no-content .el-form-item__content {
  display: none;
}
.fj-content_view.recruit .el-form.no-title .el-form-item__label,
.fj-content_view.recruit .el-form.no-content .el-form-item__label {
  border-right: none;
}
.fj-content_view.recruit .el-form.no-content .el-form-item__label {
  float: none;
  display: block;
}
.fj-content_view.recruit .el-form.no-content + .el-form.no-title {
  border-left: none;
}
.fj-content_view.recruit .el-form[class*="no"] {
  float: left;
}
.fj-content_view.recruit .el-form.no-title .el-form-item__content {
  padding-left: 0px;
}
.fj-content_view.recruit .el-form.no-content .el-form-item__label,
.fj-content_view.recruit .el-form.no-title .el-form-item__content {
  position: relative;
  min-width: 160px;
}
.fj-content_view.recruit
  .el-form.no-title
  .el-form-item__content
  .el-input.is-disabled
  .el-input__inner {
  background-color: #fafafa;
  color: rgba(0, 0, 0, 0.65);
}
/*  */
/* 表单调整 */
.fj-content_view.recruit .el-form .el-form-item__content .el-select,
.fj-content_view.recruit .el-form .el-form-item__content .el-input {
  display: block;
  width: 100%;
}
.fj-content_view.recruit
  .el-form
  .el-form-item__content
  .el-input
  > .el-input__inner {
  height: 44px;
  line-height: 44px;
  border-color: #fff;
  border-radius: 0;
  color: rgba(0, 0, 0, 0.65);
}
.el-form-item.is-error .el-input__inner,
.el-form-item.is-error .el-input__inner:focus {
  border-color: #f56c6c !important;
}
/* 弹层操作 */
.fj-content_view.recruit .el-dialog .el-dialog__header {
  padding: 40px 56px;
  font-size: 20px;
  color: rgba(0, 0, 0, 0.85);
}
.fj-content_view.recruit .el-dialog .el-dialog__body {
  padding: 0px 56px 20px;
}
.fj-content_view.recruit .el-dialog .el-dialog__body .columns {
  display: flex;
}
.fj-content_view.recruit .el-dialog .el-dialog__body .fj-column,
.fj-content_view.recruit .el-dialog .el-dialog__body .fj-column {
  flex: 1 0 auto;
}
.fj-content_view.recruit .el-dialog .el-dialog__body .title-column {
  flex: 0 0 auto;
  width: 200px;
}
.fj-content_view.recruit .el-dialog .el-dialog__body .title-column > .el-form {
  border-right: none;
}
.fj-content_view.recruit .el-dialog .el-dialog__body .fj-column > .el-form {
  border-right: none;
}
.fj-content_view.recruit .el-dialog .el-dialog__body .el-form[class*="no"] {
  float: none;
}
.fj-content_view.recruit
  .el-dialog
  .el-dialog__body
  .title-column
  .el-form
  .el-form-item__label {
  background-color: transparent;
}
/*  */
.fj-content_view.recruit
  .el-dialog
  .el-dialog__body
  [class*="-column"]
  .el-form:first-child {
  border-bottom: none;
}
/*  */
.fj-content_view.recruit
  .el-dialog
  .el-dialog__body
  .title-column
  > .el-form
  .el-form-item:nth-of-type(2n),
.fj-content_view.recruit
  .el-dialog
  .el-dialog__body
  .fj-column
  > .el-form
  .el-form-item:nth-of-type(2n)
  .el-input__inner,
.fj-content_view.recruit
  .el-dialog
  .el-dialog__body
  .mj-column
  > .el-form
  .el-form-item:nth-of-type(2n)
  .el-input__inner {
  background-color: #f0faff;
}
@media screen and (min-width: 1920px) {
  /* .fj-content_view.recruit .el-form .el-form-item__content .el-select {width:60%;} */
}
</style>

