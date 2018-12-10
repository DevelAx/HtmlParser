const path = require('path');

module.exports = function(appRootPath){
    global._require = function () {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(appRootPath);
        var path = path.join.apply(null, args);
        return require(path);
    }
}

