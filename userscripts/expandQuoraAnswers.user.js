// ==UserScript==
// @name         Expand Quora Answers
// @namespace    http://tampermonkey.net/
// @version      2025-07-21
// @description  Adds a button to expand answers "read more" (needs scrolling first)
// @author       Naruyoko
// @match        https://*.quora.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=quora.com
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
  if (document.querySelector("#mainContent > div.q-box.qu-pb--small > div > span > span > div > div > div.puppeteer_test_question_title")){
    document.querySelector("#mainContent > div:nth-child(1)").outerHTML+="<button onclick=\"document.querySelectorAll(&quot;span.qt_read_more&quot;).forEach(e=>e.click())\">Expand</button>";
  }
})();