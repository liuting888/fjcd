<template>
  <div class="fj-content_view exam-questions">
    <div class="fj-content_view_mask">
      <div class="fj-block title">
        <fj-breadNav :bread-data="breadData"></fj-breadNav>
      </div>
      <div class="fj-block content">
        <div
          class="fj-block-head"
          @mouseover="isTitleDisabled=false"
          @mouseout="isTitleDisabled=true"
        >
          <el-input :disabled="isTitleDisabled" type="text" v-model="ruleForm.data.title">{{e}}</el-input>
        </div>
        <div class="fj-block-body">
          <div class="body-header">
            <div class="search-item">
              <span class="span-title">题库类型：</span>
              <el-select v-model="ruleForm.data.type" clearable>
                <el-option :value="单选题" label="单选题"></el-option>
                <el-option :value="多选题" label="多选题"></el-option>
              </el-select>
            </div>
            <div class="search-item hidden-lg-and-down">
              <span class="span-title">考试类型：</span>
              <el-select v-model="ruleForm.data.examPeople">
                <el-option :value="辅警" label="辅警"></el-option>
                <el-option :value="民警" label="民警"></el-option>
              </el-select>
            </div>
            <div @mouseover="istextareaDisabled=false" @mouseout="istextareaDisabled=true">
              <el-input
                :disabled="istextareaDisabled"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                v-model="ruleForm.data.content"
              ></el-input>
            </div>
            <div class="add-list-btn" @click="addTopicS()">+ 添加考题</div>
          </div>
          <div class="body-body">
            <ul>
              <li class="add-topic" v-if="isAddTopic">
                <el-checkbox-group
                  v-model="addTopicList.rightOptions"
                  :min="1"
                  :max="ruleForm.data.type=='单选题'?1:4"
                >
                  <el-checkbox label="0"></el-checkbox>
                  <el-checkbox label="1"></el-checkbox>
                  <el-checkbox label="2"></el-checkbox>
                  <el-checkbox label="3"></el-checkbox>
                </el-checkbox-group>
                <div class="topic">
                  题目:
                  <el-input type="text" v-model="addTopicList.question"></el-input>
                </div>
                <ul>
                  <li>
                    A:
                    <el-input type="text" v-model="addTopicList.A"></el-input>
                  </li>
                  <li>
                    B:
                    <el-input type="text" v-model="addTopicList.B"></el-input>
                  </li>
                  <li>
                    C:
                    <el-input type="text" v-model="addTopicList.C"></el-input>
                  </li>
                  <li>
                    D:
                    <el-input type="text" v-model="addTopicList.D"></el-input>
                    <div class="add-topic-btn">
                      <el-button @click="isAddTopic=false">取消</el-button>
                      <el-button type="primary" @click="addTopic()">确认</el-button>
                    </div>
                  </li>
                </ul>
              </li>
              <li
                class="check-topic"
                v-for="(item, index) in ruleForm.list"
                @mouseover="item.editIcon=true,item.edt==true&&(item.edit=false)"
                @mouseout="item.editIcon=false,item.edit=true"
                :key="index"
              >
                <div class="topic">
                  {{index+1}}.
                  <el-input type="text" :disabled="item.edit" v-model="item.question"></el-input>
                </div>
                <ul>
                  <el-checkbox-group
                    v-model="item.rightOptions"
                    :min="item.edit?item.rightOptions.length:1"
                    :max="ruleForm.data.type=='单选题'?1:4"
                  >
                    <el-checkbox
                      label="0"
                      :disabled="(item.rightOptions.indexOf('0')==-1)&&item.edit"
                    ></el-checkbox>
                    <el-checkbox
                      label="1"
                      :disabled="(item.rightOptions.indexOf('1')==-1)&&item.edit"
                    ></el-checkbox>
                    <el-checkbox
                      label="2"
                      :disabled="(item.rightOptions.indexOf('2')==-1)&&item.edit"
                    ></el-checkbox>
                    <el-checkbox
                      label="3"
                      :disabled="(item.rightOptions.indexOf('3')==-1)&&item.edit"
                    ></el-checkbox>
                  </el-checkbox-group>
                  <li>
                    A:
                    <el-input :disabled="item.edit" type="text" v-model="item.A"></el-input>
                  </li>
                  <li>
                    B:
                    <el-input type="text" :disabled="item.edit" v-model="item.B"></el-input>
                  </li>
                  <li>
                    C:
                    <el-input type="text" :disabled="item.edit" v-model="item.C"></el-input>
                  </li>
                  <li>
                    D:
                    <el-input type="text" :disabled="item.edit" v-model="item.D"></el-input>
                  </li>
                  <div class="right-revise" v-if="item.editIcon">
                    <img src="static/images/fj-exam-edt.png" alt="修改" @click="edtTopic(index)">
                    <img src="static/images/fj-exam-up.png" alt="上移" @click="upTopic(index)">
                    <img src="static/images/fj-exam-down.png" alt="下移" @click="downTopic(index)">
                    <img src="static/images/fj-exam-del.png" alt="删除" @click="delTopic(index)">
                  </div>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import fjBreadNav from "@/components/fjBreadNav";
