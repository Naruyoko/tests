/** 
 * @typedef {0|{ord:{pow:Ordinal,coef:number}[],frac:null|{pow:Ordinal,coef:null|Decimal}}} Ordinal
 * @typedef {Ordinal|Infinity} Operation
 * @typedef {{ops:Operation[],num:Decimal}} Expression
 */
/** @type {Expression} */
var expression=null;
/** @type {Expression} */
var outExpression=null;
/** @type {Expression} */
var lastAcceptedExpression=null;
var lastAcceptedIndexInHistory=-1;
/** @type {Expression[]} */
var stepHistory=null;
/**
 * @typedef {{
 * eLimit:number,
 * argumentLimit:number,
 * opCountLimit:number,
 * opCountSkipDuplicates:boolean,
 * opComplexityLimit:number,
 * opTotalComplexityLimit:number,
 * digitsDisplayed:number,
 * stepDelay:number,
 * collapseDuplicates:boolean,
 * useArray:boolean,
 * collapseSeparators:boolean,
 * useLetters:boolean,
 * collapseLittleLetters:boolean,
 * maxHistoryLength:number,
 * historyPosition:number,
 * historyLinesShown:number,
 * collapseInHistory:boolean
 * }} Options
 */
/** @type {Options} */
var options={
  eLimit:1e13,
  argumentLimit:10,
  opCountLimit:24,
  opCountSkipDuplicates:true,
  opComplexityLimit:24,
  opTotalComplexityLimit:100,
  digitsDisplayed:12,
  stepDelay:100,
  collapseDuplicates:true,
  useArray:false,
  collapseSeparators:true,
  useLetters:false,
  collapseLittleLetters:true,
  maxHistoryLength:100000,
  historyPosition:0,
  historyLinesShown:10,
  collapseInHistory:true
};

/** @type {Ordinal} */
var ORDINAL_ZERO=0;
/** @type {Ordinal} */
var ORDINAL_ONE={ord:[{pow:ORDINAL_ZERO,coef:1}],frac:null};
/** @type {Ordinal} */
var ORDINAL_TWO={ord:[{pow:ORDINAL_ZERO,coef:2}],frac:null};
/** @type {Ordinal} */
var ORDINAL_OMEGA={ord:[{pow:ORDINAL_ONE,coef:1}],frac:null};
/**
 * @param {Ordinal} op 
 * @returns {Ordinal}
 */
function normalizeOrdinal(op){
  if (op instanceof Object){
    if (op.frac){
      op.frac.pow=normalizeOrdinal(op.frac.pow);
      if ((!(op.frac.pow instanceof Object)||op.frac.pow.frac===null)&&(op.frac.coef===null||op.frac.coef.isInt())){
        op.ord.unshift({pow:op.frac.pow,coef:op.frac.coef===null?1:op.frac.coef.toNumber()});
        op.frac=null;
      }
    }
    for (var i=0;i<op.ord.length;i++){
      if (op.ord[i].coef==0) op.ord.splice(i--,1);
      else{
        op.ord[i].pow=normalizeOrdinal(op.ord[i].pow);
        if (i>0&&opEquals(op.ord[i].pow,op.ord[i-1].pow)){
          op.ord.splice(--i,2,{pow:op.ord[i].pow,coef:op.ord[i].coef+op.ord[i+1].coef});
        }
      }
    }
    if (op.ord.length==0&&!op.frac) return ORDINAL_ZERO;
    else return op;
  }else return op;
}
/**
 * @param {string} s
 * @param {number=} index
 * @param {boolean=} allowLowPriorityOperations
 * @returns {[Ordinal,number]|null}
 */
