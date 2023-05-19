const Deposit = require('../models/DepositModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { sendSuccessResponse } = require('../utils/helpers');
const uploadImage = require('../utils/uploadImage');
const createSubscriptionByUsd = require('../utils/createSubsByUsd');

exports.createDepositRequest = catchAsync(async(req , res , next) => {
    const { depositAmount , packageId , txId , packageFee , proof } = req.body;
    if(!depositAmount || !packageId || !txId || !packageFee) {
        return next(new AppError('Missing required credentials.' , 400))
    };
    if(proof) {
        const { fileName } = uploadImage(proof , 'deposits');
        req.body.proof = fileName;
    }
    const newRequest = await Deposit.create({...req.body , user : req.user._id , package : packageId });
    sendSuccessResponse(res , 201 , {
        message : "Deposit request created Successfully." ,
        doc : newRequest 
    })
});

exports.updateDepositRequest = catchAsync(async(req , res , next) => {
    const { id } = req.params;
    const { status } = req.body;
    if(!status) {
        return next(new AppError('Status is missing.' , 400))
    }
    const depositRequest = await Deposit.findById(id).populate(['package' , 'user']);
    if(!depositRequest) {
        return next(new AppError('Invalid id. Request not found.' , 400))
    }
    if(depositRequest.status === 'approved') {
        return next(new AppError("This request is already approved. Now you can't update it's status." , 400))
    }
    if(status === 'approved'){  
        try {
            req.body.depositAmount = depositRequest.depositAmount;
            req.body.packageId = depositRequest.package._id ;
            req.body.paymentMethod = 2;
            req.body.packageFee = depositRequest.packageFee;
            req.user = depositRequest.user;
            await createSubscriptionByUsd(req , res , next);
            const updatedRequest = await Deposit.findByIdAndUpdate(id , req.body , {
                new : true ,
                runValidators : true 
            });
            sendSuccessResponse(res , 200 , {
                message : 'Deposit request approved successfully.' ,
                doc : updatedRequest
            })
        } catch (error) {
            console.log({ error })
            return next(new AppError('Internal server error.' , 500))
        }
    }else if(status === 'declined') {
        const updatedRequest = await Deposit.findByIdAndUpdate(id , req.body , {
            new : true ,
            runValidators : true 
        });
        sendSuccessResponse(res , 200 , {
            message : 'Deposit request declined successfully.' ,
            doc : updatedRequest
        })
    }else {
        return next(new AppError('Invalid status.' , 400))
    }
});

const fetchDepositRequests = async (req , res , query = '') => {
    const page = Number(req.query.page) || 1 ;
    const pageSize = req.query.pageSize || 10;
   
    const status = req.query.status;
    let filter = {};
    if(status === 'pending') {
        filter = { status : 'pending'}
    }else if(status === 'declined') {
        filter = { status : 'declined' }
    }else if( status === 'approved') {
        filter = { status : 'approved'}
    }
    
    const docCount = await Deposit.countDocuments({...filter , ...query});
    const docs = await Deposit.find({...filter , ...query})
    .populate(['user' , 'package'])
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .sort({ createdAt : -1 });
    console.log({ docs })
    const pages = Math.ceil(docCount/pageSize);
    sendSuccessResponse(res , 200 , {
        docs , page , pages , docCount 
    });
}

exports.getAllDepositRequests = catchAsync(async(req , res , next) => {
    console.log('running')
    await fetchDepositRequests(req , res )
});

exports.getSingleUserDepositRequests = catchAsync(async(req , res , next) => {
    await fetchDepositRequests(req , res , { user : req.params.id })
});

exports.getMyDepositRequets = catchAsync(async(req , res , next) => {
    await fetchDepositRequests(req , res , { user : req.user._id })
});