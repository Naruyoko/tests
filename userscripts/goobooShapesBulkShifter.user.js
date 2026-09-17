// ==UserScript==
// @name        Gooboo Shapes Bulk Shifter
// @namespace   Violentmonkey Scripts
// @icon        https://tendsty.github.io/gooboo/favicon-32x32.png
// @version     2026-09-17
//
// @match       https://tendsty.github.io/gooboo/
// @grant       none
//
// @author      Naruyoko
// @description Adds a button that shifts a shape in the Shapes minigame below the table. Not optimized for Motivation use.
// ==/UserScript==
window.addEventListener("load",()=>{
  let b=document.createElement("button");
  b.textContent="BULK SHIFT";
  b.style="color:black;background-color:gold;padding:8px;";
  b.onclick=async ()=>{
    let store=document.getElementById("app").__vue__.$store,
        getGrid=()=>store._modules.root.state.gallery.shapeGrid,
        canAfford=()=>store.getters['currency/canAfford']({gallery_motivation:1}),
        target=prompt();
    for (let y=0;y<getGrid().length;y++){
      for (let x=0;x<getGrid()[y].length;x++){
        if (getGrid()[y][x]!=target) continue;
        let y2=y;
        while (canAfford()&&y2&&getGrid()[y2-1][x]!=target)
          await store.dispatch('gallery/switchShape',{fromX:x,fromY:y2,toX:x,toY:--y2});
        let x2=x;
        while (canAfford()&&x2&&getGrid()[y2][x2-1]!=target)
          await store.dispatch('gallery/switchShape',{fromX:x2,fromY:y2,toX:--x2,toY:y2});
      }
    }
  };
  setInterval(()=>{
    if (b.isConnected) return;
    document.getElementById("galleryShape_0_0")?.closest("table")?.after(b);
  },100);
});