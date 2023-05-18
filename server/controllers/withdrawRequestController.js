const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { sendSuccessResponse } = require('../utils/helpers');
const WithdrawRequest = require('../models/withdrawRequestModel');
const uploadImage = require('../utils/uploadImage');
const { getWalletTypeModel, getWalletType } = require('../utils/getWalletType');
const Setting = require('../models/settingsModel');
const handlerFactory = require('./factories/handlerFactory');
const Admin = require('../models/adminModel');
const AdminWallet = require('../models/adminWalletModel');
const AdminWalletHistory = require('../models/adminWalletHistoryModel');
const User = require('../models/userModel');
const createWalletHistory = require('../utils/CreateWalletHistory');

exports.createWithdrawRequest = catchAsync(async(req , res , next) => {
    let { walletType , amount , wallet , usdtAddress } = req.body;
    if(!walletType || !amount || !wallet || !usdtAddress){
        return next(new AppError('All fields are required.' , 400));
    }
    amount = parseInt(amount);
    const WalletModel = getWalletTypeModel(walletType);
    const userWallet = await WalletModel.findOne({ user : req.user._id });
    const settings = await Setting.findOne({});

    if(!userWallet){
        return next(new AppError("Wallet not found." , 404))
    }
    if(amount < settings.minimumWithdraw){
        return next(new AppError(`Minimum withdraw amount is $${settings.minimumWithdraw}` , 400))
    }
    if(userWallet.totalBallance < amount ){
        return next(new AppError('You have insufficient balance to withdraw this amount.' , 400))
    }
    const newWithdrawRequest = await WithdrawRequest.create({
        user : req.user._id ,
        amount ,
        walletType : getWalletType(walletType) ,
        wallet : userWallet._id ,
        usdtAddress
    });
    userWallet.totalBallance -= amount;
    await userWallet.save();
    
    createWalletHistory(walletType , req.user , userWallet , amount , 'Withdrawal');
    return sendSuccessResponse(res , 200 , {
        message : 'Withdraw request created successfully.' ,
        doc : newWithdrawRequest
    })
});

exports.getAllWithdrawRequests = catchAsync(async(req , res , next) => {
    const page = req.query.page || 1 ;
    const sort = req.query.sort || -1;
    const pageSize = req.query.pageSize || 10 ;
    if(req.query.pageSize && req.query.pageSize > 25){
        return next(new AppError('pageSize should be less than or equal to 25' , 400))
    }
    let docCount ;
    let docs ;
    const status = req.query.status;
    if(status){
        docCount = await WithdrawRequest.countDocuments({ status });
        docs = await WithdrawRequest.find({ status })
        .skip(pageSize * (page - 1))
        .limit(pageSize)
        .sort({ createdAt : sort })
    }else {
        docCount = await WithdrawRequest.countDocuments();
        docs = await WithdrawRequest.find()
        .skip(pageSize * (page - 1))
        .limit(pageSize)
        .sort({ createdAt : sort })
    }
    const pages = Math.ceil(docCount/pageSize);
    sendSuccessResponse(res , 200 , {
        docs , page , pages , docCount 
    })
});

exports.getMyWithdrawRequests =  catchAsync(async(req , res , next) => {
    const page = req.query.page || 1 ;
    const sort = req.query.sort || -1;
    const pageSize = req.query.pageSize || 10 ;
    if(req.query.pageSize && req.query.pageSize > 25){
        return next(new AppError('pageSize should be less than or equal to 25' , 400))
    }
    let docCount ;
    let docs ;
    const status = req.query.status;
    if(status){
        docCount = await WithdrawRequest.countDocuments({ user : req.user._id ,  status });
        docs = await WithdrawRequest.find({ user : req.user._id , status })
        .skip(pageSize * (page - 1))
        .limit(pageSize)
        .sort({ createdAt : sort })
    }else {
        docCount = await WithdrawRequest.countDocuments({ user : req.user._id });
        docs = await WithdrawRequest.find({ user : req.user._id })
        .skip(pageSize * (page - 1))
        .limit(pageSize)
        .sort({ createdAt : sort })
    }
    const pages = Math.ceil(docCount/pageSize);
    sendSuccessResponse(res , 200 , {
        docs , page , pages , docCount 
    })
});

exports.getSingleWithdrawRequest = handlerFactory.getOne(WithdrawRequest);

exports.updateWithdrawRequest = catchAsync(async(req , res , next) => {
    const { id } = req.params;
    const { proof , status , description } = req.body;
    if(!proof || !status || !description){
        return next(new AppError('All fields are required.' , 400))
    }

    const withdrawRequest = await WithdrawRequest.findById(id);
    if(!withdrawRequest){
        return next(new AppError('Withdraw request not found.' , 404))
    }
    if(withdrawRequest.status !== 'pending'){
        return next(new AppError('This request is already updated. New you cannot update this request.' , 400))
    }

    if(status === 'declined'){
        const user = await User.findById(withdrawRequest.user._id);
        if(!user) return next(new AppError('User not found.' , 404));
        const WalletModel = getWalletTypeModel(withdrawRequest.wallet.walletType);
        const wallet = await WalletModel.findOne({ user : user._id });
        wallet.totalBallance += withdrawRequest.amount;
        await wallet.save();
    }

    const { fileName } = uploadImage(proof , 'withdrawRequests');
    const updatedRequest = await WithdrawRequest.findByIdAndUpdate(id , {
        ...req.body ,
        proof : fileName ,
        status , 
        description
    } , {
        new : true , 
        runValidators : true 
    });
    sendSuccessResponse(res , 200 , {
        message : 'Withdraw request updated successfully.' ,
        doc : updatedRequest
    })
});