/**
 * Created by Vlad on 2015-11-25.
 */

var promisify = function(fn) {//returns ES6 promise for parameter function
        var args = Array.prototype.slice.call(arguments);
        return new Promise(function(resolve, reject) {
            fn.apply(null, args.concat(function(err, data) {
                if (err) { return reject(err); }
                resolve(data);
            }));
        });
    },//?Usage: promisify(fs.readFile)(file, 'utf-8').then(function(data) {}).catch(function(err) {});
    unary = function(fn) { //allows a function parameter to execute with only first param passed to it and ignore others
        return function() {
            fn.apply(this, Array.prototype.slice.call(arguments, 0, 1));
        };
    },
    partial = function(fn) {
        var slice = Array.prototype.slice,
            args = slice.call(arguments, 1);
        return function() {
            var allArgs = args.concat(slice.call(arguments));
            return fn.apply(null, allArgs);
        };
    },
    curry = function(fn, args, length) {
        length = length || fn.length;
        return function() {
            var allArgs = (args || []).concat([].slice.call(arguments, 0, 1));
            return allArgs.length === length ? fn.apply(this, allArgs) : curry(fn, allArgs);
        };
    },
    autoCurry = function(fn, length) {
        return function() {
            return arguments.length > (length || fn.length) ? fn.apply(this, arguments) : curry(fn, [], length);
        };
    },
    compose = function() {
        var fns = Array.prototype.slice.call(arguments);
        return function() {
            var self = this;
            return fns.reverse().reduce(function(args, fn) {
                return [fn.apply(self, args)];
            }, fns[0]);
        };
    },
    prop = autoCurry(function(name, obj) {
        return obj[name];
    }),// usage: 1) direct: prop['id', obj); 2) curried: prop('id');
    map = curry(function(fn, value){
        return value.map(fn)
    }),//usage: 1) direct: map(x => x*x, arr); 2) curried: map(x => x*x);
    //Example: fetchFromServer()
    //.then(JSON.parse)
    //.then(prop('posts'))
    //.then(map(prop('title')))
    trace = curry(function(tag, x){
        console.log(tag, x);
        return x;
    }),//usage: var dasherize = compose(join('-'), toLower, trace("after split"), split(' '), replace(/\s{2,}/ig
        //dasherize('The world is a vampire');
        // after split [ 'The', 'world', 'is', 'a', 'vampire' ]
    sortBy = autoCurry(function(fn, collection) {
        var fa = fn(a),fb = fn(b);
        return collection.sort(function(a,b) { return fa < fa ? -1 : ( fa > fb  ? 1 : 0); });
    });

function Maybe(x) {
    if (!(this instanceof Maybe)) { return new Maybe(x); }
    this.value = x;
}
Maybe.prototype.map = function(fn) {
    return this.value == null ? this : new Maybe(fn(this.value));
};
Maybe.prototype.ap = function(vs) {
    return (typeof this.value !== 'function') ? new Maybe(null) : vs.map(this.value);
};
Maybe.of = function(x) {
    return new Maybe(x);
};

//Fullscreen mode
function toggleFullScreen() {
    if (!document.fullscreenElement &&    // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}

module.exports = {
    promisify: promisify
};