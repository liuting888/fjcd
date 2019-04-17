<template>
  <div class="fj-sider-menu" id="fj-sider-menu">
    <span class="fj-sider_slide"></span>
  </div>
</template>
<script>
//左侧导航
window.fjSideNav = {
  navData: null,
  boxParent: null, //侧边栏
  box: null, //导航栏
  firstMenus: null, //
  firstItems: null, //一级导航
  icons: null, //导航的图标
  arrows: null, //箭头
  secondMenus: null, //二级菜单
  slider: null,
  wrapVue: null,
  init: function(vm) {
    this.box = $("#fj-sider-menu");
    this.boxParent = this.box.parent();
    this.wrapVue = vm;
    this.commonLinks = $.parseJSON(fjPublic.getLocalData("commonLinks"));
    this.x = 0;
    //生成菜单
    this.setFirstList();
    //设置事件
    this.setEvents();
    //设置初始状态
    this.setInitState();
    //导航最外层的offset-top值
    this.parentPt = this.boxParent.offset().top;
  },
  setFirstList: function() {
    _.each(
      this.navData,
      function(item, i) {
        var fNavItem = $('<div class="fj-sider-menu_item"></div>');
        var sNavItem;
        var fTemp = _.template(
          '<div class="title-box {{data.own}}" title="{{data.title}}" data-title="{{data.title}}" data-route="{{data.route}}">\
				<span class="icon-area"><img src="{{data.src}}" data-noSelect="{{data.src}}" data-select="{{data.selectSrc}}" alt=""></span>\
				<p class="title">{{data.title}}</p>\
				<img class="arrow" src="{{data.arrowSrc}}" data-noopen="{{data.arrowSrc}}" data-open="{{data.arrowSelectedSrc}}" alt="" />\
			</div>',
          {
            variable: "data"
          }
        )(item);
        if (item.children) {
          //设置二级菜单
          var sHtml = this.setSecondList(item.children);
          this.box.append(fNavItem.html(fTemp + sHtml));
        } else {
          this.box.append(fNavItem.html(fTemp));
        }
      },
      this
    );
    this.firstMenus = this.box.find(".fj-sider-menu_item");
    this.firstItems = this.box.find(".title-box");
    this.icons = this.firstItems.find(".icon-area > img");
    this.secondMenus = this.box.find(".fj-sider-sMenu");
    this.arrows = this.firstItems.find("img.arrow");
    //slider
    this.slider = this.box.find(".fj-sider_slide");
  },
  setSecondList: function(data) {
    if (!data.length) return '<ul class="fj-sider-sMenu is-empty"></ul>';
    var htmlArr = [];
    _.each(
      data,
      function(item) {
        htmlArr.push(
          _.template(
            '<li class="fj-sider-sMenu_item" data-title="{{data.title}}" data-route="{{data.route}}">{{data.title}}</li>',
            {
              variable: "data"
            }
          )(item)
        );
      },
      this
    );
    return '<ul class="fj-sider-sMenu">' + htmlArr.join("") + "</ul>";
  },
  firstItemsClickEvent: function(ev) {
    var $this = $(ev.currentTarget),
      index = this.firstItems.index($this),
      pos = $this.offset();
    //
    if (
      $this.hasClass("is-opened") &&
      $this.hasClass("is-own") &&
      this.boxParent.hasClass("sider-toggle")
    ) {
      this.noSecondMenuClickEvent($this, index);
      return false;
    } else if ($this.hasClass("is-opened") && $this.hasClass("is-own")) {
      return false;
    }
    if ($this.hasClass("is-opened")) {
      /* 取消箭头的旋转 */
      this.cancelArrowsRotate();
      /* 一级导航的图标转为未选中 */
      this.clearIconsClass();
      $this.removeClass("is-opened");
      this.secondMenus
        .eq(index)
        .stop(true, true)
        .slideUp();
    } else {
      this.firstItems.removeClass("is-opened");
      this.arrows.attr("src", this.arrows.eq(index).attr("data-noopen"));
      /* 一级导航的图标转为未选中 */
      this.clearIconsClass();
      /* 收起所有二级菜单 */
      this.closeSecondMenus();
      /* 取消箭头的旋转 */
      this.cancelArrowsRotate();
      this.arrows.eq(index).css("transform", "rotate(90deg)");
      $this.addClass("is-opened");
      if (this.secondMenus.eq(index).hasClass("is-empty")) {
        this.secondMenus.eq(index).hide();
      } else {
        this.secondMenus
          .eq(index)
          .stop(true, true)
          .slideDown();
      }
      this.slider.hide().css({
        transform: "translateY(" + (pos.top - this.parentPt) + "px)"
      });
    }
    //点击没有二级菜单的一级菜单项
    if ($this.hasClass("is-opened") && $this.hasClass("is-own")) {
      this.noSecondMenuClickEvent($this, index);
    }
  },
  noSecondMenuClickEvent: function($this, index) {
    //点击没有二级菜单的一级菜单项
    /* 取消箭头的旋转 */
    this.cancelArrowsRotate();
    this.icons.eq(index).attr("src", this.icons.eq(index).attr("data-select"));
    this.secondMenus.children(".fj-sider-sMenu_item").removeClass("is-select");
    /* 取消箭头的旋转 */
    this.cancelArrowsRotate();
    this.arrows.eq(index).attr("src", this.arrows.eq(index).attr("data-open"));
    fjPublic.closeLoad();
    var name = $this.attr("data-title"),
      routeName = $this.attr("data-route");
    this.wrapVue.$router.push(routeName);
    //保存切换历史
    this.saveClickedLink(name, routeName);
  },
  setEvents: function() {
    //设置事件
    this.boxParent.on(
      "mouseleave",
      _.bind(function() {
        this.slider.hide();
      }, this)
    );
    //展开收起菜单
    this.firstItems.on({
      click: _.bind(this.firstItemsClickEvent, this),
      mouseenter: _.bind(function(ev) {
        var $this = $(ev.currentTarget);
        if (this.boxParent.hasClass("sider-toggle")) {
          var index = this.firstItems.index($this);
          /* if(this.firstItems.eq(index).hasClass('is-opened')){
              return false;
            } */
          this.firstItems.removeClass("is-opened");
          this.firstItems.eq(index).addClass("is-opened");
          /* 一级导航的图标转为未选中 */
          this.clearIconsClass();
          this.icons
            .eq(index)
            .attr("src", this.icons.eq(index).attr("data-select"));
          /* 取消箭头的旋转 */
          this.cancelArrowsRotate();
          this.arrows.eq(index).css("transform", "rotate(90deg)");
          /* 收起所有二级菜单 */
          this.closeSecondMenus();
          if (!this.secondMenus.eq(index).hasClass("is-empty")) {
            this.secondMenus
              .eq(index)
              .stop(true, true)
              .slideDown();
          } else {
            /* 取消箭头的选中样式 */
            this.clearArrowsState();
            this.arrows
              .eq(index)
              .attr("src", this.arrows.eq(index).attr("data-open"))
              .css("transform", "rotate(0deg)");
          }
          return false;
        }
        var pos = $this.offset();
        if ($this.hasClass("is-opened")) return false;
        this.slider.show().css({
          transform: "translateY(" + (pos.top - this.parentPt) + "px)"
        });
      }, this)
    });
    //
    this.firstMenus.on({
      mouseleave: _.bind(function(ev) {
        if (this.boxParent.hasClass("sider-toggle")) {
          var $this = $(ev.currentTarget);
          var index = this.firstMenus.index($this);
          if (this.secondMenus.eq(index).hasClass("is-empty")) {
            return false;
          }
          this.secondMenus
            .eq(index)
            .stop(true, true)
            .slideUp();
        }
      }, this)
    });
    //点击切换组件
    this.box.on(
      "click",
      ".fj-sider-sMenu_item",
      _.bind(function(ev) {
        var $this = $(ev.currentTarget);
        //
        this.secondMenus
          .children(".fj-sider-sMenu_item")
          .removeClass("is-select");
        //
        $this
          .siblings()
          .removeClass("is-select")
          .end()
          .addClass("is-select");
        fjPublic.closeLoad();
        var name = $this.attr("data-title"),
          routeName = $this.attr("data-route");
        this.wrapVue.$router.push(routeName);
        //保存切换历史
        this.saveClickedLink(name, routeName);
      }, this)
    );
  },
  saveClickedLink: function(name, routeName) {
    if (this.commonLinks.length >= 8) {
      this.x >= this.commonLinks.length && (this.x = 0);
      this.commonLinks.splice(this.x, 1, { name: name, routeName: routeName });
      fjPublic.setLocalData("commonLinks", JSON.stringify(this.commonLinks));
      this.x++;
      return false;
    }
    this.commonLinks.push({ name: name, routeName: routeName });
    fjPublic.setLocalData("commonLinks", JSON.stringify(this.commonLinks));
  },
  clearItemsState: function() {
    this.firstItems.removeClass("is-opened");
    this.icons.each(function(i, e) {
      $(e).attr("src", $(e).attr("data-noselect"));
    });
    this.arrows.each(function(i, e) {
      $(e)
        .attr("src", $(e).attr("data-noopen"))
        .css("transform", "rotate(0deg)");
    });
    this.secondMenus
      .slideUp()
      .find(".fj-sider-sMenu_item")
      .removeClass("is-select");
  },
  setInitState: function(setedHash) {
    this.clearItemsState();
    var initHash;
    if (!setedHash) {
      initHash = window.location.hash.split("#")[1]; //页面的路由值
    } else {
      initHash = setedHash;
    }
    //
    _.each(
      this.navData,
      function(item, i) {
        if (item.route == initHash) {
          this.firstItems
            .eq(i)
            .addClass("is-opened")
            .addClass("is-own");
          this.icons.eq(i).attr("src", this.icons.eq(i).attr("data-select"));
          this.arrows
            .eq(i)
            .attr("src", this.arrows.eq(i).attr("data-open"))
            .css("transform", "rotate(0deg)");
        } else {
          _.each(
            item.children,
            function(item2, j) {
              if (item2.route == initHash) {
                this.firstItems.eq(i).addClass("is-opened");
                this.arrows.eq(i).css("transform", "rotate(90deg)");
                this.secondMenus
                  .eq(i)
                  .slideDown()
                  .find(".fj-sider-sMenu_item")
                  .eq(j)
                  .addClass("is-select");
              }
            },
            this
          );
        }
      },
      this
    );
  },
  unbindFirstItemsClickFn: function() {
    //解绑一级菜单项的点击事件
    _.each(
      this.firstItems,
      function(item) {
        var oItem = $(item);
        var osMenu = oItem.siblings(".fj-sider-sMenu");
        if (!osMenu.hasClass("is-empty")) {
          oItem.off("click");
        }
      },
      this
    );
    return this;
  },
  bindFirstItemsClickFn: function() {
    //一级菜单项绑定点击事件
    this.firstItems
      .off("click")
      .on("click", _.bind(this.firstItemsClickEvent, this));
    return this;
  },
  clearIconsClass: function() {
    //一级导航的图标转为未选中
    this.icons.each(function(i, e) {
      var $e = $(e);
      $e.attr("src", $e.attr("data-noSelect"));
    });
  },
  closeSecondMenus: function() {
    //收起二级菜单
    this.secondMenus.stop(true, true).slideUp();
  },
  clearArrowsState: function() {
    //取消箭头的选中样式
    this.arrows.each(function(i, e) {
      var $e = $(e);
      $e.attr("src", $e.attr("data-noopen"));
    });
  },
  cancelArrowsRotate: function() {
    //取消箭头的旋转
    this.arrows.css("transform", "rotate(0deg)");
  },
  siderOpen2Close: function() {
    //菜单展开->收起修改图标
    _.each(
      this.firstItems,
      function(item, i) {
        var oItem = $(item);
        if (oItem.hasClass("is-opened") && !oItem.hasClass("is-own")) {
          this.icons.eq(i).attr("src", this.icons.eq(i).attr("data-select"));
        }
      },
      this
    );
  },
  siderClose2Open: function() {
    //菜单收起->展开修改图标
    this.icons.each(
      _.bind(function(i, e) {
        var $e = $(e);
        if (!this.firstItems.eq(i).hasClass("is-own")) {
          $e.attr("src", $e.attr("data-noSelect"));
        }
        if (
          this.firstItems.eq(i).hasClass("is-opened") &&
          !this.firstItems.eq(i).hasClass("is-own")
        ) {
          this.secondMenus
            .eq(i)
            .stop(true, true)
            .slideDown();
        }
      }, this)
    );
  }
};
export default {
  name: "fj-nav",
  data: function() {
    return {
      navData: [
        {
          title: "首页",
          own: "is-own",
          src: "static/images/fj-sider-icon_home.png",
          selectSrc: "static/images/fj-sider-icon_home1.png",
          arrowSrc: "static/images/fj-sider-arrow.png",
          arrowSelectedSrc: "static/images/fj-sider-arrow1.png",
          route: "/index",
          children: []
        },
        {
          title: "工作管理",
          own: "",
          src: "static/images/fj-sider-icon_gzgl.png",
          selectSrc: "static/images/fj-sider-icon_gzgl1.png",
          arrowSrc: "static/images/fj-sider-arrow.png",
          arrowSelectedSrc: "static/images/fj-sider-arrow1.png",
          children: [
            {
              title: "工作任务",
              route: "/work-manage-mission"
            },
            {
              title: "信息采集",
              route: "/fjWorkManage-info"
            },
            {
              title: "一标三实",
              route: "/fjWorkManage-YiBiaoSanShi"
            },
            {
              title: "工作日志",
              route: "/fjWorkManage-workLog"
            }
          ]
        },
        {
          title: "考勤管理",
          own: "",
          src: "static/images/fj-sider-icon_kqgl.png",
          selectSrc: "static/images/fj-sider-icon_kqgl1.png",
          arrowSrc: "static/images/fj-sider-arrow.png",
          arrowSelectedSrc: "static/images/fj-sider-arrow1.png",
          children: [
            {
              title: "考勤历史",
              route: "/fjAttend-history"
            },
            {
              title: "请假休假",
              route: "/fjAttend-leave"
            },
            {
              title: "考勤申诉",
              route: "/fjAttend-appeal"
            }
          ]
        },
        {
          title: "考核管理",
          own: "",
          src: "static/images/fj-sider-icon_khgl.png",
          selectSrc: "static/images/fj-sider-icon_khgl1.png",
          arrowSrc: "static/images/fj-sider-arrow.png",
          arrowSelectedSrc: "static/images/fj-sider-arrow1.png",
          children: [
            {
              title: "单位考核",
              route: "/unit-assessment"
            },
            {
              title: "地区考核",
              route: "/local-assessment"
            },
            {
              title: "个人考核",
              route: "/personal-assessment"
            },
            {
              title: "考核规则",
              route: "/personal-assessment-rules"
            }
          ]
        },
        {
          title: "数据中心",
          own: "is-own",
          src: "static/images/fj-sider-icon_data.png",
          selectSrc: "static/images/fj-sider-icon_data1.png",
          arrowSrc: "static/images/fj-sider-arrow.png",
          arrowSelectedSrc: "static/images/fj-sider-arrow1.png",
          route: "/data-center",
          children: []
        },
        {
          title: "新闻中心",
          own: "",
          src: "static/images/fj-sider-icon_news.png",
          selectSrc: "static/images/fj-sider-icon_news1.png",
          arrowSrc: "static/images/fj-sider-arrow.png",
          arrowSelectedSrc: "static/images/fj-sider-arrow1.png",
          route: "",
          children: [
            // {
            //   title: '信息报送',
            //   route: '/fjNewsCenter-infoSubmit'
            // },
            {
              title: "文章管理",
              route: "/fjNewsCenter-articleManage"
            }
          ]
        },
        {
          title: "教培管理",
          own: "",
          src: "static/images/fj-sider-icon_jpgl.png",
          selectSrc: "static/images/fj-sider-icon_jpgl1.png",
          arrowSrc: "static/images/fj-sider-arrow.png",
          arrowSelectedSrc: "static/images/fj-sider-arrow1.png",
          children: [
            {
              title: "业务知识库",
              route: "/knowleage-center"
            },
            {
              title: "培训中心",
              route: "/training"
            },
            {
              title: "专题考试",
              route: "/special-exam"
            }
          ]
        },
        // {
        //   title: '人事管理',
        //   own: '',
        //   src: 'static/images/fj-sider-icon_jpgl.png',
        //   selectSrc: 'static/images/fj-sider-icon_jpgl1.png',
        //   arrowSrc: 'static/images/fj-sider-arrow.png',
        //   arrowSelectedSrc: 'static/images/fj-sider-arrow1.png',
        //   children: [{
        //     title: '招聘管理',
        //     route: '/personnel-recruit'
        //   }
        //   ]
        // },
        {
          title: "人事管理",
          own: "",
          src: "static/images/fj-sider-icon_hr.png",
          selectSrc: "static/images/fj-sider-icon_hr.png",
          arrowSrc: "static/images/fj-sider-arrow.png",
          arrowSelectedSrc: "static/images/fj-sider-arrow1.png",
          children: [
            {
              title: "招聘管理",
              route: "/personnel-recruitment"
            },
            {
              title: "合同管理",
              route: "/personnel-contract"
            },
            {
              title: "档案管理",
              route: "/personnel-archives"
            },
            {
              title: "工资管理",
              route: "/personnel-wage"
            },
            {
              title: "规则管理",
              route: "/personnel-rule-setting"
            }
          ]
        },
        {
          title: "系统管理",
          own: "",
          src: "static/images/fj-sider-icon_sys.png",
          selectSrc: "static/images/fj-sider-icon_sys1.png",
          arrowSrc: "static/images/fj-sider-arrow.png",
          arrowSelectedSrc: "static/images/fj-sider-arrow1.png",
          children: [
            {
              title: "组织架构",
              route: "/organizational-structure"
            },
            {
              title: "考核配置",
              route: "/appraise-item"
            },
            {
              title: "操作日志",
              route: "/operation-logs"
            }
          ]
        }
      ],
      userInfo: null, //用户信息
      operateNavDatas: {
        [fjPublic.userRoles.pcs]: function() {
          //派出所
          this.navData = this.navData.slice(0, 4);
          this.navData[this.navData.length - 1].children.splice(0, 2); //去掉考核管理->单位考核、地区考核
          return this.navData;
        },
        [fjPublic.userRoles.qj]: function() {
          //区级
          this.navData.splice(5, 2);
          this.navData[3].children.splice(0, 1); //去掉考核管理->单位考核
          this.navData[5].children.splice(1, 1); //去掉考核管理->单位考核
          this.navData.splice(4, 1); //去掉数据中心
          return this.navData;
        },
        [fjPublic.userRoles.sj]: function() {
          //市局
          return this.navData;
        },
        [fjPublic.userRoles.cg]: function() {
          //超级管理员
          return this.operateNavDatas[fjPublic.userRoles.sj].call(this);
        }
      }
    };
  },
  mounted: function() {
    //_.template设置
    _.templateSettings = {
      interpolate: /\{\{(.+?)\}\}/g
    };
    /*
        id: "1000" value: "辅警"
        id: "1001" value: "派出所"
        id: "1002" value: "区级"
        id: "8888" value: "市局"
        id: "9999" value: "超级管理员"
      */
    //根据用户角色处理导航栏数据
    this.userInfo = $.parseJSON(fjPublic.getLocalData("userInfo"));
    if (!this.userInfo) return;
    //
    fjSideNav.navData = this.operateNavDatas[this.userInfo.userRole].call(this);
    //导航栏
    fjSideNav.init(this);
  }
};
</script>
<style>
/* 左侧导航 */
.fj-sider > .fj-sider-menu {
  padding: 58px 10px 0px;
}
.fj-sider.sider-toggle > .fj-sider-menu {
  position: absolute;
  top: 36px;
  left: 200px;
  bottom: 0;
  width: 40px;
  padding: 0px;
  background: rgba(0, 0, 0, 0.85);
  /* overflow-y: hidden; */
}

