const Subscription = require("../models/subscriptionModel");
const moment = require('moment');

const checkLimitAddProfit = async (user , currentProfit , wallet) => {
    const userMaxProfitLimit = user.activePackage.depositAmount * user.activePackage.package.maximumProfitLimit;

    if(user.activePackageProfit >= userMaxProfitLimit){
        return { amount : 0 , added : false }
    }
       
    const afterTotalBalance = user.activePackageProfit + currentProfit;
    if(afterTotalBalance >= userMaxProfitLimit){
        const extraProfitAmount = afterTotalBalance - userMaxProfitLimit; // i.e  (2450 + 250) = 2700 - 2500 = 200  
        const profitToAdd = (afterTotalBalance - extraProfitAmount) - user.activePackageProfit ;
        wallet.totalBallance += profitToAdd; // i.e 2700 - 200 = 2500 - 2450 = 50
        await wallet.save();

        // disable subscription
        const subscription = await Subscription.findOne({ user : user._id , isActive : true , expireDate : { $gt : Date.now() }});
        subscription.isActive = false;
        await subscription.save();

        // disable package
        user.activePackage = null;
        user.isPackageDeactivated = true;
        user.packageDeactivatedAt = new Date();
        user.activePackageProfit = 0;
        user.totalProfit += profitToAdd;
        user.packageReactivationExpire = moment().add(3 , 'days').toDate()
        await user.save();
        return { amount : profitToAdd , added : true }
    }else {
        wallet.totalBallance += currentProfit;
        user.totalProfit += currentProfit;
        user.activePackageProfit += currentProfit;
        await user.save();
        await wallet.save();
        return { amount : currentProfit , added : true }
    }
}

module.exports = checkLimitAddProfit;