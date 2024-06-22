// ==UserScript==
// @name         SiIvaGunner wiki linker
// @namespace    http://tampermonkey.net/
// @version      2024-06-22
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
      var channelLinkElem=document.querySelector("ytd-watch-metadata #channel-name a");
      if (!channelLinkElem) return;
      if (channelLinkElem.href=='https://www.youtube.com/@SiIvaGunner'){
        linkElem.href="https://siivagunner.fandom.com/wiki/"+encodeURIComponent(titleElem.textContent);
        linkElem.style.pointerEvents="auto";
        linkElem.style.cursor="pointer";
      }else if (channelLinkElem.href=='https://www.youtube.com/@TimmyTurnersGrandDad'){
        linkElem.href="https://ttgd.fandom.com/wiki/"+encodeURIComponent(titleElem.textContent);
        linkElem.style.pointerEvents="auto";
        linkElem.style.cursor="pointer";
      }else{
        linkElem.href="";
        linkElem.style.pointerEvents="none";
        linkElem.style.cursor="default";
      }
    }
    new MutationObserver(updateLink).observe(titleElem,{subtree:true,childList:true});
    clearInterval(intervalId);
    updateLink();
  },1000);
})();