.fj-sider.sider-toggle > .fj-sider-menu .fj-sider_slide {
  display: none;
}

.fj-sider.sider-toggle .fj-sider-menu_item > .title-box > .icon-area {
  left: 8px;
}

.fj-sider.sider-toggle .fj-sider-menu_item > .title-box > .title {
  padding-left: 0px;
  white-space: nowrap;
  opacity: 0;
}

.fj-sider.sider-toggle .fj-sider-menu_item > .title-box > .arrow {
  display: none;
}
.fj-sider.sider-toggle .fj-sider-sMenu {
  position: absolute;
  left: calc(100% + 20px);
  top: 50%;
  width: 180px;
  padding: 10px 10px 0px;
  background-color: rgba(0, 0, 0, 0.85);
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.65);
  transform: translateY(-50%);
}
.fj-sider.sider-toggle .fj-sider-sMenu .fj-sider-sMenu_item {
  padding-left: 0px;
  text-align: center;
}
.fj-sider.sider-toggle .fj-sider-sMenu .fj-sider-sMenu_item.is-select:after {
  left: 36px;
}
/*  */
.fj-sider .fj-sider-menu_item {
  position: relative;
  line-height: 38px;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 14px;
}
.fj-sider .fj-sider-menu_item > .title-box {
  position: relative;
  border-radius: 18px;
  cursor: pointer;
}
/* .fj-sider .fj-sider-menu_item > .title-box:hover {background-color:#008AE9;background-color:rgba(255,255,255,0.2);} */
.fj-sider .fj-sider-menu_item > .title-box > .arrow {
  position: absolute;
  top: 14px;
  right: 12px;
  width: 6px;
  height: 10px;
}

