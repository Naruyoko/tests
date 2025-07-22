// ==UserScript==
// @name         Expand TV Tropes Notes
// @namespace    http://tampermonkey.net/
// @version      2025-07-22
// @description  Adds a button to expand all notes on TV Tropes
// @author       Naruyoko
// @match        https://tvtropes.org/pmwiki/pmwiki.php/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tvtropes.org
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
  document.querySelector("nav.body-options").innerHTML+="<button onclick=\"document.querySelectorAll(&quot;span[isnote=true]&quot;).forEach(e=>e.style.display=&quot;inline&quot;)\">Expand notes</button>";
})();