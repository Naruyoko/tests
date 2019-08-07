var board;
var goal=[];
var moves=0;
var size=[4,4];
var time;
var lasttime;
function onload(){
  c=document.getElementById("canvas");
  ctx=c.getContext("2d");
  ctx.lineWidth=1;
  resizeboard();
  setInterval(()=>draw(true),100/6);
  console.log("Loaded");
}
function resizeboard(){
  size=[Number(document.getElementById("sizex").value),Number(document.getElementById("sizey").value)];
  c.width=40*size[0];
  c.height=40*size[1]+50;
  goal=[];
  for (var y=0;y<size[1];y++){
    var k=[];
    for (var x=0;x<size[0];x++){
      k.push(y*size[0]+x+1);
    }
    goal.push(k);
  }
  goal[size[1]-1][size[0]-1]=0;
  reset();
  document.title=size[0]*size[1]-1+" Puzzle";
}
function reset(){
	moves=0;
	board=JSON.parse(JSON.stringify(goal));
  lasttime=new Date().getTime();
  time=0;
  draw();
}
function shuffle(){
	for (var i=0;i<1000000;i++){
  	var j=Math.floor(Math.random()*4);
    if (j==0) up(true);
    else if (j==1) down(true);
    else if (j==2) left(true);
    else if (j==3) right(true);
  }
  moves=0;
  completed=false;
  lasttime=new Date().getTime();
  time=0;
  draw();
}
var keyinput=[];
document.onkeydown=function (e){
  if (!e){e=window.event;}
  if (e.keyCode==119) up();
  if (e.keyCode==115) down();
  if (e.keyCode==97) left();
  if (e.keyCode==100) right();
  if (e.keyCode==37) left();
  if (e.keyCode==38) up();
  if (e.keyCode==39) right();
  if (e.keyCode==40) down();
  keyinput[e.keyCode]=true;
};
document.onkeyup=function (e){
  if (!e){e=window.event;}
  keyinput[e.keyCode]=false;
};
window.onblur=function (){
  keyinput.length=0;
};
function iskey(code){
  return keyinput[code];
}
function timeFormat(t){
  var m="";
  var day=86400;
  var year=365*day;
  function s(i){return i==1?"":"s";}
  if (Math.abs(t)>=10){
    var units=[
      ["dark era",year*1e100],
      ["death",year*1e96],
      ["void",year*1e90],
      ["enlightment",year*1e84],
      ["particle decay",year*1e78],
      ["ionization",year*1e78],
      ["sphere",year*1e72],
      ["evaporation",year*6e66],
      ["freeze",year*1e63],
      ["inflamation",year*1e57],
      ["fixation",year*1e51],
      ["darkness",year*1e45,"darknesses"],
      ["proton decay",year*5.1e39],
      ["recursion",year*1e33],
      ["cycle",year*4.134105e28],
      ["purge",year*1e25],
      ["ejection",year*1e19],
      ["detachment",year*1e15],
      ["crunch",year*1e12,"crunches"],
      ["eon",year*1e9],
      ["epoch",year*1e6],
      ["millennium",year*1000],
      ["century",year*100,"centuries"],
      ["year",year],
      ["day",day],
      ["hour",3600],
      ["minute",60]
    ];
    for (var i=0;i<units.length;i++){
      if (Math.abs(t)>=units[i][1]){
        m+=" "+notations.normalsmall(Math.floor(t/units[i][1]))+" "+(units[i][2]?units[i][Math.floor(t/units[i][1])==1?0:2]:(units[i][0]+s(Math.floor(t/units[i][1]))));
        t%=units[i][1];
      }
    }
    m=m.substring(1);
  }
  m+=" "+t.toFixed(3)+" seconds";
  return m;
}
function draw(passive=false){
  if (passive){
    ctx.clearRect(0,0,c.width,50);
  }else{
    ctx.clearRect(0,0,c.width,c.height);
  }
  ctx.fillStyle="SaddleBrown";
  ctx.font="16px serif";
  ctx.fillText("Moves: "+moves,0,20);
  ctx.fillText("Time: "+timeFormat(time),0,40);
  if (passive) return;
  for (var x=0;x<size[0];x++){
  	for (var y=0;y<size[1];y++){
    	if (board[y][x]){
        ctx.fillStyle=complete()?"Gold":board[y][x]==y*size[0]+x+1?"Lime":board[y][x]%2?"SaddleBrown":"Bisque";
        ctx.strokeStyle=board[y][x]%2?"Bisque":"SaddleBrown";
        ctx.fillRect(x*40,y*40+50,39,39);
        ctx.strokeText(board[y][x],x*40+10,y*40+80);
      }
    }
  }
  if (!complete()) time+=(new Date().getTime()-lasttime)/1000;
  lasttime=new Date().getTime();
}
function complete(){
  for (var x=0;x<size[0];x++){
  	for (var y=0;y<size[1];y++){
    	if (board[y][x]!=goal[y][x]) return false;
    }
  }
  return true;
}
function find(i){
  for (var x=0;x<size[0];x++){
  	for (var y=0;y<size[1];y++){
    	if (board[y][x]==i) return [x,y];
    }
  }
}
function up(auto=false){
	var hand=find(0);
	if (hand[1]==0) return;
  board[hand[1]][hand[0]]=board[hand[1]-1][hand[0]];
  board[hand[1]-1][hand[0]]=0;
  moves++;
  if (!auto) draw();
}
function down(auto=false){
	var hand=find(0);
	if (hand[1]==size[1]-1) return;
  board[hand[1]][hand[0]]=board[hand[1]+1][hand[0]];
  board[hand[1]+1][hand[0]]=0;
  moves++;
  if (!auto) draw();
}
function left(auto=false){
	var hand=find(0);
	if (hand[0]==0) return;
  board[hand[1]][hand[0]]=board[hand[1]][hand[0]-1];
  board[hand[1]][hand[0]-1]=0;
  moves++;
  if (!auto) draw();
}
function right(auto=false){
	var hand=find(0);
	if (hand[0]==size[0]-1) return;
  board[hand[1]][hand[0]]=board[hand[1]][hand[0]+1];
  board[hand[1]][hand[0]+1]=0;
  moves++;
  if (!auto) draw();
}
var AI={
  moves:"",
  save:[],
  simulate:(str)=>{
    AI.moves+=str;
    for (var i=0;i<str.length;i++){
      var k=str.charAt(i);
      if (k=="U") up(true);
      else if (k=="D") down(true);
      else if (k=="L") left(true);
      else if (k=="R") right(true);
    }
  },
  solve:()=>{
    AI.save=JSON.parse(JSON.stringify(board));
    var n=0;
    var px=()=>find(0)[0];
    var py=()=>find(0)[1];
    var wx=()=>find(n)[0];
    var wy=()=>find(n)[1];
    var go=(s)=>AI.simulate(s);
    while (px()>0) go("L");
    while (py()>0) go("U");
    function moveTo(n,gx,gy,l){
      var px=()=>find(0)[0];
      var py=()=>find(0)[1];
      var wx=()=>find(n)[0];
      var wy=()=>find(n)[1];
      var go=(s)=>AI.simulate(s);
      if (wy()==py()){
        while (wx()>px()) go("R");
        while (wx()>gx) go("DLLUR"); 
      }else{
        while (wy()-1>py()) go("D");
        if (wx()!=px()){
          go("D");
          if (wx()<px()){
            while (wx()<px()) go("L");
            while (wx()<gx) go((wy()<gy+1)&&!l?"DRRUL":"URRDL");
            go((wy()<gy+1)&&!l?"DRRUUL":"UR");
          }else{
            while (wx()>px()) go("R");
            while (wx()>gx) go("ULLDR");
            go("UL");
          }
        }
        while (wy()>gy) go("DRUUL");
        go("R");
        if (gy>=1) go("D");
      }
    }
    for (var i=1;i<=size[0]*(size[1]-2);i++){
      if (i%size[0]){
        go("\n"+(i+1)+": ");
        moveTo(i+1,i%size[0]-1,i/size[1]);
      }else{
        go("\n"+(i-size[0]+1)+": ");
        if ((find(i-size[0]+1)[0]==size[0]-1)&&(find(i-size[0]+1)[1]==py()+1)) go("LDDRULUR");
        go("D");
        while (px()) go("L");
        moveTo(i-size[0]+1,0,i/size[1]);
        go("\n");
        while (px()!==size[0]-1) go("R");
        go("U");
        while (px()) go("L");
        go("D");
      }
    }
    for (var i=0;i<size[0]-2;i++){
      go("\n"+(size[0]*(size[1]-1)+i+1)+": ");
      moveTo(size[0]*(size[1]-1)+i+1,i,size[1]-2,true);
      go("\n"+(size[0]*(size[1]-2)+i+1)+": ");
      if (find(size[0]*(size[1]-2)+i+1)[0]==i) go("DLURRDLULDRRULDRU");
      else moveTo(size[0]*(size[1]-2)+i+1,i+1,size[1]-2,true);
      go("\nDLLUR");
    }
    go("\nPermutate: RD");
    while (!complete()) go("LURD");
    console.log(AI.moves);
    AI.show();
  },
  show:()=>{
    clearInterval(AI.interval);
    document.getElementById("output").innerHTML="";
    board=AI.save;
    moves=0;
    AI.interval=setInterval(AI.showstep,10);
  },
  showstep:()=>{
    var k;
    var s="";
    for (var i=0;(i<document.getElementById("step").value)&&AI.moves;){
      k=AI.moves.charAt(0);
      AI.moves=AI.moves.substring(1);
      s+=k=="\n"?"<br/>":k;
      if (["U","D","L","R"].includes(k)) i++;
      if (k=="U") up(true);
      else if (k=="D") down(true);
      else if (k=="L") left(true);
      else if (k=="R") right(true);
    }
    if (!AI.moves) clearInterval(AI.interval);
    document.getElementById("output").innerHTML+=s;
    document.getElementById("output").scrollTop=document.getElementById("output").scrollHeight;
    draw();
  }
};