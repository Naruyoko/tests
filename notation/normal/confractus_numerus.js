var notations=notations||{};
notations.normal=notations.normal||{};
notations.normal.confractus_numerus=(function (i){
  if (!(new Decimal(i.log10().toString()).isFinite())) return "Infinity";
  if (i.lt(1000)) return i.toString();
  if (i.gte(1000)&&i.lt(1e+6)){
    var h=Number(i);
    var l;
    var r=Math.floor(h%1000);
    l=String(r);
    if (r<10) l="00"+l;
    if ((r>=10)&&(r<100)) l="0"+l;
    return Math.floor(h/1000)+","+l;
  }
  var numbernames=["thousand","million","billion","trillion","quadrillion","quintillion","sextillion","septillion","octillion","nonillion","decillion","undecillion","duodecillion","tredecillion","quattuordecillion","quindecillion","sexdecillion","septendecillion","octodecillion","novemdecillion"];
  var namefragments=[["","un","duo","tre","quattuor","quinqua","se","septe","outo","nove"],["","deci","viginti","triginta","quadraginta","quinquaginta","sexaginta","septuaginta","octoginta","nonaginta"],["","centi","ducenti","trecenti","quadringenti","quingenti","sesgenti","septingenti","octingenti","nongenti"],["","milli","micro","nano","pico","femto","atto","zepto","yocto","xon","vec","mec","duec","trec","tetrec","pentec","hexec","heptec","octec","ennec"],["","mono","di","tri","tetra","penta","hexa","hepta","octa","nona","vec","mec","duec","trec","tetrec","pentec","hexec","heptec","octec","ennec"],["","vec","icosa","triaconta","tetraconta","pentaconta","hexaconta","heptaconta","octaconta","ennaconta"],["","","do","tria","tetra","penta","hexa","hepta","octa","enna"],["","killi","meg","gig","ter","pet"]];
  var e=new Decimal(i.log10().toString()).div(3).floor().mul(3);
  var l=e.div(3).sub(1);
  //console.log(l);
  if (l.lt(19)){
    return Math.floor(Number(i.div(new Decimal("1e+"+e)))*1000)/1000+" "+numbernames[l];
  }else{
    var r="";
    var s;
    var mu;
    var u=Math.floor(l.log10()/3);
    for (var g=u;g>=Math.max(u-5,0);g--){
      var mu=Math.round(Number(l.div(Decimal.pow(1000,g)).floor().mod(1000)));
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
        var x="";
        if (g<=19){
          x=namefragments[3][g];
        }else{
          for (var y=Math.floor(Math.log10(g)/3);y>=0;y--){
            var z=Math.floor(g/Math.pow(1000,y))%1000;
            if (z<1) continue;
            if ((z==1)&&(y===0)) x+="un";
            if (z>1){
              if (z<=19){
                x+=namefragments[4][z];
              }else if (z<=100){
                x+=namefragments[4][z%10]+namefragments[5][Math.floor(z/10)];
              }else if (z%100){
                x+=namefragments[6][Math.floor(z/100)]+"hecaton"+namefragments[4][z%10]+namefragments[5][Math.floor(z/10)%10];
              }else{
                x+=namefragments[6][z/100]+"hecto";
              }
            }
            x+=namefragments[7][y];
          }
        }
        r+=s+x;
      }
    }
    var w=r.charAt(r.length-1);
    if (["a","i","o"].includes(w)) r=r.substr(0,r.length-1);
    r+="illion";
    return Math.floor(Number(i.div(new Decimal("1e+"+e.toString())))*1000)/1000+" "+r;
  }
});