function parseOrdinal(s,index,allowLowPriorityOperations){
  if (index===undefined) index=0;
  if (allowLowPriorityOperations===undefined) allowLowPriorityOperations=true;
  var quit=false;
  var ord=ORDINAL_ZERO;
  while (!quit&&index<s.length){
    /** @type {Ordinal} */
    var pow;
    /** @type {number} */
    var coef;
    if (s[index]=="w"||s[index]=="ω"){
      if (s[index+1]=="^"){
        if (s[index+2]=="("||s[index+2]=="{"){
          var result=parseOrdinal(s,index+3,true);
          if (result===null) return null;
          pow=result[0];
          index=result[1];
        }else{
          var result=parseOrdinal(s,index+2,false);
          if (result===null) return null;
          pow=result[0];
          index=result[1];
        }
      }else{
        pow=ORDINAL_ONE;
        index++;
      }
      if (allowLowPriorityOperations&&s[index]=="*"){
        index++;
        var coefstart=index;
        while ("0123456789".indexOf(s[index])!=-1) index++;
        coef=parseInt(s.substring(coefstart,index));
      }else coef=1;
    }else if ("0123456789".indexOf(s[index])!=-1){
      pow=ORDINAL_ZERO;
      var coefstart=index;
      while ("0123456789".indexOf(s[index])!=-1) index++;
      coef=parseInt(s.substring(coefstart,index));
    }
    if (ord===ORDINAL_ZERO) ord={ord:[{pow:pow,coef:coef}],frac:null};
    else if (ord instanceof Object) ord.ord.unshift({pow:pow,coef:coef});
    if (allowLowPriorityOperations&&index<s.length){
      if (s[index]==")"||s[index]=="}"){
        index++;
        quit=true;
      }else if (s[index]=="+") index++;
      else return null;
    }else quit=true;
  }
  return [normalizeOrdinal(ord),index];
}
/**
 * @param {string} s
 * @param {number=} index
 * @returns {[Ordinal,number]|null}
 */
function parseArray(s,index){
  if (index===undefined) index=s.length-1;
  var ord=ORDINAL_ZERO;
  /** @type {{pow:Ordinal,coef:number}[]} */
  var poword=[];
  while (index>=0&&s[index]!="("){
    if ("0123456789".indexOf(s[index])!=-1){
      var coefend=index;
      while ("0123456789".indexOf(s[index])!=-1) index--;
      var coef=parseInt(s.substring(index+1,coefend+1));
      if (coef){
        if (ord===ORDINAL_ZERO) ord={ord:[{pow:poword.length?{ord:poword.slice(),frac:null}:ORDINAL_ZERO,coef:coef}],frac:null};
        else if (ord instanceof Object) ord.ord.push({pow:poword.length?{ord:poword.slice(),frac:null}:ORDINAL_ZERO,coef:coef});
      }
    }else if (s[index]==")"||s[index]==","){
      var factor;
      if (s[index]==")"){
        var result=parseArray(s,index-1);
        if (result===null) return null;
        factor=result[0];
        index=result[1];
      }else{
        factor=ORDINAL_ZERO;
        index--;
      }
      while (poword.length&&opLessThan(poword[0].pow,factor)) poword.shift();
      poword.unshift({pow:factor,coef:1});
    }else return null;
  }
  if (s[index]=="(") index--;
  return [normalizeOrdinal(ord),index];
}
/**
 * @param {string} s
 * @returns {Expression}
 */
function parseExpression(s){
  var numPos=s.search(/\d+(\.\d*)?((e|\*10\^)[\+-]?\d+)?$/);
  var opPart=s.substring(0,numPos);
  var numberPart=s.substring(numPos);
  /** @type {Operation[]} */
  var ops=[];
  var m=opPart.matchAll(/\[([eε]_?0|[\dwω+*^\(\)\{\}]+|[\d\(\),]+)\]|[A-Z][a-z]*/g);
  var next;
  while (next=m.next(),!next.done){
    var part=next.value[0];
    if (part=="Q") ops.push(Infinity);
    else if (part[0]=="["){
      if (part.search(/[eε]/)!=-1) ops.push(Infinity);
      else if (part.search(/[wω+*^\{\}]/)!=-1){
        var result=parseOrdinal(part.substring(1,part.length-1));
        if (result===null) continue;
        var op=result[0];
        normalizeOrdinal(op);
        if (op instanceof Object&&op.ord.length) ops.push(op);
      }else{
        var result=parseArray(part.substring(1,part.length-1));
        if (result===null) continue;
        var op=result[0];
        normalizeOrdinal(op);
        if (op instanceof Object&&op.ord.length) ops.push(op);
      }
    }else{
      var numop=[0,0,0,0];
      for (var k=0;k<part.length;k++){
        var letter=part[k].toLowerCase();
        if (letter=="e") numop[0]+=1;
        else if (letter=="f") numop[0]+=2;
        else if (letter=="g") numop[0]+=3;
        else if (letter=="h") numop[0]+=4;
        else if (letter=="j") numop[1]+=1;
        else if (letter=="k") numop[0]+=1,numop[1]+=1;
        else if (letter=="l") numop[0]+=2,numop[1]+=1;
        else if (letter=="m") numop[1]+=2;
        else if (letter=="n") numop[2]+=1;
        else if (letter=="p") numop[3]+=1;
      }
      if (numop[0]||numop[1]||numop[2]||numop[3]){
        /** @type {Ordinal} */
        var op={ord:[],frac:null};
        if (numop[0]) op.ord.push({pow:ORDINAL_ZERO,coef:numop[0]});
        if (numop[1]) op.ord.push({pow:ORDINAL_ONE,coef:numop[1]});
        if (numop[2]) op.ord.push({pow:ORDINAL_TWO,coef:numop[2]});
        if (numop[3]) op.ord.push({pow:ORDINAL_OMEGA,coef:numop[3]});
        ops.push(op);
      }
    }
  }
  var num=Decimal(numberPart.replace("*10^","e"));
  return {ops:ops,num:num};
}
/**
 * @param {Operation} op1 
 * @param {Operation} op2 
 * @returns {boolean}
 */
