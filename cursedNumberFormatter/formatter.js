//Selected from
// https://en.wikipedia.org/w/index.php?title=Non-numerical_words_for_quantities&oldid=1336543135
export const QUANTITIES=                                                                    new Map(
                          [/*-*/
                        [""             ,       1                                                 ],
                        ["pair"        ,        2                                                 ],
                        ["trio"       ,         3                                                 ],
                        ["quartet"   ,          4                                                 ],
                        ["dozen"     ,         12                                                 ],
                        ["score"      ,        20                                                 ],
                        ["ehab"        ,       25                                                 ],
                        ["threescore"   ,      60                                                 ],
                        ["small gross"  ,     120                                                 ],
                        ["gross"       ,      144                                                 ],
                        ["great gross",      1728                                                 ],
                        ["lakh"      ,     100000                                                 ],
                        ["crore"     ,   10000000                                                 ],
                        ["arab"       ,1000000000                                                 ],
                        ["kharab"      ,       10e+10                                             ],
                        ["nil"          ,    1000e+10                                             ],
                        ["padma"        ,  100000e+10                                             ],
                        ["shankh"      , 10000000e+10                                             ],
                        ["mole"       ,      6022.14078e+20                                       ],
                          /*-*/]                                                                  );
export const PREFIXES=                                                                      new Map(
                        [/*-*/
                      ["quecto",    ["q"        ,        1e-30                                   ]],
                      ["ronto"  ,   ["r"       ,      1000e-30                                   ]],
                      ["yocto"   ,  ["y"      ,    1000000e-30                                   ]],
                      ["zepto"    , ["z"     ,  1000000000e-30                                   ]],
                      ["atto"      ,["a"    ,          100e-20                                   ]],
                      ["femto" ,    ["f"        ,   100000e-20                                   ]],
                      ["pico"   ,   ["p"       , 100000000e-20                                   ]],
                      ["nano"    ,  ["n"      ,          0.000000001                             ]],
                      ["micro"    , ["\u03bc",           0.000001                                ]],
                      ["milli"     ,["m"    ,            0.001                                   ]],
                      ["centi" ,    ["c"        ,        0.01                                    ]],
                      ["deci"   ,   ["d"       ,         0.1                                     ]],
                      [""        ,  [""       ,          1                                       ]],
                      ["deca"     , ["da"    ,          10                                       ]],
                      ["hecto"     ,["h"    ,          100                                       ]],
                      ["kilo"  ,    ["k"        ,     1000                                       ]],
                      ["mega"   ,   ["M"       ,   1000000                                       ]],
                      ["giga"    ,  ["G"      , 1000000000                                       ]],
                      ["tera"     , ["T"     ,         100e+10                                   ]],
                      ["peta"      ,["P"    ,       100000e+10                                   ]],
                      ["exa"   ,    ["E"        ,100000000e+10                                   ]],
                      ["zetta"  ,   ["Z"       ,        10e+20                                   ]],
                      ["yotta"   ,  ["Y"      ,      10000e+20                                   ]],
                      ["ronna"    , ["R"     ,    10000000e+20                                   ]],
                      ["quetta"    ,["Q"    ,            1e+30                                   ]],
                        /*-*/]                                                                    );
