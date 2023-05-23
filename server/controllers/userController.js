const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { sendSuccessResponse } = require('../utils/helpers');
const User = require('../models/userModel');
const ROIWallet = require('../models/ROIWalletModel');
const CashWallet = require('../models/cashWalletModel');
const TeamWallet = require('../models/teamWalletModel');
const BullTrackWallet = require('../models/bullTrackWalletModel');
const userValidation = require('../validations/userValidation');
const signToken  = require('../utils/signToken');
const sendCookie = require('../utils/sendCookies');
const userFactory = require('./factories/userFactory');
const generateReferralCode = require('../utils/generateReferralCode');
const mongoose = require('mongoose');
const uploadImage = require('../utils/uploadImage');
const sendEmail = require('../utils/email');
const jwt = require('jsonwebtoken');
const sendForgotPasswordEmail = require('../utils/forgotPasswordEmail');

const signVerificationToken = (payload) => {
    return jwt.sign( payload , process.env.JWT_SECRET , {
        expiresIn : Math.floor(Date.now() / 1000) + (60 * 10) // 10 minutes
    })
}

exports.register = catchAsync(async(req , res, next) => {
    const { error } = userValidation.validate(req.body);
    if(error){
        return next(new AppError(error.details[0].message , 400))
    }
    req.body.username = req.body.username.toLowerCase();
    req.body.email = req.body.email.toLowerCase();

    const usernameExist = await User.findOne({ username : req.body.username });
    if(usernameExist){
        return next(new AppError('Username already exist. Please try another.' , 400))
    }
    const emailExist = await User.findOne({ email : req.body.email });
    if(emailExist){
        return next(new AppError('Email is already taken. Please try another.' , 400));
    }
    if(req.body.referrer){
        const referrerExist = await User.findOne({ referralCode : req.body.referrer });
        if(!referrerExist){
            return next(new AppError('Invalid sponser code.' , 400))
        }
    }
    const docCount = await User.countDocuments();
    const referralCode = await generateReferralCode(docCount);
    let newUser = await User.create({
        ...req.body , 
        referralCode : 'BB-' + referralCode
    });
    const roiWallet = await ROIWallet.create({ user : newUser._id });
    const cashWallet = await CashWallet.create({ user : newUser._id }); 
    const teamWallet = await TeamWallet.create({ user : newUser._id }); 
    const bullTrackWallet = await BullTrackWallet.create({ user : newUser._id }); 
    
    newUser = await User.findByIdAndUpdate(newUser._id , { 
        ROIWallet : roiWallet ,
        cashWallet ,
        teamWallet ,
        bullTrackWallet ,
    } , { new : true , runValidators : true })
    .populate('activePackage')

    const token = signToken({ _id : newUser._id });
    sendCookie(res , token);
    newUser.password = '';
    try {
        const verificationToken = signVerificationToken({ _id : newUser._id });
        const resp = await sendEmail(req.body.email , verificationToken);
        console.log({ resp })
        sendSuccessResponse(res , 201 , {
            message : 'Please verify your email address to continue.' ,
            doc : {...newUser._doc , token } 
        });
    } catch (error) {
        console.log({ error })
        return next(new AppError('Internal server error.' , 500))
    }
});

exports.resendVerificationEmail = catchAsync(async(req , res , next) => {
    const { email } = req.body;
    if(!email){
        return next(new AppError('Email is required.' , 400))
    }
    const doc = await User.findOne({ email });
    if(!doc){
        return next(new AppError('Invalid email. This email is not registered.' , 400))
    }
    const token = signVerificationToken({ _id : doc._id });
    const resp = await sendEmail(email , token);
    console.log({ resp })
    sendSuccessResponse(res , 200 , {
        message : 'Email sent successfully.'
    })
});

exports.verifyEmail = catchAsync(async(req , res ,next) => {
    const { token } = req.params;
    const decoded = jwt.verify(token , process.env.JWT_SECRET);
    const { _id , exp } = decoded ;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (exp < currentTimestamp) {
        return next(new AppError('Verification link has been expired. Please try again with new link.' , 400))
    }
    const doc = await User.findById(_id);
    if(!doc){
        return next(new AppError('Invalid Token.' , 400))
    }
    const _token = signToken({ _id : doc._id });
    if(doc.isEmailVerified){
        return sendSuccessResponse(res , 200 , {
            message : 'Your email is already verified.',
            doc : {...doc._doc , token : _token }
        })
    }
    doc.isEmailVerified = true ;
    await doc.save();
    sendCookie(res , _token);
    sendSuccessResponse(res , 200 , {
        message : 'Email verified successfully.',
        doc : {...doc._doc , token : _token }
    })
});

