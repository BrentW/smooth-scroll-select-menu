$(document).ready(function() {
  (function( $ ){
    function smoothScrollSelectMenu(selectTag, options) {
      this.options      = options || {};      
      var scrollTime    = options.scrollTime || 200;
      var scrollEvent   = options.scrollEvent || 'hover';

      var hoverToScroll = scrollEvent === 'hover';
      var clickToScroll = !hoverToScroll;
      
      var currentPosition  = 0;
  
      var scrollUpInterval,
          scrollDownInterval,
          selectWrap,
          liCount,
          lastPosition;
      
      var menu = function(){
        return selectWrap.find('ul');
      };

      var isOpen = function(){
        return selectWrap.find('ul').is(':visible');
      };
      
      var isClosed = function(){
        return !isOpen();
      };

      var buildSelectedDiv = function(value, html_data){
        var div = $('<div />');
        div.attr('data-value', value);
        div.html(html_data);
        return div;
      };

      var buildSelectedDivFromSelect = function(selected){
        return buildSelectedDiv(selected.val(), selected.html());
      };
      
      var buildListItem = function(value, html_data){
        var li = $('<li class="jq_smoothScrollSelect" />');
        li.attr('data-value', value);
        li.html(html_data);
        return li;
      };
      
      var buildListItems = function(items){
        var ul = $("<ul class='jq_smoothScrollSelectList' style='display:none;' />");
        ul.append("<li class='jq_smoothScrollSelectScrollUp jq_smoothScrollSelectScroll off' style='display: none;'>scroll up</li>");

        items.each(function(index, item){
          ul.append(buildListItem($(item).val(), $(item).html()));
        });
        
        ul.append("<li class='jq_smoothScrollSelectScrollDown jq_smoothScrollSelectScroll on' style='display: none;'>scroll down</li>");
        return ul;
      };


      var buildHiddenInput = function(name, value){
        var input = $("<input type='hidden' />");
        input.attr('name', name);
        input.val(value);
        return input;
      };

      var buildSelectWrap = function(classes, id, name, selected_value){
         var div = $("<div class='jq_smoothScrollSelectWrap' />");
         div.addClass(classes);
         div.attr('id', id);
         div.attr('data-name', name);
         div.attr('data-selected', selected_value);
         return div;        
      };

      var buildSelectListFromSelectTag = function(){
        var selected  = selectTag.find('option:selected');
        var items     = selectTag.find('option');
        var classes   = selectTag.attr('class');
        var id        = selectTag.attr('id');
        var name      = selectTag.attr('name').replace('jq_smoothScrollSelect', '');         
        var div       = buildSelectWrap(classes, id, name, selected.val());
        
        div.append(buildSelectedDivFromSelect(selected));
        div.append(buildListItems(items));
        div.append(buildHiddenInput(name, selected.val()));

        return div;
      };
      
      
      var replaceSelectWithNewMenu = function(){
        selectWrap = $(buildSelectListFromSelectTag());
        selectTag.replaceWith(selectWrap);
      };
      
      var menuHeight = function(){
        return menu().outerHeight();
      };
      
      var menuTop = function(){
        return menu().offset().top;    
      };
      
      var windowHeight = function(){
        return $(window).height();
      };
      
      var windowOffset = function() {
        return $(window).scrollTop();
      };

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
        return menuHeight > windowHeight;
      };
      
      var menuOverFlowsWindow = function(menuTop, menuHeight, windowHeight){
        return menuTop + menuHeight > windowHeight + windowOffset();
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

      var topPositionCanBeTheCurrentOne = function(lis){
        //checks if current position plus listhatcanfitonpage is less than total lis        
        return currentPosition + lisThatCanFitOnPage() <= lis.length;
      };

      var hideOverflowElementAndOnesBeforeCurrent = function(index, element){
        if(index < currentPosition) {
          $(element).hide();
        } else if(index + 1 > lisThatCanFitOnPage() + currentPosition){
          $(element).hide();
        }
      };

      var setNewCurrentPositionAndHideElementsBefore = function(lis, index, element) {
        currentPosition = lis.length - lisThatCanFitOnPage();
        if(index + 1 < currentPosition) {
          $(element).hide();
        }                    
      };

      var hideOverflowLis = function(){
        //takes into account current position and size of new menu after window is resized bigger
        //checks to see if current position plus listhatcanfitonpage is less than total lis
        //if it is the first shown li is lastposition - listhatcanfitonpage
        //else it is currentposition
      
        var lis = menu().find('li.jq_smoothScrollSelect');
        lis.each(function(index, element){
          if(topPositionCanBeTheCurrentOne(lis)){
            hideOverflowElementAndOnesBeforeCurrent(index, element);
          } else {
            setNewCurrentPositionAndHideElementsBefore(lis, index, element);
          }
        });
      };

      var displayScrollLIs = function() {
        menu().find('li.jq_smoothScrollSelectScroll').show();
        hideOverflowLis();
      };      
      
      var resetLiVisibility = function(){
        menu().find('li').show();
        menu().find('.jq_smoothScrollSelectScroll').hide();
      };
      
      var open = function(){
        menu().show(); 
        resetLiVisibility();
        //setScrollPosition()
        if(menuIsTooLargeForWindow(menuHeight(), windowHeight())){
          displayScrollLIs();      
        }
        if(menuOverFlowsWindow(menuTop(), menuHeight(), windowHeight())) {
          $('html, body').scrollable().animate({scrollTop:menuOverflow()}, 1000);
        }
        
        options.afterOpen(selectWrap);
      };

      var close = function(){
        menu().fadeOut();
      };

      var allLis = function(){
        return $(menu().find('li.jq_smoothScrollSelect'));
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
          return $(menu().find('.jq_smoothScrollSelectScrollUp'));
        } else if(direction === 'down') {
          return $(menu().find('.jq_smoothScrollSelectScrollDown'));
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

      var canScrollUp = function(){
        return currentPosition > 0;
      };

      var scrollUp = function(){
        if(canScrollUp()){
          toggleLisForScroll('up');
          decrementPosition();

          toggleScrollClasses();
        }
      };

      var canScrollDown = function(){
        return currentPosition < liCount - lisThatCanFitOnPage() - 2;
      };

      var scrollDown = function(){
        if(canScrollDown()){
          toggleLisForScroll('down');

          incrementPosition();
          toggleScrollClasses();
        }
      };

      var startScrollUp = function(){
        scrollUpInterval = setInterval(scrollUp, scrollTime);
      };

      var stopScrollUp = function(){
        clearInterval(scrollUpInterval);
      };

      var startScrollDown = function(){
        scrollDownInterval = setInterval(scrollDown, scrollTime);
      };

      var stopScrollDown = function(){
        clearInterval(scrollDownInterval);
      };

      var bindMenuOpenClicks = function(){
        selectWrap.click(function() {
          if (isClosed()) {
             open();
           } 
        
          return false;
        });                
      };

      var setHiddenInputData = function(clicked_item){
        var hidden  = selectWrap.find('input[type="hidden"]');

        selectWrap.data('selected', clicked_item.data('value'));
        hidden.attr('value', clicked_item.data('value'));
      };

      var bindSelectionClicks = function(){
        selectWrap.find('li.jq_smoothScrollSelect').click(function(){
          var self = $(this);
          var div = selectWrap.find('div');

          div.replaceWith(buildSelectedDiv(self.data('value'), self.html()));
          setHiddenInputData(self);
          close();
          
          options.afterSelect(self); //run afterSelect
        });
      };

      var bindClicks = function(){
        bindMenuOpenClicks();
        bindSelectionClicks();
      };
      
      var bindScrollStartEvents = function(){
        selectWrap.find('li.jq_smoothScrollSelectScroll').mouseenter(function(){
          var self = $(this);

          if(self.hasClass('jq_smoothScrollSelectScrollDown')){
            startScrollDown();
          } else if(self.hasClass('jq_smoothScrollSelectScrollUp')){
            startScrollUp();
          }
        });
      };
      
      var bindScrollStopEvents = function(){
        selectWrap.find('li.jq_smoothScrollSelectScroll').mouseleave(function(){
          var self = $(this);

          if(self.hasClass('jq_smoothScrollSelectScrollDown')){
            stopScrollDown();
          } else if(self.hasClass('jq_smoothScrollSelectScrollUp')){
            stopScrollUp();
          }
        });
      };
      
      var bindMouseWheel = function(){
        selectWrap.find('ul.jq_smoothScrollSelectList').mousewheel(function(event, delta) {
          event.preventDefault();
          if(delta > 0){
            scrollUp();
          } else if(delta < 0) {
            scrollDown();
          }
        });        
      };

      var bindHoverToScrollEvents = function(){
        if(hoverToScroll){
          bindScrollStartEvents();
          bindScrollStopEvents();
        }        
      };
      
      var bindClickToScrollEvents = function(){
        if(clickToScroll){
          selectWrap.find('li.jq_smoothScrollSelectScroll').click(function(){
            var self = $(this);
        
            if(self.hasClass('jq_smoothScrollSelectScrollDown')){
              scrollDown();
            } else if(self.hasClass('jq_smoothScrollSelectScrollUp')){
              scrollUp();
            }
          });
        }
      };
      
      var bindScrollEvents = function(){
        bindHoverToScrollEvents();
        bindClickToScrollEvents();
        bindMouseWheel();
      };

      var bindCloseEvents = function(){
        selectWrap.mouseleave(function(event){
          if(isOpen()){
            close();
          }
        });
      };

      var bindEvents = function(){
        bindClicks();             
        bindScrollEvents();
        bindCloseEvents();
      };

      var initialize = function(){
        replaceSelectWithNewMenu();
        liCount = menu().find('li').length;
        bindEvents();
      };
      
      initialize();
    }
    
    $.fn.jq_smoothScrollSelect = function(options) {
      $(this).each(function(index, selectTag){        
        smoothScrollSelectMenu($(selectTag), options);
      });
    };
  })( jQuery );
});