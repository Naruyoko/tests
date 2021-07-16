function lrl(s){
  var n=s.length;
  var a=[[]];
  var l=0;
  for (var i=1;i<=n+1;i++){
    a.push([]);
    for (var j=i+1;j<=n+1;j++){
      if (s[i-1]==s[j-1]&&a[i-1][j-1]|0<j-i){
        a[i][j]=(a[i-1][j-1]|0)+1;
        if (a[i][j]>l) l=a[i][j];
      }
    }
  }
  return l;
}
function countOccurrences(string, subString, allowOverlapping) {
  string+="";
  subString+="";
  if (subString.length<=0)return string.length+1;
  var n=0,
  pos=0,
  step=allowOverlapping?1:subString.length;
  while (true){
    pos=string.indexOf(subString,pos);
    if (pos>=0){
      ++n;
      pos+=step;
    }else break;
  }
  return n;
}
function finalLength(s){
  return utf8.encode(s).length+countOccurrences(s,"\n")+countOccurrences(s,"\r")+countOccurrences(s,"'");
}
function compression1(s){
  console.log(s);
  console.log(s.length);
  var availableChars=[];
  for (var i=33;i<=126;i++){
    if ([34,36,39,92,96].includes(i)) continue;
    if (((s+"'`").indexOf(String.fromCharCode(i))==-1)&&String.fromCharCode(i))
    availableChars.push(String.fromCharCode(i));
  }
  console.log(availableChars);
  var w=["e"];
  var t=[];
  while (w.length&&availableChars.length>=1){
    w=[];
    var m=0;
    var r="";
    var x=new Set();
    var ml=lrl(s);
    for (var i=0;i<s.length;i++){
      for (var j=2;j<=Math.min((s.length-i)/2,ml);j++){
        var sub=s.substring(i,i+j);
        if (x.has(sub)) continue;
        var q=countOccurrences(s,sub);
        for (var e=0;e<t.length;e++) q+=countOccurrences(t[e][0],sub);
        var sl=finalLength(sub);
        var k=(q-1)*sl-q+2;
        if (k>0) w.push([sub,k,q]);
        if (k>m){
          m=k;
          r=w.length-1;
        }
        x.add(sub);
      }
    }
    if (!w.length) break;
    s=s.replace(new RegExp(w[r][0].replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'),"g"),availableChars[0]);
    for (var e=0;e<t.length;e++) t[e][0]=t[e][0].replace(new RegExp(w[r][0].replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'),"g"),availableChars[0]);
    console.log(w[r][0]+"=>"+availableChars[0]+" -"+m+"B");
    //console.log(w);
    t.push([w[r][0],availableChars[0]]);
    availableChars.splice(0,1);
  }
  console.log(t);
  console.log(w.length);
  if (t.length){
    var p=[];
    for (var i=0;i<t.length;i++){
      var l=0;
      var g=p.length;
      for (var j=0;j<p.length;j++){
        if (p[j][0].indexOf(t[i][1])!=-1) l=j+1;
        if (t[i][0].indexOf(p[j][1])!=-1) g=j;
      }
      p.splice(g,0,t[i]);
    }
    var s1="_='"+s;
    for (var i=0;i<p.length;i++) s1+=p[i][1]+p[i][0];
    s1=s1.replace(/\n/g,"\\n")+"'\nfor Y in '";
    for (var i=p.length-1;i>=0;i--) s1+=p[i][1];
    s1+="':_=_.split(Y);_=_.pop().join(_)\nexec(_)";
    var s2="_='"+s;
    for (var i=0;i<p.length;i++) s2+=p[i][1]+p[i][0];
    s2=s2.replace(/\n/g,"\\n")+"'\nfor(Y of $='";
    for (var i=p.length-1;i>=0;i--) s2+=p[i][1];
    s2+="':_=_.split(Y);_=_.pop().join(_)\nprint(_)";
  }else s1=s;
  /*
  console.log(s1);
  console.log(s1.length);
  console.log(s2);
  console.log(eval(s2));
  */
  return s1;
}
function compressions(s,a){
  var r=[["Original",s]];
  if (a.includes(1)) r.push(["",compression1(s)]);
  return r;
}
function compress(){
  var a=[];
  if (document.getElementById("c1").checked) a.push(1);
  var a=compressions(document.getElementById("input").value,a);
  var e="<tr><th>Name</th><th>String</th><th>Byte Size</th></tr>";
  var m=Infinity;
  for (var i=0;i<a.length;i++) m=Math.min(m,a[i][1].length);
  for (var i=0;i<a.length;i++){
    var q=a[i][1].length==m?" style=\"background-color:lime\"":"";
    e+="<tr><td"+q+">"+a[i][0]+"</td><td"+q+"><pre>"+a[i][1].replace(/</g,"&lt;").replace(/ /g,"&nbsp;").replace(/\n/g,"<br>")+"</pre></td><td"+q+">"+utf8.encode(a[i][1]).length+"</td></tr>";
  }
  document.getElementById("output").innerHTML=e;
}