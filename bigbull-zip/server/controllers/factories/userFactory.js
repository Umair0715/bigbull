const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const { sendSuccessResponse } = require('../../utils/helpers');
const signToken = require('../../utils/signToken');
const sendCookie = require('../../utils/sendCookies');

exports.register = (Model , docValidation) => catchAsync(async(req , res , next) => {
    const { error } = docValidation.validate(req.body);
    if(error){
        return next(new AppError(error.details[0].message , 400))
    }
    const { email } = req.body;
    const docExist = await Model.findOne({ email });
    if(docExist){
        return next(new AppError('Email is already taken. Please try another.' , 400))
    }
    const otp = generateOtp();
    await Model.create({
        ...req.body ,
        emailVerificationToken : otp , 
        emailVerificationTokenExpire : new Date(Date.now() + 10 * 60 * 1000)
    });
    try {
        await sendEmail(email , otp);
        sendSuccessResponse(res , 201 , {
            message : 'We have sent an otp to your email address. Please verify your email address.',
        })
    } catch (error) {
        return next(new AppError('Internal server error.' , 500))
    }
});

exports.verifyEmail = Model => catchAsync(async(req , res ,next) => {
    const { token } = req.params;
    const decoded = jwt.verify(token , process.env.JWT_SECRET);
    const { _id , exp } = decoded ;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (exp < currentTimestamp) {
        return next(new AppError('Verification link has been expired. Please try again with new link.' , 400))
    }
    const doc = await Model.findById(_id);
    if(!doc){
        return next(new AppError('Invalid Token.' , 400))
    }
    if(doc.isEmailVerified){
        return sendSuccessResponse(res , 200 , {
            message : 'Your email is already verified. Please login your account.',
        })
    }
    doc.isEmailVerified = true ;
    await doc.save();
    const _token = signToken({ _id : doc._id });
    sendCookie(res , _token);
    sendSuccessResponse(res , 200 , {
        message : 'Email verified successfully.',
        doc : {...doc._doc , token : _token }
    })
});


exports.login = (Model , populateItems) => catchAsync(async(req , res , next) => {
    const { username , password } = req.body;
    if(!username || !password){
        return next(new AppError('All fields are required.' , 400))
    }
    let doc ;
    if(populateItems){
        doc = await Model.findOne({ username })
        .populate(populateItems)
    }else {
        doc = await Model.findOne({ username })
    }
    if(!doc || !(await doc.comparePassword(password))){
        return next(new AppError('Wrong username or password'));
    }
    const token = signToken({ _id : doc._id });
    sendCookie(res , token);
    doc.password = '';
    return sendSuccessResponse(res , 200 , {
        message : 'Logged in successfully.' ,
        doc : {...doc._doc , token } 
    })
});

exports.profile = Model => catchAsync(async(req , res ,next) => {
    const doc = await Model.findById(req.user._id);
    if(!doc) return next(new AppError('Document not found.' , 404));
    doc.password = '';
    return sendSuccessResponse(res , 200 , {
        doc 
    })
});

exports.logout = Model => (req , res , next) =>{
    res.cookie('token' , 'loggedOut' , {
        expires : new Date(Date.now() + 10 * 1000), 
        httpOnly : true 
    });
    return sendSuccessResponse(res , 200 , {
        message : 'Logged out successfully.'
    })
}