const validate = (schema) =>(req, res, next) =>{
  const {error} = schema.validate(req.body, {abortEarly: false, stripUnknown: true});

  if(error)
    return next(new ApiError(400, error.details.map((d) => d.message).json(', ')));
  next();
};

module.exports = validate;

// this is to validate joi schema from req body and passes only if valid