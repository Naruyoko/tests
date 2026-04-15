/**
 * @param {number|bigint} n
 * @return {string}
 */
export function dec2bioct(n){
  return n.toString(16).split("").map(c=>"01234567cjzwfsbv"["0123456789abcdef".indexOf(c)]).join("");
}
/**
 * @param {string} s
 * @return {number}
 */
export function bioct2decNumber(s){
  let m=s.match(/^[+-]?([01234567cjzwfsbv]*)(?:\.([01234567cjzwfsbv]*))?/);
  if (!m) return NaN;
  let a=0,b=m[1].length,d=m[1]+(m[2]??"");
  if (!d) return NaN;
  for (let i=0;i<d.length&&a<2**58;i++){
    a=a*16+"01234567cjzwfsbv".indexOf(d[i]);
    b--;
  }
  return a*16**b*(s[0]=="-"?-1:1);
}
/**
 * @param {string} s
 * @return {bigint}
 */
export function bioct2decBigint(s){
  let m=s.match(/^[+-]?([01234567cjzwfsbv]*)/);
  if (!m||m[1]=="") throw Error(`Cannot convert ${s} to a BigInt`);
  let a=0n;
  for (let c of m[1]) a=a*16n+BigInt("01234567cjzwfsbv".indexOf(c));
  return a*(s[0]=="-"?-1n:1n);
}