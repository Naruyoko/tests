var r = 0n, a = 0n;
function P ( y, x)
   { return y - ~y << x;
}
function Z (x)
   { return r = x % 2n ? 0n : 1n + Z (x / 2n );}
function L ( x)
   { return x / 2n >> Z (x );}
function S (v, y, c,  t)
{
   var
      f = L ( t ),         
      x = r;
   { return
         f - 2n ?
         f > 2n ?
         f - v ? t - (f > v) * c : y :
         P ( f, P ( S (v, y, c,  L ( x)  ), 
                          S (v+2n, t  = S(4n,13n,-4n, y ),  c, Z (x) )))
         :
         A (S (v, y, c,  L ( x)  ), 
                S (v, y, c,  Z (x) ) );}
}
function A (y, x)
   { return L ( y) - 1n
      ? 5n << P ( y, x) 
      : S (4n, x, 4n, Z (r) );}
function D (x) 
{
  var
      f = 0n,
      d = 0n,
      c = 0n,
      t = 7n,
      u = 14n;
   while (x && D (x - 1n ),  (x /= 2n) % 2n && ( 1n))
      d = L ( L ( D (x) ) ),
         f = L ( r ),
         x = L ( r ),
         c - r || (
            L ( u) || L ( r) - f ||
            (x /= 2n) % 2n && ( u = S (4n, d, 4n, r ), 
                   t = A (t, d) ),
            f / 2n & (x /= 2n) % 2n && (  c = P ( d, c ), 
                              t  = S(4n,13n,-4n, t ), 
                              u  = S(4n,13n,-4n, u) )
             ),
         c && (x /= 2n) % 2n && (
            t = P (
               ~u & 2n | (x /= 2n) % 2n && (
                  u = 1n << P ( L ( c ),  u) ), 
               P ( L ( c ),  t) ),
            c = r  ),
         u / 2n & (x /= 2n) % 2n && ( 
            c = P ( t, c ), 
            u  = S(4n,13n,-4n, t ), 
            t = 9n );
   { return a = P ( P ( t, P ( u, P ( x, c)) ), 
                                a );}
}
function main ()
   { return D (D (D (D (D (99n)))) );}