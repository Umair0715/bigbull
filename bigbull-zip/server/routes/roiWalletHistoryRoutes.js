const router = require('express').Router();
const { getAllRoiWalletHistories, getMyRoiWalletHistories, getSingleUserRoiWalletHistories } = require('../controllers/roiWalletHistoryController');
const { protect } = require('../middlewares/protect');
const Admin = require('../models/adminModel');
const User = require('../models/userModel');

router.route('/')
    .get(getAllRoiWalletHistories)

router.route('/my')
    .get(protect(User) , getMyRoiWalletHistories)

router.get('/user/:id' , protect(Admin) , getSingleUserRoiWalletHistories)


module.exports = router;