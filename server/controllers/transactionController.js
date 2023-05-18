const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Transaction = require('../models/transactionModel');
const { sendSuccessResponse } = require('../utils/helpers');
const transactionValidation = require('../validations/transactionValidation');
const { getWalletType , getWalletTypeModel, getWalletName } = require('../utils/getWalletType');
const CashWallet = require('../models/cashWalletModel');
const BullTrackWallet = require('../models/bullTrackWalletModel');
const TeamWallet = require('../models/teamWalletModel');
const ROIWallet = require('../models/ROIWalletModel');
const AdminProfit = require('../models/adminProfitModel');
const AdminWallet = require('../models/adminWalletModel');
const Admin = require('../models/adminModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const Setting = require('../models/settingsModel');
const AdminWalletHistory = require('../models/adminWalletHistoryModel');
const handlerFactory = require('./factories/handlerFactory');
const createWalletHistory = require('../utils/CreateWalletHistory');

exports.createTransaction = catchAsync(async(req , res , next) => {
    let { amount , fromWalletType , toSelf } = req.body;
    amount = parseInt(amount);
    const { error } = transactionValidation.validate({amount , fromWalletType , toSelf});
    if(error){
        return next(new AppError(error.details[0].message , 400));
    };

    const admin = await Admin.findOne({ isSuperAdmin : true });
    const adminWallet = await AdminWallet.findOne({ admin : admin._id })
    const settings = await Setting.findOne({});
    const platformFee = (amount / 100) * settings.platformFee;

    if(amount < settings.minimumTransfer){
        return next(new AppError(`Minimum transfer amount is ${settings.minimumTransfer}` , 400));
    }

    if(toSelf){ // is case me from wallet change hoga (i.e: bullTrack, Roi etc)
        if(Number(fromWalletType) === 4){ // if cashWallet
            return next(new AppError('You cannot make transaction from your cash wallet to your other wallets.' , 400))
        }
        const fromWalletModel = getWalletTypeModel(Number(fromWalletType));
        const fromWallet = await fromWalletModel.findOne({ user : req.user._id.toString() });
        if(fromWallet.totalBallance < (amount + platformFee)) {
            return next(new AppError(`You have insufficient balance in your ${getWalletType(fromWalletType)} wallet to transfer this amount. ` , 400))
        }
        
        const cashWallet = await CashWallet.findOne({ user : req.user._id });
        const amountToDetuct = amount + platformFee;
        fromWallet.totalBallance -= amountToDetuct;
        await fromWallet.save();
        cashWallet.totalBallance += amount;
        await cashWallet.save();
        const newTransaction = await Transaction.create({
            from : req.user._id ,
            fromUsername : req.user.username ,
            to : req.user._id ,
            fromWalletType : getWalletType(fromWalletType) ,
            fromWallet : fromWallet._id ,
            toWalletType : 'CashWallet' ,
            toWallet : cashWallet._id ,
            amount , toSelf ,
            description : `Amount received from your ${getWalletName(fromWalletType)} `
        });
        createWalletHistory(fromWalletType , req.user , fromWallet._id , amountToDetuct , 'Amount transfered to Cash Wallet' )

        adminWallet.totalBalance += settings.platformFee;
        await adminWallet.save();
        AdminWalletHistory.create({
            admin : admin._id ,
            wallet : adminWallet._id , 
            amount : settings.platformFee 
        });
        
        return sendSuccessResponse(res , 200 , {
            message : 'Payment transfered successfully.' ,
            doc : newTransaction
        })
    }else { // is case me from wallet sirf user ka cash wallet hoga
        const toUser = await User.findById(req.body.to);
        const toWallet = await CashWallet.findOne({ user : toUser._id });
        const fromWallet = await CashWallet.findOne({ user : req.user._id })
        

        const amountToDetuct = amount + platformFee;
        if(fromWallet.totalBallance < amountToDetuct){
            return next(new AppError(`You have insufficient balance in your CashWallet wallet to transfer this amount. ` , 400))
        }
        fromWallet.totalBallance -= amountToDetuct;
        await fromWallet.save();
        toWallet.totalBallance += amount;
        await toWallet.save();
        const newTransaction = await Transaction.create({
            from : req.user._id ,
            fromUsername : toUser?.username ,
            to : toUser._id ,
            fromWalletType : 'CashWallet' ,
            toWalletType : 'CashWallet' ,
            fromWallet : fromWallet._id ,
            toWallet : toWallet._id ,
            amount , toSelf , 
            description : `${req.user.username} transfered amount to ${toUser.username}`
        })
        adminWallet.totalBalance += settings.platformFee;
        await adminWallet.save();
        AdminWalletHistory.create({
            admin : admin._id ,
            wallet : adminWallet._id , 
            amount : settings.platformFee ,
            description : `Transfer fee received from ${req.user.username}`
        })
        return sendSuccessResponse(res , 200 , {
            message : 'Payment transfered successfully.' ,
            doc : newTransaction
        })
    }
});


exports.getAllTransactions = handlerFactory.getAll(Transaction);

exports.getMyTransactions = catchAsync(async(req , res , next) => {
    const page = Number(req.query.page) || 1 ;
    const sort = req.query.sort || -1;
    const pageSize = req.query.pageSize || 10;
    if(req.query.pageSize && req.query.pageSize > 25){
        return next(new AppError('pageSize should be less than or equal to 25' , 400));
    }
    const keyword = req.query.keyword ? 
    {
        fromUsername : {
            $regex : req.query.keyword ,
            $options : 'i'
        }
    } : {};

    const docCount = await Transaction.countDocuments({...keyword , $or : [
        { to : req.user._id },
        { from : req.user._id }
    ]});
    const docs = await Transaction.find({...keyword , $or : [
        { to : req.user._id },
        { from : req.user._id }
    ]})
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .sort({ createdAt : sort })
    const pages = Math.ceil(docCount/pageSize);
    sendSuccessResponse(res , 200 , {
        docs , page , pages , docCount 
    });
})

exports.getSingleUserTransactions = catchAsync(async(req , res , next) => {
    const page = Number(req.query.page) || 1 ;
    const sort = req.query.sort || -1;
    const pageSize = req.query.pageSize || 10;
    if(req.query.pageSize && req.query.pageSize > 25){
        return next(new AppError('pageSize should be less than or equal to 25' , 400));
    }
    const keyword = req.query.keyword ? 
    {
        fromUsername : {
            $regex : req.query.keyword ,
            $options : 'i'
        }
    } : {};

    const docCount = await Transaction.countDocuments({...keyword , $or : [
        { to : req.params.id },
        { from : req.params.id }
    ]});
    const docs = await Transaction.find({...keyword , $or : [
        { to : req.params.id },
        { from : req.params.id }
    ]})
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .sort({ createdAt : sort })
    const pages = Math.ceil(docCount/pageSize);

    const user = await User.findById(req.params.id)
    sendSuccessResponse(res , 200 , {
        docs , page , pages , docCount , user  
    });
});