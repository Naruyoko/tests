/** @type {HTMLCanvasElement} */
let canvas;
/** @type {HTMLImageElement} */
let cursorImage;
/** @type {{x:number,y:number}} */
let userPos={x:0,y:0};
let pathDuration=500;
/** @type {{t:number,x:number,y:number}[]} */
let userPath;
const UFDEG=6;
/** @type {number[][]} */
let pascalmat;
/**
 * @typedef {{
 *   xPoly:number[],
 *   yPoly:number[],
 *   baseT:number,
 *   target:{dur:number,x:number,y:number},
 *   alpha:number
 * }} Cursor */
/** @type {Cursor[]} */
let cursors;
window.onload=function (){
  // @ts-ignore
  canvas=document.getElementById("canvas");
  cursorImage=new Image();
  cursorImage.src="./Mouse_pointer_small.png";
  cursorImage.onload=init;
  canvas.onmousemove=e=>userPos={x:e.clientX,y:e.clientY};
  function updateDimensions(){
    let rect=canvas.getBoundingClientRect();
    canvas.width=rect.width;
    canvas.height=rect.height;
  }
  document.body.onresize=updateDimensions;
  updateDimensions();
}
//高級言語を使っていて重要度も低いため並列処理や局所性は深く考えない
/**
 *
 * @param {number[][]} A
 * @returns {number[][]}
 */
function mattranspose(A){
  return Array.from({length:A[0].length},(_,i)=>Array.from({length:A.length},(_,j)=>A[j][i]));
}
/**
 *
 * @param {number[][]} A
 * @param {number[][]} B
 * @returns {number[][]}
 */
function matinvmul(A,B){
  if (A.length!=B.length) throw Error("Mismatched dimensions.");
  let AAs=Array.from({length:A.length},(_,i)=>A[i].concat(B[i]));
  /** @type {number[][]} */
  let AAd=[];
  for (let i=0;i<A.length;i++){
    let p=AAs.findIndex(e=>e[i]);
    if (p==-1) throw Error("Not invertible.");
    let P=AAs.splice(p,1)[0];
    for (let j=P.length-1;j>=i;j--) P[j]/=P[i];
    AAd.push(P);
    for (let R of AAs) for (let j=P.length-1;j>=i;j--) R[j]-=R[i]*P[j];
  }
  let C=AAd.map(e=>e.slice(A.length));
  for (let a=A.length-1;a>=0;a--)
    for (let i=0;i<a;i++)
      for (let j=0;j<B[0].length;j++)
        C[i][j]-=AAd[i][a]*C[a][j];
  return C;
}
/**
 *
 * @template {keyof any} K
 * @param {{[k in K]:number}[]} data
 * @param {K} inKey
 * @param {number} degrees
 * @returns {number[][]}
 */
function polyreggrammat(data,inKey,degrees){
  let powersums=Array.from({length:degrees*2+1},(_,i)=>data.reduce((a,e)=>a+e[inKey]**i,0));
  return Array.from({length:degrees+1},(_,i)=>powersums.slice(i,i+degrees+1));
}
/**
 *
 * @template {keyof any} K
 * @param {{[k in K]:number}[]} data
 * @param {K} inKey
 * @param {K[]} outKeys
 * @param {number} degrees
 * @returns {number[][]}
 */
function polyregxcovmat(data,inKey,outKeys,degrees){
  return Array.from({length:degrees+1},(_,i)=>outKeys.map(k=>data.reduce((a,e)=>a+e[inKey]**i*e[k],0)));
}
/**
 *
 * @param {number[]} bs
 * @param {number} x
 * @returns {number}
 */
function polya(bs,x){
  let y=0;
  for (let a=bs.length-1;a>=0;a--) y=bs[a]+x*y;
  return y;
}
/**
 *
 * @param {number[]} poly
 * @param {number} x
 * @returns {number[]}
 */
function polyshift(poly,x){
  return poly
    .map((_,i)=>poly.reduce((a,e,j)=>a+x**(j-i)*pascalmat[i][j]*e,0)) //derivs
    .map((e,i)=>e/pascalmat[i][i]);
}
/**
 *
 * @param {number} x
 * @param {number} y
 * @returns {[number,number,number]}
 */
