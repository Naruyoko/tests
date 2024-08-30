/**
 * @param {string} s
 * @returns {string[][]}
 */
function parseInputs(s){
  var words=s.replace(/[,;]/g," ").split(/\s/).filter(Boolean);
  /** @type {string[][]} */
  var r=[];
  for (var i=0;i<words.length;i++){
    if (words[i]=="class"){
      if (++i<words.length){
        r.push([words[i]]);
        if (i+1<words.length&&words[i+1]=="extends") i++;
      }
    }else if (r[r.length-1].indexOf(words[i],1)==-1) r[r.length-1].push(words[i]);
  }
  return r;
}
/**
 * @typedef {{classes:string[],superClasses:Record<string,string[]>}} SortedClassGraph
 * @param {string[][]} a
 * @returns {SortedClassGraph|Error}
 */
function sortAndToGraphs(a){
  a=a.slice();
  /** @type {SortedClassGraph} */
  var r={classes:[],superClasses:{}};
  while (a.length){
    var i=
      a.findIndex(function (e){
        return e.every(function (e,i){
          return i==0||r.classes.indexOf(e)!=-1;
        });
      });
    if (i==-1) return new Error("Unable to determine the resolution order: All classes must be declared and have no cyclic dependency.");
    var n=a.splice(i,1)[0];
    r.classes.push(n[0]);
    r.superClasses[n[0]]=n.slice(1);
  }
  return r;
}
/**
 * @param {Record<string,string[]>} linearization
 * @param {string[]} superClasses
 */
function sourceArrays(linearization,superClasses){
  var arrays=superClasses.map(function (e){return linearization[e];});
  arrays.push(superClasses);
  return arrays;
}
/**
 * @typedef {{view:"n",classIndex:number}|
 *  {view:"s",classIndex:number,progress:number,arrayIndices:number[],testIndex:number,status:boolean}} PageInfo
 * @param {SortedClassGraph} sortedGraphs
 * @returns {{linearization:Record<string,string[]>,pages:PageInfo[]}}
 */
function C3LinearizationWithPageInfo(sortedGraphs){
  /** @type {Record<string,string[]>} */
  var linearization={};
  /** @type {PageInfo[]} */
  var pages=[];
  for (var classIndex=0;;classIndex++){
    pages.push({view:"n",classIndex:classIndex});
    if (classIndex==sortedGraphs.classes.length) break;
    var thisClass=sortedGraphs.classes[classIndex];
    var superClasses=sortedGraphs.superClasses[thisClass];
    var arrays=sourceArrays(linearization,superClasses);
    var arrayIndices=Array(arrays.length).fill(0);
    linearization[thisClass]=[thisClass];
    /**
     * @param {number} testIndex
     * @param {boolean} status
     */
    function pushStep(testIndex,status){
      pages.push({
        view:"s",
        classIndex:classIndex,
        progress:linearization[thisClass].length,
        arrayIndices:arrayIndices.slice(),
        testIndex:testIndex,
        status:status
      });
    }
    outer:while (true){
      pushStep(-1,false);
      for (var testIndex=0;testIndex<arrays.length;testIndex++){
        if (arrayIndices[testIndex]==arrays[testIndex].length) continue;
        var candidate=arrays[testIndex][arrayIndices[testIndex]];
        if (arrays.slice(0,testIndex).some(function (e,i){return e[arrayIndices[i]]==candidate;})) continue;
        if (arrays.every(function (e,i){return e.indexOf(candidate,arrayIndices[i]+1)==-1;})){
          pushStep(testIndex,true);
          arrays.forEach(function (e,i){if (e[arrayIndices[i]]==candidate) arrayIndices[i]++;});
          linearization[thisClass].push(candidate);
          continue outer;
        }else pushStep(testIndex,false);
      }
      break;
    };
  }
  return {linearization:linearization,pages:pages};
}
/**
 * @type {{
 *  input:string,
 *  parserOutput:string[][],
 *  sortedGraphs:SortedClassGraph,
 *  linearization:Record<string,string[]>,
 *  pages:PageInfo[]
 * }}
 * */
var calculatedInfo;
var currentPageNumber=1;
function updatePages(){
  /** @type {string} */ // @ts-ignore
  var input=document.getElementById("input").value;
  var parserOutput=parseInputs(input);
  var sortedGraphs=sortAndToGraphs(parserOutput);
  if (sortedGraphs instanceof Error){
    alert(sortedGraphs.message);
    return;
  }
  var result=C3LinearizationWithPageInfo(sortedGraphs);
  calculatedInfo={
    input:input,
    parserOutput:parserOutput,
    sortedGraphs:sortedGraphs,
    linearization:result.linearization,
    pages:result.pages
  };
  showPage(1);
}
/**
 * @param {HTMLCanvasElement} canvas
 * @param {SortedClassGraph} sortedGraphs
 * @param {Record<string, string[]>} linearization
 * @param {PageInfo} page
 */
