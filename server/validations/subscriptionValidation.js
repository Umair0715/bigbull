const joi = require('joi');

const subscriptionValidation = joi.object().keys({
    packageId : joi.string().required().min(3) ,
    depositAmount : joi.number().required() ,
    paymentMethod : joi.number().required() ,
    packageFee : joi.number().optional() 
});

module.exports = subscriptionValidation;