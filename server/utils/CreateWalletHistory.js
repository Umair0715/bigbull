const BullTrackWalletHistory = require('../models/bullTrackWalletHistory');
const RoiWalletHistory = require('../models/roiWalletHistoryModel');
const TeamWalletHistory = require('../models/teamWalletHistoryModel');
const Transaction = require('../models/transactionModel');


const createWalletHistory = (type , user , wallet , amount , desc) => {
    switch (type) {
        case 1:
            RoiWalletHistory.create({
                user : user._id ,
                wallet ,
                ROI : amount , 
                description : desc 
            });
            return;
        case 2:
            return TeamWalletHistory.create({
                from : user._id ,
                to : user._id ,
                wallet ,
                amount , 
                description : desc ,
                type : 4 
            });
        case 3: 
            return BullTrackWalletHistory.create({
                user : user._id ,
                amount , 
                description : desc ,
                type : 4 
            });
        default: 
            return;
    }
}

module.exports = createWalletHistory;