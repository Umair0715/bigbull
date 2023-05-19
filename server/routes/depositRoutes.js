const { createDepositRequest, getAllDepositRequests, getSingleUserDepositRequests, getMyDepositRequets, updateDepositRequest } = require('../controllers/depositController');
const { protect } = require('../middlewares/protect');
const User = require('../models/userModel');
const Admin = require('../models/adminModel');
const router = require('express').Router();

router.route('/')
    .post(protect(User) , createDepositRequest)
    .get(getAllDepositRequests)

router.get('/user/:id' , getSingleUserDepositRequests);
router.get('/my' , protect(User) , getMyDepositRequets);

router.route('/:id')
    .put(protect(Admin) , updateDepositRequest);

module.exports = router;