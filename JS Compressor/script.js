function compression1(s){
  console.log(s);
  console.log(s.length);
  var availableChars=[];
  for (var i=33;i<=126;i++){
    if ([34,36,39,92,96].includes(i)) continue;
    if (((s+"evalreplase()./g,'`").search(String.fromCharCode(i).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'))==-1)&&String.fromCharCode(i))
    availableChars.push(String.fromCharCode(i));
  }
  console.log(availableChars);
  var w=["e"];
  var t=[];
  while (w.length){
    w=[];
    var m=0;
    var r="";
    for (var i=0;i<s.length;i++){
      for (var j=0;j<=(s.length-i)/2;j++){
        if (s.search(availableChars[0]+s.substring(i,i+j).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')+availableChars[1])!=-1) continue;
        for (var k=0;k<w.length;k++) if (w[k][0]==s.substring(i,i+j)) continue;
        var y=s.match(new RegExp(s.substring(i,i+j).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'),"g"));
        for (var e=0;e<t.length;e++) y.concat(t[e][0].match(new RegExp(t[e][0].replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'),"g")));
        var q=y?y.length:0;
        var k=q*(j-1)-j-3;
        if (k>0) w.push([s.substring(i,i+j),k,q]);
        if (k>m){
          m=k;
          r=w.length-1;
        }
      }
    }
    if (!w.length) break;
    s=s.replace(new RegExp(w[r][0].replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'),"g"),availableChars[2]);
    for (var e=0;e<t.length;e++) t[e][0]=t[e][0].replace(new RegExp(w[r][0].replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'),"g"),availableChars[2]);
    console.log(w[r][0]+"=>"+availableChars[2]+" -"+m+"B");
    //console.log(w);
    t.push([w[r][0],availableChars[2]]);
    availableChars.splice(2,1);
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
    var s1="eval('eval(\""+s+"\".replace(/";
    for (var i=0;i<p.length-1;i++) s1+=p[i][1]+availableChars[0]+p[i][0]+availableChars[1];
    s1+=p[p.length-1][1]+availableChars[0]+p[p.length-1][0]+"\"))'.replace(/"+availableChars[0]+"/g,'/g,\"').replace(/"+availableChars[1]+"/g,'\").replace(/'))";
    var s2="eval('\""+s+"\".replace(/";
    for (var i=0;i<p.length-1;i++) s2+=p[i][1]+availableChars[0]+p[i][0]+availableChars[1];
    s2+=p[p.length-1][1]+availableChars[0]+p[p.length-1][0]+"\")'.replace(/"+availableChars[0]+"/g,'/g,\"').replace(/"+availableChars[1]+"/g,'\").replace(/'))";
    var s3="'\""+s+"\".replace(/";
    for (var i=0;i<p.length-1;i++) s3+=p[i][1]+availableChars[0]+p[i][0]+availableChars[1];
    s3+=p[p.length-1][1]+availableChars[0]+p[p.length-1][0]+"\")'.replace(/"+availableChars[0]+"/g,'/g,\"').replace(/"+availableChars[1]+"/g,'\").replace(/')";
  }
  /*
  console.log(s1);
  console.log(s1.length);
  console.log(s2);
  console.log(eval(s2));
  console.log(s3);
  console.log(eval(s3));
  */
  return s1;
}
function compression2(s){
  console.log(s);
  console.log(s.length);
  var availableChars=[];
  for (var i=33;i<=126;i++){
    if ([34,36,39,92,96].includes(i)) continue;
    if (((s+"evalreplase()./g,'`").search(String.fromCharCode(i).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'))==-1)&&String.fromCharCode(i))
    availableChars.push(String.fromCharCode(i));
  }
  console.log(availableChars);
  var w=["e"];
  var t=[];
  while (w.length){
    w=[];
    var m=0;
    var r="";
    for (var i=0;i<s.length;i++){
      for (var j=0;j<=(s.length-i)/2;j++){
        if (s.search(availableChars[0]+s.substring(i,i+j).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')+availableChars[1])!=-1) continue;
        for (var k=0;k<w.length;k++) if (w[k][0]==s.substring(i,i+j)) continue;
        var y=s.match(new RegExp(s.substring(i,i+j).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'),"g"));
        for (var e=0;e<t.length;e++) y.concat(t[e][0].match(new RegExp(t[e][0].replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'),"g")));
        var q=y?y.length:0;
        var k=q*(j-1)-j-4;
        if (k>0) w.push([s.substring(i,i+j),k,q]);
        if (k>m){
          m=k;
          r=w.length-1;
        }
      }
    }
    if (!w.length) break;
    s=s.replace(new RegExp(w[r][0].replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'),"g"),availableChars[3]);
    for (var e=0;e<t.length;e++) t[e][0]=t[e][0].replace(new RegExp(w[r][0].replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'),"g"),availableChars[3]);
    console.log(w[r][0]+"=>"+availableChars[3]+" -"+m+"B");
    //console.log(w);
    t.push([w[r][0],availableChars[3]]);
    availableChars.splice(3,1);
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
    var s1="eval('eval(\""+s+"\"";
    for (var i=0;i<p.length;i++) s1+=availableChars[0]+p[i][1]+availableChars[1]+p[i][0]+availableChars[2];
    s1+="'.replace(/"+availableChars[0]+"/g,'.replace(/').replace(/"+availableChars[1]+"/g,'/g,\"').replace(/"+availableChars[2]+"/g,'\")'))";
    var s2="eval('\""+s+"\"";
    for (var i=0;i<p.length;i++) s2+=availableChars[0]+p[i][1]+availableChars[1]+p[i][0]+availableChars[2];
    s2+="'.replace(/"+availableChars[0]+"/g,'.replace(/').replace(/"+availableChars[1]+"/g,'/g,\"').replace(/"+availableChars[2]+"/g,'\")'))";
    var s3="'\""+s+"\"";
    for (var i=0;i<p.length;i++) s3+=availableChars[0]+p[i][1]+availableChars[1]+p[i][0]+availableChars[2];
    s3+="'.replace(/"+availableChars[0]+"/g,'.replace(/').replace(/"+availableChars[1]+"/g,'/g,\"').replace(/"+availableChars[2]+"/g,'\")')";
  }
  /*
  console.log(s1);
  console.log(s1.length);
  console.log(s2);
  console.log(eval(s2));
  console.log(s3);
  console.log(eval(s3));
  */
  return s1;
}
function compression3(s){
  console.log(s);
  console.log(s.length);
  var availableChars=[];
  for (var i=33;i<=126;i++){
    if ([34,36,39,92,96].includes(i)) continue;
    if (((s+"'`").search(String.fromCharCode(i).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'))==-1)&&String.fromCharCode(i))
    availableChars.push(String.fromCharCode(i));
  }
  console.log(availableChars);
  var w=["e"];
  var t=[];
  while (w.length){
    w=[];
    var m=0;
    var r="";
    for (var i=0;i<s.length;i++){
      for (var j=0;j<=(s.length-i)/2;j++){
        if (s.search(availableChars[0]+s.substring(i,i+j).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')+availableChars[1])!=-1) continue;
        for (var k=0;k<w.length;k++) if (w[k][0]==s.substring(i,i+j)) continue;
        var y=s.match(new RegExp(s.substring(i,i+j).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'),"g"));
        for (var e=0;e<t.length;e++) y.concat(t[e][0].match(new RegExp(t[e][0].replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'),"g")));
        var q=y?y.length:0;
        var k=q*(j-1)-j-2;
        if (k>0) w.push([s.substring(i,i+j),k,q]);
        if (k>m){
          m=k;
          r=w.length-1;
        }
      }
    }
    if (!w.length) break;
    s=s.replace(new RegExp(w[r][0].replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'),"g"),availableChars[3]);
    for (var e=0;e<t.length;e++) t[e][0]=t[e][0].replace(new RegExp(w[r][0].replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'),"g"),availableChars[3]);
    console.log(w[r][0]+"=>"+availableChars[3]+" -"+m+"B");
    //console.log(w);
    t.push([w[r][0],availableChars[3]]);
    availableChars.splice(3,1);
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
    s1+="';for(Y in $='";
    for (var i=p.length-1;i>=0;i--) s1+=p[i][1];
    s1+="')with(_.split($[Y]))_=join(pop());eval(_)";
    var s2="_='"+s;
    for (var i=0;i<p.length;i++) s2+=p[i][1]+p[i][0];
    s2+="';for(Y in $='";
    for (var i=p.length-1;i>=0;i--) s2+=p[i][1];
    s2+="')with(_.split($[Y]))_=join(pop());_";
  }
  /*
  console.log(s1);
  console.log(s1.length);
  console.log(s2);
  console.log(eval(s2));
  */
  return s1;
}
//compression3("for(A=[],B=[],C=9,D=99;D;D--){for(E=C;E;E--)A[E]=B[E]=E;for(F=C;E;F--){for(C++,G=0;G<=F;G++)(A[F]||A[F-G]<A[F]-H)&&(B[F]?(I=G,G=F):(H=A[F]-A[F-G],B[F-G]<B[F]&&(I=G,G=F)));for(J=0;J<C*I;J++)A[F]=A[F-I]+H,B[F]=B[F-I],F++;H=0}}C")
/*
_="r=a=0;P\x0By-~y<<x;Z\u0011>(r=x%2?0:1+\u0015/2\u0006;L\u0011>x/2>>\u0015\bS=\u0003t)=>{f=\tt\u0004x=r;\ff-2?f>2?f-v?t-(f>v)*c:y:\u0007f,\u0007\u000e(v+2,t\u0002y\u0004c,\u0015\u0006\u0006:A(\u000e\u0003\u0015\u0017};A\x0B\ty)-1?5<{f=d=c=0;\u00147;u=14;while\u0005&&D\u0005-1\u0004\u00011\u0006{d=\t\tD\u0005\u0017f\u0011\tr\bc-r||(\tu)||\tr)-f||\u0001u\u0012d,4,r\u0004\u0014A(t,d\u0016f\u000fd\u0013\u0004t\u0002t\u0004u\u0002u\u0017c&&\u0001\u0014\u0007~u&2|\u0001u=1<<\u0018u\u0016\u0018t\u0016c=r\bu\u000ft\u0013\u0004u\u0002t\u0004\u00149\b}\fa=\u0007\u0007t,\u0007u,P\u0005\u0013\u0006\u0004a\b};\u0010\u0010\u0010\u0010\u001099\u0006\u0017\u0001\u0005/=2)%2&&(\u0002\u001213,-4,\u0003(v,y\u0013,\u0004),\u0005(x\u0006))\u0007P(\b);\tL(\x0B=(y,x)=>\freturn \u000eS\u0003L\u0005\u0016S\u000f/2&\u0001c=\u0007\u0010D(\u0011=x=\u0012=S(4,\u0013,c\u0014t=\u0015Z\u0005\u0016)\u0004\u0017\u0006\b\u0018\u0007\tc\u0004";
for(Y in $="\u0018\u0017\u0016\u0015\u0014\u0013\u0012\u0011\u0010\u000f\u000e\f\x0B\t\b\u0007\u0006\u0005\u0004\u0003\u0002\u0001")
with(_.split($[Y])){
  console.log($[Y].charCodeAt(0).toString(16)+":------"+JSON.stringify(_.split($[Y])).replace(/","/g,"----"));
  _=join(pop());
}
console.log(_);
*/
function compressions(s,a){
  var r=[["Original",s]];
  if (a.includes(1)) r.push(["Naruyoko's v1",compression2(s)]);
  if (a.includes(2)) r.push(["Naruyoko's v2",compression1(s)]);
  if (a.includes(3)) r.push(["C7X",compression3(s)]);
  return r;
}
function compress(){
  var a=[];
  if (document.getElementById("n1").checked) a.push(1);
  if (document.getElementById("n2").checked) a.push(2);
  if (document.getElementById("c").checked) a.push(3);
  var a=compressions(document.getElementById("input").value,a);
  var e="<tr><th>Name</th><th>String</th><th>Byte Size</th></tr>";
  var m=Infinity;
  for (var i=0;i<a.length;i++) m=Math.min(m,a[i][1].length);
  for (var i=0;i<a.length;i++){
    var q=a[i][1].length==m?" style=\"background-color:lime\"":"";
    e+="<tr><td"+q+">"+a[i][0]+"</td><td"+q+">"+a[i][1].replace(/</g,"&lt;")+"</td><td"+q+">"+a[i][1].length+"</td></tr>";
  }
  document.getElementById("output").innerHTML=e;
}