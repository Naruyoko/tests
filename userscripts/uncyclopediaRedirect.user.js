// ==UserScript==
// @name         Uncyclopedia - Better mobile redirect
// @version      2024-03-29
// @description  try to take over the world!
// @author       Naruyoko
// @match        https://ja.uncyclopedia.info/wiki/*
// @match        https://ansaikuropedia.org/wiki/*
// @match        https://ja.ansaikuropedia.org/wiki/*
// @match        https://ja.uncyclomedia.org/wiki/*
// @match        https://ja.uncyc.org/wiki/*
// @match        https://xn--cckacd9c8a6ing0g5b.com/wiki/*
// @match        https://アンサイクロペディア.com/wiki/*
// @match        https://m.ansaikuropedia.org/wiki/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var t=setInterval(function(){
      var e=document.querySelector(".stopMobileRedirectToggle>a");
      // eslint-disable-next-line no-undef
      var mwObj=typeof mw!="undefined"?mw:typeof unsafeWindow!="undefined"?unsafeWindow.mw:null;
      if (!e||!mwObj||!mwObj.config.get("skin")) return;
      if (mwObj.config.get("skin")=="minerva"){
        e.href="https://ja.uncyclopedia.info/index.php?title="+encodeURI(mwObj.config.get("wgPageName"))+"&mobileaction=toggle_view_desktop";
        e.children[0].innerHTML="<s>モバイル</s>デスクトップビューに切り替え";
      }else{
        e.href="https://m.ansaikuropedia.org/index.php?title="+encodeURI(mwObj.config.get("wgPageName"))+"&mobileaction=toggle_view_mobile";
      }
      clearInterval(t);
    },0);
  })();