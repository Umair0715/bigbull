const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Setting = require('../models/settingsModel');
const { sendSuccessResponse } = require('../utils/helpers');

// will write it's perfect code soon
exports.createSettings = catchAsync(async(req , res , next) => {
    const settingsExist= await Setting.findOne();
    if(settingsExist){
        const updatedSettings =await Setting.findByIdAndUpdate(settingsExist._id , req.body , {
            new : true , 
            runValidators : true 
        });
        return sendSuccessResponse(res , 200 , { 
            message : 'Settings updated successfully.' ,
            doc : updatedSettings 
        })
    }
    const newSettings = await Setting.create(req.body);
    sendSuccessResponse(res , 201 , { 
        message : 'Settings created successfully.' ,
        doc : newSettings 
    });
});

exports.getSettings = catchAsync(async(req , res ) => {
    const settings = await Setting.findOne();
    sendSuccessResponse(res , 200 , { doc : settings })
})