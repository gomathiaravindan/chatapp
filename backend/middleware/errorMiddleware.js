const notFound = (req,res, next)=>{
    const error = new Error(`Not found - ${req.originalUrl}`);
    return res.status(404);
    next(error);
};

const errorHandler = (err, req,res, next)=>{
    const statusCode = res.statusCode === 2000 ? 5000 : res.statusCode;
    return res.status(statusCode).json({
            message: err.message,
            stack: process.env.NODE_ENV === 'production' ? null : err.stack,
        });
};


module.exports = { notFound, errorHandler }