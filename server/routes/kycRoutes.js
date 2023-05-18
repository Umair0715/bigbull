const { createKyc, getMyKyc, updateWalletAddress, deleteKyc, getUserKyc, getAllKyc, updateKyc, getSingleKyc } = require('../controllers/kycController');
const { protect } = require('../middlewares/protect');
const User = require('../models/userModel');
const router = require('express').Router();
const Admin = require('../models/adminModel');


router.route('/')
    .post(protect(User) , createKyc)
    .get(protect(Admin) , getAllKyc)

router.put('/update/:id' , protect(Admin) , updateKyc);
    
router.get('/my' , protect(User) , getMyKyc)

router.route('/:kycId')
    .put(protect(User) , updateWalletAddress)
    .delete(deleteKyc)
    .get(protect(Admin) , getSingleKyc)

router.get('/user/:userId' , getUserKyc);


module.exports = router;