Smooth Scroll Select Menu
=============
This plugin was created in order to style select tags with extremely large amounts of options.


Features
-------

* Changes select and option tags to a ul with lis tied to a hidden input.
* Scrolls page down to the top of select to allow the greatest number of options to show on page.
* Adds scroll lis to the top and bottom of the list if the list is too big for the page.
* Includes click to scroll and hover to scroll behaviors. Hover is the default.
* Allows hover to scroll time to be adjusted.
* Supports after select and after open callbacks.
* Select classes and Id are transferred to new div wrapper.
* Degrades gracefully when javascript is disabled.

Usage
-------

Hover to scroll example:

    	$('select.classToChange').jq_smoothScrollSelect({
			scrollTime: 200,
			afterSelect: function(clicked_li){
				alert('You selected ' + clicked_li.html() + '!');
			},
			afterOpen: function(selectWrap){
				//alert('Open!');
			}
		});

Click to scroll example:

		$('select.classToChange').jq_smoothScrollSelect({
			scrollEvent: 'click'
		});

Demo
-------
[http://brentw.github.com/2011/03/06/smooth-scroll-select-menu-jquery-plugin.html
](http://brentw.github.com/2011/03/06/smooth-scroll-select-menu-jquery-plugin.html)

Requirements
-------

* [jQuery 1.4](http://docs.jquery.com/Downloading_jQuery)
* [Karl Swedberg jquery-smooth-scroll](https://github.com/kswedberg/jquery-smooth-scroll)
* [jquery-mousewheel](http://plugins.jquery.com/project/mousewheel) (optional)

Thank You
-------

* Karl Swedberg - provided the smooth scrolling functionality.
[https://github.com/kswedberg/jquery-smooth-scroll](https://github.com/kswedberg/jquery-smooth-scroll)

* Kyle Haskins - set the crazy requirements for such a plugin to be created.
[http://www.kylehaskins.com](http://www.kylehaskins.com)

* Brandon Dewitt - suggested this code be pluginized.
[http://twitter.com/abrandoned](http://www.kylehaskins.com)
