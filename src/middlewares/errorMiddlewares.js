const ApiError = require('../utils/ApiError')
const config = require('../config');
const logger = require('../utils/logger');

function errorHandler(err, req, res, next){

  //if error is not an instance of apierror, will convert it 
 // console.error("Error:", err.message);

 let error = err;
 if(!(err instanceof ApiError)){
    const statusCode = err.statusCode || 500;
    error = new ApiError(statusCode, err.message || 'internal server error', false, err.stack);
 }

 const response = {
  success: false,
  message: error.message,
 };

 if(config.env ==='development'){
  response.stack = error.stack;
 }
 logger.error('Error: %o', { statusCode: error.statusCode, message: error.message, stack: error.stack });
 res.status(error.statusCode).json(response);

  /*
  const status = err.status || "error";

  //return res.status changed 
  return res.status(statusCode).json({
    success: false, 
    message: err.message || "Internal server found",
  }); */
}

module.exports = errorHandler;

//updated after pagination filtering and sorting