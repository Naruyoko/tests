function rotbase64(instr,rot){
  rot=rot<0?rot%64+64:rot%64;
  const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var outstr="";
  for (var i=0;i<instr.length;i++){
    if (["+","/"].includes(instr.charAt(i))){
      var v=chars.search("\\"+instr.charAt(i));
    }else{
      var v=chars.search(instr.charAt(i));
    }
    if (v!=-1){
      outstr+=chars.charAt((v+rot)%64);
    }else{
      outstr+=instr.charAt(i);
    }
  }
  return outstr;
}
