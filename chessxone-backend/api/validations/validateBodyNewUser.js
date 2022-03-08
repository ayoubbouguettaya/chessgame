const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});

const bodySchema = Joi.object({
    usePicture: Joi.boolean(),
    userName: Joi.string().min(8).max(15),
})

module.exports = validator.body(bodySchema);
