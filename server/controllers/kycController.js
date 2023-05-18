const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Kyc = require('../models/kycModel');
const { sendSuccessResponse } = require('../utils/helpers');
const kycValidation = require('../validations/kycValidation');
const uploadImage = require('../utils/uploadImage');
const handlerFactory = require('./factories/handlerFactory');


exports.createKyc = catchAsync(async(req , res , next) => {
    const { error } = kycValidation.validate(req.body);
    if(error){
        return next(new AppError(error.details[0].message , 400))
    }
    const { fileName : CNICFrontImage } = uploadImage(req.body.CNICFrontImage , 'kyc');
    const { fileName : CNICBackImage } = uploadImage(req.body.CNICBackImage , 'kyc');
    const { fileName : nomineeCNICFrontImage } = uploadImage(req.body.nomineeCNICFrontImage , 'kyc');
    const { fileName : nomineeCNICBackImage } = uploadImage(req.body.nomineeCNICBackImage , 'kyc');

    const newKyc = await Kyc.create({
        walletAddress : req.body.walletAddress ,
        CNICFrontImage , 
        CNICBackImage ,
        nomineeCNICBackImage ,
        nomineeCNICFrontImage ,
        user : req.user._id 
    });
    sendSuccessResponse(res , 201 , {
        message : 'Kyc created successfully.' ,
        doc : newKyc
    })
});

exports.updateWalletAddress = catchAsync(async(req , res , next) => {
    const { kycId } = req.params;
    const updatedKyc = await Kyc.findByIdAndUpdate(kycId , {
        walletAddress : req.body.walletAddress
    } , {
        new : true , 
        runValidators : true 
    });
    sendSuccessResponse(res , 200 , {
        message : 'Wallet Address updated successfully.' ,
        doc : updatedKyc 
    })
});

exports.getMyKyc = catchAsync(async (req , res , next) => {
    const kyc = await Kyc.findOne({ user : req.user._id });
    sendSuccessResponse(res , 200 , {
        doc : kyc
    })
});

exports.getUserKyc = catchAsync(async(req ,res , next) => {
    const { userId } = req.params;
    if(!userId){
        return next(new AppError('User id is required.' , 400))
    };
    const kyc = await Kyc.find({ user : userId });
    sendSuccessResponse(res , 200 , {
        doc : kyc 
    });
});

exports.deleteKyc = catchAsync(async(req , res) => {
    const { kycId } = req.params;
    await Kyc.findByIdAndDelete(kycId);
    sendSuccessResponse(res , 200 , {
        message : 'Kyc Deleted successfully.' ,
    })
});

exports.getAllKyc = handlerFactory.getAll(Kyc);
exports.updateKyc = handlerFactory.updateOne(Kyc);

exports.getSingleKyc = catchAsync(async(req , res) => {
    const { kycId } = req.params;
    const doc = await Kyc.findById(kycId);
    sendSuccessResponse(res , 200 , {
        doc 
    })
});