const joi = require('joi'); 

const userValidation = joi.object().keys({
    name : joi.string().required().min(3) ,
    username : joi.string().required().min(3) ,
    email : joi.string().email().required() ,
    phone : joi.string().required() ,
    gender : joi.string().required() ,
    address : joi.string().required() ,
    country : joi.string().required() ,
    password : joi.string().optional() , 
    referrer : joi.optional() ,       
});

module.exports = userValidation;