const Joi = require("joi");

const authSchema = Joi.object({
  // username: Joi.string().required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(2).required(),
});

module.exports = {
  authSchema,
};