//Selected from:
// https://en.wikipedia.org/w/index.php?title=List_of_conversion_factors&oldid=1329686422
// https://en.wikipedia.org/w/index.php?title=Japanese_units_of_measurement&oldid=1348030386
export const UNITS=                                                                         new Map(
                      [/*-*/
                    [                             "length",                                 new Map(
                  /*|*/   [/*-*/
                  /*|*/ ["angstrom",         ["\u00c5",10000000000e-20                           ]],
                  /*|*/ ["mo",               ["\u6bdb",          0.00003030+30e-8/99             ]],
                  /*|*/ ["rin",              ["\u5398",          0.0003030+30e-7/99              ]],
                  /*|*/ ["link",             ["ln",              0.00211+6e-5/9                  ]],
                  /*|*/ ["bu",               ["\u5206",          0.003030+30e-6/99               ]],
                  /*|*/ ["inch",             ["in",              0.0254                          ]],
                  /*|*/ ["sun",              ["\u5bf8",          0.03030+30e-5/99                ]],
                  /*|*/ ["palm",             ["palm",            0.0762                          ]],
                  /*|*/ ["hand",             ["hand",            0.1016                          ]],
                  /*|*/ ["quarter",          ["quarter",         0.2286                          ]],
                  /*|*/ ["shaku",            ["\u5c3a",          0.3030+30e-4/99                 ]],
                  /*|*/ ["foot",             ["ft",              0.3048                          ]],
                  /*|*/ ["metric foot",      ["mf",              0.3                             ]],
                  /*|*/ ["french",           ["F",               0.333+3e-3/9                    ]],
                  /*|*/ ["pace",             ["pace",            0.762                           ]],
                  /*|*/ ["yard",             ["yd",              0.9144                          ]],
                  /*|*/ ["1metre",           ["m",               1                               ]],
                  /*|*/ ["twip",             ["twp",             1.753+8e-3/9                    ]],
                  /*|*/ ["ken",              ["\u9593",          1.818+18e-3/99                  ]],
                  /*|*/ ["fathom",           ["ftm",             1.8288                          ]],
                  /*|*/ ["jo",               ["\u4e08",          3.030+30e-3/99                  ]],
                  /*|*/ ["rod",              ["rod",             5.0292                          ]],
                  /*|*/ ["rope",             ["rope",            6.096                           ]],
                  /*|*/ ["cho",              ["\u753a",        109.0+90e-1/99                    ]],
                  /*|*/ ["ri",               ["\u91cc",       3927+27e-0/99                      ]],
                  /*|*/ ["furlong",          ["fur",           201.168                           ]],
                  /*|*/ ["mile",             ["mi",           1609.334                           ]],
                  /*|*/ ["nautical mile",    ["nmi",          1852                               ]],
                  /*|*/ ["astronomical unit",["au",             14.95978707e+10                  ]],
                  /*|*/ ["1light-year",      ["ly",         946073.04725808e+10                  ]],
                  /*|*/ ["1parsec",          ["pc",        3085677.5814671916e+10                ]],
                  /*|*/   /*-*/]                                                                 )],
                    [                             "area",                                   new Map(
                  /*|*/   [/*-*/
                  /*|*/ ["shed",             ["shed",         100000000e-60                      ]],
                  /*|*/ ["barn",             ["b",                  100e-30                      ]],
                  /*|*/ ["square inch",      ["sq in",                0.00064516                 ]],
                  /*|*/ ["board",            ["bd",                   0.00774192                 ]],
                  /*|*/ ["shaku",            ["\u52fa",               0.0330578512396694215      ]],
                  /*|*/ ["go",               ["\u5408",               0.330578512396694215       ]],
                  /*|*/ ["square foot",      ["sq ft",                0.09290304                 ]],
                  /*|*/ ["square yard",      ["sq yd",                0.83612736                 ]],
                  /*|*/ ["square 2metre",    ["m\u00b2",              1                          ]],
                  /*|*/ ["cord",             ["cord",                 1.48644864                 ]],
                  /*|*/ ["jo",               ["\u5e16",               1.65289256198347107        ]],
                  /*|*/ ["tsubo",            ["\u576a",               3.30578512396694215        ]],
                  /*|*/ ["square rod",       ["sq rd",               25.29285264                 ]],
                  /*|*/ ["se",               ["\u755d",              99.1735537190082645         ]],
                  /*|*/ ["are",              ["a",                  100                          ]],
                  /*|*/ ["square chain",     ["sq ch",              404.68564224                 ]],
                  /*|*/ ["tan",              ["\u53cd",             991.735537190082645          ]],
                  /*|*/ ["dunam",            ["dunam",             1000                          ]],
                  /*|*/ ["rood",             ["ro",                1011.7141056                  ]],
                  /*|*/ ["acre",             ["ac",                4046.8564224                  ]],
                  /*|*/ ["cho",              ["\u753a",            9917.35537190082645           ]],
                  /*|*/ ["hectare",          ["ha",               10000                          ]],
                  /*|*/ ["square mile",      ["sq mi",          2589988.110336                   ]],
                  /*|*/ ["barony",           ["barony",        16187425.6896                     ]],
                  /*|*/   /*-*/]                                                                 )],
                    [                             "volume",                                 new Map(
                  /*|*/   [/*-*/
                  /*|*/ ["teaspoon",        ["tsp",              0.000005                        ]],
                  /*|*/ ["tablespoon",      ["tbsp",             0.000015                        ]],
                  /*|*/ ["cubic inch",      ["cu in",            0.000016387064                  ]],
                  /*|*/ ["pony",            ["pony",             0.000022180147171875            ]],
                  /*|*/ ["fifth",           ["fifth",            0.0007570823568                 ]],
                  /*|*/ ["1litre",          ["l",                0.001                           ]],
                  /*|*/ ["sai",             ["\u624d",           0.00180390683696468820          ]],
                  /*|*/ ["decalitre",       ["Dl",               0.01                            ]],
                  /*|*/ ["shaku",           ["\u52fa",           0.0180390683696468820           ]],
                  /*|*/ ["cubic foot",      ["cu ft",            0.028316846592                  ]],
                  /*|*/ ["firkin",          ["firkin",           0.0409148168                    ]],
                  /*|*/ ["hectolitre",      ["hl",               0.1                             ]],
                  /*|*/ ["blue-barrel",     ["bbl",              0.158987294928                  ]],
                  /*|*/ ["go",              ["\u5408",           0.180390683696468820            ]],
                  /*|*/ ["pail",            ["pail",             0.29094976                      ]],
                  /*|*/ ["cord-foot",       ["cord-foot",        0.453069545472                  ]],
                  /*|*/ ["perch",           ["per",              0.700841953152                  ]],
                  /*|*/ ["cubic yard",      ["cu yd",            0.764554857984                  ]],
                  /*|*/ ["tun",             ["tun",              0.953923769568                  ]],
                  /*|*/ ["cubic 3metre",    ["m\u00b3",          1                               ]],
                  /*|*/ ["load",            ["load",             1.4158423296                    ]],
                  /*|*/ ["sho",             ["\u5347",           1.80390683696468820             ]],
                  /*|*/ ["board-foot",      ["bdft",             2.359737216                     ]],
                  /*|*/ ["cubic fathom",    ["cu fm",            6.116438863872                  ]],
                  /*|*/ ["to",              ["\u6597",          18.0390683696468820              ]],
                  /*|*/ ["acre-inch",       ["ac in",          102.79015312896                   ]],
                  /*|*/ ["koku",            ["\u77f3",         180.390683696468820               ]],
                  /*|*/ ["acre-foot",       ["ac ft",         1233.48183754752                   ]],
                  /*|*/ ["cubic mile",      ["cu mi",   4168181825.440579584                     ]],
                  /*|*/   /*-*/]                                                                 )],
                    [                             "mass",                                   new Map(
                  /*|*/   [/*-*/
                  /*|*/ ["1electron mass-equivalent",["eV/c\u00b2",17826.6184e-40                ]],
                  /*|*/ ["atomic mass unit",         ["u",          1660.53906892e-30            ]],
                  /*|*/ ["point",                    ["point",         0.000002                  ]],
                  /*|*/ ["mo",                       ["\u6bdb",        0.00000375                ]],
                  /*|*/ ["rin",                      ["\u5398",        0.0000375                 ]],
                  /*|*/ ["grain",                    ["gr",            0.00006479891             ]],
                  /*|*/ ["metric carat",             ["ct",            0.0002                    ]],
                  /*|*/ ["carat",                    ["kt",            0.000205196538+3e-12/9    ]],
                  /*|*/ ["fun",                      ["\u5206",        0.000375                  ]],
                  /*|*/ ["sheet",                    ["sheet",         0.0006479891              ]],
                  /*|*/ ["1gram",                    ["g",             0.001                     ]],
                  /*|*/ ["scruple",                  ["s ap",          0.0012959782              ]],
                  /*|*/ ["pennyweight",              ["dwt",           0.00155517384             ]],
                  /*|*/ ["avoirdupois dram",         ["dr av",         0.0017718451953125        ]],
                  /*|*/ ["momme",                    ["\u5301",        0.00375                   ]],
                  /*|*/ ["troy dram",                ["dr t",          0.0038879346              ]],
                  /*|*/ ["ounce",                    ["oz",            0.028                     ]],
                  /*|*/ ["avoirdupois ounce",        ["oz av",         0.028349523125            ]],
                  /*|*/ ["troy ounce",               ["oz t",          0.0311034768              ]],
                  /*|*/ ["troy pound",               ["lb t",          0.3732417216              ]],
                  /*|*/ ["hyakume",                  ["\u767e\u76ee",  0.375                     ]],
                  /*|*/ ["avoirdupois pound",        ["lb av",         0.45359237                ]],
                  /*|*/ ["kin",                      ["\u65a4",        0.6                       ]],
                  /*|*/ ["kan",                      ["\u8cab",        3.75                      ]],
                  /*|*/ ["stone",                    ["stone",         6.35029318                ]],
                  /*|*/ ["hyl",                      ["hyl",           9.80665                   ]],
                  /*|*/ ["maru",                     ["\u4e38",       30                         ]],
                  /*|*/ ["short hundredweight",      ["sh cwt",       45.359237                  ]],
                  /*|*/ ["long hundredweight",       ["long cwt",     50.80234544                ]],
                  /*|*/ ["coffee bag",               ["coffee bag",   60                         ]],
                  /*|*/ ["mark",                     ["mark",        248.8278144                 ]],
                  /*|*/ ["kip",                      ["kip",         453.59237                   ]],
                  /*|*/ ["short ton",                ["sh tn",       907.18474                   ]],
                  /*|*/ ["1tonne",                   ["t",          1000                         ]],
                  /*|*/ ["long ton",                 ["long tn",    1016.0469088                 ]],
                  /*|*/   /*-*/]                                                                 )],
                    [                             "time",                                   new Map(
                  /*|*/   [/*-*/
                  /*|*/ ["planck time",        ["t\u209a",   5391160e-50                         ]],
                  /*|*/ ["atomic unit of time",["a.u.",         2418.884254e-20                  ]],
                  /*|*/ ["svedberg",           ["S",        10000000e-20                         ]],
                  /*|*/ ["shake",              ["shake",           0.00000001                    ]],
                  /*|*/ ["helek",              ["helek",           0.333+3e-3/9                  ]],
                  /*|*/ ["1second",            ["s",               1                             ]],
                  /*|*/ ["moment",             ["moment",         90                             ]],
                  /*|*/ ["1hour",              ["h",            3600                             ]],
                  /*|*/ ["1day",               ["d",           86400                             ]],
                  /*|*/ ["1week",              ["wk",         604800                             ]],
                  /*|*/ ["fortnight",          ["fn",        1209600                             ]],
                  /*|*/ ["year",               ["a",        31536000                             ]],
                  /*|*/ ["deade",              ["dec",     315569520                             ]],
                  /*|*/ ["century",            ["c",      3155695200                             ]],
                  /*|*/ ["millennium",         ["millennium",      3.1556952e+10                 ]],
                  /*|*/   /*-*/]                                                                 )],
                    [                             "speed",                                  new Map(
                  /*|*/   [/*-*/
                  /*|*/ ["inch per hour",    ["iph",      0.00000705+5e-8/9                      ]],
                  /*|*/ ["foot per hour",    ["fph",      0.0000846+6e-7/9                       ]],
                  /*|*/ ["1metre per hour",  ["m/h",      0.000277+7e-6/9                        ]],
                  /*|*/ ["inch per minute",  ["ipm",      0.000423+3e-6/9                        ]],
                  /*|*/ ["foot per minute",  ["fpm",      0.00508                                ]],
                  /*|*/ ["1metre per minute",["m/m",      0.0166+6e-4/9                          ]],
                  /*|*/ ["inch per second",  ["ips",      0.0254                                 ]],
                  /*|*/ ["foot per second",  ["fps",      0.3048                                 ]],
                  /*|*/ ["mile per hour",    ["mph",      0.44704                                ]],
                  /*|*/ ["knot",             ["kn",       0.514+4e-3/4                           ]],
                  /*|*/ ["1metre per second",["m/s",      1                                      ]],
                  /*|*/ ["mile per minute",  ["mpm",     26.8224                                 ]],
                  /*|*/ ["mile per second",  ["mps",   1609.344                                  ]],
                  /*|*/ ["speed of light",   ["c",299792458                                      ]],
                  /*|*/   /*-*/]                                                                 )],
                    [                             "pressure",                               new Map(
                  /*|*/   [/*-*/
                  /*|*/ ["barye",                               ["barye",             0.1        ]],
                  /*|*/ ["pascal",                              ["Pa",                1          ]],
                  /*|*/ ["poundal per square foot",             ["pdl/sq ft",         1.488164   ]],
                  /*|*/ ["pound per square foot",               ["psf",              47.88026    ]],
                  /*|*/ ["torr",                                ["torr",            133.3224     ]],
                  /*|*/ ["pieze",                               ["pz",             1000          ]],
                  /*|*/ ["inch of mercury",                     ["inHg",           3386.389      ]],
                  /*|*/ ["pound per square inch",               ["psi",            6894.757      ]],
                  /*|*/ ["foot of mercury",                     ["ftHg",          40636.66       ]],
                  /*|*/ ["technical atmosphere",                ["at",            98066.5        ]],
                  /*|*/ ["1metre of mercury",                   ["mHg",          133322          ]],
                  /*|*/ ["1bar",                                ["bar",          100000          ]],
                  /*|*/ ["standard atmosphere",                 ["atm",          101325          ]],
                  /*|*/ ["kip per square inch",                 ["ksi",         6894757          ]],
                  /*|*/ ["kilogram-force per square millimetre",["kgf/mm\u00b2",9806650]],
                  /*|*/   /*-*/]                                                                 )],
                    [                             "energy",                                 new Map(
                  /*|*/   [/*-*/
                  /*|*/ ["electronvolt",                  ["eV",            16.02176634e-20      ]],
                  /*|*/ ["Rydberg",                       ["Ry",           217.98723611030e-20   ]],
                  /*|*/ ["hartree",                       ["E\u2095",      435.97447222060e-20   ]],
                  /*|*/ ["erg",                           ["erg",            0.0000001           ]],
                  /*|*/ ["foot-poundal",                  ["ft pdl",         0.0421401100938048  ]],
                  /*|*/ ["cubic centimetre of atmosphere",["cc atm",         0.101325            ]],
                  /*|*/ ["inch-pound force",              ["im lbf",         0.1129848290276167  ]],
                  /*|*/ ["1joule",                        ["J",              1                   ]],
                  /*|*/ ["foot-pound force",              ["ft lbf",         1.3558179483314004  ]],
                  /*|*/ ["1calorie",                      ["cal",            4.1868              ]],
                  /*|*/ ["cubic foot of atmosphere",      ["cu ft atm",   2869.2044809344        ]],
                  /*|*/ ["1watt-hour",                    ["W\u22c5h",    3600                   ]],
                  /*|*/ ["cubic yard of atmosphere",      ["cu yd atm",  77468.5209852288        ]],
                  /*|*/ ["horsepower-hour",               ["hp\u22c5h",2684519.537696172792      ]],
                  /*|*/ ["thermie",                       ["th",       4186800                   ]],
                  /*|*/ ["1ton of TNT",                   ["tTNT",  4186800000                   ]],
                  /*|*/ ["1ton of coal equivalent",       ["TCE",  29288000000                   ]],
                  /*|*/ ["1ton of oil equivalent",        ["toe",  41868000000                   ]],
                  /*|*/ ["foe",                           ["foe",      1000000e+40               ]],
                  /*|*/   /*-*/]                                                                 )],
                      /*-*/]                                                                      );
