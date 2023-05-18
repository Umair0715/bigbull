const joi = require('joi');

const kycValidation = joi.object().keys({
    CNICFrontImage : joi.string().required() ,
    CNICBackImage : joi.string().required() ,
    nomineeCNICFrontImage : joi.string().required() ,
    nomineeCNICBackImage : joi.string().required() ,
    walletAddress : joi.string().required()
});

module.exports = kycValidation;