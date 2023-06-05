const joi = require('joi');

const packageValidation = joi.object().keys({
    name : joi.string().required().min(3) ,
    image : joi.string().required() ,
    levelOneProfit : joi.number().optional() ,
    levelTwoProfit : joi.number().optional() ,
    levelThreeProfit : joi.number().optional() ,
    levelFourProfit : joi.number().optional() ,
    levelFiveProfit : joi.number().optional() ,
    levelSixProfit : joi.number().optional() ,
    levelSevenProfit : joi.number().optional() ,

    sponserLevelOneProfit : joi.number().optional() ,
    sponserLevelTwoProfit : joi.number().optional() ,
    sponserLevelThreeProfit : joi.number().optional() ,
    sponserLevelFourProfit : joi.number().optional() ,
    sponserLevelFiveProfit : joi.number().optional() ,
    sponserLevelSixProfit : joi.number().optional() ,
    sponserLevelSevenProfit : joi.number().optional() ,

    bullTrackLevelOneProfit : joi.number().required() ,
    bullTrackLevelTwoProfit : joi.number().required() ,
    bullTrackLevelThreeProfit : joi.number().required() ,
    bullTrackLevelFourProfit : joi.number().required() ,
    bullTrackLevelFiveProfit : joi.number().required() ,
    bullTrackLevelSixProfit : joi.number().required() ,
    bullTrackLevelSevenProfit : joi.number().required() ,

    profitShare : joi.optional() ,
    maximumProfitLimit : joi.number().required() ,
    duration : joi.number().optional() ,
    monthlyProfit : joi.number().required() ,
    depositRange : joi.array().required() ,
    packageFee : joi.number().required() ,
    highProfitValue : joi.number().required() ,
    type : joi.optional()
});

module.exports = packageValidation;