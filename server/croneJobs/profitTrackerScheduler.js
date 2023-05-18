const Subscription = require('../models/subscriptionModel');
const User = require('../models/userModel');
const moment = require('moment');

const profitTracker = async () => {
    console.log('tracker running')
    const users = await User.find()
    .populate({
        path : 'activePackage' ,
        populate : {
            path : 'package'
        }
    });

    for(let user of users){
        if(!user.activePackage){
            continue;
        }

        const maxProfitLimit = user.activePackage.depositAmount * user.activePackage.package.maximumProfitLimit;
   
        if(user.totalProfit >= maxProfitLimit) {
            console.log('inner running');
            const subscription = await Subscription.findOne({ user : user._id , isActive : true , expireDate : { $gt : Date.now() }});
            subscription.isActive = false;
            await subscription.save();
            user.activePackage = null;
            user.isPackageDeactivated = true;
            user.packageDeactivatedAt = new Date();
            user.packageReactivationExpire = moment().add(3 , 'days').toDate()
            await user.save();
        }
    }
}

module.exports = profitTracker;