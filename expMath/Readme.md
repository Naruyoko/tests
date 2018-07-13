# expMath.js
## Horribly built and low precision manually buildable non classed large number handler

You can use/modify/fork (totally not copied from other stuff) this.

To include this straight from this repository, copy this into your HTML file.
```html
<script src="https://naruyoko.github.io/tests/expMath/expMath.js"></script>
```

This is very primitive large number handler. The number is represented by an two element array.

Unlike MikeMcl's [Decimal.js](https://github.com/MikeMcl/decimal.js), Patashu's [break_infinity.js](https://github.com/Patashu/break_infinity.js) and more, this is stored as [log10 of the absolute value of the number, sign].

This is also prefix notation instead of infix. Even more strangely, this module contains very unusual functions.

## Functions in object exp:
* add(a,b) - addition
* sub(a,b) - subtraction
* mult(a,b) - multiplication
* div(a,b) - division
* pow(a,b) - exponentiation
* sqrt(a) - square root
* cbrt(a) - cube root
* root(a,b) - bth root of a
* log(a,b) - log base b of a
* fact(a) - factorial
* sfc1(a) - Neil J.A. Sloane and Simon Plouffe’s superfactorial
* sfc2(a) - Clifford A. Pickover’s superfactorial
* sfc3(a) - Daniel Corrêa’s superfactorial
* hfac(a) - hyperfactorial
* exfc(a) - exponential factorial
* tetr(a) - tetration
* slog(a,b) - superlogarithm base b of a
* conv(a) - convert normal decimals to expMath format
* text(a,m) - convert expMath format to scientific notation with the middle m

## Specific numbers
Max positive number - [1.7976931348623157E+308,false]=1e+(1.7976931348623157e+308)

Largest positive number with precision of at least 1 - ~[14.51,false]=3.235936569296281e+14

Min positive number - [5e-324,false]=1e+(5e-324)

+0 - [-Infinity,false]

-0 - [-Infinity,true]
