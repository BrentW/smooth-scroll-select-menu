// //      uses kswedberg's jquery-smooth-scroll for scrollable method

$(document).ready(function() {
  (function( $ ){
    function smartSelectMenu(selectTag, options) {
      this.options = options || new Object();      
      var scrollTime = options.scrollTime || 200;
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
        var html = "";
        html += "<div data-value='";
        html += value;
        html += "'>";
        html += html_data;
        html += "</div>";  
        return html;  
      };

      var buildSelectedDivFromSelect = function(selected){
        return buildSelectedDiv(selected.val(), selected.html());
      };

      var buildListItem = function(value, html_data){
        var html = "";
        html += "<li class='jq_smartSelect' data-value='";
        html += value; 
        html += "'>"
        html += html_data;
        html += "</li>";
        return html;  
      };

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
      };

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
      };

      var buildHiddenInput = function(name, value){
        var html = "";
        html += "<input type='hidden' name='";
        html += name;
        html += "' value='";
        html += value;
        html += "'>";
        return html;
      };


      var buildSelectListFromSelectTag = function(){
        var selected = selectTag.find('option:selected');
        var items = selectTag.find('option');
        var classes = selectTag.attr('class')
        var id = selectTag.attr('id');
        var name = selectTag.attr('name').replace('jq_smartSelect', '');

        var html = openingDivList(classes, id, name, selected.val());

        html += buildSelectedDivFromSelect(selected);
        html += buildListItems(items);
        html += buildHiddenInput(name, selected.val());

        html += "</div>";  
        return html;
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
      
      var windowHeight= function(){
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
        selectWrap.find('li.jq_smartSelect').click(function(){
          var self = $(this);
          var div = selectWrap.find('div');

          div.replaceWith(buildSelectedDiv(self.data('value'), self.html()))
          setHiddenInputData(self);
          close();
        });
      };

      var bindClicks = function(){
        bindMenuOpenClicks();
        bindSelectionClicks();
      };
      
      var bindScrollStartEvents = function(){
        selectWrap.find('li.jq_smartSelectScroll').mouseenter(function(){
          var self = $(this);

          if(self.hasClass('jq_smartSelectScrollDown')){
            startScrollDown();
          } else if(self.hasClass('jq_smartSelectScrollUp')){
            startScrollUp();
          }
        });
      };
      
      var bindScrollStopEvents = function(){
        selectWrap.find('li.jq_smartSelectScroll').mouseleave(function(){
          var self = $(this);

          if(self.hasClass('jq_smartSelectScrollDown')){
            stopScrollDown();
          } else if(self.hasClass('jq_smartSelectScrollUp')){
            stopScrollUp();
          }
        });
      };
      
      var bindMouseWheel = function(){
        selectWrap.find('ul.jq_smartSelectList').live('mousewheel', function(event, delta) {
          event.preventDefault();
          if(delta > 0){
            scrollUp();
          } else if(delta < 0) {
            scrollDown();
          }
        });        
      };
      
      var bindScrollEvents = function(){
        bindScrollStartEvents();
        bindScrollStopEvents();
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
    
    $.fn.jq_smartSelect = function(options) {
      $(this).each(function(index, selectTag){        
        new smartSelectMenu($(selectTag), options);
      });
    };
  })( jQuery );
});