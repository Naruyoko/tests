var notations=notations||{};
notations.normalsmall=(function (i){
  if (i<0) return "-"+notations.normalsmall(Math.abs(i));
  if (isNaN(i)) return "NaN";
  if (!isFinite(i)) return "Infinity";
  if (i<1000) return String(i);
  if ((i>=1000)&&(i<1e+6)){
    var l;
    var r=Math.floor(i%1000);
    l=String(r);
    if (r<10) l="00"+l;
    if ((r>=10)&&(r<100)) l="0"+l;
    return Math.floor(i/1000)+","+l;
  }
  var numbernames=["thousand","million","billion","trillion","quadrillion","quintillion","sextillion","septillion","octillion","nonillion","decillion","undecillion","duodecillion","tredecillion","quattuordecillion","quindecillion","sexdecillion","septendecillion","octodecillion","novemdecillion"];
  var namefragments=[["","un","duo","tre","quattuor","quinqua","se","septe","outo","nove"],["","deci","viginti","triginta","quadraginta","quinquaginta","sexaginta","septuaginta","octoginta","nonaginta"],["","centi"]];
  var e=3*Math.floor(Math.log10(i)/3);
  var l=Math.floor(e/3)-1;
  if (l<=19){
    return Math.floor(i/Math.pow(10,e)*1000)/1000+" "+numbernames[l];
  }else{
    var s="";
    var d=[l%10,Math.floor(l%100/10),Math.floor(l/100)];
    s=namefragments[0][d[0]];
    if ([3,6].includes(d[0])&&(((d[1]!=0)&&[2,3,4,5].includes(d[1]))||((d[1]==0)&&[3,4,5].includes(d[2])))) s+="s";
    if ((d[0]==6)&&(((d[1]!=0)&&(d[1]==8))||((d[1]==0)&&(d[2]==8)))) s+="x";
    if ([7,9].includes(d[0])&&(((d[1]!=0)&&[1,3,4,5,6,7].includes(d[1]))||((d[1]==0)&&[2,3,4,5,6,7].includes(d[2])))) s+="n";
    if ([7,9].includes(d[0])&&(((d[1]!=0)&&((d[1]==2)||(d[1]==8)))||((d[1]==0)&&(d[2]==8)))) s+="m";
    s+=namefragments[1][d[1]]+namefragments[2][d[2]];
    var w=s.charAt(s.length-1);
    if ((w=="a")||(w=="i")) s=s.substr(0,s.length-1);
    s+="illion";
    return Math.floor(i/Math.pow(10,e)*1000)/1000+" "+s;
  }
});
