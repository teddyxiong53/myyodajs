'use strict'

module.exports.get = function get(object, path, defaults) {
    if (object === null) {
        return defaults
    }
    if (object && typeof object.hasOwnProperty === 'function' && object.hasOwnProperty(path)) {
        return object[path]
    }
    var ret
    if (typeof path !== 'string') {
        ret = object[path]
        if (ret === undefined) {
            return defaults
        }
        return ret
    }
    // 到这里了。说明path是string类型。
    var paths = path.split('.')
    ret = object(paths[0])
    for (var idx=1; idx < paths.length && ret != null; idx++) {
        ret = ret[paths[idx]]
    }
    if (ret === undefined) {
        return defaults
    }
    return ret
}
//从object里pick多个属性出来？
module.exports.pick = function pick(object) {
    if (object === null) {
        return null;
    }
    var ret = {}
    var keys = arguments[1]
    if (!Array.isArray(keys)) {
        keys = Array.prototype.slice.call(arguments, 1)
    }
    keys.forEach(key => {
        ret[key] = object[key]
    })
    return ret
}

module.exports.startsWith = function (str, search, pos) {
    if (typeof str !== 'string') {
        return false
    }
    return str.substring(!pos || pos < 0 ? 0: +pos, search.length) === search
}

module.exports.endsWith = function(str, search, length) {
    if (typeof str !== 'string') {
        return false
    }
    if (length === undefined || length > str.length) {
        length = str.length
    }
    return str.substring(length - search.length, length) === search
}

module.exports.camelCase = function (str) {

}

module.exports.sample = function(arr) {

}
module.exports.find = function(arr, predicate, thisArg) {
    
}
module.exports.times = function(number) {

}

module.exports.delay = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports.mapSeries = function (iterable, mapper) {

}

module.exports.once = function (callback) {
    var called = false
    var ret 
    return function dedupCallback() {
        if (!called) {
            called = true
            ret = callback.apply(this.arguments)
        }
        return ret
    }
}

module.exports.singleton = function(fn) {
    fn._locked = false
    var unlock = (res) => {
        fn._locked = false
    }
    return function singletonCallback() {
        if (fn._locked === true) {
            var err = new Error('this function is locked')
            err.code = 'FUNCTION_IS_LOCKED'
            return Promise.reject(err)
        }
        fn._locked = true
        var ret  = fn.apply(this, arguments)
        if (ret instanceof Promise) {
            ret.then(unlock, unlock)
        } else {
            throw new Error ('singleton only works on Promise object')
        }
        return ret
    }
}
module.exports.format = function (s) {
    
}
