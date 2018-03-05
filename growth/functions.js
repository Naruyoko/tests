function rule(){}
function run(){
  if (Number(document.input.delay.value)<50){
    alert("For safety, you need to make\ndelay at least 50 ms!\nYou have: "+document.input.delay.value+" ms");
    return;
  }
  interval=setInterval(increment,Number(document.input.delay.value));
}
function increment(){
  step++;
  value=rule();
  document.getElementById("step").textContent=step;
  document.getElementById("value").textContent=value;
  if (!isFinite(value)){
    clearInterval(interval);
    value.style.color="#FF0000";
  }
}
