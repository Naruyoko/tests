// ==UserScript==
// @name         SiIvaGunner wiki linker
// @namespace    http://tampermonkey.net/
// @version      2024-05-29
// @description  Links SiIvaGunner wiki when watching the videos
// @author       Naruyoko
// @match        https://www.youtube.com/watch?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
  var intervalId=setInterval(function(){
    var titleElem=document.querySelector("#title > h1 > yt-formatted-string");
    if (!titleElem) return;
    if (document.querySelector("#channel-name a").href=='https://www.youtube.com/@SiIvaGunner'){
      var linkElem=document.createElement("a");
      linkElem.className="yt-simple-endpoint style-scope";
      linkElem.href="https://siivagunner.fandom.com/wiki/"+titleElem.textContent;
      linkElem.target="_blank";
      titleElem.before(linkElem);
      linkElem.appendChild(titleElem);
    }
    clearInterval(intervalId)
  },1000);
})();