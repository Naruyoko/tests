/**
 *
 * @param {number[][]} A
 * @param {number[][]} B
 * @returns {number[][]}
 */
function matmul(A,B){
  if (A[0].length!=B.length) throw Error("Mismatched dimensions.");
  let R=Array.from({length:A.length},_=>Array(B[0].length).fill(0));
  for (let i=0;i<A.length;i++)
    for (let j=0;j<B[0].length;j++)
      for (let k=0;k<A[0].length;k++)
        R[i][j]+=A[i][k]*B[k][j];
  return R;
}
/**
 *
 * @param {number[]} xs
 * @param {number} degrees
 * @returns {number[][]}
 */
function polyreghatmat(xs,degrees){
  let X=xs.map(x=>Array.from({length:degrees+1},(_,i)=>x**i));
  let XT=mattranspose(X);
  return matinvmul(matmul(XT,X),XT);
}