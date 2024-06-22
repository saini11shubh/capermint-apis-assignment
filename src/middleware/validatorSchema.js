const Joi = require('joi');
const mongoose = require("mongoose");
const objectIdValidator = (value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
    }
    return value;
};

exports.signupSchema = Joi.object({
    email_id: Joi.string().email().required(),
    name: Joi.string().required(),
    phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    password: Joi.string().min(6).required()
});

exports.loginSchema = Joi.object({
    email_id: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

exports.viewProfileSchema = Joi.object({
    email_id:Joi.string().email().required(),
    _id: Joi.string().required().custom(objectIdValidator, 'Mongoose ObjectId')
});
exports.updateProfileSchema = Joi.object({
    email_id:Joi.string().email(),
    _id: Joi.string().required().custom(objectIdValidator, 'Mongoose ObjectId'),
    phone: Joi.string().length(10).pattern(/^[0-9]+$/),
    password: Joi.string().min(6)
});