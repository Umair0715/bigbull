const mongoose = require('mongoose');


const AchievedRanksSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User' ,
        required : [true , 'User is required.']
    } ,
    rank : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'Rank' , 
        required : [true , 'Rank is required.']
    } , 
    rankName : {
        type : String ,
        default : null 
    },
} , { timestamps : true });

AchievedRanksSchema.pre(/^find/ , function(next) {
    this.populate([
        {
            path : 'user' ,
            select : 'username activePackage activePackageType'
        } ,
        {
            path : 'rank'
        }
    ]);
    next();
})

const AchievedRank = mongoose.model('AchievedRank' , AchievedRanksSchema);
module.exports = AchievedRank;