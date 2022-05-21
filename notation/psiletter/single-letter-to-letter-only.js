/** 
 * @typedef {[number,number]|Infinity} Operation
 * @typedef {{ops:Operation[],num:Decimal}} Expression
 */
/** @type {Expression} */
var expression=null;
/** @type {Expression[]} */
var stepHistory=null;
/**
 * @typedef {{
 * eLimit:number,
 * argumentLimit:number,
 * digitsDisplayed:number,
 * stepDelay:number,
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
  digitsDisplayed:12,
  stepDelay:100,
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
  var numPos=s.search(/\d/);
  var letterPart=s.substring(0,numPos);
  var numberPart=s.substring(numPos);
  /** @type {Operation[]} */
  var ops=[];
  var m=letterPart.matchAll(/[A-Z][a-z]*/g);
  var next;
  while (next=m.next(),!next.done){
    var part=next.value[0];
    if (part=="N") ops.unshift(Infinity);
    else{
      /** @type {[number,number]} **/
      var op=[0,0];
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
      }
      if (op[0]||op[1]) ops.unshift(op);
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
  return op1===Infinity?op2===Infinity:op2!==Infinity&&op1[0]==op2[0]&&op1[1]==op2[1];
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
  var collapseLittleLetters=options?options.collapseLittleLetters:true;
  if (collapse===undefined) collapse=false;
  var r="";
  for (var i=0;i<expression.ops.length;i++){
    var op=expression.ops[i];
    var part="";
    if (op===Infinity) part="N";
    else{
      if (collapse&&collapseLittleLetters){
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
        if (op[1]>=2) part+="m".repeat(Math.floor(op[1]/2));
        if (op[1]%2) part+="jkl"[Math.min(op[0],2)];
        var remop0=op[1]%2?Math.max(op[0]-2,0):op[0];
        if (remop0>=4) part+="h".repeat(Math.floor(remop0/4));
        if (remop0%4) part+="efg"[remop0%4-1];
        part=part[0].toUpperCase()+part.substring(1);
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
    r+=sameCount>1?collapse?(part.length>1?"("+part+")":part)+"<sub>"+sameCount+"</sub>":part.repeat(sameCount):part;
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
      newops=[[1,2]];
      newnum=num;
    }else{
      /** @type {Decimal} */
      var whole=num.floor();
      /** @type {Decimal} */
      var tenths=num.mul(10).mod(10);
      /** @type {Decimal} */
      var wholetenths=tenths.floor();
      /** @type {Decimal} */
      var fractenths=tenths.sub(wholetenths);
      newops=[[fractenths.eq(0)?wholetenths.toNumber():wholetenths.toNumber()+1,whole.toNumber()]];
      newnum=fractenths.eq(0)?Decimal(10):Decimal.mul(2,Decimal.pow(5,fractenths));
    }
  }else{
    if (op[0]==1&&op[1]==0){
      newops=[];
      newnum=Decimal.pow(10,num);
    }else if (op[0]){
      /** @type {Decimal} */
      var whole=num.floor();
      /** @type {Decimal} */
      var frac=num.sub(whole);
      newops=Array(whole.toNumber()).fill([op[0]-1,op[1]]);
      newnum=Decimal.pow(10,frac);
    }else{
      if (num.lt(2)){
        newops=[[3,op[1]-1]];
        newnum=num;
      }else{
        /** @type {Decimal} */
        var whole=num.floor();
        /** @type {Decimal} */
        var frac=num.sub(whole);
        newops=[[frac.eq(0)?whole.toNumber():whole.toNumber()+1,op[1]-1]];
        newnum=frac.eq(0)?Decimal(10):Decimal.mul(2,Decimal.pow(5,frac));
      }
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
function finished(expression,options){
  if (expression.ops.length==0) return true;
  var eLimit=options?options.eLimit:1e13;
  var argumentLimit=options?options.argumentLimit:10;
  var op=expression.ops[expression.ops.length-1];
  var num=expression.num;
  if (op!==Infinity&&op[0]==1&&op[1]==0){
    if (!num.lt(eLimit)) return true;
  }else{
    if (!num.lt(argumentLimit)) return true;
  }
  return false;
}
function calculateStep(){
  if (finished(expression,options)) return false;
  expression=step(expression);
  stepHistory.push(expression);
  if (stepHistory.length>options.maxHistoryLength) stepHistory.shift();
  updateDisplay(true);
  updateHistory();
  return true;
}
function calculateFull(){
  if (finished(expression,options)) return;
  do{
    expression=step(expression);
    stepHistory.push(expression);
    if (stepHistory.length>options.maxHistoryLength) stepHistory.shift();
  }while(!finished(expression,options));
  updateDisplay(true);
  updateHistory();
}
function progression(){
  if (calculateStep()) setTimeout(progression,options.stepDelay);
}
function updateOptions(){
  options.eLimit=+document.getElementById("eLimit").value;
  options.argumentLimit=+document.getElementById("argumentLimit").value;
  Decimal.set({precision:+document.getElementById("precision").value});
  options.digitsDisplayed=+document.getElementById("digitsDisplayed").value;
  options.stepDelay=+document.getElementById("stepDelay").value;
  options.collapseLittleLetters=document.getElementById("collapseLittleLetters").checked;
  options.maxHistoryLength=+document.getElementById("maxHistoryLength").value;
  options.historyPosition=+document.getElementById("historyPosition").value;
  options.historyLinesShown=+document.getElementById("historyLinesShown").value;
  options.collapseInHistory=document.getElementById("collapseInHistory").checked;
}
function updateInput(){
  expression=parseExpression(document.getElementById("input").value);
  stepHistory=[expression];
  updateDisplay(false);
}
/** @param {boolean} updateInputField */
function updateDisplay(updateInputField){
  if (updateInputField) document.getElementById("input").value=stringifyExpression(expression,options);
  document.getElementById("collapsed").innerHTML=document.getElementById("collapsedHTML").value=stringifyExpression(expression,options,true);
}
function updateHistory(){
  var collapse=options.collapseInHistory;
  var startPos=Math.max(options.historyPosition,0);
  var endPos=Math.min(startPos+options.historyLinesShown,stepHistory.length);
  document.getElementById("historyPositionDisplay").textContent="Showing "+(startPos+1)+"-"+endPos+" of "+stepHistory.length+" steps";
  var historyHTML="";
  for (var i=startPos;i<endPos;i++){
    var expression=stepHistory[i];
    historyHTML+="<li seq=\""+(i+1)+"\">"+stringifyExpression(expression,options,collapse)+"</li>";
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
