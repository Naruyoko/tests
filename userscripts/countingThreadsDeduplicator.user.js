// ==UserScript==
// @name     Counting Threads Deduplicator
// @namespace  http://tampermonkey.net/
// @version    2024-02-15
// @description  try to take over the world!
// @author     Naruyoko
// @match    https://old.reddit.com/r/counting/comments/
// @icon     https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant    none
// ==/UserScript==

(function() {
  'use strict';
  var m=new Set();
  for (var e of document.querySelectorAll("#siteTable > div.thing")){
    var d=e.dataset["permalink"].split("/")[4];
    if (m.has(d)) e.style.display="none";
    m.add(d);
  }
  console.log(m);
})();
