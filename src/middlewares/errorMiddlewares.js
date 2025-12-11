function errorHandler(err, req, res, next){
  console.error("Error:", err.message);

  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  //return res.status changed 
  return res.status(statusCode).json({
    success: false, 
    message: err.message || "Internal server found",
  });
}

module.exports = errorHandler;

//updated after pagination filtering and sorting