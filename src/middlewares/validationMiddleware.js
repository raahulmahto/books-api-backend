const ApiError = require("../utils/ApiError");

const validate = (schema) => {
  return (req, res, next) => {
    const options = {
      abortEarly: false,       // show all validation errors
      allowUnknown: false,     // block unknown keys completely
      stripUnknown: true,      // sanitize request body
    };

    const { error, value } = schema.validate(req.body, options);

    if (error) {
      const messages = error.details.map((d) => d.message).join(", ");
      return next(new ApiError(400, messages));
    }

    req.body = value;
    next();
  };
};

module.exports = validate;
