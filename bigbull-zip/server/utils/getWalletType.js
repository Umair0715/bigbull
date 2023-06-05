const CashWallet = require('../models/cashWalletModel');
const BullTrackWallet = require('../models/bullTrackWalletModel');
const TeamWallet = require('../models/teamWalletModel');
const ROIWallet = require('../models/ROIWalletModel');


exports.getWalletType = (type) => {
    switch (type) {
        case 1:
            return 'ROIWallet';
        case 2:
            return 'TeamWallet';
        case 3: 
            return 'BullTrackWallet';
        case 4:
            return 'CashWallet';
        default: 
            return 'CashWallet'
    }
}

exports.getWalletTypeModel = (type) => {
    switch (type) {
        case 1:
            return ROIWallet;
        case 2:
            return TeamWallet;
        case 3: 
            return BullTrackWallet;
        case 4:
            return CashWallet;
        default: 
            return CashWallet
    }
}

exports.getWalletName = (type) => {
    switch (type) {
        case 1:
            return 'Roi Wallet';
        case 2:
            return 'Team Wallet';
        case 3: 
            return 'Bull Track Wallet';
        case 4:
            return 'Cash Wallet';
        default: 
            return 'Cash Wallet'
    }
}