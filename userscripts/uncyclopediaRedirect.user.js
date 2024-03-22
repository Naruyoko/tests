// ==UserScript==
// @name         Uncyclopedia - Better mobile redirect
// @version      2024-03-22
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
  setTimeout(function(){
      if (window.location.origin=="https://m.ansaikuropedia.org"){
          document.querySelector(".stopMobileRedirectToggle").style.display="none";
      }else{
          var e=document.querySelector(".stopMobileRedirectToggle>a");
          //eslint-disable-next-line no-undef
          e.href=e.href.replace(encodeURI("メインページ"),encodeURI(mw.config.get("wgPageName")));
      }
  },100);
})();