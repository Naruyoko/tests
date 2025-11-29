// ==UserScript==
// @name         TV Tropes purple visited links
// @namespace    http://tampermonkey.net/
// @version      2025-11-29
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
      .article-content a:visited, .comment-box a:visited, .launch-pad-draft a:visited {\
        color: #7600b1;\
      }\
      body > #user-prefs.night-vision ~ #main-container #main-entry .article-content a:not(.createlink):visited {\
        color: #9d00ec;\
      }\
    </style>");
})();