.fj-sider .fj-sider-menu_item > .title-box.is-opened.is-own > .arrow {
  top: 11px;
  right: 8px;
  width: 16px;
  height: 16px;
}

/*  */
.fj-sider .fj-sider-menu_item > .title-box.is-opened {
  background-color: rgba(255, 255, 255, 0.2);
}

.fj-sider .fj-sider-menu_item > .title-box.is-own.is-opened {
  background-color: rgba(255, 255, 255, 1);
  color: #008ae9;
}

/* .fj-sider .fj-sider-menu_item > .title-box.is-opened:after {transform:rotate(90deg)}
.fj-sider .fj-sider-menu_item > .title-box.is-own.is-opened:after {transform:rotate(0deg)} */
.fj-sider .fj-sider-menu_item > .title-box > .title {
  padding-left: 52px;
}

.fj-sider .fj-sider-menu_item > .title-box > .icon-area {
  position: absolute;
  top: 6px;
  left: 18px;
  width: 24px;
  height: 24px;
}
.fj-sider .fj-sider-menu_item > .title-box > .icon-area > img {
  max-width: 100%;
}
/* 滑块 */
.fj-sider_slide {
  position: absolute;
  top: 0px;
  left: 10px;
  width: 180px;
  height: 38px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 18px;
  -webkit-transform: translateY(-200px);
  transform: translateY(-200px);
}
.fj-sider.sider-toggle .fj-sider_slide {
  display: none;
}
/* 二级菜单 */
.fj-sider-sMenu {
  position: relative;
  display: none;
  padding-top: 12px;
  -webkit-transition: none;
  transition: none;
}
.fj-sider-sMenu.is-empty {
  display: none;
  padding-top: 0px;
}
.fj-sider-sMenu_item {
  position: relative;
  height: 30px;
  line-height: 30px;
  margin-bottom: 10px;
  padding-left: 66px;
  color: #e5e5e5;
  border-radius: 18px;
  cursor: pointer;
}

.fj-sider-sMenu_item:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.fj-sider-sMenu_item.is-select {
  background-color: #fff;
  color: #3aa0ff;
}

.fj-sider-sMenu_item.is-select:after {
  content: "";
  position: absolute;
  top: 12px;
  left: 56px;
  width: 6px;
  height: 6px;
  background-color: #3aa0ff;
  border-radius: 50%;
}
</style>
