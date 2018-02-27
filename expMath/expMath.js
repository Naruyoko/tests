'use strict';
var exp=exp||{}
exp=(function (){
  return{
    add:function (a,b){return Math.max(a,b)+log10(1+10^(-Math.abs(a-b)));},
    sub:function (a,b){return Math.max(a,b)+log10(1-10^(-Math.abs(a-b)));},
    mult:function (a,b){return a+b;},
    div:function (a,b){return a-b;},
    pow:function (a,b){return a*10^b;},
    root:function (a,b){return a/10^b;},
    text:function (a,m){return string(10^(a-Math.floor(a)))+m+string(Math.floor(a));}
  };
}());
