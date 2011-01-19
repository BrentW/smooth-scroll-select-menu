var currentSmartSelectMenu;

$(document).ready(function() {
  (function( $ ){
    function smartSelectMenu(clicked_div, scrollEvent) {
      var clickScroll = function(scrollEvent){
        if(scrollEvent == 'click'){
          return true;
        } else {
          return false;
        }
      }
      
      $('div.jq_smartSelectWrap div').live('click', function(){
        if ($(this).parent().find('ul').is(':visible')) {
          currentSmartSelectMenu.close();
        }
      })

      $('li.jq_smartSelect').live('click', function(){
        var self = $(this);
        var div = self.parents('div.jq_smartSelectWrap').find('div')

        div.replaceWith(buildSelectedDiv(self.data('value'), self.html()))
        setHiddenInputData(self);
        currentSmartSelectMenu.close();
      });

      $('li.jq_smartSelectScroll').live('mouseenter', function(){
        var self = $(this);

        if(self.hasClass('jq_smartSelectScrollDown')){
          currentSmartSelectMenu.startScrollDown();
        } else if(self.hasClass('jq_smartSelectScrollUp')){
          currentSmartSelectMenu.startScrollUp();
        }
      });

      $('li.jq_smartSelectScroll').live('mouseleave', function(){
        var self = $(this);

        if(self.hasClass('jq_smartSelectScrollDown')){
          currentSmartSelectMenu.stopScrollDown();
        } else if(self.hasClass('jq_smartSelectScrollUp')){
          currentSmartSelectMenu.stopScrollUp();
        }
      });

      $('ul.jq_smartSelectList').live('mousewheel', function(event, delta) {
        event.preventDefault();
        if(delta > 0){
          currentSmartSelectMenu.scrollUp();
        } else if(delta < 0) {
          currentSmartSelectMenu.scrollDown();
        }
      });

      // Removing click scrolling functionality 
      // 
      // $('li.jq_smartSelectScroll').live('click', function(){
      //   var self = $(this);
      // 
      //   if(self.hasClass('jq_smartSelectScrollDown')){
      //     currentSmartSelectMenu.scrollDown();
      //   } else if(self.hasClass('jq_smartSelectScrollUp')){
      //     currentSmartSelectMenu.scrollUp();
      //   }
      // });


      var clearCurrentTransactionMenu = function(){
        if(currentSmartSelectMenu){
          currentSmartSelectMenu.close();   
          currentSmartSelectMenu = null;     
        }
      };

      $('div.jq_smartSelectWrap').live('mouseleave', function(event){
          clearCurrentTransactionMenu();     
      });

      var scrollTime = 200;

      var menu = function(){
        return $(clicked_div).find('ul');
      };  
      var menuHeight = function(){
        return menu().outerHeight();
      };
      var menuTop    = function(){
        return menu().offset().top;    
      };
      var windowHeight  = function(){
        return $(window).height();
      };
      var windowOffset = function() {
        return $(window).scrollTop();
      };

      var liCount = $(clicked_div).find('li').length;
      var currentPosition  = 0;
      var lastPosition;

      var getMenuOverflow = function(menu_top, menu_height, window_height) {
        var overflow = menu_top + menu_height - window_height;

        if(overflow < 0){
          overflow = 0;
        }
        return overflow;
      };

      var menuOverflow = function(){
        return getMenuOverflow(menuTop(), menuHeight(), windowHeight());
      };

      var menuIsTooLargeForWindow = function(menuHeight, windowHeight){
        if(menuHeight > windowHeight) {
          return true;
        }
        else {
          return false;
        }
      };

      var menuOverFlowsWindow = function(menuTop, menuHeight, windowHeight){
        if(menuTop + menuHeight > windowHeight + windowOffset()) {
          return true;
        }
        else {
          return false;
        }
      };

      var liHeight = function() {
        return $(menu().find('li')[1]).outerHeight();
      };

      var lisThatCanFitOnPage = function(){
        var room_for = windowHeight() / liHeight();

        if(room_for > liCount) {
          return liCount - 1; // - 1 for size of original table row
        } else {
          return Math.floor(room_for) - 3; // -2 b/c There are 2 li's with arrows only for scrolling, - 1 for size of original table row
        }
      };

      var hideOverflowLis = function(){
        menu().find('li.jq_smartSelect').each(function(index, element){
          if(index + 1 > lisThatCanFitOnPage()){
            $(element).hide();
          }
        });
      };

      var displayScrollLIs = function() {
        menu().find('li.jq_smartSelectScroll').show();
        hideOverflowLis();
      };

      var open = function(){
        menu().show(); 

        if(menuIsTooLargeForWindow(menuHeight(), windowHeight())){
          displayScrollLIs();      
        }
        if(menuOverFlowsWindow(menuTop(), menuHeight(), windowHeight())) {
    //      $(window).scrollTop(menuOverflow());
    //      uses kswedberg's jquery-smooth-scroll
          $('html, body').scrollable().animate({scrollTop:menuOverflow()}, 1000);
        }
      };

      var close = function(){
        menu().fadeOut();
      };

      var allLis = function(){
        return $(menu().find('li.jq_smartSelect'));
      };

      var toShowPosition = function(direction){
        if(direction === 'up') {
          return currentPosition - 1;
        } else if(direction === 'down'){
          return currentPosition + lisThatCanFitOnPage();
        }
      };

      var toShowLi = function(direction){
        return $(allLis()[toShowPosition(direction)]);
      };

      var showNextLi = function(direction){
        toShowLi(direction).show();
      };

      var toHidePosition = function(direction){
        if(direction === 'up'){
          return currentPosition + lisThatCanFitOnPage() - 1;
        } else if(direction === 'down') {
          return currentPosition;
        }
      };

      var toHideLi = function(direction){
        return $(allLis()[toHidePosition(direction)]);
      };

      var hideNextLi = function(direction){
        toHideLi(direction).hide();
      };

      var liToToggle = function(direction){
        if(direction === 'up'){
          return $(menu().find('.jq_smartSelectScrollUp'));
        } else if(direction === 'down') {
          return $(menu().find('.jq_smartSelectScrollDown'));
        }    
      };

      var classToRemove = function(class_to_add){
        if(class_to_add === 'on'){
          return 'off';
        } else if(class_to_add === 'off'){
          return 'on';
        }  
      };

      var turnOffOrOn = function(direction, off_or_on) {
        var li = liToToggle(direction);

        li.addClass(off_or_on);
        li.removeClass(classToRemove(off_or_on));  
      };

      var atFirstPosition = function(){
        return currentPosition === 0;
      };

      var leavingFirstPosition = function(){
        return currentPosition === 1 && lastPosition === 0; 
      };

      var lastScrollablePosition = function(){
        return liCount - lisThatCanFitOnPage() - 2;
      };

      var atLastPosition = function(){    
        return currentPosition === lastScrollablePosition();
      };

      var leavingLastPosition = function(){
        return lastPosition === lastScrollablePosition() && currentPosition === lastScrollablePosition() - 1;
      };

      var toggleScrollClasses = function(){
        if(atFirstPosition()){
          turnOffOrOn('up', 'off');
        } else if(leavingFirstPosition()){
          turnOffOrOn('up', 'on');
        } else if(atLastPosition()){
          turnOffOrOn('down', 'off');
        } else if(leavingLastPosition()){
          turnOffOrOn('down', 'on');
        }
      };

      var toggleLisForScroll = function(direction){
        showNextLi(direction);
        hideNextLi(direction);    
      };

      var incrementPosition = function(){
        lastPosition    = currentPosition;
        currentPosition = currentPosition + 1;
      };

      var decrementPosition = function(){
        lastPosition    = currentPosition;
        currentPosition = currentPosition - 1;
      };

      var scrollUp = function(){
        if(currentPosition > 0){
          toggleLisForScroll('up');
          decrementPosition();

          toggleScrollClasses();
        }
      };

      var scrollDown = function(){
        if(currentPosition < liCount - lisThatCanFitOnPage() - 2){
          toggleLisForScroll('down');

          incrementPosition();
          toggleScrollClasses();
        }
      };

      var scrollUpInterval;
      var scrollDownInterval;

      var startScrollUp = function(){
        scrollUpInterval = setInterval(currentSmartSelectMenu.scrollUp, scrollTime);
      };

      var stopScrollUp = function(){
        clearInterval(scrollUpInterval);
      };

      var startScrollDown = function(){
        scrollDownInterval = setInterval(currentSmartSelectMenu.scrollDown, scrollTime);
      };

      var stopScrollDown = function(){
        clearInterval(scrollDownInterval);
      };

      return {
        open            : open,
        close           : close,
        scrollUp        : scrollUp,
        scrollDown      : scrollDown,
        startScrollUp   : startScrollUp,
        stopScrollUp    : stopScrollUp,
        startScrollDown : startScrollDown,
        stopScrollDown  : stopScrollDown
      };
    }

    var buildSelectedDiv = function(value, html_data){
      var html = "";
      html += "<div data-value='";
      html += value;
      html += "'>";
      html += html_data;
      html += "</div>";  
      return html;  
    }

    var buildSelectedDivFromSelect = function(selected){
      return buildSelectedDiv(selected.val(), selected.html());
    }

    var buildListItem = function(value, html_data){
      var html = "";
      html += "<li class='jq_smartSelect' data-value='";
      html += value; 
      html += "'>"
      html += html_data;
      html += "</li>";
      return html;  
    }

    var buildListItems = function(items){
      var html = "";
      html += "<ul class='jq_smartSelectList' style='position:relative; display:none;'>";
      html += "<li class='jq_smartSelectScrollUp jq_smartSelectScroll off' style='display: none;'>scroll up</li>";
      items.each(function(option){
        html += buildListItem($(items[option]).val(), $(items[option]).html());
      })
      html += "<li class='jq_smartSelectScrollDown jq_smartSelectScroll on' style='display: none;'>scroll down</li>";
      html += "</ul>";
      return html;
    }

    var openingDivList = function(classes, id, name, value){
      var html = "<div class='jq_smartSelectWrap"
      html += " " + classes + "'";
      html += " id='";
      html += id;
      html += "'"
      html += " data-name='";
      html += name;
      html += "'";
      html += " data-selected='";
      html += value;
      html += "'";
      html += "'";
      html += ">";
      return html;  
    }

    var buildHiddenInput = function(name, value){
      var html = "";
      html += "<input type='hidden' name='";
      html += name;
      html += "' value='";
      html += value;
      html += "'>";
      return html;
    }


    var buildSelectListFromSelectTag = function(select){
      var selected = select.find('option:selected');
      var items = select.find('option');
      var classes = select.attr('class')
      var id = select.attr('id');
      var name = select.attr('name').replace('jq_smartSelect', '');

      var html = openingDivList(classes, id, name, selected.val());


      html += buildSelectedDivFromSelect(selected);
      html += buildListItems(items);
      html += buildHiddenInput(name, selected.val());

      html += "</div>";  
      return html;
    }

    var setHiddenInputData = function(clicked_item){
      var wrap    = clicked_item.parents('div.jq_smartSelectWrap')
      var hidden  = wrap.find('input[type="hidden"]');

      wrap.data('selected', clicked_item.data('value'));
      hidden.attr('value', clicked_item.data('value'));
    }

    $.fn.jq_smartSelect = function(options) {
      this.replaceWith(buildSelectListFromSelectTag(this));

      $('div.jq_smartSelectWrap').live('click', function() {
        if (!$(this).find('ul').is(':visible')) {
          currentSmartSelectMenu = new smartSelectMenu($(this), options["scrollEvent"]);
          currentSmartSelectMenu.open();
        } 
      
        return false;
      });

    };
  })( jQuery );
});

// called on one element
// $(this).jq_smartSelect({
//   option_1: option_1_value,
//   option_2: option_2_value
// })

// multiple elements
// $('select.jq_smartSelect').jq_smartSelect({
//   option: option_value,
//   roption: raoption_value
// })