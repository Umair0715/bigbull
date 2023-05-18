const BullTrackWalletHistory = require('../models/bullTrackWalletHistory');
const handlerFactory = require('./factories/handlerFactory');
const User = require("../models/userModel");
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { sendSuccessResponse } = require('../utils/helpers');

exports.getAllBullTrackWalletHistories = handlerFactory.getAll(BullTrackWalletHistory);
exports.getMyBullTrackWalletHistories = handlerFactory.getMy(BullTrackWalletHistory)


exports.getSingleUserBullTrackWalletHistories = catchAsync(async(req , res , next) => {
    const page = req.query.page || 1 ;
    const sort = req.query.sort || -1;
    const pageSize = req.query.pageSize || 10 ;
    if(req.query.pageSize && req.query.pageSize > 25){
        return next(new AppError('pageSize should be less than or equal to 25' , 400))
    }
    const docCount = await BullTrackWalletHistory.countDocuments({ user : req.params.id });
    const docs = await BullTrackWalletHistory.find({ user : req.params.id })
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .sort({ createdAt : sort })
    const user = await User.findById(req.params.id);
    const pages = Math.ceil(docCount/pageSize);
    sendSuccessResponse(res , 200 , {
        docs , page , pages , docCount , user 
    })
}); 