const router = require('express').Router();
const { getAllBullTrackWalletHistories, getMyBullTrackWalletHistories, getSingleUserBullTrackWalletHistories } = require('../controllers/bullTrackWalletHistoryController');
const { protect } = require('../middlewares/protect');
const Admin = require('../models/adminModel');
const User = require('../models/userModel');

router.route('/')
    .get(getAllBullTrackWalletHistories)

router.route('/my')
    .get(protect(User) , getMyBullTrackWalletHistories)

router.get('/user/:id' , protect(Admin) , getSingleUserBullTrackWalletHistories)


module.exports = router;