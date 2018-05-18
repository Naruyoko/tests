var vector={
  i:[1,0,0],
  j:[0,1,0],
  k:[0,0,1],
  O:[0,0,0],
  abs:(function (a){
    var r=0;
    a.forEach(function (element){r+=Math.pow(element,2);});
    return Math.sqrt(r);
  }),
  add:(function (a,b){
    if (a.length!=b.length){return undefined;}
    var r=[];
    for (i=0;i<a.length;i++){
      r.push(a[i]+b[i]);
    }
    return r;
  }),
  sub:(function (a,b){
    if (a.length!=b.length){return undefined;}
    return vector.add(a,vector.mult(b,-1));
  }),
  mult:(function (v,n){
    var r=[];
    v.forEach(function (element){r.push(element*n);});
    return r;
  }),
  div:(function (v,n){
    return vector.mult(v,1/n);
  }),
  dot:(function (a,b){
    if (a.length!=b.length){return undefined;}
    var r=0;
    for (i=0;i<a.length;i++){
      r+=a[i]*b[i];
    }
    return r;
  }),
  cross3d:(function (a,b){
    if (a.length!=b.length){return undefined;}
    if (a.length!=3){return undefined;}
    return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  }),
  unit:(function (a){
    return vector.div(a,vector.abs(a));
  }),
  rotate:(function (p,o,d,t){
    //console.log("p:"+p+" o:"+o+" d:"+d+" t:"+t)
    var qx=(p[0]-o[0])/d[0];
    var qy=(p[1]-o[1])/d[1];
    var qz=(p[2]-o[2])/d[2];
    var qxy=(qx==qy)||isNaN(qx)||isNaN(qy);
    var qxz=(qx==qz)||isNaN(qx)||isNaN(qz);
    var qyz=(qy==qz)||isNaN(qy)||isNaN(qz);
    if (qxy&&qxz&&qyz){
      //console.log("exit");
      return p;
    }
    var c=vector.dot(d,vector.sub(p,o))/Math.pow(vector.abs(d),2);
    var i=vector.add(o,vector.mult(d,c));
    var di=vector.abs(vector.sub(p,i));
    var pa=vector.unit(vector.sub(p,i));
    var pe=vector.unit(vector.cross3d(pa,d));
    //console.log("c: "+c+" i:"+i+" di:"+di+" pa:"+pa+" pe:"+pe);
    return vector.add(vector.add(vector.mult(pa,di*Math.cos(t)),vector.mult(pe,di*Math.sin(t))),i);
  }),
  rot3axis:(function (v,x,y,z){
    var r=vector.rotate(//6
      vector.rotate(//3
        vector.rotate(//1
          v,vector.O,vector.i,x
        ),
        vector.O,
        vector.rotate(//2
          vector.j,vector.O,vector.i,x
        ),
        y
      ),
      vector.O,
      vector.rotate(//5
        vector.rotate(//4
          vector.k,vector.O,vector.i,x
        ),
        vector.O,
        vector.j,
        y
      ),
      z
    );
    //console.log("r:"+r);
    return r;
  }),
  projcam:(function (a){
    return [a[1],-a[2]];
  })
};
function toRad (angle){
  return angle*(Math.PI/180);
}
var c=document.getElementById("canvas");
var ctx=c.getContext("2d");
var rx=0;
var ry=0;
var rz=0;
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  rx=Number(document.getElementById("slider.x").value);
  ry=Number(document.getElementById("slider.y").value);
  rz=Number(document.getElementById("slider.z").value);
  document.getElementById("deg.x").innerHTML=rx;
  document.getElementById("deg.y").innerHTML=ry;
  document.getElementById("deg.z").innerHTML=rz;
  var cx=vector.rot3axis(vector.i,toRad(rx),toRad(ry),toRad(rz));
  var cy=vector.rot3axis(vector.j,toRad(rx),toRad(ry),toRad(rz));
  var cz=vector.rot3axis(vector.k,toRad(rx),toRad(ry),toRad(rz));
  var lx=vector.projcam(cx);
  var ly=vector.projcam(cy);
  var lz=vector.projcam(cz);
  ctx.beginPath();
  ctx.moveTo(320,240);
  ctx.lineTo(lx[0]*200+320,lx[1]*200+240);
  ctx.lineWidth=2+(cx[0]>=0);
  ctx.strokeStyle="#FF0000";
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(320,240);
  ctx.lineTo(lx[0]*-200+320,lx[1]*-200+240);
  ctx.lineWidth=2+(cx[0]<=0);
  ctx.strokeStyle="#FF0000";
  ctx.stroke();
  ctx.lineWidth=1;
  ctx.strokeText("+X",lx[0]*210+320,lx[1]*210+240);
  ctx.strokeText("-X",lx[0]*-210+320,lx[1]*-210+240);

  ctx.beginPath();
  ctx.moveTo(320,240);
  ctx.lineTo(ly[0]*200+320,ly[1]*200+240);
  ctx.lineWidth=2+(cy[0]>=0);
  ctx.strokeStyle="#00FF00";
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(320,240);
  ctx.lineTo(ly[0]*-200+320,ly[1]*-200+240);
  ctx.lineWidth=2+(cy[0]<=0);
  ctx.strokeStyle="#00FF00";
  ctx.stroke();
  ctx.lineWidth=1;
  ctx.strokeText("+Y",ly[0]*210+320,ly[1]*210+240);
  ctx.strokeText("-Y",ly[0]*-210+320,ly[1]*-210+240);

  ctx.beginPath();
  ctx.moveTo(320,240);
  ctx.lineTo(lz[0]*200+320,lz[1]*200+240);
  ctx.lineWidth=2+(cz[0]>=0);
  ctx.strokeStyle="#0000FF";
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(320,240);
  ctx.lineTo(lz[0]*-200+320,lz[1]*-200+240);
  ctx.lineWidth=2+(cz[0]<=0);
  ctx.strokeStyle="#0000FF";
  ctx.stroke();
  ctx.lineWidth=1;
  ctx.strokeText("+Z",lz[0]*210+320,lz[1]*210+240);
  ctx.strokeText("-Z",lz[0]*-210+320,lz[1]*-210+240);
  if (!document.getElementById("thinoption").checked){return;}
  for (i=-4;i<=4;i++){
    ctx.beginPath();
    ctx.moveTo(lx[0]*-160+320+ly[0]*i*40,lx[1]*-160+240+ly[1]*i*40);
    ctx.lineTo(lx[0]*160+320+ly[0]*i*40,lx[1]*160+240+ly[1]*i*40);
    ctx.lineWidth=1;
    ctx.strokeStyle="#FF0000";
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(lx[0]*-160+320+lz[0]*i*40,lx[1]*-160+240+lz[1]*i*40);
    ctx.lineTo(lx[0]*160+320+lz[0]*i*40,lx[1]*160+240+lz[1]*i*40);
    ctx.lineWidth=1;
    ctx.strokeStyle="#FF0000";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(ly[0]*160+320+lx[0]*i*40,ly[1]*160+240+lx[1]*i*40);
    ctx.lineTo(ly[0]*-160+320+lx[0]*i*40,ly[1]*-160+240+lx[1]*i*40);
    ctx.lineWidth=1;
    ctx.strokeStyle="#00FF00";
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(ly[0]*160+320+lz[0]*i*40,ly[1]*160+240+lz[1]*i*40);
    ctx.lineTo(ly[0]*-160+320+lz[0]*i*40,ly[1]*-160+240+lz[1]*i*40);
    ctx.lineWidth=1;
    ctx.strokeStyle="#00FF00";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(lz[0]*-160+320+lx[0]*i*40,lz[1]*-160+240+lx[1]*i*40);
    ctx.lineTo(lz[0]*160+320+lx[0]*i*40,lz[1]*160+240+lx[1]*i*40);
    ctx.lineWidth=1;
    ctx.strokeStyle="#0000FF";
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(lz[0]*-160+320+ly[0]*i*40,lz[1]*-160+240+ly[1]*i*40);
    ctx.lineTo(lz[0]*160+320+ly[0]*i*40,lz[1]*160+240+ly[1]*i*40);
    ctx.lineWidth=1;
    ctx.strokeStyle="#0000FF";
    ctx.stroke();
  }
}
draw();
function resolveang(x){
  if (x>180){return x-360;}
  if (x<-180){return x+360;}
  return x;
}
var keyinput=new Array();
document.onkeydown=function (e){
	if (!e){e=window.event;}
	if ((e.keyCode==70)&&!keyinput[70]){
	  document.getElementById("thinoption").checked=!document.getElementById("thinoption").checked;
	}
	if ((e.keyCode==82)&&!keyinput[82]){
	  document.getElementById("slider.x").value=0;
	  document.getElementById("slider.y").value=0;
	  document.getElementById("slider.z").value=0;
	}
	keyinput[e.keyCode]=true;
};
document.onkeyup=function (e){
	if (!e){e=window.event};
	keyinput[e.keyCode]=false;
};
window.onblur=function (){
	keyinput.length=0;
};
function iskey(code){
	return keyinput[code];
};
setInterval(function (){
	if (iskey(68)){
	  document.getElementById("slider.x").value=resolveang(Number(document.getElementById("slider.x").value)+1);
	}
	if (iskey(65)){
	  document.getElementById("slider.x").value=resolveang(Number(document.getElementById("slider.x").value)-1);
	}
	if (iskey(87)){
	  document.getElementById("slider.y").value=resolveang(Number(document.getElementById("slider.y").value)+1);
	}
	if (iskey(83)){
	  document.getElementById("slider.y").value=resolveang(Number(document.getElementById("slider.y").value)-1);
	}
	if (iskey(81)){
	  document.getElementById("slider.z").value=resolveang(Number(document.getElementById("slider.z").value)+1);
	}
	if (iskey(69)){
	  document.getElementById("slider.z").value=resolveang(Number(document.getElementById("slider.z").value)-1);
	}
	draw();
},1000/30);