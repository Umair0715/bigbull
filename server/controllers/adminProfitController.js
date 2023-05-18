const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const AdminProfit = require('../models/adminProfitModel');
const { sendSuccessResponse } = require('../utils/helpers');


exports.setAdminProfit = catchAsync(async(req , res , next) => {
    const adminProfitExist = await AdminProfit.findOne();
    if(adminProfitExist){
        const updatedAdminProfit = await AdminProfit.findByIdAndUpdate(adminProfitExist._id , req.body , {
            new : true , 
            runValidators : true 
        });
        return sendSuccessResponse(res, 200 , {
            message : 'Profit updated successfully.' ,
            doc : updatedAdminProfit
        })
    }else {
        const adminProfit = await AdminProfit.create(req.body);
        return sendSuccessResponse(res , 201 , {
            message : 'Admin Profit created successfully.' , 
            doc : adminProfit
        })
    }
})