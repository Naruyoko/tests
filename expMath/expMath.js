'use strict';
var exp=exp||{}
exp=(function (){
  return{
    add:function (a,b){return Math.max(a,b)+Math.log10(1+10**(-Math.abs(a-b)));},
    sub:function (a,b){return Math.max(a,b)+Math.log10(1-10**(-Math.abs(a-b)));},
    mult:function (a,b){return a+b;},
    div:function (a,b){return a-b;},
    pow:function (a,b){return a*10**b;},
    root:function (a,b){return a/10**b;},
    log:function (a,b){return a/b;},
    tetr:function (a,b){
      if (b>2){return "Tetrated too large";}
      var z=10**b-Math.ceil(10**b);
      var f=Math.log10(1+(2*a*Math.log(10))/(1+a*Math.log(10))*z-(1-a*Math.log(10))/(1+a*Math.log(10))*z**2);
      if (b>0){
        for (i=0;i<Math.ceil(10**b);i++){
          f=exp.pow(a,f);
        }
      }
      if (b<=1){
        for (i=0;i>Math.ceil(10**b);i--){
          f=exp.log(f,a);
        }
      }
      return f;
    },
    slog:function (a,b){
      if (!isFinite(b)){return }
      var z=10**b-Math.ceil(10**b);
      var f=Math.log10(1+(2*a*Math.log(10))/(1+a*Math.log(10))*z-(1-a*Math.log(10))/(1+a*Math.log(10))*z**2);
      for (i=0;i<Math.ceil(10**b);i++){
        f=exp.pow(a,f);
      }
    },
    text:function (a,m){return String(10**Math.abs(a-Math.floor(a)))+m+String(Math.floor(a));}
  };
}());
)  2