function opEquals(op1,op2){
  if (op1===ORDINAL_ZERO) return op2===ORDINAL_ZERO;
  else if (op1===Infinity) return op2===Infinity;
  else if (op1 instanceof Object){
    if (!(op2 instanceof Object)||op1.ord.length!=op2.ord.length) return false;
    for (var i=0;i<op1.ord.length;i++){
      var term1=op1.ord[i];
      var term2=op2.ord[i];
      if (!opEquals(term1.pow,term2.pow)||term1.coef!=term2.coef) return false;
    }
    return true;
  }
}
/**
 * @param {Operation} op1 
 * @param {Operation} op2 
 * @returns {boolean}
 */
function opLessThan(op1,op2){
  if (op2===ORDINAL_ZERO) return false;
  else if (op2===Infinity) return op1!==Infinity;
  else if (op2 instanceof Object){
    if (op1===ORDINAL_ZERO) return true;
    if (op1===Infinity) return false;
    else if (op1 instanceof Object){
      if (op1.frac!==null||op2.frac!==null) return false;
      for (var i=0;i<Math.min(op1.ord.length,op2.ord.length);i++){
        var term1=op1.ord[op1.ord.length-1-i];
        var term2=op2.ord[op2.ord.length-1-i];
        if (opLessThan(term1.pow,term2.pow)) return true;
        else if (opLessThan(term2.pow,term1.pow)) return false;
        else if (term1.coef!=term2.coef) return term1.coef<term2.coef;
      }
      return op1.ord.length<op2.ord.length;
    }
  }
}
/**
 * @param {Decimal} num 
 * @param {Options=} options 
 * @returns {string}
 */
function formatNumber(num,options){
  var digitsDisplayed=options?options.digitsDisplayed:12;
  var r=num.toPrecision(digitsDisplayed);
  if (r.indexOf("e")!=-1) return r.replace(/\.?0*e\+?/,"*10^");
  else if (r.indexOf(".")!=-1) return r.replace(/\.?0+$/,"");
  else return r;
}
/**
 * @param {Ordinal} pow
 * @param {Options=} options 
 * @param {boolean=} collapse
 * @returns {string}
 */
function stringifyPower(pow,options,collapse){
  if (pow===ORDINAL_ZERO) return "1";
  else if (pow instanceof Object){
    if (opEquals(pow,ORDINAL_ONE)) return "ω";
    else{
      if (collapse) return "ω<sup>"+stringifyOrdinal(pow,options,collapse)+"</sup>";
      else if (pow.ord.length>=2||pow.ord.length==1&&(pow.ord[0].pow!==ORDINAL_ZERO&&pow.ord[0].coef>1||pow.frac)||pow.frac&&(pow.frac.pow!==ORDINAL_ZERO&&pow.frac.coef!==null)) return "ω^{"+stringifyOrdinal(pow,options,collapse)+"}";
      else return "ω^"+stringifyOrdinal(pow,options,collapse);
    }
  }
}
/**
 * @param {Ordinal} op
 * @param {Options=} options 
 * @param {boolean=} collapse
 * @returns {string}
 */
