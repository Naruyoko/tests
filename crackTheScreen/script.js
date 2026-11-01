window.onload=function (){
  let canvas=/** @type {HTMLCanvasElement} */(document.getElementById("canvas"));
  let ctx=canvas.getContext("2d");
  ctx.strokeStyle="black";
  canvas.onclick=e=>{
    document.title="🕸️";
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} t
     * @param {number} p
     * @param {number} j
     */
    function impact(x,y,t,p,j){
      let n=Math.max(Math.floor(Math.random()*Math.log(j/5))+1,1);
      do {
        let a=j*(Math.random()*(n-1)+1)/n;
        let l=j>10?j*(Math.random()*2+1)/3:j;
        let t2=t+p*(Math.random()*2-1);
        let x2=x+l*Math.cos(t2);
        let y2=y+l*Math.sin(t2);
        ctx.moveTo(x,y);
        ctx.lineTo(x2,y2);
        if (a>l) impact(x2,y2,t2,Math.PI/2,a-l);
        j-=a;
      }while (--n);
    }
    ctx.beginPath();
    impact(e.clientX,e.clientY,0,Math.PI,50*Math.exp(Math.random()*3));
    ctx.stroke();
  }
  function updateDimensions(){
    let rect=canvas.getBoundingClientRect();
    canvas.width=rect.width;
    canvas.height=rect.height;
  }
  document.body.onresize=updateDimensions;
  updateDimensions();
}