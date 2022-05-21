/** 
 * @typedef {Decimal[]|Infinity} Operation
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
 * digitsDisplayed:number,
 * stepDelay:number,
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
  digitsDisplayed:12,
  stepDelay:100,
  useLetters:false,
  collapseLittleLetters:true,
  maxHistoryLength:100000,
  historyPosition:0,
  historyLinesShown:10,
  collapseInHistory:true
};

/**
 * @param {string} s
 * @returns {Expression}
 */
function parseExpression(s){
  var numPos=s.search(/\d(\.\d*)?((e|\*10\^)[\+-]?\d+)?$/);
  var opPart=s.substring(0,numPos);
  var numberPart=s.substring(numPos);
  /** @type {Operation[]} */
  var ops=[];
  var m=opPart.matchAll(/\(\d(\.\d*)?(,\d(\.\d*)?)*\)\||[A-Z][a-z]*/g);
  var next;
  while (next=m.next(),!next.done){
    var part=next.value[0];
    if (part=="P") ops.unshift(Infinity);
    else if (part[0]=="("){
      /** @type {number[]} **/
      var op=[];
      var m2=part.matchAll(/\d(\.\d+)/g);
      var next2;
      while (next2=m2.next(),!next2.done){
        var entry=Decimal(next2);
        if (op.length||entry.neq(0)) op.unshift(entry);
      }
      if (op.length) ops.unshift(op);
    }else{
      var op=[0,0,0];
      for (var k=0;k<part.length;k++){
        var letter=part[k].toLowerCase();
        if (letter=="e") op[0]+=1;
        else if (letter=="f") op[0]+=2;
        else if (letter=="g") op[0]+=3;
        else if (letter=="h") op[0]+=4;
        else if (letter=="j") op[1]+=1;
        else if (letter=="k") op[0]+=1,op[1]+=1;
        else if (letter=="l") op[0]+=2,op[1]+=1;
        else if (letter=="m") op[1]+=2;
        else if (letter=="n") op[2]+=1;
      }
      if (op[2]) ops.unshift([Decimal(op[0]),Decimal(op[1]),Decimal(op[2])]);
      else if (op[1]) ops.unshift([Decimal(op[0]),Decimal(op[1])]);
      else if (op[0]) ops.unshift([Decimal(op[0])]);
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
  if (op1===Infinity) return op2===Infinity;
  else if (op1 instanceof Array){
    if (!(op2 instanceof Array)||op1.length!=op2.length) return false;
    for (var i=0;i<op1.length;i++)
      if (op1[i]!=op2[i]) return false;
    return true;
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
 * @param {Expression} expression
 * @param {Options=} options 
 * @param {boolean=} collapse
 * @returns {string}
 */
function stringifyExpression(expression,options,collapse){
  var useLetters=options?options.useLetters:false;
  var collapseLittleLetters=options?options.collapseLittleLetters:true;
  if (collapse===undefined) collapse=false;
  var r="";
  for (var i=0;i<expression.ops.length;i++){
    var op=expression.ops[i];
    var part="";
    if (op===Infinity) part="P";
    else if (op instanceof Array){
      if (collapse&&useLetters&&op.length<=3
        &&(op.length<1||op[0].isInt())
        &&(op.length<2||op[1].isInt())
        &&(op.length<3||op[2].isInt())){
        var numop=[
          op.length>=1?op[0].toNumber():0,
          op.length>=2?op[1].toNumber():0,
          op.length>=3?op[2].toNumber():0];
        if (collapseLittleLetters){
          if (op[2]>=1){
            var rep=op[2];
            part+=rep==1?"n":part?"n<sub>"+rep+"</sub>":rep==2?"nn":"nn<sub>"+(rep-1)+"</sub>";
          }
          if (op[1]>=2){
            var rep=Math.floor(op[1]/2);
            part+=rep==1?"m":part?"m<sub>"+rep+"</sub>":rep==2?"mm":"mm<sub>"+(rep-1)+"</sub>";
          }
          if (op[1]%2) part+="jkl"[Math.min(op[0],2)];
          var remop0=op[1]%2?Math.max(op[0]-2,0):op[0];
          if (remop0>=4){
            var rep=Math.floor(remop0/4);
            part+=rep==1?"h":part?"h<sub>"+rep+"</sub>":rep==2?"hh":"hh<sub>"+(rep-1)+"</sub>";
          }
          if (remop0%4) part+="efg"[remop0%4-1];
          part=part[0].toUpperCase()+part.substring(1);
        }else{
          if (op[2]>=1) part+="n".repeat(op[2]);
          if (op[1]>=2) part+="m".repeat(Math.floor(op[1]/2));
          if (op[1]%2) part+="jkl"[Math.min(op[0],2)];
          var remop0=op[1]%2?Math.max(op[0]-2,0):op[0];
          if (remop0>=4) part+="h".repeat(Math.floor(remop0/4));
          if (remop0%4) part+="efg"[remop0%4-1];
          part=part[0].toUpperCase()+part.substring(1);
        }
      }else{
        part="(";
        for (var j=op.length-1;j>=0;j--){
          part+=formatNumber(op[j]);
          if (j>0) part+=",";
        }
        part+=")|";
      }
    }
    var sameCount=1;
    while (i+1<expression.ops.length){
      var op2=expression.ops[i+1];
      if (opEquals(op,op2)){
        sameCount++;
        i++;
      }else break;
    }
    r+=sameCount>1?collapse?(part.length>1&&part[0]!="("?"("+part+")":part)+"<sub>"+sameCount+"</sub>":part.repeat(sameCount):part;
  }
  r+=formatNumber(expression.num,options);
  return r;
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
  if (op===Infinity){
    if (num.lt(2)){
      newops=[[1,0,1]];
      newnum=num;
    }else{
      /** @type {Decimal} */
      var whole=num.floor();
      /** @type {Decimal} */
      var frac=num.sub(whole);
      newops=[Array(whole.toNumber()).fill(Decimal(0)).concat(Decimal.pow(10,frac))];
      newnum=Decimal(10);
    }
  }else if (op instanceof Array){
    if (num.lte(1)||op.length==1&&op[0].eq(1)){
      newops=[];
      newnum=Decimal.pow(10,num);
    }else if (op[0].gt(0)){
      if (op[0].isInt()){
        /** @type {Decimal} */
        var whole=num.floor();
        /** @type {Decimal} */
        var frac=num.sub(whole);
        newops=Array(whole.toNumber()).fill([op[0].sub(1)].concat(op.slice(1)));
        newnum=Decimal.pow(10,frac);
      }else if (num.eq(10)){
        newops=[[op[0].ceil()].concat(op.slice(1))];
        newnum=Decimal.mul(2,Decimal.pow(5,op[0].sub(op[0].floor())));
      }else{
        newops=[];
        newnum=Decimal(NaN);
      }
    }else if (op[0].eq(0)){
      var zeros=1;
      while (op[zeros].eq(0)) zeros++;
      if (op[zeros].isInt()){
        if (num.lt(2)){
          newops=[Array(zeros-1).fill(Decimal(0)).concat([Decimal(2),op[zeros].sub(1)],op.slice(zeros+1))];
          newnum=Decimal.pow(10,num.sub(1));
        }else{
          newops=[Array(zeros-1).fill(Decimal(0)).concat([num,op[zeros].sub(1)],op.slice(zeros+1))];
          newnum=Decimal(10);
        }
      }else if (num.eq(10)){
        /** @type {Decimal} */
        var whole=op[zeros].floor();
        /** @type {Decimal} */
        var frac=op[zeros].sub(whole);
        newops=[Array(zeros-1).fill(Decimal(0)).concat([frac.mul(10),whole],op.slice(zeros+1))];
        newnum=Decimal(10);
      }else{
        newops=[];
        newnum=Decimal(NaN);
      }
      if (newops[0] instanceof Array&&newops[0][newops[0].length-1].eq(0)) newops[0].pop();
    }else{
      newops=[];
      newnum=Decimal(NaN);
    }
  }
  newops=expression.ops.slice(0,-1).concat(newops);
  return {ops:newops,num:newnum};
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
  var op=expression.ops[expression.ops.length-1];
  var opCount;
  if (opCountSkipDuplicates){
    opCount=0;
    for (var i=0;i<expression.ops.length;i++){
      opCount++;
      while (i+1<expression.ops.length&&opEquals(expression.ops[i],expression.ops[i+1])) i++;
    }
  }else opCount=expression.ops.length;
  if (opCount>opCountLimit) return true;
  return false;
}
var MAX_OPS_REMOVABLE=4; //EEEE0=EEE1=EE10=E10000000000=1*10^10000000000
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
  var op=expression.ops[expression.ops.length-1];
  var num=expression.num;
  if (op instanceof Array&&op.length==1&&op[0].eq(1)){
    if (!num.lt(eLimit)) return true;
  }else{
    var zeros=0;
    while (op instanceof Array&&op[zeros].eq(0)) zeros++;
    if (op instanceof Array&&!op[zeros].isInt()){
    }else{
      if (!num.lt(argumentLimit)) return true;
    }
  }
  var opCount;
  if (opCountSkipDuplicates){
    opCount=0;
    for (var i=0;i<expression.ops.length;i++){
      opCount++;
      while (i+1<expression.ops.length&&opEquals(expression.ops[i],expression.ops[i+1])) i++;
    }
  }else opCount=expression.ops.length;
  if (opCount-MAX_OPS_REMOVABLE>opCountLimit) return true;
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
  Decimal.set({precision:+document.getElementById("precision").value});
  options.digitsDisplayed=+document.getElementById("digitsDisplayed").value;
  options.stepDelay=+document.getElementById("stepDelay").value;
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