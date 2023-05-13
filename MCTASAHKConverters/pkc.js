//*totally* accurate, I mean, *who* would put a comma or a line break in a cell?
function parseCSV(s){
  var lines=s.split("\n");
  var header=lines[0].split(",");
  var r=[];
  for (var i=1;i<lines.length;i++){
    var cells=lines[i].split(",");
    r.push(Object.create(null));
    for (var j=0;j<cells.length;j++) r[i-1][header[j]]=cells[j];
  }
  return r;
}
function convert(s,{fpt=10,tps=2,tickoffset=3,maxSafeYaw=900}){
  var info=parseCSV(s);
  var r="fps "+(fpt*tps);
  var lastYawP=0;
  var lastPitchP=90*2400/360;
  var keyMap=["w","a","s","d","Space","Shift","Ctrl","LButton","RButton"];
  var keyHeaders=["W","A","S","D","JUMP","SNEAK","SPRINT","LMB","RMB"];
  var lastKeys=Array(keyMap.length).fill(false);
  for (var tick=0;tick<info.length;tick++){
    var tickinfo=info[tick];
    var tickText="";
    var thisYawP=Math.round(tickinfo["YAW"]*2400/360);
    var thisPitchP=Math.round(tickinfo["PITCH"]*2400/360);
    var yawDiff=thisYawP-lastYawP;
    var pitchDiff=thisPitchP-lastPitchP;
    if (yawDiff>maxSafeYaw){
      r+="\n"+
        "frame "+((tick+tickoffset)*fpt-1)+"\n"+
        "mousePosR "+maxSafeYaw+",0";
      yawDiff-=maxSafeYaw;
    }else if (yawDiff<-maxSafeYaw){
      r+="\n"+
        "frame "+((tick+tickoffset)*fpt-1)+"\n"+
        "mousePosR -"+maxSafeYaw+",0";
      yawDiff+=maxSafeYaw;
    }
    if (yawDiff||pitchDiff) tickText+="\nmousePosR "+yawDiff+","+pitchDiff;
    lastYawP=thisYawP;
    lastPitchP=thisPitchP;
    var thisKeys=keyHeaders.map(e=>tickinfo[e]=="true");
    for (var j=0;j<keyMap.length;j++){
      var diff=thisKeys[j]-lastKeys[j];
      if (diff) tickText+="\n{"+keyMap[j]+" "+(diff>0?"Down":"Up")+"}";
    }
    lastKeys=thisKeys;
    if (tickText) r+="\nframe "+(tick+tickoffset)*fpt+tickText;
  }
  return r;
}