const Joi = require("joi");
const validateClockTime = (clockTime) => {
  let schema = Joi.object().keys({
    clockType: Joi.string().valid(
        "clockIn",
        "clockOut",
        "breakBegin",
        "breakEnd"
      ),
    comment: Joi.string().allow(null, ''),
  });
  const validation = schema.validate(clockTime);
  return validation;
};

function validateUser(user) {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    hourRate: Joi.number().required(),
    occupation: Joi.string().required(),
  });

  const validation = schema.validate(user);
  return validation;
}

function validateAuth(user) {
  const schema = Joi.object().keys({
    pin: Joi.number().required(),
  });

  const validation = schema.validate(user);
  return validation;
}

module.exports = { validateClockTime, validateUser, validateAuth };