function render(canvas,sortedGraphs,linearization,page){
  var ctx=canvas.getContext("2d");
  ctx.fillStyle="white";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.font="12px \"Liberation Mono\", \"Courier New\", Courier, monospace";
  ctx.fillStyle="black";
  var leftWidth=0;
  var PIXELS_PER_LINE=20;
  for (var i=0;i<sortedGraphs.classes.length;i++){
    var text="L("+sortedGraphs.classes[i]+")";
    leftWidth=Math.max(leftWidth,ctx.measureText(text).width);
    if (i<page.classIndex) ctx.fillText(text,8,PIXELS_PER_LINE*(i+1));
  }
  for (var i=0;i<page.classIndex;i++)
    ctx.fillText(" = ["+linearization[sortedGraphs.classes[i]].join(", ")+"]",leftWidth+8,PIXELS_PER_LINE*(i+1));
  if (page.view=="s"){
    var thisClass=sortedGraphs.classes[page.classIndex];
    var superClasses=sortedGraphs.superClasses[thisClass];
    var yOffset=PIXELS_PER_LINE*sortedGraphs.classes.length;
    var text="class "+thisClass+(superClasses.length?" extends "+superClasses.join(", "):"");
    ctx.fillText(text,8,yOffset+PIXELS_PER_LINE*3/2);
    ctx.fillText(">",8,yOffset+PIXELS_PER_LINE*5/2);
    ctx.fillText(" : "+linearization[thisClass].slice(0,page.progress).join(", "),8+leftWidth,yOffset+PIXELS_PER_LINE*5/2);
    yOffset+=PIXELS_PER_LINE*3;
    var arrays=sourceArrays(linearization,superClasses).map(function (e,i){return e.slice(page.arrayIndices[i]);});
    if (page.testIndex!=-1){
      var candidate=arrays[page.testIndex][0];
      function drawHighlight(i,j){
        var measure=ctx.measureText(arrays[i][j]);
        var x=8+leftWidth+ctx.measureText(" : "+arrays[i].slice(0,j).concat([""]).join(", ")).width;
        var y=yOffset+PIXELS_PER_LINE*(i+1)-measure.fontBoundingBoxAscent;
        var w=measure.width;
        var h=measure.fontBoundingBoxAscent+measure.fontBoundingBoxDescent;
        ctx.fillRect(x,y,w,h);
        ctx.beginPath();
        ctx.moveTo(x,y+h);
        ctx.lineTo(x+w,y+h);
        ctx.stroke();
      }
      ctx.strokeStyle="black";
      ctx.fillStyle="#ccf";
      drawHighlight(page.testIndex,0);
      ctx.fillStyle="#6fc";
      for (var i=page.testIndex+1;i<arrays.length;i++) if (arrays[i][0]==candidate) drawHighlight(i,0);
      if (!page.status){
        ctx.fillStyle="#f99";
        for (var i=0;i<arrays.length;i++){
          var j=arrays[i].indexOf(candidate,1);
          if (j!=-1) drawHighlight(i,j);
        }
      }
    }
    ctx.fillStyle="black";
    for (var i=0;i<arrays.length;i++){
      ctx.fillText(i==superClasses.length?"...":"L("+superClasses[i]+")",8,yOffset+PIXELS_PER_LINE*(i+1));
      ctx.fillText(" : "+arrays[i].join(", "),8+leftWidth,yOffset+PIXELS_PER_LINE*(i+1));
    }
  }
}
function updateCanvasSize(){
  /** @type {HTMLCanvasElement} */ // @ts-ignore
  var canvas=document.getElementById("canvas");
  canvas.width=canvas.clientWidth;
  canvas.height=canvas.clientHeight;
}
/**
 * @param {number} pageNumber
*/
function showPage(pageNumber){
  currentPageNumber=Math.min(Math.max(pageNumber,1),calculatedInfo.pages.length);
  /** @type {HTMLCanvasElement} */ // @ts-ignore
  var canvas=document.getElementById("canvas");
  render(canvas,calculatedInfo.sortedGraphs,calculatedInfo.linearization,calculatedInfo.pages[currentPageNumber-1]);
  document.getElementById("pageNumber").textContent=currentPageNumber+"/"+calculatedInfo.pages.length;
}
/**
 * @param {Blob} blob
 * @param {string} name
 */
function saveBlob(blob,name){
  var e=document.createElement("a");
  document.body.appendChild(e);
  e.style.display="none";
  var url=URL.createObjectURL(blob);
  e.href=url;
  e.download=name;
  e.click();
  URL.revokeObjectURL(url);
  e.remove();
}
function saveCurrentFrame(){
  /** @type {HTMLCanvasElement} */ // @ts-ignore
  var canvas=document.getElementById("canvas");
  var name="page"+currentPageNumber+".png";
  canvas.toBlob(function (blob){saveBlob(blob,name);});
}
var JSZip;
function saveAllFrames(){
  /** @type {HTMLCanvasElement} */ // @ts-ignore
  var onscreenCanvas=document.getElementById("canvas");
  var canvas=document.createElement("canvas");
  canvas.width=onscreenCanvas.width;
  canvas.height=onscreenCanvas.height;
  var zip=new JSZip();
  var doneCount=0;
  calculatedInfo.pages.forEach(function (e,i,a){
    render(canvas,calculatedInfo.sortedGraphs,calculatedInfo.linearization,e);
    canvas.toBlob(function (blob){
      zip.file("page"+(i+1)+".png",blob);
      if (++doneCount==a.length) zip.generateAsync({type:"blob"}).then(function (blob){saveBlob(blob,"pages.zip");});
    });
  })
}

window.onload=function (){
  updateCanvasSize();
  updatePages();
  document.getElementById("mainDisplay").onkeydown=function (event){
    switch (event.key){
      case "ArrowLeft":
        if (event.shiftKey) showPage(1);
        else showPage(currentPageNumber-1);
        event.preventDefault();
        break;
      case "ArrowRight":
        if (event.shiftKey) showPage(calculatedInfo.pages.length);
        else showPage(currentPageNumber+1);
        event.preventDefault();
        break;
    }
  }
}