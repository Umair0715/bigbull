const BullTrack = require('../models/bullTrackModel');
const BullTrackWallet = require('../models/bullTrackWalletModel');
const User = require('../models/userModel');
const Settings = require('../models/settingsModel');
const BullTrackWalletHistory = require('../models/bullTrackWalletHistory');
const getReferrer = require('../utils/getReferrer');
const checkLimitAddProfit = require('../utils/checkLimitAddProfit');

const sendBullTrackBonus = async () => {
    console.log('running');
    const settings = await Settings.findOne();
    const bullTracks = await BullTrack.find({
        status : 'completed' ,
    });

    for (let bullTrack of bullTracks){
        console.log('bullTrack' , bullTrack);
        const user = await User.findById(bullTrack.user)
        .populate({
            path : 'activePackage' ,
            populate : {
                path : 'package'
            }
        });
        const bullTrackWallet = await BullTrackWallet.findOne({ user : user._id });
        const bullTrackBonus = (user.activePackage.depositAmount / 100) * settings.bullTrackBonus;

        const result = await checkLimitAddProfit(user , bullTrackBonus , bullTrackWallet);
        if(result.added){
            BullTrackWalletHistory.create({
                user : user._id ,
                amount : result.amount ,
                bullTrack : bullTrack._id ,
                description : 'BullTrack Profit'
            });
        }
        bullTrack.isActive = false;
        bullTrack.status = 'finished';
        bullTrack.isExpired = true;
        await bullTrack.save();
       
        if(user.referrer){
            console.log('user have referrer');
            sendBonusToTeam(user , user.activePackage.depositAmount);
        }
        continue;
    }
}



// send team bonus

const getProfitLevel = (level) => {
    switch (level) {
        case 1:
            return 'bullTrackLevelOneProfit';
        case 2:
            return 'bullTrackLevelTwoProfit';
        case 3:
            return 'bullTrackLevelThreeProfit';
        case 4:
            return 'bullTrackLevelFourProfit';
        case 5:
            return 'bullTrackLevelFiveProfit';
        case 6:
            return 'bullTrackLevelSixProfit';
        case 7:
            return 'bullTrackLevelSevenProfit';
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
        const referrerBullTrackWallet = await BullTrackWallet.findOne({ user: referrer._id });
        const result = await checkLimitAddProfit(referrer , referrerProfit , referrerBullTrackWallet);
        if(result.added){
            BullTrackWalletHistory.create({
                user : referrer._id ,
                amount : result.amount ,
                type : 2 ,
                description : `BullTrack development profit from ${from?.username}`
            });
        }
        
    }
    if(!referrer.referrer){
        return;
    }
    const nextReferrer = await getReferrer(referrer)
    return sendBonusToReferrer(nextReferrer, depositAmount, level + 1, from);
};
  
async function sendBonusToTeam (user, depositAmount) {
    const levelOneReferrer = await getReferrer(user);
    await sendBonusToReferrer(levelOneReferrer, depositAmount, 1, user );
}

module.exports = sendBullTrackBonus;