function stringifyOrdinal(op,options,collapse){
  if (op===ORDINAL_ZERO) return "0";
  else if (op instanceof Object){
    var r="";
    for (var i=op.ord.length-1;i>=0;i--){
      var term=op.ord[i];
      var termStr;
      if (term.pow===ORDINAL_ZERO) termStr=term.coef+"";
      else if (term.pow instanceof Object){
        if (term.coef==1) termStr=stringifyPower(term.pow,options,collapse);
        else termStr=stringifyPower(term.pow,options,collapse)+"*"+term.coef;
      }
      if (r) r+="+"+termStr;
      else r=termStr;
    }
    if (op.frac){
      var fracStr;
      if (op.frac.pow===ORDINAL_ZERO) fracStr=formatNumber(op.frac.coef,options)+"";
      else if (op.frac.pow instanceof Object){
        if (op.frac.coef===null) fracStr=stringifyPower(op.frac.pow,options,collapse);
        else fracStr=stringifyPower(op.frac.pow,options,collapse)+"*"+formatNumber(op.frac.coef,options);
      }
      if (r) r+="+"+fracStr;
      else r=fracStr;
    }
    return r;
  }
}
/**
 * @param {Ordinal} op
 * @param {Options=} options 
 * @param {boolean=} collapse
 * @returns {string}
 */
function stringifyArray(op,options,collapse){
  var collapseSeparators=options?options.collapseSeparators:false;
  if (op===ORDINAL_ZERO) return "0";
  else if (op instanceof Object){
    var r="";
    for (var i=0;i<op.ord.length;i++){
      var pow=op.ord[i].pow;
      var coef=op.ord[i].coef;
      if (pow===ORDINAL_ZERO) r=coef+r;
      else if (pow instanceof Object){
        var j=0;
        /** @type {number} */
        var powcoef=-1;
        if (i!=0){
          var pow2=op.ord[i-1].pow;
          while (pow2 instanceof Object&&j<pow2.ord.length&&opEquals(pow.ord[pow.ord.length-1-j].pow,pow2.ord[pow2.ord.length-1-j].pow)){
            if (pow.ord[pow.ord.length-1-j].coef!=pow2.ord[pow2.ord.length-1-j].coef){
              powcoef=pow.ord[pow.ord.length-1-j].coef-pow2.ord[pow2.ord.length-1-j].coef;
              break;
            }
            j++;
          }
        }
        if (powcoef==-1) powcoef=pow.ord[pow.ord.length-1-j].coef;
        var termstr="";
        while (true){
          var powpow=pow.ord[pow.ord.length-1-j].pow;
          var powpowstr=powpow===ORDINAL_ZERO?",":"("+stringifyArray(powpow,options,collapse)+")";
          termstr=(powcoef>1?collapse&&collapseSeparators?powpowstr+"<sub>"+powcoef+"</sub>":powpowstr+("0"+powpowstr).repeat(powcoef-1):powpowstr)+(termstr?"0"+termstr:termstr);
          j++;
          if (j>=pow.ord.length) break;
          powcoef=pow.ord[pow.ord.length-1-j].coef;
        }
        r=coef+termstr+(r||"0");
      }
    }
  }
  return r;
}
/**
 * @param {Ordinal} op 
 * @returns {[number,number,number,number]|null}
 */
function writableWithLetters(op){
  if (op===ORDINAL_ZERO) return null;
  else if (op instanceof Object){
    if (op.frac||op.ord.length>4) return null;
    /** @type {[number,number,number,number]} */
    var r=[0,0,0,0];
    var i=0;
    for (var j=0;j<4&&i<op.ord.length;j++){
      var pow=j==0?ORDINAL_ZERO:j==1?ORDINAL_ONE:j==2?ORDINAL_TWO:ORDINAL_OMEGA;
      if (opEquals(op.ord[i].pow,pow)){
        r[j]=op.ord[i].coef;
        i++;
      }
    }
    if (i<op.ord.length) return null;
    else return r;
  }
}
/**
 * @param {Expression} expression
 * @param {Options=} options 
 * @param {boolean=} collapse
 * @returns {string}
 */
