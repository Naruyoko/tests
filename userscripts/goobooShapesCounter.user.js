// ==UserScript==
// @name        Gooboo Shapes Counter
// @namespace   Violentmonkey Scripts
// @icon        https://tendsty.github.io/gooboo/favicon-32x32.png
// @version     2026-11-07
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
      let target=k.substr(4);
      let n=document.querySelector("."+k).closest("span").cloneNode(true);
      n.querySelector("i").innerHTML=`<span style="position:absolute;font-size:10px;margin:auto;background-color:#ffff0080;color:black;user-select:text;">${target}</span>`;
      n.ondblclick=async e=>{
        if (!e.altKey) return;
        let store=document.getElementById("app").__vue__.$store,
            getGrid=()=>store._modules.root.state.gallery.shapeGrid,
            canAfford=()=>store.getters['currency/canAfford']({gallery_motivation:1});
        for (let y=0;y<getGrid().length;y++){
          for (let x=0;x<getGrid()[y].length;x++){
            if (getGrid()[y][x]!=target) continue;
            let y2=y;
            while (canAfford()&&y2&&getGrid()[y2-1][x]!=target)
              await store.dispatch('gallery/switchShape',{fromX:x,fromY:y2,toX:x,toY:--y2});
            if (y2&&getGrid()[y2-1][x]==target) continue;
            let x2=x;
            while (canAfford()&&x2&&getGrid()[y2][x2-1]!=target)
              await store.dispatch('gallery/switchShape',{fromX:x2,fromY:y2,toX:--x2,toY:y2});
          }
        }
        if (canAfford()) await store.dispatch('gallery/clickShape',{x:0,y:0});
      };
      d.appendChild(n);
      d.appendChild(document.createTextNode(v));
    });
  },100);
});