exports.login = catchAsync(async(req , res , next) => {
    const { username , password } = req.body;
    if(!username || !password){
        return next(new AppError('All fields are required.' , 400))
    }
    let doc ;
    doc = await User.findOne({ username })
    .populate({ 
        path : 'activePackage' ,
        populate : {
            path : 'package'
        }
    })
  
    if(!doc || !(await doc.comparePassword(password))){
        return next(new AppError('Wrong username or password'));
    }
    const token = signToken({ _id : doc._id });
    sendCookie(res , token);
    doc.password = '';
    try {
//        const respL = await sendEmail(doc.email , token);
//        console.log({ respL })
        return sendSuccessResponse(res , 200 , {
            message : 'Logged in successfully.' ,
            doc : {...doc._doc , token } 
        })
    }catch (err) {
        console.log({ err })
        return next(new AppError('internal server error' , 500))
    }
});


exports.getProfile = userFactory.profile(User);
exports.logout = userFactory.logout(User);

exports.getUserWallets = catchAsync(async(req , res) => {
    const user = req.user._id;
    const roiWallet = await ROIWallet.findOne({ user });
    const cashWallet = await CashWallet.findOne({ user });
    const teamWallet = await TeamWallet.findOne({ user });
    const bullTrackWallet = await BullTrackWallet.findOne({ user });
    sendSuccessResponse(res , 200 , {
        doc : {
            roiWallet ,
            cashWallet ,
            teamWallet , 
            bullTrackWallet ,
            user : {
                _id : req.user._id ,
                username : req.user.username ,
                email : req.user.email ,
                name : req.user.name ,
            }
        }
    })
});

exports.getUsers = catchAsync(async(req , res , next) => {
    const page = Number(req.query.page) || 1 ;
    const sort = req.query.sort || -1;
    const pageSize = req.query.pageSize || 10;
    if(req.query.pageSize && req.query.pageSize > 25){
        return next(new AppError('pageSize should be less than or equal to 25' , 400));
    }
    const keyword = req.query.keyword ?
    {
        username : {
            $regex : req.query.keyword ,
            $options : 'i'
        }
    } : {} ;    
    const docCount = await User.countDocuments(keyword);
    const docs = await User.find(keyword)
    .populate('activePackage')
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .sort({ createdAt : sort })
    let users = [];
    for (let doc of docs){
        if(!doc.referrer){
            users.push(doc);
            continue;
        }
        const referrer = await User.findOne({ referralCode: doc.referrer }).select('username ' )
        doc.referrer = referrer;
        users.push(doc);
    }
   
    const pages = Math.ceil(docCount/pageSize);
    sendSuccessResponse(res , 200 , {
        docs : users , page , pages , docCount 
    });
});

exports.searchUser = catchAsync(async(req , res , next) => {
    const keyword = req.query.keyword ?
    {
        username : {
            $regex : req.query.keyword ,
            $options : 'i'
        }
    } : {} ;    
    const docCount = await User.countDocuments();
    let docs;
    if(req.query.keyword){
        docs = await User.find(keyword)
    }else{
        docs = await User.find(keyword)
        .limit(10)
    }
    sendSuccessResponse(res , 200 , {
        docs , docCount 
    });
});

exports.getSponserHistory = catchAsync(async (req , res) => {
    const teamLevel = parseInt(req.query.teamLevel) || null;
    let user = await User.findById(req.user._id); 
    if(teamLevel && teamLevel === 1){
        let teamMembers = await User.find({ referrer: user.referralCode }); 
        return sendSuccessResponse(res , 200 , { 
            docs : teamMembers.map(item => ({...item._doc , teamLevel : 1})) 
        })
    }else {
        let teamMembers = await User.find({ referrer: user.referralCode }); 
        let allTeamMembers = [...teamMembers.map(item => ({...item._doc, teamLevel : 1}))]; 
        let level = 2; 
        while (level < 8) {
            let levelMembers = await User.find({ referrer: { $in: teamMembers.map(member => member.referralCode) } });
            if (teamLevel && level === teamLevel) { 
                allTeamMembers = levelMembers.map(item => ({...item._doc , teamLevel : level }));
                break;
            } else if (teamLevel && level > teamLevel) {
                break;
            } else {
                allTeamMembers.push(...levelMembers.map(item => ({...item._doc , teamLevel : level })));
                teamMembers = levelMembers;
                level++;
            }
        }
        sendSuccessResponse(res , 200 , {
            docs : allTeamMembers
        }) 
    }
});

exports.updateProfile = catchAsync(async(req , res ) => {
    const { image } = req.body;
    if(image) {
        const { fileName } = uploadImage(image , 'users');
        req.body.image = fileName;
    }
    const updatedUser = await User.findByIdAndUpdate(req.user._id , req.body , {
        new : true , 
        runValidators : true 
    });
    sendSuccessResponse(res , 200 , {
        message : 'Profile updated successfully.' ,
        doc : updatedUser
    })
});

