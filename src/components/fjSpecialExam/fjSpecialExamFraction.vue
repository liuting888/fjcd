<template>
  <div class="fj-content_view Exam-Manage">
    <div class="fj-content_view_mask">
      <div class="fj-block title">
        <fj-breadNav :bread-data="breadData"></fj-breadNav>
      </div>
      <div class="fj-block content">
        <div class="fj-block-head kaohe">
          <p class="title">试卷标题</p>
        </div>
        <div class="fj-block-body">
          <!-- 表单输入区域 -->
          <div class="Exam-Manage-form-area">
            <el-form :model="ruleForm" ref="ruleForm" :rules="rules">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="考试人员">
                    <p>{{ruleForm.data.userName}}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="考试时长">
                    <p>{{ruleForm.data.useTime}}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="正确">
                    <p>{{ruleForm.data.userName}}</p>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="考试得分">
                    <p>{{ruleForm.data.score}}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="考试日期">
                    <p>{{ruleForm.data.time}}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="错误">
                    <p>{{ruleForm.data.wrongNumber}}</p>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
        <div class="fj-block-foot">
          <div class="fj-block-head kaohe">
            <p class="title">
              <span>试卷内容</span>
            </p>
          </div>
          <div class="foot-body">
            <el-container>
              <el-main class="aside-left">
                <div class="body">
                  <div class="check-topic" v-for="(item, index) in ruleForm.list" :key="index">
                    <div class="topic">
                      {{index+1}}.
                      <span>{{item.question}}</span>
                    </div>
                    <ul>
                      <li>
                        <i
                          :class="(item.rightOptions.indexOf('0')!=-1)?'el-icon-success':(item.myChoice.indexOf('0')!=-1)?'el-icon-error':'el-icon-info'"
                        ></i>A:
                        <span>{{item.A}}</span>
                      </li>
                      <li>
                        <i
                          :class="(item.rightOptions.indexOf('1')!=-1)?'el-icon-success':(item.myChoice.indexOf('1')!=-1)?'el-icon-error':'el-icon-info'"
                        ></i>B:
                        <span>{{item.B}}</span>
                      </li>
                      <li>
                        <i
                          :class="(item.rightOptions.indexOf('2')!=-1)?'el-icon-success':(item.myChoice.indexOf('2')!=-1)?'el-icon-error':'el-icon-info'"
                        ></i>C:
                        <span>{{item.C}}</span>
                      </li>
                      <li>
                        <i
                          :class="(item.rightOptions.indexOf('3')!=-1)?'el-icon-success':(item.myChoice.indexOf('3')!=-1)?'el-icon-error':'el-icon-info'"
                        ></i>D:
                        <span>{{item.D}}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </el-main>
            </el-container>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import fjBreadNav from "@/components/fjBreadNav";