function stringifyExpression(expression,options,collapse){
  var collapseDuplicates=options?options.collapseDuplicates:true;
  var useArray=options?options.useArray:false;
  var useLetters=options?options.useLetters:false;
  var collapseLittleLetters=options?options.collapseLittleLetters:true;
  if (collapse===undefined) collapse=false;
  var r="";
  for (var i=0;i<expression.ops.length;i++){
    var op=expression.ops[i];
    var part="";
    if (op===Infinity) part=useLetters?"Q":collapse?"[ε<sub>0</sub>]":"[ε_0]";
    else if (op instanceof Object){
      var numop;
      if (useLetters&&(numop=writableWithLetters(op))!==null){
        if (collapseLittleLetters){
          if (numop[3]>=1){
            var rep=numop[3];
            part+=rep==1?"p":part?"p<sub>"+rep+"</sub>":rep==2?"pp":"pp<sub>"+(rep-1)+"</sub>";
          }
          if (numop[2]>=1){
            var rep=numop[2];
            part+=rep==1?"n":part?"n<sub>"+rep+"</sub>":rep==2?"nn":"nn<sub>"+(rep-1)+"</sub>";
          }
          if (numop[1]>=2){
            var rep=Math.floor(numop[1]/2);
            part+=rep==1?"m":part?"m<sub>"+rep+"</sub>":rep==2?"mm":"mm<sub>"+(rep-1)+"</sub>";
          }
          if (numop[1]%2) part+="jkl"[Math.min(numop[0],2)];
          var remop0=numop[1]%2?Math.max(numop[0]-2,0):numop[0];
          if (remop0>=4){
            var rep=Math.floor(remop0/4);
            part+=rep==1?"h":part?"h<sub>"+rep+"</sub>":rep==2?"hh":"hh<sub>"+(rep-1)+"</sub>";
          }
          if (remop0%4) part+="efg"[remop0%4-1];
          part=part[0].toUpperCase()+part.substring(1);
        }else{
          if (numop[3]>=1) part+="p".repeat(numop[3]);
          if (numop[2]>=1) part+="n".repeat(numop[2]);
          if (numop[1]>=2) part+="m".repeat(Math.floor(numop[1]/2));
          if (numop[1]%2) part+="jkl"[Math.min(numop[0],2)];
          var remop0=numop[1]%2?Math.max(numop[0]-2,0):numop[0];
          if (remop0>=4) part+="h".repeat(Math.floor(remop0/4));
          if (remop0%4) part+="efg"[remop0%4-1];
          part=part[0].toUpperCase()+part.substring(1);
        }
      }else if (useArray&&op.frac===null) part="["+stringifyArray(op,options,collapse)+"]";
      else part="["+stringifyOrdinal(op,options,collapse)+"]";
    }
    var sameCount=1;
    while (i+1<expression.ops.length){
      var op2=expression.ops[i+1];
      if (opEquals(op,op2)){
        sameCount++;
        i++;
      }else break;
    }
    r+=sameCount>1?collapse&&collapseDuplicates?(part.length>1&&part[0]!="["?"("+part+")":part)+"<sub>"+sameCount+"</sub>":part.repeat(sameCount):part;
  }
  r+=formatNumber(expression.num,options);
  return r;
}
/**
 * @param {Operation} op 
 * @param {Decimal} num 
 * @returns {Ordinal}
 */
function fs(op,num){
  /** @type {Ordinal} */
  var newop;
  if (op===Infinity){
    /** @type {Decimal} */
    var whole=num.floor();
    /** @type {Decimal} */
    var frac=num.sub(whole);
    newop={ord:[],frac:{pow:ORDINAL_ZERO,coef:Decimal.pow(10,frac)}};
    for (var i=0;i<whole.toNumber();i++){
      newop={ord:[],frac:{pow:newop,coef:null}};
    }
  }else if (op instanceof Object){
    var pow=op.ord[0].pow;
    if (pow===ORDINAL_ZERO) newop=ORDINAL_ZERO;
    else if (pow instanceof Object){
      var neword=op.ord.slice(1);
      if (op.ord[0].coef>1) neword.unshift({pow:pow,coef:op.ord[0].coef-1});
      if (pow.ord[0].pow===ORDINAL_ZERO){
        var newfracpoword=pow.ord.slice(1);
        if (pow.ord[0].coef>1) newfracpoword.unshift({pow:pow.ord[0].pow,coef:pow.ord[0].coef-1});
        newop={ord:neword,frac:{pow:{ord:newfracpoword,frac:null},coef:num}};
      }else if (num.lt(1)) newop={ord:neword,frac:{pow:fs(pow,Decimal(1)),coef:num}};
      else newop={ord:neword,frac:{pow:fs(pow,num),coef:null}};
    }
  }else newop=ORDINAL_ZERO;
  return normalizeOrdinal(newop);
}
/**
 * @param {Ordinal} op
 * @return {Ordinal}
 */
