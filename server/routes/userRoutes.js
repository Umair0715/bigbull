const { register , login , getProfile , logout , getUserWallets, searchUser, getUsers , getSponserHistory, updateProfile, updatePassword, getSingleUser , updateUser, getUserRankHistory, getPromotedUsers, resendVerificationEmail, verifyEmail } = require('../controllers/userController');
const { protect } = require('../middlewares/protect');
const User = require('../models/userModel');
const router = require('express').Router();
const Admin = require('../models/adminModel');


router.post('/register' , register);
router.post('/login' , login);
router.route('/profile')
    .get(protect(User) , getProfile)
    .put(protect(User) , updateProfile)
router.get('/logout' , logout);
router.get('/wallets' , protect(User) , getUserWallets);
router.get('/search' , searchUser)
router.get('/all' , getUsers)
router.get('/sponser-history' , protect(User) , getSponserHistory);
router.put('/update-password' , protect(User) , updatePassword)
router.get('/details/:userId' , getSingleUser)
router.put('/update/:userId' , protect(Admin) , updateUser )
router.get('/ranks-history' , protect(User) , getUserRankHistory)
router.get('/promoted-users' , protect(Admin) , getPromotedUsers);
router.post('/resend-verification-email' , resendVerificationEmail)
router.post('/verify-email/:token' , verifyEmail)

module.exports = router;