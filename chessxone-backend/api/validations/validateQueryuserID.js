const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const validator = require('express-joi-validation').createValidator({});

const querySchema = Joi.object({
    userID: Joi.objectId()
})

module.exports = validator.params(querySchema);
