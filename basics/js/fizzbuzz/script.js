var maxprimerange=2;
var primes=[2];
function findnextprime(){
  while (true){
    maxprimerange++;
    var isprime=true;
    for (var i=0;Math.sqrt(primes[i])<=maxprimerange;i++){
      if (maxprimerange%primes[i]===0){
        isprime=false;
        break;
      }
    }
    if (isprime){
      primes.push(maxprimerange);
      break;
    }
  }
}
function fizzbuzz(){
  var max=document.getElementById("max").value;
  var words=document.getElementById("words").value.replace(/::none/,"").split("\n");
  while (primes.length<words.length) findnextprime();
  var list="";
  for (var i=1;i<=max;i++){
    var item="";
    for (var j=0;j<words.length;j++){
      if (i%primes[j]===0) item+=words[j];
    }
    list+=(list==""?"":"\n")+(item==""?i:item);
  }
  console.log(list);
  document.getElementById("list").value=list;
}
