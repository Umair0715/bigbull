const RoiWalletHistory = require('../models/roiWalletHistoryModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { sendSuccessResponse } = require('../utils/helpers');
const handlerFactory = require('./factories/handlerFactory');
const User = require("../models/userModel");

exports.getAllRoiWalletHistories = handlerFactory.getAll(RoiWalletHistory);

exports.getMyRoiWalletHistories = catchAsync(async(req , res , next) => {
    const page = req.query.page || 1 ;
    const sort = req.query.sort || -1;
    const pageSize = req.query.pageSize || 10 ;
    if(req.query.pageSize && req.query.pageSize > 25){
        return next(new AppError('pageSize should be less than or equal to 25' , 400))
    }
    let filter = {};
    if(req.query.date){
        const targetDate = new Date(req.query.date);
        const startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
        const endDate = new Date(startDate.valueOf() + 86400000);

        filter.createdAt = {
            $gte: startDate,
            $lt: endDate
        }
    }
    const docCount = await RoiWalletHistory.countDocuments({...filter , user : req.user._id });
    const docs = await RoiWalletHistory.find({...filter , user : req.user._id })
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .sort({ createdAt : sort })
    const pages = Math.ceil(docCount/pageSize);
    sendSuccessResponse(res , 200 , {
        docs , page , pages , docCount 
    })
})

exports.getSingleUserRoiWalletHistories = catchAsync(async(req , res , next) => {
    const page = req.query.page || 1 ;
    const sort = req.query.sort || -1;
    const pageSize = req.query.pageSize || 10 ;
    if(req.query.pageSize && req.query.pageSize > 25){
        return next(new AppError('pageSize should be less than or equal to 25' , 400))
    }
    let filter = {};
    if(req.query.date){
        const targetDate = new Date(req.query.date);
        const startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
        const endDate = new Date(startDate.valueOf() + 86400000);

        filter.createdAt = {
            $gte: startDate ,
            $lt: endDate
        }
    }
    const docCount = await RoiWalletHistory.countDocuments({...filter , user : req.params.id });
    const docs = await RoiWalletHistory.find({...filter , user : req.params.id })
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .sort({ createdAt : sort })
    const user = await User.findById(req.params.id)
    
    const pages = Math.ceil(docCount/pageSize);
    sendSuccessResponse(res , 200 , {
        docs , page , pages , docCount , user 
    })
})