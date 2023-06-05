const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Admin = require('../models/adminModel');
const { sendSuccessResponse } = require('../utils/helpers');
const AdminWallet = require('../models/adminWalletModel');
const userFactory = require('./factories/userFactory');
const { getWalletTypeModel } = require('../utils/getWalletType');
const RoiWalletHistory = require('../models/roiWalletHistoryModel');
const BullTrackWalletHistory = require('../models/bullTrackWalletHistory');
const TeamWalletHistory = require('../models/teamWalletHistoryModel');
const CashWalletHistory = require('../models/transactionModel');
const AdminWalletHistory = require('../models/adminWalletHistoryModel');
const User = require('../models/userModel');
const handlerFactory = require('./factories/handlerFactory');

exports.registerAdmin = catchAsync(async(req , res , next) => {
    const { name , email , password , username } = req.body;
    if(!name || !email || !password || !username){
        return next(new AppError('All fields are required.' , 400))
    }    
    const adminExist = await Admin.findOne({ username });
    if(adminExist){
        return next(new AppError('username already taken. please try another.' , 400));
    }
    const newAdmin = await Admin.create(req.body);
    const newAdminWallet = await AdminWallet.create({ admin : newAdmin._id });
    newAdmin.wallet = newAdminWallet._id;
    await newAdmin.save();
    await newAdmin.populate('wallet');
    sendSuccessResponse(res , 201 , {
        message : 'Admin registered successfully.' ,
        doc : newAdmin 
    })
});

exports.login = userFactory.login(Admin);
exports.logout = userFactory.logout(Admin);
exports.getProfile = userFactory.profile(Admin);

exports.updatePassword = catchAsync(async(req , res , next) => {
    const { oldPassword , newPassword , passwordConfirm } = req.body;
    if(!oldPassword || !newPassword || !passwordConfirm){
        return next(new AppError('All fiedls are required.' , 400))
    }
    if(newPassword !== passwordConfirm){
        return next(new AppError('Passwords are not matched.'))
    }
    const admin = await Admin.findById(req.user._id);
    if(!await admin.comparePassword(oldPassword)){
        return next(new AppError('Incorrect old password.' , 400))
    }
    admin.password = newPassword;
    await admin.save();
    return sendSuccessResponse(res , 200 , {
        message : 'Passowrd updated successfully.'
    });
});

exports.transferAmount = catchAsync(async(req , res , next) => {
    let { amount , user , walletType } = req.body;
    walletType = parseInt(walletType);
    if(!amount || !user || !walletType) {
        return next(new AppError('All fields are required.' , 400))
    }
    amount = parseInt(amount);
    const WalletModel = getWalletTypeModel(walletType);
    const wallet = await WalletModel.findOne({ user });
    wallet.totalBallance += parseInt(amount);
    wallet.save();

    const admin = await Admin.findOne({ isSuperAdmin : true });
    if(walletType === 1){
        RoiWalletHistory.create({
            user ,
            ROI : amount , 
            description : 'Sended by an Admin' , 
        });
    }else if(walletType === 2){
        TeamWalletHistory.create({
            from : admin._id ,
            fromUsername : admin.username ,
            to : user ,
            amount ,
            description : 'Sended by an Admin' ,
            type : 3
        })
    }else if (walletType === 3) {
        BullTrackWalletHistory.create({
            user , amount , type : 3 ,
            description : 'Sended by an Admin'
        })
    }else {
        CashWalletHistory.create({
            from : admin._id ,
            fromUsername : admin.username ,
            to : user ,
            amount ,
            description : 'Sended By an Admin'  
        })
    }
    const adminWallet = await AdminWallet.findOne({ admin : admin._id });
    AdminWalletHistory.create({
        admin : admin._id ,
        wallet : adminWallet._id ,
        amount ,
        description : `Amount Sended to user wallet` 
    })
  
    sendSuccessResponse(res , 200 , {
        message : 'Amount transfered successfully.'
    })
});

// 1 = ROI , 2 = Team wallet , 3 = Bull Track , 4 = Cash 

exports.getAdminTransferHistory = handlerFactory.getAll(AdminWalletHistory)