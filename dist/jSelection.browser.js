(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.jSelection = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports=function(t){function e(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,e),i.l=!0,i.exports}var n={};return e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,e,n){Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:n})},e.n=function(t){var n=t&&t.__esModule?function(){return t["default"]}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=3)}([function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var i=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),o=n(1),a=function(){function t(e,n){r(this,t),this.range_=null,this.window_=null,this.range_=e,this.window_=n}return i(t,[{key:"getTextNodes",value:function(){function t(t,e){var n=t.splitText(e);return n.startPosition=t.startPosition+o.XString.from(t.data).compact().length,n.endPosition=t.endPosition,t.endPosition=n.startPosition-1,n}if(this.nodes_)return this.nodes_;var e=this.range_.startContainer,n=this.range_.endContainer,r=this.range_.startOffset,i=this.range_.endOffset,a=this.window_.getNodes(),s=a.indexOf(e),u=t(e,r);u.length>0&&a.splice(s+1,0,u),n===e&&(n=u,i-=r);var l=a.indexOf(n),c=t(n,i);return c.length>0&&a.splice(l+1,0,c),this.nodes_=a.slice(s+1,l+1),this.nodes_}},{key:"getOccurrence",value:function(){var t=this.range_.endContainer;if(3!=t.nodeType||3!=this.range_.startContainer.nodeType)throw new Error("illegal selection");var e=this.range_.endOffset,n=o.XString.from(t.substringData(0,e)).compact(),r=n?n.length:0;if(r<1)throw new Error("illegal selection");var i=o.XString.from(this.range_.toString()).compact(),a=this.window_.getText().substr(0,t.startPosition+r),s=o.XString.from(a).find(i);if(s&&s.length>0)return s[s.length-1];throw new Error("illegal selection")}},{key:"getContent",value:function(){return this.range_.toString()}},{key:"getSelection",value:function(){var t=this.window_.getWindow().getSelection();return t.rangeCount<1&&t.addRange(this.range_),t}},{key:"empty",value:function(){var t=this.window_.getWindow();t.getSelection().empty?t.getSelection().empty():t.getSelection().removeAllRanges&&t.getSelection().removeAllRanges()}},{key:"cancel",value:function(){var t=this.getTextNodes(),e=t[0],n=t[t.length-1];e&&e.parentNode&&e.parentNode.normalize(),n&&n.parentNode&&n.parentNode.normalize()}}]),t}();e.XSelection=a},function(t,e){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var r=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),i=function(){function t(e){n(this,t),this.str_=e}return r(t,[{key:"indexOf",value:function(t){for(var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,n=0,r=-2;n<e&&r!==-1;)r=this.str_.indexOf(t,r+1),n++;return r}},{key:"find",value:function(t){var e=0,n=-2,r=[];if(t.length<1)return r;for(;n!==-1&&(n=this.str_.indexOf(t,n+1),!(n<0));)r.push({nth:++e,position:n});return r}},{key:"compact",value:function(){return this.str_.replace(/\s+/gm,"")}},{key:"trim",value:function(){return this.str_.replace(/(^\s*)|(\s*$)/g,"")}}],[{key:"from",value:function(e){return new t(e)}}]),t}();e.XString=i},function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var i=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),o=n(0),a=n(1),s=function(){function t(e){r(this,t),this.selection_=null,this.document_=e.ownerDocument,this.init(e)}return i(t,[{key:"select",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];this.selection_&&this.selection_.cancel();var r=this.getWindow(),i=r.getSelection();if(!t)return i.rangeCount>0?this.selection_=new o.XSelection(r.getSelection().getRangeAt(0),this):null;var a=this.rangeFrom_(t,e);return n&&(i.removeAllRanges(),i.addRange(a)),this.selection_=new o.XSelection(a,this)}},{key:"rangeFrom_",value:function(t){function e(t,e,n){for(var r=0,i=0;r<e+n;i++)/\s+/m.test(t[i])||r++;return i-n}var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;if(t){var r=this.text,i=this.nodes,o=this.document_.createRange(),s=a.XString.from(t).compact(),u=a.XString.from(r).indexOf(s,n||1);if(u>-1){for(var l=u+i[0].startPosition,c=l+s.length,f=null,g=null,h=0;h<i.length;h++){var d=i[h];if(!f&&d.endPosition>=l&&(f=i[h]),d.startPosition>=c){g=i[h-1];break}}if(null!==f){g=g||i[i.length-1];var v=e(f.data,l-f.startPosition,1),p=e(g.data,c-g.startPosition,0);o.setStart(f,v),o.setEnd(g,p)}}return o}return this.document_.createRange()}},{key:"init",value:function(t){function e(t){function e(t){if(3===t.nodeType&&/\S/.test(t.data))n.push(t);else if(1===t.nodeType&&!r.test(t,null))for(var i=0,o=t.childNodes.length;i<o;++i)e(t.childNodes[i])}var n=[],r={elements:["applet","area","base","basefont","bdo","button","frame","frameset","iframe","head","hr","img","input","link","map","meta","noframes","noscript","optgroup","option","param","script","select","style","textarea","title"],test:function(t,e){var n=e||this.elements;return n.indexOf(t.tagName.toLowerCase())>-1}};return e(t),n}var n=e(t),r=0,i="";n.forEach(function(t){t.startPosition=r;var e=a.XString.from(t.data).compact();i+=e,r+=e.length,t.endPosition=r-1}),this.text=i,this.nodes=n}},{key:"getNodes",value:function(){return this.nodes}},{key:"getText",value:function(){return this.text}},{key:"getWindow",value:function(){return this.document_.defaultView}}],[{key:"from",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:document.body;return new t(e)}}]),t}();e.XWindow=s},function(t,e,n){"use strict";var r=n(2);e.XWindow=r.XWindow;var i=n(0);e.XSelection=i.XSelection}]);
},{}]},{},[1])(1)
});