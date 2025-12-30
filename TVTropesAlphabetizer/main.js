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
/**
 * First phase of title normalization: remove spaces and puctuations but keep capitalizations.
 * @param {string} s
 */
function plainTitle(s){
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[\p{P}\s|]/gu,"");
}
/**
 * @param {string} script
 * @param {string} s
 * @returns {string}
 */
function advancedExtraction(script,s){
  /**
   * @typedef {string|{children:Expression[]}} Expression
   * @param {string} s
   * @returns {Expression[]}
   */
  function parse(s){
    let scannerPos=0;
    function getToken(){
      {
        let matcher=/\S/g;
        matcher.lastIndex=scannerPos;
        let matchResult=matcher.exec(s);
        if (!matchResult) return null;
        scannerPos=matchResult.index;
      }
      if (s[scannerPos]=="\\"&&"{}".includes(s[scannerPos+1])) return s.substring(scannerPos,scannerPos+=2);
      if ("()".includes(s[scannerPos])) return s.substring(scannerPos,++scannerPos);
      {
        let matcher=/[\s()]|\\./gs;
        matcher.lastIndex=scannerPos+1;
        let endIndex;
        while (s[endIndex=matcher.exec(s)?.index??s.length]=="\\");
        return s.substring(scannerPos,scannerPos=endIndex);
      }
    }
    /** @type {Expression[]} */
    let r=[];
    /** @type {Exclude<Expression,string>[]} */
    let c=[];
    let commentDepth=0;
    while(true){
      let token=getToken();
      if (!token){
        if (c.length!=0) throw Error("Mismatched open parenthesis");
        return r;
      }
      if (token=="\\{"){
        commentDepth++;
        continue;
      }else if (token=="\\}"){
        commentDepth--;
        continue;
      }
      if (commentDepth!=0) continue;
      if (token=="("){
        let n={children:[]};
        (c.length==0?r:c[c.length-1].children).push(n);
        c.push(n);
      }else if (token==")"){
        if (c.length==0) throw Error("Mismatched closing parenthesis");
        c.pop();
      }else (c.length==0?r:c[c.length-1].children).push(token);
    }
  }
  /** @typedef {typeof NIL_VALUE} NilValue */
  const NIL_VALUE=/** @type {const} */({type:"nil"});
  /** @typedef {typeof T_VALUE} TValue */
  const T_VALUE=/** @type {const} */({type:"t"});
  /**
   * @typedef {{type:"cons",car:Value,cdr:NilValue|ConsValue}} ConsValue
   * @typedef {(
   *   NilValue|TValue|
   *   {type:"number",value:number}|
   *   {type:"string",value:string}|
   *   ConsValue|
   *   {type:"function",value:((args:Array<Value>)=>EvalResult)}
   * )} Value
   * @typedef {{type:"error",value:string}} EvalError
   * @typedef {Value|EvalError} EvalResult
   */
  const parentEnv=Symbol();
  /** @typedef {Record<string,EvalResult>&{[parentEnv]:Environment?}} Environment */
  const COMMON_ERRORS=/** @type {const} */({
    INVALID_ARGUMENT_COUNT:(/** @type {number} */n)=>
      /** @type {const} */({type:"error",value:"Invalid number of arguments: "+n}),
    INCOMPATIBLE_TYPES:{type:"error",value:"Incompatible types"},
  });
  const EXIT_SIGNAL=/** @type {const} */({type:"error",value:"Exit signaled"});
  /**
   * @param {Environment} env
   * @param {string} name
   * @returns {EvalResult}
   */
  let lookupVar=(env,name)=>
    Object.hasOwn(env,name)?env[name]:
      env[parentEnv]?lookupVar(env[parentEnv],name):{type:"error",value:"Undefined variable: "+name};
  /**
   * @param {Environment} env
   * @param {string} name
   * @param {Value} value
   */
  let setVar=(env,name,value)=>
    void (Object.hasOwn(env,name)||!env[parentEnv]?env[name]=value:setVar(env[parentEnv],name,value));
  let booleanValue=(/** @type {*} */b)=>b?T_VALUE:NIL_VALUE;
  let valueBoolean=(/** @type {Value} */v)=>v.type!="nil";
  /**
   * @param {Expression} e
   * @param {Environment} env
   * @returns {EvalResult}
   */
  function quote(e,env){
    if (typeof e=="string") return {type:"string",value:e.replace(/\\(.)/gs,"$1")};
    else{
      if (e.children[0]==="unquote") return evalExpression(e.children[1],env);
      /** @type {Array<Value>} */
      let a=[];
      for (let f of e.children){
        let y=quote(f,env);
        if (y.type=="error") return y;
        a.push(y);
      }
      /** @type {NilValue|ConsValue} */
      let r=NIL_VALUE;
      for (let i=a.length-1;i>=0;i--) r={type:"cons",car:a[i],cdr:r};
      return r;
    }
  }
  /**
   * @param {Value} v
   * @returns {Expression?} `null` if failed
   */
  function unquote(v){
    if (v.type=="string") return v.value;
    if (v.type=="nil"||v.type=="cons"){
      /** @type {Expression[]} */
      let a=[];
      while (v.type=="cons"){
        let y=unquote(v.car);
        if (y===null) return null;
        a.push(y);
        v=v.cdr;
      }
      if (v!==null) return null;
      return {children:a};
    }
    return null;
  }
  /**
   * @param {Expression} e
   * @param {Environment} env
   * @returns {EvalResult}
   */
  function evalExpression(e,env){
    if (typeof e=="string"){
      if (e[0]=="\\"){
        if (e[1]=="#") return {type:"number",value:+e.substring(2)};
        if (e[1]=="\"") return {type:"string",value:e.substring(2).replace(/\\(.)/gs,"$1")};
      }
      return lookupVar(env,e);
    }else{
      if (e.children[0]==="if"){
        let p=evalExpression(e.children[1],env);
        if (p.type=="error") return p;
        return evalExpression(e.children[valueBoolean(p)?2:3],env);
      }else if (e.children[0]==="quote") return quote(e.children[1],env);
      else if (e.children[0]==="unquote") return {type:"error",value:"Bare unquote"};
      else if (e.children[0]==="progn"){
        if (e.children.length==1) return NIL_VALUE;
        for (let i=1;;i++){
          let v=evalExpression(e.children[i],env);
          if (v.type=="error") return v;
          if (i==e.children.length-1) return v;
        }
      }else if (e.children[0]==="let"||e.children[0]==="let*"){
        if (e.children.length<3) return COMMON_ERRORS.INVALID_ARGUMENT_COUNT(e.children.length);
        if (typeof e.children[1]=="string") return COMMON_ERRORS.INCOMPATIBLE_TYPES;
        /** @type {Environment} */
        let childEnv={[parentEnv]:env};
        for (let p of e.children[1].children){
          if (typeof p=="string") childEnv[p]=NIL_VALUE;
          else{
            if (p.children.length<2) return COMMON_ERRORS.INVALID_ARGUMENT_COUNT(p.children.length);
            if (typeof p.children[0]!="string") return COMMON_ERRORS.INCOMPATIBLE_TYPES;
            let value=evalExpression(p.children[1],e.children[0]==="let"?env:childEnv);
            if (value.type=="error") return value;
            childEnv[p.children[0]]=value;
          }
        }
        for (let i=2;;i++){
          let v=evalExpression(e.children[i],childEnv);
          if (v.type=="error") return v;
          if (i==e.children.length-1) return v;
        }
      }else if (e.children[0]==="set"){
        if (e.children.length<3) return COMMON_ERRORS.INVALID_ARGUMENT_COUNT(e.children.length);
        if (typeof e.children[1]!="string") return COMMON_ERRORS.INCOMPATIBLE_TYPES;
        let value=evalExpression(e.children[2],env);
        if (value.type=="error") return value;
        setVar(env,e.children[1],value);
        return NIL_VALUE;
      }else if (e.children[0]==="lambda"){
        if (e.children.length<3) return COMMON_ERRORS.INVALID_ARGUMENT_COUNT(e.children.length);
        if (typeof e.children[1]=="string"||e.children[1].children.some(k=>typeof k!="string"))
          return COMMON_ERRORS.INCOMPATIBLE_TYPES;
        let vars=/** @type {string[]} */(e.children[1].children);
        /** @type {Environment} */
        let childEnvT={[parentEnv]:env};
        vars.forEach(k=>childEnvT[k]=NIL_VALUE);
        return {type:"function",value:args=>{
          let childEnv={...childEnvT};
          for (let i=0;i<args.length&&vars.length;i++) childEnv[vars[i]]=args[i];
          for (let i=2;;i++){
            let v=evalExpression(e.children[i],childEnv);
            if (v.type=="error") return v;
            if (i==e.children.length-1) return v;
          }
        }};
      }else if (e.children[0]==="exit"){
        return EXIT_SIGNAL;
      }else{
        if (e.children.length<1) return COMMON_ERRORS.INVALID_ARGUMENT_COUNT(e.children.length);
        let f=evalExpression(e.children[0],env);
        if (f.type=="error") return f;
        if (f.type!="function") return COMMON_ERRORS.INCOMPATIBLE_TYPES;
        /** @type {Array<Value>} */
        let args=[];
        for (let i=1;i<e.children.length;i++){
          let v=evalExpression(e.children[i],env);
          if (v.type=="error") return v;
          args.push(v);
        }
        return f.value(args);
      }
    }
  }
  let parsedScript=parse(script);
  /** @type {Environment} */
  let env={
    "&_":{type:"string",value:s},
    "nil":NIL_VALUE,
    "t":T_VALUE,
    "null":{type:"function",value:args=>{
        if (args.length==0) return COMMON_ERRORS.INVALID_ARGUMENT_COUNT(args.length);
        return booleanValue(!args.some(valueBoolean));
      }},
    "not":{type:"function",value:args=>{
        if (args.length==0) return COMMON_ERRORS.INVALID_ARGUMENT_COUNT(args.length);
        return booleanValue(!args.some(valueBoolean));
      }},
    "and":{type:"function",value:args=>{
        if (args.length==0) return COMMON_ERRORS.INVALID_ARGUMENT_COUNT(args.length);
        return booleanValue(args.every(valueBoolean));
      }},
    "or":{type:"function",value:args=>{
        if (args.length==0) return COMMON_ERRORS.INVALID_ARGUMENT_COUNT(args.length);
        return booleanValue(args.some(valueBoolean));
      }},
    "=":{type:"function",value:args=>{
        if (args.length==0) return COMMON_ERRORS.INVALID_ARGUMENT_COUNT(args.length);
        /**
         * @param {Value} a
         * @param {Value} b
         * @returns {boolean}
         */
        function internal(a,b){
          if (a.type=="nil") return b.type=="nil";
          if (a.type=="t") return b.type=="t";
          if (a.type=="number") return b.type=="number"&&a.value==b.value;
          if (a.type=="string") return b.type=="string"&&a.value==b.value;
          if (a.type=="cons") return b.type=="cons"&&internal(a.car,b.car)&&internal(a.cdr,b.cdr);
          if (a.type=="function") return b.type=="function"&&a.value==b.value;
          return false;
        }
        for (let i=0;i<args.length-1;i++) if (!internal(args[i],args[i+1])) return NIL_VALUE;
        return T_VALUE;
      }},
    "<":{type:"function",value:args=>{
        if (args.length==0) return COMMON_ERRORS.INVALID_ARGUMENT_COUNT(args.length);
        /**
         * @param {Value} a
         * @param {Value} b
         * @returns {boolean?}
         */
        function internal(a,b){
          if (a.type=="nil") return b.type!="nil";
          if (b.type=="nil") return false;
          if (a.type=="t"&&b.type=="t") return false;
          if (a.type=="number"&&b.type=="number") return a.value<b.value;
          if (a.type=="string"&&b.type=="string") return a.value<b.value;
          return null;
        }
        for (let i=0;i<args.length-1;i++){
          let r=internal(args[i],args[i+1]);
          if (r===null) return COMMON_ERRORS.INCOMPATIBLE_TYPES;
          if (!r) return NIL_VALUE;
        }
        return T_VALUE;
      }},
    "<=":{type:"function",value:args=>{
        if (args.length==0) return COMMON_ERRORS.INVALID_ARGUMENT_COUNT(args.length);
        /**
         * @param {Value} a
         * @param {Value} b
         * @returns {boolean?}
         */
        function internal(a,b){
          if (a.type=="nil") return true;
          if (b.type=="nil") return false;
          if (a.type=="t"&&b.type=="t") return true;
          if (a.type=="number"&&b.type=="number") return a.value<=b.value;
          if (a.type=="string"&&b.type=="string") return a.value<=b.value;
          return null;
        }
        for (let i=0;i<args.length-1;i++){
          let r=internal(args[i],args[i+1]);
          if (r===null) return COMMON_ERRORS.INCOMPATIBLE_TYPES;
          if (!r) return NIL_VALUE;
        }
        return T_VALUE;
      }},
    ">":{type:"function",value:args=>{
        if (args.length==0) return COMMON_ERRORS.INVALID_ARGUMENT_COUNT(args.length);
        /**
         * @param {Value} a
         * @param {Value} b
         * @returns {boolean?}
         */
        function internal(a,b){
          if (a.type=="nil") return false;
          if (b.type=="nil") return true;
          if (a.type=="t"&&b.type=="t") return false;
          if (a.type=="number"&&b.type=="number") return a.value>b.value;
          if (a.type=="string"&&b.type=="string") return a.value>b.value;
          return null;
        }
        for (let i=0;i<args.length-1;i++){
          let r=internal(args[i],args[i+1]);
          if (r===null) return COMMON_ERRORS.INCOMPATIBLE_TYPES;
          if (!r) return NIL_VALUE;
        }
        return T_VALUE;
      }},
    ">=":{type:"function",value:args=>{
        if (args.length==0) return COMMON_ERRORS.INVALID_ARGUMENT_COUNT(args.length);
        /**
         * @param {Value} a
         * @param {Value} b
         * @returns {boolean?}
         */
        function internal(a,b){
          if (a.type=="nil") return b.type=="nil";
          if (b.type=="nil") return true;
          if (a.type=="t"&&b.type=="t") return true;
          if (a.type=="number"&&b.type=="number") return a.value>=b.value;
          if (a.type=="string"&&b.type=="string") return a.value>=b.value;
          return null;
        }
        for (let i=0;i<args.length-1;i++){
          let r=internal(args[i],args[i+1]);
          if (r===null) return COMMON_ERRORS.INCOMPATIBLE_TYPES;
          if (!r) return NIL_VALUE;
        }
        return T_VALUE;
      }},
    "+":{type:"function",value:args=>{
        if (args.length==0) return COMMON_ERRORS.INVALID_ARGUMENT_COUNT(args.length);
        let a=args[0];
        for (let i=1;i<args.length;i++){
          let e=args[i];
          if (a.type=="nil") a=e;
          else if (e.type=="nil") a=a;
          else if (a.type=="number"&&e.type=="number") a={type:"number",value:a.value+e.value};
          else if (a.type=="string"&&e.type=="string") a={type:"string",value:a.value+e.value};
          else if (a.type=="cons"&&e.type=="cons"){
            let r={...a},t=r;
            while (t.cdr.type=="cons") t=t.cdr={...t.cdr};
            t.cdr=e;
            a=r;
          }else return COMMON_ERRORS.INCOMPATIBLE_TYPES;
        }
        return a;
      }},
    "-":{type:"function",value:args=>{
        /**
         * @param {Value} x
         * @returns {EvalResult}
         */
        function neg(x){
          if (x.type=="nil") return NIL_VALUE;
          if (x.type=="number") return {type:"number",value:-x.value};
          return COMMON_ERRORS.INCOMPATIBLE_TYPES;
        }
        if (args.length==0) return COMMON_ERRORS.INVALID_ARGUMENT_COUNT(args.length);
        if (args.length==1) return neg(args[0]);
        let a=args[0];
        for (let i=1;i<args.length;i++){
          let e=args[i];
          if (a.type=="nil") a=e;
          else if (e.type=="nil") a=a;
          else if (a.type=="number"&&e.type=="number") a={type:"number",value:a.value-e.value};
          else return COMMON_ERRORS.INCOMPATIBLE_TYPES;
        }
        return a;
      }},
    "*":{type:"function",value:args=>{
        if (args.length==0) return COMMON_ERRORS.INVALID_ARGUMENT_COUNT(args.length);
        let a=args[0];
        for (let i=1;i<args.length;i++){
          let e=args[i];
          if (a.type=="nil") a=e;
          else if (e.type=="nil") a=a;
          else if (a.type=="number"&&e.type=="number") a={type:"number",value:a.value*e.value};
          else return COMMON_ERRORS.INCOMPATIBLE_TYPES;
        }
        return a;
      }},
    "/":{type:"function",value:args=>{
        /**
         * @param {Value} x
         * @returns {EvalResult}
         */
        function rec(x){
          if (x.type=="nil") return NIL_VALUE;
          if (x.type=="number") return {type:"number",value:1/x.value};
          return COMMON_ERRORS.INCOMPATIBLE_TYPES;
        }
        if (args.length==0) return COMMON_ERRORS.INVALID_ARGUMENT_COUNT(args.length);
        if (args.length==1) return rec(args[0]);
        let a=args[0];
        for (let i=1;i<args.length;i++){
          let e=args[i];
          if (a.type=="nil") a=e;
          else if (e.type=="nil") a=a;
          else if (a.type=="number"&&e.type=="number") a={type:"number",value:a.value/e.value};
          else return COMMON_ERRORS.INCOMPATIBLE_TYPES;
        }
        return a;
      }},
    "mod":{type:"function",value:args=>{
        if (args.length!=2) return COMMON_ERRORS.INVALID_ARGUMENT_COUNT(args.length);
        if (args[0].type=="number"&&args[1].type=="number")
          return {type:"number",value:args[0].value%args[1].value};
        return COMMON_ERRORS.INCOMPATIBLE_TYPES;
      }},
    "char":{type:"function",value:args=>{
        if (args.length!=2) return COMMON_ERRORS.INVALID_ARGUMENT_COUNT(args.length);
        if (args[0].type!="string"||args[1].type!="number") return COMMON_ERRORS.INCOMPATIBLE_TYPES;
        return args[0].value[args[1].value]?{type:"string",value:args[0].value[args[1].value]}:NIL_VALUE;
      }},
    "char-code":{type:"function",value:args=>{
        if (args.length!=1) return COMMON_ERRORS.INVALID_ARGUMENT_COUNT(args.length);
        if (args[0].type!="string") return COMMON_ERRORS.INCOMPATIBLE_TYPES;
        return args[0].value.length>=1?{type:"number",value:args[0].value.charCodeAt(0)}:NIL_VALUE;
      }},
    "code-char":{type:"function",value:args=>{
        if (args.length!=1) return COMMON_ERRORS.INVALID_ARGUMENT_COUNT(args.length);
        if (args[0].type!="number") return COMMON_ERRORS.INCOMPATIBLE_TYPES;
        return {type:"string",value:String.fromCharCode(args[0].value)};
      }},
    "uppercase":{type:"function",value:args=>{
        if (args.length!=1) return COMMON_ERRORS.INVALID_ARGUMENT_COUNT(args.length);
        if (args[0].type!="string") return COMMON_ERRORS.INCOMPATIBLE_TYPES;
        return {type:"string",value:args[0].value.toUpperCase()};
      }},
    "lowercase":{type:"function",value:args=>{
        if (args.length!=1) return COMMON_ERRORS.INVALID_ARGUMENT_COUNT(args.length);
        if (args[0].type!="string") return COMMON_ERRORS.INCOMPATIBLE_TYPES;
        return {type:"string",value:args[0].value.toLowerCase()};
      }},
    "string-reverse":{type:"function",value:args=>{
        if (args.length!=1) return COMMON_ERRORS.INVALID_ARGUMENT_COUNT(args.length);
        if (args[0].type!="string") return COMMON_ERRORS.INCOMPATIBLE_TYPES;
        return {type:"string",value:args[0].value.split("").reverse().join("")};
      }},
    "string-match":{type:"function",value:args=>{
        if (args.length!=2&&args.length!=3) return COMMON_ERRORS.INVALID_ARGUMENT_COUNT(args.length);
        let [s,r]=args,f=args[2]??{type:"string",value:""};
        if (s.type!="string"||r.type!="string"||f.type!="string") return COMMON_ERRORS.INCOMPATIBLE_TYPES;
        let m=new RegExp(r.value,f.value).exec(s.value);
        if (m===null) return NIL_VALUE;
        setVar(env,"&&",{type:"string",value:m[0]});
        setVar(env,"&'",{type:"string",value:s.value.substring(0,m.index)});
        setVar(env,"&`",{type:"string",value:s.value.substring(m.index+m[0].length)});
        for (let i=0;i<m.length;i++) setVar(env,"&"+i,m[i]?{type:"string",value:m[i]}:NIL_VALUE);
        for (let k in m.groups) setVar(env,"&"+k,m.groups[k]?{type:"string",value:m.groups[k]}:NIL_VALUE);
        setVar(env,"&@",{type:"number",value:m.index});
        return {type:"string",value:m[0]};
      }},
    "cons":{type:"function",value:args=>{
        if (args.length!=2) return COMMON_ERRORS.INVALID_ARGUMENT_COUNT(args.length);
        if (args[1].type!="nil"&&args[1].type!="cons") return COMMON_ERRORS.INCOMPATIBLE_TYPES;
        return {type:"cons",car:args[0],cdr:args[1]};
      }},
    "list":{type:"function",value:args=>{
        /** @type {NilValue|ConsValue} */
        let r=NIL_VALUE;
        for (let i=args.length-1;i>=0;i--) r={type:"cons",car:args[i],cdr:r};
        return r;
      }},
    "car":{type:"function",value:args=>{
        if (args.length!=1) return COMMON_ERRORS.INVALID_ARGUMENT_COUNT(args.length);
        if (args[0].type=="nil") return NIL_VALUE;
        if (args[0].type=="cons") return args[0].car;
        return COMMON_ERRORS.INCOMPATIBLE_TYPES;
      }},
    "cdr":{type:"function",value:args=>{
        if (args.length!=1) return COMMON_ERRORS.INVALID_ARGUMENT_COUNT(args.length);
        if (args[0].type=="nil") return NIL_VALUE;
        if (args[0].type=="cons") return args[0].cdr;
        return COMMON_ERRORS.INCOMPATIBLE_TYPES;
      }},
    "apply":{type:"function",value:args=>{
        if (args.length!=2) return COMMON_ERRORS.INVALID_ARGUMENT_COUNT(args.length);
        if (args[0].type!="function") return COMMON_ERRORS.INCOMPATIBLE_TYPES;
        if (args[1].type!="nil"&&args[1].type!="cons") return COMMON_ERRORS.INCOMPATIBLE_TYPES;
        let v=args[1],/** @type {Array<Value>} */a=[];
        while (v.type=="cons") a.push(v.car),v=v.cdr;
        return args[0].value(a);
      }},
    "length":{type:"function",value:args=>{
        if (args.length!=1) return COMMON_ERRORS.INVALID_ARGUMENT_COUNT(args.length);
        if (args[0].type=="nil") return {type:"number","value":0};
        if (args[0].type=="string") return {type:"number","value":args[0].value.length};
        if (args[0].type=="cons"){
          /** @type {NilValue|ConsValue} */
          let a=args[0],n=0;
          while (a.type=="cons") n++,a=a.cdr;
          return {type:"number","value":n};
        }
        return COMMON_ERRORS.INCOMPATIBLE_TYPES;
      }},
    "console":{type:"function",value:args=>(console.log(args),NIL_VALUE)},
    "eval":{type:"function",value:args=>{
        if (args.length!=1) return COMMON_ERRORS.INVALID_ARGUMENT_COUNT(args.length);
        let e=unquote(args[0]);
        return e!==null?evalExpression(e,env):COMMON_ERRORS.INCOMPATIBLE_TYPES;
      }},
    [parentEnv]:null
  };
  evalExpression(parse(`
    (progn
      (let* ((_nthcdr (lambda (n l) (if (> n \\#0) (_nthcdr (- n 1) l) l)))) (set nthcdr _nthcdr))
      (set nth (lambda (n l) (car (nthcdr n l))))
      (set cadr (lambda (l) (car (cdr l))))
      (set caddr (lambda (l) (car (cdr (cdr l)))))
      (set cadddr (lambda (l) (car (cdr (cdr (cdr l))))))
      (set cddr (lambda (l) (cdr (cdr l))))
      (set cdddr (lambda (l) (cdr (cdr (cdr l)))))
      (set cddddr (lambda (l) (cdr (cdr (cdr (cdr l))))))
      (set first car)
      (set second cadr)
      (set third caddr)
      (set rest cdr)
      (set last (lambda (l n) (nthcdr (- (length l) (if n n 1)) l)))
      (let*
        (
          (_append (lambda (a b)
            (if a (cons (car a) (_append (cdr a) b))) b))))
        (set append _append)
      (let*
        (
          (go (lambda (p l n)
            (if l
              (if (p (car l)) n (go p (cdr l) (+ n 1)))
              nil))))
        (set position-if (go p l \\#0)))
      (set position (lambda (x l) (position-if (lambda (y) (= x y)) l)))
      (set position-if-not (lambda (p l) (position-if (lambda (x) (not (p x))) l)))
      (set member (lambda (x l) (nthcdr (position x l) l)))
      (set member-if (lambda (x l) (nthcdr (position-if x l) l)))
      (set member-if-not (lambda (x l) (nthcdr (position-if-not x l) l)))
      (set find (lambda (x l) (nth (position x l) l)))
      (set find-if (lambda (x l) (nth (position-if x l) l)))
      (set find-if-not (lambda (x l) (nth (position-if-not x l) l)))
      )`)[0],env);
  for (let e of parsedScript) {
    let r=evalExpression(e,env);
    if (r===EXIT_SIGNAL) break;
    if (r.type=="error") throw Error("Script error.\n"+r.value);
  }
  let r=lookupVar(env,"&_");
  if (r.type=="error") throw Error("Script error.\n"+r.value);
  if (r.type!="string") throw Error("\"&_\" variable became a non-string value.");
  return r.value;
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
  const addHandleResize=(/** @type {HTMLElement} */e)=>
    (e.addEventListener("input",handleResize),handleResize.call(e));
  wordWrapControl.onchange=_=>{
    [...document.getElementsByClassName("word-wrap-target")].forEach(applyWordWrapState);
    /** @type {HTMLElement[]} */([...document.getElementsByClassName("resize-height-to-content")])
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
  /** @type {HTMLElement[]} */([...document.getElementsByClassName("resize-height-to-content")])
    .forEach(addHandleResize);
  new MutationObserver(mutations=>
      mutations.forEach(mutation=>
        mutation.addedNodes.forEach(node=>{
          if (node.nodeType!=Node.ELEMENT_NODE) return;
          const e=/** @type {HTMLElement} */(node);
          if (e.classList.contains("resize-height-to-content")) addHandleResize(e);
          /** @type {HTMLElement[]} */([...e.getElementsByClassName("resize-height-to-content")])
            .forEach(addHandleResize);
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
    /** @param {boolean} advanced  */
    function fillTitleAndSelect(advanced){
      const searchResult=searchFirstArticleWick(newItem.contentInput.value);
      if (!searchResult) return;
      let value=plainTitle(newItem.contentInput.value
        .substring(searchResult.articleTitle.start,searchResult.articleTitle.end));
      try{
        if (advanced) value=advancedExtraction(
          /** @type {HTMLTextAreaElement} */(document.getElementById("advanced-extraction-script")).value,value);
      }catch (e){
        alert(e);
      }
      newItem.keyInput.value=value;
      newItem.keyInput.setSelectionRange(0,value.length);
    }
    newItem.keyInput.onkeydown=e=>{
      if (e.key=="Enter"){
        const nextItem=
          /** @type {Item} */(e.shiftKey?newItem.previousElementSibling:newItem.nextElementSibling);
        (nextItem?.keyInput||(e.shiftKey?null:document.getElementById("alphabetize-button")))?.focus();
        e.preventDefault();
      }
      if (e.key==" "&&e.shiftKey&&!newItem.keyInput.value){
        fillTitleAndSelect(e.ctrlKey!=
          /** @type {HTMLInputElement} */(document.getElementById("reverse-advanced-extraction-control")).checked);
        e.preventDefault();
      }
    }
    newItem.keyInput.onfocus=_=>{
      if (/** @type {HTMLInputElement} */(document.getElementById("autofill-on-focus")).checked&&
          !newItem.keyInput.value)
        fillTitleAndSelect(
          /** @type {HTMLInputElement} */(document.getElementById("advanced-extraction-autofill")).checked);
    }
    newItem.keyInput.onblur=newItem.keyInput.onchange=_=>
      newItem.keyInput.value=plainTitle(newItem.keyInput.value).toLowerCase();
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
  const editAreaElement=/** @type {HTMLElement} */(document.getElementById("edit-area"));
  /** @type {HTMLInputElement} */(document.getElementById("loadinput-button")).onclick=_=>{
    if (prompt("This will overwrite the current content. Type \"yes\" to continue.")!="yes") return;
    [...editAreaElement.children].forEach(e=>e.remove());
    const input=/** @type {HTMLTextAreaElement} */(document.getElementById("input")).value;
    const regex=/^\* /gm;
    regex.lastIndex=1;
    let lastIndex=0;
    do{
      let index=regex.exec(input)?.index;
      let newItem=createItem();
      newItem.contentInput.value=input.substring(lastIndex,index==undefined?input.length:index-1);
      newItem.mergeButton.disabled=index===undefined;
      editAreaElement.appendChild(newItem);
      if (index==undefined) break;
      lastIndex=index;
    }while (true);
  };
  /** @type {HTMLButtonElement} */(document.getElementById("alphabetize-button")).onclick=_=>{
    const outputElement=
      /** @type {HTMLTextAreaElement} */(document.getElementById("output"));
    let items=/** @type {Item[]} */([...editAreaElement.children]);
    items.sort((a,b)=>
      a.keyInput.value==b.keyInput.value?0:a.keyInput.value<b.keyInput.value?-1:1);
    if (/** @type {HTMLInputElement} */(document.getElementById("warn-empty-key")).checked&&
        items[0]?.keyInput.value==="")
      alert("Some items is missing the sort key. They are sorted to the beginning.\n"+
        "This warning can be disabled.");
    outputElement.value=items.map(e=>e.contentInput.value).join("\n");
    handleResize.call(outputElement);
  }
  const advancedExtractionScriptTextarea=
    /** @type {HTMLTextAreaElement} */(document.getElementById("advanced-extraction-script"));
  const advancedExtractionDefaultScriptTextarea=
    /** @type {HTMLTextAreaElement} */(document.getElementById("advanced-extraction-default-script"));
  fetch("defaultAdvancedExtractionScript.txt")
    .then(res=>res.text())
    .then(s=>{
      advancedExtractionScriptTextarea.value||=s;
      handleResize.call(advancedExtractionScriptTextarea);
      advancedExtractionDefaultScriptTextarea.value=s;
      handleResize.call(advancedExtractionDefaultScriptTextarea);
    })
    .catch(e=>advancedExtractionDefaultScriptTextarea.value="Failed to get the default script...\n"+e);
  const modificationIndicator=
    /** @type {HTMLElement} */(document.getElementById("advanced-extraction-script-modified"));
  let savedScript=localStorage.getItem("advancedExtractionScript");
  if (savedScript!==null){
    advancedExtractionScriptTextarea.value=savedScript;
    handleResize.call(advancedExtractionScriptTextarea);
    modificationIndicator.style.display="";
  }else modificationIndicator.style.display="none";
  advancedExtractionScriptTextarea.onchange=_=>{
    if (advancedExtractionScriptTextarea.value!=advancedExtractionDefaultScriptTextarea.value){
      localStorage.setItem("advancedExtractionScript",advancedExtractionScriptTextarea.value);
      modificationIndicator.style.display="";
    }else{
      localStorage.removeItem("advancedExtractionScript");
      modificationIndicator.style.display="none";
    }
  };
  let markString=localStorage.getItem("advancedExtractionScriptMark");
  let /** @type {*} */markedCommit,/** @type {*} */markedFile;
  if (markString!==null){
    try{
      let mark=JSON.parse(markString);
      markedCommit=mark.commit;
      markedFile=mark.file;
      let commitLinkElement=/** @type {HTMLAnchorElement} */(document.getElementById("advanced-extraction-script-marked-commit-link"));
      commitLinkElement.textContent=markedCommit.sha.substring(0,6);
      commitLinkElement.href=markedCommit.html_url;
      let fileLinkElement=/** @type {HTMLAnchorElement} */(document.getElementById("advanced-extraction-script-marked-file-link"));
      fileLinkElement.textContent=markedFile.sha.substring(0,6);
      fileLinkElement.href=markedFile.html_url;
      /** @type {HTMLElement} */(document.getElementById("advanced-extraction-script-marked-unmarked")).style.display="none";
      /** @type {HTMLElement} */(document.getElementById("advanced-extraction-script-marked-marked")).style.display="";
    }catch (e){
      console.error(e);
    }
  }
  let /** @type {*} */latestCommit,/** @type {*} */latestFile;
  /** @type {HTMLButtonElement} */(document.getElementById("advanced-extraction-script-latest-retrieve-button")).onclick=async _=>{
    let commitRes=await fetch("https://api.github.com/repos/Naruyoko/tests/commits"+
      "?path=TVTropesAlphabetizer/defaultAdvancedExtractionScript.txt&per_page=1");
    let commitResData=await commitRes.json();
    latestCommit=commitResData[0];
    let commitLinkElement=/** @type {HTMLAnchorElement} */(document.getElementById("advanced-extraction-script-latest-commit-link"));
    commitLinkElement.textContent=latestCommit.sha.substring(0,6);
    commitLinkElement.href=latestCommit.html_url;
    let contentsRes=await fetch("https://api.github.com/repos/Naruyoko/tests/contents/"+
      "TVTropesAlphabetizer/defaultAdvancedExtractionScript.txt?ref="+latestCommit.sha);
    latestFile=await contentsRes.json();
    delete latestFile.content;
    let fileLinkElement=/** @type {HTMLAnchorElement} */(document.getElementById("advanced-extraction-script-latest-file-link"));
    fileLinkElement.textContent=latestFile.sha.substring(0,6);
    fileLinkElement.href=latestFile.html_url;
    /** @type {HTMLDivElement} */(document.getElementById("advanced-extraction-script-latest-section")).style.display="";
    if (markedCommit){
      let compareLinkElement=/** @type {HTMLAnchorElement} */(document.getElementById("advanced-extraction-script-compare-link"));
      compareLinkElement.href="https://github.com/Naruyoko/tests/compare/"+markedCommit.sha+"..."+latestCommit.sha;
      compareLinkElement.style.display="";
    }
    latestCommit.sha="470720c795013f84bc41699511907d7edc1cd2b4"
    console.log(latestCommit,latestFile);
  };
  /** @type {HTMLButtonElement} */(document.getElementById("advanced-extraction-script-mark-button")).onclick=_=>
    localStorage.setItem("advancedExtractionScriptMark",JSON.stringify({commit:latestCommit,file:latestFile}));
  window.onresize=_=>
    /** @type {HTMLElement[]} */([...document.getElementsByClassName("resize-height-to-content")])
      .forEach(e=>handleResize.call(e));
}