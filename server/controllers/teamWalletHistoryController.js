const TeamWalletHistory = require('../models/teamWalletHistoryModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { sendSuccessResponse } = require('../utils/helpers');
const handlerFactory = require('./factories/handlerFactory');
const User = require('../models/userModel')

exports.getAllTeamWalletHistories = handlerFactory.getAll(TeamWalletHistory);


exports.getMyTeamWalletHistories = catchAsync(async(req , res , next) => {
    const page = Number(req.query.page) || 1 ;
    const sort = req.query.sort || -1;
    const pageSize = req.query.pageSize || 10;
    if(req.query.pageSize && req.query.pageSize > 25){
        return next(new AppError('pageSize should be less than or equal to 25' , 400));
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
    if(req.query.teamLevel){
        filter.teamLevel = parseInt(req.query.teamLevel)
    }
    const docCount = await TeamWalletHistory.countDocuments({...filter , to : req.user._id });
    const docs = await TeamWalletHistory.find({...filter , to : req.user._id })
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .sort({ createdAt : sort })
    const pages = Math.ceil(docCount/pageSize);
    sendSuccessResponse(res , 200 , {
        docs , page , pages , docCount 
    });
})

exports.getSingleUserTeamWalletHistories = catchAsync(async(req , res , next) => {
    const page = Number(req.query.page) || 1 ;
    const sort = req.query.sort || -1;
    const pageSize = req.query.pageSize || 10;
    if(req.query.pageSize && req.query.pageSize > 25){
        return next(new AppError('pageSize should be less than or equal to 25' , 400));
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
    if(req.query.type){
        filter.type = parseInt(req.query.type);
    }
    if(req.query.teamLevel){
        filter.teamLevel = parseInt(req.query.teamLevel)
    }
   
    const docCount = await TeamWalletHistory.countDocuments({...filter , to : req.params.id });
    const docs = await TeamWalletHistory.find({...filter , to : req.params.id })
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .sort({ createdAt : sort })
    const pages = Math.ceil(docCount/pageSize);
    const user = await User.findById(req.params.id);

    sendSuccessResponse(res , 200 , {
        docs , page , pages , docCount , user 
    });
})