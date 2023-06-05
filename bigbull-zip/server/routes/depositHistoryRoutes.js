const { getMyDepositHistory } = require('../controllers/depositHistoryController');
const { protect } = require('../middlewares/protect');
const User = require('../models/userModel');
const router = require('express').Router();

router.get('/my' , protect(User) , getMyDepositHistory)
    
module.exports = router;