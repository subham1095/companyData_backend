const Joi = require("joi");
const { MESSAGES } = require("../../utils/constants");
const { commonResponse } = require("../../utils/responseHelper");
const options = {
  abortEarly: false, // include all errors
  allowUnknown: true, // ignore unknown props
  stripUnknown: true, // remove unknown props
};

module.exports.userLoginSchema = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().label("Email is required").required(),
    password: Joi.string().label("Password is required").required(),
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

module.exports.userRegisterSchema = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().label("Email is required").required(),
    name: Joi.string().label("Name is required").required(),
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

module.exports.userUpdateSchema = async (req, res, next) => {
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

module.exports.userForgotSchema = async (req, res, next) => {
  const schema = Joi.object({
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

module.exports.resetPasswordSchema = async (req, res, next) => {
  const schema = Joi.object({
    // token: Joi.string().label("token is required").required(),
    password: Joi.string().label("Password is required").required(),
    confirmPassword: Joi.any().equal(Joi.ref('password'))
    .required()
    .label('Password Does not match')
    .options({ messages: { 'any.only': '{{#label}} does not match'} })
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
