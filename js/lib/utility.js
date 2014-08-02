var valueExists = function(v) {
    return (!!(typeof v !== 'undefined' && v !== null));
};

var isFunction = function(fn) {
    return (!!(typeof fn !== 'undefined' && fn !== null && typeof fn === 'function'));
};