<template>
  <div class="fj-content_view article">
    <div class="fj-block title">
      <fj-breadNav :bread-data="breadData"></fj-breadNav>
    </div>
    <div class="fj-block content">
      <div class="fj-block-head">
        <p class="title fj-fl">文章列表</p>
      </div>
      <div class="fj-block-body">
        <ul class="filterOpe-area wenzhang">
          <li class="area-line fj-clear">
            <div class="item fj-fl">
              <span class="fj-fl title">文章栏目：</span>
              <el-select class="fj-fl" @change="queryInfoSubmitByPage" v-model="searchForm.category" clearable
                placeholder="请选择栏目">
                <el-option v-for="item in artList" :key="item.value" :label="item.value" :value="item.id">
                </el-option>
              </el-select>
            </div>
            <div class="item fj-fl">
              <span class="fj-fl title">区县分局：</span>
              <el-select class="fj-fl" @change='getFenju' v-model="searchForm.supDeptId"
                clearable placeholder="请选择分局">
                <el-option v-for="item in chooseForm" :key="item.deptId" :label="item.deptName" :value="item.deptId">
                </el-option>
              </el-select>
            </div>
            <div class="item fj-fl">
              <span class="fj-fl title">派出所：</span>
              <el-select class="fj-fl" @change="queryInfoSubmitByPage" v-model="searchForm.sDeptId"
                clearable placeholder="请选择派出所">
                <el-option v-for="item in PList" :key="item.deptId" :label="item.deptName" :value="item.deptId">
                </el-option>
              </el-select>
            </div>
          </li>
          <li class="area-line fj-clear">
            <div class="item fj-fl">
              <!-- <el-input class="fj-fl search" @keyup.enter="queryInfoSubmitByPage" v-model="searchForm.title" clearable
                placeholder="请输入标题">
                <template slot="append">
                  <div @click="queryInfoSubmitByPage">搜索</div>
                </template>
              </el-input> -->
              <el-input class="fj-fl" @input="searchArticleByTitle" @clear="searchArticleByTitle" v-model="searchForm.title" clearable
                placeholder="请输入标题搜索文章"></el-input>
            </div>
            <div class="item fj-fl">
              <el-button type="primary" @click="publish()"><span>发布文章</span></el-button>
              <!--<el-button type="primary" @click="openAddOrDetailDialog()"><span>上传文档</span></el-button>-->
            </div>
          </li>
        </ul>
        <el-table :data="infoSubmitData">
          <el-table-column width="20"></el-table-column>
          <el-table-column prop="title" width="450" class-name="align-left" label="标题" show-overflow-tooltip>
            <template slot-scope="scope">
              <a v-if="scope.row.contype=='clob'" target="_blank" :href="ajaxUrlDNN+'/articleclob/'+scope.row.id" class="ope-txt">{{scope.row.title}}</a>
              <a v-else href="" class="ope-txt" :download="scope.row.title+'.'+scope.row.contype">{{scope.row.title}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="author" label="作者" class-name="align-left"></el-table-column>
          <el-table-column prop="adduserid" label="发布人"></el-table-column>
          <el-table-column prop="hits" label="访问量"></el-table-column>
          <el-table-column prop="category" label="文章类型">
          </el-table-column>
          <el-table-column label="发布时间" prop="updatetime" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span class="ope-txt" v-if="scope.row.contype != 'clob'" @click="openAddOrDetailDialog(scope.row)">编辑</span>
              <span class="ope-txt" v-else @click="publish(scope.row)">编辑</span>
              <span class="ope-txt" @click="isDeleteInfoSubmit(scope.row.id)">删除</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="mj-page_wrap">
          <el-pagination :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total"
            @current-change="currentPageChange" @prev-click="prevPageChange" @next-click="nextPageChange" @size-change="sizePageChange">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 上传文档-->
    <el-dialog :title="detailDialogTitle" @close="clearF('detailDialogForm')" width="500px" :visible.sync="detailDialogVisible"
      :modal-append-to-body="detailDialogVisibleModal" :close-on-click-modal="detailDialogVisibleModal" style="position: absolute">
      <el-form :model="detailDialogForm" :rules="detailRules" ref="detailDialogForm">
        <el-form-item label="栏目" :label-width="formLabelWidth" prop="fileCategory">
          <el-select v-model="detailDialogForm.fileCategory" clearable placeholder="请选择栏目">
            <el-option v-for="item in artList" :key="item.value" :label="item.value" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题" :label-width="formLabelWidth" prop="fileTitle">
          <el-input autocomplete="off" placeholder="请输入标题" v-model="detailDialogForm.fileTitle"></el-input>
        </el-form-item>
        <el-form-item label="作者" :label-width="formLabelWidth" prop="fileAuthor">
          <el-input autocomplete="off" placeholder="请输入作者" v-model="detailDialogForm.fileAuthor"></el-input>
        </el-form-item>
        <el-form-item label="来源" :label-width="formLabelWidth" prop="fileSourceUrl">
          <el-input placeholder="请输入来源" v-model="detailDialogForm.fileSourceUrl"></el-input>
        </el-form-item>
        <el-form-item label="文档" :label-width="formLabelWidth" prop="fileList">
          <el-upload class="upload-demo" ref="uploadfile" multiple :limit="3" :on-exceed="handleExceed" :on-change="handleChange"
            action="1" :on-remove="onRemove" :auto-upload="false">
            <el-button size="small" type="primary">选择文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="uploadInfoSubmitLog()">确 定</el-button>
      </div>
    </el-dialog>
    <!--写文章/详情 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="detailDialogVisibleModal" width="800px" @close="clearF('dialogForm')"
      :modal-append-to-body="dialogVisibleModal" style="position: absolute">
      <el-form :model="dialogForm" :rules="rules" ref="dialogForm">
        <el-form-item label="栏目" :label-width="formLabelWidth" prop="category">
          <el-select v-model="dialogForm.category" clearable placeholder="请选择栏目">
            <el-option v-for="item in artList" :key="item.value" :label="item.value" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题" :label-width="formLabelWidth" prop="title">
          <el-input autocomplete="off" placeholder="请输入标题" v-model="dialogForm.title"></el-input>
        </el-form-item>
        <el-form-item label="作者" :label-width="formLabelWidth" prop="author">
          <el-input autocomplete="off" placeholder="请输入作者" v-model="dialogForm.author"></el-input>
        </el-form-item>
        <el-form-item label="来源" :label-width="formLabelWidth" prop="sourceurl">
          <el-input placeholder="请输入来源" v-model="dialogForm.sourceurl"></el-input>
        </el-form-item>
        <el-form-item label="内容" :label-width="formLabelWidth" prop="conclob">
          <quill-editor ref="myeditor" v-model="dialogForm.conclob"></quill-editor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-show="hiddenButton">
        <el-button @click="clearF('dialogForm')">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateInfoSubmit()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import fjBreadNav from '@/components/fjBreadNav';
  import {quillEditor} from 'vue-quill-editor';
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
            name: '文章管理',
            path: ''
          }
        ],
        ajaxUrlDNN: fjPublic.ajaxUrlDNN,
        nowUser: $.cookie(fjPublic.loginCookieKey),
        // 列表查询参数
        searchForm: {
          title: '', // 标题
          category: '', // 标题
          supDeptId: '', // 分局id
          sDeptId: '', // 
          deptId: '',
        },
        isReadonly: false,
        hiddenButton: true,
        form: new FormData(),
        chooseButtonDisabled: false,
        // 列表数据
        infoSubmitData: [],
        // 分页数据
        currentPage: 1,
        pageSize: 10,
        total: 0,
        // 弹出框数据
        dialogVisible: false,
        dialogVisibleModal: false,
        dialogTitle: '写文章',
        dialogForm: { //发布或编辑文章时的表单数据
          category: '',
          title: '',
          author: '',
          sourceurl: '',
          conclob: '',
          id: ''
        },
        formLabelWidth: '120px',
        // 弹出框数据
        detailDialogVisible: false,
        detailDialogVisibleModal: false,
        detailDialogTitle: '上传文档',
        filterText: '',
        chooseForm: [],  //区县分局部门
        artList: [],  //文章类型数据
        PList: [],  //派出所部门数据
        isExpandAll: false,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        // 表单校验规则
        // 校验规则
        rules: {
          category: [{
            required: true, // 是否必填
            message: '分类不能为空', //规则
            trigger: 'change' //何事件触发
          }],
          title: [{
            required: true, // 是否必填
            message: '标题不能为空', //规则
            trigger: 'blur' //何事件触发
          }],
          author: [{
            required: true, // 是否必填
            message: '作者不能为空', //规则
            trigger: 'blur' //何事件触发
          }],
          conclob: [{
            required: true, // 是否必填
            message: '内容不能为空', //规则
            trigger: 'blur' //何事件触发
          }]
        },
        supDisabled: false,
        sDisabled: false,
        fileList: "",
        // 详情表单
        detailDialogForm: {
          fileCategory: "",
          fileTitle: "",
          fileAuthor: "",
          fileSourceUrl: "",
          upfAttachFile: ""
        },
        // 校验规则
        detailRules: {
          fileCategory: [{
            required: true, // 是否必填
            message: '分类不能为空！', //规则
            trigger: 'change' //何事件触发
          }],
          fileTitle: [{
            required: true, // 是否必填
            message: '标题不能为空', //规则
            trigger: 'blur' //何事件触发
          }],
          fileAuthor: [{
            required: true, // 是否必填
            message: '作者不能为空', //规则
            trigger: 'blur' //何事件触发
          }],
        },
        userInfo:null  //用户信息
      };
    },
    watch: {
      // 监听过滤
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    created:function(){
      this.userInfo = $.parseJSON(fjPublic.getLocalData('userInfo'));  //用户信息
      //console.log(this.userInfo);
    },
    mounted: function () {
      // 初始化报送列表
      $.when(this.requestDatas()).then(_.bind(function(){

      },this));
      // this.getSup();
      // this.getLanMu();
      // this.queryInfoSubmitByPage();
      return;
    },
    beforeRouteEnter:function(to,from,next){
        next(function(vm){});
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
      getSup() {   //获取区县分局部门数据
        var vm = this;
        var defer = $.Deferred();
        $.ajax({
          url: fjPublic.ajaxUrlDNN + '/searchDepListBySearch',
          type: 'POST',
          data: {},
          dataType: 'json',
          success: function (data) {
            //console.log(data);
            vm.chooseForm = _.filter(data.list,function(item){
              return item.deptId!='411342000000'&&item.deptId!='430500000000';
            });
            defer.resolve();
          },
          error: function (err) {
            defer.reject();
          }
        });
        return defer;
      },
      getFenju() { //根据分局id获取对应派出所数据
        if(!this.searchForm.supDeptId){
          this.PList.splice(0,this.PList.length);
          return;
        }
        var vm = this;
        var defer = $.Deferred();
        fjPublic.openLoad('数据请求中...');
        $.ajax({
          url: fjPublic.ajaxUrlDNN + '/searchDeptsByFenju',
          type: 'POST',
          data: {
            parentDeptId: vm.searchForm.supDeptId
          },
          dataType: 'json',
          success: function (data) {
            //console.log(data);
            fjPublic.closeLoad();
            vm.PList = null;
            vm.PList = data.list;
            defer.resolve();
          },
          error: function (err) {
            fjPublic.closeLoad();
            vm.$message({type:'warning',message:'获取对应的派出所数据失败'});
            defer.reject();
          }
        });
        return defer;
      },
      getLanMu() {  //获取文章类别数据
        var vm = this;
        var defer = $.Deferred();
        $.ajax({
          url: fjPublic.ajaxUrlDNN + '/getSelectFromDict',
          type: 'POST',
          data: {
            dictType: 'ARTICLE',
            hasEmpty: '1'
          },
          dataType: 'json',
          success: function (data) {
            vm.artList = data.dict;
            defer.resolve();
          },
          error: function (err) {
            defer.reject();
          }
        });
        return defer;
      },
      requestDatas:function(){ //向后台请求数据
        var vm = this,defer = $.Deferred();
        fjPublic.openLoad('数据加载中...');
        $.when(
            this.getSup(),
            this.getLanMu(),
            this.queryInfoSubmitByPage()
        ).then(function(){
            fjPublic.closeLoad();
            defer.resolve();
        },function(){
            vm.$message({
                type:'warning',
                message:'请求数据失败！！！'
            });
            _.delay(function(){
                fjPublic.closeLoad();
                vm.$router.push('/500');
            },2000);
        });
        return defer;
      },
      // 获取文章列表
      queryInfoSubmitByPage: function () {
        var defer = $.Deferred();
        var vm = this;
        // 参数
        this.searchForm['page'] = this.currentPage;
        this.searchForm['rows'] = this.pageSize;
        this.searchForm['deptId'] = this.searchForm['sDeptId'] == "" ? this.searchForm['supDeptId'] : this.searchForm['sDeptId'];
        // 传入当前用户信息
        this.searchForm['nowUser'] = $.cookie(fjPublic.loginCookieKey);
        $.ajax({
          url: fjPublic.ajaxUrlDNN + '/searchArticleLists',
          type: 'POST',
          data: vm.searchForm,
          dataType: 'json',
          success: function (data) {
            vm.infoSubmitData = null;
            data.list.forEach(el => {
              el.updatetime = fjPublic.dateStrFormat(el.updatetime)
            });
            vm.infoSubmitData = data.list;
            vm.total = data.total;
            defer.resolve();
          },
          error: function (err) {
            defer.reject();
          }
        });
        return defer;
      },
      searchArticleByTitle:_.debounce(function(){  //输入标题搜索文章
        fjPublic.openLoad('搜索中...');
        $.when(this.queryInfoSubmitByPage()).then(_.bind(function(){
          fjPublic.closeLoad();
        },this),_.bind(function(){
          fjPublic.closeLoad();
          this.$message({type:'warning',message:'搜索文章失败'});
        },this));
      },200),
      publish(infoSubmit) {  //发布或者编辑文章
        var vm = this;
        // 修改
        if (infoSubmit) {
          vm.dialogForm.title = infoSubmit.title;
          vm.dialogForm.category = infoSubmit.categoryId;
          vm.dialogForm.author = infoSubmit.author;
          //vm.dialogForm.conclob = infoSubmit.content;
          vm.dialogForm.sourceurl = infoSubmit.sourceurl;
          vm.dialogForm.id = infoSubmit.id;
          fjPublic.openLoad('获取文章信息...');
          $.when(this.getDetial(infoSubmit.id)).then(_.bind(function(){
            fjPublic.closeLoad();
          },this),_.bind(function(){
            fjPublic.closeLoad();
            this.$message({type:'warning',message:'获取文章信息失败'});
          },this));
        } else {
          _.each(this.dialogForm,function(v,k){
              this.$set(this.dialogForm,k,'');
          },this);
          vm.dialogVisible = true;
          fjPublic.contentScrollTop().done(function(){
            fjPublic.wrapperAddScroll();
          });
        }
      },
      getDetial(id) {  //获取文章信息
        var defer = $.Deferred();
        var vm = this;
        $.ajax({
          url: fjPublic.ajaxUrlDNN + '/getArticleDetail',
          type: 'POST',
          data: {id: id},
          dataType: 'json',
          success: function (data) {
            //console.log(data);
            vm.dialogForm.conclob = data.conclob;
            vm.dialogVisible = true;
            fjPublic.contentScrollTop().done(function(){
              fjPublic.wrapperAddScroll();
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
        var vm = this;
        this.$confirm('此操作将删除该纪录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          vm.deleteInfoSumbit(id);
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
          url: fjPublic.ajaxUrlDNN + '/deleteArticleData',
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
      // 打开添加或修改弹出框
      openAddOrDetailDialog: function (infoSubmit) {
        var vm = this;
        // 修改
        if (infoSubmit) {
          console.log(infoSubmit)
          vm.detailDialogForm.fileTitle = infoSubmit.title;
          vm.detailDialogForm.fileCategory = infoSubmit.categoryId;
          vm.detailDialogForm.fileAuthor = infoSubmit.author;
          vm.detailDialogForm.fileSourceUrl = infoSubmit.sourceurl;
          vm.detailDialogForm.id = infoSubmit.id
        } else {
           vm.detailDialogForm.fileTitle = '';
          vm.detailDialogForm.fileCategory ='';
          vm.detailDialogForm.fileAuthor = '';
          vm.detailDialogForm.fileSourceUrl = '';
          vm.detailDialogForm.id =''
        }
        vm.detailDialogVisible = true;
      },
      addOrUpdateInfoSubmit: function () { //新增或编辑文章---提交
        var defer = $.Deferred();
        var vm = this;
        // 传入当前用户信息
        vm.$refs['dialogForm'].validate(valid => {
          if (valid) {
            fjPublic.openLoad('正在提交...');
            vm.dialogForm['nowUser'] = $.cookie(fjPublic.loginCookieKey);
            $.ajax({
              url: fjPublic.ajaxUrlDNN + '/publishArticle',
              type: 'POST',
              data: vm.dialogForm,
              dataType: 'json',
              success: function (data) {
                fjPublic.closeLoad();
                if (data.errorCode == 0) {
                  vm.clearF('dialogForm');
                  vm.queryInfoSubmitByPage();
                  vm.$message({
                    type: 'success',
                    message: data.errorMsg
                  });
                }else{
                  vm.$message({
                    type: 'error',
                    message: data.errorMsg
                  });
                }
                defer.resolve();
              },
              error: function (err) {
                fjPublic.closeLoad();
                defer.reject();
              }
            });
          }
        });
        return defer;
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
            message: '请上传文档'
          })
        }
        // 传入当前用户信息
        this.$refs['detailDialogForm'].validate(valid => {
          if (valid) {
            vm.form.append('nowUser', $.cookie(fjPublic.loginCookieKey));
            vm.form.append('fileCategory', vm.detailDialogForm.fileCategory);
            vm.form.append('fileTitle', vm.detailDialogForm.fileTitle);
            vm.form.append('fileAuthor', vm.detailDialogForm.fileAuthor);
            vm.form.append('fileSourceUrl', vm.detailDialogForm.fileSourceUrl);
            vm.form.append('id', vm.detailDialogForm.id);
            vm.fileList.forEach((el, index) => {
              vm.form.append('upfAttachFile' + index, el.raw);
            })
            vm.$http.post(
              fjPublic.ajaxUrlDNN + '/uploadArticle',
              vm.form, {
                headers: {
                  "Content-Type": "multipart/form-data"
                }
              }).then(res => {
              var res = res.body;
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
      clearF(Dname) {  //关闭弹层
        this.form = new FormData();
        this.detailDialogForm = {
          fileCategory: '',
          fileTitle: '',
          fileAuthor: '',
          fileSourceUrl: '',
          upfAttachFile: ''
        };
        this.dialogForm = {
          category: '',
          title: '',
          author: '',
          sourceurl: '',
          conclob: '',
          id: ''
        };
        if (this.$refs['uploadfile']) this.$refs['uploadfile'].clearFiles();
        this.$refs[Dname].resetFields();
        this.dialogVisible = false; //文章弹层
        this.detailDialogVisible = false; //上传文档弹层
        //
        fjPublic.removeModalMask();
        fjPublic.wrapperRemoveScroll();
      }
    },
    components: {
      fjBreadNav,
      quillEditor
    }
  }

</script>
<style scope>
  .fj-content_view.article .re-ope {
    background: transparent;
    border: none;
    outline: none;
  }
  .fj-content_view.article .fj-block-body > .filterOpe-area .item {
      margin-right:20px;
  }
  .fj-content_view.article .wenzhang .el-input {
    width: 224px;
  }
  .fj-content_view.article .ql-editor {
    height: 200px;
  }
  @media screen and (min-width:1570px) {
    .fj-content_view.article .fj-block-body > .filterOpe-area {display:flex;flex-flow:row}
    /* .fj-content_view.article .fj-block-body > .filterOpe-area .item {
      margin-right:10px;
    } */
  }
</style>