function magnorm(x,y){
  if (x==0&&y==0) return [0,0,0];
  let mag=Math.sqrt(x**2+y**2);
  return [mag,x/mag,y/mag];
}
/**
 *
 * @param {number} t
 * @param {number} alpha
 * @returns {Cursor}
 */
function newCursor(t,alpha){
  let x0=Math.random()*canvas.width;
  let y0=Math.random()*canvas.height;
  return {
    xPoly:[x0,...Array(4).fill(0)],
    yPoly:[y0,...Array(4).fill(0)],
    baseT:t,
    target:{
      dur:0,
      x:x0,
      y:y0
    },
    alpha
  };
}
function init(){
  let t=Date.now();
  pascalmat=[Array(UFDEG+1).fill(1)];
  for (let i=0;i<UFDEG;i++) pascalmat.push(pascalmat[i].map((e,j)=>e*(j-i)));
  userPath=Array.from({length:UFDEG+1},(_,i)=>({t:Math.floor(t-(UFDEG-i)/UFDEG*pathDuration),...userPos}));
  cursors=Array.from({length:50},_=>newCursor(t,1));
  requestAnimationFrame(loop);
}
function loop(){
  let t=Date.now();
  if (userPath.length&&userPath[0].t==t) userPath.pop();
  userPath.push({t,...userPos});
  userPath.splice(0,userPath.findIndex((e,i)=>i>=userPath.length-(UFDEG+1)||e.t>=t-pathDuration));
  let M=userPath.map(e=>({...e,t:e.t-t}));
  let K=polyreggrammat(M,"t",UFDEG);
  let C=polyregxcovmat(M,"t",["x","y"],UFDEG);
  let [uxPolyf,uyPolyf]=mattranspose(matinvmul(K,C));
  let ctx=canvas.getContext("2d");
  ctx.fillStyle="white";
  ctx.globalAlpha=1;
  ctx.fillRect(0,0,canvas.width,canvas.height);
  /*
  ctx.strokeStyle="red";
  ctx.beginPath();
  for (let e of userPath) ctx.lineTo(e.x,e.y);
  ctx.stroke();
  ctx.strokeStyle="green";
  ctx.beginPath();
  let e;
  for (let i in M) e=M[i],ctx.lineTo(polya(uxPolyf,e.t),polya(uyPolyf,e.t));
  ctx.stroke();
  */
  let popTarget=Math.floor(Math.max(canvas.width*canvas.height/5000,10));
  let fullCursors=cursors.length;
  while (fullCursors>0&&cursors[fullCursors-1].alpha<1) fullCursors--;
  while (cursors.length<popTarget) cursors.push(newCursor(t,0));
  for (let i=fullCursors;i<popTarget;i++){
    let cursor=cursors[i];
    let dt=t-cursor.baseT;
    cursor.alpha=Math.min(cursor.alpha+dt/200/(i-fullCursors+1),1);
  }
  for (let i=popTarget;i<cursors.length;i++){
    let cursor=cursors[i];
    let dt=t-cursor.baseT;
    cursor.alpha-=dt/200/(cursors.length-i);
  }
  while (cursors[cursors.length-1].alpha<0) cursors.pop();
  let ag=Math.sqrt(Math.min(Math.max(magnorm(uxPolyf[UFDEG],uyPolyf[UFDEG])[0]*100**UFDEG*pascalmat[UFDEG][UFDEG]/20000,0),1));
  for (let cursor of cursors){
    let dt=t-cursor.baseT;
    if (dt==0) continue;
    cursor.xPoly=polyshift(cursor.xPoly,dt);
    cursor.yPoly=polyshift(cursor.yPoly,dt);
    let [speed,nvelX,nvelY]=magnorm(cursor.xPoly[1],cursor.yPoly[1]);
    if (speed>100){
      cursor.xPoly[1]*=100/speed;
      cursor.yPoly[1]*=100/speed;
      speed=100;
    }
    let friction=Math.min(speed,dt*0.001);
    cursor.xPoly[1]+=-friction*nvelX;
    cursor.yPoly[1]+=-friction*nvelY;
    for (let i=2;i<cursor.xPoly.length-1;i++) cursor.xPoly[i]*=0.1**(dt/10);
    for (let i=2;i<cursor.yPoly.length-1;i++) cursor.yPoly[i]*=0.1**(dt/10);
    let futureX=polya(cursor.xPoly.slice(0,-1),100);
    let futureY=polya(cursor.yPoly.slice(0,-1),100);
    let [futureDist,futureXDir,futureYDir]=magnorm(futureX-cursor.target.x,futureY-cursor.target.y);
    let effort;
    if (futureDist>50*Math.random()*100) effort=0.00002;
    else if (futureDist>10) effort=0.000003;
    else effort=0;
    cursor.xPoly[cursor.xPoly.length-1]=-effort*futureXDir;
    cursor.yPoly[cursor.xPoly.length-1]=-effort*futureYDir;
    if (cursor.xPoly[0]<0){
      cursor.xPoly[0]=0;
      for (let i=2;i<cursor.xPoly.length;i++) cursor.xPoly[i]=Math.max(cursor.xPoly[i],0);
    }
    if (cursor.xPoly[0]>canvas.width){
      cursor.xPoly[0]=canvas.width;
      for (let i=2;i<cursor.xPoly.length;i++) cursor.xPoly[i]=Math.min(cursor.xPoly[i],0);
    }
    if (cursor.yPoly[0]<0){
      cursor.yPoly[0]=0;
      for (let i=2;i<cursor.yPoly.length;i++) cursor.yPoly[i]=Math.max(cursor.yPoly[i],0);
    }
    if (cursor.yPoly[0]>canvas.height){
      cursor.yPoly[0]=canvas.height;
      for (let i=2;i<cursor.yPoly.length;i++) cursor.yPoly[i]=Math.min(cursor.yPoly[i],0);
    }
    cursor.baseT=t;
    cursor.target.dur-=dt*(magnorm(cursor.xPoly[0]-cursor.target.x,cursor.yPoly[0]-cursor.target.y)[0]<20?4:1)*(1+ag*2);
    if (cursor.target.dur<0){
      let newTargetX,newTargetY;
      if (Math.random()<0.1+0.8*ag){
        newTargetX=Math.random()*canvas.width;
        newTargetY=Math.random()*canvas.height;
        cursor.target.dur=Math.floor(Math.random()*500)+1;
      }else{
        let targetDir=Math.random()*2*Math.PI;
        let targetDist=Math.sqrt(Math.random())*200;
        newTargetX=cursor.xPoly[0]+targetDist*Math.cos(targetDir);
        newTargetY=cursor.yPoly[0]+targetDist*Math.sin(targetDir);
        cursor.target.dur=Math.floor(Math.random()*2000)+1;
      }
      newTargetX=Math.min(Math.max(newTargetX,0),canvas.width);
      newTargetY=Math.min(Math.max(newTargetY,0),canvas.height);
      let [targetDist,targetXDir,targetYDir]=magnorm(newTargetX-cursor.xPoly[0],newTargetY-cursor.yPoly[0]);
      cursor.target.x+=Math.min(targetDist,Math.max(magnorm(canvas.width,canvas.height)[0]*0.5,200))*targetXDir;
      cursor.target.y+=Math.min(targetDist,Math.max(magnorm(canvas.width,canvas.height)[0]*0.5,200))*targetYDir;
    }
    ctx.globalAlpha=cursor.alpha;
    ctx.drawImage(cursorImage,Math.round(cursor.xPoly[0]),Math.round(cursor.yPoly[0]));
    /*
    ctx.strokeStyle="blue";
    ctx.beginPath();
    ctx.moveTo(Math.round(cursor.xPoly[0]),Math.round(cursor.yPoly[0]));
    ctx.lineTo(cursor.target.x,cursor.target.y);
    ctx.stroke();
    */
  }
  requestAnimationFrame(loop);
}