const Package = require('../models/packageModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { sendSuccessResponse } = require('../utils/helpers');
const uploadImage = require('../utils/uploadImage');
const packageValidation = require('../validations/packageValidation');
const deleteImage = require('../utils/deleteImage');


exports.createPackage = catchAsync(async(req , res , next) => {
    const { error } = packageValidation.validate(req.body);
    console.log({ body : req.body})
    if(error){
        return next(new AppError(error.details[0].message , 400))
    }
    const packageExist = await Package.findOne({ name : req.body.name });
    if(packageExist){
        return next(new AppError('Package already exist with same name. please try another name.' , 400))
    }
    const depositRange = req.body.depositRange.map(item => (
        parseInt(item)
    ))
    const { fileName } = uploadImage(req.body.image , 'packages');
    const newPackage = await Package.create({...req.body , image : fileName , depositRange });
    sendSuccessResponse(res , 201 , {
        message : 'Package created successfully.' ,
        doc : newPackage 
    })
});

exports.updatePackage = catchAsync(async(req , res , next) => {
    const { packageId } = req.params;
    const { image } = req.body;
    const packageExist = await Package.findById(packageId);
    if(!packageExist){
        return next(new AppError('InValid id. Package not found.' , 404))
    }
    let prevImage = packageExist.image;
    if(image){
        const { fileName } = uploadImage(image , 'packages');
        req.body.image = fileName;
    }
    const depositRange = req.body.depositRange.map(item => (
        parseInt(item)
    ))
    const updatedPackage = await Package.findByIdAndUpdate(packageId , {...req.body , depositRange } , {
        new : true ,
        runValidators : true 
    });
    if(image) deleteImage('packages' , prevImage);
    sendSuccessResponse(res , 200 , {
        message : 'Package updated successfully.' ,
        doc : updatedPackage
    })
});

exports.getAllPackages = catchAsync(async(req ,res , next) => {
    let filter = {};
    if(req.query.type){
        filter.type = parseInt(req.query.type)
    }
    const packages = await Package.find({...filter}).sort();
    sendSuccessResponse(res , 200 , { docs : packages });
});

exports.getSinglepackage = catchAsync(async(req ,res , next) => {
    const { packageId } = req.params;
    const package = await Package.findById(packageId);
    if(!package) return next(new AppError('Invalid id. Package not found.'));
    sendSuccessResponse(res , 200 , { doc : package });
});

exports.deletePackage = catchAsync(async(req ,res) => {
    await Package.findByIdAndDelete(req.params.packageId);
    sendSuccessResponse(res, 200 , { message : 'Package deleted successfully.'})
});