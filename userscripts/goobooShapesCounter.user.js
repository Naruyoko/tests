// ==UserScript==
// @name        Gooboo Shapes Counter
// @namespace   Violentmonkey Scripts
// @icon        https://tendsty.github.io/gooboo/favicon-32x32.png
// @version     2026-08-30
//
// @match       https://tendsty.github.io/gooboo/
// @grant       none
//
// @author      Naruyoko
// @description Shows the counts of shapes in the Shapes minigame below the table in decreasing order
// ==/UserScript==
window.addEventListener("load",()=>{
  let d=document.createElement("div");
  setInterval(()=>{
    let t=document.getElementById("galleryShape_0_0")?.closest("table");
    if (!t) return;
    [...d.childNodes].forEach(e=>e.remove());
    t.after(d);
    [...
      [...t.getElementsByTagName("i")]
        .map(e=>[...e.classList].find(s=>s.startsWith("mdi-")))
        .reduce((a,e)=>a.set(e,(a.get(e)??0)+1),new Map())
    ]
      .sort(([a,b],[c,d])=>d-b||(-1)**(a<c))
      .forEach(([k,v])=>d.appendChild(document.querySelector("."+k).closest("span").cloneNode(true))&&(d.innerHTML+=v));
  },100);
});