function stepFOAT(op){
  if (op===ORDINAL_ZERO) return ORDINAL_ZERO;
  else if (op instanceof Object){
    if (op.frac===null) return op;
    else{
      /** @type {Ordinal} */
      var newop;
      var pow=op.frac.pow;
      if (op.frac.coef===null){
        if (pow===ORDINAL_ZERO) newop=ORDINAL_ZERO;
        else if (pow instanceof Object){
          if (pow.frac.pow===ORDINAL_ZERO){
            /** @type {Decimal} */
            var whole=pow.frac.coef.floor();
            /** @type {Decimal} */
            var frac=pow.frac.coef.sub(whole);
            var neword=pow.ord.slice();
            if (whole.gt(0)) neword.unshift({pow:pow.frac.pow,coef:whole.toNumber()});
            newop={ord:op.ord,frac:{pow:{ord:neword,frac:null},coef:Decimal.pow(10,frac)}};
          }else newop={ord:op.ord,frac:{pow:stepFOAT(pow),coef:null}};
        }
      }else{
        if (pow===ORDINAL_ZERO) newop=ORDINAL_ZERO;
        else if (pow instanceof Object){
          /** @type {Decimal} */
          var whole=op.frac.coef.floor();
          /** @type {Decimal} */
          var frac=op.frac.coef.sub(whole);
          var neword=op.ord.slice();
          if (whole.gt(0)) neword.unshift({pow:pow,coef:whole.toNumber()});
          if (pow.ord[0].pow===ORDINAL_ZERO){
            var newfracpoword=pow.ord.slice(1);
            if (pow.ord[0].coef>1) newfracpoword.unshift({pow:pow.ord[0].pow,coef:pow.ord[0].coef-1});
            newop={ord:neword,frac:{pow:{ord:newfracpoword,frac:null},coef:frac.mul(10)}};
          }else if (frac.mul(10).lt(1)) newop={ord:neword,frac:{pow:fs(pow,Decimal(1)),coef:frac.mul(10)}};
          else newop={ord:neword,frac:{pow:fs(pow,frac.mul(10)),coef:null}};
        }
      }
      return normalizeOrdinal(newop);
    }
  }
}
/**
 * @param {Expression|string} expression
 * @returns {Expression}
 */
function step(expression){
  if (typeof expression=="string") expression=parseExpression(expression);
  var op=expression.ops[expression.ops.length-1];
  var num=expression.num;
  /** @type {Operation[]} */
  var newops;
  /** @type {Decimal} */
  var newnum;
  if (num.lte(1)||opEquals(op,ORDINAL_ONE)){
    newops=[];
    newnum=Decimal.pow(10,num);
  }else if (op instanceof Object&&op.ord.length&&op.ord[0].pow===ORDINAL_ZERO&&op.frac===null){
    /** @type {Decimal} */
    var whole=num.floor();
    /** @type {Decimal} */
    var frac=num.sub(whole);
    var neword=op.ord.slice(1);
    if (op.ord[0].coef>1) neword.unshift({pow:op.ord[0].pow,coef:op.ord[0].coef-1});
    newops=Array(whole.toNumber()).fill(normalizeOrdinal({ord:neword,frac:op.frac}));
    newnum=Decimal.pow(10,frac);
  }else if (op===Infinity||op instanceof Object&&op.frac===null){
    if (num.lt(2)){
      var newop=fs(op,Decimal(2));
      if (newop===ORDINAL_ZERO) newop=ORDINAL_ONE;
      else if (newop instanceof Object) newop.ord.unshift({pow:ORDINAL_ZERO,coef:1});
      newops=[normalizeOrdinal(newop)];
      newnum=num;
    }else{
      newops=[fs(op,num)];
      newnum=Decimal(10);
    }
  }else if (op instanceof Object&&op.frac!==null){
    if (num.eq(10)){
      if (op.frac.pow===ORDINAL_ZERO){
        /** @type {Decimal} */
        var ceil=op.frac.coef.ceil();
        /** @type {Decimal} */
        var whole=op.frac.coef.floor();
        /** @type {Decimal} */
        var frac=op.frac.coef.sub(whole);
        var neword=op.ord.slice();
        if (ceil.gt(0)) neword.unshift({pow:op.frac.pow,coef:ceil});
        newops=[normalizeOrdinal({ord:neword,frac:null})];
        newnum=Decimal.mul(2,Decimal.pow(5,frac));
      }else{
        newops=[stepFOAT(op)];
        newnum=num;
      }
    }else{
      newops=[];
      newnum=Decimal(NaN);
    }
  }else{
    newops=[];
    newnum=Decimal(NaN);
  }
  newops=expression.ops.slice(0,-1).concat(newops);
  return {ops:newops,num:newnum};
}
/**
 * @param {Operation} op
 * @returns {number}
 */
