const User = require('../models/userModel');

const getReferrer = async (user) => {
    return User.findOne({ referralCode : user.referrer })
    .populate({
        path : 'activePackage',
        populate : {
            path : 'package' 
        }
    });
}

module.exports = getReferrer;