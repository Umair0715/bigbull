const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    name : {
        type : String ,
        required : [true , 'Package name is required.']
    } ,
    image : {
        type : String ,
        required : [true , 'Package image is required.']
    } ,
    monthlyProfit : {
        type : Number ,
        required : [true , 'monthly profit is required.']
    } ,
    depositRange : {
        type : [Number] ,
        required : [true , 'Deposit range is required.']
    } ,
    levelOneProfit : {
        type : Number ,
        default : null 
    } ,
    levelTwoProfit : {
        type : Number ,
        default : null 
    } ,
    levelThreeProfit : {
        type : Number ,
        default : null 
    } ,
    levelFourProfit : {
        type : Number ,
        default : null 
    } ,
    levelFiveProfit : {
        type : Number ,
        default : null 
    } ,
    levelSixProfit : {
        type : Number ,
        default : null 
    } ,
    levelSevenProfit : {
        type : Number ,
        default : null 
    } ,
    // Salary Levels
    sponserLevelOneProfit : {
        type : Number ,
        default : null
    } ,
    sponserLevelTwoProfit : {
        type : Number ,
        default : null
    } ,
    sponserLevelThreeProfit : {
        type : Number ,
        default : null
    } ,
    sponserLevelFourProfit : {
        type : Number ,
        default : null
    } ,
    sponserLevelFiveProfit : {
        type : Number ,
        default : null
    } ,
    sponserLevelSixProfit : {
        type : Number ,
        default : null
    } ,
    sponserLevelSevenProfit : {
        type : Number ,
        default : null
    } ,

    bullTrackLevelOneProfit : {
        type : Number ,
        required : [true , 'BullTrack Level one profit is required.']
    } ,
    bullTrackLevelTwoProfit : {
        type : Number ,
        required : [true , 'BullTrack Level two profit is required.']
    } ,
    bullTrackLevelThreeProfit : {
        type : Number ,
        required : [true , 'BullTrack Level three profit is required.']
    } ,
    bullTrackLevelFourProfit : {
        type : Number ,
        required : [true , 'BullTrack Level four profit is required.']
    } ,
    bullTrackLevelFiveProfit : {
        type : Number ,
        required : [true , 'BullTrack Level five profit is required.']
    } ,
    bullTrackLevelSixProfit : {
        type : Number ,
        required : [true , 'BullTrack Level six profit is required.']
    } ,
    bullTrackLevelSevenProfit : {
        type : Number ,
        required : [true , 'BullTrack Level Seven profit is required.']
    } ,
    maximumProfitLimit : {
        type : Number ,
        required : [true , 'Maximum profit limit is required.'] 
    } ,
    duration : {
        type : Number , 
        default : 6 , // duration will be in month i.e 6 means 6 months 
    } , 
    type : {
        type : Number ,
        default : 1 , // 1 = purchased package , 2 = special package i.e means assigned by admin 
    } ,
    packageFee : {
        type : Number ,
        required : [true , 'Package fee is required.']
    } , 
    highProfitValue : {
        type : Number ,
        required : [true , 'High Profit value is required.']
    }
} , { timestamps : true });

const Package = mongoose.model('Package' , packageSchema);
module.exports = Package;