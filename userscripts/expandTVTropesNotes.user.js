// ==UserScript==
// @name         Expand TV Tropes Notes
// @namespace    http://tampermonkey.net/
// @version      2026-10-24
// @description  Adds a button to expand all notes on TV Tropes
// @author       Naruyoko
// @match        https://tvtropes.org/pmwiki/pmwiki.php/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tvtropes.org
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
  setTimeout(function(){
    var e=document.createElement("button");
    e.onclick=()=>document.querySelectorAll("span[isnote=true]").forEach(e=>e.style.display="inline");
    e.textContent="Expand Notes";
    e.style.float="right";
    e.style.border="1px solid gray";
    e.style.margin="0 0 8px 8px";
    document.querySelector("nav.subpage-links").after(e);
  },1000);
})();