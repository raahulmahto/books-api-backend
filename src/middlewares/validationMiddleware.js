const validate = (schema) =>(req, res, next) =>{
  const {error} = schema.validate(req.body);

  if(error){
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

module.exports = validate;

// this is to validate joi schema from req body and passes only if valid