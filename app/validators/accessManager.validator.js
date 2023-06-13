const Joi = require("joi");
const { MESSAGES } = require("../../utils/constants");
const { commonResponse } = require("../../utils/responseHelper");
const options = {
  abortEarly: false, // include all errors
  allowUnknown: true, // ignore unknown props
  stripUnknown: true, // remove unknown props
};

module.exports.grantAccessSchema = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().label("Name is required").required(),
    email: Joi.string().label("Email is required").required(),
  });

  // validate request body against schema
  const { error, value } = schema.validate(req.body, options);

  if (error) {
    let errors = {};
    error.details.forEach((err) => {
      errors[err.context.key] = err.context.label;
    });
    return res.status(400).json(commonResponse(false, MESSAGES.VALIDATION_ERROR, errors));
  } else {
    req.body = value;
    next();
  }
};

module.exports.changeApikeySchema = async (req, res, next) => {
  const schema = Joi.object({
    _id: Joi.string().label("Id is required").required(),
  });

  // validate request body against schema
  const { error, value } = schema.validate(req.body, options);

  if (error) {
    let errors = {};
    error.details.forEach((err) => {
      errors[err.context.key] = err.context.label;
    });
    return res.status(400).json(commonResponse(false, MESSAGES.VALIDATION_ERROR, errors));
  } else {
    req.body = value;
    next();
  }
};

module.exports.deactivateApikeySchema = async (req, res, next) => {
  const schema = Joi.object({
    _id: Joi.string().label("Id is required").required(),
    status: Joi.boolean().label("status is required").required(),
  });

  // validate request body against schema
  const { error, value } = schema.validate(req.body, options);

  if (error) {
    let errors = {};
    error.details.forEach((err) => {
      errors[err.context.key] = err.context.label;
    });
    return res.status(400).json(commonResponse(false, MESSAGES.VALIDATION_ERROR, errors));
  } else {
    req.body = value;
    next();
  }
};

module.exports.updateAccessManagerSchema = async (req, res, next) => {
  const schema = Joi.object({
    _id: Joi.string().label("Id is required").required(),
    name: Joi.string().label("Name is required").required(),
    email: Joi.string().label("Email is required").required(),
    status: Joi.boolean().label("Status is required").required(),
  });

  // validate request body against schema
  const { error, value } = schema.validate(req.body, options);

  if (error) {
    let errors = {};
    error.details.forEach((err) => {
      errors[err.context.key] = err.context.label;
    });
    return res.status(400).json(commonResponse(false, MESSAGES.VALIDATION_ERROR, errors));
  } else {
    req.body = value;
    next();
  }
};
