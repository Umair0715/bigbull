const DepositHistory = require('../models/depositHistoryModel');
const handlerFactory = require('./factories/handlerFactory');

exports.getMyDepositHistory = handlerFactory.getMy(DepositHistory , 'user package');