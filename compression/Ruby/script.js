window.onload=function (e){
  document.getElementById("charSet").innerHTML=Object.entries(charSets).map(function([name,{display}]){return "<option value=\""+name+"\">"+display+"</option>";}).join("");
  document.getElementById("quoteType").innerHTML=quoteTypes.map(function(value){return "<option value=\""+(value=='"'?"&quot;":value)+"\">"+value+"</option>";}).join("");
  document.getElementById("encoding").innerHTML=Object.entries(encodings).map(function([name,{display}]){return "<option value=\""+name+"\">"+display+"</option>";}).join("");
};
var charSets={
  NonControlASCII:{
    display:"Non Control ASCII",
    nextCodePoint:function(n){return isNaN(n)?32:n+1>=127?NaN:n+1}
  },
  FullASCII:{
    display:"Full ASCII",
    nextCodePoint:function(n){return isNaN(n)?0:n+1>=128?NaN:n+1}
  },
  NonControlOneBytes:{
    display:"Non Control One Byte",
    nextCodePoint:function(n){return isNaN(n)?32:n+1==127?160:n+1>=256?NaN:n+1}
  },
  FullOneBytes:{
    display:"Full One Byte",
    nextCodePoint:function(n){return isNaN(n)?0:n+1>=256?NaN:n+1}
  },
  NonControlTwoBytes:{
    display:"Non Control Two Bytes",
    nextCodePoint:function(n){return isNaN(n)?32:n+1==127?160:n+1==55296?57344:n+1>=4**8?NaN:n+1}
  },
  FullTwoBytes:{
    display:"Full Two Bytes",
    nextCodePoint:function(n){return isNaN(n)?0:n+1==55296?57344:n+1>=4**8?NaN:n+1}
  }/*,
  NonControlFourBytes:{
    display:"Non Control Four Bytes",
    nextCodePoint:function(n){return isNaN(n)?32:n+1==127?160:n+1==55296?57344:n+1>=1<<32?NaN:n+1}
  },
  FullFourBytes:{
    display:"Full Four Bytes",
    nextCodePoint:function(n){return isNaN(n)?0:n+1==55296?57344:n+1>=1<<32?NaN:n+1}
  }*/
};
var quoteTypes=['"',"'"];
var encodings={
}
var options={};
function nextCodePoint(s,n){
  var quoteCode=options.quoteType.charCodeAt();
  var isUsingControl=options.charSet.display.indexOf("Full")!=-1;
  var isUsingPostASCII=options.charSet.display.indexOf("ASCII")==-1;
  while (true){
    var next;
    if (n==10) next=13;
    else if (n==13) next=92;
    else if (n==92) next=quoteCode;
    else if (n==quoteCode) next=isUsingPostASCII?128:NaN;
    else if (n==127) next=isUsingControl?10:92;
    else{
      next=n;
      do{
        next=options.charSet.nextCodePoint(next);
      }while(next==10||next==13||next==92||next==quoteCode);
    }
    if (isNaN(next)) return NaN;
    else if (s.indexOf(String.fromCodePoint(next))==-1) return next;
    else n=next;
  }
}
function stringFromCodePoint(n){
  if (n==10) return "\\n";
  else if (n==13) return "\\r";
  else if (n==92) return "\\\\";
  else if (n==options.quoteType.charCodeAt()) return "\\"+options.quoteType;
  else return String.fromCodePoint(n);
}
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
function listInitialSubstrings(s){
  var a=new Map();
  var tested=new Set();
  var len=s.length;
  for (var i=0;i<len;++i){
    console.log(i)
    for (var j=i+2;j*2-i<=len;++j){
      var substr=s.substring(i,j);
      if (tested.has(substr)) continue;
      tested.add(substr);
      var occurrences=countOccurrences(s,substr);
      if (occurrences>1) a.set(substr,occurrences);
    }
  }
  return a;
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
  return utf8.encode(s).length+countOccurrences(s,"\n")+countOccurrences(s,"\r")+countOccurrences(s,options.quoteType);
}
function escapeNewLinesAndQuotes(s){
  return s.replace(/\\/g,"\\\\").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(new RegExp(options.quoteType,"g"),"\\"+options.quoteType);
}
//Adopted from https://stackoverflow.com/a/6714233
function replaceAll(a,b,c){
  return a.replace(new RegExp(b.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),"g"),typeof c=="string"?c.replace(/\$/g,"$$$$"):c);
}
function compression1o(s){
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
    s1=s1.replace(/\n/g,"\\n")+"';'";
    for (var i=p.length-1;i>=0;i--) s1+=p[i][1];
    s1+="'.each_char{|y|_=_.split(y);_=_.join(_.pop())};eval(_)";
    var s2="_='"+s;
    for (var i=0;i<p.length;i++) s2+=p[i][1]+p[i][0];
    s2=s2.replace(/\n/g,"\\n")+"';'";
    for (var i=p.length-1;i>=0;i--) s2+=p[i][1];
    s2+="'.each_char{|y|_=_.split(y);_=_.join(_.pop())};$><<_";
  }else s1=s;
  /*
  console.log(s1);
  console.log(s1.length);
  console.log(s2);
  console.log(eval(s2));
  */
  return s1;
}
function compression1(s,passes=4){
  console.log(s);
  console.log(finalLength(s));
  var dict=[];
  for (;passes--;){
    var occurrencesMap=listInitialSubstrings(s);
    var keyCodePoint=NaN;
    var lastReplaced=null;
    while (true){
      keyCodePoint=nextCodePoint(s+dict.map(function(e){return e[0]+e[1];}).join(""),keyCodePoint);
      if (isNaN(keyCodePoint)) break;
      var key=String.fromCharCode(keyCodePoint);
      var keyLength=finalLength(key);
      var bestSubstrs=[];
      var bestSavedAmount=0;
      occurrencesMap.forEach(function(occurrences,substr){
        var processedSubstr;
        if (lastReplaced){
          var lastSubstr=lastReplaced[0];
          var lastKey=lastReplaced[1];
          processedSubstr=replaceAll(substr,lastSubstr,lastKey);
          var recalculate=substr!=processedSubstr;
          for (var sublen=1;!recalculate&&sublen<lastSubstr.length;++sublen){
            var index=processedSubstr.lastIndexOf(lastSubstr.substring(0,sublen));
            if (index==-1) break;
            else if (index==processedSubstr.length-sublen) recalculate=true;
          }
          for (var sublen=lastSubstr.length-1;!recalculate&&sublen>0;++sublen){
            var index=processedSubstr.indexOf(lastSubstr.substring(sublen));
            if (index==-1) break;
            else if (index==0) recalculate=true;
          }
          if (recalculate){
            occurrences=countOccurrences(s,processedSubstr);
            for (var i=0;i<dict.length;i++) occurrences+=countOccurrences(dict[i][0],processedSubstr);
          }
        }else processedSubstr=substr;
        var substrLength=finalLength(processedSubstr);
        var lengthSaved=(occurrences-1)*substrLength-(occurrences+2)*keyLength;
        if (lengthSaved>0){
          if (processedSubstr!=substr) occurrencesMap.delete(substr);
          occurrencesMap.set(processedSubstr,occurrences);
          if (lengthSaved>bestSavedAmount){
            bestSubstrs=[processedSubstr];
            bestSavedAmount=lengthSaved;
          }else if (lengthSaved==bestSavedAmount){
            bestSubstrs.push(processedSubstr);
          }
        }else{
          occurrencesMap.delete(substr);
        }
      });
      if (!bestSubstrs.length) break;
      var bestSubstr=bestSubstrs[Math.floor(Math.random()*bestSubstrs.length)];
      s=replaceAll(s,bestSubstr,key);
      for (var i=0;i<dict.length;i++){
        dict[i][0]=replaceAll(dict[i][0],bestSubstr,key);
      }
      var subsubs=new Set();
      var len=bestSubstr.length;
      for (var i=0;i<len;++i){
        for (var j=i+1;j<=len;++j){
          subsubs.add(bestSubstr.substring(i,j));
        }
      }
      var removedOccurenceNum=occurrencesMap.get(bestSubstr)-1;
      subsubs.forEach(function(subsub){
        if (occurrencesMap.has(subsub)){
          occurrencesMap.set(subsub,occurrencesMap.get(subsub)-removedOccurenceNum*countOccurrences(bestSubstr,subsub));
        }
      });
      dict.push(lastReplaced=[bestSubstr,key]);
      console.log(bestSubstr+" ==> "+key+" -"+bestSavedAmount+"B, Replacing "+(removedOccurenceNum+1));
      console.log(bestSubstrs);
      console.log(s);
    }
    var revised=false;
    for (var i=0;i<dict.length;++i){
      var occurrences=countOccurrences(s,dict[i][1]);
      for (var j=0;j<dict.length;++j){
        occurrences+=countOccurrences(dict[j][0],dict[i][1]);
      }
      var lengthSaved=(occurrences-1)*finalLength(dict[i][0])-(occurrences+2)*finalLength(dict[i][1]);
      if (lengthSaved<=0){
        s=replaceAll(s,dict[i][1],dict[i][0]);
        for (var j=0;j<dict.length;j++){
          dict[j][0]=replaceAll(dict[j][0],dict[i][1],dict[i][0]);
        }
        dict.splice(i,1);
        revised=true;
        console.log("Reverted "+dict[i][0]+" <== "+dict[i][1]+" -"+-lengthSaved+"B");
      }
    }
    if (!revised) break;
  }
  console.log(dict);
  var r;
  if (dict.length){
    dict.sort(function(a,b){
      if (a[0].indexOf(b[1])!=-1) return -1;
      else if (b[0].indexOf(a[1])!=-1) return 1;
      else return 0;
    });
    r="_="+options.quoteType+escapeNewLinesAndQuotes(s+dict.map(function(s){return s[1]+s[0];}).join(""))+options.quoteType+";"+options.quoteType+escapeNewLinesAndQuotes(dict.map(function(s){return s[1];}).reverse().join(""))+options.quoteType+".each_char{|y|_=_.split(y);_=_.join(_.pop())};eval(_)";
  }else r=s;
  console.log(r);
  return r;
}
function compressions(s,a){
  var r=[["Original",s]];
  if (a.includes(1)) r.push(["",compression1o(s)]);
  if (a.includes(2)) r.push(["",compression1(s)]);
  return r;
}
function compress(){
  var a=[];
  if (document.getElementById("c1o").checked) a.push(1);
  if (document.getElementById("c1").checked) a.push(2);
  options.charSet=charSets[document.getElementById("charSet").value];
  options.quoteType=document.getElementById("quoteType").value;
  options.encoding=encodings[document.getElementById("encoding").value];
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