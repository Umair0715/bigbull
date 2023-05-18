const Subscription = require('../models/subscriptionModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { sendSuccessResponse } = require('../utils/helpers');
const subscriptionValidation = require('../validations/subscriptionValidation');
const CashWallet = require('../models/cashWalletModel');
const Package = require('../models/packageModel');
const mongoose = require('mongoose');
const moment = require('moment');
const User = require('../models/userModel');
const Setting = require('../models/settingsModel');
const getReferrer = require('../utils/getReferrer');
const BullTrack = require('../models/bullTrackModel');
const sendTeamBonus = require('../utils/sendTeamBonus');
const Admin = require('../models/adminModel');
const AdminWallet = require('../models/adminWalletModel');
const AdminWalletHistory = require('../models/adminWalletHistoryModel');
const handlerFactory = require('./factories/handlerFactory');
const DepositHistory = require('../models/depositHistoryModel');
const Transaction = require('../models/transactionModel')

exports.createSubscriptionByUsd = catchAsync(async(req , res , next) => {
    console.log({ body : req.body });
    return;
    let { depositAmount , packageId , paymentMethod , packageFee } = req.body;

    const { error } = subscriptionValidation.validate(req.body);
    if(error) {
        return next(new AppError(error.details[0].message , 400));
    }

    depositAmount = parseInt(depositAmount);
    packageFee = parseInt(packageFee);

    const cashWallet = await CashWallet.findOne({ user : req.user._id });
    const package = await Package.findById(packageId);
    const settings = await Setting.findOne();
    const admin = await Admin.findOne({ isSuperAdmin : true });
    const adminWallet = await AdminWallet.findOne({ admin : admin._id });

    if(cashWallet.totalBallance < depositAmount ){
        return next(new AppError('You have insufficient balance in your cash Wallet to deposit this amount.' , 400))
    }

    if(!package.depositRange.includes(depositAmount)){
        return next(new AppError('Invalid deposit amount. This amount is not present in this package deposit range.' , 400))
    }

    const subscriptionExist = await Subscription.findOne({
        user : req.user._id ,
        expireDate : { $gt : Date.now() } ,
        isActive : true 
    });

    if(subscriptionExist){
        const isPrevSubscription = await Subscription.findOne({
            user : req.user._id ,
            expireDate : { $gt : Date.now() } , 
            package : mongoose.Types.ObjectId(packageId) ,
            depositAmount 
        });
        if(isPrevSubscription){
            return next(new AppError('You already deposited amount in this range and package.' , 400))
        }
        if(depositAmount < subscriptionExist.depositAmount ){
            return next(new AppError('You can only upgrade your Package to up level.' , 400))
        }
        const updatedSubscription = await Subscription.findByIdAndUpdate(subscriptionExist._id , {
            package : package._id ,
            expireDate : moment().add(package.duration, 'months').toDate() ,
            depositAmount ,
            activePackageType : 1
        } , { 
            new : true , runValidators : true 
        });
       

        // Update user active package
        const user = await User.findById(req.user._id)
        user.activePackage = updatedSubscription._id;
        

        const bullTrack = await BullTrack.findOne({ user : user._id , status : 'running' })
        .populate({
            path : 'bullTrackUsers',
            populate : {
                path : 'user' ,
                populate : {
                    path : 'activePackage' ,
                }
            }
        });
        if(bullTrack && bullTrack.bullTrackUsers.length > 0 ){
            const updatedBullTrackUsers = bullTrack.bullTrackUsers.filter(item => {
                if(item.user.activePackage.depositAmount >= depositAmount){
                    return {
                        user : item.user._id
                    }
                }
            });
            bullTrack.bullTrackUsers = updatedBullTrackUsers;
            await bullTrack.save();
        }

       
        const daysAgo = moment().diff(moment(subscriptionExist.createdAt), 'days');

        let amountToDetuct = 0;
        if(user.activePackageType === 2){
            amountToDetuct = depositAmount;
        }else{
            if(daysAgo > 60) {
                amountToDetuct = depositAmount
            } else {
                amountToDetuct = depositAmount - subscriptionExist.depositAmount
            }
        }

        if(paymentMethod === 1) {
            cashWallet.totalBallance -= (amountToDetuct + packageFee);  
            await cashWallet.save();
        }
        
        user.activePackageType = 1;
        await user.save();

        if(user.referrer){
            sendTeamBonus(user , amountToDetuct);
        }
        adminWallet.totalBalance += packageFee;
        adminWallet.save();

        AdminWalletHistory.create({
            admin : admin._id ,
            wallet : adminWallet._id ,
            amount : packageFee ,
        })

        DepositHistory.create({
            amount : amountToDetuct , 
            package : package._id ,
            user : mongoose.Types.ObjectId(req.user._id) ,
            paymentMethod ,
            type : 'update'
        })

        Transaction.create({
            from : mongoose.Types.ObjectId(req.user._id) , 
            to : mongoose.Types.ObjectId(req.user._id) ,
            amount : amountToDetuct + packageFee,
            toSelf : true , 
            description : 'You upgraded your Package'
        })

        return sendSuccessResponse(res , 200 , {
            message : 'Package Upgraded Successfully.' ,
            doc : updatedSubscription
        })
    }else {
        const newSubscription = await Subscription.create({
            user : mongoose.Types.ObjectId(req.user._id),
            package : package._id ,
            expireDate : moment().add(package.duration , 'months').toDate() ,
            depositAmount ,
            packageFee ,
            
        });
        DepositHistory.create({
            amount : depositAmount , 
            package : package._id ,
            user : mongoose.Types.ObjectId(req.user._id) ,
            paymentMethod
        })

        Transaction.create({
            from : mongoose.Types.ObjectId(req.user._id) , 
            to : mongoose.Types.ObjectId(req.user._id) ,
            amount : depositAmount + packageFee ,
            toSelf : true , 
            description : 'You purchased a Package'
        })

        const user = await User.findById(req.user._id);
        user.activePackage = newSubscription._id;
        user.activePackageType = 1;
        await user.save();
        if(paymentMethod === 1){
            cashWallet.totalBallance -= (depositAmount + packageFee);
            await cashWallet.save();
        }
        adminWallet.totalBalance += packageFee;
        adminWallet.save();
        AdminWalletHistory.create({
            admin : admin._id ,
            wallet : adminWallet._id ,
            amount : packageFee ,
        })
        if(user.referrer){
            console.log('user has referrer');
            const userReferrer = await User.findOne({ referralCode : user.referrer })
            .populate({
                path : 'activePackage',
                populate : {
                    path : 'package' 
                }
            });
            if(
                userReferrer.isActive && 
                userReferrer.activePackage &&
                userReferrer.activePackage.depositAmount >= settings.bullTrackThreshold 
                && 
                depositAmount >= settings.bullTrackThreshold 
                &&
                depositAmount >= userReferrer.activePackage.depositAmount
            ){ //depositamount => newJoinerDepositAmount
            
                const bullTrack = await BullTrack.findOne({ 
                    user : userReferrer._id , 
                    status : 'running' , 
                    isActive : true ,  
                });

                if(bullTrack){
                    console.log('user bull track exist 👍')
                    if(new Date(bullTrack.expiredAt) > new Date()){
                        console.log('user bull track is not expired 😃')
                        if(bullTrack.bullTrackUsers.length === 4){
                            console.log('bull track count is 4 🥳')
                            if(
                                bullTrack.bullTrackUsers.some(u => u.user.toString() !== user._id.toString())
                            ){
                                console.log('current subscription is not exist in his bulltrack')
                                bullTrack.bullTrackUsers.push({
                                    user : user._id
                                });
                                bullTrack.status = 'completed';
                                bullTrack.completedAt = new Date();
                                userReferrer.totalBullTrackAchieved += 1;
                                await userReferrer.save();
                                await bullTrack.save();
                                sendTeamBonus(user , depositAmount);
                            }else{
                                console.log('user exist in his bullrack users');
                                sendTeamBonus(user , depositAmount)
                            }
                        }else {
                            console.log('user bullTrack count is not 4')
                            if(bullTrack.bullTrackUsers.some(u => u.user.toString() !== user._id.toString())){
                                bullTrack.bullTrackUsers.push({
                                    user : user._id
                                });
                                await bullTrack.save();
                            }
                            sendTeamBonus(user , depositAmount);
                        }
                    }else {
                        console.log('user is not under bullTrack period');
                        bullTrack.isExpired = true;
                        bullTrack.isActive = false;
                        await bullTrack.save();
                        sendTeamBonus(user , depositAmount);
                    }
                }else {
                    console.log('bull track not exist 😞')
                    const currentDate = moment();
                    const newBullTrack = await BullTrack.create({
                        user : userReferrer._id ,
                        bullTrackUsers : [
                            {
                                user : user._id 
                            }
                        ] ,
                        expiredAt : moment(currentDate).add(settings.bullTrackPeriod, 'days')
                    });
                    userReferrer.bullTrack = newBullTrack._id;
                    await userReferrer.save();
                    sendTeamBonus(user , depositAmount)
                }
            }else{
                sendTeamBonus(user , depositAmount)
            }

        }
        const newSubs = await Subscription.findById(newSubscription._id)
        .populate('package');
        return sendSuccessResponse(res , 201 , {
            message : 'Package Purchased successfully.' ,
            doc : newSubs 
        })
    } 
});