export function makeUnitComposer(prefixes,units)                                                   {
  let expandedUnits=[]                                                                             ;
  let scrubbedUnits=[]                                                                             ;
  for (let [type,list] of units.entries())                                                         {
    let expandedList=[]                                                                            ;
    let scrubbedList=[]                                                                            ;
    for (let [code,[symbol,value]] of list.entries())                                              {
      if (/\d/.test(code))                                                                         {
        let power=+code.match(/\d/)[0]                                                             ;
        for (let [prefix,[symbolprefix,factor]] of prefixes.entries())
          expandedList.push([code.replace(/\d/,prefix),symbolprefix+symbol,value*factor**power])  ;}
      scrubbedList.push([code.replace(/\d/,""),symbol,value])                                     ;}
    expandedUnits.push(expandedList)                                                               ;
    scrubbedUnits.push(scrubbedList)                                                               ;
  }
  return function (random)                                                                         {
    let listIndex=Math.floor(random()*(expandedUnits.length+1)%(expandedUnits.length+1))                       ;
    if (listIndex==expandedUnits.length) return ["","",1]                                          ;
    let expandedList=expandedUnits[listIndex]                                                      ;
    let numerator=expandedList[Math.floor(random()*expandedList.length%expandedList.length)]                   ;
    let scrubbedList=scrubbedUnits[listIndex]                                                      ;
    let denominator=scrubbedList[Math.floor(random()*scrubbedList.length%scrubbedList.length)]                 ;
    return   [  numerator[0]+" per "+denominator[0]/*|*/                                           ,
           /*|*/numerator[1]+  ":"  +denominator[1]/*|*/                                           ,
           /*|*/numerator[2]    /    denominator[2]  ]                                          ;};}
