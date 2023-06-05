const mongoose = require('mongoose');


const kycSchema = new mongoose.Schema({
    CNICFrontImage : {
        type : String ,
        required : [true ,'CNIC front image is required.']
    } ,
    CNICBackImage : {
        type : String ,
        required : [true , "CNIC back image is required."]
    } ,
    nomineeCNICFrontImage : {
        type : String ,
        required : [true ,'Nominee CNIC front image is required.']
    } ,
    nomineeCNICBackImage : {
        type  : String ,
        required : [true , "Nominee CNIC back image is required."]
    } ,
    walletAddress : {
        type : String ,
        required : [true , 'wallet address is required.']
    } , 
    user : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User' ,
        required : [true , 'user is requried.']
    } ,
    status : {
        type : String ,
        enum : ['pending' , 'approved' , 'declined'] , 
        default : 'pending' 
    }
} , { timestamps : true });

kycSchema.pre(/^find/ , function(next) {
    this.populate('user');
    next();
});

const Kyc = mongoose.model('Kyc' , kycSchema);
module.exports = Kyc