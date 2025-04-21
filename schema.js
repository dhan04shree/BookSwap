const Joi = require("joi");
module.exports.bookswapSchema = Joi.object({
    bookswap : Joi.object({
        fullname : Joi.string().required(),
        contact : Joi.string().required(),
        description : Joi.string().required(),
        originalP : Joi.string().required(),
        decidedP : Joi.string().required(),
        branch : Joi.string().required(),
        sem : Joi.string().required(),
        image : Joi.string().allow("",null),
    }).required(),
});
