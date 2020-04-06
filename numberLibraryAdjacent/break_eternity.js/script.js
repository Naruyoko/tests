function dg(s){
  return document.getElementById(s);
}
var prev;
var curr;
var next;
function getPrev(){
  if (isNaN(curr.mag)) return new Decimal(NaN);
  if (curr.mag==Math.log10(9e15)) return Decimal.fromComponents(curr.sign,curr.layer-1,9e15-1);
  return Decimal.fromComponents(curr.sign,curr.layer,curr.mag-curr.mag/Number.MAX_SAFE_INTEGER);
}
function getNext(){
  if (isNaN(curr.mag)) return new Decimal(NaN);
  if (curr.mag==9e15-1) return Decimal.fromComponents(curr.sign,curr.layer+1,Math.log10(9e15));
  return Decimal.fromComponents(curr.sign,curr.layer,curr.mag+curr.mag/Number.MAX_SAFE_INTEGER);
}
function goCurr(){
  curr=Decimal.fromString(dg("input").value);
  prev=getPrev();
  next=getNext();
  disp();
  run();
}
function goPrev(){
  next=curr;
  curr=prev;
  prev=getPrev();
  disp();
  run();
}
function goNext(){
  prev=curr;
  curr=next;
  next=getNext();
  disp();
  run();
}
function disp(){
  dg("prev").textContent=prev;
  dg("curr").textContent=curr;
  dg("next").textContent=next;
}
function run(){
  dg("runR").innerHTML=Function(dg("run").value)();
}