function complexity(op){
  if (op instanceof Object){
    var r=0;
    for (var i=0;i<op.ord.length;i++) r+=complexity(op.ord[i].pow);
    if (op.frac!==null) r+=complexity(op.frac.pow);
    return r;
  }else return 1;
}
/**
 * @param {Expression} expression
 * @param {Options=} options
 * @returns {boolean}
 */
function unacceptable(expression,options){
  if (expression.ops.length==0) return true;
  var opCountLimit=options?options.opCountLimit:24;
  var opCountSkipDuplicates=options?options.opCountSkipDuplicates:true;
  var opComplexityLimit=options?options.opComplexityLimit:24;
  var opTotalComplexityLimit=options?options.opTotalComplexityLimit:24;
  var op=expression.ops[expression.ops.length-1];
  var opCount=0;
  var totalComplexity=0;
  for (var i=0;i<expression.ops.length;i++){
    var j=i;
    while (i+1<expression.ops.length&&opEquals(expression.ops[i],expression.ops[i+1])) i++;
    var thisComplexity=complexity(expression.ops[i]);
    if (complexity(op)>opComplexityLimit) return true;
    if (opCountSkipDuplicates){
      opCount++;
      totalComplexity+=thisComplexity;
    }else{
      opCount+=i-j+1;
      totalComplexity+=thisComplexity*(i-j+1);
    }
    if (opCount>opCountLimit) return true;
    if (totalComplexity>opTotalComplexityLimit) return true;
  }
  return false;
}
var MAX_OPS_REMOVABLE=4; //EEEE0=EEE1=EE10=E10000000000=1*10^10000000000
var MAX_COMPLEXITY_REMOVABLE=4; //idk
/**
 * @param {Expression} expression
 * @param {Options=} options
 * @returns {boolean}
 */
