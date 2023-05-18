const { createSubscriptionByCashWallet , getAllSubscriptions, getMySubscriptions, createSpecialPackageSubscription, removeSpecialPackageFromUser } = require('../controllers/subscriptionController');
const { protect } = require('../middlewares/protect');
const User = require('../models/userModel');
const router = require('express').Router();
const Admin = require('../models/adminModel');

router.get('/my' , protect(User) , getMySubscriptions);

router.route('/')
    .post(protect(User) , createSubscriptionByCashWallet)
    .get(getAllSubscriptions)

router.post('/special-package' , protect(Admin) , createSpecialPackageSubscription )

router.post('/remove-special-package-from-user' , protect(Admin) , removeSpecialPackageFromUser)

module.exports = router;