// ==UserScript==
// @name        Gooboo Shapes Counter
// @namespace   Violentmonkey Scripts
// @icon        https://tendsty.github.io/gooboo/favicon-32x32.png
// @version     2026-09-24
//
// @match       https://tendsty.github.io/gooboo/
// @grant       none
//
// @author      Naruyoko
// @description Shows the counts of shapes in the Shapes minigame below the table in decreasing order
// ==/UserScript==
window.addEventListener("load",()=>{
  let d=document.createElement("div");
  let p;
  setInterval(()=>{
    let t=document.getElementById("galleryShape_0_0")?.closest("table");
    if (!t){
      p=null;
      return;
    }
    let a=[...
      [...t.getElementsByTagName("i")]
        .map(e=>[...e.classList].find(s=>s.startsWith("mdi-")))
        .reduce((a,e)=>a.set(e,(a.get(e)??0)+1),new Map())
    ].sort(([a,b],[c,d])=>d-b||(-1)**(a<c));
    if (p+""==a+"") return;
    t.after(d);
    [...d.childNodes].forEach(e=>e.remove());
    (p=a).forEach(([k,v])=>{
      let n=document.querySelector("."+k).closest("span").cloneNode(true);
      n.querySelector("i").innerHTML=`<span style="position:absolute;font-size:10px;margin:auto;background-color:#ffff0080;color:black;user-select:text;">${k.substr(4)}</span>`;
      d.appendChild(n);
      d.innerHTML+=v;
    });
  },100);
});