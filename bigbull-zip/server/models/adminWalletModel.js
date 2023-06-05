const mongoose = require('mongoose');

const adminWalletSchema = new mongoose.Schema({
    totalBalance : {
        type : Number ,
        default : 0 
    } , 
    admin : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'Admin' ,
        required : [true , 'Admin is required.']
    }
} , { timestamps : true });

const AdminWallet = mongoose.model('AdminWallet' , adminWalletSchema);
module.exports = AdminWallet;