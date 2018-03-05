'use strict';
var exp=exp||{}
exp=(function (){
  return{
    add:function (a,b){
      if (a[1]&&b[1]||(!a[1])&&(!b[1])){
        return [Math.max(a[0],b[0])+Math.log10(1+10**(-Math.abs(a[0]-b[0]))),a[1]];
      }else{
        return [Math.max(a[0],b[0])+Math.log10(1-10**(-Math.abs(a[0]-b[0]))),!a[1]&&(a[0]<b[0])||a[1]&&(a[0]>b[0])];
      }
    },
    sub:function (a,b){return exp.add(a,[b[0],!b[1]]);},
    mult:function (a,b){return [a[0]+b[0],(!a[1])&&b[1]||a[1]&&(!b[1])];},
    div:function (a,b){return [a[0]-b[1],(!a[1])&&b[1]||a[1]&&(!b[1])];},
    pow:function (a,b){
      if (a[1]){
        return [NaN,false];
      }else{
        return [a[0]*10**b[0]*-1**b[1],false];
      }
    },
    root:function (a,b){
      if (a[1]){
        return [NaN,false];
      }else{
        return [a[0]/10**b[0]*-1**b[1],false];
      }
    },
    log:function (a,b){
      if (a[1]||b[1]){
        return [NaN,false];
      }else{
        return [Math.log10(Math.abs(a[0]/b[0])),a[0]/b[0]<0];
      }
    },
    tetr:function (a,b){
      if (a[1]){return [NaN,false];}
      if (b[0]>2){return [Infinity,false];}
      var B=10**b[0]*-1**b[1]
      var z=B-Math.ceil(B);
      var f=Math.log10(1+(2*a[0]*Math.log(10))/(1+a[0]*Math.log(10))*z-(1-a[0]*Math.log(10))/(1+a[0]*Math.log(10))*z**2);
      if (B>0){
        for (i=0;i<Math.ceil(B);i++){
          f=exp.pow(a[0],f);
        }
      }
      if (B<=-1){
        for (i=0;i>Math.ceil(B);i--){
          f=exp.log(f,a[0]);
        }
      }
      return [f,false];
    },
    slog:function (a,b){
      var z=a;
      var f=0;
      while (z>1){
        f=exp.add(f,1);
        z=exp.log(z,b);
      }
      while (z<=0){
        f=exp.;
        z=exp.pow(b,z);
      }
      f+=Math.log10(-1+(2*a)/(1+a)*z-(1-a)/(1+a)*z**2);
      if (b>0){
        for (i=0;i<Math.ceil(10**b)-1;i++){
          f=exp.pow(a,f);
        }
      }
      if (b<=1){
        for (i=0;i>Math.ceil(10**b)-1;i--){
          f=exp.log(f,a);
        }
      }
      return f;
    },
    text:function (a,m){return String(10**Math.abs(a-Math.floor(a)))+m+String(Math.floor(a));}
  };
}());
)  2