export function generateUnitList(prefixes,units,config,random)                                     {
  let unitComposer=makeUnitComposer(prefixes,units)                                                ;
  config=Object.assign({  minUnits       :  5                                                      ,
                          maxUnits       : 20                                                      ,
                          exclusionRadius: 10                                                      ,
                          maxTries       :100                                                     },
                        config                                                                    );
                                          function                               split(au,tsutaya) {
                                          let                                             iPhone=0 ;
                                          while (iPhone<au.length&&au[iPhone][2]<tsutaya) iPhone++ ;
                                          return            [au.slice(0,iPhone),au.slice(iPhone)] ;}
              function putUnit(unit,insertIndex)                                                   {
                let stolenBelow=[]                                                                 ;
                if (insertIndex>0)
                  [ table[insertIndex-1][2]                                                        ,
                    stolenBelow            ]=split( table[insertIndex-1][2]                        ,
                                                    Math.sqrt(unit[2]*table[insertIndex-1][0][2])) ;
                let stolenAbove=[]                                                                 ;
                if (insertIndex<table.length)
                  [ stolenAbove                                                                    ,
                    table[insertIndex][1]]=split( table[insertIndex][1]                            ,
                                                  Math.sqrt(unit[2]*table[insertIndex][0][2]))     ;
                table.splice(insertIndex,0,[unit,stolenBelow,stolenAbove])                        ;}
  let table=[]                                                                                     ;
  for (let trial=0;trial<config.maxTries&&table.length<config.maxUnits;trial++)                    {
    let unit=unitComposer(random)                                                                  ;
    let insertIndex=0                                                                              ;
                  while (insertIndex<table.length&&table[insertIndex][0][2]<unit[2])
    insertIndex++                                                                                  ;
    let belowDistance=unit[2]/(table[insertIndex-1]?.[0][2]??0)                                    ,
        aboveDistance=        (table[insertIndex  ]?.[0][2]??Infinity)/unit[2]                     ;
            if (belowDistance>=config.exclusionRadius&&aboveDistance>=config.exclusionRadius)
    putUnit(unit,insertIndex)                                                                      ;
    else if (belowDistance<aboveDistance){
      let subinsertIndex=0;
                        while ( subinsertIndex<table[insertIndex-1]?.[2].length
                              &&unit[2]>=table[insertIndex-1][2][subinsertIndex][2]                )
      subinsertIndex++                                                                             ;
      table[insertIndex-1][2].splice(subinsertIndex,0,unit)                                       ;}
    else                                                                                           {
      let subinsertIndex=0                                                                         ;
                        while ( subinsertIndex<table[insertIndex]?.[1].length
                              &&unit[2]>=table[insertIndex][1][subinsertIndex][2]                  )
      subinsertIndex++                                                                             ;
      table[insertIndex][1].splice(subinsertIndex,0,unit)                                        ;}}
  while (table.length<config.minUnits)                                                             {
    let lowerBestIndex   =-1                                                                       ,
        upperBestIndex   =-1                                                                       ,
        lowerBestDistance= 0                                                                       ,
        upperBestDistance= 0                                                                       ;
    for (let [index,[unit,lower,upper]] of table.entries())                                        {
      let lowerDistance=unit[2]/lower[0]?.[2]                                                      ;
      if (lowerDistance>lowerBestDistance)                                                         {
        lowerBestIndex=index                                                                       ;
        lowerBestDistance=lowerDistance                                                           ;}
      let upperDistance=upper[upper.length-1]?.[2]/unit[2];
      if (upperDistance>upperBestDistance)                                                         {
        upperBestIndex=index                                                                       ;
        upperBestDistance=upperDistance                                                          ;}}
          if (lowerBestIndex==-1&&upperBestIndex==-1)
    break                                                                                          ;
            if (lowerBestDistance>upperBestDistance)
    putUnit(table[lowerBestIndex][1].shift(),lowerBestIndex)                                       ;
            else
    putUnit(table[upperBestIndex][2].pop(),upperBestIndex+1)                                      ;}
  return table.map(e=>e[0])                                                                       ;}
