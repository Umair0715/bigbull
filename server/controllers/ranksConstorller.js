const catchAsync = require('../utils/catchAsync');
const uploadImage = require("../utils/uploadImage");
const AppError = require('../utils/appError');
const Rank = require('../models/ranksModel');
const User = require('../models/userModel');
const { sendSuccessResponse } = require('../utils/helpers');
const handlerFactory = require('./factories/handlerFactory');


exports.createRank = catchAsync(async(req , res , next) => {
    const { name , image , achieveAmount } = req.body;
    if(!name || !image || !achieveAmount){
        return next(new AppError('Missing required credentials.' , 400))
    }
    const rankExist = await Rank.findOne({ name });
    if(rankExist) {
        return next(new AppError('Rankt with same name already exist.' , 400))
    }
    const { fileName } = uploadImage(image , 'ranks');
    const newRank = await Rank.create({
        ...req.body , name , achieveAmount , image : fileName
    });
    sendSuccessResponse(res , 200 , {
        message : 'Rank created successfully.' ,
        doc : newRank 
    })
});

exports.getAllRanks = catchAsync(async(req , res , next) => {
    const ranks = await Rank.find();
    sendSuccessResponse(res , 200 , { docs : ranks })
});
exports.deleteRank = handlerFactory.deleteOne(Rank)
exports.getSingleRank = handlerFactory.getOne(Rank)


exports.updateRank = catchAsync(async(req , res , next) => {
    const { image } = req.body;
    if(image){
        const { fileName } = uploadImage(image , 'ranks');
        req.body.image = fileName;
    }
    const updatedRank = await Rank.findByIdAndUpdate(req.params.id , req.body , {
        new : true , 
        runValidators : true 
    })
    sendSuccessResponse(res , 200 , {
        message : 'Rank updated successfully.' ,
        doc : updatedRank 
    });
});
