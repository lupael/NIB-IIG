/*!

 =========================================================
 * Material Dashboard PRO Angular 2 - V1.0.1
 =========================================================

 * Product Page: https://www.creative-tim.com/product/material-dashboard-pro-angular2
 * Copyright 2017 Creative Tim (https://www.creative-tim.com)
 * License Creative Tim (https://www.creative-tim.com/license)

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 */

 mda = {
    misc: {
        movingTab: '<div class="sidebar-moving-tab"/>',
        isChild: false,
        sidebarMenuActive: ''
    }
 };

var sidebarTimer;

function isObjExists(moduleName) {
  var obj = "";

  obj = $('.sidebar .nav-container > .nav > li > div > ul > li > a[data-tab="'+ moduleName +'"]');
  if(obj.length > 0) {
    return obj;
  }

  obj = $('.sidebar .nav-container > .nav > li > a[data-tab="'+ moduleName +'"]');
  if(obj.length > 0) {
    return obj;
  }

  return obj;
}

$(document).ready(function(){

  isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

  if (isWindows){
    // if we are on windows OS we activate the perfectScrollbar function
    //   $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();
    //$('html').addClass('perfect-scrollbar-on');

    //modified by rakib windows 7 scrolling issue
    $('html').addClass('perfect-scrollbar-off');
  } else {
    $('html').addClass('perfect-scrollbar-off');
  }

  mda.misc.movingTab = $(mda.misc.movingTab);

  //Modified Code
  // console.log("href " + window.location.href);

  var tabTxt = "";
  tabTxt = window.location.href.slice(window.location.href.indexOf('/', 8) + 1);

  // removing index.php from the url
  tabTxt = tabTxt.replace('index.php/', '');

  var ret = "";
  var moduleTxt = "";
  while(tabTxt.length > 0 && ret.length == 0) {
    // console.log("Tab Txt " + tabTxt);

    ret = isObjExists(tabTxt);
    if(ret.length > 0) break;

    if(tabTxt.indexOf('/') > -1){
      moduleTxt = tabTxt.slice(0, tabTxt.indexOf('/'));
    } else {
      moduleTxt = tabTxt;
    }

    // console.log("Module " + moduleTxt);

    ret = isObjExists(moduleTxt);
    if(ret.length > 0) break;

    if(tabTxt.startsWith(moduleTxt + "/")) {
      tabTxt = tabTxt.replace(moduleTxt + "/", '');
    }
    if(moduleTxt === tabTxt) break;
  }

  if(moduleTxt === tabTxt && ret.length == 0){
    ret = isObjExists('logout');
  }

  mda.misc.sidebarMenuActive = ret;

  if(mda.misc.sidebarMenuActive.length > 0) {
    mda.misc.sidebarMenuActive.parent().addClass("active");
    if(mda.misc.sidebarMenuActive.parent().parent().parent() && mda.misc.sidebarMenuActive.parent().parent().parent().hasClass("collapse")) {
      mda.misc.sidebarMenuActive.parent().parent().parent().removeClass("collapse");
    }
  }

  if(mda.misc.sidebarMenuActive.length != 0){
      setMovingTabPosition(mda.misc.sidebarMenuActive);
  } else {
      mda.misc.sidebarMenuActive = $('.sidebar .nav-container .nav > li.active .collapse li.active > a');
      mda.misc.isChild = true;
      setParentCollapse();
  }

  mda.misc.sidebarMenuActive.parent().addClass('visible');
  $('.sidebar .nav-container').append(mda.misc.movingTab);

  if (window.history && window.history.pushState) {
      $(window).on('popstate', function() {

          setTimeout(function(){
              mda.misc.sidebarMenuActive = $('.sidebar .nav-container .nav li.active a:not([data-toggle="collapse"])');

              if(mda.misc.isChild == true){
                  setParentCollapse();
              }
              animateMovingTab();
          },10);

      });
  }

  $('.sidebar .nav .collapse').on('hidden.bs.collapse', function () {
    setMovingTabPosition();
  });

  $('.sidebar .nav .collapse').on('shown.bs.collapse', function () {
      setMovingTabPosition();
  });

});

$('.sidebar .nav-container .nav > li > a:not([data-toggle="collapse"])').click(function(){
    mda.misc.sidebarMenuActive = $(this);
    $parent = $(this).parent();

    if(mda.misc.sidebarMenuActive.closest('.collapse').length == 0){
        mda.misc.isChild = false;
    }

    // we call the animation of the moving tab
    animateMovingTab();
});

function animateMovingTab(){
    clearTimeout(sidebarTimer);

    $currentActive = mda.misc.sidebarMenuActive;

    $('.sidebar .nav-container .nav li').removeClass('visible');

    $movingTab = mda.misc.movingTab;
    $movingTab.addClass('moving');

    $movingTab.css('padding-left',$currentActive.css('padding-left'));
    var button_text = $currentActive.html();

    setMovingTabPosition($currentActive);

    sidebarTimer = setTimeout(function(){
        $movingTab.removeClass('moving');
        $currentActive.parent().addClass('visible');
    }, 650);

    setTimeout(function(){
        $movingTab.html(button_text);
    }, 10);
}

function setMovingTabPosition(){
    $currentActive = mda.misc.sidebarMenuActive;
    li_distance = $currentActive.parent().position().top - 10;

    if($currentActive.closest('.collapse').length != 0){
        parent_distance = $currentActive.closest('.collapse').parent().position().top;
        li_distance = li_distance + parent_distance;
    }

    mda.misc.movingTab.css({
        'transform':'translate3d(0px,' + li_distance + 'px, 0)'
    });
}
function setParentCollapse(){
    if(mda.misc.isChild == true){
        $sidebarParent = mda.misc.sidebarMenuActive.parent().parent().parent();
        var collapseId = $sidebarParent.siblings('a').attr("href");

        $(collapseId).collapse("show");

        $(collapseId).collapse()
        .on('shown.bs.collapse', function (){
            setMovingTabPosition();
        })
        .on('hidden.bs.collapse', function(){
            setMovingTabPosition();
        });

    }
}
