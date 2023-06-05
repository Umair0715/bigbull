const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    name : {
        type : String ,
        required : [true , 'name is required.']
    } ,
    username : {
        type : String ,
        required : [true , 'username is required.'] ,
        unique : true 
    } ,
    email : {
        type : String ,
        required : [true , 'Email is required.']
    } ,
    password : {
        type : String ,
        required : [true , 'Password is required.']
    } , 
    wallet : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'AdminWallet' ,
        default : null 
    } , 
    isSuperAdmin : {
        type : Boolean ,
        default : false ,
    }
} , { timestamps : true });

adminSchema.pre('save' , async function(next) {
    if(!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password , 10);
    next();
});

adminSchema.methods.comparePassword = async function (givenPassword) {
    return await bcrypt.compare(givenPassword , this.password)
}

adminSchema.pre(/^find/ , function(next) {
    this.populate(['wallet']);
    next();
});

const Admin = mongoose.model('Admin' , adminSchema);
module.exports = Admin;