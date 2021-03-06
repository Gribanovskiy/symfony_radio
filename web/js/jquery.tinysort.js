/**
 * jQuery plugin wrapper for TinySort
 * Does not use the first argument in tinysort.js since that is handled internally by the jQuery selector.
 * Sub-selections (option.selector) do not use the jQuery selector syntax but regular CSS3 selector syntax.
 * @summary jQuery plugin wrapper for TinySort
 * @version 2.2.2
 * @requires tinysort
 * @license MIT/GPL
 * @author Ron Valstar (http://www.sjeiti.com/)
 * @copyright Ron Valstar <ron@ronvalstar.nl>
 */
!function(a){"use strict";"function"==typeof define&&define.amd?define(["jquery","tinysort"],a):jQuery&&!jQuery.fn.tsort&&a(jQuery,tinysort)}(function(a,b){"use strict";a.tinysort={defaults:b.defaults},a.fn.extend({tinysort:function(){var a,c,d=Array.prototype.slice.call(arguments);d.unshift(this),a=b.apply(null,d),c=a.length;for(var e=0,f=this.length;f>e;e++)c>e?this[e]=a[e]:delete this[e];return this.length=c,this}}),a.fn.tsort=a.fn.tinysort});