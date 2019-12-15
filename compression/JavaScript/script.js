function occurrences(string, subString, allowOverlapping) {
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
  while (w.length){
    w=[];
    var m=0;
    var r="";
    var x=new Set();
    for (var i=0;i<s.length;i++){
      for (var j=2;j<=(s.length-i)/2;j++){
        var sub=s.substring(i,i+j);
        if (x.has(sub)) continue;
        var q=occurrences(s,sub);
        for (var e=0;e<t.length;e++) q+=occurrences(t[e][0],sub);
        var k=q*(j-1)-j-3;
        if (k>0) w.push([sub,k,q]);
        if (k>m){
          m=k;
          r=w.length-1;
        }
        x.add(sub);
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
    if (((s+"'`").indexOf(String.fromCharCode(i))==-1)&&String.fromCharCode(i))
    availableChars.push(String.fromCharCode(i));
  }
  console.log(availableChars);
  var w=["e"];
  var t=[];
  while (w.length){
    w=[];
    var m=0;
    var r="";
    var x=new Set();
    for (var i=0;i<s.length;i++){
      for (var j=2;j<=(s.length-i)/2;j++){
        var sub=s.substring(i,i+j);
        if (x.has(sub)) continue;
        var q=occurrences(s,sub);
        for (var e=0;e<t.length;e++) q+=occurrences(t[e][0],sub);
        var k=q*(j-1)-j-4;
        if (k>0) w.push([sub,k,q]);
        if (k>m){
          m=k;
          r=w.length-1;
        }
        x.add(sub);
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
    if (((s+"'`").indexOf(String.fromCharCode(i))==-1)&&String.fromCharCode(i))
    availableChars.push(String.fromCharCode(i));
  }
  console.log(availableChars);
  var w=["e"];
  var t=[];
  while (w.length){
    w=[];
    var m=0;
    var r="";
    var x=new Set();
    for (var i=0;i<s.length;i++){
      for (var j=2;j<=(s.length-i)/2;j++){
        var sub=s.substring(i,i+j);
        if (x.has(sub)) continue;
        var q=occurrences(s,sub);
        for (var e=0;e<t.length;e++) q+=occurrences(t[e][0],sub);
        var k=q*(j-1)-j-2;
        if (k>0) w.push([sub,k,q]);
        if (k>m){
          m=k;
          r=w.length-1;
        }
        x.add(sub);
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
    s1+="';for(Y of $='";
    for (var i=p.length-1;i>=0;i--) s1+=p[i][1];
    s1+="')with(_.split(Y))_=join(pop());eval(_)";
    var s2="_='"+s;
    for (var i=0;i<p.length;i++) s2+=p[i][1]+p[i][0];
    s2+="';for(Y of $='";
    for (var i=p.length-1;i>=0;i--) s2+=p[i][1];
    s2+="')with(_.split(Y ))_=join(pop());_";
  }
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
  if (a.includes(1)) r.push(["",compression2(s)]);
  if (a.includes(2)) r.push(["",compression1(s)]);
  if (a.includes(3)) r.push(["",compression3(s)]);
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