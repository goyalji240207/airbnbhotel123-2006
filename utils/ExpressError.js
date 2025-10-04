class ExpressError extends Error{
    constructor(statusCode,messsage){
        super();
        this.statusCode=statusCode;
        this.message=message;
    }
}

module.exports=ExpressError;