exports.updatePassword = catchAsync(async(req , res , next) => {
    const { oldPassword , newPassword , confirmPassword } = req.body;
    if(!oldPassword || !newPassword || !confirmPassword) {
        return next(new AppError('All fields are required.' , 400))
    }
    if(newPassword !== confirmPassword){
        return next(new AppError('Passwords are not matched.' , 400))
    }
    const user = await User.findById(req.user._id);
    if(!await user.comparePassword(oldPassword)){
        return next(new AppError('Incorrect old password.' , 400))
    }
    user.password = newPassword;
    await user.save();
    sendSuccessResponse(res , 200 , {
        message : 'Password Updated Successfully.'
    })
});

exports.getSingleUser = catchAsync(async(req , res , next) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
    sendSuccessResponse(res , 200 , { doc : user })
});

exports.updateUser = catchAsync(async(req , res ) => {
    const { image } = req.body;
    if(image) {
        const { fileName } = uploadImage(image , 'users');
        req.body.image = fileName;
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.userId , req.body , {
        new : true , 
        runValidators : true 
    });
    sendSuccessResponse(res , 200 , {
        message : 'Profile updated successfully.' ,
        doc : updatedUser
    })
});

exports.getUserRankHistory = catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id);
    const directMembers = await User.find({ referrer: user.referralCode }).limit(100);
  
    const linesWithTotalSales = await Promise.all(directMembers.filter(m => m.activePackage ).map(async (directMember , i) => {
        const line = { user: directMember , totalSale: directMember?.activePackage?.depositAmount || 0 , line : i + 1 };
        const teamMembers = await User.find({ referrer: directMember.referralCode });
        if (teamMembers.length > 0) {
            line.totalSale = teamMembers.reduce((acc, member) => {
                if(member.activePackage){
                    return acc + member.activePackage.depositAmount
                }else {
                    return acc 
                }
            }, line.totalSale);
            line.totalSale += await calculateTotalSales(teamMembers, 2);
        }
        return line;
    }));
  
    sendSuccessResponse(res, 200, { docs : linesWithTotalSales });
});
  
async function calculateTotalSales(members, level) {
    if (level > 100) return 0;
    const levelMembers = await User.find({ referrer: { $in: members.map((m) => m.referralCode) } });
    if (levelMembers.length === 0) return 0;
    const totalSale = levelMembers.reduce((acc, member) => {
        if(member.activePackage){
            return acc + member.activePackage.depositAmount
        }else {
            return acc  
        }
    }, 0);
    return totalSale + await calculateTotalSales(levelMembers, level + 1);
}

exports.getPromotedUsers = catchAsync(async(req , res , next) => {
    const page = Number(req.query.page) || 1 ;
    const sort = req.query.sort || -1;
    const pageSize = req.query.pageSize || 10;
    if(req.query.pageSize && req.query.pageSize > 25){
        return next(new AppError('pageSize should be less than or equal to 25' , 400));
    }
    const docCount = await User.countDocuments({ activePackageType : 2 });
    const docs = await User.find({ activePackageType : 2 })
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .sort({ createdAt : sort })

    const pages = Math.ceil(docCount/pageSize);
    sendSuccessResponse(res , 200 , {
        docs , page , pages , docCount 
    });
});


exports.forgotPassword = catchAsync(async(req ,res ,next) => {
    const { email } = req.body;
    if(!email) {
        return next(new AppError('Email is required.' , 400))
    }
    const doc = await User.findOne({ email });
    if(!doc){
        return next(new AppError('This email is not registered.' , 400))
    }
    const token = signVerificationToken({ _id : doc._id })
    try {
        const resp = await sendForgotPasswordEmail(email , token , 'Reset Password Request');
        console.log({ resp })
        sendSuccessResponse(res , 200 , {
            message : 'Please check your email address.'
        })
    } catch (error) {
        console.log({ error })
        return next(new AppError('Internal server error.' , 500));
    }
});

exports.resetPassword = catchAsync(async(req ,res ,next) => {
    const { newPassword , token } = req.body;
    const decoded = jwt.verify(token , process.env.JWT_SECRET);
    const { _id } = decoded ;
    const doc = await User.findById(_id);
    if(!doc){
        return next(new AppError('looks like your token has been expired. please try again.' , 400));
    }
    doc.password = newPassword;
    const updatedDoc = await doc.save();
    sendSuccessResponse(res , 200 , {
        message : 'Password changed successfully.' ,
        doc : { ...updatedDoc._doc }
    })
});
