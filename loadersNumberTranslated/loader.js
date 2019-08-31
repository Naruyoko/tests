var r = 0, a = 0;
function P ( y, x)
   { return y - ~y << x;
}
function Z (x)
   { return r = x % 2 ? 0 : 1 + Z (Math.floor(x / 2 ));}
function L ( x)
   { return Math.floor(x / 2) >> Z (x );}
function S (v, y, c,  t)
{
   var
      f = L ( t ),         
      x = r;
   { return
         f - 2 ?
         f > 2 ?
         f - v ? t - (f > v) * c : y :
         P ( f, P ( S (v, y, c,  L ( x)  ), 
                          S (v+2, t  = S(4,13,-4, y ),  c, Z (x) )))
         :
         A (S (v, y, c,  L ( x)  ), 
                S (v, y, c,  Z (x) ) );}
}
function A (y, x)
   { return L ( y) - 1
      ? 5 << P ( y, x) 
      : S (4, x, 4, Z (r) );}
function D (x) 
{
  var
      f = 0,
      d = 0,
      c = 0,
      t = 7,
      u = 14;
   while (x && D (x - 1 ),  (x = Math.floor(x / 2)) % 2 && ( 1))
      d = L ( L ( D (x) ) ),
         f = L ( r ),
         x = L ( r ),
         c - r || (
            L ( u) || L ( r) - f ||
            (x = Math.floor(x / 2)) % 2 && ( u = S (4, d, 4, r ), 
                   t = A (t, d) ),
            Math.floor(f / 2) & (x = Math.floor(x / 2)) % 2 && (  c = P ( d, c ), 
                              t  = S(4,13,-4, t ), 
                              u  = S(4,13,-4, u) )
             ),
         c && (x = Math.floor(x / 2)) % 2 && (
            t = P (
               ~u & 2 | (x = Math.floor(x / 2)) % 2 && (
                  u = 1 << P ( L ( c ),  u) ), 
               P ( L ( c ),  t) ),
            c = r  ),
         Math.floor(u / 2) & (x = Math.floor(x / 2)) % 2 && ( 
            c = P ( t, c ), 
            u  = S(4,13,-4, t ), 
            t = 9 );
   { return a = P ( P ( t, P ( u, P ( x, c)) ), 
                                a );}
}
function main ()
   { return D (D (D (D (D (99)))) );}