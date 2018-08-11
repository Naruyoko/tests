//hypernumber.js by Naruyoko
//This is open-source, so do whatever you want
//Or put <script src="naruyoko.github.io/tests/hypernumber/hypernumber.js"></script> in your HTML file.
//This library is made to store immensly large numbers with at least some kind of precision,
//n=a^...^b with c ^s becomes {op1:a,op2:2,arr:c}.
//For special cases, arr=-3,-2,-1,0 exists to hold and calculate small numbers,
//where -3 becomes op1, -2 becomes op1+1, -1 becomes op1+op2, and 0 becomes op1*op2.
//Call new hyper([number]) on use.

hyper=hyper||function (input){
  var output;
  if (typeof input=="Number"){
    output={op1:Math.abs(input),op2:0,arr:-3,sgn:Math.sign(input)};
  }else if (typeof input=="String"){
    if (isNaN(Number(input))){
      output={op1:NaN,op2:0,arr:-3,sgn:0};
    }else if (isFinite(Number(input))){
      output={op1:Math.abs(Number(input)),op2:0,arr:-3,sgn:Math.sign(Number(input))};
    }else if (input.search("e")!=-1){
      if (isFinite(Number(input.substr("e")+1,input.length-input.substr("e")-1))){
        output={op1:Math.abs(Number(input.substr(0,input.search("e")))),op2:Number(input.substr("e")+1,input.length-input.substr("e")-1),arr:-1,sgn:Math.sign(Number(input.substr(0,input.search("e"))))}
      }else{
        output={op1:Math.abs(Number(input.substr(0,input.search("e")))),op2:new hyper(input.substr("e")+1,input.length-input.substr("e")-1),arr:-1,sgn:Math.sign(Number(input.substr(0,input.search("e"))))}
      }
    }else{
      output={op1:Infinity,op2:0,arr:-3,sgn:Math.sign(Number(input))};
    }
  }else if (typeof input=="Object"){
    output={op1:input.op1,op2:input.op2,arr:input.arr,sgn:input.sgn};
  }
  this.add (input){
    input=new hyper(input);
    if ((this.arr==-3)&&(input.arr==-3)){
      if (isFinite(this.toNumber()+input.op1.toNumber())){
        return {op1:Math.abs(this.toNumber()+input.toNumber()),op2:0,arr:-3,sgn:Math.sign(this.toNumber()+input.toNumber())};
      }else{
        return {op1:Math.abs(this.toNumber()/1e+308+input.toNumber()/1e+308),op2:1e+308,arr:0,sgn:Math.sign(this.toNumber()/1e+308+input.toNumber()/1e+308)};
      }
    }else if ((this.arr==0)&&(input.arr<=1)){
      if (input.arr==0){
        if (Math.abs((this.op2.sub(input.op2)).toDecimal())<=10){
          return //insert code
        }else //insert code
      }else //insert code
    }else //insert code
  }
  this.times (){
    //insert code
  }
  this.standerlize (){
    if (this.arr==-3){
      if (typeof this.op1=="Number"){
        return this;
      }else{
        return this.op1;
      }
    }else if (isFinite(this.toNumber())){
      return {op1:Math.abs(this.toNumber()),op2:0,arr:-3,sgn:Math.sign(this.toNumber())}
    }else if (this.arr==-2){
      if (typeof this.op1=="Number"){
        return {op1:Math.abs(this.op1*this.sgn+1),op2:0,arr:-3,sgn:Math.sign(this.op1*this.sgn+1)};
      }else{
        return this.op1.add(1);
      }
    }else if (this.arr==-1){
      if (isFinite(this.op1.mult(this.op2))){
        return {op1:Math.abs(this.op1.toNumber()*this.op2.toNumber()),op2:0,arr:-3,sgn:Math.sign(this.op1.toNumber()*this.op2.toNumber())};
      }else{
        return {op1:Math.abs(this.op1),op2:}
      }
    }else if (this.arr==0){
      if (isFinite(this.op1*this.op2.toNumber())){
        return {op1:Math.abs(this.op1*this.op2),op2:0,arr:-3,}
      }
      if (isFinite(this.op2.toNumber())){
        //insert code
      }
    }else //insert code
  }
}
