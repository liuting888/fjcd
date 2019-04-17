<template>
  <div class="fj-content_view Exam-Manage">
    <div class="fj-content_view_mask">
      <div class="fj-block title">
        <fj-breadNav :bread-data="breadData"></fj-breadNav>
      </div>
      <div class="fj-block content">
        <div class="fj-block-head kaohe">
          <p class="title" @mouseover="isTitleDisabled=false" @mouseout="isTitleDisabled=true">
            <el-input :disabled="isTitleDisabled" type="text" v-model="ruleForm.data.title"></el-input>
            <el-button type="primary" @click="createPaper()" v-if="userInfo.state == 0">生成试卷</el-button>
          </p>
        </div>
        <div class="fj-block-body">
          <!-- 表单输入区域 -->
          <div class="Exam-Manage-form-area">
            <el-form :model="ruleForm" ref="ruleForm" :rules="rules">
              <el-row>
                <el-col :span="24">
                  <el-form-item prop="houseNumber" label="题目类型">
                    <el-checkbox-group v-model="ruleForm.data.type" v-if="userInfo.state != 1">
                      <el-checkbox label="单选"></el-checkbox>
                      <el-checkbox label="多选"></el-checkbox>
                      <el-checkbox label="其他"></el-checkbox>
                    </el-checkbox-group>
                    <p v-if="userInfo.state == 1">单选，单选</p>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item prop="city" label="选题规则">
                    <el-select
                      v-model="ruleForm.data.selectRules"
                      v-bind:disabled="userInfo.state == 1"
                      placeholder="请选择（必选）"
                    >
                      <el-option :value="1" label="单选题"></el-option>
                      <el-option :value="0" label="单选题"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item class="noBR" prop="street" label="考试类型">
                    <el-select
                      v-model="ruleForm.data.examType"
                      v-bind:disabled="userInfo.state == 1"
                      placeholder="请选择（必选）"
                    >
                      <el-option :value="1" label="单选题"></el-option>
                      <el-option :value="0" label="单选题"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item prop="community" label="题目数量">
                    <el-select
                      v-model="ruleForm.data.amount"
                      v-bind:disabled="userInfo.state == 1"
                      placeholder="请选择（必选）"
                    >
                      <el-option :value="10" label="10"></el-option>
                      <el-option :value="20" label="20"></el-option>
                      <el-option :value="25" label="25"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item class="noBR" prop="road" label="试卷分数">
                    <el-input
                      v-model="ruleForm.data.score"
                      v-bind:disabled="userInfo.state == 1"
                      placeholder="100分"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item prop="houseNumber" label="考试日期">
                    <el-date-picker
                      v-bind:disabled="userInfo.state == 1"
                      v-model="ruleForm.data.examTime"
                      type="date"
                      placeholder="请选择"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item class="noBR" prop="plots" label="考试时长">
                    <el-select
                      v-model="ruleForm.data.time"
                      v-bind:disabled="userInfo.state == 1"
                      placeholder="请选择（必选）"
                    >
                      <el-option :value="30" label="30"></el-option>
                      <el-option :value="60" label="60"></el-option>
                      <el-option :value="90" label="90"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item prop="entityName" label="题目分数">
                    <el-select
                      v-model="ruleForm.data.community"
                      v-bind:disabled="userInfo.state == 1"
                      placeholder="请选择（必选）"
                    >
                      <el-option :value="4" label="4"></el-option>
                      <el-option :value="5" label="5"></el-option>
                      <el-option :value="10" label="10"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item class="noBR" label="题序随机">
                    <el-radio v-model="radio" label="1" v-if="userInfo.state != 1">是</el-radio>
                    <el-radio v-model="radio" label="2" v-if="userInfo.state != 1">否</el-radio>
                    <p v-if="userInfo.state == 1">是</p>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item class="noBR noBB" label="适用人员">
                    <el-input
                      v-bind:disabled="userInfo.state == 1"
                      v-model="ruleForm.data.people"
                      @focus="checkDialogVisible=true"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
        <div class="fj-block-foot" v-if="isCreatePaperShow">
          <div class="fj-block-head kaohe">
            <p class="title">
              <span>试卷内容</span>
              <el-button @click="createPaper()" v-if="userInfo.state != 1">重新生成试卷</el-button>
              <el-button
                type="primary"
                @click="postRuleForm()"
                v-if="userInfo.state != 1"
              >保存试卷</el-button>
            </p>
          </div>
          <div class="foot-body">
            <el-container>
              <el-aside width="300px" v-if="userInfo.state != 1">
                <div class="head">题库/行政法规</div>
                <div class="search">
                  <el-input
                    v-model="ruleForm.data.people"
                    clearable
                    placeholder="请输入"
                    size="small"
                    class="search-input"
                  >
                    <el-button slot="append" @click="searchAttendHistory">搜索</el-button>
                  </el-input>
                </div>
                <el-checkbox-group v-model="checkedCities" :max="ruleForm.data.amount">
                  <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
                </el-checkbox-group>
              </el-aside>
              <el-main :class="userInfo.state == 1?aside-left:''">
                <div class="head" v-if="userInfo.state != 1">
                  <span>
                    <img src="static/images/exam-manage-info.png" alt>
                  </span>
                  <span>
                    已选择
                    <span class="text-blue">{{headInfo.choose}}</span>
                    项，单选题{{headInfo.radio}}题，多选题{{headInfo.selection}}题，本套试卷共{{headInfo.all}}题（共计{{ruleForm.data.score}}分）。
                  </span>
                  <span class="text-blue" @click="createPaper()">清空</span>
                </div>
                <div class="body">
                  <div
                    class="check-topic"
                    v-for="(item, index) in ruleForm.list"
                    @mouseover="item.editIcon=true"
                    @mouseout="item.editIcon=false"
                    :key="index"
                  >
                    <div class="topic">
                      {{index+1}}.
                      <el-input type="text" :disabled="true" v-model="item.question"></el-input>
                    </div>
                    <ul>
                      <el-checkbox-group
                        v-model="item.rightOptions"
                        :min="item.rightOptions.length"
                        :max="item.rightOptions.length"
                      >
                        <el-checkbox label="0" :disabled="(item.rightOptions.indexOf('0')==-1)"></el-checkbox>
                        <el-checkbox label="1" :disabled="(item.rightOptions.indexOf('1')==-1)"></el-checkbox>
                        <el-checkbox label="2" :disabled="(item.rightOptions.indexOf('2')==-1)"></el-checkbox>
                        <el-checkbox label="3" :disabled="(item.rightOptions.indexOf('3')==-1)"></el-checkbox>
                      </el-checkbox-group>
                      <li>
                        A:
                        <el-input :disabled="true" type="text" v-model="item.A"></el-input>
                      </li>
                      <li>
                        B:
                        <el-input type="text" :disabled="true" v-model="item.B"></el-input>
                      </li>
                      <li>
                        C:
                        <el-input type="text" :disabled="true" v-model="item.C"></el-input>
                      </li>
                      <li>
                        D:
                        <el-input type="text" :disabled="true" v-model="item.D"></el-input>
                      </li>
                      <div class="right-revise" v-if="item.editIcon&&userInfo.state != 1">
                        <img src="static/images/fj-exam-del.png" alt="删除" @click="delTopic(index)">
                      </div>
                    </ul>
                  </div>
                </div>
              </el-main>
            </el-container>
          </div>
        </div>
      </div>
    </div>
    <!-- 适用人员弹出框 -->
    <el-dialog
      title="信息采集表"
      :visible.sync="checkDialogVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      style="position: absolute"
      width="680px"
      class="check-dialogs"
    >
      <div>
        <el-tree
          :data="data2"
          show-checkbox
          node-key="id"
          :default-expanded-keys="[2, 3]"
          :default-checked-keys="[5]"
          :props="defaultProps"
          :current-node-key="currentNode"
          @node-click="handleNodeClick"
          ref="tree"
        ></el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="treeAudit(1)">确 定</el-button>
        <el-button @click="treeAudit(2)">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import fjBreadNav from "@/components/fjBreadNav";
