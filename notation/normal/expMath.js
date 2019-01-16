var notations=notations||{};
notations.normal=notations.normal||{};
notations.normal.expMath=(function (i){
  var inum=Number(exp.text(i,"e"));
  if (i[1]) return "-"+notations.normal.expMath(exp.sub([-Infinity,false],i));
  if (isNaN(i[0])) return "NaN";
  if (!isFinite(i[0])) return i[0]>0?((i[1]?"-":"")+"Infinity"):"0";
  if (inum<1000) return String(inum);
  if ((inum>=1000)&&(inum<1e+6)){
    var h=inum;
    var l;
    var r=Math.floor(h%1000);
    l=String(r);
    if (r<10) l="00"+l;
    if ((r>=10)&&(r<100)) l="0"+l;
    return Math.floor(h/1000)+","+l;
  }
  var numbernames=["thousand","million","billion","trillion","quadrillion","quintillion","sextillion","septillion","octillion","nonillion","decillion","undecillion","duodecillion","tredecillion","quattuordecillion","quindecillion","sexdecillion","septendecillion","octodecillion","novemdecillion"];
  var namefragments=[["","un","duo","tre","quattuor","quinqua","se","septe","outo","nove"],["","deci","viginti","triginta","quadraginta","quinquaginta","sexaginta","septuaginta","octoginta","nonaginta"],["","centi","ducenti","trecenti","quadringenti","quingenti","sesgenti","septingenti","octingenti","nongenti"],["","milli","micro","nano","pico","femto","atto","zepto","yocto","xon","vec","mec","duec","trec","tetrec","pentec","hexec","heptec","octec","ennec"],["","mono","di","tri","tetra","penta","hexa","hepta","octa","nona"],["","vec","icosa","triaconta","tetraconta","pentaconta","hexaconta","heptaconta","octaconta","ennaconta","hecto"]];
  var e=3*Math.floor(i[0]/3);
  var l=Math.floor(e/3)-1;
  //console.log(l);
  if (l<=19){
    return Math.floor(Number(exp.text(exp.div(i,[e,false]),"e"))*1000)/1000+" "+numbernames[l];
  }else{
    var r="";
    var s;
    var mu;
    for (var g=Math.floor(Math.log10(l)/3);g>=0;g--){
      var mu=Math.floor(l/Math.pow(1000,g))%1000;
      s="";
      if ((mu===1)&&(g!==0)){
        s="";
      }else if ((mu<=19)&&(g===0)){
        s=numbernames[mu];
      }else{
        var d=[mu%10,Math.floor(mu%100/10),Math.floor(mu/100)];
        s=namefragments[0][d[0]];
        if ([3,6].includes(d[0])&&(((d[1]!=0)&&[2,3,4,5].includes(d[1]))||((d[1]==0)&&[3,4].includes(d[2]==3)))) s+="s";
        if ((d[0]==6)&&(((d[1]!=0)&&(d[1]==8))||((d[1]==0)&&(d[2]==8)))) s+="x";
        if ([7,9].includes(d[0])&&(((d[1]!=0)&&[1,3,4,5,6,7].includes(d[1]))||((d[1]==0)&&[2,3,4,5,6,7].includes(d[2])))) s+="n";
        if ([7,9].includes(d[0])&&(((d[1]!=0)&&((d[1]==2)||(d[1]==8)))||((d[1]==0)&&(d[2]==8)))) s+="m";
        s+=namefragments[1][d[1]]+namefragments[2][d[2]];
      }
      if (mu!==0){
        if (g<=19){
          r+=s+namefragments[3][g];
        }else{
          r+=s+namefragments[4][g%10]+namefragments[5][Math.floor(g/10)];
        }
      }
    }
    var w=r.charAt(r.length-1);
    if (["a","i","o"].includes(w)) r=r.substr(0,r.length-1);
    r+="illion";
    return Math.floor(Number(exp.text(exp.div(i,[e,false]),"e"))*1000)/1000+" "+r;
  }
});
