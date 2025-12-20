// ==UserScript==
// @name         TV Tropes purple visited links
// @namespace    http://tampermonkey.net/
// @version      2025-12-20
// @description  Distinguish visited links purple instead of blue
// @author       Naruyoko
// @match        https://tvtropes.org/pmwiki/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tvtropes.org
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
  window.addEventListener("load",_=>document.head.innerHTML+=
    "<style>\
      .article-content a:not(.createlink):visited, .comment-box a:visited, .launch-pad-draft a:visited,\
			div#main-container div#main-content #main-entry .section-links a:visited,\
			ul.subpage-links > li > a:visited {\
        color: #7600b1;\
      }\
      body > #user-prefs.night-vision ~ #main-container #main-entry .article-content a:not(.createlink):visited,\
      body:not(.skinned) > #user-prefs.night-vision ~ * ul.subpage-links li > a:visited,\
		  body > #user-prefs.night-vision ~ #main-container #main-content #main-entry .section-links ul > li > a:visited {\
        color: #9d00ec;\
      }\
    </style>");
})();