function finished(expression,options){
  if (expression.ops.length==0) return true;
  var eLimit=options?options.eLimit:1e13;
  var argumentLimit=options?options.argumentLimit:10;
  var opCountLimit=options?options.opCountLimit:24;
  var opCountSkipDuplicates=options?options.opCountSkipDuplicates:true;
  var opComplexityLimit=options?options.opComplexityLimit:24;
  var opTotalComplexityLimit=options?options.opTotalComplexityLimit:24;
  var op=expression.ops[expression.ops.length-1];
  var num=expression.num;
  if (op instanceof Object&&opEquals(op,ORDINAL_ONE)){
    if (!num.lt(eLimit)) return true;
  }else{
    if (!(op instanceof Object&&op.frac!==null)&&!num.lt(argumentLimit)) return true;
  }
  var opCount=0;
  var totalComplexity=0;
  for (var i=0;i<expression.ops.length;i++){
    var j=i;
    while (i+1<expression.ops.length&&opEquals(expression.ops[i],expression.ops[i+1])) i++;
    var thisComplexity=complexity(expression.ops[i]);
    if (complexity(op)-MAX_COMPLEXITY_REMOVABLE>opComplexityLimit) return true;
    if (opCountSkipDuplicates){
      opCount++;
      totalComplexity+=thisComplexity;
    }else{
      opCount+=i-j+1;
      totalComplexity+=thisComplexity*(i-j+1);
    }
    if (opCount-MAX_OPS_REMOVABLE>opCountLimit) return true;
    if (totalComplexity-MAX_COMPLEXITY_REMOVABLE*MAX_OPS_REMOVABLE>opTotalComplexityLimit) return true;
  }
  return false;
}
function calculateStep(){
  if (finished(expression,options)) return false;
  expression=step(expression);
  if (!unacceptable(expression,options)){
    lastAcceptedExpression=expression;
    lastAcceptedIndexInHistory=stepHistory.length;
  }
  stepHistory.push(expression);
  if (stepHistory.length>options.maxHistoryLength) stepHistory.shift(),lastAcceptedIndexInHistory--;
  outExpression=finished(expression,options)?lastAcceptedExpression:expression;
  updateDisplay(true);
  updateHistory();
  return true;
}
function calculateFull(){
  if (finished(expression,options)) return;
  do{
    expression=step(expression);
    if (!unacceptable(expression,options)){
      lastAcceptedExpression=expression;
      lastAcceptedIndexInHistory=stepHistory.length;
    }
    stepHistory.push(expression);
    if (stepHistory.length>options.maxHistoryLength) stepHistory.shift(),lastAcceptedIndexInHistory--;
  }while(!finished(expression,options));
  outExpression=lastAcceptedExpression;
  updateDisplay(true);
  updateHistory();
}
function progression(){
  if (calculateStep()) setTimeout(progression,options.stepDelay);
}
function updateOptions(){
  options.eLimit=+document.getElementById("eLimit").value;
  options.argumentLimit=+document.getElementById("argumentLimit").value;
  options.opCountLimit=+document.getElementById("opCountLimit").value;
  options.opCountSkipDuplicates=document.getElementById("opCountSkipDuplicates").checked;
  options.opComplexityLimit=+document.getElementById("opComplexityLimit").value;
  options.opTotalComplexityLimit=+document.getElementById("opTotalComplexityLimit").value;
  Decimal.set({precision:+document.getElementById("precision").value});
  options.digitsDisplayed=+document.getElementById("digitsDisplayed").value;
  options.stepDelay=+document.getElementById("stepDelay").value;
  options.collapseDuplicates=document.getElementById("collapseDuplicates").checked;
  options.useArray=document.getElementById("useArray").checked;
  options.collapseSeparators=document.getElementById("collapseSeparators").checked;
  options.useLetters=document.getElementById("useLetters").checked;
  options.collapseLittleLetters=document.getElementById("collapseLittleLetters").checked;
  options.maxHistoryLength=+document.getElementById("maxHistoryLength").value;
  options.historyPosition=+document.getElementById("historyPosition").value;
  options.historyLinesShown=+document.getElementById("historyLinesShown").value;
  options.collapseInHistory=document.getElementById("collapseInHistory").checked;
}
function updateInput(){
  expression=parseExpression(document.getElementById("input").value);
  lastAcceptedExpression=expression;
  lastAcceptedIndexInHistory=0;
  outExpression=expression;
  stepHistory=[expression];
  updateDisplay(false);
}
/** @param {boolean} updateInputField */
function updateDisplay(updateInputField){
  if (updateInputField) document.getElementById("input").value=stringifyExpression(outExpression,options);
  document.getElementById("collapsed").innerHTML=document.getElementById("collapsedHTML").value=stringifyExpression(outExpression,options,true);
}
function updateHistory(){
  var collapse=options.collapseInHistory;
  var startPos=Math.max(options.historyPosition,0);
  var endPos=Math.min(startPos+options.historyLinesShown,stepHistory.length);
  document.getElementById("historyPositionDisplay").textContent="Showing "+(startPos+1)+"-"+endPos+" of "+stepHistory.length+" steps";
  var historyHTML="";
  for (var i=startPos;i<endPos;i++){
    var expression=stepHistory[i];
    historyHTML+="<li seq=\""+(i+1)+"\""+(i>lastAcceptedIndexInHistory?" class=\"unaccepted\"":"")+">"+stringifyExpression(expression,options,collapse)+"</li>";
  }
  document.getElementById("history").innerHTML=historyHTML;
}
function changeHistoryPosition(position){
  document.getElementById("historyPosition").value=options.historyPosition=Math.max(Math.min(position,Math.ceil((stepHistory.length-options.historyLinesShown)/options.historyLinesShown)*options.historyLinesShown),0);
  updateHistory();
}
function firstPage(){
  changeHistoryPosition(0);
}
function lastPage(){
  changeHistoryPosition(options.historyPosition-options.historyLinesShown);
}
function nextPage(){
  changeHistoryPosition(options.historyPosition+options.historyLinesShown);
}
function finalPage(){
  changeHistoryPosition(Infinity);
}
window.onload=function (){
  updateOptions();
  updateInput();
  updateHistory();
}