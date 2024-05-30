// ==UserScript==
// @name         SiIvaGunner wiki linker
// @namespace    http://tampermonkey.net/
// @version      2024-05-30
// @description  Links SiIvaGunner wiki when watching the videos
// @author       Naruyoko
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
  var intervalId=setInterval(function(){
    var titleElem=document.querySelector("#title > h1 > yt-formatted-string");
    if (!titleElem) return;
    var linkElem=document.createElement("a");
    linkElem.className="yt-simple-endpoint style-scope";
    linkElem.target="_blank";
    titleElem.before(linkElem);
    linkElem.appendChild(titleElem);
    function updateLink(){
      if (document.querySelector("#channel-name a").href=='https://www.youtube.com/@SiIvaGunner'){
        linkElem.href="https://siivagunner.fandom.com/wiki/"+titleElem.textContent;
        linkElem.style.pointerEvents="auto";
        linkElem.style.cursor="pointer";
      }else{
        linkElem.href="";
        linkElem.style.pointerEvents="none";
        linkElem.style.cursor="default";
      }
    }
    updateLink();
    new MutationObserver(updateLink).observe(titleElem,{subtree:true,childList:true});
    clearInterval(intervalId)
  },1000);
})();