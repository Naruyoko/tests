function parse(s){
  var r=[];
  var lines=s.split("\n");
  var mode="";
  var buttonColumns="";
  var keyMap={
    "W":"keyForward",
    "w":"keyForward",
    "A":"keyLeft",
    "a":"keyLeft",
    "S":"keyBackward",
    "s":"keyBackward",
    "D":"keyRight",
    "d":"keyRight",
    "_":"keyJump",
    "+":"keySneak",
    "^":"keySprint"
  };
  for (var linei=0;linei<lines.length;linei++){
    var line=lines[linei];
    if (!line) continue;
    if (line[0]=="!"){
      mode=line.slice(1);
    }else if (mode=="input"){
      var args=line.replaceAll(" ","").split("|");
      if (/^#+$/.test(args[0])){
        buttonColumns=args[1];
      }else{
        var tick=+args[0];
        var tickinfo={tick:tick};
        if (args[1].length!=buttonColumns.length) throw Error("Unmatched table");
        for (var coli=0;coli<args[1].length;coli++){
          var button=buttonColumns[coli];
          var isButtonPressed=args[1][coli]!=" "&&args[1][coli]!=".";
          tickinfo[keyMap[button]]=isButtonPressed;
        }
        var cameraAngleStr=args[2].split(",");
        tickinfo.yaw=+cameraAngleStr[0];
        tickinfo.pitch=+cameraAngleStr[1];
        tickinfo.flags=[];
        for (var i=0;i<args[3].length;i++){
          if (args[3][i+1]=="{"){
            var flagend=args[3].indexOf("}",i+1);
            if (flagend==-1) throw Error("Unmatched flag");
            tickinfo.flags.push([args[3][i],args[3].slice(i+2,flagend)]);
            i=flagend;
          }else{
            tickinfo.flags.push([args[3][i]]);
          }
        }
        r.push(tickinfo);
      }
    }
  }
  return r;
}
function convert(s,tickoffset=3){
  var MAX_SAFE_YAW=900;
  var info=parse(s);
  var r="fps 20\n"+
    "coordMode relative\n"+
    "frame 10\n"+
    "mousePosR 0,50\n"+
    "{LButton}";
  var keyMap=["w","a","s","d","Space","Shift","Ctrl"];
  var lastYawP=0;
  var lastPitchP=0;
  var lastKeys=[];
  for (var i=0;i<info.length;i++){
    var tickinfo=info[i];
    var tickText="";
    var thisYawP=Math.round(tickinfo.yaw*2400/360);
    var thisPitchP=Math.round(tickinfo.pitch*2400/360);
    var yawDiff=thisYawP-lastYawP;
    var pitchDiff=thisPitchP-lastPitchP;
    if (yawDiff>MAX_SAFE_YAW){
      r+="\n"+
        "frame "+((tickinfo.tick+tickoffset)*10-1)+"\n"+
        "mousePosR "+MAX_SAFE_YAW+",0";
      yawDiff-=MAX_SAFE_YAW;
    }else if (yawDiff<-MAX_SAFE_YAW){
      r+="\n"+
        "frame "+((tickinfo.tick+tickoffset)*10-1)+"\n"+
        "mousePosR -"+MAX_SAFE_YAW+",0";
      yawDiff+=MAX_SAFE_YAW;
    }
    if (yawDiff||pitchDiff) tickText+="\nmousePosR "+yawDiff+","+pitchDiff;
    if (tickinfo.flags.some(function(flag){return flag[0]=="=";})) tickText+="\n# NOTE: = flag is present at tick "+tickinfo.tick;
    lastYawP=thisYawP;
    lastPitchP=thisPitchP;
    var mouseButtonFlag=tickinfo.flags.find(function(flag){return flag[0]=="m";});
    if (mouseButtonFlag){
      for (var j=0;j<mouseButtonFlag[1].length;j++){
        var mouseButton=mouseButtonFlag[1][j];
        if (mouseButton=="L"){
          if (mouseButtonFlag[1][j+1]=="l"){
            tickText+="\n{LButton}";
            j++;
          }else tickText+="\n{LButton Down}";
        }else if (mouseButton=="l") tickText+="\n{LButton Up}";
        else if (mouseButton=="R"){
          if (mouseButtonFlag[1][j+1]=="r"){
            tickText+="\n{RButton}";
            j++;
          }else tickText+="\n{RButton Down}";
        }else if (mouseButton=="r") tickText+="\n{RButton Up}";
      }
    }
    var thisKeys=[tickinfo.keyForward,tickinfo.keyLeft,tickinfo.keyBackward,tickinfo.keyRight,tickinfo.keyJump,tickinfo.keySneak,tickinfo.keySprint];
    for (var j=0;j<7;j++){
      var diff=+!!thisKeys[j]-+!!lastKeys[j];
      if (diff) tickText+="\n{"+keyMap[j]+" "+(diff>0?"Down":"Up")+"}";
    }
    lastKeys=thisKeys;
    if (tickText) r+="\nframe "+(tickinfo.tick+tickoffset)*10+tickText;
  }
  return r;
}