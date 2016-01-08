function curry2(fn) {
    return function(firstArg) { //#A
        return function(secondArg) { //#B
            return fn(firstArg, secondArg); //#C
        };
    };
}
var checkType = R.curry(function(typeDef, actualType) {
    if(R.is(typeDef, actualType)) {
        return actualType;
    }
    else {
        throw new TypeError('Type mismatch. Expected [' + typeDef + '] but found [' + typeof actualType + ']');
    }
});
var Tuple = function( /* types */ ) {
    var toArray = Array.prototype.slice,
        typeInfo = toArray.call(arguments, 0), //#A
        _T = function( /* values */ ) { //#B
            var values = toArray.call(arguments, 0); //#C
            if(values.some(function(val){ //#D
                    return val === null || val === undefined})) {
                throw new ReferenceError('Tuples may not have any null values');
            }
            if(values.length !== typeInfo.length) { //#E
                throw new TypeError('Tuple arity does not match its prototype');
            }
            values.map(function(val, index) { //#F
                this['_' + (index + 1)] = checkType(typeInfo[index])(val);
            }, this);
            Object.freeze(this); //#G
        };
    _T.prototype.toString = function() { //#H
        return '(' + Object.keys(this).map(function(k) {
                return this[k];
            }, this).join(', ') + ')';
    };
    return _T;
};

var Wrapper = function (val) {
    this.val = val;
};
// map :: (A -> B) -> A -> B
Wrapper.prototype.map = function(f){
    return f(this.val);
};
// wrap :: A -> Wrapper[A]
var wrap = (val) => new Wrapper(val);

var wrappedValue = wrap('get functional');
var ty = wrappedValue.map(_.capitalize);
// extract the value
console.log(ty); //-> 'Get Functional'


//var Status = Tuple(Boolean, String);
//// trim :: String -> String
//var trim = (str) => str.replace(/^\s*|\s*$/g, '');
//// normalize :: String -> String
//var clean = (str) => str.replace(/\-/g, '');
//// isValid :: String -> Status
//var isValid = function (str) {
//    if(str.length === 0){
//        return new Status(false, //#A
//            'Invald input. Expected non-empty value!');
//    }
//    else {
//        return new Status(true, 'Success!');
//    }
//}
//var ty = isValid(clean(trim('444-44-4444'))); //-> (true, 'Success!')
//var StringPair = Tuple(String, String);
//var name = new StringPair('Barkley', 'Rosser');
//name._1; //-> 'Barkley'
//name._2; //-> 'Rosser'
//var logger = new Log4js.getLogger("myCategory");
//logger.info('Student added successfully!');
var y =0;


var expandLegend = function() {
    var exp = chart.legend.expanded();
    chart.legend.expanded(!exp);
    chart.update();
}

var getSize = function(elem, dir) {
        return parseInt(d3.select(elem).style(dir), 10);
    },
    extendHeight = function(elem, parent) {
        var offset = 10;
        elem.style('height', parseInt(parent.style('height'), 10) - offset);
        return elem;
    };
// Wrapping in nv.addGraph allows for '0 timeout render', stores rendered charts in nv.graphs, and may do more in the future... it's NOT required
var chart, data;

nv.addGraph(function() {
    chart = nv.models.lineChart()
        .options({
            transitionDuration: 300,
            useInteractiveGuideline: true
        })
    ;
    // chart sub-models (ie. xAxis, yAxis, etc) when accessed directly, return themselves, not the parent chart, so need to chain separately
    chart.xAxis
        .axisLabel("Time (s)")
        .tickFormat(d3.format(',.1f'))
        .staggerLabels(true)
    ;
    chart.yAxis
        .axisLabel('Voltage (v)')
        .tickFormat(function(d) {
            if (d == null) {
                return 'N/A';
            }
            return d3.format(',.2f')(d);
        })
    ;
    data = sinAndCos();
    var cell = d3.select('#chart1'),
        svg = cell.select(' svg');
    extendHeight(svg, cell)
        .datum(data)
        .call(chart);
    nv.utils.windowResize(() => {extendHeight(svg, cell); chart.update();});
    return chart;
});
function sinAndCos() {
    var sin = [],
        sin2 = [],
        cos = [],
        rand = [],
        rand2 = []
        ;
    for (var i = 0; i < 100; i++) {
        sin.push({x: i, y: i % 10 == 5 ? null : Math.sin(i/10) }); //the nulls are to show how defined works
        sin2.push({x: i, y: Math.sin(i/5) * 0.4 - 0.25});
        cos.push({x: i, y: .5 * Math.cos(i/10)});
        rand.push({x:i, y: Math.random() / 10});
        rand2.push({x: i, y: Math.cos(i/10) + Math.random() / 10 })
    }
    return [
        {
            area: true,
            values: sin,
            key: "Sine Wave",
            color: "#ff7f0e",
            strokeWidth: 4,
            classed: 'dashed'
        },
        {
            values: cos,
            key: "Cosine Wave",
            color: "#2ca02c"
        },
        {
            values: rand,
            key: "Random Points",
            color: "#2222ff"
        },
        {
            values: rand2,
            key: "Random Cosine",
            color: "#667711",
            strokeWidth: 3.5
        },
        {
            area: true,
            values: sin2,
            key: "Fill opacity",
            color: "#EF9CFB",
            fillOpacity: .1
        }
    ];
}