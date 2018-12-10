function ParserError(args){
    Error.call(this, args.message);
    this.message = args.message;
    this.name = ParserError.prototype.constructor.name;

    if (Error.captureStackTrace)
            Error.captureStackTrace(this, args.capture || this.constructor);
}

// Inherit from Error class.
ParserError.prototype = Object.create(Error.prototype);
ParserError.prototype.constructor = ParserError;

module.exports = ParserError;