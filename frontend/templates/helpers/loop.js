module.exports = function(count, options) {
    var out = "";

    while (count--) {
        out+= options.fn();
    }
    return out;
};