'use strict';
var modules=expMath||{};
expMath=(function () {
  var add=function exp_add(a,b){return Math.max(a,b)+log10(1+10^(-Math.abs(a-b)));};
  var sub=function (a,b){return Math.max(a,b)+log10(1-10^(-Math.abs(a-b)));};
  var mult=function (a,b){return a+b;};
  var div=function (a,b){return a-b;};
  var pow=function (a,b){return a*10^b;};
  var root=function (a,b){return a/10^b;};
  return{
    add:add
    sub:sub
    mult:mult
    div:div
    pow:pow
    root:root
  };
}());
