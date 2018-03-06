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
    mult:function (a,b){return [a[0]+b[0],!a[1]&&b[1]||a[1]&&!b[1]];},
    div:function (a,b){return exp.mult(a,[-b[0],b[1]];},
    pow:function (a,b){
      if (a[1]){
        return [NaN,false];
      }else{
        return [a[0]*10**b[0]*-1**b[1],false];
      }
    },
    root:function (a,b){return exp.pow(a,[-b[0],b[1]];))
    log:function (a,b){
      if (a[1]||b[1]||b[0]=0){
        return [NaN,false];
      }else{
        return [Math.log10(Math.abs(a[0]/b[0])),(a[0]<0)&&(b[0]>0)||(a[0]>0)&&(b[0]<0)];
      }
    },
    fact:function (a){
      if (a[1]){return [NaN,false];}
      var A=10**a[0];
      if (A<=15){
        var s=0;
        var b=0;
        for (i=0;b///;i+=A/100;){
          s+=(
    tetr:function (a,b){
      if (a[1]){return [NaN,false];}
      if (b[0]>2){return [Infinity,false];}
      var B=10**b[0]*-1**b[1]
      var z=B-Math.ceil(B);
      var f=[Math.log10(1+(2*a[0]*Math.log(10))/(1+a[0]*Math.log(10))*z-(1-a[0]*Math.log(10))/(1+a[0]*Math.log(10))*z**2),false];
      if (B>0){
        for (i=0;i<Math.ceil(B);i++){
          f=exp.pow(a,f);
        }
      }
      if (B<=-1){
        for (i=0;i>Math.ceil(B);i--){
          f=exp.log(f,a);
        }
      }
      return f;
    },
    slog:function (a,b){
      if (b[1]){return [NaN,false];}
      var z=a;
      var f=[0,false];
      while ((z[0]<=0)&&!z[1]){
        f=exp.add(f,[0,false]);
        z=exp.log(z,b);
      }
      while (z[1]||!isFinite(z[0])&&z[0]<0){
        f=exp.sub[f,[0,false];
        z=exp.pow(b,z);
      }
      f=exp.add(f,exp.conv(-1-(2*a)/(1+a)*z+(1-a)/(1+a)*z**2)));
      return f;
    },
    conv:function (a){return [Math.log10(Math.abs(a)),a<0];},
    text:function (a,m){return String(10**Math.abs(a-Math.floor(a)))+m+String(Math.floor(a));}
  };
}());
)  2