export default {
  name: "fjSpecial-Exam-Manage",
  data() {
    return {
      breadData: [
        { name: "当前位置:", path: "" },
        { name: "教培管理", path: "" },
        { name: "专题考试", path: "" }
      ],
      userInfo: {},
      isTitleDisabled: true,
      ruleForm: {
        data: {
          title: "这里是题库的标题",
          id: "主键id",
          instime: "新建时间",
          paperId: "试卷id",
          rightNumber: "正确数量",
          score: "得分",
          time: "考试时间",
          updtime: "更新时间",
          useTime: "考试用时",
          userId: "用户id",
          userName: "用户信命",
          wrongNumber: "错误数量"
        },
        list: [
          {
            question: "题目1",
            A: "hahaA",
            B: "hahaB",
            C: "hahaC",
            D: "hahaD",
            myChoice: "3,2",
            rightOptions: "1"
          },
          {
            question: "题目2",
            A: "hahaA2",
            B: "hahaB2",
            C: "hahaC2",
            D: "hahaD2",
            myChoice: "2",
            rightOptions: "3,0"
          }
        ]
      },
      rules: {}
    };
  },
  mounted() {
    this.setCreated();
    this.getDetailList();
  },
  methods: {
    // 获取题库详情
    getDetailList: function() {
      this.ruleForm.data.id = this.userInfo.id;
      if (!this.userInfo.id) {
        return false;
      }
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/getExamResultInfo",
        type: "POST",
        data: {
          id: this.userInfo.id
        },
        dataType: "json",
        success: function(data) {
          vm.ruleForm.data = data.data;
          for (let i = 0; i < data.list.length; i++) {
            let tm = {
              id: data.list[i].id,
              question: data.list[i].question,
              A: data.list[i].options.split("&GXCF&")[0],
              B: data.list[i].options.split("&GXCF&")[1],
              C: data.list[i].options.split("&GXCF&")[2],
              D: data.list[i].options.split("&GXCF&")[3],
              rightOptions: data.list[i].rightOptions,
              myChoice: data.list[i].myChoice
            };
            vm.ruleForm.list.unshift(tm);
          }
        },
        error: function(err) {}
      });
    },
    // 提交或者编辑数据
    postRuleForm: function() {
      let vm = this;
      let url = vm.userInfo.state == 0 ? "/addInfo" : "/updInfo";
      if (vm.userInfo.id) {
        vm.ruleForm.data.id = vm.userInfo.id;
      }
      // vm.ruleForm.userId = $.parseJSON(
      //   fjPublic.getLocalData("userInfo")
      // ).userId;
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
      // this.ruleForm = {};
      // this.userInfo.state != 0 &&
      //   (this.ruleForm = $.parseJSON(fjPublic.getLocalData("ybssItem")));
      // this.$refs["ruleForm"].resetFields();
    },
    routerGo() {
      window.history.go(-1);
    }
  },
  watch: {
    // checkedCities: function(val) {
    //   console.log(val);
    //   this.headInfo.choose=this.checkedCities.length;
    // }
    // checkedCities: {
    //   handler: function(val, oldval) {
    //     console.log(val, oldval);
    //   }
    // }
  },
  components: {
    fjBreadNav
  }
};
</script>
<style scope lang="less">
.foot-body {
  padding: 10px 0;
  .el-container {
    width: 100%;
    .aside-left {
      margin-left: 200px;
    }
    .el-main {
      .head {
        width: 100%;
        height: 40px;
        margin-top: -20px;
        padding-left: 16px;
        line-height: 40px;
        background: rgba(230, 247, 255, 1);
        border: 1px solid rgba(186, 231, 255, 1);
        opacity: 1;
      }
      .body {
        .check-topic {
          position: relative;
          .topic {
            margin: 15px 0;
          }
          li {
            margin: 18px 0;
            font-size: 14px;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.85);
            i {
              margin-right: 6px;
            }
            .el-icon-success {
              color: #1f93ff;
            }
            .el-icon-error {
              color: #d54c4c;
            }
            .el-icon-info {
              color: #fff;
              border: 1px solid #ccc;
              border-radius: 50%;
            }
          }
        }
      }
    }
  }
}
.Exam-Manage-form-area {
  margin-top: 10px;
  p {
    margin-left: 18px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
  }
  .el-input.is-disabled .el-input__inner {
    cursor: auto;
    background-color: #fff;
  }
}
.fj-content_view.Exam-Manage {
  background: #fff;
}
.fj-content_view_mask {
  background: #f0f2f5;
}
.fj-content_view.Exam-Manage .Exam-Manage-form-area.x-scroll {
  overflow-x: scroll;
}
.fj-content_view.Exam-Manage .Exam-Manage-form-area > .el-form {
  margin-bottom: 15px;
}
.fj-content_view.Exam-Manage .el-form {
  border: 1px solid #e8e8e8;
}
.fj-content_view.Exam-Manage .el-form.has-table {
  border: none;
}
.fj-content_view.Exam-Manage .el-form .el-form-item {
  margin-bottom: 0px;
  border-right: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
}
.fj-content_view.Exam-Manage .el-form .el-form-item.noBR {
  border-right: none;
}
.fj-content_view.Exam-Manage .el-form .el-form-item.noBB {
  border-bottom: none;
}
/* 表单->表格调整 */
.Exam-Manage-form-area .el-table th {
  text-align: left;
  color: rgba(0, 0, 0, 0.65);
}
.Exam-Manage-form-area
  .el-table--enable-row-hover
  .el-table__body
  tr:hover
  > td {
  background-color: transparent;
}
.Exam-Manage-form-area .el-table td {
  padding: 6px 0px;
}
.Exam-Manage-form-area .el-table td .el-input {
  width: 100%;
}
.Exam-Manage-form-area .el-table td .el-input .el-input__inner {
  padding: 0px 4px;
  border: none;
  color: rgba(0, 0, 0, 0.65);
}
.Exam-Manage-form-area .el-table td .el-textarea .el-textarea__inner {
  border: none;
  padding: 0px;
}
/*  */
.fj-content_view.Exam-Manage .el-form .el-form-item__label {
  min-width: 160px;
  padding: 0px 0px 0px 20px;
  line-height: 44px;
  background-color: #fafafa;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-right: 1px solid #e8e8e8;
  text-align: left;
}
.fj-content_view.Exam-Manage .el-form .el-form-item__content {
  padding-left: 160px;
  line-height: 44px;
}
.fj-content_view.Exam-Manage .el-form .el-form-item.NPL .el-form-item__content {
  padding-left: 0px;
}
/* el-form样式修改 */
.fj-content_view.Exam-Manage .el-form.no-title .el-form-item__label,
.fj-content_view.Exam-Manage .el-form.no-content .el-form-item__content {
  display: none;
}
.fj-content_view.Exam-Manage .el-form.no-title .el-form-item__label,
.fj-content_view.Exam-Manage .el-form.no-content .el-form-item__label {
  border-right: none;
}
.fj-content_view.Exam-Manage .el-form.no-content .el-form-item__label {
  float: none;
  display: block;
}
.fj-content_view.Exam-Manage .el-form.no-content + .el-form.no-title {
  border-left: none;
}
.fj-content_view.Exam-Manage .el-form[class*="no"] {
  float: left;
}
.fj-content_view.Exam-Manage .el-form.no-title .el-form-item__content {
  padding-left: 0px;
}
.fj-content_view.Exam-Manage .el-form.no-content .el-form-item__label,
.fj-content_view.Exam-Manage .el-form.no-title .el-form-item__content {
  position: relative;
  min-width: 160px;
}
.fj-content_view.Exam-Manage
  .el-form.no-title
  .el-form-item__content
  .el-input.is-disabled
  .el-input__inner {
  background-color: #fafafa;
  color: rgba(0, 0, 0, 0.65);
}

@media screen and (min-width: 1920px) {
  /* .fj-content_view.Exam-Manage .el-form .el-form-item__content .el-select {width:60%;} */
}
</style>

