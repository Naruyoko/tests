var vector={
  i:[1,0,0],
  j:[0,1,0],
  k:[0,0,1],
  O:[0,0,0],
  abs:(function (a){
    var r=0;
    a.forEach(function (element){r+=Math.pow(element,2);});
    return Math.sqrt(r);
  }),
  add:(function (a,b){
    if (a.length!=b.length){return undefined;}
    var r=[];
    for (i=0;i<a.length;i++){
      r.push(a[i]+b[i]);
    }
    return r;
  }),
  sub:(function (a,b){
    if (a.length!=b.length){return undefined;}
    return vector.add(a,vector.mult(b,-1));
  }),
  mult:(function (v,n){
    var r=[];
    v.forEach(function (element){r.push(element*n);});
    return r;
  }),
  div:(function (v,n){
    return vector.mult(v,1/n);
  }),
  dot:(function (a,b){
    if (a.length!=b.length){return undefined;}
    var r=0;
    for (i=0;i<a.length;i++){
      r+=a[i]*b[i];
    }
    return r;
  }),
  cross3d:(function (a,b){
    if (a.length!=b.length){return undefined;}
    if (a.length!=3){return undefined;}
    return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  }),
  unit:(function (a){
    return vector.div(a,vector.abs(a));
  }),
  rotate:(function (p,o,d,t){
    //console.log("p:"+p+" o:"+o+" d:"+d+" t:"+t)
    var qx=(p[0]-o[0])/d[0];
    var qy=(p[1]-o[1])/d[1];
    var qz=(p[2]-o[2])/d[2];
    var qxy=(qx==qy)||isNaN(qx)||isNaN(qy);
    var qxz=(qx==qz)||isNaN(qx)||isNaN(qz);
    var qyz=(qy==qz)||isNaN(qy)||isNaN(qz);
    if (qxy&&qxz&&qyz){
      //console.log("exit");
      return p;
    }
    var c=vector.dot(d,vector.sub(p,o))/Math.pow(vector.abs(d),2);
    var i=vector.add(o,vector.mult(d,c));
    var di=vector.abs(vector.sub(p,i));
    var pa=vector.unit(vector.sub(p,i));
    var pe=vector.unit(vector.cross3d(pa,d));
    //console.log("c: "+c+" i:"+i+" di:"+di+" pa:"+pa+" pe:"+pe);
    return vector.add(vector.add(vector.mult(pa,di*Math.cos(t)),vector.mult(pe,di*Math.sin(t))),i);
  }),
  rot3axis:(function (v,x,y,z){
    var r=vector.rotate(//6
      vector.rotate(//3
        vector.rotate(//1
          v,vector.O,vector.i,x
        ),
        vector.O,
        vector.rotate(//2
          vector.j,vector.O,vector.i,x
        ),
        y
      ),
      vector.O,
      vector.rotate(//5
        vector.rotate(//4
          vector.k,vector.O,vector.i,x
        ),
        vector.O,
        vector.j,
        y
      ),
      z
    );
    //console.log("r:"+r);
    return r;
  }),
  projcam:(function (a){
    return [a[1],-a[2]];
  })
};