export default {
  name: "special-exam-questions",
  data() {
    return {
      breadData: [
        { name: "当前位置:", path: "" },
        { name: "教培管理", path: "" },
        { name: "专题考试", path: "" }
      ],
      userInfo: {},
      isEditData: false, //是否触发更新题库
      ruleForm: {
        data: {
          id: "",
          title: "这里是题库的标题",
          type: "单选题",
          examPeople: "辅警",
          content: "请简单描述试题库内容"
        },
        list: []
      },
      isAddTopic: false,
      isTitleDisabled: true,
      istextareaDisabled: true,
      addTopicList: {
        question: "",
        A: "",
        B: "",
        C: "",
        D: "",
        rightOptions: [],
        edit: true, //用来判断是否可以编辑
        edt: false, //用来判断是否点击修改图标
        editIcon: false //用来判断是否展示侧边栏图标
      },
      radio: "",
      randomCityList: [], //抽查地点
      subofficeList: [], //房屋所属分局
      policeList: [], //房屋所属派出所
      rules: {}
    };
  },
  created() {},
  mounted() {
    this.setCreated();
    this.getDetailList();
  },
  methods: {
    //新增考题
    addTopic() {
      let vm = this;
      let list = {};
      let addlist = {
        question: vm.addTopicList.question,
        options:
          vm.addTopicList.A +
          "&GXCF&" +
          vm.addTopicList.B +
          "&GXCF&" +
          vm.addTopicList.C +
          "&GXCF&" +
          vm.addTopicList.D,
        rightOptions: vm.addTopicList.rightOptions
          .sort((a, b) => {
            return a - b;
          })
          .join("|"),
        warehouseId: vm.ruleForm.data.id
      };
      list.question = vm.addTopicList.question;
      list.A = vm.addTopicList.A;
      list.B = vm.addTopicList.B;
      list.C = vm.addTopicList.C;
      list.D = vm.addTopicList.D;
      list.rightOptions = vm.addTopicList.rightOptions;
      list.edit = vm.addTopicList.edit;
      list.editIcon = vm.addTopicList.editIcon;
      this.ruleForm.list.unshift(list);
      if (!vm.ruleForm.data.id) {
        vm.addExam().then(res => {
          //这里可以执行下一步操作
          addlist.warehouseId = res.id;
          vm.addExamToWarehouse(addlist);
        });
      } else {
        vm.addExamToWarehouse(addlist);
        if (vm.isEditData) {
          vm.updExam();
          vm.isEditData = false;
        }
      }
    },
    //修改考题
    edtTopic(index) {
      this.ruleForm.list[index].edit = false;
      this.ruleForm.list[index].edt = true;
    },
    //上移考题
    upTopic(index) {
      let arr = this.ruleForm.list;
      if (arr.length > 1 && index !== 0) {
        let arr1 = arr[index];
        let arr2 = arr[index - 1];
        this.ruleForm.list.splice(index, 1, arr2);
        this.ruleForm.list.splice(index - 1, 1, arr1);
      }
    },
    //下移考题
    downTopic(index) {
      let arr = this.ruleForm.list;
      if (arr.length > 1 && index !== arr.length - 1) {
        let arr1 = arr[index];
        let arr2 = arr[index + 1];
        this.ruleForm.list.splice(index, 1, arr2);
        this.ruleForm.list.splice(index + 1, 1, arr1);
      }
    },
    //删除考题
    delTopic(index) {
      this.ruleForm.list.splice(index, 1);
    },
    //重置新增试题
    addTopicS() {
      this.isAddTopic = true;
      for (let x in this.addTopicList) {
        this.addTopicList[x] = "";
      }
      this.addTopicList.rightOptions = [];
    },
    // 获取题库详情
    getDetailList: function() {
      this.ruleForm.data.id = this.userInfo.id;
      if (!this.userInfo.id) {
        return false;
      }
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/getExamWarehouseInfo",
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
              rightOptions: data.list[i].rightOptions.split("|"),
              edit: true, //用来判断是否可以编辑
              edt: false, //用来判断是否点击修改图标
              editIcon: false //用来判断是否展示侧边栏图标
            };
            vm.ruleForm.list.unshift(tm);
          }
        },
        error: function(err) {}
      });
    },
    // 新增题库
    addExam: function() {
      var defer = $.Deferred();
      var vm = this;
      return new Promise((resolve, reject) => {
        $.ajax({
          url: fjPublic.ajaxUrlDNN + "/addExamWarehouse",
          type: "POST",
          data: {
            title: vm.ruleForm.data.title,
            type: vm.ruleForm.data.type,
            content: vm.ruleForm.data.content,
            createUserid: $.parseJSON(fjPublic.getLocalData("userInfo")).userId,
            createUsername: $.parseJSON(fjPublic.getLocalData("userInfo"))
              .userName,
            // state:状态，0启用，1停用，-1删除，默认1
            state: "",
            examPeople: vm.ruleForm.data.examPeople
          },
          dataType: "json",
          success: function(data) {
            vm.ruleForm.data.id = data.id;
            resolve(data);
          },
          error: function(err) {}
        });
      });
    },
    // 更新题库
    updExam: function() {
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/updExamWarehouse",
        type: "POST",
        data: {
          id: vm.ruleForm.data.id,
          title: vm.ruleForm.data.title,
          type: vm.ruleForm.data.type,
          content: vm.ruleForm.data.content,
          examPeople: vm.ruleForm.data.examPeople
        },
        dataType: "json",
        success: function(data) {
          // console.log(data);
        },
        error: function(err) {}
      });
    },
    // 添加试题到题库
    addExamToWarehouse: function(list) {
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/addExamToWarehouse",
        type: "POST",
        data: list,
        dataType: "json",
        success: function(data) {
          // console.log(data);
        },
        error: function(err) {}
      });
      vm.addTopicS();
      vm.isAddTopic = false;
    },
    setCreated() {
      this.userInfo = this.$route.query;
    }
  },
  watch: {
    // $route: {
    //   handler(route) {
    //     // this.setCreated();
    //     // this.getDetailList();
    //   }
    // }
    "ruleForm.data": {
      //监控题库是否修改，修改触发更新，在点击提交试题的时候
      handler(val) {
        // console.log(val);
        this.isEditData = true;
      },
      deep: true
    }
  },
  components: {
    fjBreadNav
  }
};
</script>
<style scope lang="less">
.exam-questions {
  .fj-block.content {
    padding: 10px 180px;
  }
  .fj-block-head {
    border-bottom: 0px;
    .el-input {
      width: 100%;
    }
    input {
      height: 50px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(0, 0, 0, 0.14901960784313725);
      opacity: 1;
      text-align: center;
      font-size: 16px;
      font-weight: 500;
      color: rgba(0, 0, 0, 1);
      opacity: 1;
    }
    .is-disabled {
      .el-input__inner {
        background-color: #fff;
        border: none;
        cursor: pointer;
        color: rgba(0, 0, 0, 1);
      }
      .el-textarea__inner {
        background-color: #fff;
        border: none;
        cursor: pointer;
        color: rgba(0, 0, 0, 1);
      }
    }
  }
  .fj-block-body {
    margin-top: 10px;
    .body-header {
      text-align: center;
      .is-disabled {
        .el-textarea__inner {
          background-color: #fff;
          border: none;
          cursor: pointer;
          color: rgba(0, 0, 0, 1);
        }
      }
      .search-item {
        display: inline-block;
      }
      .search-item:first-child {
        margin-right: 100px;
      }
      .el-textarea {
        margin-top: 20px;
      }
      .add-list-btn {
        margin-top: 26px;
        height: 32px;
        text-align: center;
        line-height: 32px;
        color: #1890ff;
        border: 1px dashed #3aa0ff;
        cursor: pointer;
      }
    }
    .body-body {
      ul {
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.85);
        .el-radio__label {
          display: none;
        }
        .add-topic {
          .el-checkbox-group {
            position: absolute;
            margin-left: 524px;
            margin-top: 26px;
            width: 20px;
            .el-checkbox {
              margin-top: 29px;
              margin-left: 0;
            }
            .el-checkbox__label {
              display: none;
            }
          }
          .topic {
            margin: 15px 0;
            input {
              width: 680px;
            }
          }
          li {
            margin: 15px 20px 0;
            .el-input {
              width: 480px;
            }
            .add-topic-btn {
              display: inline-block;
              margin-left: 50px;
            }
          }
        }
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
              margin-top: 20px;
              margin-left: 17px;
              cursor: pointer;
            }
          }
          .el-radio {
            margin-right: 4px;
          }
          .el-input.is-disabled .el-input__inner {
            background-color: #fff;
            border-color: #fff;
            color: rgba(0, 0, 0, 0.85);
            cursor: auto;
          }
          .el-checkbox__input.is-disabled .el-checkbox__inner {
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
        // .revise-topic {
        //   .topic {
        //     margin: 15px 0;
        //     input {
        //       width: 680px;
        //     }
        //   }
        //   li {
        //     margin: 15px 20px 0;
        //     .el-input {
        //       width: 480px;
        //     }
        //   }
        // }
      }
    }
  }
}
@media screen and (min-width: 1920px) {
  /* .fj-content_view.YBSS .el-form .el-form-item__content .el-select {width:60%;} */
}
</style>

