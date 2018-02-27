'use strict';
var modules=expMath||{};
expMath=(function () {
  return{
    add:function (a,b){return Math.max(a,b)+log10(1+10^(-Math.abs(a-b)));},
    sub:function (a,b){return Math.max(a,b)+log10(1-10^(-Math.abs(a-b)));},
    mult:function (a,b){return a+b;},
    div:function (a,b){return a-b;},
    pow:function (a,b){return a*10^b;},
    root:function (a,b){return a/10^b;},
  };
}());
