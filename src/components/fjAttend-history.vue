<template>
  <div class="fj-content_view work-mis fj-history">
    <div class="fj-block title">
      <fj-breadNav :bread-data="breadData"></fj-breadNav>
    </div>
    <div class="fj-block content">
      <div class="fj-block-head kaohe">
        <p class="title fj-fl">考勤历史列表</p>
      </div>
      <div class="fj-block-body">
        <div class="fj-search-inline">
          <el-row>
            <el-form inline label-width="85px" label-position="left">
              <el-col :lg="8" :xl="7" class="time-item">
                <el-form-item label="公安局：">
                  <el-select
                    @change="getPCSdataById"
                    clearable
                    filterable
                    v-model="searchForm.supDeptId"
                    size="small"
                  >
                    <el-option
                      v-for="item in supDeptIds"
                      :key="item.deptId"
                      :label="item.deptName"
                      :value="item.deptId"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="起止日期：" class="datepicker">
                  <el-date-picker
                    v-model="searchForm.searchTime"
                    type="daterange"

                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="changeSearchTime"
                    size="small"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :lg="6" :xl="5">
                <el-form-item label="派出所：">
                  <el-select
                    @change="changeDeptId"
                    clearable
                    filterable
                    v-model="searchForm.deptId"
                    size="small"
                  >
                    <el-option
                      v-for="item in deptIds"
                      :key="item.deptId"
                      :label="item.deptName"
                      :value="item.deptId"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="输入查询：">
                  <el-input
                    v-model="searchForm.nameOrAccount"
                    clearable
                    placeholder="请输入名称或警号"
                    size="small"
                    class="search-input"
                  >
                    <el-button slot="append" @click="searchAttendHistory">搜索</el-button>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </div>
        <el-table :data="attendHistoryData">
          <el-table-column prop="userName" label="姓名"></el-table-column>
          <el-table-column prop="userAccount" label="警号"></el-table-column>
          <el-table-column label="签到时间" prop="signTime" :formatter="timeFormatter">
            <!-- <template slot-scope="scope">
              <p>{{scope.row.signTime | getSignTime}}</p>
            </template> -->
          </el-table-column>
          <el-table-column label="签到类型">
            <template slot-scope="scope">
              <p>{{scope.row.signType | getSignTypeName}}</p>
            </template>
          </el-table-column>

          <el-table-column prop="signAddress" label="签到地址" width="500px" show-overflow-tooltip  class-name="textLeft"></el-table-column>
           <el-table-column label="签到位置">
            <template slot-scope="scope">
              <!-- <p>{{scope.row.latlng | getLatLng}}</p> -->
              <el-button @click="showMap(scope.row)" type="text" size="small">查看地图</el-button>
            </template>
            查看地图
          </el-table-column>
        </el-table>
        <div class="mj-page_wrap">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10,20,30]"
            :page-size="pageSize"
            v-if="total!==0"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @current-change="currentPageChange"
            @prev-click="prevPageChange"
            @next-click="nextPageChange"
            @size-change="sizePageChange"
          >
          </el-pagination>
        </div>
      </div>
      <div class="dialog">
        <!-- 用于展示地图 -->
        <el-dialog
          title="详细地址"
          :visible.sync="dialogVisible"
          :close-on-click-modal="false"
          width="600px"
          :modal='false'>
          <div class="fcv-history-map" id="fcv-history-map"></div>
          <span slot="footer" class="dialog-footer">
            <!--<el-button @click="dialogVisible = false">取 消</el-button>-->
            <!--<el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
  import fjBreadNav from '@/components/fjBreadNav';

  export default {
    name: 'fjAttendHistory',
    data: function () {
      return {
        breadData: [
          {name: '当前位置:', path: ''},
          {name: '考勤管理', path: ''},
          {name: '考勤历史', path: ''}
        ],
        nowUser: $.cookie(fjPublic.loginCookieKey),
        // 分局
        supDeptIds: null,
        // 派出所
        deptIds: null,
        // 列表查询参数
        searchForm: {
          searchTime: '',         // 查询时间
          nameOrAccount: '',         // 警号或负责人名称
          deptId: '',     // 部门单位
          supDeptId: ''     // 公安局
        },
        // 列表数据
        /**
         * {
          latlng: "",
          signAddress: "",
          signTime: "",
          signType: "",
          userAccount: "",
          userId: "",
          userName: ""
        }
         */
        attendHistoryData: [],
        // 分页数据
        currentPage: 1,
        pageSize: 10,
        total: 0,
        dialogVisible: false
      };
    },
    mounted: function () {
      // 初始化派出所下拉列表
      //this.initDeptIds();
      // 初始化派出所下拉列表
      this.initSupDeptIds();
      // 初始化考勤历史列表
      this.searchUserSignin();
      // 初始化时间
      this.initTime()
      return;
    },
    filters: {
      // 状态处理
      getSignTypeName: function (value) {
        return value == 1 ? '上班' : value == 2 ? '下班' : '';
      },
      getSignTime: function (value) {
        return value ? fjPublic.dateStrFormat(value) : '';
      }
    },
    methods: {
      /* 0314修改 */
      getPCSdataById:function(id){ //根据分局id获取派出所数据
        if(!id){ //清空的时候，清除对应派出所数据
            this.searchForm.deptId = '';
            this.deptIds.splice(0,this.deptIds.length);
            this.currentPage = 1;
            this.searchUserSignin();
            return;
        }
        fjPublic.openLoad('部门切换中...');
        var defer = $.Deferred();
        var vm = this;
        $.ajax({  
          url:fjPublic.ajaxUrlDNN + '/searchDeptsByFenju',
          type:'POST',
          data:{
            parentDeptId:this.searchForm.supDeptId  //根据分局id
          },
          dataType:'json',
          success:function(data){
            fjPublic.closeLoad();
            //console.log(data);
            vm.deptIds = null;
            vm.deptIds = data.list;
            defer.resolve();
          },
          error:function(err){
            fjPublic.closeLoad();
            vm.$message({type:'warning',message:'获取对应分局的派出所数据失败'});
            defer.reject();
          }
        });
			  return defer;
      },
      initTime () {
        let date = new Date()
        let y = date.getFullYear()
        let m = date.getMonth() + 1
        let d = date.getDate()
        let time = y + '-' + m + '-' + d
        this.searchForm.searchTime = [time, time]
      },
      currentPageChange: function (pageNum) {  // 点击某个分页按钮
        this.currentPage = pageNum;
        this.searchUserSignin();
      },
      prevPageChange: function (pageNum) {  // 点击分页的上一页
        this.currentPage = pageNum;
        this.searchUserSignin();
      },
      nextPageChange: function (pageNum) {  // 点击分页的下一页
        this.currentPage = pageNum;
        this.searchUserSignin();
      },
      sizePageChange: function (pageSize) {  // 改变每页条数时
        this.currentPage = 1;
        this.pageSize = pageSize;
        this.searchUserSignin();
      },
      // 初始化分局
      initSupDeptIds: function () {
        var defer = $.Deferred();
        var vm = this;
        $.ajax({
          url: fjPublic.ajaxUrlDNN + '/searchDepListBySearch',
          type: 'POST',
          data: {},
          dataType: 'json',
          success: function (data) {
            //console.log(data.list);
            vm.supDeptIds = _.filter(data.list,function(item){
              return item.deptId != fjPublic.cityInfos.deptId;
            });
            defer.resolve();
          },
          error: function (err) {
            defer.reject();
          }
        });
        return defer;
      },
      // 初始化派出所
      initDeptIds: function () {
        var defer = $.Deferred();
        var vm = this;
        $.ajax({
          url: fjPublic.ajaxUrlDNN + '/searchDeptsByFenju',
          type: 'POST',
          data: {
            parentDeptId: ''
          },
          dataType: 'json',
          success: function (data) {
            vm.deptIds = data.list;
            defer.resolve();
          },
          error: function (err) {
            defer.reject();
          }
        });
        return defer;
      },
      // 初始化百度地图
      initMap(lat, len) {
        this.$nextTick(() => {
          this.qqMap = new qq.maps.Map(document.getElementById('fcv-history-map'),{
            // 地图的中心地理坐标。
            center: new qq.maps.LatLng(lat, len),
            zoom: 15
          });
          new qq.maps.Marker({
            position:  new qq.maps.LatLng(lat, len),
            map: this.qqMap
          })
        })
      },
      // 修改单位下拉框查询
      changeSupDeptId: function (supDeptId) {
        this.searchForm['supDeptId'] = supDeptId;
        this.searchUserSignin();
      },
      // 修改单位下拉框查询
      changeDeptId: function (deptId) {
        this.searchForm['deptId'] = deptId;
        this.searchUserSignin();
      },
      // 标题或负责人名称查询
      searchAttendHistory: function () {
        this.searchUserSignin();
      },
      // 修改查询时间
      changeSearchTime: function (searchTime) {
        if (searchTime) {
          this.searchForm['startTime'] = fjPublic.dateFormatYYMMDD(searchTime[0]);
          this.searchForm['endTime'] = fjPublic.dateFormatYYMMDD(searchTime[1]);
        } else {
          this.searchForm['startTime'] = '';
          this.searchForm['endTime'] = '';
        }
        this.searchUserSignin();
      },
      // 获取采集列表
      searchUserSignin: function () {
        var defer = $.Deferred();
        var vm = this;
        // 参数
        this.searchForm['page'] = this.currentPage;
        this.searchForm['rows'] = this.pageSize;
        // 传入当前用户信息
        this.searchForm['nowUser'] = this.nowUser;
        $.ajax({
          url: fjPublic.ajaxUrlDNN + '/searchUserSignin',
          type: 'POST',
          data: vm.searchForm,
          dataType: 'json',
          success: function (data) {
            vm.attendHistoryData = null;
            vm.attendHistoryData = data.list;
            vm.total = data.total;
            _.each(vm.attendHistoryData, function (item, i) {
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
      // 查看地图详情
      showMap(row) {
        if (row) {
          var arr = row.latlng.split(',').reverse()
          var lat = 27.2600
          var len = 111.4100
          if (arr.length) {
            lat = parseFloat(arr[0])
            len = parseFloat(arr[1])
          }
        }
        this.dialogVisible = true
        // 初始化百度地图
        this.initMap(lat, len)
      },// 时间格式化
      timeFormatter (row, type) {
        let dateStr = row[type.property]
        if (!dateStr) {
            return ''
        }
        return dateStr.substr(4, 2) + '/' + dateStr.substr(6, 2)
        + ' ' + dateStr.substr(8, 2) + ':' + dateStr.substr(10, 2)
      },
    },
    components: {
      fjBreadNav
    }
  }
</script>
<style scope lang="less">
.fj-history {
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
        margin:0;
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
  #fcv-history-map {
    height: 500px;
  }
  .textLeft {
    text-align: left;
  }
}

</style>
