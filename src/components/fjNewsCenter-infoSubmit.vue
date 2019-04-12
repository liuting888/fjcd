<template>
  <div class="fj-content_view work-mis">
    <div class="fj-block title">
      <fj-breadNav :bread-data="breadData"></fj-breadNav>
    </div>
    <div class="fj-block content">
      <div class="fj-block-head kaohe">
        <p class="title fj-fl">信息报送列表</p>
      </div>
      <div class="fj-block-body">

        <ul class="filterOpe-area">
          <li class="area-line fj-clear">
            <div class="item fj-fl">
              <el-input class="fj-fl search" v-model="searchForm.keyword" @keyup.enter="searchInfoSubmit" clearable
                placeholder="请输入标题">
                <template slot="append">
                  <div @click="searchInfoSubmit">搜索</div>
                </template>
              </el-input>
            </div>
          </li>
        </ul>
        <p class="add-rule" @click="openAddOrDetailDialog()">
          <i class="el-icon-circle-plus"></i><span>添加报送</span>
        </p>
        <el-table :data="infoSubmitData">
          <el-table-column width="100"></el-table-column>
          <el-table-column prop="title" label="标题" class-name="left" width="200">
            <template slot-scope="scope">
              <span class="ope-txt" @click="openDetailDialog(scope.row)">{{scope.row.title}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="endtime" label="截止时间"></el-table-column>
          <el-table-column prop="addusername" label="发布人"></el-table-column>
          <el-table-column label="上报情况">
            <template slot-scope="scope">
              <span v-if="scope.row.submit_flag == 0">上报情况</span>
              <span class="ope-txt" v-if="scope.row.submit_flag != 0" @click="openSubmitDialog(scope.row.infosubmitid)">上报情况</span>
            </template>
          </el-table-column>
          <el-table-column label="打包下载">
            <template slot-scope="scope">
              <span class="ope-txt" v-if="scope.row.submit_flag == 0" style="color:gray;">打包下载</span>
              <a v-if="scope.row.submit_flag != 0" :href="ajaxUrlDNN + '/downloadInfoSubmitLog?infoid=' + scope.row.infosubmitid"
                class="ope-txt">
                打包下载
              </a>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span class="ope-txt" @click="openAddOrDetailDialog(scope.row)">编辑</span>
              <span class="ope-txt" @click="isDeleteInfoSubmit(scope.row.infosubmitid)">删除</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="mj-page_wrap" v-if="Number(total) > Number(pageSize)">
          <el-pagination :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total"
            @current-change="currentPageChange" @prev-click="prevPageChange" @next-click="nextPageChange" @size-change="sizePageChange">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 详情弹出框 -->
    <el-dialog :title="detailDialogTitle" @close="clearF('detailDialogForm')" :visible.sync="detailDialogVisible"
      :modal-append-to-body="detailDialogVisibleModal" style="position: absolute">
      <el-form :model="detailDialogForm" :rules="detailRules" ref="detailDialogForm">
        <el-form-item label="所属单位名称" :label-width="formLabelWidth" prop="send_deptname">
          <el-input autocomplete="off" readonly v-model="detailDialogForm.send_deptname"></el-input>
        </el-form-item>
        <el-form-item label="报送任务标题" :label-width="formLabelWidth" prop="title">
          <el-input autocomplete="off" readonly v-model="detailDialogForm.title"></el-input>
        </el-form-item>
        <el-form-item label="报送任务要求" :label-width="formLabelWidth" prop="demand">
          <el-input type="textarea" :rows="3" autocomplete="off" readonly v-model="detailDialogForm.demand"></el-input>
        </el-form-item>
        <el-form-item label="截止时间" :label-width="formLabelWidth" prop="endtime">
          <el-date-picker readonly v-model="detailDialogForm.endtime" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="报送说明" :label-width="formLabelWidth" prop="infocontent">
          <el-input type="textarea" :rows="5" autocomplete="off" v-model="detailDialogForm.infocontent"></el-input>
        </el-form-item>
        <el-form-item label="报送材料" :label-width="formLabelWidth" prop="fileList">
          <el-upload class="upload-demo" ref="uploadfile" multiple :limit="3" :on-exceed="handleExceed" :on-change="handleChange"
            action="1" :on-remove="onRemove" :auto-upload="false">
            <el-button size="small" type="primary">选择文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="canclick" @click="uploadInfoSubmitLog()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 上报情况弹出框 -->
    <el-dialog title="上报情况" :visible.sync="submitDialogVisible" :modal-append-to-body="submitDialogVisibleModal" style="position: absolute">
      <el-table :data="submitList" class="transtion">
        <el-table-column prop="subdeptid" label="上报单位"></el-table-column>
        <el-table-column prop="subuserid" label="上报人"></el-table-column>
        <el-table-column prop="infocontent" label="报送说明"></el-table-column>
        <el-table-column prop="inserttime" label="上报时间"></el-table-column>
        <el-table-column label="报送材料" width='200'>
          <template slot-scope="scope">
            <span>{{scope.row.infoname1+','+scope.row.infoname2+','+scope.row.infoname3}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 添加、修改弹出框 -->
    <el-dialog :title="dialogTitle" width="500px" :visible.sync="dialogVisible" @close="clearF('dialogForm')"
      :modal-append-to-body="dialogVisibleModal" style="position: absolute">
      <el-form :model="dialogForm" :rules="rules" ref="dialogForm">
        <el-form-item label="报送任务标题" :label-width="formLabelWidth" prop="title">
          <el-input autocomplete="off" :readonly="isReadonly" v-model="dialogForm.title"></el-input>
        </el-form-item>
        <el-form-item label="报送任务要求" :label-width="formLabelWidth" prop="demand">
          <el-input autocomplete="off" type="textarea" :rows="5" :readonly="isReadonly" v-model="dialogForm.demand"></el-input>
        </el-form-item>
        <el-form-item label="截止时间" :readonly="isReadonly" :label-width="formLabelWidth" prop="endtime">
          <el-date-picker v-model="dialogForm.endtime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="责任单位" :label-width="formLabelWidth" prop="submit_deptname">
          <treeselect @input="upDeptname" valueFormat="object" :appendToBody="false" :disabled="chooseButtonDisabled"
            :limit="8" value-consists-of="LEAF_PRIORITY" v-model="submit_deptname" :multiple="false" :options="chooseForm.data" />
          <!-- <el-input autocomplete="off" :readonly="isReadonly" placeholder="请选择责任单位" v-model="dialogForm.submit_deptname"></el-input>
          <el-button type="primary" @click="openChooseDialog" :disabled="chooseButtonDisabled">选择</el-button> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-show="hiddenButton">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="canclick" @click="addOrUpdateInfoSubmit()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 选择报送单位 -->
    <!-- <el-dialog class="el-dialog-roll" title="选择单位" :visible.sync="chooseDialogVisible" :modal-append-to-body="chooseDialogVisibleModal"
      style="position: absolute">
      <el-form :model="chooseForm" ref="chooseForm">
        <el-form-item :label-width="formLabelWidth">
          <el-input placeholder="输入关键字进行过滤" v-model="filterText">
          </el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-tree :data="chooseForm.data" @check-change="handleClick" show-checkbox :default-expand-all="isExpandAll"
            node-key="id" ref="tree" accordion highlight-current class="filter-tree" :filter-node-method="filterNode"
            :props="defaultProps">
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="chooseDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="chooseDialogVisible = false">确 定</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>
<script>
  import fjBreadNav from '@/components/fjBreadNav';
  // import the component
  import Treeselect from '@riophae/vue-treeselect'
  // import the styles
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  export default {
    name: 'infoS',
    data: function () {
      return {
        breadData: [{
            name: '当前位置:',
            path: ''
          },
          {
            name: '新闻中心',
            path: ''
          },
          {
            name: '信息报送',
            path: ''
          }
        ],
        ajaxUrlDNN: fjPublic.ajaxUrlDNN,
        nowUser: $.cookie(fjPublic.loginCookieKey),
        // 列表查询参数
        searchForm: {
          keyword: '', // 标题
        },
        isReadonly: false,
        hiddenButton: true,
        form: new FormData(),
        submit_deptname: null,
        chooseButtonDisabled: false,
        // 列表数据
        infoSubmitData: [],
        // 分页数据
        currentPage: 1,
        pageSize: 10,
        total: 0,
        // 上报情况列表
        canclick: false,
        submitList: null,
        submitDialogVisible: false,
        submitDialogVisibleModal: false,
        submitDialogTitle: '添加报送任务',
        // 弹出框数据
        dialogVisible: false,
        dialogVisibleModal: false,
        dialogTitle: '添加报送任务',
        // 添加修改表单
        dialogForm: {
          title: "",
          demand: "",
          endtime: "",
          submit_deptid: "",
          submit_deptname: "",
          infosubmitid: ""
        },
        formLabelWidth: '120px',
        // 弹出框数据
        detailDialogVisible: false,
        detailDialogVisibleModal: false,
        detailDialogTitle: '添加报送',
        // 详情表单
        detailDialogForm: {
          infosubmitid: "",
          subdeptid: "",
          subuserid: "",
          infocontent: "",
          infofile1: "",
          infofile2: "",
          infofile3: "",
          fileList: []
        },
        // 树形选择框数据
        chooseDialogVisible: false,
        chooseDialogVisibleModal: false,
        filterText: '',
        chooseForm: {
          data: null
        },
        isExpandAll: false,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        // 表单校验规则
        // 校验规则
        rules: {
          title: [{
            required: true, // 是否必填
            message: '报送任务标题不能为空！', //规则
            trigger: 'blur' //何事件触发
          }],
          demand: [{
            required: true, // 是否必填
            message: '报送任务要求不能为空！', //规则
            trigger: 'blur' //何事件触发
          }],
          endtime: [{
            required: true, // 是否必填
            message: '截止日期不能为空！', //规则
            trigger: 'blur' //何事件触发
          }],
          submit_deptname: [{
            required: true, // 是否必填
            message: '责任单位不能为空！', //规则
            trigger: 'blur' //何事件触发
          }]
        },
        fileList: "",
        // 校验规则
        detailRules: {
          infocontent: [{
            required: true, // 是否必填
            message: '报送说明不能为空！', //规则
            trigger: 'blur' //何事件触发
          }]
        }
      };
    },
    mounted: function () {
      fjPublic.closeLoad();
      // 初始化报送列表
      this.queryInfoSubmitByPage();
      this.openChooseDialog();
      return;
    },
    beforeRouteEnter:function(to,from,next){
        next(function(vm){
            fjPublic.closeLoad();
        });
    },
    methods: {
      currentPageChange: function (pageNum) { // 点击某个分页按钮
        this.currentPage = pageNum;
        this.queryInfoSubmitByPage();
      },
      prevPageChange: function (pageNum) { // 点击分页的上一页
        this.currentPage = pageNum;
        this.queryInfoSubmitByPage();
      },
      nextPageChange: function (pageNum) { // 点击分页的下一页
        this.currentPage = pageNum;
        this.queryInfoSubmitByPage();
      },
      sizePageChange: function (pageSize) { // 改变每页条数时
        this.currentPage = 1;
        this.pageSize = pageSize;
        this.queryInfoSubmitByPage();
      },
      // 标题或负责人名称查询
      searchInfoSubmit: function () {
        this.queryInfoSubmitByPage();
      },
      // 获取报送列表
      queryInfoSubmitByPage: function () {
        var defer = $.Deferred();
        var vm = this;
        // 参数
        this.searchForm['page'] = this.currentPage;
        this.searchForm['rows'] = this.pageSize;
        // 传入当前用户信息
        this.searchForm['nowUser'] = $.cookie(fjPublic.loginCookieKey);
        $.ajax({
          url: fjPublic.ajaxUrlDNN + '/queryInfoSubmitByPage',
          type: 'POST',
          data: vm.searchForm,
          dataType: 'json',
          success: function (data) {
            vm.infoSubmitData = null;
            vm.infoSubmitData = data.rows;
            vm.total = data.total;
            _.each(vm.infoSubmitData, function (item, i) {
              vm.$set(item, 'rank', i + 1);
            });
            defer.resolve();
          },
          error: function (err) {
            defer.reject();
          }
        });
        return defer;
      },
      // 是否删除
      isDeleteInfoSubmit: function (id) {
        this.$confirm('此操作将删除该纪录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.deleteInfoSumbit(id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 删除任务
      deleteInfoSumbit: function (id) {
        var defer = $.Deferred();
        var vm = this;
        $.ajax({
          url: fjPublic.ajaxUrlDNN + '/deleteInfosubmitById',
          type: 'POST',
          data: {
            id: id
          },
          dataType: 'json',
          success: function (data) {
            if (data.errorCode == 0) {
              vm.queryInfoSubmitByPage();
            }
            vm.$message({
              type: 'info',
              message: data.errorMsg
            });
            defer.resolve();
          },
          error: function (err) {
            defer.reject();
          }
        });
      },
      // 打开选择人员弹出框
      openSubmitDialog: function (infoSubmitId) {
        var defer = $.Deferred();
        var vm = this;
        // 初始化下拉列表
        $.ajax({
          url: fjPublic.ajaxUrlDNN + '/queryLogByInfoid',
          type: 'POST',
          data: {
            infoid: infoSubmitId
          },
          dataType: 'json',
          success: function (data) {
            data.list.forEach(el => {
              el.inserttime = fjPublic.dateStrFormat(el.inserttime)
            })
            vm.submitList = data.list;
            defer.resolve();
          },
          error: function (err) {
            defer.reject();
          }
        });
        this.submitDialogVisible = true;
      },
      // 打开选择人员弹出框
      openChooseDialog: function () {
        var defer = $.Deferred();
        var vm = this;
        // 初始化下拉列表
        $.ajax({
          url: fjPublic.ajaxUrlDNN + '/getTreeDeptData',
          type: 'POST',
          data: {
            type: 0
          },
          dataType: 'json',
          success: function (data) {
            vm.chooseForm.data = data;
            defer.resolve();
          },
          error: function (err) {
            defer.reject();
          }
        });
      },
      // 打开添加或修改弹出框
      openAddOrDetailDialog: function (infoSubmit) {
        var vm = this;
        // 修改
        if (infoSubmit) {
          vm.dialogForm.title = infoSubmit.title;
          vm.dialogForm.demand = infoSubmit.demand;
          vm.dialogForm.endtime = infoSubmit.endtime;
          vm.dialogForm.submit_deptid = infoSubmit.submit_deptid;
          vm.dialogForm.submit_deptname = infoSubmit.submit_deptname;
          vm.dialogForm.infosubmitid = infoSubmit.infosubmitid;
        } else {
          vm.dialogForm.title = '';
          vm.dialogForm.demand = '';
          vm.dialogForm.endtime = '';
          vm.dialogForm.submit_deptid = '';
          vm.dialogForm.submit_deptname = '';
          vm.dialogForm.infosubmitid = '';
        }
        // 显示弹出框
        vm.dialogVisible = true;
      },
      // 打开详情弹出框
      openDetailDialog: function (infoSubmit) {
        var vm = this;
        // 修改
        if (infoSubmit) {
          vm.detailDialogForm.title = infoSubmit.title;
          vm.detailDialogForm.demand = infoSubmit.demand;
          vm.detailDialogForm.endtime = infoSubmit.endtime;
          vm.detailDialogForm.send_deptname = infoSubmit.send_deptname;
          vm.detailDialogForm.infosubmitid = infoSubmit.infosubmitid;
        } else {
          vm.detailDialogForm.title = '';
          vm.detailDialogForm.demand = '';
          vm.detailDialogForm.endtime = '';
          vm.detailDialogForm.send_deptname = '';
          vm.detailDialogForm.infosubmitid = '';
        }
        // 显示弹出框
        vm.detailDialogVisible = true;
      },
      // 添加和修改
      addOrUpdateInfoSubmit: function () {
        var defer = $.Deferred();
        var vm = this;
        // 传入当前用户信息
        vm.dialogForm['nowUser'] = $.cookie(fjPublic.loginCookieKey);
        vm.canclick = true;
        $.ajax({
          url: fjPublic.ajaxUrlDNN + '/insertInfoSubmit',
          type: 'POST',
          data: vm.dialogForm,
          dataType: 'json',
          success: function (data) {
            if (data.errorCode == 0) {
              vm.dialogVisible = false;
              vm.canclick = false;
              vm.queryInfoSubmitByPage();
            }
            vm.$message({
              type: 'info',
              message: data.errorMsg
            });
            defer.resolve();
          },
          error: function (err) {
            defer.reject();
          }
        });
      },
      // 文件上传
      onRemove(file, list) {
        var vm = this;
        this.fileList.forEach((v, i) => {
          if (v == file.response) {
            vm.fileList.splice(i, 1);
          }
        })
      },
      handleChange(file, list) {
        var vm = this;
        vm.fileList = list;
      },
      handleExceed(files, fileList) {
        this.$message.warning('当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件');
      },
      uploadInfoSubmitLog: function () {
        var defer = $.Deferred();
        var vm = this;
        if (vm.fileList == '') {
          return vm.$message.error({
            message: '请上传报送资料'
          })
        }
        // 传入当前用户信息
        this.$refs['detailDialogForm'].validate(valid => {
          if (valid) {
            vm.canclick = true;
            vm.form.append('nowUser', $.cookie(fjPublic.loginCookieKey));
            vm.form.append('infosubmitid', vm.detailDialogForm.infosubmitid);
            vm.form.append('infocontent', vm.detailDialogForm.infocontent);
            vm.fileList.forEach((el, index) => {
              vm.form.append('infofile' + index, el.raw);
            })

            vm.$http.post(
              fjPublic.ajaxUrlDNN + '/uploadInfoSubmitLog',
              vm.form, {
                headers: {
                  "Content-Type": "multipart/form-data"
                }
              }).then(res => {
              var res = res.body;
              vm.canclick = false;
              if (res.errorCode == 0) {
                vm.$message.success({
                  message: res.errorMsg
                })
              } else {
                vm.$message.error({
                  message: res.errorMsg
                })
              }
              vm.detailDialogVisible = false;
              vm.queryInfoSubmitByPage();
            })
          }
        })
      },
      upDeptname() {
        this.dialogForm.submit_deptname = this.submit_deptname.label;
        this.dialogForm.submit_deptid = this.submit_deptname.id;
      },
      clearF(Dname) {
        this.form = new FormData();
        if (this.$refs['uploadfile']) this.$refs['uploadfile'].clearFiles();
        this.$refs[Dname].resetFields();
      }
    },
    components: {
      fjBreadNav,
      Treeselect
    }
  }
</script>
<style scope>
  /* .v-modal {
    position: relative !important;
  } */
  .re-ope {
    background: transparent;
    border: none;
    outline: none;
  }

  .transtion.el-table .cell {
    box-sizing: border-box !important;
    white-space: nowrap !important;
    line-height: 23px !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }

  .el-input-group__append {
    background: #3a8ee6 !important;
    border: 1px solid #3a8ee6 !important;
    color: #fff !important;
    cursor: pointer !important;
  }

  .fj-content_view.work-mis .add-rule {
    height: 32px;
    margin: 16px 0px;
    line-height: 30px;
    border: 1px dashed rgba(217, 217, 217, 1);
    text-align: center;
    cursor: pointer;
  }

  .fj-content_view.work-mis .add-rule>.el-icon-circle-plus {
    margin-right: 10px;
  }

  .fj-content_view.work-mis .el-input {
    width: 240px !important;
  }

  .vue-treeselect {
    line-height: initial;
    width: 240px;
  }

  .fj-content_view .el-table th.left,
  .fj-content_view .el-table td.left {
    text-align: left;
  }
</style>
