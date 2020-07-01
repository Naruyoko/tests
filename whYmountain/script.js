var canvas;
var ctx;
window.onload=function (){
  console.clear();
  canvas=dg("output");
  ctx=canvas.getContext("2d");
  load();
  draw(true);
}
function dg(s){
  return document.getElementById(s);
}
var calculatedMountains=null;
function calc(s){
  //if (!/^(\d+,)*\d+$/.test(s)) throw Error("BAD");
  var lastLayer;
  if (typeof s=="string") lastLayer=s.split(/[ ,]/g).map((e,i)=>({value:Number(e),position:i,parentIndex:-1}));
  else lastLayer=s;
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
          p=calculatedMountain[calculatedMountain.length-2][p].parentIndex;
          if (p<0) break;
          j=0;
          while (lastLayer[j].position<calculatedMountain[calculatedMountain.length-2][p].position-1) j++;
        }
        if (j<0||j<lastLayer.length-1&&lastLayer[j].position+1!=lastLayer[j+1].position) break;
        if (lastLayer[j].value<lastLayer[i].value){
          lastLayer[i].parentIndex=j;
          hasNextLayer=true;
          break;
        }
      }
    }
    if (!hasNextLayer) break;
    var currentLayer=[];
    calculatedMountain.push(currentLayer);
    for (var i=0;i<lastLayer.length;i++){
      if (lastLayer[i].parentIndex!=-1){
        currentLayer.push({value:lastLayer[i].value-lastLayer[lastLayer[i].parentIndex].value,position:lastLayer[i].position-1,parentIndex:-1});
      }
    }
    lastLayer=currentLayer;
  }
  return calculatedMountain;
}
var options=["input","ROWHEIGHT","COLUMNWIDTH","LINETHICKNESS","NUMBERSIZE","NUMBERTHICKNESS","LINEPLACE"];
var input="";
var ROWHEIGHT=32;
var COLUMNWIDTH=32;
var LINETHICKNESS=2;
var NUMBERSIZE=10;
var NUMBERTHICKNESS=400;
var LINEPLACE=1;
function draw(recalculate){
  for (var i of options){
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
            ctx.moveTo(COLUMNWIDTH*(point.position*2+j+2)/2,by+ROWHEIGHT*(mountain.length-j+1)-NUMBERSIZE*Math.min(LINEPLACE,1)-(ROWHEIGHT-NUMBERSIZE)*Math.max(LINEPLACE-1,0)-3);
            ctx.lineTo(COLUMNWIDTH*(point.position*2+j+1)/2,by+ROWHEIGHT*(mountain.length-j));
            var l=0;
            while (mountain[j-1][l].position!=point.position+1) l++;
            ctx.lineTo(COLUMNWIDTH*(mountain[j-1][mountain[j-1][l].parentIndex].position*2+j)/2,by+ROWHEIGHT*(mountain.length-j+1)-NUMBERSIZE*Math.min(LINEPLACE,1)-(ROWHEIGHT-NUMBERSIZE)*Math.max(LINEPLACE-1,0)-3);
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
window.onpopstate=function (e){
  load();
  draw(true);
}
function saveSimple(clipboard){
  var encodedInput=input.split(/\r?\n/g).map(e=>e.split(/[ ,]/g).map(Number)).join(";");
  history.pushState(encodedInput,"","?"+encodedInput);
  if (clipboard){
    var copyarea=dg("copyarea");
    copyarea.value=location.href;
    copyarea.style.display="";
    copyarea.select();
    copyarea.setSelectionRange(0,99999);
    document.execCommand("copy");
    copyarea.style.display="none";
  }
}
function saveDetailed(clipboard){
  var state={};
  for (var i of options){
    state[i]=window[i];
  }
  var encodedState=btoa(JSON.stringify(state)).replace(/\+/g,"-").replace(/\//g,"_").replace(/\=/g,"");
  history.pushState(state,"","?"+encodedState);
  if (clipboard){
    var copyarea=dg("copyarea");
    copyarea.value=location.href;
    copyarea.style.display="";
    copyarea.select();
    copyarea.setSelectionRange(0,99999);
    document.execCommand("copy");
    copyarea.style.display="none";
  }
}
function load(){
  var encodedState=location.search.substring(1);
  if (!encodedState) return;
  try{
    var state=encodedState.replace(/\-/g,"+").replace(/_/g,"/");
    if (state.length%4) state+="=".repeat(4-state.length%4);
    state=JSON.parse(atob(state));
  }catch (e){ //simple
    var input=encodedState.replace(/;/g,"\n");
    dg("input").value=input;
  }finally{ //detailed
    console.log(state);
    for (var i of options){
      if (state[i]) dg(i).value=state[i];
    }
  }
}
function calcDiagonal(mountain){
  if (typeof mountain=="string") mountain=calc(mountain);
  var height=0;
  var position=mountain[0].length-1;
  while (mountain[height+1]&&mountain[height+1][mountain[height+1].length-1].position==position-1){ //climb up to the peak
    height++;
    position--;
  }
  var lastIndex=mountain[height].length-1;
  var gezandoIndexes=[[lastIndex]]; //indexes of gezando nodes
  while (gezandoIndexes.length<=height) gezandoIndexes.unshift([]);
  while (true){
    if (height===0){
      if (lastIndex===0) break;
      lastIndex--;
    }else{
      var i=0; //find right-down
      while (mountain[height-1][i].position!=mountain[height][lastIndex].position+1) i++;
      i=mountain[height-1][i].parentIndex; //go to its parent=left-down
      var j=0; //find up-left of that=left
      while (mountain[height][j].position<mountain[height-1][i].position-1) j++;
      if (mountain[height][j].position==mountain[height-1][i].position-1){ //left exists
        lastIndex=j;
        gezandoIndexes[height-1].unshift(i);
      }else{
        height--;
        lastIndex=i;
      }
    }
    gezandoIndexes[height].unshift(lastIndex);
  }
  var lastTreeLevel=new Set(gezandoIndexes[0]);
  var treeNodeIndexes=[lastTreeLevel];
  while (height<mountain.length-1){
    var treeLevel=new Set(gezandoIndexes[height+1]);
    for (var i=0;i<mountain[height].length;i++){
      if (lastTreeLevel.has(mountain[height][i].parentIndex)){
        var j=0;
        while (mountain[height+1][j].position<mountain[height][i].position-1) j++;
        treeLevel.add(j);
      }
    }
    lastTreeLevel=treeLevel;
    treeNodeIndexes.push(lastTreeLevel);
    height++;
  }
  var r=[];
  for (var i=0;i<mountain[0].length;i++){ //only one diagonal exists for each left-side-up diagonal line
    for (var j=mountain.length-1;j>=0;j--){ //prioritize the top
      var found=false;
      for (var k of treeNodeIndexes[j]){
        if (mountain[j][k].position+j==i){
          r.push(mountain[j][k].value);
          found=true;
          break;
        }
      }
      if (found) break;
    }
  }
  console.log(gezandoIndexes);
  console.log(treeNodeIndexes);
  return r.join(",");
}
var ontabopen={};
var tabs=["input","extractDiagonal"];
function openTab(name){
  for (var i of tabs){
    dg(i+"Tab").style.display="none";
  }
  dg(name+"Tab").style.display="";
  if (ontabopen[name] instanceof Function) ontabopen[name]();
}
ontabopen["extractDiagonal"]=function (){
  var l=dg("extractDiagonal");
  l.innerHTML="";
  var lines=input.split(/\r?\n/g);
  for (var i in lines){
    var d=document.createElement("li");
    d.onclick=new Function("extractDiagonal("+i+")");
    d.textContent=lines[i];
    l.appendChild(d);
  }
}
function extractDiagonal(line){
  var diagonal=calcDiagonal(calculatedMountains[line]);
  dg("input").value+="\n"+diagonal;
  draw(true);
  ontabopen["extractDiagonal"]();
}