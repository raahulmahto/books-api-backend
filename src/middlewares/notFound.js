
function notFound (req, res, next){
  res.status(404).json({
    status: false,
    message: 'Route not found', 
    path: req.originalUrl,
  });
}

module.exports = notFound;