export function makeFormatter(quantities,prefixes,units,config,random)                             {
  quantities??=QUANTITIES                                                                          ;
  prefixes  ??=PREFIXES                                                                            ;
  units     ??=UNITS                                                                               ;
  config    ??={}                                                                                  ;
  random??=Math.random                                                                             ;
  let madeUnits=generateUnitList(prefixes,units,config,random)                                     ;
  let quantityList=[...quantities.entries()].sort((a,b)=>a[1]-b[1])                                ;
  return ["toString","toFixed","toPrecision","toExponential"].reduce((a,e)=>(
    a[e]=function (x,y)                                                                            {
      let absx=Math.abs(x)                                                                         ;
      let unitIndex=0                                                                              ;
                  while (madeUnits[unitIndex+1]?.[2]<absx)
      unitIndex++                                                                                  ;
      let unit=madeUnits[unitIndex]                                                                ;
      let amount=absx/unit[2]                                                                      ;
      let quantityIndex=0                                                                          ;
                      while (quantityList[quantityIndex+1]?.[1]<amount)
      quantityIndex++                                                                              ;
      let quantity=quantityList[quantityIndex]                                                     ;
      return (Math.sign(x)*amount/quantity[1])[e](y)+(quantity[0]&&` ${quantity[0]} `)+unit[1]   ;},
    a                                                                                        ),{});}
export function makeFormatterDefault()                                                             {
                                        return makeFormatter()                                    ;}