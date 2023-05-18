const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    bullTrackBonus : {
        type : Number , 
        default : 24 
    } ,
    bullTrackPeriod : {
        type : Number ,
        default : 10 
    } ,
    bullTrackThreshold : {
        type : Number ,
        default : 250 
    } , 
    minimumWithdraw : {
        type : Number ,
        default : 50 
    } ,
    minimumTransfer : {
        type : Number ,
        default : 30 
    } ,
    platformFee : {
        type : Number ,
        default : 2.5
    }

} , { timestamps : true });

const Setting = mongoose.model('Setting' , settingsSchema);
module.exports = Setting;