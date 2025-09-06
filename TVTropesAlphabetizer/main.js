/**
 * @param {string} s
 * @returns {boolean}
 */
function isArticleTitle(s){
  return /^[A-Z](?:[A-Z]+[0-9a-z]|[0-9]*(?:[0-9][A-Z]|[a-z]+[0-9A-Z]+))[0-9A-Za-z]*$/.test(s);
}
/**
 * @param {string} s
 * @returns {boolean}
 */
function isNamespace(s){
  return /^[A-Z][0-9A-Za-z]+$/.test(s);
}
/**
 * Does not always work correctly, just good enough for the most common cases.
 * @param {string} s
 * @returns {{
 *  start:number,end:number
 *  namespace?:{start:number,end:number},
 *  articleTitle:{start:number,end:number}
 * }?}
 */
function searchFirstArticleWick(s){
  /** @enum {number} */
  const TOKEN_TYPES={
    WORD:1,
    NAMESPACE_SEPARATOR_OR_SYMBOL:2,
    COMMENT:3,
    ESCAPE_SEQUENCE:4,
    OPEN_DOUBLE_BRACKETS:5,
    CLOSE_DOUBLE_BRACKETS:6,
    EXTERNAL_LINK_BODY:7,
    OPEN_DOUBLE_BRACES:8,
    CLOSE_DOUBLE_BRACES:9,
    PIPE:10,
    OTHER_SYMBOLS:11,
    EOF:12
  };
  let scannerPos=0;
  /**
   * @typedef {{type:TOKEN_TYPES,start:number,end:number}} Token
   * @type {Token[]}
  */
  let pastTokens=[];
  function supplyTokens(){
    const lastToken=pastTokens[pastTokens.length-1];
    if (lastToken?.type==TOKEN_TYPES.EOF) throw Error(arguments.callee.name+" called after EOF");
    let start=scannerPos;
    let type=TOKEN_TYPES.EOF;
    logic:{
      /** @type {RegExp} */
      let regex;
      if (lastToken?.type==TOKEN_TYPES.WORD){
        if (s[scannerPos]=="/"||s[scannerPos]=="."){
          scannerPos++;
          type=TOKEN_TYPES.NAMESPACE_SEPARATOR_OR_SYMBOL;
          break logic;
        }else if (s[scannerPos]=="|"){
          scannerPos++;
          type=TOKEN_TYPES.PIPE;
          break logic;
        }
      }
      if (lastToken?.type==TOKEN_TYPES.OPEN_DOUBLE_BRACKETS){
        regex=/[a-z-]+:\/\//gy;
        regex.lastIndex=scannerPos;
        if (regex.test(s)){
          regex=/\]\]/g;
          regex.lastIndex=scannerPos;
          if (regex.test(s)){
            type=TOKEN_TYPES.EXTERNAL_LINK_BODY;
            scannerPos=regex.lastIndex-2;
            break logic;
          }
        }
      }
      regex=/\S/g;
      regex.lastIndex=scannerPos;
      if (!regex.test(s)){
        type=TOKEN_TYPES.EOF;
        start=scannerPos=s.length;
        break logic;
      }
      start=scannerPos=regex.lastIndex-1;
      regex=/[0-9A-Za-z]+/gy;
      regex.lastIndex=scannerPos;
      if (regex.test(s)){
        type=TOKEN_TYPES.WORD;
        scannerPos=regex.lastIndex;
        break logic;
      }
      while (/[^0-9A-Za-z\s]/.test(s[scannerPos])){
        switch (s.substring(scannerPos,scannerPos+2)){
          case "%%":
            regex=/\n|$/g;
            regex.lastIndex=scannerPos+2;
            regex.exec(s);
            if (start!=scannerPos)
              pastTokens.push({type:TOKEN_TYPES.OTHER_SYMBOLS,start,end:start=scannerPos});
            type=TOKEN_TYPES.COMMENT;
            scannerPos=regex.lastIndex;
            break logic;
          case "[=":
            regex=/=\]/g;
            regex.lastIndex=scannerPos+2;
            if (regex.test(s)){
              if (start!=scannerPos)
                pastTokens.push({type:TOKEN_TYPES.OTHER_SYMBOLS,start,end:start=scannerPos});
              type=TOKEN_TYPES.ESCAPE_SEQUENCE;
              scannerPos=regex.lastIndex;
              break logic;
            }
            break;
          case "[[":
            if (s[scannerPos+2]!="["&&s[scannerPos+2]!="="){
              if (start!=scannerPos)
                pastTokens.push({type:TOKEN_TYPES.OTHER_SYMBOLS,start,end:start=scannerPos});
              type=TOKEN_TYPES.OPEN_DOUBLE_BRACKETS;
              scannerPos+=2;
              break logic;
            }
            break;
          case "{{":
            if (s[scannerPos+2]!="{"){
              if (start!=scannerPos)
                pastTokens.push({type:TOKEN_TYPES.OTHER_SYMBOLS,start,end:start=scannerPos});
              type=TOKEN_TYPES.OPEN_DOUBLE_BRACES;
              scannerPos+=2;
              break logic;
            }
            break;
          case "]]":
            if (start!=scannerPos)
              pastTokens.push({type:TOKEN_TYPES.OTHER_SYMBOLS,start,end:start=scannerPos});
            type=TOKEN_TYPES.CLOSE_DOUBLE_BRACKETS;
            scannerPos+=2;
            break logic;
          case "}}":
            if (start!=scannerPos)
              pastTokens.push({type:TOKEN_TYPES.OTHER_SYMBOLS,start,end:start=scannerPos});
            type=TOKEN_TYPES.CLOSE_DOUBLE_BRACES;
            scannerPos+=2;
            break logic;
          default:
            break;
        }
        scannerPos++;
      }
      type=TOKEN_TYPES.OTHER_SYMBOLS;
    }
    pastTokens.push({type,start,end:scannerPos});
  }
  /**
   * @param {number} i
   * @returns {Token}
   */
  function tokenAt(i){
    if (i>=pastTokens.length) supplyTokens();
    return pastTokens[i];
  }
  /**
   * @param {number} i
   * @returns {boolean}
   */
  function isFollowedByWhitespace(i){
    return tokenAt(i).end!=tokenAt(i+1).start;
  }
  /**
   * @param {number} i
   * @returns {number}
   */
  function followDashAndUnderscoreSuffix(i){
    while (true){
      const nextToken=tokenAt(i+1);
      if (!isFollowedByWhitespace(i)&&nextToken.end-nextToken.start==1&&
          (s[nextToken.start]=="-"||s[nextToken.start]=="_")&&!isFollowedByWhitespace(i+1)&&
          tokenAt(i+2).type==TOKEN_TYPES.WORD)
        i+=2;
      else return i;
    }
  }
  /**
   * @param {number} i
   * @returns {number}
   */
  function testCurlyWickArticleTitle(i){
    if (!/[A-Za-z]/.test(s[tokenAt(i).start])) return 0;
    let seenPipe=false;
    while (tokenAt(i).type==TOKEN_TYPES.WORD||tokenAt(i).type==TOKEN_TYPES.PIPE){
      i=followDashAndUnderscoreSuffix(i);
      const nextToken=tokenAt(i+1);
      switch (nextToken.type){
        case TOKEN_TYPES.WORD:
          i++;
          break;
        case TOKEN_TYPES.CLOSE_DOUBLE_BRACES:
          return isFollowedByWhitespace(i)?0:i+1;
        case TOKEN_TYPES.PIPE:
          if (seenPipe) return 0;
          seenPipe=true;
          i++;
          break;
        default:
          return 0;
      }
    }
    return 0;
  }
  /**
   * @param {number} i
   * @returns {{closingBrace:number,suffixEnd:number}?}
   */
  function testCurlyWickArticleTitleAndFollowSuffix(i){
    const mayBeClosing=testCurlyWickArticleTitle(i);
    return mayBeClosing?
      {
        closingBrace:mayBeClosing,
        suffixEnd:followDashAndUnderscoreSuffix(
          !isFollowedByWhitespace(mayBeClosing)&&tokenAt(mayBeClosing+1).type==TOKEN_TYPES.WORD?
            mayBeClosing+1:
            mayBeClosing)
      }:
      null;
  }
  for (let tokenReadPos=0;tokenAt(tokenReadPos).type!=TOKEN_TYPES.EOF;tokenReadPos++){
    const token=tokenAt(tokenReadPos);
    switch (token.type){
      case TOKEN_TYPES.WORD:
        const lexeme=s.substring(token.start,token.end);
        if (isNamespace(lexeme)){
          if (!isFollowedByWhitespace(tokenReadPos)&&
              tokenAt(tokenReadPos+1).type==TOKEN_TYPES.NAMESPACE_SEPARATOR_OR_SYMBOL&&
              !isFollowedByWhitespace(tokenReadPos+1)){
            const nextNextToken=tokenAt(tokenReadPos+2);
            switch (nextNextToken.type){
              case TOKEN_TYPES.WORD:
                if (isArticleTitle(s.substring(nextNextToken.start,nextNextToken.end)))
                  return {
                    start:token.start,end:nextNextToken.end,
                    namespace:{start:token.start,end:token.end},
                    articleTitle:{start:nextNextToken.start,end:nextNextToken.end}
                  };
                break;
              case TOKEN_TYPES.OPEN_DOUBLE_BRACES:
                if (isFollowedByWhitespace(tokenReadPos+2)) break;
                const endInfo=testCurlyWickArticleTitleAndFollowSuffix(tokenReadPos+3);
                if (endInfo)
                  return {
                    start:token.start,end:tokenAt(endInfo.suffixEnd).end,
                    namespace:{start:token.start,end:token.end},
                    articleTitle:{start:tokenAt(tokenReadPos+3).start,end:tokenAt(endInfo.closingBrace-1).end}
                  };
                break;
              default:
                break;
            }
          }
        }
        if (isArticleTitle(lexeme))
          return {
            start:token.start,end:token.end,
            articleTitle:{start:token.start,end:token.end}
          };
        break;
      case TOKEN_TYPES.OPEN_DOUBLE_BRACES:
        if (isFollowedByWhitespace(tokenReadPos)) break;
        const nextToken=tokenAt(tokenReadPos+1);
        if (nextToken.type!=TOKEN_TYPES.WORD) break;
        if (isNamespace(s.substring(nextToken.start,nextToken.end))&&
            !isFollowedByWhitespace(tokenReadPos+1)&&
            tokenAt(tokenReadPos+2).type==TOKEN_TYPES.NAMESPACE_SEPARATOR_OR_SYMBOL&&
            !isFollowedByWhitespace(tokenReadPos+2)){
          const endInfo=testCurlyWickArticleTitleAndFollowSuffix(tokenReadPos+3);
          if (endInfo)
            return {
              start:token.start,end:tokenAt(endInfo.suffixEnd).end,
              namespace:{start:nextToken.start,end:nextToken.end},
              articleTitle:{start:tokenAt(tokenReadPos+3).start,end:tokenAt(endInfo.closingBrace-1).end}
            };
        }
        const endInfo=testCurlyWickArticleTitleAndFollowSuffix(tokenReadPos+1);
        if (endInfo)
          return {
            start:token.start,end:tokenAt(endInfo.suffixEnd).end,
            articleTitle:{start:tokenAt(tokenReadPos+1).start,end:tokenAt(endInfo.closingBrace-1).end}
          };
        break;
      default:
        break;
    }
  }
  return null;
}
/** @this {HTMLElement} */
function handleResize(){
  this.style.height="0";
  this.style.minHeight="0";
  this.style.height=this.scrollHeight+14+"px";
  this.style.minHeight="";
}
window.onload=function (){
  const wordWrapControl=
    /** @type {HTMLInputElement} */(document.getElementById("word-wrap-control"));
  const applyWordWrapState=(/** @type {Element} */ e)=>
    e.classList.toggle("word-wrap-enabled",wordWrapControl.checked);
  const addHandleResize=(/** @type {Element} */e)=>
    (e.addEventListener("input", handleResize),handleResize.call(e));
  wordWrapControl.onchange=_=>{
    [...document.getElementsByClassName("word-wrap-target")].forEach(applyWordWrapState);
    [...document.getElementsByClassName("resize-height-to-content")]
      .forEach(e=>handleResize.call(e));
  };
  new MutationObserver(mutations=>
      mutations.forEach(mutation=>
        mutation.addedNodes.forEach(node=>{
          if (node.nodeType!=Node.ELEMENT_NODE) return;
          const e=/** @type {HTMLElement} */(node);
          if (e.classList.contains("word-wrap-target")) applyWordWrapState(e);
          [...e.getElementsByClassName("word-wrap-target")].forEach(applyWordWrapState);
        })))
    .observe(document.body,{childList:true,subtree:true});
  [...document.getElementsByClassName("resize-height-to-content")].forEach(addHandleResize);
  new MutationObserver(mutations=>
      mutations.forEach(mutation=>
        mutation.addedNodes.forEach(node=>{
          if (node.nodeType!=Node.ELEMENT_NODE) return;
          const e=/** @type {HTMLElement} */(node);
          if (e.classList.contains("resize-height-to-content")) addHandleResize(e);
          [...e.getElementsByClassName("resize-height-to-content")].forEach(addHandleResize);
        })))
    .observe(document.body,{childList:true,subtree:true});
  const template=
    /** @type {HTMLTemplateElement} */(document.getElementById("item-template"));
  /**
   * @typedef {HTMLElement&{
   *   contentInput:HTMLTextAreaElement,
   *   keyInput:HTMLInputElement,
   *   splitButton:HTMLButtonElement,
   *   mergeButton:HTMLButtonElement
   * }} Item
   */
  /** @returns {Item} */
  function createItem(){
    /** @type {Item} */
    //@ts-ignore
    const newItem=template.content.cloneNode(true).firstElementChild;
    newItem.contentInput=
      /** @type {HTMLTextAreaElement} */(newItem.getElementsByClassName("item-content")[0]);
    newItem.keyInput=
      /** @type {HTMLInputElement} */(newItem.getElementsByClassName("item-key")[0]);
    newItem.splitButton=
      /** @type {HTMLButtonElement} */(newItem.getElementsByClassName("item-split-button")[0]);
    newItem.mergeButton=
      /** @type {HTMLButtonElement} */(newItem.getElementsByClassName("item-merge-button")[0]);
    function fillTitleAndSelect(){
      const searchResult=searchFirstArticleWick(newItem.contentInput.value);
      if (!searchResult) return;
      newItem.keyInput.value=
        newItem.contentInput.value.substring(searchResult.articleTitle.start,searchResult.articleTitle.end);
      newItem.keyInput.setSelectionRange(0,searchResult.articleTitle.end-searchResult.articleTitle.start)
    }
    newItem.keyInput.onkeydown=e=>{
      if (e.key=="Enter"){
        const nextItem=
          /** @type {Item} */(e.shiftKey?newItem.previousElementSibling:newItem.nextElementSibling);
        (nextItem?.keyInput||(e.shiftKey?null:document.getElementById("alphabetize-button")))?.focus();
        e.preventDefault();
      }
      if (e.key==" "&&e.shiftKey&&!newItem.keyInput.value){
        fillTitleAndSelect();
        e.preventDefault();
      }
    }
    newItem.keyInput.onfocus=_=>{
      if (/** @type {HTMLInputElement} */(document.getElementById("autofill-on-focus")).checked&&
          !newItem.keyInput.value)
        fillTitleAndSelect();
    }
    newItem.keyInput.onblur=newItem.keyInput.onchange=_=>
      newItem.keyInput.value=newItem.keyInput.value
        .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
        .replace(/[\p{P}\s|]/gu,"").toLowerCase();
    newItem.splitButton.onclick=_=>{
      const nextItem=createItem();
      newItem.after(nextItem);
      nextItem.mergeButton.disabled=newItem.mergeButton.disabled;
      newItem.mergeButton.disabled=false;
    };
    newItem.mergeButton.onclick=_=>{
      const nextItem=/** @type {Item} */(newItem.nextElementSibling);
      nextItem.contentInput.value=newItem.contentInput.value+"\n"+nextItem.contentInput.value;
      handleResize.call(nextItem.contentInput);
      nextItem.keyInput.value=newItem.keyInput.value||nextItem.keyInput.value;
      newItem.remove();
    };
    return newItem;
  }
  document.getElementById("loadinput-button").onclick=_=>{
    if (prompt("This will overwrite the current content. Type \"yes\" to continue.")!="yes") return;
    [...document.getElementById("edit-area").children].forEach(e=>e.remove());
    const input=/** @type {HTMLTextAreaElement} */(document.getElementById("input")).value;
    const regex=/^\* /gm;
    regex.lastIndex=1;
    let lastIndex=0;
    do{
      let index=regex.exec(input)?.index;
      let newItem=createItem();
      newItem.contentInput.value=input.substring(lastIndex,index==undefined?input.length:index-1);
      newItem.mergeButton.disabled=index==undefined;
      document.getElementById("edit-area").appendChild(newItem);
      lastIndex=index;
    }while (lastIndex!=undefined);
  };
  document.getElementById("alphabetize-button").onclick=_=>{
    const outputElement=
      /** @type {HTMLTextAreaElement} */(document.getElementById("output"));
    let items=/** @type {Item[]} */([...document.getElementById("edit-area").children]);
    items.sort((a,b)=>
      a.keyInput.value==b.keyInput.value?0:a.keyInput.value<b.keyInput.value?-1:1);
    if (/** @type {HTMLInputElement} */(document.getElementById("warn-empty-key")).checked&&
        items[0]?.keyInput.value==="")
      alert("Some items is missing the sort key. They are sorted to the beginning.\n"+
        "This warning can be disabled.");
    outputElement.value=items.map(e=>e.contentInput.value).join("\n");
    handleResize.call(outputElement);
  }
  window.onresize=_=>
    [...document.getElementsByClassName("resize-height-to-content")].forEach(e=>handleResize.call(e));
}