export default {
  name: "fjSpecial-Exam-Manage",
  data() {
    return {
      data2: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1"
                },
                {
                  id: 10,
                  label: "三级 1-1-2"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1"
            },
            {
              id: 8,
              label: "二级 3-2"
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      currentNode: {},
      breadData: [
        { name: "当前位置:", path: "" },
        { name: "教培管理", path: "" },
        { name: "专题考试", path: "" }
      ],
      userInfo: {},
      checkDialogVisible: false,
      isCreatePaperShow: false,
      isTitleDisabled: true,
      ruleForm: {
        data: {
          // title: "这里是题库的标题",
          // score: 100,
          // time: 30,
          // examType: 30,
          // type: 30,
          // people: 30,
          // instime: 30,
          // amount: 10,
          // id: "",
          // type: []
          id: "",
          title: "这里是题库的标题",
          type: [],
          score: "10",
          time: "60",
          people: "适合人群",
          // state:状态，0启用，1停用，-1删除，默认1
          examList: "题目id集合，用逗号隔开",
          selectRules: "选题规则",
          place: "考试地点",
          content: "内容",
          examType: "考试类型",
          examTime: "2019-01-01"
        },
        list: [
          {
            question: "题目1",
            A: "hahaA",
            B: "hahaB",
            C: "hahaC",
            D: "hahaD",
            rightOptions: ["2"],
            editIcon: false //用来判断是否展示侧边栏图标
          },
          {
            question: "题目2",
            A: "hahaA2",
            B: "hahaB2",
            C: "hahaC2",
            D: "hahaD2",
            rightOptions: ["1"],
            editIcon: false //用来判断是否展示侧边栏图标
          }
        ]
      },
      title: "这里是试卷的标题",
      checkList: ["单选"],
      checkedCities: ["上海", "北京"],
      cities: ["上海", "北京", "广州", "深圳"],
      headInfo: {
        //试卷题目数量信息
        all: "20",
        radio: "10",
        selection: "10",
        choose: "0"
      },
      radio: "1",
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
      rules: {}
    };
  },
  // created() {
  //   this.setCreated();
  // },
  mounted() {
    this.setCreated();
    this.getDetailList();
  },
  methods: {
    // 验证规则
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.createPaper();
        } else {
          this.$message({
            message: "请填写完所有必填信息",
            type: "warning"
          });
          return false;
        }
      });
    },
    //生成试卷
    createPaper() {
      this.isCreatePaperShow = true;
      this.ruleForm.list = [];
      this.checkedCities = [];
    },
    treeAudit(i) {
      // console.log(this.$refs.tree.getCheckedNodes());
      let list = this.$refs.tree.getCheckedNodes();
      this.ruleForm.data.people = "";
      for (let index = 0; index < list.length; index++) {
        const element = list[index];
        if (index < list.length - 1) {
          this.ruleForm.data.people += element.label + ",";
        } else {
          this.ruleForm.data.people += element.label;
        }
      }
      this.checkDialogVisible = false;
      // console.log(this.$refs.tree.getCheckedKeys());
    },
    //删除考题
    delTopic(index) {
      let title = this.ruleForm.list[index].title;
      this.ruleForm.list.splice(index, 1);
      this.checkedCities.forEach((item, i) => {
        if (item == title) {
          this.checkedCities.splice(i, 1);
        }
      });
    },
    //树形控件获取数据
    handleNodeClick(data) {
      console.log(data);
    },
    // 获取题库详情
    getDetailList: function() {
      console.log(this.userInfo.id);
      this.ruleForm.data.id = this.userInfo.id;
      if (!this.userInfo.id) {
        return false;
      }
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/getExamPaperInfo",
        type: "POST",
        data: {
          id: this.userInfo.id
        },
        dataType: "json",
        success: function(data) {
          console.log(data);
          vm.ruleForm.data = data.data;
          for (let i = 0; i < data.list.length; i++) {
            let tm = {
              id: data.list[i].id,
              question: data.list[i].question,
              A: data.list[i].options.split("&GXCF&")[0],
              B: data.list[i].options.split("&GXCF&")[1],
              C: data.list[i].options.split("&GXCF&")[2],
              D: data.list[i].options.split("&GXCF&")[3],
              rightOptions: data.list[i].rightOptions.split("|"),
              editIcon: false //用来判断是否展示侧边栏图标
            };
            vm.ruleForm.list.unshift(tm);
          }
        },
        error: function(err) {}
      });
    },
    // 搜索题库
    searchAttendHistory: function() {
      var defer = $.Deferred();
      var vm = this;
      console.log(555);
      // return new Promise((resolve, reject) => {
      // $.ajax({
      //   url: fjPublic.ajaxUrlDNN + "/addExamPaper",
      //   type: "POST",
      //   data: VM.examTime.data,
      //   dataType: "json",
      //   success: function(data) {
      //     // vm.ruleForm.data.id = data.id;
      //     // resolve(data);
      //   },
      //   error: function(err) {}
      // });
      // });
    },
    // // 新增试卷
    // addExam: function() {
    //   var defer = $.Deferred();
    //   var vm = this;
    //   // return new Promise((resolve, reject) => {
    //   $.ajax({
    //     url: fjPublic.ajaxUrlDNN + "/addExamPaper",
    //     type: "POST",
    //     data: VM.examTime.data,
    //     dataType: "json",
    //     success: function(data) {
    //       // vm.ruleForm.data.id = data.id;
    //       // resolve(data);
    //     },
    //     error: function(err) {}
    //   });
    //   // });
    // },
    // // 更新试卷
    // updExam: function() {
    //   var defer = $.Deferred();
    //   var vm = this;
    //   $.ajax({
    //     url: fjPublic.ajaxUrlDNN + "/updExamPaper",
    //     type: "POST",
    //     data: {
    //       id: vm.ruleForm.data.id,
    //       title: vm.ruleForm.data.title,
    //       type: vm.ruleForm.data.type,
    //       content: vm.ruleForm.data.content,
    //       examPeople: vm.ruleForm.data.examPeople
    //     },
    //     dataType: "json",
    //     success: function(data) {
    //       // console.log(data);
    //     },
    //     error: function(err) {}
    //   });
    // },
    // 提交或者编辑数据
    postRuleForm: function() {
      let vm = this;
      let url = vm.userInfo.state == 0 ? "/addExamPaper" : "/updExamPaper";
      if (vm.userInfo.id) {
        vm.ruleForm.data.id = vm.userInfo.id;
      }
      console.log(123);
      vm.ruleForm.data.type="单选";
      vm.ruleForm.data.examList="";
      // vm.ruleForm.data.tableName = vm.activeList[vm.userInfo.index].tableName;
      // vm.ruleForm.data.userId = $.parseJSON(
      //   fjPublic.getLocalData("userInfo")
      // ).userId;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + url,
        type: "POST",
        data: vm.ruleForm.data,
        dataType: "json",
        success: function(data) {},
        error: function(err) {
          if (err.responseText == "success") {
            console.log(123);
            // vm.$router.push({
            //   path: "/fjWorkManage-YiBiaoSanShi"
            // });
          } else {
          }
        }
      });
    },
    setCreated() {
      this.userInfo = this.$route.query;
      this.userInfo.state != 0 && (this.isCreatePaperShow = true);
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
    checkedCities: {
      handler: function(val, oldval) {
        console.log(val, oldval);
        if (val.length > oldval.length) {
          let list = {};
          list.question = val[val.length - 1];
          list.A = "66";
          list.B = "66";
          list.C = "66";
          list.D = "66";
          list.rightOptions = ["2"];
          list.editIcon = false;
          this.ruleForm.list.unshift(list);
        } else {
          this.ruleForm.list.forEach((item, i) => {
            for (const key in item) {
              if (item[key] == oldval[oldval.length - 1]) {
                this.ruleForm.list.splice(i, 1);
              }
            }
          });
        }
        this.headInfo.choose = this.checkedCities.length;
      }
    }
  },
  components: {
    fjBreadNav
  }
};
</script>
<style scope lang="less">
.fj-block-head > .title {
  button {
    float: right;
    margin: 10px;
  }
  .el-input {
    width: 500px;
    margin-top: 4px;
    font-size: 16px;
    font-weight: 500;
  }
  .el-input.is-disabled .el-input__inner {
    background-color: #fff;
    border-color: #fff;
    color: rgba(0, 0, 0, 0.85);
    cursor: auto;
  }
}
.foot-body {
  padding: 10px 0;
  .el-container {
    width: 100%;
    .el-aside {
      border: 1px solid rgba(232, 232, 232, 1);
      .head {
        height: 60px;
        line-height: 60px;
        text-align: center;
        font-size: 14px;
        font-weight: 500;
        color: rgba(0, 0, 0, 1);
        opacity: 1;
        border-bottom: 1px solid rgba(232, 232, 232, 1);
      }
      .search {
        height: 54px;
        line-height: 54px;
        text-align: center;
        border-bottom: 1px solid rgba(232, 232, 232, 1);
        .search-input {
          width: 260px;
          .el-input-group__append {
            background-color: #1890ff;
            border-color: #1890ff;
            color: #fff;
          }
        }
      }
      .el-checkbox {
        width: 100%;
        height: 50px;
        line-height: 50px;
        padding-left: 10px;
        border-bottom: 1px solid rgba(232, 232, 232, 1);
      }
      .el-checkbox + .el-checkbox {
        margin-left: 0px;
      }
    }
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
        img {
          width: 14px;
          height: 14px;
          vertical-align: middle;
        }
        .text-blue {
          color: #1890ff;
          cursor: pointer;
        }
      }
      .body {
        .check-topic {
          position: relative;
          .el-checkbox-group {
            position: absolute;
            margin-top: -16px;
            width: 20px;
            .el-checkbox {
              margin-top: 24px;
              margin-left: 0;
            }
            .el-checkbox__label {
              display: none;
            }
          }
          .el-checkbox__input.is-disabled .el-checkbox__inner {
            cursor: auto;
          }
          .right-revise {
            width: 60px;
            height: 100%;
            position: absolute;
            top: 0;
            right: 0;
            background-color: #f0f0f0;
            border: 1px solid rgba(0, 0, 0, 0.2);
            img {
              width: 24px;
              height: 24px;
              margin-top: 86px;
              margin-left: 17px;
              cursor: pointer;
            }
          }
          .el-radio {
            margin-right: 4px;
            .el-radio__label {
              display: none;
            }
          }
          .el-input.is-disabled .el-input__inner {
            background-color: #fff;
            border-color: #fff;
            color: rgba(0, 0, 0, 0.85);
            cursor: auto;
          }
          .el-radio__input.is-disabled .el-radio__inner {
            cursor: auto;
          }
          .topic {
            margin: 15px 0;
            input {
              width: 680px;
            }
          }
          li {
            margin: 10px 20px;
            .el-input {
              width: 480px;
            }
          }
        }
      }
    }
  }
}
.Exam-Manage-form-area {
  margin-top: 10px;
  .el-checkbox-group {
    margin-left: 18px;
  }
  .el-radio {
    margin-left: 18px;
  }
  p {
    margin-left: 18px;
  }
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
.fj-content_view.Exam-Manage .el-form .el-form-item__content {
  padding-left: 200px;
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
/*  */
/* 表单调整 */
.fj-content_view.Exam-Manage .el-form .el-form-item__content .el-select,
.fj-content_view.Exam-Manage .el-form .el-form-item__content .el-input {
  display: block;
  width: 100%;
}
.fj-content_view.Exam-Manage
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
.fj-content_view.Exam-Manage .el-dialog .el-dialog__header {
  padding: 40px 56px;
  font-size: 20px;
  color: rgba(0, 0, 0, 0.85);
}
.fj-content_view.Exam-Manage .el-dialog .el-dialog__body {
  padding: 0px 56px 20px;
}
.fj-content_view.Exam-Manage .el-dialog .el-dialog__body .columns {
  display: flex;
}
.fj-content_view.Exam-Manage .el-dialog .el-dialog__body .fj-column,
.fj-content_view.Exam-Manage .el-dialog .el-dialog__body .fj-column {
  flex: 1 0 auto;
}
.fj-content_view.Exam-Manage .el-dialog .el-dialog__body .title-column {
  flex: 0 0 auto;
  width: 200px;
}
.fj-content_view.Exam-Manage
  .el-dialog
  .el-dialog__body
  .title-column
  > .el-form {
  border-right: none;
}
.fj-content_view.Exam-Manage .el-dialog .el-dialog__body .fj-column > .el-form {
  border-right: none;
}
.fj-content_view.Exam-Manage .el-dialog .el-dialog__body .el-form[class*="no"] {
  float: none;
}
.fj-content_view.Exam-Manage
  .el-dialog
  .el-dialog__body
  .title-column
  .el-form
  .el-form-item__label {
  background-color: transparent;
}
/*  */
.fj-content_view.Exam-Manage
  .el-dialog
  .el-dialog__body
  [class*="-column"]
  .el-form:first-child {
  border-bottom: none;
}
/*  */
.fj-content_view.Exam-Manage
  .el-dialog
  .el-dialog__body
  .title-column
  > .el-form
  .el-form-item:nth-of-type(2n),
.fj-content_view.Exam-Manage
  .el-dialog
  .el-dialog__body
  .fj-column
  > .el-form
  .el-form-item:nth-of-type(2n)
  .el-input__inner,
.fj-content_view.Exam-Manage
  .el-dialog
  .el-dialog__body
  .mj-column
  > .el-form
  .el-form-item:nth-of-type(2n)
  .el-input__inner {
  background-color: #f0faff;
}
@media screen and (min-width: 1920px) {
  /* .fj-content_view.Exam-Manage .el-form .el-form-item__content .el-select {width:60%;} */
}
</style>

