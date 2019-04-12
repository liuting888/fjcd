<template>
  <div class="fj-content_view work-mis">
    <div class="fj-block title">
      <fj-breadNav :bread-data="breadData"></fj-breadNav>
    </div>
    <div class="fj-block content">
      <div class="fj-block-head kaohe">
        <p class="title fj-fl">资料列表</p>
      </div>
      <div class="fj-block-body">
        <ul class="filterOpe-area">
          <li class="area-line fj-clear">
            <div class="item fj-fl">
              <span class="fj-fl title">资料类型：</span>
              <el-select @change="changeMissState" clearable v-model="searchForm.type" class="fj-fl">
                <el-option v-for="item in missionStates" :key="item.id" :label="item.value" :value="item.id">
                </el-option>
              </el-select>
            </div>
            <div class="item fj-fl">
              <el-input class="fj-fl search" v-model="searchForm.title" clearable placeholder="请输入标题">
                <template slot="append">
                  <div @click="searchMissionListByCnd">搜索</div>
                </template>
              </el-input>
            </div>
            <!-- <div class="item fj-fl">
              <el-button type="primary"><i class="el-icon-search"></i><span>查询</span></el-button>
            </div> -->
            <div class="item fj-fl">
              <el-button type="primary" @click="openAddOrDetailDialog()"><i class="el-icon-upload2"></i><span>上传资料</span></el-button>
            </div>
          </li>
        </ul>
        <el-table :data="misData">
           <el-table-column width="40"></el-table-column>
          <el-table-column prop="title" label="资料标题" class-name="left" width="350" show-overflow-tooltip>
            <template slot-scope="scope">
              <a class="ope-txt" :href="ImgUrl+scope.row.repType+'&fileLink='+scope.row.repLink+'&t='+Math.random()+'&id='+scope.row.repId"
                target="_blank">{{scope.row.title}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="typeName" label="资料类型"></el-table-column>
          <el-table-column prop="fileSize" label="文件大小（MB）" show-overflow-tooltip></el-table-column>
          <el-table-column prop="uploadPerson" label="上传人"></el-table-column>
          <el-table-column prop="publishDate" label="颁布日期"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span
                class="ope-txt"
                @click="deleteRep(scope.row)"
              >删除</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="mj-page_wrap" v-if="Number(total) >Number(pageSize)">
          <el-pagination :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next, jumper"
            :total="total" @current-change="currentPageChange" @prev-click="prevPageChange" @next-click="nextPageChange"
            @size-change="sizePageChange">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 添加、详情弹出框 -->
    <el-dialog title="上传资料" :close-on-click-modal="false" :visible.sync="dialogVisible" :modal-append-to-body="dialogVisibleModal" width="500px"
      @close="clearF">
      <el-form :model="dialogForm" :rules="rules" ref="dialogForm">
        <el-form-item label="资料标题" :label-width="formLabelWidth" prop="title">
          <el-input v-model="dialogForm.title"></el-input>
        </el-form-item>
        <el-form-item label="资料类型" :label-width="formLabelWidth" prop="type">
          <el-select clearable v-model="dialogForm.type" class="fff-j">
            <el-option v-for="item in missionStates" :key="item.id" :label="item.value" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="来源" :label-width="formLabelWidth" prop="source">
          <el-input v-model="dialogForm.source"></el-input>
        </el-form-item>
        <el-form-item label="文件上传" :label-width="formLabelWidth">
          <el-upload class="upload-demo" :limit="1" ref="uploadfile" :on-change="handleChange" action="1" :on-remove="onRemove"
            :auto-upload="false">
            <el-button size="small" type="primary">选择文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-show="hiddenButton">
        <el-button @click="clearF">取 消</el-button>
        <el-button type="primary" @click="saveMission('dialogForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import fjBreadNav from "@/components/fjBreadNav";
  export default {
    name: "fjWorkManageMis",
    data: function () {
      return {
        breadData: [{
            name: "当前位置:",
            path: ""
          },
          {
            name: "教培管理",
            path: ""
          },
          {
            name: "业务知识库",
            path: ""
          }
        ],
        ImgUrl: fjPublic.ajaxUrlDNN + '/getResourceFile?type=',
        // 资料类型
        missionStates: [],
        // 列表查询参数
        searchForm: {
          type: "", // 资料类型
          title: "", // 标题

        },
        form: new FormData(),
        // 列表数据
        misData: [],
        // 分页数据
        currentPage: 1,
        pageSize: 10,
        total: 0,
        // 弹出框数据
        dialogVisible: false,
        dialogVisibleModal: false,
        dialogForm: {
          type: "",
          title: "",
          source: '',
          upfAttachFile: "",
          fileSize: ""
        },
        fileList: "",
        formLabelWidth: "120px",
        hiddenButton: true, // 提交保存按钮div隐藏
        // 校验规则
        rules: {
          type: [{
            required: true, // 是否必填
            message: "类型不能为空！", //规则
            trigger: "change" //何事件触发
          }],
          title: [{
            required: true, // 是否必填
            message: "标题不能为空！", //规则
            trigger: "blur" //何事件触发
          }],
          source: [{
            required: true, // 是否必填
            message: "来源不能为空！", //规则
            trigger: "blur" //何事件触发
          }]
        }
      };
    },
    mounted: function () {
      fjPublic.closeLoad();
      // 初始化任务列表
      this.searchMissionListByCnd();
      this.getMissionStates();
      return;
    },
    beforeRouteEnter:function(to,from,next){
        next(function(vm){
            fjPublic.closeLoad();
        });
    },
    methods: {
      currentPageChange: function (pageNum) {
        // 点击某个分页按钮
        this.currentPage = pageNum;
        this.searchMissionListByCnd();
      },
      prevPageChange: function (pageNum) {
        // 点击分页的上一页
        this.currentPage = pageNum;
        this.searchMissionListByCnd();
      },
      nextPageChange: function (pageNum) {
        // 点击分页的下一页
        this.currentPage = pageNum;
        this.searchMissionListByCnd();
      },
      sizePageChange: function (pageSize) {
        // 改变每页条数时
        this.currentPage = 1;
        this.pageSize = pageSize;
        this.searchMissionListByCnd();
      },
      getMissionStates() {
        var defer = $.Deferred();
        var vm = this;
        $.ajax({
          url: fjPublic.ajaxUrlDNN + "/getSelectFromDict",
          type: "POST",
          data: {
            dictType: "TZLX",
            hasEmpty: "1"
          },
          dataType: "json",
          success: function (data) {
            vm.misData = null;
            vm.missionStates = data.dict;
            defer.resolve();
          },
          error: function (err) {
            defer.reject();
          }
        });
        return defer;
      },
      // 修改状态下拉框查询
      changeMissState: function (missionState) {
        this.searchForm["type"] = missionState;
        this.searchMissionListByCnd();
      },
      // 获取资料
      searchMissionListByCnd: function () {
        var defer = $.Deferred();
        var vm = this;
        // 参数
        this.searchForm["page"] = this.currentPage;
        this.searchForm["rows"] = this.pageSize;
        // 传入当前用户信息
        this.searchForm["nowUser"] = $.cookie(fjPublic.loginCookieKey);
        $.ajax({
          url: fjPublic.ajaxUrlDNN + "/searchRepositoryList",
          type: "POST",
          data: vm.searchForm,
          dataType: "json",
          success: function (data) {
            vm.misData = null;
            vm.misData = data.list;
            vm.total = data.total;
            defer.resolve();
          },
          error: function (err) {
            defer.reject();
          }
        });
        return defer;
      },
      openAddOrDetailDialog() {
        var vm = this;
        vm.dialogVisible = true;
      },
      handleChange(file) {
        var vm = this;
        var file1 = "",
          size1 = "";
        file1 = file.raw;
        size1 = file.size;
        vm.fileList = file1;
        vm.form.append("upfAttachFile", file1);
        vm.form.append("fileSize", size1);
      },
      deleteRep(row){
      	//console.log(row);
      	var vm = this;
				$.ajax({
          url: fjPublic.ajaxUrlDNN + "/deleteRep",
          type: "POST",
          data: {'id':row.repId,'nowUser':$.cookie(fjPublic.loginCookieKey)},
          dataType: "json",
          success: function (data) {
          		if (data.errorCode == 0) {
                vm.$message.success({
                  message: data.errorMsg
                })
              } else {
                vm.$message.error({
                  message: data.errorMsg
                })
              }
              vm.searchMissionListByCnd();
          },
          error: function (err) {
          
          }
        });
      },
      onRemove() {
        this.fileList = "";
        this.$refs.uploadfile.clearFiles();
        this.form.append("upfAttachFile", "");
        this.form.append("fileSize", "");
      },
      // 保存资料
      saveMission: function (formName) {
        if (this.fileList == "") {
          return this.$message.error({
            message: "请选择文件"
          });
        }
        this.$refs[formName].validate(valid => {
          if (valid) {
            var vm = this;
            vm.form.append("type", vm.dialogForm.type);
            vm.form.append("title", vm.dialogForm.title);
            vm.form.append("source", vm.dialogForm.source);
            vm.form.append("nowUser", $.cookie(fjPublic.loginCookieKey));
            vm.$http.post(
              fjPublic.ajaxUrlDNN + "/uploadPeixun",
              vm.form, {
                headers: {
                  "Content-Type": "multipart/form-data"
                }
              }
            ).then(res => {
              var res = res.body;
              vm.dialogVisible = false;
              vm.searchMissionListByCnd();
              if (res.errorCode == 0) {
                vm.$message.success({
                  message: res.errorMsg
                })
              } else {
                vm.$message.error({
                  message: res.errorMsg
                })
              }
            }).catch(res => {
              console.log(res)
            })
          } else {
            this.$message({
              message: "请完善输入框！",
              type: "warning"
            });
            return false;
          }
        });
      },
      clearF() {
        this.form = new FormData();
        this.dialogVisible = false;
        this.$refs.uploadfile.clearFiles();
        this.$refs.dialogForm.resetFields();
      }
    },
    components: {
      fjBreadNav
    }
  };

</script>
<style scope>
  /* .v-modal {
    position: relative !important;
  } */

  .el-dialog__footer {
    text-align: center;
  }

  .fj-content_view .mj-page_wrap .el-pagination {
    text-align: right !important;
  }

  .el-input-group__append {
    background: #1890FF;
    border: 1px solid #1890FF;
    color: #fff;
    cursor: pointer;
  }

  .fff-j {
    width: 240px;
  }

  .fj-content_view .el-table th.left,
  .fj-content_view .el-table td.left {
    text-align: left;
  }

</style>
