const handlerFactory = require('./factories/handlerFactory');
const AchievedRank = require('../models/achievedRanksModel');

exports.getAllAchievedRanks = handlerFactory.getAll(AchievedRank);
exports.getSingleUserAchievedRanks = handlerFactory.getSpecific(AchievedRank);
exports.getMyAchievedRanks = handlerFactory.getMy(AchievedRank);