// ==UserScript==
// @name         TV Tropes purple visited links
// @namespace    http://tampermonkey.net/
// @version      2026-10-24
// @description  Distinguish visited links purple instead of blue
// @author       Naruyoko
// @match        https://tvtropes.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tvtropes.org
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
  window.addEventListener("load",_=>document.head.innerHTML+=
    "<style>\
      :root:not(.night-vision) .text-tt-link:visited,\
			:root:not(.night-vision) :where(#main-article, .tt-wiki) a:visited,\
			:root:not(.night-vision) .subpage-link:visited {\
        color: #7600b1;\
      }\
			:root.night-vision .text-tt-link:visited,\
      :root.night-vision :where(#main-article, .tt-wiki) a:visited,\
		  :root.night-vision .subpage-link:visited {\
        color: #9d00ec;\
      }\
    </style>");
})();