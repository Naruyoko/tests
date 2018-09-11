function encodedata(data){
  var a=Math.floor(Math.random()*64);
  var encodeddata=rotbase64(btoa(encodeURIComponent(data)),a)+":"+String.fromCharCode(a+64);
  return encodeddata;
}
function decodedata(data){
  if (!data||(data.charAt(data.length-2)!=":")){
    throw "Invalid data";
    return false;
  }
  try{
    atob(decodeURIComponent(rotbase64(data.substr(0,data.length-2),-1*data.charCodeAt(data.length-1)+128)));
  }catch(e){
    throw "Invalid data";
    return false;
  }
  return decodeddata=atob(decodeURIComponent(rotbase64(data.substr(0,data.length-2),-1*data.charCodeAt(data.length-1)+128)));
}
