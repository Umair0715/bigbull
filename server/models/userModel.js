const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const shortId = require('shortid');
const generateReferralCode = require('../utils/generateReferralCode');

const userSchema = new mongoose.Schema({
    name : {
        type : String ,
        required : [true , 'Name is required.']
    } ,
    username : {
        type : String ,
        unique : true ,
        required : [true , 'username is required.']
    } ,
    email : {
        type : String ,
        required : [true , 'Email is required.']
    } ,
    phone : {
        type : String ,
        required : [true , 'Phone number is required.']
    } ,
    gender : {
        type : String ,
        required : [true , 'Gender is required.']
    } ,
    address : {
        type : String ,
        required : [true , 'Address is required.']
    } ,
    country : {
        type : String ,
        required : [true , 'Country is required.']
    } ,
    referralCode : {
        type : String ,
        required : [true , 'Referral Code is required.'] 
    } ,
    referrer : {
        type : String ,
        ref : 'User' ,
        default : null
    } ,
    password : {
        type : String ,
        default : null 
    } ,
    isActive : {
        type : Number ,
        default : 1 
    } , 
    ROIWallet : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : 'ROIWallet' ,
        default : null ,
    } ,
    cashWallet : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : 'CashWallet' ,
        default : null ,
    } ,
    bullTrackWallet : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : 'BullTrackWallet' ,
        default : null ,
    } ,
    teamWallet : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : 'TeamWallet' ,
        default : null ,
    } ,
    activePackage : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'Subscription' ,
        default : null ,
    } , 
    activePackageType : {
        type : Number ,
        enum : [1 , 2 , null] , // 1 = purchased , 2 = special , 
        default : null 
    } ,
    isActive : {
        type : Boolean ,
        default : true ,
    } , 
    bullTrack : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'BullTrack' ,
        default : null
    } ,
    isPackageDeactivated : {
        type : Boolean ,
        default : false ,
    } , 
    packageDeactivatedAt : {
        type : Date ,
         default : null 
    } ,
    packageReactivationExpire : {
        type : Date , 
        default : null 
    } ,
    isReInvest : {
        type : Boolean ,
        default : false ,
    } ,
    reinvestAt : {
        type : Date ,
        default : null 
    } ,
    image : {
        type : String ,
        default : null
    } , 
    totalProfit : {
        type : Number ,
        default : 0
    } , 
    totalBullTrackAchieved : {
        type : Number ,
        default : 0
    } , 
    achievedRanks : {
        type : Array , 
        default : []
    } , 
    activePackageProfit : {
        type : Number ,
        default : 0 
    } , 
    isEmailVerified : {
        type : Boolean , 
        default : false ,
    } ,
    passwordResetToken : {
        type : String ,
        default : null
    } ,
    passwordResetTokenExpire : {
        type : Date ,
        default : null 
    } , 
} , { timestamps : true });


userSchema.pre('save' , async function(next) {
    if(!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password , 10);
    next();
});

userSchema.methods.populateReferrer = async function() {
    if (!this.referrer) return this;
    const referrer = await this.constructor.findOne({ referralCode: this.referrer }).select('username -password' )
    this.referrer = referrer;
    return this;
  };

userSchema.methods.comparePassword = async function (givenPassword) {
    return await bcrypt.compare(givenPassword , this.password)
}

userSchema.pre(/^find/ , function(next) {
    this.populate(['ROIWallet' , 'bullTrackWallet' , 'teamWallet' , 'cashWallet' , 'bullTrack', 'activePackage']);
    next();
});

const User = mongoose.model('User' , userSchema);
module.exports = User;