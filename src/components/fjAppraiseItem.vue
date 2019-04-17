<template>
  <div class="fj-content_view work-mis workLog">
    <div class="fj-block title">
      <fj-breadNav :bread-data="breadData"></fj-breadNav>
    </div>
    <div class="fj-block content">
      <div class="fj-block-head kaohe">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="辅警考核项配置" name="0">
          </el-tab-pane>
          <el-tab-pane label="地区考核项配置" name="1">
          </el-tab-pane>
          <el-tab-pane label="单位考核项配置" name="2">
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="fj-block-body">
        <el-form inline label-width="150px" label-position="left">
          <el-col class="time-item">
            <el-form-item :label="'考核项总分：' + policeAppraiseItems.allScore">
            </el-form-item>
          </el-col>
        </el-form>
        <el-form inline label-width="120px" label-position="left">
          <el-col class="time-item">
            <el-form-item label="当月启用考核项">
            </el-form-item>
          </el-col>
        </el-form>
        <el-table :data="policeAppraiseItems.nowMonth" class="el-tables">
          <el-table-column prop="name" label="考核项"></el-table-column>
          <el-table-column prop="score" label="考核分值"></el-table-column>
          <el-table-column label="考核项类型">
            <template slot-scope="scope">
              <p>{{scope.row.itemType | getAppraiseItemType}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="添加人员"></el-table-column>
          <el-table-column label="添加时间">
            <template slot-scope="scope">
              <p>{{scope.row.insTime | getFormatInsTime}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="infoTypeNames" show-overflow-tooltip label="台账类型"></el-table-column>
          <el-table-column prop="infoScore" label="单位分值(分/条)"></el-table-column>
        </el-table>
        <el-form inline label-width="150px" label-position="left">
          <el-col class="time-item">
            <el-form-item label="下月待启用考核项">
            </el-form-item>
            <el-form-item>
              <el-button @click="openDialog(null)">添加</el-button>
              <el-button @click="copyAppraiseItems">同步当月考核项及规则</el-button>
            </el-form-item>
          </el-col>
        </el-form>
        <el-table :data="policeAppraiseItems.preMonth" class="el-tables">
          <el-table-column prop="name" label="考核项"></el-table-column>
          <el-table-column prop="score" label="考核分值"></el-table-column>
          <el-table-column label="考核项类型">
            <template slot-scope="scope">
              <p>{{scope.row.itemType | getAppraiseItemType}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="添加人员"></el-table-column>
          <el-table-column label="添加时间">
            <template slot-scope="scope">
              <p>{{scope.row.insTime | getFormatInsTime}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="infoTypeNames" show-overflow-tooltip label="台账类型"></el-table-column>
          <el-table-column prop="infoScore" label="单位分值(分/条)"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span class="ope-txt" @click="openDialog(scope.row)">修改</span>
              <span class="ope-txt" @click="isDeleteItem(scope.row.id)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :close-on-click-modal="false" width="500px" center :title="dialogTitle" :append-to-body = true
               style="position: absolute" :visible.sync="dialogFormVisible" @close="closeDialog">
      <el-form :model="dialogForm" :rules="rules" ref="dialogForm">
        <el-form-item label="考核项名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="dialogForm.name" placeholder="请选择考核项名称" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="考核项分值" prop="score" :label-width="formLabelWidth">
          <el-input-number v-model="dialogForm.score" :precision="0" :step="5" :min="10" :max="100"></el-input-number>
          <el-tooltip class="item" effect="dark" :content="elNumberNotice" placement="right">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="考核项类型" prop="itemType" :label-width="formLabelWidth">
          <el-select v-model="dialogForm.itemType" placeholder="请选择考核项类型" @change="showInfoChoose">
            <el-option
              v-for="item in (tabName == '0' ? itemTypes : itemTypes.slice(0, 1))"
              :key="item.id"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :hidden="dialogForm.itemType != 1" label="台账类型" :label-width="formLabelWidth">
          <el-select
            :disabled="infoTypeDisabled"
            v-model="dialogForm.infoTypeArray"
            multiple
            collapse-tags
            placeholder="请选择台账类型">
            <el-option
              v-for="item in infoTypess"
              :key="item.id"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :hidden="dialogForm.itemType == 0" label="单位分值" :label-width="formLabelWidth">
          <el-input-number v-model="dialogForm.infoScore" :precision="1" :step="0.1" :min="0.1" :max="100"></el-input-number>
          <el-tooltip class="item" effect="dark" :content="elNumberNotice" placement="right">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateAppraiseItem">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import fjBreadNav from "@/components/fjBreadNav";
export default {
  name: "fjWorkManageMis",
  data: function() {
    const reasonValidate = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('如需驳回，驳回理由必填'))
      } else {
        callback()
      }
    }
    return {
      breadData: [
        { name: "当前位置:", path: "" },
        { name: "系统管理", path: "" },
        { name: "考核配置", path: "" }
      ],
      itemTypes: [
        {value: '手动考核', id: '0'},
        {value: '台账考核', id: '1'},
        {value: '轨迹考核', id: '2'},
        {value: '任务考核', id: '3'}
      ],
      infoTypess: null,
      infoTypeDisabled: true,
      dialogTitle: '添加考核项',
      dialogFormVisible: false,
      rules: {
        name: [
          { required: true, message: '请输入考核项名称', trigger: 'change' }
        ],
        score: [
          { required: true, message: '请选择考核项分值', trigger: 'change' }
        ],
        itemType: [
          { required: true, message: '请选择考核项类型', trigger: 'change' }
        ],
      },
      dialogForm: {
        id: '',
        name: '',
        score: '',
        infoTypeNames: '',
        status: '', type: '', itemType: '0', month: '', userId: '', userName: '', insTime: '', updTime: '', infoTypes: '', infoScore: '', infoTypeArray: []
      },
      formLabelWidth: '120px',
      activeName: '0',
      tabName: '0',
      ajaxUrlDNN: fjPublic.ajaxUrlDNN,
      nowUser: $.cookie(fjPublic.loginCookieKey),
      elNumberNotice:'当点击“+”、“-”无法加减分时，表示已经到达设置的最大或最小值！', //扣分输入框提示
      // 分数调整
      policeScore: 0,
      stationScore: 0,
      deptScore: 0,
      // 列表数据
      policeAppraiseItems: {
        nowMonth: [],
        preMonth: [],
        allScore: 0
      }
    };
  },
  mounted: function() {
    this.getInfoTypess();
    // 初始化采集列表
    this.getAppraiseItems('0');
    return;
  },
  filters: {
    getAppraiseItemType: function (value) {
      return value == '0' ? '手动考核' : value == 1 ? '台账考核' : value == 2 ? '轨迹考核' : '任务考核';
    },
    getFormatInsTime: function (value) {
      return value.substr(0, 10);
    }
  },
  methods: {
    // 获取采集列表
    getAppraiseItems: function(type) {
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/getAppraiseItems",
        type: "POST",
        data: {
          type: vm.tabName
        },
        dataType: "json",
        success: function(data) {
          vm.policeAppraiseItems.nowMonth = null;
          vm.policeAppraiseItems.nowMonth = data.nowMonth;
          _.each(vm.policeAppraiseItems.nowMonth, function(item, i) {
            vm.$set(item, "rank", i + 1);
          });
          vm.policeAppraiseItems.preMonth = null;
          vm.policeAppraiseItems.preMonth = data.preMonth;
          _.each(vm.policeAppraiseItems.preMonth, function(item, i) {
            if(type == 0) {
              vm.policeScore += parseInt(item.score);
            }else if(type == 1){
              vm.stationScore += parseInt(item.score);
            }else {
              vm.deptScore += parseInt(item.score);
            }
            vm.$set(item, "rank", i + 1);
          });
          vm.policeAppraiseItems.allScore = data.allScore;
          defer.resolve();
        },
        error: function(err) {
          defer.reject();
        }
      });
      return defer;
    },
    copyAppraiseItems: function() {
      var vm = this;
      this.$confirm('此操作将同步当月考核项及规则, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          fjPublic.openLoad('提交中...');
        $.Deferred(function(defer){
          $.ajax({
            url: fjPublic.ajaxUrlDNN + "/copyAppraiseItems",
            type: "POST",
            data: {
              type: vm.tabName
            },
            dataType: "json",
            success: function(data) {
              if(data.errorCode == 0) {
                vm.getAppraiseItems(vm.tabName);
              }
              vm.$message({type: 'warning', message: data.errorMsg});
              defer.resolve();
            },
            error: function(err) {
              defer.reject();
            }
          });
        }).promise().then(function(){
          fjPublic.closeLoad();
          vm.$message({type:'success',message:'操作成功！'});
          vm.getAppraiseItems(vm.tabName);
        },function(){
          fjPublic.closeLoad();
          vm.$message({type:'warning',message:'操作失败！'});
        });
      }).catch(()=>{});
    },
    handleClick(tab) {
      this.tabName = tab.name;
      this.getAppraiseItems(tab.name);
    },
    openDialog: function (item) {
      // 修改
      if(item != null) {
        this.dialogTitle = '修改考核项';
        this.dialogForm.id = item.id;
        this.dialogForm.name = item.name;
        this.dialogForm.score = item.score;
        this.dialogForm.type = item.type;
        this.dialogForm.itemType = item.itemType;
        this.dialogForm.month = item.month;
        this.dialogForm.infoTypes = item.infoTypes;
        this.dialogForm.infoScore = item.infoScore;
        this.dialogForm.infoTypeNames = item.infoTypeNames;
        if(item.infoTypes) {
          this.dialogForm.infoTypeArray = item.infoTypes.split(',');
        }else {
          this.dialogForm.infoTypeArray = [];
        }
      } else {
        this.dialogTitle = '添加考核项';
        this.dialogForm.type = this.tabName;
      }
      if(this.dialogForm.itemType != '1') {
        this.infoTypeDisabled = true;
      }else {
        this.infoTypeDisabled = false;
      }
      this.dialogFormVisible = true;
    },
    getInfoTypess: function() {
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/getSelectFromDict",
        type: "POST",
        data: {
          dictType: 'INFOCOLLECT',
          hasEmpty: '1'
        },
        dataType: "json",
        success: function(data) {
          vm.infoTypess = data.dict;
          defer.resolve();
        },
        error: function(err) {
          defer.reject();
        }
      });
      return defer;
    },
    showInfoChoose: function () {
      if(this.dialogForm.itemType == '1') {
        this.infoTypeDisabled = false;
      }else {
        this.infoTypeDisabled = true;
      }
    },
    addOrUpdateAppraiseItem: function () {
      var validateBool;
      this.$refs['dialogForm'].validate(function(value){
        if(value){
          validateBool = true;
        }
      });
      if(!validateBool)return;
      var defer = $.Deferred();
      var vm = this;
      // 传入当前用户信息
      this.dialogForm["nowUser"] = $.cookie(fjPublic.loginCookieKey);
      if(this.dialogForm.itemType == '1' && this.dialogForm.infoTypeArray) {
        this.dialogForm.infoTypes = this.dialogForm.infoTypeArray.join(',');
      }
      this.dialogForm.type = this.tabName;
      if(!this.dialogForm.id) {
        $.ajax({
          url: fjPublic.ajaxUrlDNN + "/addAppraiseItem",
          type: "POST",
          data: vm.dialogForm,
          dataType: "json",
          success: function(data) {
            if (data.errorCode == 0) {
              vm.$message({
                message: '添加成功！',
                type: 'success'
              })
              vm.getAppraiseItems(vm.tabName);
              vm.closeDialog();
            } else {
              vm.$message.error(data.errorMsg)
            }
            defer.resolve();
          },
          error: function(err) {
            defer.reject();
          }
        });
        return defer;
      }else {
        $.ajax({
          url: fjPublic.ajaxUrlDNN + "/updAppraiseItem",
          type: "POST",
          data: vm.dialogForm,
          dataType: "json",
          success: function(data) {
            if (data.errorCode == 0) {
              vm.$message({
                message: '修改成功！',
                type: 'success'
              })
              vm.getAppraiseItems(vm.tabName);
              vm.closeDialog();
            } else {
              vm.$message.error(data.errorMsg)
            }
            defer.resolve();
          },
          error: function(err) {
            defer.reject();
          }
        });
        return defer;
      }
    },
    closeDialog: function () {
      this.dialogForm.id = '';
      this.dialogForm.name = '';
      this.dialogForm.score = '';
      this.dialogForm.status = '';
      this.dialogForm.type = '';
      this.dialogForm.itemType = '0';
      this.dialogForm.month = '';
      this.dialogForm.userId = '';
      this.dialogForm.userName = '';
      this.dialogForm.insTime = '';
      this.dialogForm.updTime = '';
      this.dialogForm.infoTypes = '';
      this.dialogForm.infoScore = '';
      this.dialogForm.infoTypeNames = '';
      this.dialogForm.infoTypeArray = [];
      this.dialogFormVisible = false;
    },
    // 是否删除
    isDeleteItem: function(id) {
      this.$confirm("此操作将删除该纪录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
        this.deleteItem(id);
    })
    },
    // 删除任务
    deleteItem: function(id) {
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/updAppraiseItem",
        type: "POST",
        data: {
          id: id,
          status: '1'
        },
        dataType: "json",
        success: function(data) {
          if (data.errorCode == 0) {
            vm.$message({
              message: '删除成功',
              type: 'success'
            })
            vm.getAppraiseItems(vm.tabName);
          } else {
            vm.$message.error(data.errorMsg)
          }
          defer.resolve();
        },
        error: function(err) {
          defer.reject();
        }
      });
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
.workLog {
  .fj-search-inline {
    // 上下间距
    @media screen and (max-width: 1366px){
      .el-form-item__label {
        line-height: 20px;
      }
    }
    /deep/ .el-row {
      .time-item {
        .el-form-item {
          .el-input {
            width: 350px;
          }
        }
      }
      .el-form-item {
        margin: 0;
        &:first-child {
          margin: 15px 0;
        }
         &:last-child {
          margin-bottom: 15px;
        }
        &.datepicker {
          .el-form-item__content {
            line-height: 43px;
          }
        }
        .search-input {
          width: 260px;
          .el-input-group__append {
            background-color: #1890ff;
            border-color: #1890ff;
            color: #fff;
          }
        }
      }
    }
  }
  .el-tables {
    .circle-status{
      position: relative;
      &.red {
        &::before {
          background: #F5222D;
        }
      }
      &.green {
        &::before {
          background: #52C41A;
        }
      }
      &.grey {
        &::before {
          background: #ABABAB;
        }
      }
      &::before{
        display: block;
        position: absolute;
        content: '';
        width:6px;
        height:6px;
        background:rgba(171,171,171,1);
        border-radius:50%;
        opacity:1;
        top: 5px;
        left: -9px
      }
    }
    /deep/ .textLeft {
      text-align: left;
    }
  }
  .check-dialog {
    /deep/ .el-form-item {
      textarea {
        width: 300px;
      }
    }
  }
  .detail-dialog {
    /deep/ .el-form-item {
      .el-textarea {
        textarea{
          width: 240px;
        }
      }
    }
  }
}
</style>


