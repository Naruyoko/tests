var canvas;
var ctx;
window.onload=function (){
  console.clear();
  canvas=dg("output");
  ctx=canvas.getContext("2d");
  draw(true);
}
function dg(s){
  return document.getElementById(s);
}
var calculatedMountains=null;
function calc(s){
  //if (!/^(\d+,)*\d+$/.test(s)) throw Error("BAD");
  var lastLayer=s.split(/[ ,]/g).map((e,i)=>({value:Number(e),position:i,parent:-1}));
  var calculatedMountain=[lastLayer]; //rows
  while (true){
    //assign parents
    var hasNextLayer=false;
    for (var i=0;i<lastLayer.length;i++){
      var p;
      if (calculatedMountain.length==1){
        p=lastLayer[i].position+1;
      }else{
        p=0;
        while (calculatedMountain[calculatedMountain.length-2][p].position<lastLayer[i].position+1) p++;
      }
      while (true){
        if (p<0) break;
        var j;
        if (calculatedMountain.length==1){
          p--;
          j=p-1;
        }else{ //ignoring
          p=calculatedMountain[calculatedMountain.length-2][p].parent;
          if (p<0) break;
          j=0;
          while (lastLayer[j].position<calculatedMountain[calculatedMountain.length-2][p].position-1) j++;
        }
        if (j<0||j<lastLayer.length-1&&lastLayer[j].position+1!=lastLayer[j+1].position) break;
        if (lastLayer[j].value<lastLayer[i].value){
          lastLayer[i].parent=j;
          hasNextLayer=true;
          break;
        }
      }
    }
    if (!hasNextLayer) break;
    var currentLayer=[];
    calculatedMountain.push(currentLayer);
    for (var i=0;i<lastLayer.length;i++){
      if (lastLayer[i].parent!=-1){
        currentLayer.push({value:lastLayer[i].value-lastLayer[lastLayer[i].parent].value,position:lastLayer[i].position-1,parent:-1});
      }
    }
    lastLayer=currentLayer;
  }
  return calculatedMountain;
}
var input="";
var ROWHEIGHT=20;
var COLUMNWIDTH=20;
var LINETHICKNESS=2;
var NUMBERSIZE=10;
var NUMBERTHICKNESS=400;
function draw(recalculate){
  for (var i of ["input","ROWHEIGHT","COLUMNWIDTH","LINETHICKNESS","NUMBERSIZE","NUMBERTHICKNESS"]){
    window[i]=dg(i).value;
  }
  if (recalculate) calculatedMountains=input.split(/\r?\n/g).map(calc);
  //plagiarized
  for (var cycle=0;cycle<2;cycle++){ //draw twice because image size
    ctx.fillStyle="white"; //clear
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="black";
    ctx.strokeStyle="black";
    ctx.lineWidth=+LINETHICKNESS;
    ctx.font=NUMBERTHICKNESS+" "+NUMBERSIZE+"px Arial";
    var x=0;
    var y=0;
    for (var i=0;i<calculatedMountains.length;i++){
      var mountain=calculatedMountains[i];
      var by=y;
      x=Math.max(x,mountain[0].length*COLUMNWIDTH);
      y+=mountain.length*ROWHEIGHT;
      for (var j=0;j<mountain.length;j++){
        var row=mountain[j];
        for (var k=0;k<row.length;k++){
          var point=row[k];
          ctx.fillText(point.value,COLUMNWIDTH*(point.position*2+j+1)/2-ctx.measureText(point.value).width/2,by+ROWHEIGHT*(mountain.length-j)-3);
          if (j>0){
            ctx.beginPath();
            ctx.moveTo(COLUMNWIDTH*(point.position*2+j+2)/2,by+ROWHEIGHT*(mountain.length-j+1)-13);
            ctx.lineTo(COLUMNWIDTH*(point.position*2+j+1)/2,by+ROWHEIGHT*(mountain.length-j))
            var l=0;
            while (mountain[j-1][l].position!=point.position+1) l++;
            ctx.lineTo(COLUMNWIDTH*(mountain[j-1][mountain[j-1][l].parent].position*2+j)/2,by+ROWHEIGHT*(mountain.length-j+1)-13);
            ctx.stroke();
          }
        }
      }
    }
    //resize
    var data=ctx.getImageData(0,0,x,y);
    canvas.width=x;
    canvas.height=y;
    ctx.putImageData(data,0,0);
  }
  //enable save
  outimg.width=canvas.width;
  outimg.height=canvas.height;
  outimg.src=canvas.toDataURL('image/jpg');
}