const Subscription = require("../models/subscriptionModel");
const TeamWalletHistory = require("../models/teamWalletHistoryModel");
const TeamWallet = require("../models/teamWalletModel");
const checkLimitAddProfit = require("./checkLimitAddProfit");
const getReferrer = require("./getReferrer");

const createTeamWalletTransaction = async (to , toWallet , from , amount , teamLevel ) => {
    await TeamWalletHistory.create({
        from : from._id ,
        fromUsername : from?.username ,
        to : to._id ,
        wallet : toWallet._id ,
        amount ,
        teamLevel ,
        description : `Your team member ${from.name} purchased package.` ,
    });
}

const getProfitLevel = (level) => {
    switch (level) {
        case 1:
            return 'levelOneProfit';
        case 2:
            return 'levelTwoProfit';
        case 3:
            return 'levelThreeProfit';
        case 4:
            return 'levelFourProfit';
        case 5:
            return 'levelFiveProfit';
        case 6:
            return 'levelSixProfit';
        case 7:
            return 'levelSevenProfit';
        default:
            break;
    }
}

const sendBonusToReferrer = async (referrer, depositAmount, level, from) => {
    if (level > 7) {
        return;
    }
    const activePackage = referrer.activePackage;
    
    if (!activePackage) {
        if(referrer.referrer){
            const nextReferrer = await getReferrer(referrer)
            return sendBonusToReferrer(nextReferrer, depositAmount, level + 1, from);
        }else{
            return;
        }
    }
  
    const levelProfit = activePackage.package[getProfitLevel(level)];
    if(referrer.isActive){
        const referrerProfit = (depositAmount / 100) * levelProfit;
        const referrerTeamWallet = await TeamWallet.findOne({ user: referrer._id });
      
        // MAX PROFIT CHECK
        const result = await checkLimitAddProfit(referrer , referrerProfit , referrerTeamWallet);
        if(result.added){
            createTeamWalletTransaction(referrer, referrerTeamWallet, from, result.amount , level);
        }
    }
    if(!referrer.referrer){
        return;
    }
    const nextReferrer = await getReferrer(referrer)
    return sendBonusToReferrer(nextReferrer, depositAmount, level + 1, from);
};
  
const sendTeamBonus = async (user, depositAmount) => {
    const levelOneReferrer = await getReferrer(user);
    await sendBonusToReferrer(levelOneReferrer, depositAmount, 1, user);
}

module.exports = sendTeamBonus;
